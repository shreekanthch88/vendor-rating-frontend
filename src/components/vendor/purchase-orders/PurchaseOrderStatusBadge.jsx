import React from "react";

const PurchaseOrderStatusBadge = ({ status }) => {
  const normalizedStatus =
    String(status || "Unknown").toLowerCase();

  const statusConfig = {
    draft: {
      label: "Draft",
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },

    submitted: {
      label: "Submitted",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    approved: {
      label: "Approved",
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
    },

    sent: {
      label: "Sent",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },

    accepted: {
      label: "Accepted",
      className:
        "bg-green-50 text-green-700 border-green-200",
    },

    rejected: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    "partially delivered": {
      label: "Partially Delivered",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    delivered: {
      label: "Delivered",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    closed: {
      label: "Closed",
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },

    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    unknown: {
      label: "Unknown",
      className:
        "bg-slate-50 text-slate-500 border-slate-200",
    },
  };

  const config =
    statusConfig[normalizedStatus] ||
    statusConfig.unknown;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <span
        className="mr-2 h-1.5 w-1.5 rounded-full bg-current"
      />

      {config.label}
    </span>
  );
};

export default PurchaseOrderStatusBadge;