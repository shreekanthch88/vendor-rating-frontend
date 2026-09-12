import React, { useState } from "react";
import {
  X,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  rejectVendorPurchaseOrder,
} from "../../../services/vendorPurchaseOrderService";

const RejectPurchaseOrderModal = ({
  purchaseOrder,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !purchaseOrder) {
    return null;
  }

  const handleReject = async () => {
    const trimmedRemarks = remarks.trim();

    if (!trimmedRemarks) {
      toast.error(
        "Please provide a reason for rejecting the Purchase Order."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await rejectVendorPurchaseOrder(
          purchaseOrder._id,
          trimmedRemarks
        );

      toast.success(
        response?.message ||
          "Purchase Order rejected successfully."
      );

      setRemarks("");

      if (onSuccess) {
        onSuccess(response);
      }

      onClose();
    } catch (error) {
      console.error(
        "Reject Purchase Order Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to reject Purchase Order.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <XCircle
                size={23}
                className="text-red-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Reject Purchase Order
              </h2>

              <p className="text-sm text-slate-500">
                {purchaseOrder.poNumber}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">

          {/* Warning */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              Confirm Purchase Order Rejection
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              Rejecting this Purchase Order will notify
              the organization that your vendor account
              cannot accept this order.
            </p>
          </div>

          {/* PO Summary */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">

            <div>
              <p className="text-xs text-slate-400">
                PO Number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {purchaseOrder.poNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Current Status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {purchaseOrder.status || "Sent"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Expected Delivery
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {purchaseOrder.expectedDeliveryDate
                  ? new Date(
                      purchaseOrder.expectedDeliveryDate
                    ).toLocaleDateString("en-IN")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Grand Total
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                ₹
                {Number(
                  purchaseOrder.grandTotal || 0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

          </div>

          {/* Rejection Reason */}
          <div>
            <label
              htmlFor="rejectionRemarks"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Reason for Rejection
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              id="rejectionRemarks"
              value={remarks}
              onChange={(event) =>
                setRemarks(event.target.value)
              }
              rows={5}
              disabled={loading}
              placeholder="Please explain why this Purchase Order cannot be accepted..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              A rejection reason is required.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Rejecting...
              </>
            ) : (
              <>
                <XCircle size={17} />

                Reject Purchase Order
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RejectPurchaseOrderModal;