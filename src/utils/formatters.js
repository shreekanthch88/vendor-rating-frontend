/**
 * =========================================================
 * Currency & Number Formatters (Strict 2-Decimal .paise formatting)
 * =========================================================
 */

/**
 * Rounds any number or string amount to strictly 2 decimal places (paise)
 * @param {number|string} val
 * @returns {number}
 */
export const roundToPaise = (val) => {
  return Math.round((Number(val) || 0) * 100) / 100;
};

/**
 * Returns formatted string with strictly 2 decimal places (e.g. "120.23")
 * @param {number|string} val
 * @returns {string}
 */
export const formatPaise = (val) => {
  return roundToPaise(val).toFixed(2);
};

/**
 * Formats an amount to Indian Currency string with strictly 2 decimal places (e.g. "₹1,250.50")
 * @param {number|string} val
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (val, currency = "INR") => {
  const num = roundToPaise(val);
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats a plain number with Indian comma grouping and strictly 2 decimal places
 * @param {number|string} val
 * @returns {string}
 */
export const formatNumberWithDecimals = (val) => {
  const num = roundToPaise(val);
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

