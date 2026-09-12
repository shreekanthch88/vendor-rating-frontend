import api from "./api";

/**
 * =========================================================
 * VENDOR RATING SERVICE
 * =========================================================
 *
 * Backend base route:
 *
 * /api/vendor-ratings
 *
 * Handles:
 *
 * 1. Generate Vendor Rating
 * 2. Get Vendor Ratings
 * 3. Get Vendor Rating By ID
 * 4. Get Latest Vendor Rating
 * 5. Get Vendor Rating Dashboard
 * 6. Update Evaluator Scores
 * 7. Submit Vendor Rating
 * 8. Approve Vendor Rating
 * 9. Lock Vendor Rating
 * 10. Delete Vendor Rating
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * No random data.
 * No frontend rating calculation.
 * Backend remains the source of truth for rating calculation.
 *
 * =========================================================
 */


/**
 * =========================================================
 * 1. GENERATE VENDOR RATING
 * =========================================================
 *
 * POST /api/vendor-ratings/generate
 *
 * Body:
 *
 * {
 *   vendorId,
 *   fromDate,
 *   toDate
 * }
 *
 * Used by Admin / authorized evaluator.
 *
 * The backend calculates the rating using actual:
 *
 * - Purchase Orders
 * - Dispatches
 * - Goods Receipts
 * - Quality Inspections
 * - Re-inspections
 * - Replacement Requests
 *
 * =========================================================
 */

export const generateVendorRating = async ({
  vendorId,
  fromDate,
  toDate,
}) => {

  if (!vendorId) {
    throw new Error(
      "Vendor ID is required."
    );
  }

  if (!fromDate) {
    throw new Error(
      "From date is required."
    );
  }

  if (!toDate) {
    throw new Error(
      "To date is required."
    );
  }

  if (
    new Date(fromDate) >
    new Date(toDate)
  ) {
    throw new Error(
      "From date cannot be after to date."
    );
  }

  const response = await api.post(
    "/vendor-ratings/generate",
    {
      vendorId,
      fromDate,
      toDate,
    }
  );

  return response.data;
};


/**
 * =========================================================
 * 2. GET VENDOR RATINGS
 * =========================================================
 *
 * GET /api/vendor-ratings
 *
 * Filters:
 *
 * page
 * limit
 * vendorId
 * status
 *
 * =========================================================
 */

export const getVendorRatings = async ({
  page = 1,
  limit = 10,
  vendorId = "",
  status = "",
} = {}) => {

  const response = await api.get(
    "/vendor-ratings",
    {
      params: {
        page,
        limit,
        vendorId,
        status,
      },
    }
  );

  return response.data;
};


/**
 * =========================================================
 * 3. GET VENDOR RATING BY ID
 * =========================================================
 *
 * GET /api/vendor-ratings/:id
 *
 * Used by:
 *
 * Admin Rating Details
 * Admin Evaluation
 * Rating Evidence
 *
 * =========================================================
 */

export const getVendorRatingById =
  async (id) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    const response =
      await api.get(
        `/vendor-ratings/${id}`
      );

    return response.data;
  };


/**
 * =========================================================
 * 4. GET LATEST VENDOR RATING
 * =========================================================
 *
 * GET
 * /api/vendor-ratings/vendor/:vendorId/latest
 *
 * Used by:
 *
 * - Vendor Performance
 * - Vendor Profile
 * - Admin Vendor View
 *
 * =========================================================
 */

export const getLatestVendorRating =
  async (vendorId) => {

    if (!vendorId) {
      throw new Error(
        "Vendor ID is required."
      );
    }

    const response =
      await api.get(
        `/vendor-ratings/vendor/${vendorId}/latest`
      );

    return response.data;
  };


/**
 * =========================================================
 * 5. GET VENDOR RATING DASHBOARD
 * =========================================================
 *
 * GET
 * /api/vendor-ratings/vendor/:vendorId/dashboard
 *
 * Used by:
 *
 * - Vendor Performance
 * - Vendor Rating Dashboard
 * - Admin Vendor Performance
 *
 * =========================================================
 */

export const getVendorRatingDashboard =
  async (vendorId) => {

    if (!vendorId) {
      throw new Error(
        "Vendor ID is required."
      );
    }

    const response =
      await api.get(
        `/vendor-ratings/vendor/${vendorId}/dashboard`
      );

    return response.data;
  };


/**
 * =========================================================
 * 6. UPDATE EVALUATOR SCORES
 * =========================================================
 *
 * PUT
 * /api/vendor-ratings/:id/evaluate
 *
 * Example:
 *
 * {
 *   evaluatorScores: {
 *     delivery: 90,
 *     quality: 95,
 *     fulfillment: 92,
 *     price: 88,
 *     responseTime: 90,
 *     poAcceptance: 95,
 *     documentation: 97
 *   },
 *
 *   communication: {
 *     score: 90,
 *     rating: "Excellent",
 *     remarks: "Good communication"
 *   },
 *
 *   remarks: "Evaluation completed"
 * }
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * The frontend sends evaluator input.
 * The backend must perform the final rating calculation.
 *
 * =========================================================
 */

export const updateEvaluatorScores =
  async (
    id,
    evaluationData
  ) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    if (!evaluationData) {
      throw new Error(
        "Evaluation data is required."
      );
    }

    const response =
      await api.put(
        `/vendor-ratings/${id}/evaluate`,
        evaluationData
      );

    return response.data;
  };


/**
 * =========================================================
 * 7. SUBMIT VENDOR RATING
 * =========================================================
 *
 * POST
 * /api/vendor-ratings/:id/submit
 *
 * =========================================================
 */

export const submitVendorRating =
  async (id) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    const response =
      await api.post(
        `/vendor-ratings/${id}/submit`
      );

    return response.data;
  };


/**
 * =========================================================
 * 8. APPROVE VENDOR RATING
 * =========================================================
 *
 * POST
 * /api/vendor-ratings/:id/approve
 *
 * =========================================================
 */

export const approveVendorRating =
  async (id) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    const response =
      await api.post(
        `/vendor-ratings/${id}/approve`
      );

    return response.data;
  };


/**
 * =========================================================
 * 9. LOCK VENDOR RATING
 * =========================================================
 *
 * POST
 * /api/vendor-ratings/:id/lock
 *
 * Once locked, the rating should become immutable
 * according to backend authorization/business rules.
 *
 * =========================================================
 */

export const lockVendorRating =
  async (id) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    const response =
      await api.post(
        `/vendor-ratings/${id}/lock`
      );

    return response.data;
  };


/**
 * =========================================================
 * 10. DELETE VENDOR RATING
 * =========================================================
 *
 * DELETE /api/vendor-ratings/:id
 *
 * Backend performs the actual deletion/soft deletion
 * according to its implementation.
 *
 * =========================================================
 */

export const deleteVendorRating =
  async (id) => {

    if (!id) {
      throw new Error(
        "Vendor Rating ID is required."
      );
    }

    const response =
      await api.delete(
        `/vendor-ratings/${id}`
      );

    return response.data;
  };


/**
 * =========================================================
 * 11. GET DELIVERY CALCULATION (TRANSPARENCY)
 * =========================================================
 *
 * GET /api/vendor-ratings/:id/delivery-calculation
 *
 * =========================================================
 */

export const getDeliveryCalculation = async (id) => {
  if (!id) {
    throw new Error("Vendor Rating ID is required.");
  }

  const response = await api.get(
    `/vendor-ratings/${id}/delivery-calculation`
  );

  return response.data;
};


/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

const vendorRatingService = {

  generateVendorRating,

  getVendorRatings,

  getVendorRatingById,

  getDeliveryCalculation,

  getLatestVendorRating,

  getVendorRatingDashboard,

  updateEvaluatorScores,

  submitVendorRating,

  approveVendorRating,

  lockVendorRating,

  deleteVendorRating,

};


export default vendorRatingService;