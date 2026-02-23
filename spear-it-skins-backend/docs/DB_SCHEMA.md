# Database Schema 

Schema is initialized automatically via schema.sql, which is mounted into the Postgres container at '/docker-entrypoint-initdb.d'.

To initialize locally:

```bash
docker compose down -v 
docker compose up --build
```

## Tables
Represents the catalog of tradeable items


### 1. Items
**Purpose:**
 - Stores one row per unique **market_hash_name**
 - Acts as the parent table for all pricing data
**Primary key:**
 - id (BIGSERIAL)
**Important columns:**
 - market_hash_name(UNIQUE)
 - item_type
 - created_at

### 2. Item_latest
**Purpose:**
 - Stores the most recent pricing snapshot of each item 
 - Enables fast retrieval of current market state
 - Avoids scanning historical Tables
**Primary key:**
 - item_id (FK -> items.id)
**Important columns:**
 - min_price
 - suggested_price
 - quantity
 - as_of

### 3. Item_price_history
**Purpose:**
 - Stores historical pricing snapshots over time
 - Enables trend analysis and charting
 - Composite PK ensures no duplicate timestamps
**Primary key:**
 - (item_id, as_of)
**Foreign key**
 - item_id -> items.id (ON DELETE CASCADE)


