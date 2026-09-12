const STATUS_STYLES = {
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Sent: "bg-indigo-100 text-indigo-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Delivered: "bg-cyan-100 text-cyan-700",
  Cancelled: "bg-slate-200 text-slate-700",
  Closed: "bg-purple-100 text-purple-700",
};

const PurchaseOrderStatusBadge = ({
  status = "Draft",
}) => {

  const badgeStyle =
    STATUS_STYLES[status] ||
    "bg-gray-100 text-gray-700";

  return (

    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
    >
      {status}
    </span>

  );

};

export default PurchaseOrderStatusBadge;