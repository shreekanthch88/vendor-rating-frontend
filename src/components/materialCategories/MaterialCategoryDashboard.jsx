import { useEffect, useState } from "react";
import {
  Boxes,
  CheckCircle,
  XCircle,
  FolderTree,
} from "lucide-react";

import { getCategoryDashboard } from "../../services/materialCategoryService";

const MaterialCategoryDashboardCards = () => {
  const [dashboard, setDashboard] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    rootCategories: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getCategoryDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Categories",
      value: dashboard.totalCategories,
      icon: Boxes,
      color: "bg-blue-500",
    },
    {
      title: "Active Categories",
      value: dashboard.activeCategories,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Inactive Categories",
      value: dashboard.inactiveCategories,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      title: "Root Categories",
      value: dashboard.rootCategories,
      icon: FolderTree,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-gray-200"
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
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-lg p-3 text-white ${card.color}`}
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

export default MaterialCategoryDashboardCards;