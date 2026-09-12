import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getDashboardAnalytics } from "../services/dashboardService";

import DashboardCards from "../dashboard/DashboardCards";
import DashboardCharts from "../dashboard/DashboardCharts";
import VendorPerformance from "../dashboard/VendorPerformance";
import RecentActivities from "../dashboard/RecentActivities";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-lg font-medium">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Welcome to Vendor Rating Management System
          </p>
        </div>

        <DashboardCards analytics={analytics} />

        <DashboardCharts analytics={analytics} />

        <div className="grid lg:grid-cols-2 gap-6">
          <VendorPerformance analytics={analytics} />
          <RecentActivities analytics={analytics} />
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;