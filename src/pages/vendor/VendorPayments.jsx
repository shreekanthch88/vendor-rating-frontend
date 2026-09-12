import React, { useState, useEffect, useCallback } from "react";
import ViewPaymentModal from "../../components/payment/ViewPaymentModal";
import {
  getPaymentDashboard,
  getAllPayments,
} from "../../services/paymentService";
import { formatCurrency, roundToPaise } from "../../utils/formatters";

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
  FileText,
} from "lucide-react";

const VendorPayments = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // View modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getPaymentDashboard();
      setStats(res.data);
    } catch (err) {
      console.error("Error loading vendor payment stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPayments({
        page,
        limit: 15,
        search,
        paymentMethod: methodFilter,
      });
      setPayments(res.data?.payments || []);
      setTotalPages(res.data?.pages || 1);
      setTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading vendor payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, methodFilter]);

  useEffect(() => {
    loadStats();
    loadPayments();
  }, [loadStats, loadPayments]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= Header ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span className="rounded-xl bg-purple-600 p-2 text-white shadow-md shadow-purple-500/20">
              <CreditCard size={22} />
            </span>
            My Payments & Settlements
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track bank disbursements, transaction references, UTR numbers, and payment vouchers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadStats();
              loadPayments();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= KPI Cards ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Received (Disbursed)</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <IndianRupee size={18} />
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
            <span className="text-xs font-medium">Total Invoiced Amount</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FileText size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(stats?.totalPayablesAmount || 0)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Across all submitted invoices
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Outstanding Balance</span>
            <span className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <Clock size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-rose-600">
            {formatCurrency(stats?.totalOutstandingAmount || 0)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Pending final disbursement
          </p>
        </div>
      </div>

      {/* ================= Search & Filters ================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search Payment # or UTR Reference..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
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

      {/* ================= Payments Table ================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">Payment No</th>
                <th className="px-5 py-3.5 text-left">Payment Date</th>
                <th className="px-5 py-3.5 text-left">Invoice No</th>
                <th className="px-5 py-3.5 text-left">PO Reference</th>
                <th className="px-5 py-3.5 text-left">Method & UTR</th>
                <th className="px-5 py-3.5 text-right">Amount Received</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Receipt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                      <span>Loading payments...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No payment records found.
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

                    <td className="px-5 py-4 font-semibold text-blue-700">
                      {p.invoice?.invoiceNumber || p.invoiceSnapshot?.invoiceNumber || "—"}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {p.purchaseOrder?.poNumber || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{p.paymentMethod}</div>
                      <div className="text-[11px] font-mono text-slate-500">{p.transactionReference || "—"}</div>
                    </td>

                    <td className="px-5 py-4 text-right font-extrabold text-emerald-700">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-xs text-slate-500">
            <span>Showing {payments.length} of {totalCount} payments</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded border bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
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

      {/* View Modal */}
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
    </div>
  );
};

export default VendorPayments;

