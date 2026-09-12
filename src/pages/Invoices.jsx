import React, { useState, useEffect, useCallback } from "react";
import Layout from "../layout/Layout";
import InvoiceStatusBadge from "../components/invoice/InvoiceStatusBadge";
import PaymentStatusBadge from "../components/invoice/PaymentStatusBadge";
import ViewInvoiceModal from "../components/invoice/ViewInvoiceModal";
import VerifyInvoiceModal from "../components/invoice/VerifyInvoiceModal";
import RecordPaymentModal from "../components/invoice/RecordPaymentModal";

import {
  getAllInvoices,
  getInvoiceDashboard,
  approveInvoice,
  rejectInvoice,
  disputeInvoice,
  deleteInvoice,
} from "../services/invoiceService";
import { formatCurrency, roundToPaise } from "../utils/formatters";

import {
  Receipt,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CreditCard,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Clock,
  Trash2,
  Check,
} from "lucide-react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Quick prompt states
  const [actionLoading, setActionLoading] = useState(false);

  const loadDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getInvoiceDashboard();
      setStats(res.data);
    } catch (err) {
      console.error("Error loading invoice dashboard:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllInvoices({
        page,
        limit: 15,
        search,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        fromDate,
        toDate,
      });
      setInvoices(res.data?.invoices || []);
      setTotalPages(res.data?.pages || 1);
      setTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading invoices:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, paymentStatusFilter, fromDate, toDate]);

  useEffect(() => {
    loadDashboardStats();
    loadInvoices();
  }, [loadDashboardStats, loadInvoices]);

  const handleApprove = async (inv) => {
    if (!window.confirm(`Are you sure you want to approve invoice #${inv.invoiceNumber}?`)) return;
    try {
      setActionLoading(true);
      await approveInvoice(inv._id, { approvalRemarks: "Approved for payment processing" });
      loadInvoices();
      loadDashboardStats();
      if (showViewModal) setShowViewModal(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to approve invoice.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (inv) => {
    const reason = window.prompt("Please enter the rejection reason for this invoice:");
    if (!reason || !reason.trim()) return;
    try {
      setActionLoading(true);
      await rejectInvoice(inv._id, reason.trim());
      loadInvoices();
      loadDashboardStats();
      if (showViewModal) setShowViewModal(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to reject invoice.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispute = async (inv) => {
    const reason = window.prompt("Please enter the dispute reason for this invoice:");
    if (!reason || !reason.trim()) return;
    try {
      setActionLoading(true);
      await disputeInvoice(inv._id, reason.trim());
      loadInvoices();
      loadDashboardStats();
      if (showViewModal) setShowViewModal(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to dispute invoice.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (inv) => {
    if (!window.confirm(`Are you sure you want to delete invoice #${inv.invoiceNumber}?`)) return;
    try {
      setActionLoading(true);
      await deleteInvoice(inv._id);
      loadInvoices();
      loadDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete invoice.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* ================= Header ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <span className="rounded-xl bg-blue-600 p-2 text-white shadow-md shadow-blue-500/20">
                <Receipt size={22} />
              </span>
              Invoices & Payment Processing
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Procurement billing verification, 3-way matching, approvals, and financial settlement
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadDashboardStats();
                loadInvoices();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= Dashboard Metric Cards ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Invoiced Spend</span>
              <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <IndianRupee size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(stats?.totalInvoicedAmount || 0)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Across {stats?.totalInvoices || 0} invoice(s)
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Pending Verification</span>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Clock size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {stats?.pendingReview || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Awaiting 3-way matching & QA check
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Approved / Ready to Pay</span>
              <span className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-teal-700">
              {stats?.approved || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Verified & approved by finance
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Outstanding Balance</span>
              <span className="rounded-lg bg-rose-50 p-2 text-rose-600">
                <CreditCard size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-rose-600">
              {formatCurrency(stats?.totalOutstandingAmount || 0)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Paid: {formatCurrency(stats?.totalPaidAmount || 0)}
            </p>
          </div>
        </div>

        {/* ================= Filters Bar ================= */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search Invoice # or Remarks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Invoice Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Approved">Approved</option>
                <option value="Payment Processing">Payment Processing</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
                <option value="Disputed">Disputed</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Payment Statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 rounded-lg border border-slate-300 py-2 px-2 text-xs focus:border-blue-500 focus:outline-none"
                title="From Date"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 rounded-lg border border-slate-300 py-2 px-2 text-xs focus:border-blue-500 focus:outline-none"
                title="To Date"
              />
            </div>
          </div>
        </div>

        {/* ================= Invoices Table ================= */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Invoice No</th>
                  <th className="px-5 py-3.5 text-left">Vendor</th>
                  <th className="px-5 py-3.5 text-left">Purchase Order</th>
                  <th className="px-5 py-3.5 text-left">Dates</th>
                  <th className="px-5 py-3.5 text-right">Invoiced Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Payment</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        <span>Loading Invoices...</span>
                      </div>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No invoices found matching your filters.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50/70 transition">
                      {/* Invoice No */}
                      <td className="px-5 py-4 font-bold text-blue-700">
                        {inv.invoiceNumber}
                      </td>

                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {inv.vendor?.vendorName || "—"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {inv.vendor?.vendorCode || ""}
                        </div>
                      </td>

                      {/* PO */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-purple-700">
                          {inv.purchaseOrder?.poNumber || "—"}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {formatDate(inv.purchaseOrder?.orderDate)}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4 text-slate-600">
                        <div>Inv: {formatDate(inv.invoiceDate)}</div>
                        <div className="text-[11px] text-amber-700">Due: {formatDate(inv.dueDate)}</div>
                      </td>

                      {/* Invoiced Amount */}
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {formatCurrency(inv.totalAmount)}
                      </td>

                      {/* Invoice Status */}
                      <td className="px-5 py-4 text-center">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>

                      {/* Payment Status */}
                      <td className="px-5 py-4 text-center">
                        <PaymentStatusBadge status={inv.payment?.paymentStatus} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowViewModal(true);
                            }}
                            title="View Invoice Details"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Verify */}
                          {["Submitted", "Under Review", "Draft"].includes(inv.status) && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowVerifyModal(true);
                              }}
                              title="Verify 3-Way Match"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100 transition"
                            >
                              <ShieldCheck size={14} />
                            </button>
                          )}

                          {/* Approve */}
                          {inv.status === "Verified" && (
                            <button
                              onClick={() => handleApprove(inv)}
                              title="Approve Invoice"
                              disabled={actionLoading}
                              className="rounded-lg border border-green-200 bg-green-50 p-1.5 text-green-700 hover:bg-green-100 transition"
                            >
                              <Check size={14} />
                            </button>
                          )}

                          {/* Record Payment */}
                          {["Approved", "Payment Processing"].includes(inv.status) &&
                            inv.payment?.paymentStatus !== "Paid" && (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowPaymentModal(true);
                                }}
                                title="Record Payment"
                                className="rounded-lg border border-purple-200 bg-purple-50 p-1.5 text-purple-700 hover:bg-purple-100 transition"
                              >
                                <CreditCard size={14} />
                              </button>
                            )}

                          {/* Delete if draft */}
                          {["Draft", "Rejected"].includes(inv.status) && (
                            <button
                              onClick={() => handleDelete(inv)}
                              title="Delete Invoice"
                              className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-xs text-slate-500">
              <span>
                Showing {invoices.length} of {totalCount} invoices
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal
          isOpen={showViewModal}
          invoice={selectedInvoice}
          isAdmin={true}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
          onVerify={(inv) => {
            setShowViewModal(false);
            setSelectedInvoice(inv);
            setShowVerifyModal(true);
          }}
          onApprove={(inv) => handleApprove(inv)}
          onReject={(inv) => handleReject(inv)}
          onDispute={(inv) => handleDispute(inv)}
          onRecordPayment={(inv) => {
            setShowViewModal(false);
            setSelectedInvoice(inv);
            setShowPaymentModal(true);
          }}
        />
      )}

      {/* Verify Modal */}
      {selectedInvoice && (
        <VerifyInvoiceModal
          isOpen={showVerifyModal}
          invoice={selectedInvoice}
          onClose={() => {
            setShowVerifyModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowVerifyModal(false);
            setSelectedInvoice(null);
            loadInvoices();
            loadDashboardStats();
          }}
        />
      )}

      {/* Payment Modal */}
      {selectedInvoice && (
        <RecordPaymentModal
          isOpen={showPaymentModal}
          invoice={selectedInvoice}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
            loadInvoices();
            loadDashboardStats();
          }}
        />
      )}
    </Layout>
  );
};

export default Invoices;

