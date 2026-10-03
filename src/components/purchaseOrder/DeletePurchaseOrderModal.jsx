import { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
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
  const [loading, setLoading] = useState(false);

  if (!isOpen || !purchaseOrder) {
    return null;
  }

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeletePurchaseOrder = async () => {
    try {
      setLoading(true);
      await deletePurchaseOrder(purchaseOrder._id);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Delete Purchase Order
              </h2>
              <p className="text-xs text-slate-500">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-700">
            <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-600" />
            <div>
              <span className="font-semibold">Confirm Deletion</span>
              <p className="text-xs text-red-600 mt-0.5">
                You are about to delete Purchase Order <strong className="font-semibold text-red-800">{purchaseOrder.poNumber || "-"}</strong>. This record cannot be recovered.
              </p>
            </div>
          </div>

          {/* Compact Order Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">PO Number:</span>
              <span className="font-bold text-slate-800">{purchaseOrder.poNumber || "-"}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Vendor:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                {purchaseOrder.vendor?.vendorName || purchaseOrder.vendor?.companyName || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Order Date:</span>
              <span className="font-medium text-slate-700">{formatDate(purchaseOrder.orderDate)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                {purchaseOrder.status || "Draft"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="text-slate-600 font-semibold">Total Amount:</span>
              <span className="font-bold text-slate-900">
                ₹ {formatCurrency(purchaseOrder.grandTotal ?? purchaseOrder.totalAmount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeletePurchaseOrder}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete Purchase Order"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeletePurchaseOrderModal;