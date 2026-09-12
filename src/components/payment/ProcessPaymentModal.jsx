import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Building2,
  AlertCircle,
  IndianRupee,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { processPayment } from "../../services/paymentService";
import { roundToPaise, formatPaise, formatCurrency } from "../../utils/formatters";

const ProcessPaymentModal = ({
  isOpen,
  invoice,
  onClose,
  onSuccess,
}) => {
  const rawOutstanding =
    invoice?.payment?.outstandingAmount !== undefined
      ? invoice.payment.outstandingAmount
      : invoice?.totalAmount || 0;

  const outstanding = roundToPaise(rawOutstanding);

  const [amount, setAmount] = useState(formatPaise(outstanding));
  const [paymentMethod, setPaymentMethod] = useState("NEFT");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (invoice) {
      const curOutstanding = roundToPaise(
        invoice.payment?.outstandingAmount !== undefined
          ? invoice.payment.outstandingAmount
          : invoice.totalAmount || 0
      );
      setAmount(formatPaise(curOutstanding));
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const numAmount = roundToPaise(amount);
  const remainingAfterPayment = Math.max(0, roundToPaise(outstanding - numAmount));
  const bank = invoice.vendor?.bankDetails || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid disbursement amount greater than 0.");
      return;
    }

    if (numAmount > outstanding + 0.01) {
      setError(`Payment amount cannot exceed outstanding balance (${formatCurrency(outstanding)}).`);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await processPayment({
        invoiceId: invoice._id,
        amount: numAmount,
        paymentMethod,
        transactionReference: transactionReference.trim(),
        paymentDate,
        notes,
      });

      onSuccess();
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(err.response?.data?.message || err.message || "Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-purple-400" />
            <h3 className="text-base font-bold">
              Execute Payment Disbursement
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
          {/* Invoice & Vendor Summary */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-xs text-purple-950 space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span>Invoice: #{invoice.invoiceNumber}</span>
              <span>PO: {invoice.purchaseOrder?.poNumber}</span>
            </div>
            <div className="flex justify-between border-t border-purple-200/60 pt-1.5 text-slate-600">
              <span>Vendor: <strong className="text-slate-900">{invoice.vendor?.vendorName}</strong></span>
              <span>Total: <strong>{formatCurrency(invoice.totalAmount)}</strong></span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Paid so far: <strong className="text-green-700">{formatCurrency(invoice.payment?.paidAmount || 0)}</strong></span>
              <span>Outstanding: <strong className="text-rose-600">{formatCurrency(outstanding)}</strong></span>
            </div>
          </div>

          {/* Vendor Bank Snapshot */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1.5">
              <Building2 size={14} className="text-blue-600" />
              Vendor Settlement Account
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>Bank: <strong className="text-slate-900">{bank.bankName || "—"}</strong></div>
              <div>A/C: <strong className="text-slate-900 font-mono">{bank.accountNumber || "—"}</strong></div>
              <div>IFSC: <strong className="text-slate-900 font-mono">{bank.ifscCode || "—"}</strong></div>
              <div>Branch: <strong className="text-slate-900">{bank.branch || "—"}</strong></div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disbursement Amount (₹) *
            </label>
            <input
              type="number"
              min="0.01"
              max={outstanding}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>Remaining Balance After Payment: {formatCurrency(remainingAfterPayment)}</span>
              <button
                type="button"
                onClick={() => setAmount(formatPaise(outstanding))}
                className="text-purple-600 font-semibold hover:underline"
              >
                Pay Full Balance
              </button>
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Transaction Reference / UTR */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bank Transaction Reference / UTR / Cheque No. *
            </label>
            <input
              type="text"
              placeholder="e.g. UTR998877665544"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Remarks / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Approved by Finance Director, processed via Corporate Portal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-500/20 transition disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              {loading ? "Processing..." : "Disburse Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessPaymentModal;
