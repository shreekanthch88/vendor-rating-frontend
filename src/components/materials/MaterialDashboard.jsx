import { useEffect, useState } from "react";
import {
  Boxes,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { getMaterialDashboard } from "../../services/materialService";

const MaterialDashboard = ({ refreshTrigger = 0 }) => {
  const [dashboard, setDashboard] = useState({
    totalMaterials: 0,
    activeMaterials: 0,
    inactiveMaterials: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]);

  const loadDashboard = async () => {
    try {
      const response = await getMaterialDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      title: "Total Materials",
      value: dashboard.totalMaterials,
      icon: Boxes,
      color: "bg-blue-500",
    },
    {
      title: "Active Materials",
      value: dashboard.activeMaterials,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Inactive Materials",
      value: dashboard.inactiveMaterials,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl bg-white p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} rounded-full p-4 text-white`}
            >
              <card.icon size={28} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialDashboard;