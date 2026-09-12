import React, { useState, useEffect, useCallback } from "react";
import Layout from "../layout/Layout";
import ProcessPaymentModal from "../components/payment/ProcessPaymentModal";
import ViewPaymentModal from "../components/payment/ViewPaymentModal";

import {
  getPaymentDashboard,
  getPaymentQueue,
  getAllPayments,
} from "../services/paymentService";
import { formatCurrency, roundToPaise } from "../utils/formatters";

import {
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Building2,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("queue"); // "queue" | "history"

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Queue state
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueSearch, setQueueSearch] = useState("");
  const [queuePage, setQueuePage] = useState(1);
  const [queueTotalPages, setQueueTotalPages] = useState(1);
  const [queueTotalCount, setQueueTotalCount] = useState(0);

  // History state
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);

  // Modals
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getPaymentDashboard();
      setStats(res.data);
    } catch (err) {
      console.error("Error loading payment stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      setQueueLoading(true);
      const res = await getPaymentQueue({
        page: queuePage,
        limit: 15,
        search: queueSearch,
      });
      setQueue(res.data?.queue || []);
      setQueueTotalPages(res.data?.pages || 1);
      setQueueTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading payment queue:", err);
      setQueue([]);
    } finally {
      setQueueLoading(false);
    }
  }, [queuePage, queueSearch]);

  const loadHistory = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const res = await getAllPayments({
        page: historyPage,
        limit: 15,
        search: historySearch,
        paymentMethod: methodFilter,
      });
      setPayments(res.data?.payments || []);
      setHistoryTotalPages(res.data?.pages || 1);
      setHistoryTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading payments history:", err);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, [historyPage, historySearch, methodFilter]);

  useEffect(() => {
    loadStats();
    if (activeTab === "queue") {
      loadQueue();
    } else {
      loadHistory();
    }
  }, [activeTab, loadStats, loadQueue, loadHistory]);

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
              <span className="rounded-xl bg-purple-600 p-2 text-white shadow-md shadow-purple-500/20">
                <CreditCard size={22} />
              </span>
              Payment Disbursements & Settlement Hub
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Process vendor disbursements against verified approved invoices and inspect 4-way quantity reconciliations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadStats();
                if (activeTab === "queue") loadQueue();
                else loadHistory();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= KPI Cards ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Invoiced Payables</span>
              <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <IndianRupee size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(stats?.totalPayablesAmount || 0)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Across all approved invoices
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Disbursed (Paid)</span>
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-emerald-700">
              {formatCurrency(stats?.totalPaidAmount || 0)}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {stats?.completedCount || 0} completed transaction(s)
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Pending in Payment Queue</span>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Clock size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {stats?.queueCount || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Ready for finance disbursement
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Outstanding Balance</span>
              <span className="rounded-lg bg-rose-50 p-2 text-rose-600">
                <AlertTriangle size={18} />
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-rose-600">
              {formatCurrency(stats?.totalOutstandingAmount || 0)}
            </h3>
            <p className="mt-1 text-xs text-rose-600 font-semibold">
              {stats?.overdueCount || 0} overdue invoice(s)
            </p>
          </div>
        </div>

        {/* ================= Tabs Navigation ================= */}
        <div className="border-b border-slate-200 bg-white rounded-t-xl px-6 pt-3 shadow-sm">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex items-center gap-2 border-b-2 pb-3.5 text-sm font-semibold transition ${
                activeTab === "queue"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock size={16} />
              Payment Queue (Ready to Pay)
              {queueTotalCount > 0 && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                  {queueTotalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 border-b-2 pb-3.5 text-sm font-semibold transition ${
                activeTab === "history"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <CreditCard size={16} />
              Disbursement History
              {payments.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                  {historyTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ================= TAB 1: PAYMENT QUEUE ================= */}
        {activeTab === "queue" && (
          <div className="space-y-5">
            {/* Search */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search Invoice # or Vendor in Queue..."
                  value={queueSearch}
                  onChange={(e) => {
                    setQueueSearch(e.target.value);
                    setQueuePage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Queue Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 text-left">Invoice No</th>
                      <th className="px-5 py-3.5 text-left">Vendor</th>
                      <th className="px-5 py-3.5 text-left">PO Reference</th>
                      <th className="px-5 py-3.5 text-left">Due Date</th>
                      <th className="px-5 py-3.5 text-right">Invoice Value</th>
                      <th className="px-5 py-3.5 text-right">Paid So Far</th>
                      <th className="px-5 py-3.5 text-right font-bold text-rose-700">Outstanding</th>
                      <th className="px-5 py-3.5 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {queueLoading ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                            <span>Loading Payment Queue...</span>
                          </div>
                        </td>
                      </tr>
                    ) : queue.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-400">
                          <CheckCircle2 size={30} className="mx-auto mb-2 text-emerald-500" />
                          <p className="font-semibold text-slate-700">All caught up!</p>
                          <p className="text-xs text-slate-400">No approved invoices pending disbursement in the queue.</p>
                        </td>
                      </tr>
                    ) : (
                      queue.map((inv) => {
                        const isOverdue = new Date(inv.dueDate) < new Date();
                        const outstanding =
                          inv.payment?.outstandingAmount !== undefined
                            ? inv.payment.outstandingAmount
                            : inv.totalAmount;

                        return (
                          <tr key={inv._id} className="hover:bg-slate-50/70 transition">
                            <td className="px-5 py-4 font-bold text-blue-700">
                              {inv.invoiceNumber}
                            </td>

                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-900">
                                {inv.vendor?.vendorName || "—"}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {inv.vendor?.vendorCode || ""}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="font-semibold text-purple-700">
                                {inv.purchaseOrder?.poNumber || "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className={isOverdue ? "font-bold text-rose-600" : "text-slate-600"}>
                                {formatDate(inv.dueDate)}
                              </span>
                              {isOverdue && (
                                <span className="ml-1.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                                  OVERDUE
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-medium text-slate-800">
                              {formatCurrency(inv.totalAmount)}
                            </td>

                            <td className="px-5 py-4 text-right font-medium text-emerald-700">
                              {formatCurrency(inv.payment?.paidAmount || 0)}
                            </td>

                            <td className="px-5 py-4 text-right font-extrabold text-rose-600">
                              {formatCurrency(outstanding)}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedInvoiceForPayment(inv);
                                  setShowProcessModal(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm transition"
                              >
                                <CreditCard size={13} />
                                Process Payment
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {queueTotalPages > 1 && (
                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-xs text-slate-500">
                  <span>Showing {queue.length} of {queueTotalCount} queue items</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={queuePage <= 1}
                      onClick={() => setQueuePage(queuePage - 1)}
                      className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span>Page {queuePage} of {queueTotalPages}</span>
                    <button
                      disabled={queuePage >= queueTotalPages}
                      onClick={() => setQueuePage(queuePage + 1)}
                      className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PAYMENT HISTORY ================= */}
        {activeTab === "history" && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search Payment # or UTR..."
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value);
                      setHistoryPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={methodFilter}
                    onChange={(e) => {
                      setMethodFilter(e.target.value);
                      setHistoryPage(1);
                    }}
                    className="rounded-lg border border-slate-300 py-2 px-3 text-xs focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">All Payment Methods</option>
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="IMPS">IMPS</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 text-left">Payment No</th>
                      <th className="px-5 py-3.5 text-left">Payment Date</th>
                      <th className="px-5 py-3.5 text-left">Vendor</th>
                      <th className="px-5 py-3.5 text-left">Invoice No</th>
                      <th className="px-5 py-3.5 text-left">Method & UTR</th>
                      <th className="px-5 py-3.5 text-right">Disbursed Amount</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5 text-center">Voucher</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white text-xs">
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                            <span>Loading Disbursement History...</span>
                          </div>
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-400">
                          No disbursement records found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/70 transition">
                          <td className="px-5 py-4 font-bold text-purple-700">
                            {p.paymentNumber}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatDate(p.paymentDate)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900">
                              {p.vendor?.vendorName || "—"}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.vendor?.vendorCode || ""}
                            </div>
                          </td>

                          <td className="px-5 py-4 font-semibold text-blue-700">
                            {p.invoice?.invoiceNumber || p.invoiceSnapshot?.invoiceNumber || "—"}
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-900">{p.paymentMethod}</div>
                            <div className="text-[11px] font-mono text-slate-500">{p.transactionReference || "—"}</div>
                          </td>

                          <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                            {formatCurrency(p.amount)}
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-[11px] font-bold">
                              ✓ {p.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedPayment(p);
                                setShowViewModal(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                            >
                              <Eye size={13} />
                              View Voucher
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {historyTotalPages > 1 && (
                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-xs text-slate-500">
                  <span>Showing {payments.length} of {historyTotalCount} payments</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage(historyPage - 1)}
                      className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span>Page {historyPage} of {historyTotalPages}</span>
                    <button
                      disabled={historyPage >= historyTotalPages}
                      onClick={() => setHistoryPage(historyPage + 1)}
                      className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Process Payment Modal */}
      {selectedInvoiceForPayment && (
        <ProcessPaymentModal
          isOpen={showProcessModal}
          invoice={selectedInvoiceForPayment}
          onClose={() => {
            setShowProcessModal(false);
            setSelectedInvoiceForPayment(null);
          }}
          onSuccess={() => {
            setShowProcessModal(false);
            setSelectedInvoiceForPayment(null);
            loadStats();
            loadQueue();
            loadHistory();
          }}
        />
      )}

      {/* View Payment Modal */}
      {selectedPayment && (
        <ViewPaymentModal
          isOpen={showViewModal}
          payment={selectedPayment}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </Layout>
  );
};

export default Payments;

