import React from "react";

const PaymentStatusBadge = ({ status }) => {
  const styles = {
    Unpaid: "bg-red-50 text-red-700 border-red-200",
    "Partially Paid": "bg-yellow-50 text-yellow-800 border-yellow-200",
    Paid: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status || "Unpaid"}
    </span>
  );
};

export default PaymentStatusBadge;

