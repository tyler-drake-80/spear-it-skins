const pool = require("./pool");

async function bulkUpsertItemMetadata(client, items) {
  const payload = items.map((item) => ({
    market_hash_name: item.market_hash_name,
    item_type: item.item_type ?? null,
    rarity: item.rarity ?? null,
    rarity_rank: item.rarity_rank ?? null,
    weapon: item.weapon ?? null,
    exterior: item.exterior ?? null,
    image_url: item.image_url ?? null,
  }));

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
    SELECT
      x.market_hash_name,
      x.item_type,
      x.rarity,
      x.rarity_rank,
      x.weapon,
      x.exterior,
      x.image_url
    FROM jsonb_to_recordset($1::jsonb) AS x(
      market_hash_name text,
      item_type text,
      rarity text,
      rarity_rank integer,
      weapon text,
      exterior text,
      image_url text
    )
    ON CONFLICT (market_hash_name)
    DO UPDATE SET
      item_type = EXCLUDED.item_type,
      rarity = EXCLUDED.rarity,
      rarity_rank = EXCLUDED.rarity_rank,
      weapon = EXCLUDED.weapon,
      exterior = EXCLUDED.exterior,
      image_url = COALESCE(EXCLUDED.image_url, items.image_url);
  `;

  await client.query(query, [JSON.stringify(payload)]);
}

async function getItemIdsByMarketHashNames(client, marketHashNames) {
  const query = `
    SELECT id, market_hash_name
    FROM items
    WHERE market_hash_name = ANY($1::text[]);
  `;

  const result = await client.query(query, [marketHashNames]);
  return new Map(result.rows.map((row) => [row.market_hash_name, row.id]));
}

async function bulkUpsertItemLatest(client, rows) {
  const payload = rows.map((row) => ({
    item_id: row.item_id,
    as_of: row.as_of,
    min_price: row.min_price ?? null,
    suggested_price: row.suggested_price ?? null,
    quantity: row.quantity ?? null,
    raw: row.raw ?? null,
  }));

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
    SELECT
      x.item_id,
      x.as_of,
      x.min_price,
      x.suggested_price,
      x.quantity,
      x.raw,
      NOW()
    FROM jsonb_to_recordset($1::jsonb) AS x(
      item_id bigint,
      as_of timestamptz,
      min_price numeric,
      suggested_price numeric,
      quantity integer,
      raw jsonb
    )
    ON CONFLICT (item_id)
    DO UPDATE SET
      as_of = EXCLUDED.as_of,
      min_price = EXCLUDED.min_price,
      suggested_price = EXCLUDED.suggested_price,
      quantity = EXCLUDED.quantity,
      raw = EXCLUDED.raw,
      updated_at = NOW();
  `;

  await client.query(query, [JSON.stringify(payload)]);
}

async function bulkInsertItemHistory(client, rows) {
  const payload = rows.map((row) => ({
    item_id: row.item_id,
    as_of: row.as_of,
    min_price: row.min_price ?? null,
    suggested_price: row.suggested_price ?? null,
    quantity: row.quantity ?? null,
    raw: row.raw ?? null,
  }));

  const query = `
    INSERT INTO item_price_history (
      item_id,
      as_of,
      min_price,
      suggested_price,
      quantity,
      raw
    )
    SELECT
      x.item_id,
      x.as_of,
      x.min_price,
      x.suggested_price,
      x.quantity,
      x.raw
    FROM jsonb_to_recordset($1::jsonb) AS x(
      item_id bigint,
      as_of timestamptz,
      min_price numeric,
      suggested_price numeric,
      quantity integer,
      raw jsonb
    )
    ON CONFLICT (item_id, as_of)
    DO NOTHING;
  `;

  await client.query(query, [JSON.stringify(payload)]);
}

async function deleteOldItemPriceHistory(client, retentionDays) {
  const query = `
    DELETE FROM item_price_history
    WHERE as_of < NOW() - ($1::int * INTERVAL '1 day');
  `;

  const result = await client.query(query, [retentionDays]);
  return result.rowCount;
}

module.exports = {
  pool,
  bulkUpsertItemMetadata,
  getItemIdsByMarketHashNames,
  bulkUpsertItemLatest,
  bulkInsertItemHistory,
  deleteOldItemPriceHistory,
};
