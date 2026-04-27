const pool = require("../db/pool");

async function checkPriceAlerts() {
  const result = await pool.query(
    `
    UPDATE price_alerts a
    SET
      is_active = false,
      triggered_at = now(),
      updated_at = now()
    FROM item_latest l, items i
    WHERE a.item_id = l.item_id
      AND i.id = a.item_id
      AND a.is_active = true
      AND a.triggered_at IS NULL
      AND (
        (a.direction = 'below' AND l.min_price <= a.target_price)
        OR
        (a.direction = 'above' AND l.min_price >= a.target_price)
      )
    RETURNING
      a.id,
      a.user_id,
      a.item_id,
      i.market_hash_name,
      a.target_price,
      a.direction,
      l.min_price AS current_price,
      a.triggered_at
    `
  );

  const triggeredAlerts = result.rows.map((row) => ({
    id: Number(row.id),
    user_id: Number(row.user_id),
    item_id: Number(row.item_id),
    market_hash_name: row.market_hash_name,
    target_price: Number(row.target_price),
    direction: row.direction,
    current_price: row.current_price === null ? null : Number(row.current_price),
    triggered_at: row.triggered_at,
  }));

  for (const alert of triggeredAlerts) {
  await pool.query(
    `
    INSERT INTO notifications (user_id, alert_id, message)
    VALUES ($1, $2, $3)
    `,
    [
      alert.user_id,
      alert.id,
      `${alert.market_hash_name} is now $${alert.current_price}, which is ${alert.direction} your target of $${alert.target_price}.`,
    ]
  );
}

  if (triggeredAlerts.length > 0) {
    console.log(`[alerts] triggered ${triggeredAlerts.length} alert(s)`);
    console.table(triggeredAlerts);
  } else {
    console.log("[alerts] no alerts triggered");
  }

  return triggeredAlerts;
}

module.exports = {
  checkPriceAlerts,
};