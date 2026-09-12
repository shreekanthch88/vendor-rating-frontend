import api from "./api";

/**
 * =========================================================
 * PAYMENT FRONTEND SERVICE
 * =========================================================
 */

// 1. Get Payment Dashboard Statistics
export const getPaymentDashboard = async () => {
  const response = await api.get("/payments/dashboard");
  return response.data;
};

// 2. Get Payment Queue (Approved Invoices awaiting payment)
export const getPaymentQueue = async ({
  page = 1,
  limit = 10,
  search = "",
  vendorId = "",
} = {}) => {
  const response = await api.get("/payments/queue", {
    params: { page, limit, search, vendorId },
  });
  return response.data;
};

// 3. Process Payment (Execute Disbursement)
export const processPayment = async (paymentData) => {
  const response = await api.post("/payments/process", paymentData);
  return response.data;
};

// 4. Get All Payments (Listing & History)
export const getAllPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  vendorId = "",
  invoiceId = "",
  paymentMethod = "",
  fromDate = "",
  toDate = "",
} = {}) => {
  const response = await api.get("/payments", {
    params: {
      page,
      limit,
      search,
      status,
      vendorId,
      invoiceId,
      paymentMethod,
      fromDate,
      toDate,
    },
  });
  return response.data;
};

// 5. Get Payment By ID (with 4-Way Reconciliation)
export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

// 6. Update Payment Status (Exception handling)
export const updatePaymentStatus = async (id, statusData) => {
  const response = await api.patch(`/payments/${id}/status`, statusData);
  return response.data;
};

const paymentService = {
  getPaymentDashboard,
  getPaymentQueue,
  processPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};

export default paymentService;

