import { Eye, Pencil, Trash2 } from "lucide-react";

const MaterialCategoryTable = ({
  categories = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading material categories...
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No material categories found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Category Code</th>
            <th className="px-4 py-3 text-left">Category Name</th>
            <th className="px-4 py-3 text-left">Parent Category</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                {category.categoryCode}
              </td>

              <td className="px-4 py-3 font-medium">
                {category.categoryName}
              </td>

              <td className="px-4 py-3">
                {category.parentCategory?.categoryName || "-"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    category.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(category)}
                    className="rounded p-2 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(category)}
                    className="rounded p-2 hover:bg-yellow-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(category)}
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

export default MaterialCategoryTable;