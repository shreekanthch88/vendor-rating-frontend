import React from "react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { formatCurrency, roundToPaise } from "../../utils/formatters";
import {
  X,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Truck,
  Check,
  XCircle,
  Download,
  Printer,
  FileCheck,
} from "lucide-react";

const ViewInvoiceModal = ({
  isOpen,
  invoice,
  onClose,
  onVerify,
  onApprove,
  onReject,
  onDispute,
  onRecordPayment,
  isAdmin = true,
}) => {
  if (!isOpen || !invoice) return null;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ================= Header ================= */}
        <div className="flex items-center justify-between border-b bg-slate-900 px-8 py-5 text-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-600 p-2 text-white">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Invoice #{invoice.invoiceNumber}
                </h2>
                <p className="text-xs text-slate-300">
                  PO: <span className="font-semibold text-white">{invoice.purchaseOrder?.poNumber || "—"}</span>
                  {" • "}Created on: <span className="text-white">{formatDate(invoice.createdAt || invoice.invoiceDate)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <InvoiceStatusBadge status={invoice.status} />
            <PaymentStatusBadge status={invoice.payment?.paymentStatus} />
            <button
              onClick={handlePrint}
              title="Print Invoice"
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

        {/* ================= Body ================= */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Vendor Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-semibold text-gray-800">
                <Building2 size={16} className="text-blue-600" />
                Vendor Details
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                <p className="text-sm font-bold text-gray-900">
                  {invoice.vendor?.vendorName || "—"}
                </p>
                <p>Code: <span className="font-medium text-gray-800">{invoice.vendor?.vendorCode || "—"}</span></p>
                <p>GSTIN: <span className="font-medium text-gray-800">{invoice.vendor?.gstNumber || "—"}</span></p>
                <p>PAN: <span className="font-medium text-gray-800">{invoice.vendor?.panNumber || "—"}</span></p>
                <p>Email: <span className="font-medium text-gray-800">{invoice.vendor?.email || "—"}</span></p>
                <p>Phone: <span className="font-medium text-gray-800">{invoice.vendor?.mobile || "—"}</span></p>
              </div>
            </div>

            {/* Purchase Order & Dates */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-semibold text-gray-800">
                <Calendar size={16} className="text-purple-600" />
                PO & Schedule
              </div>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">PO Number:</span>
                  <span className="font-bold text-blue-700">{invoice.purchaseOrder?.poNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PO Total Value:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.purchaseOrder?.grandTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Invoice Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(invoice.invoiceDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-semibold text-amber-700">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Terms:</span>
                  <span className="font-medium text-gray-800">{invoice.paymentTerms || "Net 30"}</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-semibold text-gray-800">
                <CreditCard size={16} className="text-emerald-600" />
                Payment Summary
              </div>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Invoiced:</span>
                  <span className="text-base font-extrabold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-green-700">{formatCurrency(invoice.payment?.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-700">Outstanding:</span>
                  <span className="font-extrabold text-red-600">
                    {formatCurrency(invoice.payment?.outstandingAmount !== undefined ? invoice.payment?.outstandingAmount : invoice.totalAmount)}
                  </span>
                </div>
                {invoice.payment?.paymentReference && (
                  <div className="mt-2 rounded bg-gray-50 p-2 text-[11px]">
                    <span className="text-gray-500">UTR / Ref: </span>
                    <span className="font-mono font-medium text-gray-800">{invoice.payment.paymentReference}</span>
                    <span className="text-gray-400"> ({invoice.payment.paymentMethod || "Bank"})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Documents Links */}
          {(invoice.goodsReceipts?.length > 0 || invoice.qualityInspections?.length > 0) && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Linked Procurement Operations
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs">
                {invoice.goodsReceipts?.map((grn) => (
                  <div key={grn._id} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-blue-200 text-blue-800 shadow-sm">
                    <Truck size={14} className="text-blue-600" />
                    <span>GRN: <strong>{grn.grnNumber || grn._id}</strong> ({formatDate(grn.receiptDate)})</span>
                  </div>
                ))}
                {invoice.qualityInspections?.map((qi) => (
                  <div key={qi._id} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-purple-200 text-purple-800 shadow-sm">
                    <FileCheck size={14} className="text-purple-600" />
                    <span>Inspection: <strong>{qi.inspectionNumber || qi._id}</strong> ({qi.overallResult || "Checked"})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b bg-gray-50/75 px-6 py-3.5">
              <h3 className="text-sm font-bold text-gray-900">
                Invoiced Materials & Pricing Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Material</th>
                    <th className="px-4 py-3 text-center">Ordered</th>
                    <th className="px-4 py-3 text-center">Accepted</th>
                    <th className="px-4 py-3 text-center font-bold text-blue-800">Invoiced Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Tax (GST)</th>
                    <th className="px-4 py-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {invoice.items?.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{item.materialName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{item.materialCode} ({item.unitOfMeasure})</div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.orderedQuantity}</td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-700 bg-emerald-50/40">
                        {item.acceptedQuantity}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50/40">
                        {item.invoicedQuantity}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatCurrency(item.taxAmount)} ({item.taxPercentage}%)
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Footer */}
            <div className="border-t bg-gray-50/70 p-6">
              <div className="flex flex-col items-end gap-1.5 text-xs text-gray-600">
                <div className="flex w-64 justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {Number(invoice.discountAmount || 0) > 0 && (
                  <div className="flex w-64 justify-between text-red-600">
                    <span>Discount:</span>
                    <span>- {formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex w-64 justify-between">
                  <span>Tax Amount (GST):</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                {Number(invoice.freightCharges || 0) > 0 && (
                  <div className="flex w-64 justify-between">
                    <span>Freight / Shipping:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(invoice.freightCharges)}</span>
                  </div>
                )}
                <div className="mt-2 flex w-64 justify-between border-t border-gray-300 pt-2 text-sm font-extrabold text-gray-900">
                  <span>Grand Total:</span>
                  <span className="text-blue-700">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Approval Details */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* 5-Point Verification Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue-600" />
                  3-Way Verification Status
                </span>
                {invoice.verification?.isVerified ? (
                  <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-[11px] font-bold">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-[11px] font-bold">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${invoice.verification?.poMatched ? "bg-green-50/60 border-green-200 text-green-900" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                  {invoice.verification?.poMatched ? <Check size={14} className="text-green-600" /> : <Clock size={14} />}
                  PO Agreement Matched
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${invoice.verification?.grnMatched ? "bg-green-50/60 border-green-200 text-green-900" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                  {invoice.verification?.grnMatched ? <Check size={14} className="text-green-600" /> : <Clock size={14} />}
                  GRN Received Matched
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${invoice.verification?.qualityMatched ? "bg-green-50/60 border-green-200 text-green-900" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                  {invoice.verification?.qualityMatched ? <Check size={14} className="text-green-600" /> : <Clock size={14} />}
                  Quality Accepted Qty
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${invoice.verification?.priceMatched ? "bg-green-50/60 border-green-200 text-green-900" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                  {invoice.verification?.priceMatched ? <Check size={14} className="text-green-600" /> : <Clock size={14} />}
                  Pricing & Taxes Matched
                </div>
              </div>

              {invoice.verification?.verificationRemarks && (
                <div className="mt-3 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Remarks: </span>
                  {invoice.verification.verificationRemarks}
                </div>
              )}
            </div>

            {/* Approval & Rejection History */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Approval Workflow
                </span>
                <InvoiceStatusBadge status={invoice.status} />
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-gray-600">
                {invoice.approval?.approvedBy && (
                  <div className="rounded-lg bg-green-50/80 border border-green-200 p-3 text-green-900">
                    <p className="font-semibold">Approved by {invoice.approval.approvedBy.name || "Admin"}</p>
                    <p className="text-[11px] text-green-700 mt-0.5">{formatDate(invoice.approval.approvedAt)}</p>
                    {invoice.approval.approvalRemarks && (
                      <p className="mt-1 text-xs italic">"{invoice.approval.approvalRemarks}"</p>
                    )}
                  </div>
                )}

                {invoice.approval?.rejectedBy && (
                  <div className="rounded-lg bg-red-50/80 border border-red-200 p-3 text-red-900">
                    <p className="font-semibold">Rejected by {invoice.approval.rejectedBy.name || "Admin"}</p>
                    <p className="text-[11px] text-red-700 mt-0.5">{formatDate(invoice.approval.rejectedAt)}</p>
                    <p className="mt-1 text-xs font-medium">Reason: {invoice.approval.rejectionReason}</p>
                  </div>
                )}

                {invoice.approval?.disputeReason && (
                  <div className="rounded-lg bg-orange-50/80 border border-orange-200 p-3 text-orange-900">
                    <p className="font-semibold">Disputed</p>
                    <p className="mt-1 text-xs">Reason: {invoice.approval.disputeReason}</p>
                  </div>
                )}

                {invoice.vendorRemarks && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="font-semibold text-gray-700">Vendor Submission Notes: </span>
                    <p className="mt-0.5 text-gray-600">{invoice.vendorRemarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= Footer Actions ================= */}
        <div className="flex flex-wrap items-center justify-between border-t bg-white px-8 py-4">
          <div className="text-xs text-gray-500">
            Invoice ID: <span className="font-mono text-gray-700">{invoice._id}</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && ["Submitted", "Under Review"].includes(invoice.status) && (
              <>
                <button
                  onClick={() => onVerify && onVerify(invoice)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
                >
                  Verify Invoice
                </button>
                <button
                  onClick={() => onReject && onReject(invoice)}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                >
                  Reject
                </button>
              </>
            )}

            {isAdmin && invoice.status === "Verified" && (
              <>
                <button
                  onClick={() => onApprove && onApprove(invoice)}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
                >
                  Approve Invoice
                </button>
                <button
                  onClick={() => onDispute && onDispute(invoice)}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition"
                >
                  Dispute
                </button>
              </>
            )}

            {isAdmin && ["Approved", "Payment Processing"].includes(invoice.status) && invoice.payment?.paymentStatus !== "Paid" && (
              <button
                onClick={() => onRecordPayment && onRecordPayment(invoice)}
                className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-700 shadow-sm transition flex items-center gap-1.5"
              >
                <CreditCard size={14} />
                Record Payment
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;

