// src/routes/items.routes.js
//Exposes cached data for frontend consumption.
//Supports search + returns 'pages' to avoid sending full dataset.
// src/routes/items.routes.js
const express = require("express");
const itemsCache = require("../cache/itemsCache");

const router = express.Router();

router.get("/items", (req, res) => {
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

  let items = itemsCache.getItems();

  // search
  if (q) {
    items = items.filter((it) => {
      const name = (it.market_hash_name || "").toString().toLowerCase();
      return name.includes(q);
    });
  }

  items = items.slice().sort((a, b) => {
  const ap = a.min_price == null ? Infinity : Number(a.min_price);
  const bp = b.min_price == null ? Infinity : Number(b.min_price);
  return ap - bp;
  });

  const total = items.length;

  // paginate + return ONLY what you want
  const page = items.slice(offset, offset + limit).map((it) => ({
    market_hash_name: it.market_hash_name,  // includes wear + StatTrak
    min_price: it.min_price,                // lowest current price
    currency: it.currency || "USD",
    quantity: it.quantity ?? null,
  }));

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
