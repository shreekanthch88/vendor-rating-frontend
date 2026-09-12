import api from "./api";

/**
 * =========================================================
 * NOTIFICATION SERVICE (FRONTEND)
 * =========================================================
 */

// =========================================================
// ADMIN / STAFF NOTIFICATIONS
// =========================================================

export const getNotifications = async ({
  page = 1,
  limit = 20,
  filter = "all",
  category = "",
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter && filter !== "all") params.append("filter", filter);
  if (category) params.append("category", category);

  const res = await api.get(`/notifications?${params.toString()}`);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data.unreadCount || 0;
};

export const markAsRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await api.patch("/notifications/mark-all-read");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

export const clearAllNotifications = async () => {
  const res = await api.delete("/notifications/clear-all");
  return res.data;
};

// =========================================================
// VENDOR PORTAL NOTIFICATIONS
// =========================================================

export const getVendorNotifications = async ({
  page = 1,
  limit = 20,
  filter = "all",
  category = "",
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter && filter !== "all") params.append("filter", filter);
  if (category) params.append("category", category);

  const res = await api.get(`/vendor/notifications?${params.toString()}`);
  return res.data;
};

export const getVendorUnreadCount = async () => {
  const res = await api.get("/vendor/notifications/unread-count");
  return res.data.unreadCount || 0;
};

export const markVendorAsRead = async (id) => {
  const res = await api.patch(`/vendor/notifications/${id}/read`);
  return res.data;
};

export const markVendorAllAsRead = async () => {
  const res = await api.patch("/vendor/notifications/mark-all-read");
  return res.data;
};

export const deleteVendorNotification = async (id) => {
  const res = await api.delete(`/vendor/notifications/${id}`);
  return res.data;
};

export const clearAllVendorNotifications = async () => {
  const res = await api.delete("/vendor/notifications/clear-all");
  return res.data;
};
