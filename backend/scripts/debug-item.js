require("dotenv").config();

const pool = require("../src/db/pool");
const { getPriceDisplay } = require("../src/services/priceDisplay.service");

const search =
  process.argv.slice(2).join(" ").trim() ||
  "Sticker | FlyQuest (Holo) | Budapest 2025";
const searchTokens = search.split(/\s+/).filter(Boolean);

async function main() {
  const whereParts = searchTokens.map((_, index) => {
    return `i.market_hash_name ILIKE $${index + 1}`;
  });
  const searchValues = searchTokens.map((token) => `%${token}%`);

  const itemResult = await pool.query(
    `
      SELECT
        i.id,
        i.market_hash_name,
        i.item_type,
        i.rarity,
        i.weapon,
        i.exterior,
        i.image_url,
        l.as_of AS latest_as_of,
        l.min_price AS latest_min_price,
        l.suggested_price AS latest_suggested_price,
        l.quantity AS latest_quantity,
        l.raw AS latest_raw
      FROM items i
      LEFT JOIN item_latest l ON l.item_id = i.id
      ${whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : ""}
      ORDER BY i.market_hash_name
      LIMIT 25;
    `,
    searchValues
  );

  const ids = itemResult.rows.map((row) => row.id);

  let historyRows = [];
  if (ids.length > 0) {
    const historyResult = await pool.query(
      `
        SELECT
          h.item_id,
          i.market_hash_name,
          h.as_of,
          h.min_price,
          h.suggested_price,
          h.quantity,
          h.raw
        FROM item_price_history h
        JOIN items i ON i.id = h.item_id
        WHERE h.item_id = ANY($1::bigint[])
        ORDER BY h.as_of DESC
        LIMIT 50;
      `,
      [ids]
    );

    historyRows = historyResult.rows;
  }

  const items = itemResult.rows.map((row) => ({
    ...row,
    ...getPriceDisplay({
      min_price: row.latest_min_price,
      suggested_price: row.latest_suggested_price,
      quantity: row.latest_quantity,
    }),
  }));

  const recentHistory = historyRows.map((row) => ({
    ...row,
    ...getPriceDisplay(row),
  }));

  console.log(
    JSON.stringify(
      {
        search,
        item_count: itemResult.rowCount,
        items,
        recent_history: recentHistory,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
