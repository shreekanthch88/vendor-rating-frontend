import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FileText,
  CheckCircle2,
  Send,
  PackageCheck,
  XCircle,
  Truck,
  Ban,
  IndianRupee,
} from "lucide-react";
import { getPurchaseOrderDashboard } from "../../services/purchaseOrderService";

const PurchaseOrderDashboardCards = ({
  statistics,
  selectedStatus = "",
  onSelectStatus,
  refreshTrigger = 0,
}) => {
  const [dashboard, setDashboard] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    delivered: 0,
    cancelled: 0,
    totalValue: 0,
  });

  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getPurchaseOrderDashboard();
      if (response && response.data) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error("Dashboard card load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]);

  useEffect(() => {
    if (statistics && Object.keys(statistics).length > 0) {
      setDashboard((prev) => ({
        ...prev,
        ...statistics,
      }));
    }
  }, [statistics]);

  const cards = [
    {
      title: "Total POs",
      value: dashboard.total || 0,
      icon: ShoppingCart,
      bg: "bg-blue-50 hover:bg-blue-100/70 border-blue-200",
      iconBg: "bg-blue-600",
      status: "",
    },
    {
      title: "Draft",
      value: dashboard.draft || 0,
      icon: FileText,
      bg: "bg-slate-50 hover:bg-slate-100/70 border-slate-200",
      iconBg: "bg-slate-600",
      status: "Draft",
    },
    {
      title: "Approved",
      value: dashboard.approved || 0,
      icon: CheckCircle2,
      bg: "bg-green-50 hover:bg-green-100/70 border-green-200",
      iconBg: "bg-green-600",
      status: "Approved",
    },
    {
      title: "Sent",
      value: dashboard.sent || 0,
      icon: Send,
      bg: "bg-cyan-50 hover:bg-cyan-100/70 border-cyan-200",
      iconBg: "bg-cyan-600",
      status: "Sent",
    },
    {
      title: "Accepted",
      value: dashboard.accepted || 0,
      icon: PackageCheck,
      bg: "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200",
      iconBg: "bg-emerald-600",
      status: "Accepted",
    },
    {
      title: "Rejected",
      value: dashboard.rejected || 0,
      icon: XCircle,
      bg: "bg-red-50 hover:bg-red-100/70 border-red-200",
      iconBg: "bg-red-600",
      status: "Rejected",
    },
    {
      title: "Delivered",
      value: dashboard.delivered || 0,
      icon: Truck,
      bg: "bg-orange-50 hover:bg-orange-100/70 border-orange-200",
      iconBg: "bg-orange-600",
      status: "Delivered",
    },
    {
      title: "Cancelled",
      value: dashboard.cancelled || 0,
      icon: Ban,
      bg: "bg-gray-50 hover:bg-gray-100/70 border-gray-300",
      iconBg: "bg-gray-600",
      status: "Cancelled",
    },
    {
      title: "Purchase Value",
      value: `₹ ${Number(dashboard.totalValue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bg: "bg-yellow-50 hover:bg-yellow-100/70 border-yellow-200",
      iconBg: "bg-yellow-600",
      status: undefined, // Non-filterable metric
    },
  ];

  const handleCardClick = (cardStatus) => {
    if (cardStatus === undefined || !onSelectStatus) return;
    // If clicking the currently selected card, clear filter (show all)
    if (selectedStatus === cardStatus) {
      onSelectStatus("");
    } else {
      onSelectStatus(cardStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = card.status !== undefined && Boolean(onSelectStatus);
        const isSelected =
          isClickable &&
          (card.status === selectedStatus ||
            (card.status === "" && selectedStatus === ""));

        return (
          <div
            key={card.title}
            onClick={() => isClickable && handleCardClick(card.status)}
            className={`${card.bg} rounded-2xl border p-5 shadow-xs transition-all duration-200 ${
              isClickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
            } ${
              isSelected && card.status !== ""
                ? "ring-2 ring-blue-600 ring-offset-2 shadow-md bg-blue-100/60"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {loading ? "..." : card.value}
                </h2>
                {isClickable && card.status !== "" && (
                  <span className="mt-1 inline-block text-[11px] text-blue-600 font-medium">
                    {isSelected ? "● Filter active (click to clear)" : "Click to filter"}
                  </span>
                )}
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-sm`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseOrderDashboardCards;