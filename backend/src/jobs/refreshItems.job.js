const { fetchItemsFromSkinport } = require("../services/skinport.service");
const itemsCache = require("../cache/itemsCache");
const {
  pool,
  upsertItemMetadata,
  upsertItemLatest,
  insertItemHistory,
} = require("../db/items.repository");

let refreshInProgress = false;

function dedupeByMarketHashName(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.market_hash_name, item);
  }
  return [...map.values()];
}

async function refreshItems() {
  if (refreshInProgress) {
    console.log("[refreshItems] skipped: refresh already running");
    return;
  }

  refreshInProgress = true;
  console.log("[refreshItems] started");

  try {
    console.log("[refreshItems] fetching from Skinport...");
    const fetchedItems = await fetchItemsFromSkinport();
    console.log(`[refreshItems] fetched ${fetchedItems.length} raw items`);

    const items = dedupeByMarketHashName(fetchedItems);
    console.log(`[refreshItems] deduped to ${items.length} unique items`);

    console.log("[refreshItems] connecting to Postgres...");
    const client = await pool.connect();
    console.log("[refreshItems] connected to Postgres");

    try {
      await client.query("BEGIN");
      console.log("[refreshItems] transaction started");

      for (const item of items) {
        const itemRow = await upsertItemMetadata(client, item);
        await upsertItemLatest(client, itemRow.id, item);
        await insertItemHistory(client, itemRow.id, item);
      }

      await client.query("COMMIT");
      console.log("[refreshItems] transaction committed");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("[refreshItems] transaction rolled back:", err.message);
      throw err;
    } finally {
      client.release();
      console.log("[refreshItems] Postgres client released");
    }

    itemsCache.setItems(items);

    console.log(
      `[refreshItems] OK: wrote ${items.length} unique items to Postgres and cached them @ ${itemsCache.getLastUpdated().toISOString()}`
    );
  } catch (err) {
    console.error("[refreshItems] FAILED:", err.message);
  } finally {
    refreshInProgress = false;
    console.log("[refreshItems] finished");
  }
}

module.exports = { refreshItems };