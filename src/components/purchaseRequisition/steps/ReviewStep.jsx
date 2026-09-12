const ReviewStep = ({ formData, materialItems }) => {
  const grandTotal = materialItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0) * (Number(item.estimatedCost) || 0),
    0
  );

  const totalItems = materialItems.length;

  const totalQuantity = materialItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Basic Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Purchase Requisition Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <label className="text-sm text-gray-500">
              PR Number
            </label>

            <p className="font-semibold">
              {formData.prNumber || "Auto Generated"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Department
            </label>

            <p className="font-semibold">
              {formData.department}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Required Date
            </label>

            <p className="font-semibold">
              {formData.requiredDate}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Priority
            </label>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                formData.priority === "Critical"
                  ? "bg-red-100 text-red-700"
                  : formData.priority === "High"
                  ? "bg-orange-100 text-orange-700"
                  : formData.priority === "Medium"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {formData.priority}
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Purpose
            </label>

            <p className="font-semibold whitespace-pre-wrap">
              {formData.purpose}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Remarks
            </label>

            <p className="font-semibold whitespace-pre-wrap">
              {formData.remarks || "-"}
            </p>
          </div>

        </div>

      </div>

      {/* Material Summary */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Material Summary
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Material
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

              </tr>

            </thead>

            <tbody>

              {materialItems.map((item, index) => {

                const lineTotal =
                  (Number(item.quantity) || 0) *
                  (Number(item.estimatedCost) || 0);

                return (
                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="px-4 py-3">
                      {item.materialName}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.unit}
                    </td>

                    <td className="px-4 py-3 text-right">
                      ₹ {Number(item.estimatedCost).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      ₹ {lineTotal.toLocaleString()}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* Financial Summary */}
      <div className="rounded-xl border bg-blue-50 p-6">

        <h2 className="mb-5 text-xl font-semibold text-blue-700">
          Financial Summary
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-lg bg-white p-5 text-center shadow">

            <p className="text-gray-500">
              Total Items
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {totalItems}
            </h3>

          </div>

          <div className="rounded-lg bg-white p-5 text-center shadow">

            <p className="text-gray-500">
              Total Quantity
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {totalQuantity}
            </h3>

          </div>

          <div className="rounded-lg bg-white p-5 text-center shadow">

            <p className="text-gray-500">
              Grand Total
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-700">
              ₹ {grandTotal.toLocaleString()}
            </h3>

          </div>

        </div>

      </div>

      {/* Final Message */}
      <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-5">

        <h3 className="font-semibold text-green-700">
          Ready to Submit
        </h3>

        <p className="mt-2 text-gray-600">
          Please review all information carefully before submitting
          the Purchase Requisition. Once submitted, it will be sent
          for approval and cannot be edited unless returned for
          changes.
        </p>

      </div>

    </div>
  );
};

export default ReviewStep;