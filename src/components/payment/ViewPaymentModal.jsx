import React from "react";
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Printer,
  IndianRupee,
  Package,
} from "lucide-react";

import { formatCurrency, roundToPaise } from "../../utils/formatters";

const ViewPaymentModal = ({ isOpen, payment, onClose }) => {
  if (!isOpen || !payment) return null;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const bank = payment.bankDetails || payment.vendor?.bankDetails || {};
  const snap = payment.invoiceSnapshot || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-slate-900 px-8 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-purple-600 p-2 text-white shadow">
              <CreditCard size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Payment Voucher #{payment.paymentNumber}
              </h2>
              <p className="text-xs text-slate-300">
                Disbursed on: <span className="text-white">{formatDate(payment.paymentDate)}</span>
                {" • "}Invoice: <span className="font-semibold text-white">{payment.invoice?.invoiceNumber || snap.invoiceNumber || "—"}</span>
                {" • "}PO: <span className="font-semibold text-white">{payment.purchaseOrder?.poNumber || "—"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 text-green-800 border border-green-200 px-3 py-0.5 text-xs font-bold">
              ✓ {payment.status}
            </span>
            <button
              onClick={() => window.print()}
              title="Print Payment Voucher"
              className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Amount Card */}
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-900 to-indigo-900 p-5 text-white shadow-md">
              <span className="text-xs font-semibold text-purple-200 uppercase tracking-wide">
                Amount Disbursed
              </span>
              <h3 className="mt-2 text-3xl font-extrabold text-white">
                {formatCurrency(payment.amount)}
              </h3>
              <div className="mt-3 space-y-1 border-t border-purple-700/60 pt-2.5 text-xs text-purple-200">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-bold text-white">{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>UTR / Ref:</span>
                  <span className="font-mono font-medium text-white">{payment.transactionReference || "—"}</span>
                </div>
              </div>
            </div>

            {/* Vendor & Bank Account */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
                <Building2 size={15} className="text-blue-600" />
                Vendor & Settlement Account
              </div>
              <p className="text-sm font-bold text-slate-900">{payment.vendor?.vendorName}</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                <div>Bank: <strong className="text-slate-900">{bank.bankName || "—"}</strong></div>
                <div>A/C: <strong className="text-slate-900 font-mono">{bank.accountNumber || "—"}</strong></div>
                <div>IFSC: <strong className="text-slate-900 font-mono">{bank.ifscCode || "—"}</strong></div>
                <div>Branch: <strong className="text-slate-900">{bank.branch || "—"}</strong></div>
              </div>
            </div>

            {/* Invoice Settlement Snapshot */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
                <FileText size={15} className="text-emerald-600" />
                Invoice Settlement Snapshot
              </div>
              <div className="flex justify-between">
                <span>Invoice Total:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(snap.invoiceTotalAmount || payment.invoice?.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Previously Paid:</span>
                <span>{formatCurrency(snap.previouslyPaidAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-purple-700 font-semibold">
                <span>This Payment:</span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-slate-900">
                <span>Remaining Balance:</span>
                <span className={snap.remainingBalanceAfterPayment === 0 ? "text-green-700" : "text-rose-600"}>
                  {formatCurrency(snap.remainingBalanceAfterPayment !== undefined ? snap.remainingBalanceAfterPayment : 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Way Quantity Reconciliation Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  4-Way Quantity & Procurement Reconciliation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reconciliation across PO Ordered → GRN Received → QA Accepted → Replacement Accepted → Invoiced → Paid
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Material</th>
                    <th className="px-3 py-3 text-center">Ordered</th>
                    <th className="px-3 py-3 text-center">Received (GRN)</th>
                    <th className="px-3 py-3 text-center text-rose-600">QA Rejected</th>
                    <th className="px-3 py-3 text-center text-emerald-700">QA Accepted</th>
                    <th className="px-3 py-3 text-center text-purple-700">Repl. Accepted</th>
                    <th className="px-3 py-3 text-center font-bold text-teal-800 bg-teal-50/60">Final Net Accepted</th>
                    <th className="px-3 py-3 text-center font-bold text-blue-800 bg-blue-50/60">Invoiced Qty</th>
                    <th className="px-3 py-3 text-right">Agreed Rate</th>
                    <th className="px-4 py-3 text-right font-bold">Line Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {(payment.quantityReconciliation?.length > 0
                    ? payment.quantityReconciliation
                    : payment.invoice?.items || []
                  ).map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{item.materialName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.materialCode} ({item.unitOfMeasure})</div>
                      </td>

                      <td className="px-3 py-3.5 text-center text-slate-600">{item.orderedQuantity}</td>
                      <td className="px-3 py-3.5 text-center text-slate-600">{item.originalReceivedQuantity || item.receivedQuantity || "—"}</td>
                      <td className="px-3 py-3.5 text-center text-rose-600 font-medium">
                        {item.originalRejectedQuantity || 0}
                      </td>
                      <td className="px-3 py-3.5 text-center font-semibold text-emerald-700">
                        {item.originalAcceptedQuantity !== undefined ? item.originalAcceptedQuantity : item.acceptedQuantity}
                      </td>
                      <td className="px-3 py-3.5 text-center font-semibold text-purple-700">
                        {item.replacementAcceptedQuantity || 0}
                      </td>
                      <td className="px-3 py-3.5 text-center font-extrabold text-teal-900 bg-teal-50/40">
                        {item.finalAcceptedQuantity !== undefined ? item.finalAcceptedQuantity : item.acceptedQuantity}
                      </td>
                      <td className="px-3 py-3.5 text-center font-extrabold text-blue-900 bg-blue-50/40">
                        {item.invoicedQuantity}
                      </td>
                      <td className="px-3 py-3.5 text-right font-medium text-slate-800">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes & Audit */}
          {payment.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
              <span className="font-bold text-slate-900">Disbursement Notes: </span>
              {payment.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-white px-8 py-4 text-xs text-slate-500">
          <div>
            Processed by: <span className="font-semibold text-slate-800">{payment.processedBy?.name || "Finance Manager"}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentModal;

