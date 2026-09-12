import { useState, useEffect } from "react";
import { XCircle, X } from "lucide-react";

const RejectPurchaseRequisitionModal = ({
  isOpen,
  onClose,
  requisition,
  onReject,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen || !requisition) return null;

  const handleReject = async () => {
    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }

    try {
      setLoading(true);

      await onReject(requisition, reason);

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to reject Purchase Requisition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-3">

              <XCircle
                size={28}
                className="text-red-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Reject Purchase Requisition
              </h2>

              <p className="text-sm text-gray-500">
                Provide a reason for rejection.
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

        <div className="space-y-6 p-6">

          <div className="rounded-lg bg-gray-50 p-5">

            <div className="grid grid-cols-2 gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  PR Number
                </p>

                <p className="font-semibold">
                  {requisition.prNumber}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Department
                </p>

                <p className="font-semibold">
                  {requisition.department}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Requested By
                </p>

                <p className="font-semibold">
                  {requisition.requestedBy?.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Priority
                </p>

                <p className="font-semibold">
                  {requisition.priority}
                </p>

              </div>

            </div>

          </div>

          {/* Rejection Reason */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Rejection Reason
              <span className="text-red-500"> *</span>

            </label>

            <textarea
              rows={6}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);

                if (error) setError("");
              }}
              placeholder="Enter the reason for rejecting this Purchase Requisition..."
              className="w-full rounded-lg border px-4 py-3 focus:border-red-500 focus:outline-none"
            />

            <div className="mt-2 flex justify-between">

              <span className="text-sm text-red-600">

                {error}

              </span>

              <span className="text-sm text-gray-400">

                {reason.length}/500

              </span>

            </div>

          </div>
                    {/* Warning */}

          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

            <h3 className="font-semibold text-yellow-700">
              Important
            </h3>

            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">

              <li>
                The requester will be notified about the rejection.
              </li>

              <li>
                The rejection reason will be stored in the audit history.
              </li>

              <li>
                This Purchase Requisition can be edited and resubmitted later.
              </li>

            </ul>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-5">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={loading || !reason.trim()}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={18} />

            {loading
              ? "Rejecting..."
              : "Reject Purchase Requisition"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default RejectPurchaseRequisitionModal;