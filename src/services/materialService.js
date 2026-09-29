import api from "./api";

// Dashboard
export const getMaterialDashboard = async () => {
  const response = await api.get("/materials/dashboard");
  return response.data;
};

// Get All Materials
export const getAllMaterials = async (
  pageOrOptions = 1,
  limit = 10,
  search = "",
  status = ""
) => {
  const params = {
    page: 1,
    limit: 10,
    search: "",
    status: "",
  };

  if (typeof pageOrOptions === "object" && pageOrOptions !== null) {
    params.page = pageOrOptions.page || 1;
    params.limit = pageOrOptions.limit || 10;
    params.search = pageOrOptions.search || "";
    params.status = pageOrOptions.status ?? "";
    if (pageOrOptions.category) params.category = pageOrOptions.category;
  } else {
    params.page = pageOrOptions || 1;
    params.limit = limit || 10;
    params.search = search || "";
    params.status = status || "";
  }

  const response = await api.get("/materials", {
    params,
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