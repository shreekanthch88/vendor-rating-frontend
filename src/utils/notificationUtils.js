/**
 * =========================================================
 * NOTIFICATION URL RESOLVER UTILITY
 * =========================================================
 *
 * Normalizes and converts actionUrl from notifications into
 * safe, currently existing frontend routes.
 */

export const resolveNotificationUrl = (rawUrl, isVendor = false) => {
  if (!rawUrl) return null;

  let path = String(rawUrl).trim();

  // Strip origin / protocol if full URL was provided
  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      path = parsed.pathname + parsed.search + parsed.hash;
    } catch {
      // Keep as-is if invalid URL
    }
  }

  // Ensure path starts with a leading slash
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // 1. Goods Receipt / Dispatches
  if (path.startsWith("/goods-receipt/new") || path.startsWith("/goods-receipt")) {
    const queryIdx = path.indexOf("?");
    const query = queryIdx !== -1 ? path.substring(queryIdx) : "";
    return isVendor ? "/vendor/dispatches" : `/grn${query}`;
  }

  if (path.startsWith("/grn") && isVendor) {
    return "/vendor/dispatches";
  }

  // 2. Purchase Orders (handles both /purchase-orders/:id, /vendor/purchase-orders/:id, and ?id=...)
  const poMatch =
    path.match(/^\/(?:vendor\/)?purchase-orders\/([a-f0-9]{24})/i) ||
    path.match(/^\/(?:vendor\/)?purchase-orders\?.*id=([a-f0-9]{24})/i);

  if (poMatch) {
    const poId = poMatch[1];
    return isVendor
      ? `/vendor/purchase-orders/${poId}`
      : `/purchase-orders?id=${poId}`;
  }

  if (path.startsWith("/purchase-orders") && isVendor) {
    return "/vendor/purchase-orders";
  }
  if (path.startsWith("/vendor/purchase-orders") && !isVendor) {
    return "/purchase-orders";
  }

  // 3. Quality Inspections
  if (path.startsWith("/quality-inspections")) {
    const queryIdx = path.indexOf("?");
    const query = queryIdx !== -1 ? path.substring(queryIdx) : "";
    return `/quality-inspection/inspections${query}`;
  }

  // 4. Vendor Ratings / Performance
  if (path === "/vendor/ratings" || path.startsWith("/vendor/ratings/")) {
    return isVendor ? "/vendor/performance" : "/ratings";
  }

  // 5. Notification Center
  if (path === "/notifications" && isVendor) {
    return "/vendor/notifications";
  }
  if (path === "/vendor/notifications" && !isVendor) {
    return "/notifications";
  }

  return path;
};
