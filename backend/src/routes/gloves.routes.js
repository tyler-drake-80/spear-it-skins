// src/routes/gloves.routes.js

const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/gloves", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    const exterior = (req.query.exterior || "").toString().trim();
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

    const where = [];
    const values = [];
    let param = 1;

    // glove filter
    where.push(`i.market_hash_name LIKE '★ %Gloves | %'`);

    if (q) {
      where.push(`i.market_hash_name ILIKE $${param++}`);
      values.push(`%${q}%`);
    }

    if (exterior) {
      where.push(`i.exterior ILIKE $${param++}`);
      values.push(exterior);
    }

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      where.push(`l.min_price IS NOT NULL AND l.min_price >= $${param++}`);
      values.push(minPrice);
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      where.push(`l.min_price IS NOT NULL AND l.min_price <= $${param++}`);
      values.push(maxPrice);
    }

    const whereClause = `WHERE ${where.join(" AND ")}`;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM items i
      JOIN item_latest l ON l.item_id = i.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        i.market_hash_name,
        i.exterior,
        i.image_url,
        l.min_price,
        l.suggested_price,
        l.quantity
      FROM items i
      JOIN item_latest l ON l.item_id = i.id
      ${whereClause}
      ORDER BY l.min_price ASC NULLS LAST
      LIMIT $${param++}
      OFFSET $${param++}
    `;

    const countResult = await pool.query(countQuery, values);

    const dataValues = [...values, limit, offset];
    const dataResult = await pool.query(dataQuery, dataValues);

    const latestResult = await pool.query(`
      SELECT MAX(as_of) AS last_updated
      FROM item_latest
    `);

    const items = dataResult.rows.map((row) => ({
      market_hash_name: row.market_hash_name,
      min_price: row.min_price === null ? null : Number(row.min_price),
      suggested_price: row.suggested_price === null ? null : Number(row.suggested_price),
      quantity: row.quantity,
      image_url: row.image_url,
      exterior: row.exterior,
    }));

    res.json({
      total: countResult.rows[0].total,
      limit,
      offset,
      q: q || null,
      exterior: exterior || null,
      minPrice,
      maxPrice,
      sort: "price_asc",
      items,
      lastUpdated: latestResult.rows[0].last_updated,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;