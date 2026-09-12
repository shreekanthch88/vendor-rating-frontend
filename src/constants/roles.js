/**
 * =========================================================
 * APPLICATION ROLES
 * =========================================================
 *
 * These values MUST match the role values used by the
 * backend User model.
 */

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PURCHASE_MANAGER: "PURCHASE_MANAGER",
  QUALITY_MANAGER: "QUALITY_MANAGER",
  FINANCE_MANAGER: "FINANCE_MANAGER",
  VENDOR: "VENDOR",
};


/**
 * =========================================================
 * ADMIN / ORGANIZATION ROLES
 * =========================================================
 */

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.PURCHASE_MANAGER,
  ROLES.QUALITY_MANAGER,
  ROLES.FINANCE_MANAGER,
];


/**
 * =========================================================
 * FULL ADMIN ACCESS
 * =========================================================
 *
 * SUPER_ADMIN and ADMIN can access the complete
 * organization administration portal.
 */

export const FULL_ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
];


/**
 * =========================================================
 * QUALITY INSPECTION ACCESS
 * =========================================================
 *
 * Quality Inspection module can be accessed by:
 *
 * SUPER_ADMIN
 * ADMIN
 * QUALITY_MANAGER
 *
 * QUALITY_MANAGER receives the dedicated Quality
 * Management / Inspection portal.
 */

export const QUALITY_INSPECTION_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.QUALITY_MANAGER,
];


/**
 * =========================================================
 * QUALITY INSPECTION VIEW ACCESS
 * =========================================================
 *
 * Purchase Manager can view inspection information,
 * but should not modify inspection results.
 */

export const QUALITY_INSPECTION_VIEW_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.QUALITY_MANAGER,
  ROLES.PURCHASE_MANAGER,
];


/**
 * =========================================================
 * FINANCE ACCESS
 * =========================================================
 */

export const FINANCE_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.FINANCE_MANAGER,
];


/**
 * =========================================================
 * HELPER FUNCTIONS
 * =========================================================
 */

export const hasRole = (
  userRole,
  allowedRoles = []
) => {

  return allowedRoles.includes(
    userRole
  );

};


export const isFullAdmin = (
  userRole
) => {

  return FULL_ADMIN_ROLES.includes(
    userRole
  );

};


export const canAccessQualityInspection = (
  userRole
) => {

  return QUALITY_INSPECTION_ROLES.includes(
    userRole
  );

};


export const canViewQualityInspection = (
  userRole
) => {

  return QUALITY_INSPECTION_VIEW_ROLES.includes(
    userRole
  );

};