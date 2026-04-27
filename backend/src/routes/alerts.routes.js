const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/v1/alerts
 * Get logged-in user's price alerts
 */
router.get("/alerts", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.item_id,
        i.market_hash_name,
        i.image_url,
        a.target_price,
        a.direction,
        a.is_active,
        a.triggered_at,
        a.created_at,
        l.min_price AS current_price
      FROM price_alerts a
      JOIN items i ON i.id = a.item_id
      JOIN item_latest l ON l.item_id = i.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      `,
      [userId]
    );

    const alerts = result.rows.map((row) => ({
      id: Number(row.id),
      item_id: Number(row.item_id),
      market_hash_name: row.market_hash_name,
      image_url: row.image_url,
      target_price: Number(row.target_price),
      direction: row.direction,
      is_active: row.is_active,
      triggered_at: row.triggered_at,
      created_at: row.created_at,
      current_price: row.current_price === null ? null : Number(row.current_price),
    }));

    res.json({
      total: alerts.length,
      alerts,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/alerts
 * Create price alert
 */
router.post("/alerts", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = Number(req.body.item_id);
    const targetPrice = Number(req.body.target_price);
    const direction = (req.body.direction || "below").toString().toLowerCase();

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: "Valid item_id is required" });
    }

    if (Number.isNaN(targetPrice) || targetPrice <= 0) {
      return res.status(400).json({ error: "Valid target_price is required" });
    }

    if (!["below", "above"].includes(direction)) {
      return res.status(400).json({ error: "direction must be 'below' or 'above'" });
    }

    const itemCheck = await pool.query(
      `SELECT id FROM items WHERE id = $1`,
      [itemId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO price_alerts (
        user_id,
        item_id,
        target_price,
        direction
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, item_id, target_price, direction, is_active, triggered_at, created_at
      `,
      [userId, itemId, targetPrice, direction]
    );

    const alert = result.rows[0];

    res.status(201).json({
      alert: {
        id: Number(alert.id),
        item_id: Number(alert.item_id),
        target_price: Number(alert.target_price),
        direction: alert.direction,
        is_active: alert.is_active,
        triggered_at: alert.triggered_at,
        created_at: alert.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/alerts/:alertId
 * Update alert active status or target price
 */
router.patch("/alerts/:alertId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const alertId = Number(req.params.alertId);

    if (!Number.isInteger(alertId) || alertId <= 0) {
      return res.status(400).json({ error: "Invalid alertId" });
    }

    const fields = [];
    const values = [];
    let param = 1;

    if (req.body.target_price !== undefined) {
      const targetPrice = Number(req.body.target_price);

      if (Number.isNaN(targetPrice) || targetPrice <= 0) {
        return res.status(400).json({ error: "target_price must be positive" });
      }

      fields.push(`target_price = $${param++}`);
      values.push(targetPrice);
    }

    if (req.body.direction !== undefined) {
      const direction = req.body.direction.toString().toLowerCase();

      if (!["below", "above"].includes(direction)) {
        return res.status(400).json({ error: "direction must be 'below' or 'above'" });
      }

      fields.push(`direction = $${param++}`);
      values.push(direction);
    }

    if (req.body.is_active !== undefined) {
      fields.push(`is_active = $${param++}`);
      values.push(Boolean(req.body.is_active));
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    fields.push(`updated_at = now()`);

    values.push(userId);
    values.push(alertId);

    const result = await pool.query(
      `
      UPDATE price_alerts
      SET ${fields.join(", ")}
      WHERE user_id = $${param++}
        AND id = $${param++}
      RETURNING id, item_id, target_price, direction, is_active, triggered_at, created_at, updated_at
      `,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const alert = result.rows[0];

    res.json({
      alert: {
        id: Number(alert.id),
        item_id: Number(alert.item_id),
        target_price: Number(alert.target_price),
        direction: alert.direction,
        is_active: alert.is_active,
        triggered_at: alert.triggered_at,
        created_at: alert.created_at,
        updated_at: alert.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/alerts/:alertId
 * Delete alert
 */
router.delete("/alerts/:alertId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const alertId = Number(req.params.alertId);

    if (!Number.isInteger(alertId) || alertId <= 0) {
      return res.status(400).json({ error: "Invalid alertId" });
    }

    const result = await pool.query(
      `
      DELETE FROM price_alerts
      WHERE user_id = $1 AND id = $2
      RETURNING id
      `,
      [userId, alertId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json({ message: "Alert deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;