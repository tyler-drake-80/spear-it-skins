const PRICE_OUTLIER_THRESHOLDS = {
  minSuggestedPrice: 0,
  minRawPrice: 100,
  maxMinToSuggestedRatio: 10,
  maxQuantity: 3,
};

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function isMinPriceOutlier({ min_price, suggested_price, quantity }) {
  const minPrice = toFiniteNumber(min_price);
  const suggestedPrice = toFiniteNumber(suggested_price);
  const qty = quantity === null || quantity === undefined ? null : Number(quantity);

  return (
    suggestedPrice !== null &&
    suggestedPrice > PRICE_OUTLIER_THRESHOLDS.minSuggestedPrice &&
    minPrice !== null &&
    minPrice > PRICE_OUTLIER_THRESHOLDS.minRawPrice &&
    minPrice > suggestedPrice * PRICE_OUTLIER_THRESHOLDS.maxMinToSuggestedRatio &&
    Number.isFinite(qty) &&
    qty <= PRICE_OUTLIER_THRESHOLDS.maxQuantity
  );
}

function getPriceDisplay(row) {
  const minPrice = toFiniteNumber(row.min_price);
  const suggestedPrice = toFiniteNumber(row.suggested_price);
  const isOutlier = isMinPriceOutlier(row);

  return {
    display_price: isOutlier ? suggestedPrice : minPrice,
    price_status: isOutlier ? "min_price_outlier" : "normal",
    price_warning: isOutlier
      ? "min_price is far above suggested_price for a low-quantity item"
      : null,
  };
}

function getDisplayPriceSql(alias = "l") {
  return `
    CASE
      WHEN ${alias}.suggested_price IS NOT NULL
        AND ${alias}.suggested_price > ${PRICE_OUTLIER_THRESHOLDS.minSuggestedPrice}
        AND ${alias}.min_price IS NOT NULL
        AND ${alias}.min_price > ${PRICE_OUTLIER_THRESHOLDS.minRawPrice}
        AND ${alias}.min_price > ${alias}.suggested_price * ${PRICE_OUTLIER_THRESHOLDS.maxMinToSuggestedRatio}
        AND ${alias}.quantity IS NOT NULL
        AND ${alias}.quantity <= ${PRICE_OUTLIER_THRESHOLDS.maxQuantity}
      THEN ${alias}.suggested_price
      ELSE ${alias}.min_price
    END
  `;
}

module.exports = {
  PRICE_OUTLIER_THRESHOLDS,
  getDisplayPriceSql,
  getPriceDisplay,
  isMinPriceOutlier,
};
