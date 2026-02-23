# Spear It Backend

---

Node.js + Express backend that fetches CSGO market data from Skinport, caches it in memory, and exposes a v1 REST API for the frontend. 

---

## Quickstart

---

### Prerequisites

-**Node.js installed** (V18.0 + recommended)

Use:

```bash
npm install
npm run dev
```

Curl examples:

```bash
GET /api/v1/health
GET /api/v1/items?q=ak&limit=5
```

---

### Quick tests

```bash
curl -s http://localhost:4000/api/v1/health | jq
curl -s "http://localhost:4000/api/v1/items?q=ak&limit=5" | jq '.items[].market_hash_name'
```

---

## API (V1)

---

Base path: **api/v1**
 -GET /health
    return cache status and last update time.

 -GET /items
    Query params:
     -q (optional): substring search against **market_hash_name**
     -limit (optional, default 20, max 100)
     -offset (optional, default 0)
    Returns paginated items from in-memory cache

More details -> **docs/API.md**

---

## Data lifecycle

---

**Data source**: Skinport items endpoint
**On startup**: backend fetches items immediately and populates cache
**Refresh**: background scheduler refreshes cache every 10 minutes. 
**Failure behavior**: if a refresh fails, backend keeps the last known good cache (does not wipe data)
**Note**: cache is in memory only; restarting server resets it. 

---

## Project structure

---

frontend/
    ...
backend/
    src/
        server.js               # Entrypoint: starts server + scheduler
        app.js                  # Express app setup: middleware + routes
        routes/                 # HTTP routes only (request / response)
            health.routes.js    
            items.routes.js 
        services/               # external API clients / business logic
            skinport.service.js 
        cache/                  # In memory state modules
            itemsCache.js 
        jobs/                   # Background jobs + scheduler
            refreshItems.job.js 
            scheduler.js 
docs/
    VERSION_CONTROL_GUIDE.md 
    REPO_STRUCTURE.md
    API.md

README.md 


---

## Data lifecycle

Fetch from Skinport -> cache -> API. 
Refresh every 10 minutes. Cache persists across failures but not restarts. 


