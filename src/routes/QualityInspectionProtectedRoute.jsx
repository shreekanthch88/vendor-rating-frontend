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

import {
  ROLES,
  QUALITY_INSPECTION_ROLES,
} from "../constants/roles";


const QualityInspectionProtectedRoute = ({
  children,
}) => {

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const {
    user,
  } = useContext(AuthContext);

  const location = useLocation();


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );

  }


  // =====================================================
  // QUALITY INSPECTION ACCESS
  // =====================================================

  const hasAccess =
    QUALITY_INSPECTION_ROLES.includes(
      user.role
    );


  // =====================================================
  // USER DOES NOT HAVE QUALITY ACCESS
  // =====================================================

  if (!hasAccess) {

    // ---------------------------------------------------
    // VENDOR
    // ---------------------------------------------------

    if (
      user.role === ROLES.VENDOR
    ) {

      return (
        <Navigate
          to="/vendor/dashboard"
          replace
        />
      );

    }


    // ---------------------------------------------------
    // OTHER AUTHENTICATED USERS
    // ---------------------------------------------------

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  // =====================================================
  // AUTHORIZED
  // =====================================================

  return children;

};


export default QualityInspectionProtectedRoute;