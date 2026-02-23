// src/routes/health.routes.js

const express = require("express");
const db = require("../db");
const itemsCache = require("../cache/itemsCache");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        ok: true,
        cachedItems: itemsCache.getCount(),
        lastUpdated: itemsCache.getLastUpdated(),
    });
});

router.get("/db", async (req, res) => {
    if(!db.isEnabled()) {
        return res.json({ ok: true, dbEnabled: false });
    }

    try {
        await db.query("SELECT 1 AS ok");
        res.json({ ok: true, dbEnabled: true });
    } catch (e) {
        res.status(500).json({ ok: false, dbEnabled: true, error: e.message });
    }
});

module.exports = router;
