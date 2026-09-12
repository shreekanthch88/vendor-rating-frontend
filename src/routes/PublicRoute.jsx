import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";


const PublicRoute = ({
  children,
}) => {

  const {
    user,
  } = useContext(AuthContext);

  const location =
    useLocation();


  // =====================================================
  // USER NOT LOGGED IN
  // =====================================================

  if (!user) {
    return children;
  }


  // =====================================================
  // QUALITY MANAGER
  // =====================================================

  if (
    user.role === "QUALITY_MANAGER"
  ) {

    return (
      <Navigate
        to="/quality-inspection/inspections"
        replace
      />
    );

  }


  // =====================================================
  // VENDOR
  // =====================================================

  if (
    user.role === "VENDOR"
  ) {

    return (
      <Navigate
        to="/vendor/dashboard"
        replace
      />
    );

  }


  // =====================================================
  // ALL OTHER ORGANIZATION USERS
  // =====================================================

  return (
    <Navigate
      to="/dashboard"
      replace
      state={{
        from: location,
      }}
    />
  );

};


export default PublicRoute;