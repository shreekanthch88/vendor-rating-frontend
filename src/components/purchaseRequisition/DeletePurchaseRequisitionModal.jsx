import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

const DeletePurchaseRequisitionModal = ({
  isOpen,
  onClose,
  requisition,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !requisition) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await onDelete(requisition._id);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to delete Purchase Requisition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle
                size={26}
                className="text-red-600"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Delete Purchase Requisition
              </h2>

              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <div className="rounded-lg border border-red-200 bg-red-50 p-5">

            <p className="text-gray-700">
              Are you sure you want to delete this Purchase
              Requisition?
            </p>

            <div className="mt-4 space-y-2 rounded-lg bg-white p-4">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  PR Number
                </span>

                <span className="font-semibold">
                  {requisition.prNumber}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Department
                </span>

                <span className="font-semibold">
                  {requisition.department}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Requested By
                </span>

                <span className="font-semibold">
                  {requisition.requestedBy?.name}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Status
                </span>

                <span className="font-semibold">
                  {requisition.status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Estimated Amount
                </span>

                <span className="font-semibold">
                  ₹{" "}
                  {Number(
                    requisition.totalEstimatedAmount || 0
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          </div>

          {requisition.status !== "Draft" && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

              <p className="text-sm text-yellow-700">

                Only Draft Purchase Requisitions should normally be
                deleted. Submitted or Approved requisitions are
                usually cancelled instead of deleted.

              </p>

            </div>
          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-5">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Purchase Requisition"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeletePurchaseRequisitionModal;