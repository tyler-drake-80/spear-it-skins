// src/services/skinport.service.js
// Skinport client wrapper.
// Returns normalized array of items from Skinport.
// All Skinport-specific behavior should live here so routes / jobs stay clean.

const SKINPORT_ITEMS_URL =
  "https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1";

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

  // Normalize image_url so routes don't have to guess field names
  return data.map((it) => ({
    ...it,
    image_url: it.image_url || it.image || it.icon_url || null,
  }));
}

module.exports = { fetchItemsFromSkinport };