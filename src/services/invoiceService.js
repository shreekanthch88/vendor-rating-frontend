import api from "./api";

/**
 * =========================================================
 * INVOICE FRONTEND SERVICE
 * =========================================================
 */

// 1. Get Dashboard Statistics
export const getInvoiceDashboard = async () => {
  const response = await api.get("/invoices/dashboard");
  return response.data;
};

// 2. Get Eligible Purchase Orders For Invoicing
export const getEligiblePurchaseOrders = async (vendorId = "") => {
  const response = await api.get("/invoices/eligible-pos", {
    params: { vendorId },
  });
  return response.data;
};

// 3. Get PO Invoiceable Details
export const getPOInvoiceableDetails = async (purchaseOrderId) => {
  const response = await api.get(`/invoices/po-details/${purchaseOrderId}`);
  return response.data;
};

// 4. Create Invoice (Admin or Vendor)
export const createInvoice = async (invoiceData) => {
  const response = await api.post("/invoices", invoiceData);
  return response.data;
};

// 5. Get All Invoices (Paginated & Filtered)
export const getAllInvoices = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  paymentStatus = "",
  vendorId = "",
  purchaseOrderId = "",
  fromDate = "",
  toDate = "",
} = {}) => {
  const response = await api.get("/invoices", {
    params: {
      page,
      limit,
      search,
      status,
      paymentStatus,
      vendorId,
      purchaseOrderId,
      fromDate,
      toDate,
    },
  });
  return response.data;
};

// 6. Get Invoice by ID
export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

// 7. Update Invoice
export const updateInvoice = async (id, data) => {
  const response = await api.put(`/invoices/${id}`, data);
  return response.data;
};

// 8. Submit Invoice
export const submitInvoice = async (id) => {
  const response = await api.patch(`/invoices/${id}/submit`);
  return response.data;
};

// 9. Verify Invoice (Admin/Finance)
export const verifyInvoice = async (id, verificationData) => {
  const response = await api.patch(`/invoices/${id}/verify`, verificationData);
  return response.data;
};

// 10. Approve Invoice (Admin/Finance)
export const approveInvoice = async (id, approvalData) => {
  const response = await api.patch(`/invoices/${id}/approve`, approvalData);
  return response.data;
};

// 11. Reject Invoice (Admin/Finance)
export const rejectInvoice = async (id, rejectionReason) => {
  const response = await api.patch(`/invoices/${id}/reject`, { rejectionReason });
  return response.data;
};

// 12. Dispute Invoice (Admin/Finance)
export const disputeInvoice = async (id, disputeReason) => {
  const response = await api.patch(`/invoices/${id}/dispute`, { disputeReason });
  return response.data;
};

// 13. Record Invoice Payment (Admin/Finance)
export const recordInvoicePayment = async (id, paymentData) => {
  const response = await api.patch(`/invoices/${id}/payment`, paymentData);
  return response.data;
};

// 14. Delete Invoice
export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

const invoiceService = {
  getInvoiceDashboard,
  getEligiblePurchaseOrders,
  getPOInvoiceableDetails,
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  submitInvoice,
  verifyInvoice,
  approveInvoice,
  rejectInvoice,
  disputeInvoice,
  recordInvoicePayment,
  deleteInvoice,
};

export default invoiceService;

