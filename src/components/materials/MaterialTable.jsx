import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const MaterialTable = ({
  materials = [],
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-center text-gray-500">
          Loading materials...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold">
                Material Code
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Material Name
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Category
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Unit
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Standard Cost
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Preferred Vendor
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {materials.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-8 text-center text-gray-500"
                >
                  No materials found.
                </td>
              </tr>
            ) : (
              materials.map((material) => (
                <tr
                  key={material._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    {material.materialCode}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {material.materialName}
                  </td>

                  <td className="px-5 py-4">
                    {material.category?.categoryName || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {material.unitOfMeasure}
                  </td>

                  <td className="px-5 py-4">
                    ₹
                    {Number(
                      material.standardCost
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    {material.preferredVendor?.vendorName ||
                      "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        material.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {material.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          onView(material)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() =>
                          onEdit(material)
                        }
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          onDelete(material)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default MaterialTable;