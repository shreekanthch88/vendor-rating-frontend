import {
  Navigate,
  useLocation,
} from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";

const VendorProtectedRoute = ({ children }) => {
  const {
    vendorUser,
    vendorProfile,
    loading,
    logout,
  } = useVendorAuth();

  const location = useLocation();


  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  // Not Logged In
  if (!vendorUser) {
    return (
      <Navigate
        to="/vendor/login"
        replace
      />
    );
  }

  // Deactivated / Inactive Account
  if (
    vendorUser.status === "INACTIVE" ||
    (vendorProfile && vendorProfile.status && vendorProfile.status !== "Active")
  ) {
    logout();
    return (
      <Navigate
        to="/vendor/login"
        state={{ error: "Your vendor account has been deactivated. Please contact the administrator." }}
        replace
      />
    );
  }

  return children;
};

export default VendorProtectedRoute;