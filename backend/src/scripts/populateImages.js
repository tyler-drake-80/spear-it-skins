require("dotenv").config({ override: true });
const pool = require("../db/pool");

const API_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

async function run() {
  console.log("Fetching skin data from ByMykel CSGO-API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const skins = await res.json();
  console.log(`Got ${skins.length} skins from API.`);

  // Build lookup: "CZ75-Auto | Victoria" -> image URL
  const imageByName = {};
  for (const skin of skins) {
    if (skin.name && skin.image) {
      imageByName[skin.name] = skin.image;
    }
  }

  // Match DB items by stripping StatTrak prefix and wear suffix
  // "StatTrak™ CZ75-Auto | Victoria (Factory New)" -> "CZ75-Auto | Victoria"
  const { rows: dbItems } = await pool.query(
    "SELECT id, market_hash_name FROM items WHERE image_url IS NULL"
  );
  console.log(`DB has ${dbItems.length} items missing images.`);

  const batch = [];
  for (const row of dbItems) {
    const skinName = row.market_hash_name
      .replace(/^StatTrak™ /, "")
      .replace(/ \([^)]+\)$/, "");
    const imageUrl = imageByName[skinName];
    if (imageUrl) {
      batch.push({ id: row.id, url: imageUrl });
    }
  }

  console.log(`Matched ${batch.length} items. Updating DB...`);

  if (batch.length > 0) {
    const ids = batch.map((b) => b.id);
    const urls = batch.map((b) => b.url);
    await pool.query(
      `UPDATE items SET image_url = v.url
       FROM unnest($1::bigint[], $2::text[]) AS v(id, url)
       WHERE items.id = v.id`,
      [ids, urls]
    );
  }

  const { rows: stats } = await pool.query(
    "SELECT COUNT(*) total, COUNT(image_url) with_image FROM items"
  );
  console.log(
    `Done. ${stats[0].with_image}/${stats[0].total} items now have images.`
  );
}

run()
  .catch((e) => {
    console.error("Fatal error:", e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
