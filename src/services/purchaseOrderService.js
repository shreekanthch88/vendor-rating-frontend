import api from "./api";

/**
 * ==========================================
 * Purchase Order Dashboard
 * ==========================================
 */
export const getPurchaseOrderDashboard = async () => {
  const response = await api.get("/purchase-orders/dashboard");
  return response.data;
};

/**
 * ==========================================
 * Get All Purchase Orders
 * ==========================================
 */
export const getAllPurchaseOrders = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  vendor = "",
  priority = ""
) => {
  const response = await api.get("/purchase-orders", {
    params: {
      page,
      limit,
      search,
      status,
      vendor,
      priority,
    },
  });

  return response.data;
};

/**
 * ==========================================
 * Get Purchase Order By ID
 * ==========================================
 */
export const getPurchaseOrderById = async (id) => {
  const response = await api.get(`/purchase-orders/${id}`);
  return response.data;
};

/**
 * ==========================================
 * Create Purchase Order
 * ==========================================
 */
export const createPurchaseOrder = async (purchaseOrderData) => {
  const response = await api.post(
    "/purchase-orders",
    purchaseOrderData
  );

  return response.data;
};

/**
 * ==========================================
 * Update Purchase Order
 * ==========================================
 */
export const updatePurchaseOrder = async (
  id,
  purchaseOrderData
) => {
  const response = await api.put(
    `/purchase-orders/${id}`,
    purchaseOrderData
  );

  return response.data;
};

/**
 * ==========================================
 * Submit Purchase Order
 * ==========================================
 */
export const submitPurchaseOrder = async (id) => {
  const response = await api.patch(
    `/purchase-orders/${id}/submit`
  );

  return response.data;
};

/**
 * ==========================================
 * Approve Purchase Order
 * ==========================================
 */
export const approvePurchaseOrder = async (id) => {
  const response = await api.patch(
    `/purchase-orders/${id}/approve`
  );

  return response.data;
};

/**
 * ==========================================
 * Reject Purchase Order
 * ==========================================
 */
export const rejectPurchaseOrder = async (
  id,
  reason
) => {
  const response = await api.patch(
    `/purchase-orders/${id}/reject`,
    {
      reason,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Send Purchase Order To Vendor
 * ==========================================
 */
export const sendPurchaseOrderToVendor = async (id) => {
  const response = await api.patch(
    `/purchase-orders/${id}/send`
  );

  return response.data;
};

/**
 * ==========================================
 * Vendor Accept Purchase Order
 * ==========================================
 */
export const vendorAcceptPurchaseOrder = async (
  id,
  remarks
) => {
  const response = await api.patch(
    `/purchase-orders/${id}/vendor-accept`,
    {
      remarks,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Vendor Reject Purchase Order
 * ==========================================
 */
export const vendorRejectPurchaseOrder = async (
  id,
  remarks
) => {
  const response = await api.patch(
    `/purchase-orders/${id}/vendor-reject`,
    {
      remarks,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Delete Purchase Order
 * ==========================================
 */
export const deletePurchaseOrder = async (id) => {
  const response = await api.delete(
    `/purchase-orders/${id}`
  );

  return response.data;
};


export const getPurchaseOrderCharts = async () => {
  const response = await api.get(
    "/purchase-orders/charts"
  );

  return response.data;
};

/**
 * ==========================================
 * Get Purchase Order Fulfillment
 * ==========================================
 *
 * GET /api/purchase-orders/:id/fulfillment
 *
 * Returns the complete PO fulfillment chain:
 *
 * Ordered
 * Original Dispatch
 * Original Receipt
 * Quality Accepted / Rejected / Damaged
 * Replacement
 * Final Fulfilled
 * Pending
 * Fulfillment %
 */
export const getPurchaseOrderFulfillment = async (id) => {
  if (!id) {
    throw new Error("Purchase Order ID is required.");
  }

  const response = await api.get(
    `/purchase-orders/${id}/fulfillment`
  );

  return response.data;
};