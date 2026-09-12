import {
  Navigate,
  useLocation,
} from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";

const VendorProtectedRoute = ({ children }) => {
  const {
    vendorUser,
    loading,
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

  return children;
};

export default VendorProtectedRoute;