const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/v1/portfolio
 * Get logged-in user's virtual portfolio
 */
router.get("/portfolio", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        i.id AS item_id,
        i.market_hash_name,
        i.image_url,
        p.quantity,
        p.purchase_price,
        l.min_price AS current_price,
        l.suggested_price,
        (p.quantity * l.min_price) AS current_value,
        CASE
          WHEN p.purchase_price IS NULL THEN NULL
          ELSE (p.quantity * (l.min_price - p.purchase_price))
        END AS profit_loss
      FROM portfolio p
      JOIN items i ON i.id = p.item_id
      JOIN item_latest l ON l.item_id = i.id
      WHERE p.user_id = $1
      ORDER BY current_value DESC NULLS LAST
      `,
      [userId]
    );

    const items = result.rows.map((row) => ({
      item_id: Number(row.item_id),
      market_hash_name: row.market_hash_name,
      image_url: row.image_url,
      quantity: Number(row.quantity),
      purchase_price:
        row.purchase_price === null ? null : Number(row.purchase_price),
      current_price:
        row.current_price === null ? null : Number(row.current_price),
      suggested_price:
        row.suggested_price === null ? null : Number(row.suggested_price),
      current_value:
        row.current_value === null ? null : Number(row.current_value),
      profit_loss:
        row.profit_loss === null ? null : Number(row.profit_loss),
    }));

    const totalValue = items.reduce(
      (sum, item) => sum + (item.current_value || 0),
      0
    );

    const totalProfitLoss = items.reduce(
      (sum, item) => sum + (item.profit_loss || 0),
      0
    );

    res.json({
      totalItems: items.length,
      totalValue,
      totalProfitLoss,
      items,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/portfolio
 * Add/update item in portfolio
 */
router.post("/portfolio", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = Number(req.body.item_id);
    const quantity = Number(req.body.quantity || 1);
    const purchasePrice =
      req.body.purchase_price === undefined ||
      req.body.purchase_price === null ||
      req.body.purchase_price === ""
        ? null
        : Number(req.body.purchase_price);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "Valid item_id is required" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }

    if (purchasePrice !== null && Number.isNaN(purchasePrice)) {
      return res.status(400).json({ error: "purchase_price must be a number" });
    }

    const itemCheck = await pool.query(
      `SELECT id FROM items WHERE id = $1`,
      [itemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    await pool.query(
      `
      INSERT INTO portfolio (user_id, item_id, quantity, purchase_price, updated_at)
      VALUES ($1, $2, $3, $4, now())
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET
        quantity = EXCLUDED.quantity,
        purchase_price = EXCLUDED.purchase_price,
        updated_at = now()
      `,
      [userId, itemId, quantity, purchasePrice]
    );

    res.status(201).json({ message: "Portfolio item saved" });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/portfolio/:itemId
 * Remove item from portfolio
 */
router.delete("/portfolio/:itemId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "Invalid itemId" });
    }

    await pool.query(
      `
      DELETE FROM portfolio
      WHERE user_id = $1 AND item_id = $2
      `,
      [userId, itemId]
    );

    res.json({ message: "Portfolio item removed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;