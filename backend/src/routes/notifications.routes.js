const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/v1/notifications
 */
router.get("/notifications", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT id, alert_id, message, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const notifications = result.rows.map((row) => ({
      id: Number(row.id),
      alert_id: row.alert_id === null ? null : Number(row.alert_id),
      message: row.message,
      is_read: row.is_read,
      created_at: row.created_at,
    }));

    res.json({
      total: notifications.length,
      unread: notifications.filter((n) => !n.is_read).length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 */
router.patch("/notifications/:id/read", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = Number(req.params.id);

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      return res.status(400).json({ error: "Invalid notification id" });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/notifications/:id
 */
router.delete("/notifications/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = Number(req.params.id);

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;