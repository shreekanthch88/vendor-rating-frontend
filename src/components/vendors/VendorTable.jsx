import { Eye, Pencil, Trash2, Star } from "lucide-react";

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
          {vendors.map((vendor) => {
            const ratingValue =
              vendor.overallRating != null
                ? vendor.overallRating
                : vendor.performance?.overallRating != null &&
                  vendor.performance.overallRating > 0
                ? Number((vendor.performance.overallRating / 20).toFixed(1))
                : null;

            const scoreValue =
              vendor.overallScore != null
                ? vendor.overallScore
                : vendor.performance?.overallRating != null &&
                  vendor.performance.overallRating > 0
                ? vendor.performance.overallRating
                : null;

            const categoryValue =
              vendor.ratingCategory ||
              vendor.performance?.ratingCategory ||
              null;

            return (
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
                  {ratingValue != null ? (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={15}
                          className="fill-amber-400 text-amber-400 shrink-0"
                        />
                        <span className="font-semibold text-gray-800">
                          {Number(ratingValue).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">/ 5</span>
                        {scoreValue != null && (
                          <span className="text-xs text-gray-400">
                            ({Number(scoreValue).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                      {categoryValue && (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                          {categoryValue}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center text-xs text-gray-400 font-medium">
                      Not Rated
                    </span>
                  )}
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
          );
        })}
      </tbody>
      </table>
    </div>
  );
};

export default VendorTable;