import api from "./api";

/**
 * ==========================================
 * Admin / Organization Login
 * POST /api/auth/login
 * ==========================================
 */
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

/**
 * ==========================================
 * Vendor Login
 * POST /api/vendor/login
 * ==========================================
 */
export const vendorLogin = async (credentials) => {
  const response = await api.post(
    "/vendor/login",
    credentials
  );

  return response.data;
};

/**
 * ==========================================
 * Register User
 * ==========================================
 */
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

/**
 * ==========================================
 * Change Current User Password
 * POST /api/auth/change-password
 * ==========================================
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};