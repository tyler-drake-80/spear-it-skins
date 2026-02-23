CREATE extension IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS items (
    id BIGSERIAL PRIMARY KEY,
    market_hash_name TEXT NOT NULL UNIQUE,
    item_type TEXT,
    rarity TEXT,
    rarity_rank INTEGER,
    weapon TEXT,
    exterior TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_latest (
    item_id BIGINT PRIMARY KEY REFERENCES items(id) 
        ON DELETE CASCADE,
    as_of TIMESTAMPTZ NOT NULL,
    min_price NUMERIC,
    suggested_price NUMERIC,
    quantity INTEGER,
    raw JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_price_history (
    item_id BIGINT NOT NULL REFERENCES items(id) 
        ON DELETE CASCADE,
    as_of TIMESTAMPTZ NOT NULL,
    min_price NUMERIC,
    suggested_price NUMERIC,
    quantity INTEGER,
    raw JSONB,
    PRIMARY KEY (item_id, as_of)
);

CREATE index IF NOT EXISTS idx_items_mhn_trgm
    ON items USING gin (market_hash_name gin_trgm_ops);

CREATE index IF NOT EXISTS idx_history_as_of
    ON item_price_history (as_of DESC);
