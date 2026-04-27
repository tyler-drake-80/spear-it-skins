const SKINPORT_ITEMS_URL =
  "https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1";
const { getPriceDisplay } = require("./priceDisplay.service");

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toInteger(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isInteger(num) ? num : null;
}

function getPriceValidationWarnings(item, minPrice, suggestedPrice, quantity) {
  const warnings = [];
  const priceDisplay = getPriceDisplay({
    min_price: minPrice,
    suggested_price: suggestedPrice,
    quantity,
  });

  if (minPrice !== null && minPrice < 0) {
    warnings.push("min_price_negative");
  }

  if (suggestedPrice !== null && suggestedPrice < 0) {
    warnings.push("suggested_price_negative");
  }

  if (minPrice !== null && suggestedPrice !== null && suggestedPrice > minPrice * 100) {
    warnings.push("suggested_price_much_higher_than_min_price");
  }

  if (priceDisplay.price_status === "min_price_outlier") {
    warnings.push("min_price_outlier");
  }

  if (item.quantity !== null && item.quantity !== undefined && toInteger(item.quantity) === null) {
    warnings.push("quantity_not_integer");
  }

  return warnings;
}

function parseExterior(marketHashName = "") {
  const match = marketHashName.match(/\(([^)]+)\)\s*$/);
  return match ? match[1].trim() : null;
}

function parseWeapon(marketHashName = "") {
  const name = marketHashName.replace(/^StatTrak™\s+/, "");
  const parts = name.split(" | ");
  return parts.length >= 2 ? parts[0].trim() : null;
}

function normalizeSkinportItem(it, asOf) {
  const marketHashName = (it.market_hash_name || "").trim();

  if (!marketHashName) {
    throw new Error("Missing market_hash_name");
  }

  const minPrice = toNumber(it.min_price);
  const suggestedPrice = toNumber(it.suggested_price);
  const quantity = toInteger(it.quantity);
  const imageUrl = it.image_url || it.image || it.icon_url || null;
  const priceValidationWarnings = getPriceValidationWarnings(
    it,
    minPrice,
    suggestedPrice,
    quantity
  );

  return {
    market_hash_name: marketHashName,
    item_type: it.item_type || it.type || null,
    rarity: it.rarity || null,
    rarity_rank: toInteger(it.rarity_rank),
    weapon: parseWeapon(marketHashName),
    exterior: parseExterior(marketHashName),
    image_url: imageUrl,

    as_of: asOf,
    min_price: minPrice,
    suggested_price: suggestedPrice,
    quantity,

    raw: {
      ...it,
      image_url: imageUrl,
      price_validation_warnings: priceValidationWarnings,
    },
  };
}

async function fetchItemsFromSkinport() {
  const res = await fetch(SKINPORT_ITEMS_URL, {
    headers: {
      "Accept-Encoding": "br",
    },
  });

  if (!res.ok) {
    throw new Error(`Skinport fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Skinport response not an array");
  }

  const asOf = new Date();

  return data.map((it) => normalizeSkinportItem(it, asOf));
}

module.exports = { fetchItemsFromSkinport };
