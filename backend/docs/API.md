# Backend API (V1)

---

**Base URL (local):** http://localhost:4000/api/v1

---

## GET /health

---

**Returns** status and cache metadata.

**Example:**

```bash
curl -s http://localhost:4000/api/v1/health | jq
```
---

**Response (JSON):** 
{
    "ok": true,
    "cachedItems": 12345, 
    "lastUpdated": "2026-02-16T12:00:00.123Z"
}

## GET /items

---

**Returns** cached Skinport items with optional search + pagination.

**Query params:**
-q(string, optional): case-insensitive substring match on **market_hash_name**
-
-limit(int, optional): default 20, max 100
-
-offset(int, optional): default 0
-

**Examples:**
```bash
curl -s "http://localhost:4000/api/v1/items?limit=5" | jq
curl -s "http://localhost:4000/api/v1/items?q=ak&limit=5" | jq '.items[].market_hash_name'
```

**Response shape**

{
  "total": 99999,
  "limit": 20,
  "offset": 0,
  "q": "ak",
  "items": [ /* ... */ ],
  "lastUpdated": "2026-02-16T14:01:02.123Z"
}

