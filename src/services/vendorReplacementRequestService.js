import api from "./api";

/**
 * =========================================================
 * VENDOR REPLACEMENT REQUEST SERVICE
 * =========================================================
 *
 * Backend:
 *
 * /api/vendor/replacement-requests
 *
 * Vendor workflow:
 *
 * Approved
 *    ↓
 * Vendor views request
 *    ↓
 * Vendor accepts
 *    ↓
 * Replacement Dispatch
 */


/**
 * =========================================================
 * GET VENDOR REPLACEMENT REQUESTS
 * =========================================================
 */

export const getVendorReplacementRequests =
  async (
    page = 1,
    limit = 10,
    search = "",
    status = ""
  ) => {

    const response =
      await api.get(
        "/vendor/replacement-requests",
        {
          params: {
            page,
            limit,
            search,
            status,
          },
        }
      );

    return response.data;
  };


/**
 * =========================================================
 * GET VENDOR REPLACEMENT REQUEST BY ID
 * =========================================================
 */

export const getVendorReplacementRequestById =
  async (id) => {

    const response =
      await api.get(
        `/vendor/replacement-requests/${id}`
      );

    return response.data;
  };


/**
 * =========================================================
 * GET REPLACEMENT DISPATCH HISTORY
 * =========================================================
 */

export const getReplacementDispatchHistory =
  async (id) => {

    const response =
      await api.get(
        `/vendor/replacement-requests/${id}/dispatch-history`
      );

    return response.data;
  };


/**
 * =========================================================
 * ACCEPT REPLACEMENT REQUEST
 * =========================================================
 *
 * Approved
 *    ↓
 * Vendor Accepted
 *
 * PATCH
 * /api/vendor/replacement-requests/:id/accept
 */

export const acceptReplacementRequest =
  async (
    id,
    vendorRemarks = ""
  ) => {

    const response =
      await api.patch(
        `/vendor/replacement-requests/${id}/accept`,
        {
          vendorRemarks,
        }
      );

    return response.data;
  };


/**
 * =========================================================
 * LINK REPLACEMENT DISPATCH
 * =========================================================
 *
 * This will be used in the NEXT step.
 */

export const linkReplacementDispatch =
  async (
    id,
    dispatchData
  ) => {

    const response =
      await api.patch(
        `/vendor/replacement-requests/${id}/dispatch`,
        dispatchData
      );

    return response.data;
  };


const vendorReplacementRequestService = {

  getVendorReplacementRequests,

  getVendorReplacementRequestById,

  getReplacementDispatchHistory,

  acceptReplacementRequest,

  linkReplacementDispatch,

};


export default vendorReplacementRequestService;