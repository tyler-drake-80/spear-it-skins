// src/routes/items.routes.js
//Exposes cached data for frontend consumption.
//Supports search + returns 'pages' to avoid sending full dataset.
const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/items", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    const weapon = (req.query.weapon || "").toString().trim();
    const exterior = (req.query.exterior || "").toString().trim();
    const st = (req.query.st || "").toString().trim().toLowerCase();
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;
    const rawStatus = (req.query.status || "active").toString().trim().toLowerCase();
    const status = ["active", "all", "stale"].includes(rawStatus) ? rawStatus : "active";

    const sort = (req.query.sort || "").toLowerCase();
    const filter = (req.query.filter || "").toLowerCase();

    let order = "ASC";
    if (sort === "desc" || filter === "descending") {
    order = "DESC";
    }

    const where = [];
    const values = [];
    let param = 1;

    if (q) {
      where.push(`i.market_hash_name ILIKE $${param++}`);
      values.push(`%${q}%`);
    }

    if (weapon) {
      where.push(`i.weapon ILIKE $${param++}`);
      values.push(weapon);
    }

    if (exterior) {
      where.push(`i.exterior ILIKE $${param++}`);
      values.push(exterior);
    }

    if (st === "true") {
      where.push(`i.market_hash_name LIKE 'StatTrak™%'`);
    } else if (st === "false") {
      where.push(`i.market_hash_name NOT LIKE 'StatTrak™%'`);
    }

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      where.push(`l.min_price IS NOT NULL AND l.min_price >= $${param++}`);
      values.push(minPrice);
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      where.push(`l.min_price IS NOT NULL AND l.min_price <= $${param++}`);
      values.push(maxPrice);
    }

    if (status === "active") {
      where.push(`latest_snapshot.item_id IS NOT NULL`);
    } else if (status === "stale") {
      where.push(`latest_snapshot.item_id IS NULL`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const baseFrom = `
      FROM items i
      JOIN item_latest l ON l.item_id = i.id
      CROSS JOIN (
        SELECT MAX(as_of) AS latest_as_of
        FROM item_price_history
      ) snapshot
      LEFT JOIN item_price_history latest_snapshot
        ON latest_snapshot.item_id = i.id
       AND latest_snapshot.as_of = snapshot.latest_as_of
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      ${baseFrom}
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        i.market_hash_name,
        i.weapon,
        i.exterior,
        i.image_url,
        l.min_price,
        l.suggested_price,
        l.quantity,
        l.as_of,
        (latest_snapshot.item_id IS NOT NULL) AS is_active
      ${baseFrom}
      ${whereClause}
      ORDER BY l.min_price ${order} NULLS LAST
      LIMIT $${param++}
      OFFSET $${param++}
    `;

    const countResult = await pool.query(countQuery, values);

    const dataValues = [...values, limit, offset];
    const dataResult = await pool.query(dataQuery, dataValues);

    const latestResult = await pool.query(`
      SELECT MAX(as_of) AS last_updated
      FROM item_price_history
    `);

    const items = dataResult.rows.map((row) => ({
      market_hash_name: row.market_hash_name,
      min_price: row.min_price === null ? null : Number(row.min_price),
      suggested_price: row.suggested_price === null ? null : Number(row.suggested_price),
      quantity: row.quantity,
      image_url: row.image_url,
      weapon: row.weapon,
      exterior: row.exterior,
      as_of: row.as_of,
      is_active: row.is_active,
      st:
        typeof row.market_hash_name === "string" &&
        row.market_hash_name.startsWith("StatTrak™"),
    }));

    res.json({
      total: countResult.rows[0].total,
      limit,
      offset,
      q: q || null,
      weapon: weapon || null,
      exterior: exterior || null,
      st: st || null,
      minPrice,
      maxPrice,
      status,
      sort: `price_${order.toLowerCase()}`,
      filter: filter || null,
      items,
      lastUpdated: latestResult.rows[0].last_updated,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
