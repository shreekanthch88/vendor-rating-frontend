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
  sessionStorage.setItem(
    "vendorToken",
    data.token
  );

  sessionStorage.setItem(
    "vendorUser",
    JSON.stringify(data.user)
  );

  sessionStorage.setItem(
    "vendorProfile",
    JSON.stringify(data.vendor)
  );

  // Clear legacy localStorage keys so they do not leak into fresh tabs
  localStorage.removeItem("vendorToken");
  localStorage.removeItem("vendorUser");
  localStorage.removeItem("vendorProfile");
};

/**
 * ============================================
 * Get Vendor Token
 * ============================================
 */
export const getVendorToken = () => {
  let token = sessionStorage.getItem("vendorToken");
  if (!token) {
    token = localStorage.getItem("vendorToken");
    if (token) {
      sessionStorage.setItem("vendorToken", token);
      localStorage.removeItem("vendorToken");
    }
  }
  return token;
};

/**
 * ============================================
 * Get Vendor User
 * ============================================
 */
export const getVendorUser = () => {
  let user = sessionStorage.getItem("vendorUser");
  if (!user) {
    user = localStorage.getItem("vendorUser");
    if (user) {
      sessionStorage.setItem("vendorUser", user);
      localStorage.removeItem("vendorUser");
    }
  }

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * ============================================
 * Get Vendor Profile
 * ============================================
 */
export const getVendorProfile = () => {
  let vendor = sessionStorage.getItem("vendorProfile");
  if (!vendor) {
    vendor = localStorage.getItem("vendorProfile");
    if (vendor) {
      sessionStorage.setItem("vendorProfile", vendor);
      localStorage.removeItem("vendorProfile");
    }
  }

  try {
    return vendor ? JSON.parse(vendor) : null;
  } catch {
    return null;
  }
};

/**
 * ============================================
 * Logout Vendor
 * ============================================
 */
export const logoutVendor = () => {
  sessionStorage.removeItem("vendorToken");
  sessionStorage.removeItem("vendorUser");
  sessionStorage.removeItem("vendorProfile");

  localStorage.removeItem("vendorToken");
  localStorage.removeItem("vendorUser");
  localStorage.removeItem("vendorProfile");
};

/**
 * ============================================
 * Check Login
 * ============================================
 */
export const isVendorLoggedIn = () => {
  return !!getVendorToken();
};