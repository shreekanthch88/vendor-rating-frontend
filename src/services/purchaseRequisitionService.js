import api from "./api";

/**
 * ==========================================
 * Purchase Requisition Dashboard
 * ==========================================
 */
export const getPurchaseRequisitionDashboard = async () => {
  const response = await api.get(
    "/purchase-requisitions/dashboard"
  );

  return response.data;
};

/**
 * ==========================================
 * Get All Purchase Requisitions
 * ==========================================
 *
 * Accepts:
 * {
 *   page,
 *   limit,
 *   search,
 *   status,
 *   department,
 *   priority
 * }
 */
export const getAllPurchaseRequisitions = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  department = "",
  priority = "",
} = {}) => {
  const response = await api.get(
    "/purchase-requisitions",
    {
      params: {
        page,
        limit,
        search,
        status,
        department,
        priority,
      },
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Get Purchase Requisition By ID
 * ==========================================
 */
export const getPurchaseRequisitionById = async (id) => {
  const response = await api.get(
    `/purchase-requisitions/${id}`
  );

  return response.data;
};

/**
 * ==========================================
 * Create Purchase Requisition
 * ==========================================
 */
export const createPurchaseRequisition = async (
  requisitionData
) => {
  const response = await api.post(
    "/purchase-requisitions",
    requisitionData
  );

  return response.data;
};

/**
 * ==========================================
 * Update Purchase Requisition
 * ==========================================
 */
export const updatePurchaseRequisition = async (
  id,
  requisitionData
) => {
  const response = await api.put(
    `/purchase-requisitions/${id}`,
    requisitionData
  );

  return response.data;
};

/**
 * ==========================================
 * Submit Purchase Requisition
 * ==========================================
 */
export const submitPurchaseRequisition = async (id) => {
  const response = await api.patch(
    `/purchase-requisitions/${id}/submit`
  );

  return response.data;
};

/**
 * ==========================================
 * Approve Purchase Requisition
 * ==========================================
 */
export const approvePurchaseRequisition = async (id) => {
  const response = await api.patch(
    `/purchase-requisitions/${id}/approve`
  );

  return response.data;
};

/**
 * ==========================================
 * Reject Purchase Requisition
 * ==========================================
 */
export const rejectPurchaseRequisition = async (
  id,
  reason
) => {
  const response = await api.patch(
    `/purchase-requisitions/${id}/reject`,
    {
      reason,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Delete Purchase Requisition
 * ==========================================
 */
export const deletePurchaseRequisition = async (id) => {
  const response = await api.delete(
    `/purchase-requisitions/${id}`
  );

  return response.data;
};