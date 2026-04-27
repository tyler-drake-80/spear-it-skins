const express = require("express");
const pool = require("../db/pool");

const router = express.Router();
/**
 * GET /api/v1/items/:itemId/history
 * Returns price history for one item
 */
router.get("/items/:itemId/history", async (req, res, next) => {
  try {
    
    const itemId = Number(req.params.itemId);
    const limit = Math.max(
    1,
    Math.min(500, parseInt(req.query.limit, 10) || 100)
    );
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "Invalid itemId" });
    }

    const itemResult = await pool.query(
      `
      SELECT id, market_hash_name, image_url
      FROM items
      WHERE id = $1
      `,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const historyResult = await pool.query(
      `
      SELECT
        as_of,
        min_price,
        suggested_price,
        quantity
      FROM item_price_history
      WHERE item_id = $1
      ORDER BY as_of DESC
      LIMIT $2
      `,
      [itemId, limit]
    );

    const history = historyResult.rows.map((row) => ({
      as_of: row.as_of,
      min_price: row.min_price === null ? null : Number(row.min_price),
      suggested_price:
        row.suggested_price === null ? null : Number(row.suggested_price),
      quantity: row.quantity === null ? null : Number(row.quantity),
    }));

    res.json({
      item: {
        id: Number(itemResult.rows[0].id),
        market_hash_name: itemResult.rows[0].market_hash_name,
        image_url: itemResult.rows[0].image_url,
      },
      total: history.length,
      history,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;