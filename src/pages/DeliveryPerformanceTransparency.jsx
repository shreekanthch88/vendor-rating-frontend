import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  FileSpreadsheet,
  Info,
  Layers,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import Layout from "../layout/Layout";
import { getDeliveryCalculation } from "../services/vendorRatingService";

export default function DeliveryPerformanceTransparency() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  // Filters for normal deliveries table
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchData = useCallback(async () => {
    if (!id) {
      setError("Vendor Rating ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getDeliveryCalculation(id);
      if (res?.success && res.data) {
        setData(res.data);
      } else {
        setError(res?.message || "Failed to load delivery calculation details.");
      }
    } catch (err) {
      console.error("Fetch Delivery Calculation Error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load delivery calculation.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format dates cleanly
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return Number(num).toLocaleString();
  };

  // Filtered normal deliveries
  const filteredDeliveries = useMemo(() => {
    if (!data?.normalDeliveries) return [];
    return data.normalDeliveries.filter((row) => {
      const matchesSearch =
        row.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.dispatchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.materialName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ON_TIME"
          ? row.delayDays === 0
          : statusFilter === "DELAYED"
          ? row.delayDays > 0
          : true;

      const matchesType =
        typeFilter === "ALL" ? true : row.dispatchType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data?.normalDeliveries, searchTerm, statusFilter, typeFilter]);

  // Table Totals for visible filtered deliveries
  const tableTotals = useMemo(() => {
    // Deduplicate ordered quantity by PO to prevent double-counting split dispatches
    const uniquePOOrders = {};
    filteredDeliveries.forEach((r) => {
      if (r.poNumber && !uniquePOOrders[r.poNumber]) {
        uniquePOOrders[r.poNumber] = r.orderedQuantity || 0;
      }
    });
    const totalOrdered =
      Object.keys(uniquePOOrders).length > 0
        ? Object.values(uniquePOOrders).reduce((sum, val) => sum + val, 0)
        : data?.summary?.orderedQuantity ?? 0;

    const totalDispatched = filteredDeliveries.reduce(
      (sum, r) => sum + (r.dispatchedQuantity || 0),
      0
    );
    const totalReceived = filteredDeliveries.reduce(
      (sum, r) => sum + (r.receivedQuantity || 0),
      0
    );
    const totalWeighted = filteredDeliveries.reduce(
      (sum, r) => sum + (r.weightedScore || 0),
      0
    );
    const avgScore =
      totalReceived > 0
        ? (totalWeighted / totalReceived).toFixed(2)
        : "0.00";

    return { totalOrdered, totalDispatched, totalReceived, totalWeighted, avgScore };
  }, [filteredDeliveries, data?.summary?.orderedQuantity]);

  // CSV Export
  const handleExportCSV = () => {
    if (!data?.normalDeliveries?.length) return;
    const headers = [
      "#",
      "PO Number",
      "Dispatch Number",
      "Material",
      "Dispatch Type",
      "Ordered Qty",
      "Dispatched Qty",
      "Received Qty",
      "Expected Delivery Date",
      "Receipt Date",
      "Delay Days",
      "Individual Score",
      "Weighted Score",
      "Status",
    ];

    const rows = data.normalDeliveries.map((r, i) => [
      i + 1,
      r.poNumber,
      r.dispatchNumber,
      `"${r.materialName || ""}"`,
      r.dispatchType,
      r.orderedQuantity,
      r.dispatchedQuantity,
      r.receivedQuantity,
      formatDate(r.expectedDate),
      formatDate(r.receiptDate),
      r.delayDays,
      r.individualScore,
      r.weightedScore,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Delivery_Performance_${data.vendor?.code || "Vendor"}_${data.ratingId || "Rating"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">
            Loading transparent delivery calculations...
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl space-y-4 py-8">
          <button
            type="button"
            onClick={() => navigate(`/ratings/${id}`)}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Rating Details
          </button>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            <h2 className="font-semibold text-red-900">Unable to load calculation details</h2>
            <p className="mt-1 text-sm text-red-700">{error || "No data returned."}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { summary, scoringRules, dimensions, replacementEvidence, replacementSummary, finalCalculation, vendor } = data;

  const onTimePercentage =
    summary.receivedQuantity > 0
      ? ((summary.onTimeQuantity / summary.receivedQuantity) * 100).toFixed(2)
      : "0.00";

  const delayedPercentage =
    summary.receivedQuantity > 0
      ? ((summary.delayedQuantity / summary.receivedQuantity) * 100).toFixed(2)
      : "0.00";

  const pendingPercentage =
    summary.orderedQuantity > 0
      ? ((summary.pendingQuantity / summary.orderedQuantity) * 100).toFixed(2)
      : "0.00";

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* =========================================================
            HEADER & ACTIONS
        ========================================================= */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(`/ratings/${id}`)}
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Rating Details
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Performance — Transparent Calculation
              </h1>
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800">
                Audit Verified
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Vendor: <span className="font-semibold text-gray-800">{vendor?.name || "Vendor"}</span>{" "}
              {vendor?.code ? `(${vendor.code})` : ""} • Period:{" "}
              <span className="font-medium text-gray-700">
                {formatDate(data.evaluationPeriod?.fromDate)} — {formatDate(data.evaluationPeriod?.toDate)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <Download className="h-4 w-4 text-gray-500" /> Export CSV
            </button>
            <button
              type="button"
              onClick={fetchData}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* =========================================================
            TOP ROW: 5 KPI CARDS (MATCHING USER MOCKUP)
        ========================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Gauge Card: Score */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Delivery Score
              </span>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                Weight: {finalCalculation.weight}%
              </span>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-blue-900">
                {Number(finalCalculation.deliveryScore || 0).toFixed(2)}
              </span>
              <span className="text-sm font-medium text-gray-400">/ 100</span>
            </div>
            <div className="border-t border-blue-100/80 pt-2 text-xs text-gray-600">
              Contribution:{" "}
              <span className="font-bold text-blue-700">
                {Number(finalCalculation.overallContribution || 0).toFixed(2)} pts
              </span>{" "}
              to overall
            </div>
          </div>

          {/* On-Time Deliveries Card */}
          <div className="flex flex-col justify-between rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                On-Time Deliveries
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.onTimeQuantity)}{" "}
                <span className="text-sm font-normal text-gray-500">
                  / {formatNumber(summary.receivedQuantity)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-800">
                  {onTimePercentage}%
                </span>
                <span className="text-xs text-gray-500">of total received</span>
              </div>
            </div>
            <div className="border-t border-emerald-100/80 pt-2 text-xs text-gray-500">
              Arrived on or before committed date
            </div>
          </div>

          {/* Delayed Deliveries Card */}
          <div className="flex flex-col justify-between rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/40 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Delayed Deliveries
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.delayedQuantity)}{" "}
                <span className="text-sm font-normal text-gray-500">
                  / {formatNumber(summary.receivedQuantity)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-800">
                  {delayedPercentage}%
                </span>
                <span className="text-xs text-gray-500">of total received</span>
              </div>
            </div>
            <div className="border-t border-amber-100/80 pt-2 text-xs text-gray-500">
              Avg Delay: <span className="font-semibold text-gray-700">{summary.averageDelayDays} days</span>
            </div>
          </div>

          {/* Pending Deliveries Card */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Pending Deliveries
              </span>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.pendingQuantity)}
                <span className="text-sm font-normal text-gray-500"> units</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                  {pendingPercentage}%
                </span>
                <span className="text-xs text-gray-500">of ordered quantity</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">
              Awaiting arrival at warehouse gate
            </div>
          </div>

          {/* Total Deliveries Card */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total Deliveries
              </span>
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-gray-900">
                {summary.totalDispatches}{" "}
                <span className="text-sm font-normal text-gray-500">Dispatches</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Across <span className="font-semibold text-gray-700">{summary.totalPOsEvaluated} POs</span>
              </p>
            </div>
            <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">
              {summary.partialDispatches} partial shipments
            </div>
          </div>
        </div>

        {/* =========================================================
            6-DIMENSION BREAKDOWN STRIP (APPROVED ARCHITECTURE)
        ========================================================= */}
        {dimensions && (
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 text-white shadow-md">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-white">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  6-Component Composite Delivery Engine
                </h3>
                <p className="text-xs text-slate-300">
                  Comprehensive logistics evaluation: 100 internal points rolled into 30% overall rating.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs text-slate-300">Composite Score:</span>
                <span className="text-lg font-bold text-emerald-400">
                  {Number(finalCalculation.deliveryScore || 0).toFixed(2)} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {/* 1. Timeliness */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">1. Timeliness</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.timeliness?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 45 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.timeliness?.score || 0}%
                </div>
              </div>

              {/* 2. Dispatch Adherence */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">2. Dispatch Adherence</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.dispatchAdherence?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 15 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.dispatchAdherence?.score || 0}%
                </div>
              </div>

              {/* 3. Completeness */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">3. Completeness</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.completeness?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 15 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.completeness?.score || 0}%
                </div>
              </div>

              {/* 4. Partial Performance */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">4. Split / Multi-DSP</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.partialPerformance?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 10 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.partialPerformance?.score || 0}%
                </div>
              </div>

              {/* 5. Pending / Overdue */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">5. Pending / Overdue</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.overduePending?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 10 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.overduePending?.score || 0}%
                </div>
              </div>

              {/* 6. Consistency */}
              <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                <div className="text-xs text-slate-300">6. Consistency</div>
                <div className="mt-1 text-lg font-bold text-white">
                  {dimensions.consistency?.weightedPoints || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ 5 pts</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-300">
                  Raw: {dimensions.consistency?.score || 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MIDDLE ROW: DELIVERY SUMMARY & PENALTY SCORING RULES
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Delivery Summary Grid */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <Layers className="h-5 w-5 text-blue-600" /> Delivery Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm sm:grid-cols-3">
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">POs Evaluated</span>
                <p className="font-semibold text-gray-900">{summary.totalPOsEvaluated}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Total Dispatches</span>
                <p className="font-semibold text-gray-900">{summary.totalDispatches}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Ordered Quantity</span>
                <p className="font-semibold text-gray-900">{formatNumber(summary.orderedQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Dispatched Qty</span>
                <p className="font-semibold text-gray-900">{formatNumber(summary.dispatchedQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Received Quantity</span>
                <p className="font-semibold text-gray-900">{formatNumber(summary.receivedQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Pending Quantity</span>
                <p className="font-semibold text-gray-900">{formatNumber(summary.pendingQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">On-Time Quantity</span>
                <p className="font-semibold text-emerald-600">{formatNumber(summary.onTimeQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Delayed Quantity</span>
                <p className="font-semibold text-amber-600">{formatNumber(summary.delayedQuantity)}</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Average Delay</span>
                <p className="font-semibold text-gray-900">{summary.averageDelayDays} days</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Partial Dispatches</span>
                <p className="font-semibold text-gray-900">{summary.partialDispatches}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Multiple-DSP POs</span>
                <p className="font-semibold text-gray-900">{summary.multipleDispatchPOs}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Replacement POs</span>
                <p className="font-semibold text-purple-700">{summary.replacementPOs}</p>
              </div>
            </div>
          </div>

          {/* Penalty Scoring Rules Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <TrendingUp className="h-5 w-5 text-indigo-600" /> Penalty Scoring Rules
              </h3>
              <span className="text-xs text-gray-400">Timeliness Standard</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">Delay Threshold</th>
                    <th className="px-3.5 py-2.5 font-semibold">Individual Score</th>
                    <th className="px-3.5 py-2.5 font-semibold">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  {scoringRules?.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60">
                      <td className="px-3.5 py-2 font-medium">{rule.delayDays}</td>
                      <td className="px-3.5 py-2 font-bold text-gray-900">{rule.score} / 100</td>
                      <td className="px-3.5 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            rule.score === 100
                              ? "bg-emerald-100 text-emerald-800"
                              : rule.score >= 80
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN SECTION: INDIVIDUAL DELIVERY CALCULATIONS TABLE
        ========================================================= */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  Individual Delivery Calculations (Normal Deliveries)
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Line-by-line breakdown of every received item, expected vs gate receipt date, and quantity-weighted scores.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search PO, Dispatch, Material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-56 rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ON_TIME">On Time (0 delay)</option>
                  <option value="DELAYED">Delayed (&gt; 0 delay)</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Dispatch Types</option>
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                  <option value="Final">Final</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 font-semibold text-gray-600">
                <tr>
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">PO Number</th>
                  <th className="px-3 py-3">Dispatch #</th>
                  <th className="px-3 py-3">Material</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3 text-right">Ordered</th>
                  <th className="px-3 py-3 text-right">Dispatched</th>
                  <th className="px-3 py-3 text-right">Received</th>
                  <th className="px-3 py-3">Expected Date</th>
                  <th className="px-3 py-3">Receipt Date</th>
                  <th className="px-3 py-3 text-center">Delay</th>
                  <th className="px-3 py-3 text-right">Score</th>
                  <th className="px-3 py-3 text-right">Weighted Score</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="py-8 text-center text-gray-400">
                      No normal deliveries match the specified filters.
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2.5 font-medium text-blue-600 hover:underline">
                        {row.poNumber}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-700">{row.dispatchNumber}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[180px] truncate" title={row.materialName}>
                        {row.materialName}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            row.dispatchType === "Full"
                              ? "bg-blue-100 text-blue-800"
                              : row.dispatchType === "Partial"
                              ? "bg-purple-100 text-purple-800"
                              : row.dispatchType === "Final"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {row.dispatchType}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-gray-600">
                        {formatNumber(row.orderedQuantity)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-gray-600">
                        {formatNumber(row.dispatchedQuantity)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                        {formatNumber(row.receivedQuantity)}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{formatDate(row.expectedDate)}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-900">{formatDate(row.receiptDate)}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 font-semibold ${
                            row.delayDays === 0
                              ? "bg-emerald-100 text-emerald-800"
                              : row.delayDays <= 2
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.delayDays} d
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                        {row.individualScore}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-blue-900">
                        {formatNumber(row.weightedScore)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                            row.delayDays === 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredDeliveries.length > 0 && (
                <tfoot className="border-t-2 border-gray-300 bg-gray-50 font-bold text-gray-900">
                  <tr>
                    <td colSpan={5} className="px-3 py-3 text-right uppercase tracking-wider text-xs">
                      Summary Totals:
                    </td>
                    <td className="px-3 py-3 text-right">{formatNumber(tableTotals.totalOrdered)}</td>
                    <td className="px-3 py-3 text-right">{formatNumber(tableTotals.totalDispatched)}</td>
                    <td className="px-3 py-3 text-right text-blue-900">{formatNumber(tableTotals.totalReceived)}</td>
                    <td colSpan={3} className="px-3 py-3 text-right text-gray-500 font-normal">
                      Weighted Sum:
                    </td>
                    <td className="px-3 py-3 text-right text-indigo-700 font-extrabold font-mono">
                      {formatNumber(tableTotals.totalWeighted)}
                    </td>
                    <td colSpan={2} className="px-3 py-3 text-left text-xs font-semibold text-gray-600">
                      Avg Score: <span className="text-blue-700">{tableTotals.avgScore} / 100</span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* =========================================================
            BOTTOM ROW: REPLACEMENT EVIDENCE & FINAL RECONCILIATION
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Replacement Delivery Evidence (7 Cols) */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  Replacement Delivery Evidence
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  (Audited separately to prevent double-counting in normal delivery formula ⓘ)
                </p>
              </div>
            </div>

            {/* Mini KPI summary strip */}
            {replacementSummary && (
              <div className="mb-4 grid grid-cols-4 gap-2 rounded-lg bg-purple-50/50 p-2.5 text-center text-xs sm:grid-cols-8 border border-purple-100">
                <div>
                  <span className="text-[10px] text-gray-500">Req</span>
                  <p className="font-bold text-gray-800">{replacementSummary.requestedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Apprv</span>
                  <p className="font-bold text-gray-800">{replacementSummary.approvedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Disp</span>
                  <p className="font-bold text-gray-800">{replacementSummary.dispatchedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Recv</span>
                  <p className="font-bold text-gray-800">{replacementSummary.receivedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Acpt</span>
                  <p className="font-bold text-emerald-700">{replacementSummary.acceptedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Rejc</span>
                  <p className="font-bold text-red-700">{replacementSummary.rejectedQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Pend</span>
                  <p className="font-bold text-amber-700">{replacementSummary.pendingQuantity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Avg Dly</span>
                  <p className="font-bold text-purple-800">{replacementSummary.averageDelayDays}d</p>
                </div>
              </div>
            )}

            {/* Replacement Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 font-semibold text-gray-600">
                  <tr>
                    <th className="px-2.5 py-2">#</th>
                    <th className="px-2.5 py-2">Request #</th>
                    <th className="px-2.5 py-2">Orig PO</th>
                    <th className="px-2.5 py-2">Material</th>
                    <th className="px-2.5 py-2 text-right">Qty</th>
                    <th className="px-2.5 py-2">Req Date</th>
                    <th className="px-2.5 py-2">Receipt Date</th>
                    <th className="px-2.5 py-2 text-center">Delay</th>
                    <th className="px-2.5 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  {replacementEvidence?.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-xs text-gray-400">
                        No replacement dispatches logged for this vendor in this period.
                      </td>
                    </tr>
                  ) : (
                    replacementEvidence.map((rep, idx) => (
                      <tr key={rep.id || idx} className="hover:bg-purple-50/30">
                        <td className="px-2.5 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-2.5 py-2 font-mono font-medium text-purple-700">
                          {rep.replacementRequestNumber}
                        </td>
                        <td className="px-2.5 py-2 text-blue-600">{rep.originalPONumber}</td>
                        <td className="px-2.5 py-2 font-medium">{rep.materialName}</td>
                        <td className="px-2.5 py-2 text-right font-bold">{rep.replacementQuantity}</td>
                        <td className="px-2.5 py-2 text-gray-500">{formatDate(rep.requestDate)}</td>
                        <td className="px-2.5 py-2 text-gray-900">{formatDate(rep.receiptDate)}</td>
                        <td className="px-2.5 py-2 text-center font-semibold">
                          {rep.delayDays} d
                        </td>
                        <td className="px-2.5 py-2">
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800">
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Calculation Card (5 Cols) */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Final Calculation Breakdown
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Total Weighted Score (&Sigma; Qty &times; Score)</span>
                <span className="font-mono font-bold text-gray-900">
                  {formatNumber(finalCalculation.totalWeightedScore)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Total Received Quantity (&Sigma; Qty)</span>
                <span className="font-mono font-bold text-gray-900">
                  {formatNumber(finalCalculation.totalReceivedQuantity)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Delivery Performance Score</span>
                <span className="text-base font-extrabold text-blue-700">
                  {Number(finalCalculation.deliveryScore || 0).toFixed(2)} / 100
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Delivery Weightage in Vendor Rating</span>
                <span className="font-bold text-gray-800">{finalCalculation.weight}%</span>
              </div>
              {finalCalculation.adjustment !== 0 && (
                <div className="flex justify-between border-b border-amber-100 bg-amber-50/60 p-2 rounded text-xs text-amber-800">
                  <span>Evaluator Adjustment ({finalCalculation.adjustmentReason})</span>
                  <span className="font-bold">
                    {finalCalculation.adjustment > 0 ? `+${finalCalculation.adjustment}` : finalCalculation.adjustment} pts
                  </span>
                </div>
              )}
              <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                    Final Overall Contribution
                  </span>
                  <p className="text-xs text-gray-500">Delivery Score &times; 30%</p>
                </div>
                <div className="text-3xl font-extrabold text-blue-900">
                  {Number(finalCalculation.overallContribution || 0).toFixed(2)}
                  <span className="text-sm font-medium text-gray-500"> / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FOOTER: FORMULA & IMPORTANT NOTES (MATCHING MOCKUP)
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Formula Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Info className="h-4 w-4 text-blue-600" /> Calculation Formula
            </h4>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-800 border border-gray-200">
              Score = [ &Sigma; (Received Quantity &times; Individual Score) / Total Received Quantity ] &times; 30%
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Where individual score is evaluated strictly against expected receipt date hierarchy (Dispatch expected date overriding PO contract date).
            </p>
          </div>

          {/* Important Notes Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Important Notes
            </h4>
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>
                <strong>Replacement Deliveries:</strong> Kept in dedicated evidence audit to avoid duplicate penalties against Order Fulfillment and Quality.
              </li>
              <li>
                <strong>Split Dispatches:</strong> Evaluated based on remaining commitment dates without penalizing buyer-authorized splits.
              </li>
              <li>
                <strong>Gate Accuracy:</strong> All receipts are grounded directly in physical Goods Receipt Notes (GRN).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

