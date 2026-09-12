import {
  Eye,
  Pencil,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

const PurchaseRequisitionTable = ({
  requisitions = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading Purchase Requisitions...
      </div>
    );
  }

  if (!requisitions.length) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No Purchase Requisitions Found.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";

      case "Submitted":
        return "bg-blue-100 text-blue-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-700";

      case "Medium":
        return "bg-blue-100 text-blue-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Critical":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">

        <thead className="bg-gray-100">
          <tr>

            <th className="px-4 py-3 text-left">
              PR Number
            </th>

            <th className="px-4 py-3 text-left">
              Department
            </th>

            <th className="px-4 py-3 text-left">
              Requested By
            </th>

            <th className="px-4 py-3 text-left">
              Required Date
            </th>

            <th className="px-4 py-3 text-left">
              Priority
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Estimated Amount
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {requisitions.map((pr) => (

            <tr
              key={pr._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-4 py-3 font-semibold">
                {pr.prNumber}
              </td>

              <td className="px-4 py-3">
                {pr.department}
              </td>

              <td className="px-4 py-3">
                {pr.requestedBy?.name || "-"}
              </td>

              <td className="px-4 py-3">
                {pr.requiredDate
                  ? new Date(pr.requiredDate).toLocaleDateString()
                  : "-"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(
                    pr.priority
                  )}`}
                >
                  {pr.priority}
                </span>
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                    pr.status
                  )}`}
                >
                  {pr.status}
                </span>
              </td>

              <td className="px-4 py-3 text-right font-semibold">
                ₹{" "}
                {Number(
                  pr.totalEstimatedAmount || 0
                ).toLocaleString()}
              </td>

              <td className="px-4 py-3">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onView(pr)}
                    className="rounded p-2 hover:bg-blue-100"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  {pr.status === "Draft" && (
                    <>
                      <button
                        onClick={() => onEdit(pr)}
                        className="rounded p-2 hover:bg-yellow-100"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onSubmit(pr)}
                        className="rounded p-2 hover:bg-indigo-100"
                        title="Submit"
                      >
                        <Send size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(pr)}
                        className="rounded p-2 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}

                  {pr.status === "Submitted" && (
                    <>
                      <button
                        onClick={() => onApprove(pr)}
                        className="rounded p-2 hover:bg-green-100"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => onReject(pr)}
                        className="rounded p-2 hover:bg-red-100"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
};

export default PurchaseRequisitionTable;