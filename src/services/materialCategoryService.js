import api from "./api";

/**
 * ================================
 * Material Category Dashboard
 * ================================
 */
export const getCategoryDashboard = async () => {
  const response = await api.get("/material-categories/dashboard");
  return response.data;
};

/**
 * ================================
 * Get All Material Categories
 * ================================
 */
export const getAllCategories = async (
  page = 1,
  limit = 10,
  search = "",
  status = ""
) => {
  const response = await api.get("/material-categories", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};

/**
 * ================================
 * Get Material Category By ID
 * ================================
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/material-categories/${id}`);
  return response.data;
};

/**
 * ================================
 * Create Material Category
 * ================================
 */
export const createCategory = async (categoryData) => {
  const response = await api.post(
    "/material-categories",
    categoryData
  );

  return response.data;
};

/**
 * ================================
 * Update Material Category
 * ================================
 */
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(
    `/material-categories/${id}`,
    categoryData
  );

  return response.data;
};

/**
 * ================================
 * Delete Material Category
 * ================================
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/material-categories/${id}`
  );

  return response.data;
};

/**
 * ================================
 * Get Category Hierarchy
 * ================================
 */
export const getCategoryHierarchy = async () => {
  const response = await api.get(
    "/material-categories/hierarchy"
  );

  return response.data;
};