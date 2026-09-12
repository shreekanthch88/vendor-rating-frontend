import api from "./api";

/**
 * ================================
 * Vendor Dashboard
 * ================================
 */
export const getVendorDashboard = async () => {
  const response = await api.get("/vendors/dashboard");
  return response.data;
};

/**
 * ================================
 * Get All Vendors
 * ================================
 */
export const getAllVendors = async (
  page = 1,
  limit = 10,
  search = "",
  status = ""
) => {
  const response = await api.get("/vendors", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};

/**
 * ================================
 * Get Vendor By ID
 * ================================
 */
export const getVendorById = async (id) => {
  const response = await api.get(`/vendors/${id}`);
  return response.data;
};

/**
 * ================================
 * Create Vendor
 * ================================
 */
export const createVendor = async (vendorData) => {
  const response = await api.post("/vendors", vendorData);
  return response.data;
};

/**
 * ================================
 * Update Vendor
 * ================================
 */
export const updateVendor = async (id, vendorData) => {
  const response = await api.put(`/vendors/${id}`, vendorData);
  return response.data;
};

/**
 * ================================
 * Update Vendor Status
 * ================================
 */
export const updateVendorStatus = async (id, status) => {
  const response = await api.patch(`/vendors/${id}/status`, {
    status,
  });

  return response.data;
};

/**
 * ================================
 * Delete Vendor
 * ================================
 */
export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};