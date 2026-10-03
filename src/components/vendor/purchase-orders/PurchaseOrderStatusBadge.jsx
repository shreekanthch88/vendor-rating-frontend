import React from "react";
import {
  Clock3,
  Send,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  Ban,
} from "lucide-react";

const PurchaseOrderStatusBadge = ({
  status = "",
}) => {
  const statusConfig = {
    Draft: {
      label: "Draft",
      icon: Clock3,
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },

    Submitted: {
      label: "Submitted",
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    Approved: {
      label: "Approved",
      icon: CheckCircle2,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    Sent: {
      label: "Sent",
      icon: Send,
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
    },

    Accepted: {
      label: "Accepted",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    Rejected: {
      label: "Rejected",
      icon: XCircle,
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    "Partially Delivered": {
      label: "Partially Delivered",
      icon: Truck,
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    Delivered: {
      label: "Delivered",
      icon: PackageCheck,
      className:
        "bg-green-50 text-green-700 border-green-200",
    },

    Closed: {
      label: "Closed",
      icon: CheckCircle2,
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },

    Cancelled: {
      label: "Cancelled",
      icon: Ban,
      className:
        "bg-gray-100 text-gray-600 border-gray-200",
    },
  };

  const config =
    statusConfig[status] || {
      label: status || "Unknown",
      icon: Clock3,
      className:
        "bg-slate-100 text-slate-600 border-slate-200",
    };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default PurchaseOrderStatusBadge;