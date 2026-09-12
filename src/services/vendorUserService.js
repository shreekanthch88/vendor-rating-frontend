import api from "./api";

/**
 * ==========================================
 * Get All Vendor Users
 * ==========================================
 */
export const getVendorUsers = async (vendorId) => {
  const response = await api.get(
    `/vendors/${vendorId}/users`
  );

  return response.data;
};

/**
 * ==========================================
 * Get Vendor User By Id
 * ==========================================
 */
export const getVendorUserById = async (
  vendorId,
  userId
) => {
  const response = await api.get(
    `/vendors/${vendorId}/users/${userId}`
  );

  return response.data;
};

/**
 * ==========================================
 * Create Vendor User
 * ==========================================
 */
export const createVendorUser = async (
  vendorId,
  data
) => {
  const response = await api.post(
    `/vendors/${vendorId}/users`,
    data
  );

  return response.data;
};

/**
 * ==========================================
 * Update Vendor User
 * ==========================================
 */
export const updateVendorUser = async (
  vendorId,
  userId,
  data
) => {
  const response = await api.put(
    `/vendors/${vendorId}/users/${userId}`,
    data
  );

  return response.data;
};

/**
 * ==========================================
 * Reset Vendor Password
 * ==========================================
 */
export const resetVendorPassword = async (
  vendorId,
  userId,
  password
) => {
  const response = await api.patch(
    `/vendors/${vendorId}/users/${userId}/reset-password`,
    {
      password,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Change Vendor User Status
 * ==========================================
 */
export const changeVendorUserStatus = async (
  vendorId,
  userId,
  status
) => {
  const response = await api.patch(
    `/vendors/${vendorId}/users/${userId}/status`,
    {
      status,
    }
  );

  return response.data;
};

/**
 * ==========================================
 * Delete Vendor User
 * ==========================================
 */
export const deleteVendorUser = async (
  vendorId,
  userId
) => {
  const response = await api.delete(
    `/vendors/${vendorId}/users/${userId}`
  );

  return response.data;
};