import api from "./api";

/**
 * ============================================
 * Vendor Login
 * ============================================
 */
export const vendorLogin = async (
  email,
  password
) => {
  const response = await api.post(
    "/vendor/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

/**
 * ============================================
 * Save Vendor Session
 * ============================================
 */
export const saveVendorSession = (
  data
) => {
  localStorage.setItem(
    "vendorToken",
    data.token
  );

  localStorage.setItem(
    "vendorUser",
    JSON.stringify(data.user)
  );

  localStorage.setItem(
    "vendorProfile",
    JSON.stringify(data.vendor)
  );
};

/**
 * ============================================
 * Get Vendor Token
 * ============================================
 */
export const getVendorToken = () => {
  return localStorage.getItem(
    "vendorToken"
  );
};

/**
 * ============================================
 * Get Vendor User
 * ============================================
 */
export const getVendorUser = () => {
  const user =
    localStorage.getItem(
      "vendorUser"
    );

  return user
    ? JSON.parse(user)
    : null;
};

/**
 * ============================================
 * Get Vendor Profile
 * ============================================
 */
export const getVendorProfile =
  () => {
    const vendor =
      localStorage.getItem(
        "vendorProfile"
      );

    return vendor
      ? JSON.parse(vendor)
      : null;
  };

/**
 * ============================================
 * Logout Vendor
 * ============================================
 */
export const logoutVendor = () => {
  localStorage.removeItem(
    "vendorToken"
  );

  localStorage.removeItem(
    "vendorUser"
  );

  localStorage.removeItem(
    "vendorProfile"
  );
};

/**
 * ============================================
 * Check Login
 * ============================================
 */
export const isVendorLoggedIn =
  () => {
    return !!localStorage.getItem(
      "vendorToken"
    );
  };