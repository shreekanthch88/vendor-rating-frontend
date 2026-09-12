import api from "./api";

/**
 * =========================================================
 * VENDOR PURCHASE ORDER SERVICE
 * =========================================================
 *
 * Backend base route:
 *
 * /api/vendor/purchase-orders
 *
 * These APIs are already supported by your backend.
 */


/**
 * =========================================================
 * GET ALL VENDOR PURCHASE ORDERS
 * =========================================================
 *
 * GET /api/vendor/purchase-orders
 *
 * Query parameters:
 * - page
 * - limit
 * - search
 * - status
 */
export const getVendorPurchaseOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const response = await api.get(
    "/vendor/purchase-orders",
    {
      params: {
        page,
        limit,
        search,
        status,
      },
    }
  );

  return response.data;
};


/**
 * =========================================================
 * GET VENDOR PURCHASE ORDER BY ID
 * =========================================================
 *
 * GET /api/vendor/purchase-orders/:id
 *
 * IMPORTANT:
 * The ID must be the MongoDB PurchaseOrder _id.
 */
export const getVendorPurchaseOrderById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Purchase Order ID is required."
    );
  }

  const response = await api.get(
    `/vendor/purchase-orders/${id}`
  );

  return response.data;
};


/**
 * =========================================================
 * ACCEPT PURCHASE ORDER
 * =========================================================
 *
 * PATCH /api/vendor/purchase-orders/:id/accept
 *
 * Body:
 * {
 *   remarks: "..."
 * }
 */
export const acceptVendorPurchaseOrder = async (
  id,
  remarks = ""
) => {
  if (!id) {
    throw new Error(
      "Purchase Order ID is required."
    );
  }

  const response = await api.patch(
    `/vendor/purchase-orders/${id}/accept`,
    {
      remarks,
    }
  );

  return response.data;
};


/**
 * =========================================================
 * REJECT PURCHASE ORDER
 * =========================================================
 *
 * PATCH /api/vendor/purchase-orders/:id/reject
 *
 * Body:
 * {
 *   remarks: "..."
 * }
 */
export const rejectVendorPurchaseOrder = async (
  id,
  remarks = ""
) => {
  if (!id) {
    throw new Error(
      "Purchase Order ID is required."
    );
  }

  const response = await api.patch(
    `/vendor/purchase-orders/${id}/reject`,
    {
      remarks,
    }
  );

  return response.data;
};


/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 *
 * Optional convenience object.
 */
const vendorPurchaseOrderService = {
  getVendorPurchaseOrders,
  getVendorPurchaseOrderById,
  acceptVendorPurchaseOrder,
  rejectVendorPurchaseOrder,
};

export default vendorPurchaseOrderService;