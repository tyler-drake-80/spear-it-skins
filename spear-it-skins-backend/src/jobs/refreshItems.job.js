// src/jobs/refreshItems.jobs.js 
//Fetch items and replace cache.
//On fetch failure -> log error and keep previous cache.
const { fetchItemsFromSkinport } = require("../services/skinport.service");
const itemsCache = require("../cache/itemsCache");

async function refreshItems() {
    try {
        const items = await fetchItemsFromSkinport();
        itemsCache.setItems(items);
        console.log(
            `[refreshItems] OK: cached ${items.length} items @ ${itemsCache.getLastUpdated().toISOString()}`
        );
    } catch(err) {
        console.error("[refreshItems] FAILED:", err.message);
        //keep last good cache
    }
}

module.exports = { refreshItems };
