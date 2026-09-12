import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import InvoiceStatusBadge from "../../components/invoice/InvoiceStatusBadge";
import PaymentStatusBadge from "../../components/invoice/PaymentStatusBadge";
import ViewInvoiceModal from "../../components/invoice/ViewInvoiceModal";

import {
  getAllInvoices,
  getInvoiceDashboard,
} from "../../services/invoiceService";
import { formatCurrency, roundToPaise } from "../../utils/formatters";

import {
  Receipt,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CreditCard,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  AlertTriangle,
  FileText,
} from "lucide-react";

const VendorInvoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // View modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getInvoiceDashboard();
      setStats(res.data);
    } catch (err) {
      console.error("Error loading vendor invoice stats:", err);
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
      });
      setInvoices(res.data?.invoices || []);
      setTotalPages(res.data?.pages || 1);
      setTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading vendor invoices:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadStats();
    loadInvoices();
  }, [loadStats, loadInvoices]);

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
            <span className="rounded-xl bg-blue-600 p-2 text-white shadow-md shadow-blue-500/20">
              <Receipt size={22} />
            </span>
            My Invoices
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Submit payment invoices for verified delivered materials and track disbursement status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadStats();
              loadInvoices();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <Link
            to="/vendor/invoices/create"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
          >
            <Plus size={16} />
            Create New Invoice
          </Link>
        </div>
      </div>

      {/* ================= Metric Cards ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Invoiced</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <IndianRupee size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(stats?.totalInvoicedAmount || 0)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {stats?.totalInvoices || 0} invoice(s) submitted
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Under Review</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-amber-600">
            {stats?.pendingReview || 0}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Awaiting 3-way verification
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Approved Invoices</span>
            <span className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-teal-700">
            {stats?.approved || 0}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Approved for payment
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Paid Disbursements</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CreditCard size={18} />
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-emerald-700">
            {formatCurrency(stats?.totalPaidAmount || 0)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Outstanding: {formatCurrency(stats?.totalOutstandingAmount || 0)}
          </p>
        </div>
      </div>

      {/* ================= Search & Filter ================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
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

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 py-2 px-3 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
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
        </div>
      </div>

      {/* ================= Invoices Table ================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">Invoice No</th>
                <th className="px-5 py-3.5 text-left">Purchase Order</th>
                <th className="px-5 py-3.5 text-left">Invoice Date</th>
                <th className="px-5 py-3.5 text-left">Due Date</th>
                <th className="px-5 py-3.5 text-right">Invoiced Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Payment Status</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>Loading your invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FileText size={32} className="text-slate-300" />
                      <span>No invoices submitted yet.</span>
                      <Link
                        to="/vendor/invoices/create"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow"
                      >
                        <Plus size={14} />
                        Create First Invoice
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-bold text-blue-700">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-purple-700">
                        {inv.purchaseOrder?.poNumber || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(inv.invoiceDate)}
                    </td>

                    <td className="px-5 py-4 text-amber-700 font-medium">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <PaymentStatusBadge status={inv.payment?.paymentStatus} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowViewModal(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Eye size={13} />
                        View
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

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal
          isOpen={showViewModal}
          invoice={selectedInvoice}
          isAdmin={false}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default VendorInvoices;

