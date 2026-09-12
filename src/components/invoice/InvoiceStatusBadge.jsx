import React from "react";

const InvoiceStatusBadge = ({ status }) => {
  const styles = {
    Draft: "bg-gray-100 text-gray-700 border-gray-200",
    Submitted: "bg-blue-50 text-blue-700 border-blue-200",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Verified: "bg-teal-50 text-teal-700 border-teal-200",
    Approved: "bg-green-50 text-green-700 border-green-200",
    "Payment Processing": "bg-purple-50 text-purple-700 border-purple-200",
    Paid: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Disputed: "bg-orange-50 text-orange-700 border-orange-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

export default InvoiceStatusBadge;

