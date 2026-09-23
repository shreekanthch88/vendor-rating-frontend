import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  RotateCcw,
  Calendar,
  Building2,
  Layers,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

import { getQualityInspectionAnalytics } from "../../services/qualityInspectionService";

const QualityInspectionAnalytics = () => {
  // =========================================================
  // FILTER STATE
  // =========================================================
  const [timePeriod, setTimePeriod] = useState("6m");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Comparison metric for Vendor Quality Comparison Bar Chart
  const [comparisonMetric, setComparisonMetric] = useState("acceptanceRate");

  // =========================================================
  // ANALYTICS DATA STATE
  // =========================================================
  const [data, setData] = useState({
    summary: {
      totalInspections: 0,
      trendPercent: 0,
      accepted: { count: 0, rate: 0 },
      conditionallyAccepted: { count: 0, rate: 0 },
      rejected: { count: 0, rate: 0 },
      reInspections: { count: 0, rate: 0 },
      replacementRequests: { count: 0, rate: 0 },
    },
    resultsDistribution: [
      { name: "Accepted", value: 0, percentage: 0, color: "#10B981" },
      { name: "Conditional", value: 0, percentage: 0, color: "#F59E0B" },
      { name: "Rejected", value: 0, percentage: 0, color: "#EF4444" },
    ],
    monthlyTrends: [],
    topDefects: [],
    vendorPerformance: [],
    materialRejections: [],
    reinspectionAnalysis: {
      total: 0,
      passedAfterCorrection: 0,
      failedAgain: 0,
      passedRate: 0,
      failedRate: 0,
    },
    replacementAnalysis: {
      total: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
      approvedRate: 0,
      rejectedRate: 0,
      pendingRate: 0,
    },
    filterOptions: {
      vendors: [],
      categories: [],
    },
  });

  // =========================================================
  // FETCH ANALYTICS
  // =========================================================
  const fetchAnalytics = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await getQualityInspectionAnalytics({
        timePeriod: params.timePeriod ?? timePeriod,
        vendorId: params.vendorId ?? selectedVendor,
        categoryId: params.categoryId ?? selectedCategory,
      });

      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load quality analytics:", err);
      setError("Unable to load latest analytics from server. Showing recent metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleApplyFilters = () => {
    fetchAnalytics({
      timePeriod,
      vendorId: selectedVendor,
      categoryId: selectedCategory,
    });
  };

  const handleResetFilters = () => {
    setTimePeriod("6m");
    setSelectedVendor("");
    setSelectedCategory("");
    fetchAnalytics({
      timePeriod: "6m",
      vendorId: "",
      categoryId: "",
    });
  };

  // Safe results distribution for donut chart
  const resultsDonutData = useMemo(() => {
    const dist = data.resultsDistribution || [];
    const totalVal = dist.reduce((acc, curr) => acc + (curr.value || 0), 0);
    if (totalVal === 0) {
      return [{ name: "No Inspections", value: 1, color: "#E2E8F0" }];
    }
    return dist;
  }, [data.resultsDistribution]);

  // Re-inspection donut data
  const reinspectionChartData = useMemo(() => {
    const passed = data.reinspectionAnalysis?.passedAfterCorrection ?? 0;
    const failed = data.reinspectionAnalysis?.failedAgain ?? 0;
    if (passed === 0 && failed === 0) {
      return [{ name: "No Re-inspections", value: 1, color: "#E2E8F0" }];
    }
    return [
      { name: "Passed after correction", value: passed, color: "#10B981" },
      { name: "Failed again", value: failed, color: "#EF4444" },
    ];
  }, [data.reinspectionAnalysis]);

  // Replacement donut data
  const replacementChartData = useMemo(() => {
    const app = data.replacementAnalysis?.approved ?? 0;
    const rej = data.replacementAnalysis?.rejected ?? 0;
    const pen = data.replacementAnalysis?.pending ?? 0;
    if (app === 0 && rej === 0 && pen === 0) {
      return [{ name: "No Replacements", value: 1, color: "#E2E8F0" }];
    }
    return [
      { name: "Approved", value: app, color: "#10B981" },
      { name: "Rejected", value: rej, color: "#EF4444" },
      { name: "Pending", value: pen, color: "#F59E0B" },
    ];
  }, [data.replacementAnalysis]);

  // Vendor comparison bar chart data
  const vendorComparisonData = useMemo(() => {
    const list = data.vendorPerformance || [];
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#A855F7", "#F97316"];
    return list.slice(0, 5).map((v, i) => {
      const vName = v.vendorName || "Vendor";
      return {
        name: vName.length > 14 ? vName.substring(0, 12) + "..." : vName,
        fullName: vName,
        value: comparisonMetric === "acceptanceRate" ? (v.acceptedRate ?? 0) : (v.qualityScore ?? 0),
        fill: colors[i % colors.length],
      };
    });
  }, [data.vendorPerformance, comparisonMetric]);

  // Max count for top defects
  const maxDefectCount = useMemo(() => {
    return Math.max(...(data.topDefects || []).map((d) => d.count), 1);
  }, [data.topDefects]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      {/* =========================================================
          PAGE HEADER & FILTER BAR
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Quality Manager - Analytics</span>
            {loading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            In-depth analysis of vendor quality performance and trends
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Period Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 whitespace-nowrap">Time Period</span>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="bg-transparent border-0 font-medium text-slate-800 focus:ring-0 cursor-pointer outline-none text-xs"
            >
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 whitespace-nowrap">Vendor</span>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="bg-transparent border-0 font-medium text-slate-800 focus:ring-0 cursor-pointer outline-none text-xs max-w-[140px]"
            >
              <option value="">All Vendors</option>
              {(data.filterOptions?.vendors || []).map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Layers className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 whitespace-nowrap">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-0 font-medium text-slate-800 focus:ring-0 cursor-pointer outline-none text-xs max-w-[140px]"
            >
              <option value="">All Categories</option>
              {(data.filterOptions?.categories || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* =========================================================
          ROW 1: 6 TOP KPI CARDS
          ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Inspections */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.totalInspections}
              </div>
              <div className="text-xs text-slate-500 font-medium">Total Inspections</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.summary.trendPercent}% vs previous period</span>
          </div>
        </div>

        {/* Card 2: Accepted */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.accepted.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">Accepted</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-600">
            {data.summary.accepted.rate}% acceptance rate
          </div>
        </div>

        {/* Card 3: Conditionally Accepted */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.conditionallyAccepted.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">Conditionally Accepted</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-amber-600">
            {data.summary.conditionallyAccepted.rate}% of total
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.rejected.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">Rejected</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-rose-600">
            {data.summary.rejected.rate}% rejection rate
          </div>
        </div>

        {/* Card 5: Re-Inspections */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.reInspections.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">Re-Inspections</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-purple-600">
            {data.summary.reInspections.rate}% of total
          </div>
        </div>

        {/* Card 6: Replacement Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">
                {data.summary.replacementRequests.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">Replacement Requests</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-indigo-600">
            {data.summary.replacementRequests.rate}% of total
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 2: CHARTS (DISTRIBUTION, MONTHLY TREND, DEFECTS)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Results Distribution (Donut) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900">Inspection Results Distribution</h2>

          <div className="relative h-56 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultsDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {resultsDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} inspections`, name]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-black text-slate-900 leading-none">
                {data.summary.totalInspections}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">Total</div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
            {data.resultsDistribution.map((item) => (
              <div key={item.name} className="flex flex-col items-center text-center">
                <div className="flex items-center space-x-1 text-slate-600 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5 text-xs">
                  {item.value}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Quality Trend (Multi-Line Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Monthly Quality Trend</h2>
            <div className="flex items-center space-x-3 text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Acceptance</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Rejection</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Defect</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  formatter={(val, name) => [`${val}%`, name]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="acceptanceRate"
                  name="Acceptance Rate"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#FFFFFF" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejectionRate"
                  name="Rejection Rate"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#EF4444", strokeWidth: 2, stroke: "#FFFFFF" }}
                />
                <Line
                  type="monotone"
                  dataKey="defectRate"
                  name="Defect Rate"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#FFFFFF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Defect Reasons */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Top Defect Reasons</h2>
            <span className="text-[11px] text-slate-400 font-medium">All Types</span>
          </div>

          <div className="space-y-3.5 my-auto">
            {(data.topDefects || []).some((d) => d.count > 0) ? (
              (data.topDefects || []).map((defect) => {
                const percent = Math.round((defect.count / maxDefectCount) * 100);
                return (
                  <div key={defect.reason} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span className="truncate pr-2">{defect.reason}</span>
                      <span className="font-bold text-slate-900">{defect.count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: defect.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No defects reported for the selected period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 3: PERFORMANCE & REJECTION TABLES
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vendor Quality Performance Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Vendor Quality Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by overall compliance and delivery quality</p>
            </div>
            <Link
              to="/ratings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4 w-10">#</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4 text-center">Inspections</th>
                  <th className="py-3 px-4 text-center">Accepted %</th>
                  <th className="py-3 px-4 text-center">Rejected %</th>
                  <th className="py-3 px-4 text-center">Defect Rate</th>
                  <th className="py-3 px-4 text-center">Re-Inspection</th>
                  <th className="py-3 px-4 text-center">Quality Score</th>
                  <th className="py-3 px-4 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(data.vendorPerformance || []).length > 0 ? (
                  data.vendorPerformance.map((v, index) => (
                    <tr key={v.vendorId || index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{v.vendorName}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{v.inspections}</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">
                        {v.acceptedRate}%
                      </td>
                      <td className="py-3 px-4 text-center text-rose-600">{v.rejectedRate}%</td>
                      <td className="py-3 px-4 text-center text-slate-700">{v.defectRate}%</td>
                      <td className="py-3 px-4 text-center text-purple-600 font-semibold">
                        {v.reInspections}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            v.qualityScore >= 90
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : v.qualityScore >= 80
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {v.qualityScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {v.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500 inline" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500 inline" />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                      No vendor performance records found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Material-wise Rejection Analysis Table */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Material-wise Rejection Analysis</h2>
                <p className="text-xs text-slate-500 mt-0.5">High rejection items</p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">Material</th>
                    <th className="py-3 px-3 text-center">Inspections</th>
                    <th className="py-3 px-3 text-center">Rejection %</th>
                    <th className="py-3 px-3 text-center">Defect Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(data.materialRejections || []).length > 0 ? (
                    data.materialRejections.map((m, index) => (
                      <tr key={m.material || index} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{m.material}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{m.inspections}</td>
                        <td className="py-2.5 px-3 text-center text-rose-600 font-bold">
                          {m.rejectionRate}%
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{m.defectRate}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No material records found for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 4: RE-INSPECTION, REPLACEMENT & VENDOR COMPARISON
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Re-Inspection Analysis */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Re-inspection Analysis</h2>
            <Link
              to="/quality-inspection/re-inspections"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative h-44 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reinspectionChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {reinspectionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xl font-bold text-slate-900 leading-none">
                {data.reinspectionAnalysis?.total ?? 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Re-Inspections</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Passed after correction</span>
              </span>
              <span className="font-bold text-slate-900">
                {data.reinspectionAnalysis?.passedAfterCorrection ?? 0} (
                {data.reinspectionAnalysis?.passedRate ?? 0}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Failed again</span>
              </span>
              <span className="font-bold text-slate-900">
                {data.reinspectionAnalysis?.failedAgain ?? 0} (
                {data.reinspectionAnalysis?.failedRate ?? 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Replacement Analysis */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Replacement Analysis</h2>
            <Link
              to="/quality-inspection/replacements"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative h-44 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={replacementChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {replacementChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xl font-bold text-slate-900 leading-none">
                {data.replacementAnalysis?.total ?? 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Replacement Requests</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Approved</span>
              </span>
              <span className="font-bold text-slate-900">
                {data.replacementAnalysis?.approved ?? 0} ({data.replacementAnalysis?.approvedRate ?? 0}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Rejected</span>
              </span>
              <span className="font-bold text-slate-900">
                {data.replacementAnalysis?.rejected ?? 0} ({data.replacementAnalysis?.rejectedRate ?? 0}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pending</span>
              </span>
              <span className="font-bold text-slate-900">
                {data.replacementAnalysis?.pending ?? 0} ({data.replacementAnalysis?.pendingRate ?? 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Vendor Quality Comparison */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Vendor Quality Comparison</h2>
            <select
              value={comparisonMetric}
              onChange={(e) => setComparisonMetric(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="acceptanceRate">Acceptance Rate</option>
              <option value="qualityScore">Quality Score</option>
            </select>
          </div>

          <div className="h-56 w-full pt-2">
            {vendorComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorComparisonData} margin={{ top: 20, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748B" }} unit="%" />
                  <Tooltip
                    formatter={(val) => [`${val}%`, comparisonMetric === "acceptanceRate" ? "Acceptance Rate" : "Quality Score"]}
                    labelFormatter={(name, payload) => payload?.[0]?.payload?.fullName || name}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {vendorComparisonData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="value" position="top" formatter={(val) => `${val}%`} style={{ fontSize: 10, fontWeight: "bold", fill: "#334155" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No vendor performance data available to compare
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityInspectionAnalytics;

