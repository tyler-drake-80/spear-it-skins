// src/routes/health.routes.js

const express = require("express");
const itemsCache = require("../cache/itemsCache");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        ok: true,
        cachedItems: itemsCache.getCount(),
        lastUpdated: itemsCache.getLastUpdated(),
    });
});

module.exports = router;
