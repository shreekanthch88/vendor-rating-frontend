import { deleteCategory } from "../../services/materialCategoryService";
import { toast } from "react-toastify";

const DeleteMaterialCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    try {
      await deleteCategory(category._id);

      toast.success("Material category deleted successfully.");

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-red-600">
            Delete Material Category
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <p className="text-gray-700">
            Are you sure you want to delete this material category?
          </p>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p>
              <strong>Category Code:</strong>{" "}
              {category.categoryCode}
            </p>

            <p>
              <strong>Category Name:</strong>{" "}
              {category.categoryName}
            </p>
          </div>

          <p className="text-sm text-red-500">
            This action performs a soft delete and cannot be seen in the
            application unless restored.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>

      </div>

    </div>
  );
};

export default DeleteMaterialCategoryModal;