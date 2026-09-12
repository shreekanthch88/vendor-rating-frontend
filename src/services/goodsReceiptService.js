import api from "./api";

/**
 * =========================================================
 * GET ALL GOODS RECEIPTS
 * =========================================================
 */
export const getAllGoodsReceipts = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  receiptType = ""
) => {
  const response = await api.get(
    "/goods-receipts",
    {
      params: {
        page,
        limit,
        search,
        status,
        receiptType,
      },
    }
  );

  return response.data;
};


/**
 * =========================================================
 * GET GOODS RECEIPT BY ID
 * =========================================================
 */
export const getGoodsReceiptById = async (
  id
) => {
  const response = await api.get(
    `/goods-receipts/${id}`
  );

  return response.data;
};


/**
 * =========================================================
 * GET ELIGIBLE DELIVERED DISPATCHES
 * =========================================================
 */
export const getEligibleDispatches = async () => {
  const response = await api.get(
    "/goods-receipts/eligible-dispatches"
  );

  return response.data;
};


/**
 * =========================================================
 * GET PURCHASE ORDER RECEIPT HISTORY
 * =========================================================
 */
export const getPOReceiptHistory = async (
  purchaseOrderId
) => {
  const response = await api.get(
    `/goods-receipts/history/po/${purchaseOrderId}`
  );

  return response.data;
};


/**
 * =========================================================
 * CREATE GOODS RECEIPT
 * =========================================================
 */
export const createGoodsReceipt = async (
  goodsReceiptData
) => {
  const response = await api.post(
    "/goods-receipts",
    goodsReceiptData
  );

  return response.data;
};


/**
 * =========================================================
 * SAVE DRAFT GOODS RECEIPT
 * =========================================================
 */
export const saveDraftGoodsReceipt = async (
  goodsReceiptData
) => {
  const response = await api.post(
    "/goods-receipts/draft",
    goodsReceiptData
  );

  return response.data;
};


/**
 * =========================================================
 * UPDATE DRAFT GOODS RECEIPT
 * =========================================================
 */
export const updateGoodsReceipt = async (
  id,
  goodsReceiptData
) => {
  const response = await api.put(
    `/goods-receipts/${id}`,
    goodsReceiptData
  );

  return response.data;
};


/**
 * =========================================================
 * SUBMIT DRAFT GOODS RECEIPT
 * =========================================================
 */
export const submitGoodsReceipt = async (
  id
) => {
  const response = await api.patch(
    `/goods-receipts/${id}/submit`
  );

  return response.data;
};