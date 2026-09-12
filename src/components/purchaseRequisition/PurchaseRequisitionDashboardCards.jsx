import { useEffect, useState } from "react";
import {
  ClipboardList,
  FileEdit,
  Send,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "lucide-react";

import { getPurchaseRequisitionDashboard } from "../../services/purchaseRequisitionService";

const PurchaseRequisitionDashboardCards = () => {
  const [dashboard, setDashboard] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getPurchaseRequisitionDashboard();

      setDashboard({
        total: response.data?.total || 0,
        draft: response.data?.draft || 0,
        submitted: response.data?.submitted || 0,
        approved: response.data?.approved || 0,
        rejected: response.data?.rejected || 0,
        totalValue: response.data?.totalValue || 0,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total PR",
      value: dashboard.total,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Draft",
      value: dashboard.draft,
      icon: FileEdit,
      color: "bg-gray-100 text-gray-700",
    },
    {
      title: "Submitted",
      value: dashboard.submitted,
      icon: Send,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Approved",
      value: dashboard.approved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Rejected",
      value: dashboard.rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Estimated Value",
      value: `₹ ${dashboard.totalValue.toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
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
                className={`rounded-full p-4 ${card.color}`}
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

export default PurchaseRequisitionDashboardCards;