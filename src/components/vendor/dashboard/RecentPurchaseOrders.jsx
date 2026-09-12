import { Eye } from "lucide-react";

const orders = [
  {
    poNumber: "PO-2026-001",
    material: "Steel Rods",
    amount: "₹ 2,45,000",
    date: "08 Aug 2026",
    status: "Approved",
  },
  {
    poNumber: "PO-2026-002",
    material: "Copper Wire",
    amount: "₹ 1,80,000",
    date: "06 Aug 2026",
    status: "Pending",
  },
  {
    poNumber: "PO-2026-003",
    material: "Industrial Paint",
    amount: "₹ 92,500",
    date: "04 Aug 2026",
    status: "Delivered",
  },
  {
    poNumber: "PO-2026-004",
    material: "PVC Pipes",
    amount: "₹ 3,10,000",
    date: "02 Aug 2026",
    status: "In Transit",
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Delivered":
      return "bg-blue-100 text-blue-700";

    case "In Transit":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const RecentPurchaseOrders = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Recent Purchase Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest purchase orders received
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          View All
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b bg-slate-50">

              <th className="px-4 py-3 text-left text-sm font-semibold">
                PO Number
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Material
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Status
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.poNumber}
                className="border-b hover:bg-slate-50"
              >

                <td className="px-4 py-4 font-medium">
                  {order.poNumber}
                </td>

                <td className="px-4 py-4">
                  {order.material}
                </td>

                <td className="px-4 py-4 font-semibold">
                  {order.amount}
                </td>

                <td className="px-4 py-4">
                  {order.date}
                </td>

                <td className="px-4 py-4 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="px-4 py-4">

                  <div className="flex justify-center">

                    <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">

                      <Eye size={18} />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentPurchaseOrders;