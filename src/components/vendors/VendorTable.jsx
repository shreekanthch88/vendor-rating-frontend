import { Eye, Pencil, Trash2 } from "lucide-react";

const VendorTable = ({
  vendors = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading vendors...
      </div>
    );
  }

  if (!vendors.length) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No vendors found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Vendor Code</th>
            <th className="px-4 py-3 text-left">Vendor Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <tr
              key={vendor._id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3">{vendor.vendorCode}</td>

              <td className="px-4 py-3 font-medium">
                {vendor.vendorName}
              </td>

              <td className="px-4 py-3">
                {vendor.vendorCategory}
              </td>

              <td className="px-4 py-3">
                {vendor.overallRating ?? 0}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : vendor.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vendor.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(vendor)}
                    className="rounded p-2 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(vendor)}
                    className="rounded p-2 hover:bg-yellow-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(vendor)}
                    className="rounded p-2 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;