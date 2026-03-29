const pool = require("./pool");

async function upsertItemMetadata(client, item) {
  const query = `
    INSERT INTO items (
      market_hash_name,
      item_type,
      rarity,
      rarity_rank,
      weapon,
      exterior,
      image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (market_hash_name)
    DO UPDATE SET
      item_type = EXCLUDED.item_type,
      rarity = EXCLUDED.rarity,
      rarity_rank = EXCLUDED.rarity_rank,
      weapon = EXCLUDED.weapon,
      exterior = EXCLUDED.exterior,
      image_url = EXCLUDED.image_url
    RETURNING id, market_hash_name;
  `;

  const values = [
    item.market_hash_name,
    item.item_type,
    item.rarity,
    item.rarity_rank,
    item.weapon,
    item.exterior,
    item.image_url,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
}

async function upsertItemLatest(client, itemId, item) {
  const query = `
    INSERT INTO item_latest (
      item_id,
      as_of,
      min_price,
      suggested_price,
      quantity,
      raw,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (item_id)
    DO UPDATE SET
      as_of = EXCLUDED.as_of,
      min_price = EXCLUDED.min_price,
      suggested_price = EXCLUDED.suggested_price,
      quantity = EXCLUDED.quantity,
      raw = EXCLUDED.raw,
      updated_at = NOW();
  `;

  const values = [
    itemId,
    item.as_of,
    item.min_price,
    item.suggested_price,
    item.quantity,
    JSON.stringify(item.raw),
  ];

  await client.query(query, values);
}

async function insertItemHistory(client, itemId, item) {
  const query = `
    INSERT INTO item_price_history (
      item_id,
      as_of,
      min_price,
      suggested_price,
      quantity,
      raw
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (item_id, as_of)
    DO NOTHING;
  `;

  const values = [
    itemId,
    item.as_of,
    item.min_price,
    item.suggested_price,
    item.quantity,
    JSON.stringify(item.raw),
  ];

  await client.query(query, values);
}

module.exports = {
  pool,
  upsertItemMetadata,
  upsertItemLatest,
  insertItemHistory,
};