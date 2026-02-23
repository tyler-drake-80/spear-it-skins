// src/routes/items.routes.js
//Exposes cached data for frontend consumption.
//Supports search + returns 'pages' to avoid sending full dataset.
const express = require("express");
const itemsCache = require("../cache/itemsCache");

const router = express.Router();

router.get("/items", (req, res) => {
    const q = (req.query.q || "").toString().trim().toLowerCase();
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    let items = itemsCache.getItems();

    if(q) {
        items = items.filter((it) => {
            const name = (it.market_hash_name || "").toString().toLowerCase();
            return name.includes(q);
        });
    }

    const total = items.length;
    const page = items.slice(offset, offset + limit);


    res.json({
        total,
        limit,
        offset, 
        q: q || null,
        items: page,
        lastUpdated: itemsCache.getLastUpdated(),
    });
});

module.exports = router;
