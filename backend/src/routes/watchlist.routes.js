const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/v1/watchlist
 * Get all items in the logged-in user's watchlist
 */
router.get("/watchlist", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        i.id AS item_id,
        i.market_hash_name,
        i.image_url,
        l.min_price,
        l.suggested_price,
        l.quantity
      FROM watchlist w
      JOIN items i ON i.id = w.item_id
      JOIN item_latest l ON l.item_id = i.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
      `,
      [userId]
    );

    const items = result.rows.map((row) => ({
      item_id: Number(row.item_id),
      market_hash_name: row.market_hash_name,
      image_url: row.image_url,
      min_price: row.min_price === null ? null : Number(row.min_price),
      suggested_price: row.suggested_price === null ? null : Number(row.suggested_price),
      quantity: row.quantity === null ? null : Number(row.quantity),
    }));

    res.json({
      total: result.rows.length,
      items,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/watchlist
 * Add an item to watchlist
 */
router.post("/watchlist", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.body.item_id;

    if (!itemId) {
      return res.status(400).json({ error: "item_id is required" });
    }

    await pool.query(
      `
      INSERT INTO watchlist (user_id, item_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [userId, itemId]
    );

    res.status(201).json({ message: "Item added to watchlist" });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/watchlist/:itemId
 * Remove item from watchlist
 */
router.delete("/watchlist/:itemId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    await pool.query(
      `
      DELETE FROM watchlist
      WHERE user_id = $1 AND item_id = $2
      `,
      [userId, itemId]
    );

    res.json({ message: "Item removed from watchlist" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;