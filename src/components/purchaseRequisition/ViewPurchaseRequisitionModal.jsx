import { X, CalendarDays, Building2, ClipboardList } from "lucide-react";

const ViewPurchaseRequisitionModal = ({
  isOpen,
  onClose,
  requisition,
}) => {
  if (!isOpen || !requisition) return null;

  const grandTotal =
    requisition.items?.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity) *
          Number(item.estimatedCost),
      0
    ) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="flex h-[90vh] w-[95%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Purchase Requisition Details
            </h2>

            <p className="mt-1 text-gray-500">
              {requisition.prNumber}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Basic Information */}

          <div className="rounded-xl border bg-white shadow-sm">

            <div className="border-b px-6 py-4">

              <h3 className="flex items-center gap-2 text-lg font-semibold">

                <Building2 size={18} />

                Basic Information

              </h3>

            </div>

            <div className="grid grid-cols-2 gap-6 p-6">

              <div>

                <label className="text-sm text-gray-500">
                  PR Number
                </label>

                <p className="font-semibold">
                  {requisition.prNumber}
                </p>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Department
                </label>

                <p className="font-semibold">
                  {requisition.department}
                </p>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Requested By
                </label>

                <p className="font-semibold">
                  {requisition.requestedBy?.name}
                </p>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Required Date
                </label>

                <p className="font-semibold">

                  {new Date(
                    requisition.requiredDate
                  ).toLocaleDateString()}

                </p>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Priority
                </label>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    requisition.priority === "Critical"
                      ? "bg-red-100 text-red-700"
                      : requisition.priority === "High"
                      ? "bg-orange-100 text-orange-700"
                      : requisition.priority === "Medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {requisition.priority}
                </span>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Status
                </label>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    requisition.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : requisition.status === "Submitted"
                      ? "bg-blue-100 text-blue-700"
                      : requisition.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {requisition.status}
                </span>

              </div>

            </div>

          </div>

          {/* Purpose */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h3 className="mb-3 text-lg font-semibold">

              Purpose

            </h3>

            <p className="text-gray-700">

              {requisition.purpose || "-"}

            </p>

          </div>

          {/* Remarks */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h3 className="mb-3 text-lg font-semibold">

              Remarks

            </h3>

            <p className="text-gray-700">

              {requisition.remarks || "-"}

            </p>

          </div>
                    {/* Material Items */}

          <div className="rounded-xl border bg-white shadow-sm">

            <div className="border-b px-6 py-4">

              <h3 className="flex items-center gap-2 text-lg font-semibold">

                <ClipboardList size={18} />

                Material Items

              </h3>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="px-4 py-3 text-left">
                      Material
                    </th>

                    <th className="px-4 py-3 text-left">
                      Code
                    </th>

                    <th className="px-4 py-3 text-center">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-center">
                      UOM
                    </th>

                    <th className="px-4 py-3 text-right">
                      Estimated Cost
                    </th>

                    <th className="px-4 py-3 text-right">
                      Line Total
                    </th>

                    <th className="px-4 py-3">
                      Remarks
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {requisition.items?.map((item, index) => {

                    const lineTotal =
                      Number(item.quantity) *
                      Number(item.estimatedCost);

                    return (

                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-4 py-3">

                          {item.material?.materialName || "-"}

                        </td>

                        <td className="px-4 py-3">

                          {item.material?.materialCode || "-"}

                        </td>

                        <td className="px-4 py-3 text-center">

                          {item.quantity}

                        </td>

                        <td className="px-4 py-3 text-center">

                          {item.unitOfMeasure}

                        </td>

                        <td className="px-4 py-3 text-right">

                          ₹ {Number(item.estimatedCost).toLocaleString()}

                        </td>

                        <td className="px-4 py-3 text-right font-semibold">

                          ₹ {lineTotal.toLocaleString()}

                        </td>

                        <td className="px-4 py-3">

                          {item.remarks || "-"}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* Financial Summary */}

          <div className="rounded-xl bg-blue-50 p-6">

            <h3 className="mb-5 text-xl font-semibold text-blue-700">

              Financial Summary

            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-white p-5 shadow">

                <p className="text-sm text-gray-500">

                  Total Items

                </p>

                <h2 className="mt-2 text-3xl font-bold">

                  {requisition.items?.length || 0}

                </h2>

              </div>

              <div className="rounded-xl bg-white p-5 shadow">

                <p className="text-sm text-gray-500">

                  Total Quantity

                </p>

                <h2 className="mt-2 text-3xl font-bold">

                  {requisition.items?.reduce(
                    (sum, item) =>
                      sum + Number(item.quantity),
                    0
                  )}

                </h2>

              </div>

              <div className="rounded-xl bg-blue-600 p-5 text-white shadow">

                <p className="text-sm opacity-80">

                  Grand Total

                </p>

                <h2 className="mt-2 text-3xl font-bold">

                  ₹ {grandTotal.toLocaleString()}

                </h2>

              </div>

            </div>

          </div>

          {/* Audit Information */}

          <div className="rounded-xl border bg-white shadow-sm">

            <div className="border-b px-6 py-4">

              <h3 className="text-lg font-semibold">

                Audit Information

              </h3>

            </div>

            <div className="grid grid-cols-2 gap-6 p-6">

              <div>

                <label className="text-sm text-gray-500">

                  Created On

                </label>

                <p className="font-semibold">

                  {new Date(
                    requisition.createdAt
                  ).toLocaleString()}

                </p>

              </div>

              <div>

                <label className="text-sm text-gray-500">

                  Last Updated

                </label>

                <p className="font-semibold">

                  {new Date(
                    requisition.updatedAt
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t bg-gray-50 px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default ViewPurchaseRequisitionModal;