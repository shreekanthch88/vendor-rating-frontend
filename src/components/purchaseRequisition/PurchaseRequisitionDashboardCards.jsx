import { useEffect, useState } from "react";
import {
  ClipboardList,
  FileEdit,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { getPurchaseRequisitionDashboard } from "../../services/purchaseRequisitionService";

const PurchaseRequisitionDashboardCards = ({
  selectedStatus = "",
  onSelectStatus,
  refreshTrigger = 0,
}) => {
  const [dashboard, setDashboard] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getPurchaseRequisitionDashboard();
      const data = response?.data || response;

      setDashboard({
        total: data?.total ?? 0,
        draft: data?.draft ?? 0,
        submitted: data?.submitted ?? 0,
        approved: data?.approved ?? 0,
        rejected: data?.rejected ?? 0,
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
      status: "",
      value: dashboard.total,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
      activeBorder: "ring-2 ring-blue-500 border-blue-500 bg-blue-50/30",
    },
    {
      title: "Draft",
      status: "Draft",
      value: dashboard.draft,
      icon: FileEdit,
      color: "bg-gray-100 text-gray-700",
      activeBorder: "ring-2 ring-gray-500 border-gray-500 bg-gray-50/50",
    },
    {
      title: "Submitted",
      status: "Submitted",
      value: dashboard.submitted,
      icon: Send,
      color: "bg-yellow-100 text-yellow-700",
      activeBorder: "ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50/30",
    },
    {
      title: "Approved",
      status: "Approved",
      value: dashboard.approved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      activeBorder: "ring-2 ring-green-500 border-green-500 bg-green-50/30",
    },
    {
      title: "Rejected",
      status: "Rejected",
      value: dashboard.rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
      activeBorder: "ring-2 ring-red-500 border-red-500 bg-red-50/30",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected =
          Boolean(onSelectStatus) &&
          (card.status === ""
            ? !selectedStatus
            : selectedStatus === card.status);

        return (
          <div
            key={card.title}
            onClick={() => onSelectStatus && onSelectStatus(card.status)}
            role={onSelectStatus ? "button" : undefined}
            tabIndex={onSelectStatus ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSelectStatus && (e.key === "Enter" || e.key === " ")) {
                onSelectStatus(card.status);
              }
            }}
            className={`rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
              onSelectStatus ? "cursor-pointer" : ""
            } ${isSelected ? card.activeBorder + " shadow-md" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
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