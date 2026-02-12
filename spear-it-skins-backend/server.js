require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 4000;

let itemsCache = [];
let lastUpdated = null;

async function fetchItems() 
{
  const url =
    "https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1";

  const res = await fetch(url, 
  {
    headers: {
      "Accept-Encoding": "br",
    },
  });

  const data = await res.json();

  itemsCache = data;
  lastUpdated = new Date();
  console.log("Skinport data fetched:", itemsCache.length, "items");
}

fetchItems();

app.get("/api/status", (req, res) => 
{
  res.json({
    itemCount: itemsCache.length,
    lastUpdated,
  });
});

app.get("/api/items", (req, res) => 
{
  res.json(itemsCache.slice(0, 10)); 
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
