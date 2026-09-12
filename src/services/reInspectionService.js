import api from "./api";


// =========================================================
// CREATE RE-INSPECTION
// =========================================================

export const createReInspection = async (data) => {
  const response = await api.post(
    "/re-inspections",
    data
  );

  return response.data;
};


// =========================================================
// GET ALL RE-INSPECTIONS
// =========================================================

export const getReInspections = async (params = {}) => {
  const response = await api.get(
    "/re-inspections",
    {
      params,
    }
  );

  return response.data;
};


// =========================================================
// GET RE-INSPECTION BY ID
// =========================================================

export const getReInspectionById = async (id) => {
  const response = await api.get(
    `/re-inspections/${id}`
  );

  return response.data;
};


// =========================================================
// UPDATE RE-INSPECTION
// =========================================================

export const updateReInspection = async (
  id,
  data
) => {
  const response = await api.put(
    `/re-inspections/${id}`,
    data
  );

  return response.data;
};

// =========================================================
// GET RE-INSPECTION HISTORY
// =========================================================

export const getReInspectionHistory = async (
  originalInspectionId
) => {
  const response = await api.get(
    `/re-inspections/history/${originalInspectionId}`
  );

  return response.data;
};

export const getEligibleReplacementReceipts = async (originalInspectionId) => {
  const response = await api.get(
    `/re-inspections/replacement-materials/${originalInspectionId}`
  );

  return response.data;
};
