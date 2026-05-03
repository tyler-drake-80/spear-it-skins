const { fetchItemsFromSkinport } = require("../services/skinport.service");
const itemsCache = require("../cache/itemsCache");
const {
  pool,
  bulkUpsertItemMetadata,
  getItemIdsByMarketHashNames,
  bulkUpsertItemLatest,
  bulkInsertItemHistory,
  deleteOldItemPriceHistory,
} = require("../db/items.repository");

let refreshInProgress = false;

const DEFAULT_PRICE_HISTORY_RETENTION_DAYS = 7;

function getPriceHistoryRetentionDays() {
  const rawValue = process.env.PRICE_HISTORY_RETENTION_DAYS;
  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  if (rawValue !== undefined) {
    console.warn(
      `[refreshItems] invalid PRICE_HISTORY_RETENTION_DAYS=${rawValue}; using ${DEFAULT_PRICE_HISTORY_RETENTION_DAYS}`
    );
  }

  return DEFAULT_PRICE_HISTORY_RETENTION_DAYS;
}

function dedupeByMarketHashName(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.market_hash_name, item);
  }
  return [...map.values()];
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function processChunk(client, chunk, chunkIndex, totalChunks) {
  await client.query("BEGIN");
  console.log(
    `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: transaction started (${chunk.length} items)`
  );

  try {
    await bulkUpsertItemMetadata(client, chunk);
    console.log(
      `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: metadata upserted`
    );

    const idMap = await getItemIdsByMarketHashNames(
      client,
      chunk.map((item) => item.market_hash_name)
    );

    const rows = chunk.map((item) => {
      const itemId = idMap.get(item.market_hash_name);

      if (!itemId) {
        throw new Error(
          `Missing item_id for market_hash_name: ${item.market_hash_name}`
        );
      }

      return {
        item_id: itemId,
        as_of: item.as_of,
        min_price: item.min_price,
        suggested_price: item.suggested_price,
        quantity: item.quantity,
        raw: item.raw ?? item,
      };
    });

    await bulkUpsertItemLatest(client, rows);
    console.log(
      `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: latest upserted`
    );

    await bulkInsertItemHistory(client, rows);
    console.log(
      `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: history inserted`
    );

    await client.query("COMMIT");
    console.log(
      `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: transaction committed`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      `[refreshItems] chunk ${chunkIndex + 1}/${totalChunks}: transaction rolled back`,
      err
    );
    throw err;
  }
}

async function refreshItems() {
  if (refreshInProgress) {
    console.log("[refreshItems] skipped: refresh already running");
    return;
  }

  refreshInProgress = true;
  console.log("[refreshItems] started");

  let client;

  try {
    console.log("[refreshItems] fetching from Skinport...");
    const fetchedItems = await fetchItemsFromSkinport();
    console.log(`[refreshItems] fetched ${fetchedItems.length} raw items`);

    const items = dedupeByMarketHashName(fetchedItems);
    console.log(`[refreshItems] deduped to ${items.length} unique items`);

    const chunks = chunkArray(items, 500);
    console.log(`[refreshItems] split into ${chunks.length} chunks`);

    console.log("[refreshItems] connecting to Postgres...");
    client = await pool.connect();
    console.log("[refreshItems] connected to Postgres");

    for (let i = 0; i < chunks.length; i++) {
      await processChunk(client, chunks[i], i, chunks.length);
    }

    itemsCache.setItems(items);

    console.log(
      `[refreshItems] OK: wrote ${items.length} unique items to Postgres and cached them @ ${itemsCache
        .getLastUpdated()
        .toISOString()}`
    );

    const retentionDays = getPriceHistoryRetentionDays();
    try {
      const deletedRows = await deleteOldItemPriceHistory(client, retentionDays);
      console.log(
        `[refreshItems] history cleanup complete: retentionDays=${retentionDays}, deletedRows=${deletedRows}`
      );
    } catch (cleanupErr) {
      console.error(
        `[refreshItems] history cleanup failed: retentionDays=${retentionDays}`,
        cleanupErr
      );
    }
  } catch (err) {
    console.error("[refreshItems] FAILED:", err);
  } finally {
    if (client) {
      client.release();
      console.log("[refreshItems] Postgres client released");
    }

    refreshInProgress = false;
    console.log("[refreshItems] finished");
  }
}

module.exports = { refreshItems };
