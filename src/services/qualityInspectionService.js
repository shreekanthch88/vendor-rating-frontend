import api from "./api";

/**
 * =========================================================
 * QUALITY INSPECTION SERVICE
 * =========================================================
 */

export const getAllQualityInspections = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  result = "",
  vendor = ""
) => {

  const response =
    await api.get(
      "/quality-inspections",
      {
        params: {
          page,
          limit,
          search,
          status,
          result,
          vendor,
        },
      }
    );

  return response.data;
};


/**
 * =========================================================
 * GET QUALITY INSPECTIONS ELIGIBLE FOR REPLACEMENT
 * =========================================================
 *
 * Returns completed Quality Inspections where:
 *
 * replacementRequired = true
 *
 * Workflow:
 *
 * Quality Inspection
 *        ↓
 * Completed
 *        ↓
 * Replacement Required
 *        ↓
 * Create Replacement Request
 */
export const getReplacementEligibleQualityInspections =
  async () => {

    const response =
      await api.get(
        "/quality-inspections/replacement-eligible"
      );

    return response.data;
  };


/**
 * =========================================================
 * GET QUALITY INSPECTION DASHBOARD SUMMARY
 * =========================================================
 */

export const getQualityInspectionDashboardSummary =
  async () => {

    const response =
      await api.get(
        "/quality-inspections/dashboard-summary"
      );

    return response.data;
  };


/**
 * =========================================================
 * GET QUALITY INSPECTION BY ID
 * =========================================================
 */

export const getQualityInspectionById =
  async (id) => {

    const response =
      await api.get(
        `/quality-inspections/${id}`
      );

    return response.data;
  };


/**
 * =========================================================
 * GET ELIGIBLE GOODS RECEIPTS
 * =========================================================
 */

export const getEligibleGoodsReceipts =
  async () => {

    const response =
      await api.get(
        "/quality-inspections/eligible-grns"
      );

    return response.data;
  };


/**
 * =========================================================
 * GET GOODS RECEIPT FOR INSPECTION
 * =========================================================
 */

export const getGoodsReceiptForInspection =
  async (goodsReceiptId) => {

    const response =
      await api.get(
        `/quality-inspections/goods-receipts/${goodsReceiptId}`
      );

    return response.data;
  };


/**
 * =========================================================
 * CREATE QUALITY INSPECTION
 * =========================================================
 */

export const createQualityInspection =
  async (goodsReceiptId) => {

    const response =
      await api.post(
        "/quality-inspections",
        {
          goodsReceiptId,
        }
      );

    return response.data;
  };


/**
 * =========================================================
 * UPDATE QUALITY INSPECTION
 * =========================================================
 */

export const updateQualityInspection =
  async (
    id,
    inspectionData
  ) => {

    const response =
      await api.put(
        `/quality-inspections/${id}`,
        inspectionData
      );

    return response.data;
  };


/**
 * =========================================================
 * COMPLETE QUALITY INSPECTION
 * =========================================================
 */

export const completeQualityInspection =
  async (id) => {

    const response =
      await api.patch(
        `/quality-inspections/${id}/complete`
      );

    return response.data;
  };


/**
 * =========================================================
 * GET PO QUALITY INSPECTION HISTORY
 * =========================================================
 */

export const getPOQualityInspectionHistory =
  async (purchaseOrderId) => {

    const response =
      await api.get(
        `/quality-inspections/history/po/${purchaseOrderId}`
      );

    return response.data;
  };


/**
 * =========================================================
 * GET VENDOR QUALITY INSPECTION HISTORY
 * =========================================================
 */

export const getVendorQualityInspectionHistory =
  async (vendorId) => {

    const response =
      await api.get(
        `/quality-inspections/history/vendor/${vendorId}`
      );

    return response.data;
  };


/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

export const getQualityInspectionAnalytics = async (params = {}) => {
  const response = await api.get("/quality-inspections/analytics", {
    params,
  });
  return response.data;
};

const qualityInspectionService = {

  getAllQualityInspections,

  getReplacementEligibleQualityInspections,

  getQualityInspectionDashboardSummary,

  getQualityInspectionAnalytics,

  getQualityInspectionById,

  getEligibleGoodsReceipts,

  getGoodsReceiptForInspection,

  createQualityInspection,

  updateQualityInspection,

  completeQualityInspection,

  getPOQualityInspectionHistory,

  getVendorQualityInspectionHistory,

};


export default qualityInspectionService;