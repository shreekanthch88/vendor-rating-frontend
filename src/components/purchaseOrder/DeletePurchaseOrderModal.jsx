import { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  FileText,
} from "lucide-react";

import {
  deletePurchaseOrder,
} from "../../services/purchaseOrderService";

const DeletePurchaseOrderModal = ({
  isOpen,
  purchaseOrder,
  onClose,
  onSuccess,
}) => {

  const [loading, setLoading] =
    useState(false);

  /**
   * ==========================================
   * Don't render when closed
   * ==========================================
   */

  if (!isOpen || !purchaseOrder) {
    return null;
  }

  /**
   * ==========================================
   * Format Currency
   * ==========================================
   */

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  /**
   * ==========================================
   * Format Date
   * ==========================================
   */

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  /**
   * ==========================================
   * Delete Purchase Order
   * ==========================================
   */

  const handleDeletePurchaseOrder = async () => {

    try {

      setLoading(true);

      await deletePurchaseOrder(
        purchaseOrder._id
      );

      onSuccess?.();

      onClose?.();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete Purchase Order."
      );

    } finally {

      setLoading(false);

    }

  };
    return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-red-100 p-3">

              <Trash2
                size={28}
                className="text-red-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Delete Purchase Order

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                This action is permanent and cannot be undone.

              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* ==========================================
            Body
        ========================================== */}

        <div className="space-y-6 p-6">

          {/* ==========================================
              Warning Banner
          ========================================== */}

          <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">

            <AlertTriangle
              size={32}
              className="mt-1 text-red-600"
            />

            <div>

              <h3 className="text-lg font-bold text-red-700">

                Warning!

              </h3>

              <p className="mt-2 text-sm leading-6 text-red-600">

                You are about to permanently delete this Purchase Order.

                Once deleted, the Purchase Order and its associated
                information cannot be recovered.

              </p>

            </div>

          </div>

                    {/* ==========================================
              Purchase Order Details
          ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

            <div className="mb-5 flex items-center gap-3">

              <FileText
                size={22}
                className="text-blue-600"
              />

              <h3 className="text-xl font-bold text-slate-800">
                Purchase Order Details
              </h3>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Purchase Order Number
                </p>

                <p className="mt-1 font-semibold">
                  {purchaseOrder.poNumber || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Vendor Name
                </p>

                <p className="mt-1 font-semibold">
                  {purchaseOrder.vendor?.vendorName || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Purchase Requisition
                </p>

                <p className="mt-1 font-semibold">
                  {purchaseOrder.purchaseRequisition?.prNumber ||
                    purchaseOrder.purchaseRequisition ||
                    "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Order Date
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(purchaseOrder.orderDate)}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Expected Delivery
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(
                    purchaseOrder.expectedDeliveryDate
                  )}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Priority
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    purchaseOrder.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : purchaseOrder.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {purchaseOrder.priority || "-"}
                </span>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    purchaseOrder.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : purchaseOrder.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : purchaseOrder.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {purchaseOrder.status || "-"}
                </span>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Total Amount
                </p>

                <p className="mt-1 text-lg font-bold text-green-700">
                  ₹ {formatCurrency(
                    purchaseOrder.grandTotal ?? purchaseOrder.totalAmount ?? 0
                  )}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              Confirmation Message
          ========================================== */}

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="text-center text-base font-medium text-red-700">

              Are you sure you want to permanently delete

              <span className="mx-1 font-bold">

                {purchaseOrder.poNumber}

              </span>

              ?

            </p>

            <p className="mt-2 text-center text-sm text-red-600">

              This action cannot be undone.

            </p>

          </div>
                  {/* ==========================================
            Footer
        ========================================== */}

        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-5">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-6 py-2.5 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDeletePurchaseOrder}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Purchase Order"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default DeletePurchaseOrderModal;