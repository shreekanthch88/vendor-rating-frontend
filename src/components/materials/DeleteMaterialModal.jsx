import { deleteMaterial } from "../../services/materialService";
import { toast } from "react-toastify";

const DeleteMaterialModal = ({
  isOpen,
  onClose,
  material,
  onSuccess,
}) => {
  if (!isOpen || !material) return null;

  const handleDelete = async () => {
    try {
      await deleteMaterial(material._id);

      toast.success("Material deleted successfully.");

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete material."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-red-600">
            Delete Material
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">

          <p className="text-gray-700">
            Are you sure you want to delete this material?
          </p>

          <div className="rounded-lg border bg-gray-50 p-4">

            <p>
              <strong>Material Code:</strong>{" "}
              {material.materialCode}
            </p>

            <p>
              <strong>Material Name:</strong>{" "}
              {material.materialName}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {material.category?.categoryName || "-"}
            </p>

          </div>

          <p className="text-sm text-red-500">
            This action performs a soft delete. The material will no longer
            appear in the application but will remain in the database for
            audit purposes.
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

export default DeleteMaterialModal;