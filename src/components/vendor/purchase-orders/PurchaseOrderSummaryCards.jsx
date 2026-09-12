import React from "react";
import {
  FileText,
  Send,
  CheckCircle,
  XCircle,
  PackageCheck,
} from "lucide-react";

const PurchaseOrderSummaryCards = ({
  total = 0,
  sent = 0,
  accepted = 0,
  rejected = 0,
  delivered = 0,
}) => {
  const cards = [
    {
      title: "Total Orders",
      value: total,
      icon: FileText,
      description: "All purchase orders",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Response",
      value: sent,
      icon: Send,
      description: "Awaiting your response",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Accepted",
      value: accepted,
      icon: CheckCircle,
      description: "Orders accepted",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      description: "Orders rejected",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Delivered",
      value: delivered,
      icon: PackageCheck,
      description: "Orders delivered",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={21}
                  className={card.iconColor}
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseOrderSummaryCards;