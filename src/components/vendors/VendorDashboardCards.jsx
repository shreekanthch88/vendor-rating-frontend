import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Ban,
} from "lucide-react";

import { getVendorDashboard } from "../../services/vendorService";

const VendorDashboardCards = () => {
  const [dashboard, setDashboard] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingVendors: 0,
    blacklistedVendors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getVendorDashboard();

      setDashboard({
        totalVendors: data.dashboard.totalVendors || 0,
        activeVendors: data.dashboard.activeVendors || 0,
        pendingVendors: data.dashboard.pendingVendors || 0,
        blacklistedVendors: data.dashboard.blacklistedVendors || 0,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Vendors",
      value: dashboard.totalVendors,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "Active Vendors",
      value: dashboard.activeVendors,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      title: "Pending Vendors",
      value: dashboard.pendingVendors,
      icon: Clock3,
      color: "bg-yellow-500",
    },
    {
      title: "Blacklisted",
      value: dashboard.blacklistedVendors,
      icon: Ban,
      color: "bg-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-full p-4 text-white ${card.color}`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VendorDashboardCards;