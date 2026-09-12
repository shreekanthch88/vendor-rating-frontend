import { deleteVendor } from "../../services/vendorService";

const DeleteVendorModal = ({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}) => {
  if (!isOpen || !vendor) return null;

  const handleDelete = async () => {
    try {
      await deleteVendor(vendor._id);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to delete vendor.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        <div className="border-b p-5">
          <h2 className="text-xl font-bold text-red-600">
            Delete Vendor
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete
          </p>

          <p className="mt-2 text-lg font-semibold">
            {vendor.vendorName}
          </p>

          <p className="mt-4 text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t p-5">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteVendorModal;