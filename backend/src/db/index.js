const { Pool } = require("pg");

let pool = null;

function initDb() {
    const url = process.env.DATABASE_URL;
    if(!url) return null

    const p = new Pool({ connectionString: url });

    p.on("error", (err) => {
        console.error("Unexpected PG error:", err);
    });

    return p;
}

pool = initDb();

function isEnabled() {
    // pool initialized ? true : false;
    return !!pool;
}

async function query(text, params) {
    if (!pool) throw new Error("DB not configured (missing DATABASE_URL).");
    return pool.query(text, params);
}

module.exports = { pool, isEnabled, query };
