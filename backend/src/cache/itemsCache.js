// src/cache/itemsCache.js
//In memory cache for skinport items.
//Is reset on server restart.
//Keep last known good data if refresh fails.
let items = [];
let lastUpdated = null;

function setItems(newItems) {
    items = Array.isArray(newItems) ? newItems : [];
    lastUpdated = new Date();
}

function getItems() { return items; }

function getLastUpdated() { return lastUpdated; }

function getCount() { return items.length; }

module.exports = {
    setItems,
    getItems,
    getLastUpdated,
    getCount,
};
