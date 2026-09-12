import { useEffect, useState } from "react";

import {
  ShoppingCart,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Send,
  PackageCheck,
  XCircle,
  Truck,
  Ban,
  IndianRupee,
} from "lucide-react";

import { getPurchaseOrderDashboard } from "../../services/purchaseOrderService";

const PurchaseOrderDashboardCards = () => {

  const [dashboard, setDashboard] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    delivered: 0,
    cancelled: 0,
    totalValue: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const response =
        await getPurchaseOrderDashboard();

      setDashboard(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDashboard();

  }, []);

  const cards = [

    {
      title: "Total POs",
      value: dashboard.total,
      icon: ShoppingCart,
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },

    {
      title: "Draft",
      value: dashboard.draft,
      icon: FileText,
      bg: "bg-slate-50",
      iconBg: "bg-slate-500",
    },

    {
      title: "Submitted",
      value: dashboard.submitted,
      icon: ClipboardCheck,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-500",
    },

    {
      title: "Approved",
      value: dashboard.approved,
      icon: CheckCircle2,
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },

    {
      title: "Sent",
      value: dashboard.sent,
      icon: Send,
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-500",
    },

    {
      title: "Accepted",
      value: dashboard.accepted,
      icon: PackageCheck,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },

    {
      title: "Rejected",
      value: dashboard.rejected,
      icon: XCircle,
      bg: "bg-red-50",
      iconBg: "bg-red-500",
    },

    {
      title: "Delivered",
      value: dashboard.delivered,
      icon: Truck,
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
    },

    {
      title: "Cancelled",
      value: dashboard.cancelled,
      icon: Ban,
      bg: "bg-gray-50",
      iconBg: "bg-gray-500",
    },

    {
      title: "Purchase Value",
      value: `₹ ${Number(
        dashboard.totalValue
      ).toLocaleString()}`,
      icon: IndianRupee,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-500",
    },

  ];

  return (

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className={`${card.bg} rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">

                  {card.title}

                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">

                  {loading ? "..." : card.value}

                </h2>

              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} text-white shadow`}
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

export default PurchaseOrderDashboardCards;