import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  vendorLogin,
  saveVendorSession,
  logoutVendor,
  getVendorUser,
  getVendorProfile,
  isVendorLoggedIn,
} from "../services/vendorAuthService";

const VendorAuthContext =
  createContext();

export const VendorAuthProvider = ({
  children,
}) => {
  const [vendorUser, setVendorUser] =
    useState(null);

  const [vendorProfile, setVendorProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * ============================================
   * Restore Vendor Session
   * ============================================
   */
  useEffect(() => {
    if (isVendorLoggedIn()) {
      setVendorUser(getVendorUser());
      setVendorProfile(
        getVendorProfile()
      );
    }

    setLoading(false);
  }, []);

  /**
   * ============================================
   * Vendor Login
   * ============================================
   */
  const login = async (
    email,
    password
  ) => {
    const data = await vendorLogin(
      email,
      password
    );

    saveVendorSession(data);

    setVendorUser(data.user);
    setVendorProfile(data.vendor);

    return data;
  };

  /**
   * ============================================
   * Vendor Logout
   * ============================================
   */
  const logout = () => {
    logoutVendor();

    setVendorUser(null);
    setVendorProfile(null);
  };

  return (
    <VendorAuthContext.Provider
      value={{
        vendorUser,
        vendorProfile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

/**
 * ============================================
 * Custom Hook
 * ============================================
 */
export const useVendorAuth = () =>
  useContext(VendorAuthContext);