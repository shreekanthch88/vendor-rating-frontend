import axios from "axios";

/**
 * =====================================================
 * API BASE URL
 * =====================================================
 *
 * Desktop:
 *   http://localhost:5173
 *   → http://localhost:5000/api
 *
 * Mobile / LAN:
 *   http://192.168.0.114:5173
 *   → http://192.168.0.114:5000/api
 */

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "http://localhost:5000/api";
  }

  return `http://${hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

/**
 * =====================================================
 * Authentication Token Interceptor
 * =====================================================
 *
 * Vendor APIs:
 *   localStorage.vendorToken
 *
 * Admin / Organization APIs:
 *   localStorage.token
 *
 * IMPORTANT:
 * Vendor requests NEVER fall back to the Admin token.
 */

api.interceptors.request.use(
  (config) => {
    const isVendorEndpoint = config.url?.startsWith("/vendor/");
    const isVendorRatingRoute = config.url?.startsWith("/vendor-ratings/vendor/");
    const isVendorPortalContext =
      typeof window !== "undefined" &&
      (window.location.pathname === "/vendor" ||
        window.location.pathname.startsWith("/vendor/"));

    let token = null;

    /**
     * ================================================
     * Vendor API & Portal Requests
     * ================================================
     */
    if (isVendorEndpoint) {
      // Pure vendor routes always use vendorToken
      token = localStorage.getItem("vendorToken");
    } else if (
      (isVendorPortalContext || isVendorRatingRoute) &&
      localStorage.getItem("vendorToken")
    ) {
      // When browsing inside vendor portal or calling vendor rating endpoints as a vendor
      token = localStorage.getItem("vendorToken");
    }

    /**
     * ================================================
     * Admin / Organization API
     * ================================================
     */
    else {
      token = localStorage.getItem("token");
    }

    /**
     * ================================================
     * Attach Authorization Header
     * ================================================
     */
    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;