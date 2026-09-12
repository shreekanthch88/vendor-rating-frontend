import api from "./api";

/**
 * Get all users
 */
export const getAllUsers = async (params = {}) => {
  const response = await api.get("/users", {
    params,
  });

  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};

/**
 * Create user
 */
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);

  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id,
  userData
) => {
  const response = await api.put(
    `/users/${id}`,
    userData
  );

  return response.data;
};

/**
 * Change status
 */
export const updateUserStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/users/${id}/status`,
    { status }
  );

  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};


/**
 * Reset User Password
 */
export const resetUserPassword = async (id, password) => {
  const { data } = await api.patch(
    `/users/${id}/reset-password`,
    { password }
  );

  return data;
};

/**
 * Get User Permissions
 */
export const getUserPermissions = async (id) => {
  const { data } = await api.get(
    `/users/${id}/permissions`
  );

  return data;
};