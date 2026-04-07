const SKINPORT_ITEMS_URL =
  "https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1";

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

  return {
    market_hash_name: marketHashName,
    item_type: it.item_type || it.type || null,
    rarity: it.rarity || null,
    rarity_rank: toInteger(it.rarity_rank),
    weapon: parseWeapon(marketHashName),
    exterior: parseExterior(marketHashName),
    image_url: it.image_url || it.image || it.icon_url || null,

    as_of: asOf,
    min_price: toNumber(it.min_price),
    suggested_price: toNumber(it.suggested_price),
    quantity: toInteger(it.quantity),

    raw: {
      ...it,
      image_url: it.image_url || it.image || it.icon_url || null,
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