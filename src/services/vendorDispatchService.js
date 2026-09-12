import api from "./api";

/**
 * =========================================================
 * VENDOR DISPATCH SERVICE
 * =========================================================
 *
 * Backend base route:
 *
 * /api/vendor/dispatches
 *
 * This service is used by the Vendor Dispatch Dashboard
 * and the upcoming Dispatch creation/details pages.
 */


/**
 * =========================================================
 * GET VENDOR DISPATCHES
 * =========================================================
 *
 * GET /api/vendor/dispatches
 *
 * Supported filters:
 *
 * page
 * limit
 * search
 * status
 * purchaseOrder
 * fromDate
 * toDate
 */
export const getVendorDispatches = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  purchaseOrder = "",
  fromDate = "",
  toDate = "",
} = {}) => {

  const response = await api.get(
    "/vendor/dispatches",
    {
      params: {
        page,
        limit,
        search,
        status,
        purchaseOrder,
        fromDate,
        toDate,
      },
    }
  );

  return response.data;
};
/**
 * =========================================================
 * GET VENDOR DISPATCH OVERVIEW
 * =========================================================
 *
 * GET /api/vendor/dispatches/overview
 *
 * Returns Accepted Purchase Orders available for dispatch.
 *
 * Includes:
 *
 * - Purchase Order
 * - Ordered Quantity
 * - Dispatched Quantity
 * - Pending Quantity
 * - Dispatch Status
 * - Can Dispatch
 */
export const getVendorDispatchOverview =
  async () => {

    const response = await api.get(
      "/vendor/dispatches/overview"
    );

    return response.data;
  };

/**
 * =========================================================
 * GET DISPATCH BY ID
 * =========================================================
 *
 * GET /api/vendor/dispatches/:id
 */
export const getVendorDispatchById = async (
  id
) => {

  if (!id) {
    throw new Error(
      "Dispatch ID is required."
    );
  }

  const response = await api.get(
    `/vendor/dispatches/${id}`
  );

  return response.data;
};


/**
 * =========================================================
 * CREATE DISPATCH
 * =========================================================
 *
 * POST /api/vendor/dispatches
 *
 * Used later by the Create Dispatch wizard.
 */
export const createVendorDispatch = async (
  dispatchData
) => {

  if (!dispatchData) {
    throw new Error(
      "Dispatch data is required."
    );
  }

  const response = await api.post(
    "/vendor/dispatches",
    dispatchData
  );

  return response.data;
};


/**
 * =========================================================
 * UPDATE DISPATCH
 * =========================================================
 *
 * PATCH /api/vendor/dispatches/:id
 *
 * Used later if your backend allows draft dispatch
 * modification before final submission.
 */
export const updateVendorDispatch = async (
  id,
  dispatchData
) => {

  if (!id) {
    throw new Error(
      "Dispatch ID is required."
    );
  }

  const response = await api.patch(
    `/vendor/dispatches/${id}`,
    dispatchData
  );

  return response.data;
};


/**
 * =========================================================
 * CANCEL DISPATCH
 * =========================================================
 *
 * PATCH /api/vendor/dispatches/:id/cancel
 */
export const cancelVendorDispatch = async (
  id,
  reason = ""
) => {

  if (!id) {
    throw new Error(
      "Dispatch ID is required."
    );
  }

  const response = await api.patch(
    `/vendor/dispatches/${id}/cancel`,
    {
      reason,
    }
  );

  return response.data;
};

/**
 * =========================================================
 * UPDATE DISPATCH STATUS
 * =========================================================
 *
 * PATCH /api/vendor/dispatches/:id/status
 */
export const updateVendorDispatchStatus = async (
  id,
  statusData
) => {

  if (!id) {
    throw new Error(
      "Dispatch ID is required."
    );
  }

  if (!statusData) {
    throw new Error(
      "Status data is required."
    );
  }

  const response = await api.patch(
    `/vendor/dispatches/${id}/status`,
    statusData
  );

  return response.data;
};

/**
 * =========================================================
 * GET PURCHASE ORDER DISPATCH SUMMARY
 * =========================================================
 *
 * Used later for the Create Dispatch page.
 *
 * GET /api/vendor/dispatches/purchase-order/:purchaseOrderId
 *
 * This should return information such as:
 *
 * Ordered Quantity
 * Already Dispatched Quantity
 * Remaining Quantity
 * Items
 * PO Required Date
 * Vendor Promised Date
 */
export const getPurchaseOrderDispatchSummary =
  async (purchaseOrderId) => {

    if (!purchaseOrderId) {
      throw new Error(
        "Purchase Order ID is required."
      );
    }

    const response = await api.get(
      `/vendor/dispatches/purchase-orders/${purchaseOrderId}`
    );

    return response.data;
  };

/**
 * =========================================================
 * GET PURCHASE ORDER DISPATCH HISTORY
 * =========================================================
 *
 * GET
 * /api/vendor/dispatches/purchase-orders/:purchaseOrderId/history
 *
 * Returns ALL individual dispatches belonging to a
 * Purchase Order.
 *
 * Example:
 *
 * PO Quantity = 100
 *
 * DSP000001 → 95
 * DSP000002 → 5
 *
 * Both dispatches are returned separately.
 *
 * This is different from:
 *
 * getVendorDispatchOverview()
 *
 * which returns PO-level summary information.
 *
 * =========================================================
 */
export const getVendorPurchaseOrderDispatchHistory =
  async (purchaseOrderId) => {

    if (!purchaseOrderId) {
      throw new Error(
        "Purchase Order ID is required."
      );
    }

    const response =
      await api.get(
        `/vendor/dispatches/purchase-orders/${purchaseOrderId}/history`
      );

    return response.data;
  };
/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */
const vendorDispatchService = {
  getVendorDispatches,
  getVendorDispatchOverview,
  getVendorDispatchById,
  createVendorDispatch,
  updateVendorDispatch,
  cancelVendorDispatch,
  getPurchaseOrderDispatchSummary,
  updateVendorDispatchStatus,
  getVendorPurchaseOrderDispatchHistory,
};

export default vendorDispatchService;