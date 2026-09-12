import api from "./api";

/**
 * =========================================================
 * REPLACEMENT REQUEST SERVICE
 * =========================================================
 *
 * Frontend communication for the ORGANIZATION / QUALITY
 * MANAGER Replacement Request workflow.
 *
 * Backend base route:
 *
 * /api/replacement-requests
 *
 * Workflow:
 *
 * Quality Inspection
 *       ↓
 * Replacement Decision
 *       ↓
 * Replacement Request
 *       ↓
 * Draft
 *       ↓
 * Pending Approval
 *       ↓
 * Approved / Rejected
 *       ↓
 * Vendor Acceptance
 *       ↓
 * Replacement Dispatch
 *
 * Vendor-side Replacement APIs are maintained separately.
 *
 * =========================================================
 */


/**
 * =========================================================
 * GET ORGANIZATION REPLACEMENT REQUESTS
 * =========================================================
 *
 * GET
 * /api/replacement-requests
 *
 * Used by:
 *
 * Replacement Requests page
 *
 * Supports:
 *
 * page
 * limit
 * search
 * status
 * vendor
 *
 * Example:
 *
 * /api/replacement-requests?page=1&limit=10
 *
 * =========================================================
 */

export const getOrganizationReplacementRequests =
  async (
    page = 1,
    limit = 10,
    search = "",
    status = "",
    vendor = ""
  ) => {

    const response =
      await api.get(
        "/replacement-requests",
        {
          params: {
            page,
            limit,
            search,
            status,
            vendor,
          },
        }
      );


    return response.data;
  };


/**
 * =========================================================
 * GET ORGANIZATION REPLACEMENT REQUEST BY ID
 * =========================================================
 *
 * GET
 * /api/replacement-requests/:id
 *
 * Used by:
 *
 * Replacement Request Details
 * Quality Manager Review
 * Audit
 *
 * =========================================================
 */

export const getOrganizationReplacementRequestById =
  async (
    id
  ) => {

    const response =
      await api.get(
        `/replacement-requests/${id}`
      );


    return response.data;
  };


/**
 * =========================================================
 * CREATE REPLACEMENT REQUEST
 * =========================================================
 *
 * POST
 * /api/replacement-requests
 *
 * Creates:
 *
 * Draft
 *
 * Payload:
 *
 * {
 *   purchaseOrderId,
 *   originalDispatchId,
 *   items,
 *   reason,
 *   remarks,
 *   requiredReplacementDate
 * }
 *
 * =========================================================
 */

export const createOrganizationReplacementRequest =
  async (
    replacementData
  ) => {

    const response =
      await api.post(
        "/replacement-requests",
        replacementData
      );


    return response.data;
  };


/**
 * =========================================================
 * SUBMIT REPLACEMENT REQUEST
 * =========================================================
 *
 * POST
 * /api/replacement-requests/:id/submit
 *
 * Draft
 *   ↓
 * Pending Approval
 *
 * =========================================================
 */

export const submitOrganizationReplacementRequest =
  async (
    id
  ) => {

    const response =
      await api.post(
        `/replacement-requests/${id}/submit`
      );


    return response.data;
  };


/**
 * =========================================================
 * APPROVE REPLACEMENT REQUEST
 * =========================================================
 *
 * POST
 * /api/replacement-requests/:id/approve
 *
 * Pending Approval
 *       ↓
 * Approved
 *
 * =========================================================
 */

export const approveOrganizationReplacementRequest =
  async (
    id,
    approvalRemarks = ""
  ) => {

    const response =
      await api.post(
        `/replacement-requests/${id}/approve`,
        {
          approvalRemarks,
        }
      );


    return response.data;
  };


/**
 * =========================================================
 * REJECT REPLACEMENT REQUEST
 * =========================================================
 *
 * POST
 * /api/replacement-requests/:id/reject
 *
 * Pending Approval
 *       ↓
 * Rejected
 *
 * =========================================================
 */

export const rejectOrganizationReplacementRequest =
  async (
    id,
    rejectionReason
  ) => {

    const response =
      await api.post(
        `/replacement-requests/${id}/reject`,
        {
          rejectionReason,
        }
      );


    return response.data;
  };


/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 *
 * Convenience object for pages/components that prefer:
 *
 * replacementRequestService.getOrganizationReplacementRequests()
 *
 * =========================================================
 */

const replacementRequestService = {

  getOrganizationReplacementRequests,

  getOrganizationReplacementRequestById,

  createOrganizationReplacementRequest,

  submitOrganizationReplacementRequest,

  approveOrganizationReplacementRequest,

  rejectOrganizationReplacementRequest,
};


export default replacementRequestService;