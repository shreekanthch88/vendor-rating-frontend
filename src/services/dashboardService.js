import api from "./api";

export const getDashboardAnalytics = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};