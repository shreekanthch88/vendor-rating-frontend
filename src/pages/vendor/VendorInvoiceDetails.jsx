import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getInvoiceById } from "../../services/invoiceService";
import InvoiceStatusBadge from "../../components/invoice/InvoiceStatusBadge";
import PaymentStatusBadge from "../../components/invoice/PaymentStatusBadge";
import { formatCurrency, roundToPaise } from "../../utils/formatters";

import {
  Receipt,
  ArrowLeft,
  Calendar,
  Building2,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Truck,
  AlertTriangle,
} from "lucide-react";

const VendorInvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoice = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getInvoiceById(id);
      setInvoice(res.data);
    } catch (err) {
      console.error("Error loading invoice:", err);
      setError("Failed to load invoice details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p>{error || "Invoice not found."}</p>
        <Link to="/vendor/invoices" className="mt-3 inline-block font-semibold text-blue-600 underline">
          Return to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/invoices"
            className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              PO: <span className="font-semibold text-purple-700">{invoice.purchaseOrder?.poNumber}</span>
              {" • "}Submitted on: {formatDate(invoice.createdAt || invoice.invoiceDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InvoiceStatusBadge status={invoice.status} />
          <PaymentStatusBadge status={invoice.payment?.paymentStatus} />
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 transition"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
            <Calendar size={15} className="text-blue-600" />
            Dates & Terms
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Invoice Date:</span>
            <span className="font-semibold text-slate-900">{formatDate(invoice.invoiceDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Due Date:</span>
            <span className="font-semibold text-amber-700">{formatDate(invoice.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Terms:</span>
            <span className="font-medium text-slate-800">{invoice.paymentTerms || "Net 30"}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
            <CreditCard size={15} className="text-emerald-600" />
            Financial Summary
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Invoiced:</span>
            <span className="text-sm font-extrabold text-blue-700">{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Disbursed:</span>
            <span className="font-bold text-emerald-700">{formatCurrency(invoice.payment?.paidAmount || 0)}</span>
          </div>
          <div className="flex justify-between border-t pt-1.5">
            <span className="font-semibold text-slate-700">Outstanding:</span>
            <span className="font-bold text-rose-600">
              {formatCurrency(invoice.payment?.outstandingAmount !== undefined ? invoice.payment.outstandingAmount : invoice.totalAmount)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
            <ShieldCheck size={15} className="text-purple-600" />
            Verification & Approval
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">3-Way Match:</span>
            <span className={invoice.verification?.isVerified ? "font-bold text-green-600" : "font-medium text-amber-600"}>
              {invoice.verification?.isVerified ? "Verified" : "Under Review"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Approval Status:</span>
            <span className="font-semibold text-slate-800">{invoice.status}</span>
          </div>
          {invoice.payment?.paymentReference && (
            <div className="flex justify-between text-[11px] border-t pt-1 text-slate-500">
              <span>UTR / Ref:</span>
              <span className="font-mono font-medium text-slate-800">{invoice.payment.paymentReference}</span>
            </div>
          )}
        </div>
      </div>

      {/* Materials Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-6 py-3.5">
          <h3 className="text-sm font-bold text-slate-900">
            Invoiced Material Line Items
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Material</th>
                <th className="px-3 py-3 text-center">Ordered</th>
                <th className="px-3 py-3 text-center">Accepted</th>
                <th className="px-3 py-3 text-center font-bold text-blue-700">Invoiced Qty</th>
                <th className="px-3 py-3 text-right">Agreed Rate</th>
                <th className="px-3 py-3 text-right">GST Amount</th>
                <th className="px-4 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoice.items?.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.materialName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.materialCode} ({item.unitOfMeasure})</div>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600">{item.orderedQuantity}</td>
                  <td className="px-3 py-3 text-center font-semibold text-emerald-700 bg-emerald-50/40">
                    {item.acceptedQuantity}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-blue-700 bg-blue-50/40">
                    {item.invoicedQuantity}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-800">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-600">
                    {formatCurrency(item.taxAmount)} ({item.taxPercentage}%)
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t bg-slate-50/70 p-6 flex flex-col items-end gap-1.5 text-xs text-slate-600">
          <div className="flex w-64 justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxAmount > 0 && (
            <div className="flex w-64 justify-between">
              <span>GST Total:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          {invoice.freightCharges > 0 && (
            <div className="flex w-64 justify-between">
              <span>Freight:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(invoice.freightCharges)}</span>
            </div>
          )}
          <div className="mt-2 flex w-64 justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-slate-900">
            <span>Grand Total:</span>
            <span className="text-blue-700">{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInvoiceDetails;

