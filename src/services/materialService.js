import api from "./api";

// Dashboard
export const getMaterialDashboard = async () => {
  const response = await api.get("/materials/dashboard");
  return response.data;
};

// Get All Materials
export const getAllMaterials = async (
  page = 1,
  limit = 100,
  search = "",
  status = "Active"
) => {
  const response = await api.get("/materials", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};

// Get Material By Id
export const getMaterialById = async (id) => {
  const response = await api.get(`/materials/${id}`);
  return response.data;
};

// Create Material
export const createMaterial = async (data) => {
  const response = await api.post("/materials", data);
  return response.data;
};

// Update Material
export const updateMaterial = async (id, data) => {
  const response = await api.put(`/materials/${id}`, data);
  return response.data;
};

// Delete Material
export const deleteMaterial = async (id) => {
  const response = await api.delete(`/materials/${id}`);
  return response.data;
};