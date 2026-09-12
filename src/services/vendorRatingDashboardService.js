import api from "./api";

/**
 * =========================================================
 * ADMIN VENDOR RATING DASHBOARD SERVICE
 * =========================================================
 *
 * Backend:
 *
 * GET /api/vendor-rating-dashboard
 *
 * Optional query parameters:
 *
 * fromDate
 * toDate
 *
 * The backend is the source of truth for:
 *
 * - Vendor counts
 * - Vendor ratings
 * - Vendor scores
 * - Delivery performance
 * - Quality performance
 * - Top vendors
 * - Rating distribution
 * - Materials delivered
 * - Vendors needing attention
 * - Recent activity
 * - Performance trends
 *
 * No rating calculations are performed here.
 * =========================================================
 */


/**
 * =========================================================
 * GET ADMIN VENDOR RATING DASHBOARD
 * =========================================================
 */
export const getVendorRatingDashboard = async ({
  fromDate = "",
  toDate = "",
} = {}) => {

  const params = {};

  /**
   * Only send dates when selected.
   */
  if (fromDate) {
    params.fromDate = fromDate;
  }

  if (toDate) {
    params.toDate = toDate;
  }


  /**
   * Backend request
   */
  const response = await api.get(
    "/vendor-rating-dashboard",
    {
      params,
    }
  );


  /**
   * Axios response:
   *
   * response.data
   *
   * Backend response:
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: {
   *      ...
   *   }
   * }
   *
   * Return only the dashboard data
   * so the page can directly use:
   *
   * dashboard.summary
   * dashboard.topPerformingVendors
   * dashboard.ratingDistribution
   * etc.
   */

  return response.data?.data || {};
};


/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

const vendorRatingDashboardService = {
  getVendorRatingDashboard,
};

export default vendorRatingDashboardService;