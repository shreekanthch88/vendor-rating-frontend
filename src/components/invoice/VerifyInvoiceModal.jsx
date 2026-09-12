import React, { useState } from "react";
import { X, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { verifyInvoice } from "../../services/invoiceService";

const VerifyInvoiceModal = ({ isOpen, invoice, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [checklist, setChecklist] = useState({
    poMatched: true,
    grnMatched: true,
    qualityMatched: true,
    priceMatched: true,
    taxMatched: true,
    verificationRemarks: "Verified against PO, GRN, and Quality Inspection accepted records.",
  });

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await verifyInvoice(invoice._id, checklist);
      onSuccess();
    } catch (err) {
      console.error("Error verifying invoice:", err);
      setError(err.response?.data?.message || err.message || "Failed to verify invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-400" />
            <h3 className="text-base font-bold">
              3-Way Invoice Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
            <p>
              Invoice: <strong>#{invoice.invoiceNumber}</strong> for PO: <strong>{invoice.purchaseOrder?.poNumber}</strong>
            </p>
            <p className="mt-1">
              Vendor: <strong>{invoice.vendor?.vendorName}</strong> | Amount: <strong>₹{Number(invoice.totalAmount || 0).toLocaleString()}</strong>
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Verification Checklist
            </p>

            <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={checklist.poMatched}
                onChange={(e) => setChecklist({ ...checklist, poMatched: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900">Purchase Order Agreement</span>
                <p className="text-gray-500">PO terms, vendor, and material codes correspond to order.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={checklist.grnMatched}
                onChange={(e) => setChecklist({ ...checklist, grnMatched: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900">Goods Receipt (GRN) Receipt</span>
                <p className="text-gray-500">Materials have been physically received and logged in GRN.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={checklist.qualityMatched}
                onChange={(e) => setChecklist({ ...checklist, qualityMatched: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900">Quality Inspection Accepted Quantity</span>
                <p className="text-gray-500">Invoiced quantity does not exceed QA accepted + approved items.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={checklist.priceMatched}
                onChange={(e) => setChecklist({ ...checklist, priceMatched: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900">Price & Discount Rate</span>
                <p className="text-gray-500">Unit prices match agreed PO contracted rates.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={checklist.taxMatched}
                onChange={(e) => setChecklist({ ...checklist, taxMatched: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900">Tax / GST Calculations</span>
                <p className="text-gray-500">GST rates, HSN codes, and arithmetic calculations are accurate.</p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Verification Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={checklist.verificationRemarks}
              onChange={(e) => setChecklist({ ...checklist, verificationRemarks: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow transition disabled:opacity-50"
            >
              <Check size={14} />
              {loading ? "Verifying..." : "Confirm Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyInvoiceModal;

