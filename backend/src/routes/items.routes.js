// src/routes/items.routes.js
//Exposes cached data for frontend consumption.
//Supports search + returns 'pages' to avoid sending full dataset.
const express = require("express");
const itemsCache = require("../cache/itemsCache");

const router = express.Router();

function parseWeapon(marketHashName) {
  if (!marketHashName) return null;

  const name = marketHashName.replace(/^StatTrak™\s+/, "");
  const parts = name.split(" | ");
  if (parts.length < 2) return null;

  return parts[0].trim();
}

function parseExterior(marketHashName) {
  if (!marketHashName) return null;

  const match = marketHashName.match(/\(([^)]+)\)\s*$/);
  return match ? match[1].trim() : null;
}

function isStatTrak(marketHashName) {
  return typeof marketHashName === "string" && marketHashName.startsWith("StatTrak™");
}

router.get("/items", (req, res) => {
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

  const weapon = (req.query.weapon || "").toString().trim().toLowerCase();
  const exterior = (req.query.exterior || "").toString().trim().toLowerCase();
  const st = (req.query.st || "").toString().trim().toLowerCase();
  const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

  let items = itemsCache.getItems();

  // search
  if (q) {
    items = items.filter((it) => {
      const name = (it.market_hash_name || "").toString().toLowerCase();
      return name.includes(q);
    });
  }

  if (weapon) {
  items = items.filter((it) => {
    const parsedWeapon = parseWeapon(it.market_hash_name || "");
    return parsedWeapon && parsedWeapon.toLowerCase() === weapon;
    });
  }

  if (exterior) {
  items = items.filter((it) => {
    const parsedExterior = parseExterior(it.market_hash_name || "");
    return parsedExterior && parsedExterior.toLowerCase() === exterior;
    });
  }

  if (st === "true") {
  items = items.filter((it) => isStatTrak(it.market_hash_name));
  } else if (st === "false") {
  items = items.filter((it) => !isStatTrak(it.market_hash_name));
  }

  if (minPrice !== null && !Number.isNaN(minPrice)) {
  items = items.filter((it) => it.min_price !== null && Number(it.min_price) >= minPrice);
  }

  if (maxPrice !== null && !Number.isNaN(maxPrice)) {
  items = items.filter((it) => it.min_price !== null && Number(it.min_price) <= maxPrice);
  }

  items = items.slice().sort((a, b) => {
  const ap = a.min_price == null ? Infinity : Number(a.min_price);
  const bp = b.min_price == null ? Infinity : Number(b.min_price);
  return ap - bp;
  });

  const total = items.length;

  // paginate + return ONLY what you want
  const page = items.slice(offset, offset + limit).map((it) => ({
  market_hash_name: it.market_hash_name,
  min_price: it.min_price,
  currency: it.currency || "USD",
  quantity: it.quantity ?? null,
  item_page: it.item_page || null,
  market_page: it.market_page || null,
  weapon: parseWeapon(it.market_hash_name || ""),
  exterior: parseExterior(it.market_hash_name || ""),
  st: isStatTrak(it.market_hash_name),
}));

  res.json({
    
  total,
  limit,
  offset,
  q: q || null,
  weapon: weapon || null,
  exterior: exterior || null,
  st: st || null,
  minPrice,
  maxPrice,
  sort: "price_asc",
  items: page,
  lastUpdated: itemsCache.getLastUpdated(),
  });
});

module.exports = router;
