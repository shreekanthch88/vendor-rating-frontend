const PRIORITY_STYLES = {
  Low: {
    bg: "bg-green-100",
    text: "text-green-700",
  },
  Medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  High: {
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  Critical: {
    bg: "bg-red-100",
    text: "text-red-700",
  },
};

const PurchaseOrderPriorityBadge = ({
  priority = "Low",
}) => {

  const style =
    PRIORITY_STYLES[priority] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
    };

  return (

    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {priority}
    </span>

  );

};

export default PurchaseOrderPriorityBadge;