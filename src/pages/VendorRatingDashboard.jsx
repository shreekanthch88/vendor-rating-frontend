import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
  Star,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import Layout from "../layout/Layout";

import {
  getVendorRatingDashboard,
} from "../services/vendorRatingDashboardService";

/**
 * =========================================================
 * ADMIN VENDOR RATING DASHBOARD
 * =========================================================
 *
 * Backend source:
 *
 * GET /api/vendor-rating-dashboard
 *
 * This page does not calculate vendor ratings.
 * All rating calculations come from the backend.
 *
 * =========================================================
 */

const VendorRatingDashboard = () => {
  /**
   * =======================================================
   * STATE
   * =======================================================
   */

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [appliedFromDate, setAppliedFromDate] =
    useState("");

  const [appliedToDate, setAppliedToDate] =
    useState("");

  /**
   * =======================================================
   * LOAD DASHBOARD
   * =======================================================
   */

  const loadDashboard = async (
    selectedFromDate = appliedFromDate,
    selectedToDate = appliedToDate
  ) => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getVendorRatingDashboard({
          fromDate: selectedFromDate,
          toDate: selectedToDate,
        });

      setDashboard(data);
    } catch (err) {
      console.error(
        "Vendor Rating Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load vendor rating dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {
    loadDashboard();
  }, []);

  /**
   * =======================================================
   * BACKEND DATA
   *
   * IMPORTANT:
   * These values MUST be created before any conditional
   * return because useMemo below depends on them.
   * =======================================================
   */

  const summary =
    dashboard?.summary || {};

  const topPerformingVendors =
    dashboard?.topPerformingVendors || [];

  const ratingDistribution =
    dashboard?.ratingDistribution || {};

  const highestMaterialsDelivered =
    dashboard?.highestMaterialsDelivered || [];

  const bestQualityVendors =
    dashboard?.bestQualityVendors || [];

  const bestDeliveryVendors =
    dashboard?.bestDeliveryVendors || [];

  const vendorsNeedingAttention =
    dashboard?.vendorsNeedingAttention || [];

  const recentActivity =
    dashboard?.recentActivity || [];

  const performanceTrend =
    dashboard?.performanceTrend || [];

  /**
   * =======================================================
   * TREND MAXIMUM
   *
   * IMPORTANT:
   * This hook MUST remain before loading/error returns.
   * =======================================================
   */

  const trendMax = useMemo(() => {
    const values =
      performanceTrend.flatMap(
        (item) => [
          Number(item.overallScore) || 0,
          Number(item.qualityScore) || 0,
          Number(item.deliveryScore) || 0,
          Number(item.fulfillmentScore) || 0,
          Number(item.priceScore) || 0,
          Number(item.responseTimeScore) || 0,
        ]
      );

    const max =
      Math.max(...values, 100);

    return max > 0 ? max : 100;
  }, [performanceTrend]);

  /**
   * =======================================================
   * FORMATTERS
   * =======================================================
   */

  const formatScore = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "N/A";
    }

    return number.toFixed(2);
  };

  const formatPercentage = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "N/A";
    }

    return `${number.toFixed(2)}%`;
  };

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /**
   * =======================================================
   * STATUS STYLE
   * =======================================================
   */

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Locked":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Submitted":
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Draft":
        return "bg-slate-100 text-slate-600 border-slate-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";

      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  /**
   * =======================================================
   * FILTER
   * =======================================================
   */

  const handleApplyFilters = async () => {
    if (
      fromDate &&
      toDate &&
      new Date(fromDate) >
        new Date(toDate)
    ) {
      setError(
        "From date cannot be after to date."
      );

      return;
    }

    setAppliedFromDate(fromDate);

    setAppliedToDate(toDate);

    await loadDashboard(
      fromDate,
      toDate
    );
  };

  const handleClearFilters = async () => {
    setFromDate("");

    setToDate("");

    setAppliedFromDate("");

    setAppliedToDate("");

    await loadDashboard("", "");
  };

  /**
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <RefreshCw
              className="animate-spin text-blue-600"
              size={24}
            />
          </div>

          <p className="text-sm font-medium text-slate-700">
            Loading Vendor Rating Dashboard...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Fetching real-time vendor performance data
          </p>

        </div>
      </div>
    );
  }

  /**
   * =======================================================
   * ERROR STATE
   * =======================================================
   */

  if (error && !dashboard) {
    return (
      <div className="min-h-[500px] bg-slate-50 p-6">

        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <XCircle
                className="text-red-600"
                size={22}
              />
            </div>

            <div>

              <h2 className="font-semibold text-red-800">
                Unable to Load Vendor Rating Dashboard
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => loadDashboard()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Retry
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /**
   * =======================================================
   * KPI CARD
   * =======================================================
   */

  const KpiCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>

      </div>

    </div>
  );

  /**
   * =======================================================
   * SECTION HEADER
   * =======================================================
   */

  const SectionHeader = ({
    title,
    description,
    icon: Icon,
  }) => (
    <div className="mb-5 flex items-start gap-3">

      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon size={18} />
        </div>
      )}

      <div>

        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

      </div>

    </div>
  );

  /**
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <Layout>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-6">

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Award size={23} />
              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Vendor Rating Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor vendor performance, quality,
                  delivery and rating analytics.
                </p>

              </div>

            </div>

          </div>

          {/* Date Filter */}

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex flex-col gap-3 md:flex-row md:items-end">

              <div>

                <label className="mb-1 block text-xs font-medium text-slate-500">
                  From Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) =>
                      setFromDate(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              <div>

                <label className="mb-1 block text-xs font-medium text-slate-500">
                  To Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) =>
                      setToDate(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              <button
                type="button"
                onClick={handleApplyFilters}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <BarChart3 size={15} />
                )}

                Apply

              </button>

              {(fromDate || toDate) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          BACKEND ERROR WHILE REFRESHING
      =================================================== */}

      {error && dashboard && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===================================================
          KPI ROW 1
      =================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Total Vendors"
          value={summary.totalVendors ?? 0}
          subtitle="Registered vendors"
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />

        <KpiCard
          title="Active Vendors"
          value={summary.activeVendors ?? 0}
          subtitle={`${formatPercentage(
            summary.activeVendorPercentage
          )} of total vendors`}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <KpiCard
          title="Rated Vendors"
          value={summary.ratedVendors ?? 0}
          subtitle="Vendors with a valid score"
          icon={Star}
          iconClass="bg-amber-50 text-amber-600"
        />

        <KpiCard
          title="Approved Vendors"
          value={summary.approvedVendors ?? 0}
          subtitle="Approved or locked ratings"
          icon={ShieldCheck}
          iconClass="bg-violet-50 text-violet-600"
        />

      </div>

      {/* ===================================================
          KPI ROW 2
      =================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Average Vendor Rating"
          value={
            summary.averageVendorRating != null
              ? `${formatScore(
                  summary.averageVendorRating
                )} / 5`
              : "N/A"
          }
          subtitle={
            summary.averageVendorScore != null
              ? `Overall score ${formatScore(
                  summary.averageVendorScore
                )} / 100`
              : "No rating score available"
          }
          icon={Star}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <KpiCard
          title="Top Rated Vendors"
          value={summary.topRatedVendors ?? 0}
          subtitle="Score of 80 or above"
          icon={Award}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <KpiCard
          title="Materials Delivered"
          value={summary.totalMaterialsDelivered ?? 0}
          subtitle="Accepted received quantity"
          icon={PackageCheck}
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <KpiCard
          title="On-Time Delivery"
          value={
            summary.onTimeDeliveryPercentage != null
              ? formatPercentage(
                  summary.onTimeDeliveryPercentage
                )
              : "N/A"
          }
          subtitle={
            summary.evaluatedDeliveryQuantity != null
              ? `${summary.onTimeDeliveryQuantity ?? 0} / ${summary.evaluatedDeliveryQuantity ?? 0} quantity`
              : "No evaluated deliveries"
          }
          icon={Truck}
          iconClass="bg-green-50 text-green-600"
        />

      </div>

      {/* ===================================================
          PERFORMANCE + DISTRIBUTION
      =================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Performance Trend */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <SectionHeader
            title="Vendor Performance Trend"
            description="Average vendor rating performance across evaluation periods."
            icon={BarChart3}
          />

          {performanceTrend.length > 0 ? (

            <div className="overflow-x-auto">

              <div className="min-w-[720px]">

                <div className="mb-5 flex flex-wrap gap-4 text-xs text-slate-600">

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    Overall
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Quality
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Delivery
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                    Fulfillment
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    Price
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    Response
                  </span>

                </div>

                <div className="relative h-[300px]">

                  <div className="absolute inset-0 flex flex-col justify-between">

                    {[100, 75, 50, 25, 0].map(
                      (value) => (
                        <div
                          key={value}
                          className="flex items-center gap-3"
                        >

                          <span className="w-8 text-right text-[10px] text-slate-400">
                            {value}
                          </span>

                          <div className="h-px flex-1 bg-slate-100" />

                        </div>
                      )
                    )}

                  </div>

                  <div className="absolute bottom-0 left-11 right-0 top-0 flex items-end gap-3 pl-3">

                    {performanceTrend.map(
                      (item) => {

                        const overall =
                          Number(
                            item.overallScore
                          ) || 0;

                        const quality =
                          Number(
                            item.qualityScore
                          ) || 0;

                        const delivery =
                          Number(
                            item.deliveryScore
                          ) || 0;

                        const fulfillment =
                          Number(
                            item.fulfillmentScore
                          ) || 0;

                        const price =
                          Number(
                            item.priceScore
                          ) || 0;

                        const response =
                          Number(
                            item.responseTimeScore
                          ) || 0;

                        return (
                          <div
                            key={`${item.year}-${item.month}`}
                            className="flex min-w-[70px] flex-1 flex-col justify-end"
                          >

                            <div className="flex h-[245px] items-end justify-center gap-1">

                              <div
                                title={`Overall: ${formatScore(
                                  overall
                                )}`}
                                className="w-2 rounded-t bg-blue-600"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (overall /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                              <div
                                title={`Quality: ${formatScore(
                                  quality
                                )}`}
                                className="w-2 rounded-t bg-emerald-500"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (quality /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                              <div
                                title={`Delivery: ${formatScore(
                                  delivery
                                )}`}
                                className="w-2 rounded-t bg-amber-500"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (delivery /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                              <div
                                title={`Fulfillment: ${formatScore(
                                  fulfillment
                                )}`}
                                className="w-2 rounded-t bg-violet-500"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (fulfillment /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                              <div
                                title={`Price: ${formatScore(
                                  price
                                )}`}
                                className="w-2 rounded-t bg-cyan-500"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (price /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                              <div
                                title={`Response: ${formatScore(
                                  response
                                )}`}
                                className="w-2 rounded-t bg-rose-500"
                                style={{
                                  height: `${Math.min(
                                    100,
                                    (response /
                                      trendMax) *
                                      100
                                  )}%`,
                                }}
                              />

                            </div>

                            <div className="mt-2 text-center">

                              <p className="text-[10px] font-medium text-slate-600">
                                {item.label}
                              </p>

                              <p className="mt-1 text-[9px] text-slate-400">
                                {item.ratingCount} rating
                                {item.ratingCount === 1
                                  ? ""
                                  : "s"}
                              </p>

                            </div>

                          </div>
                           
                        );
                      }
                    )}

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <EmptySection
              icon={BarChart3}
              text="No performance trend data available."
            />

          )}

        </div>

        {/* Rating Distribution */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <SectionHeader
            title="Rating Distribution"
            description="Current vendor rating distribution."
            icon={Star}
          />

          <div className="flex flex-col items-center">

            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: (() => {

                  const ranges =
                    ratingDistribution.ranges ||
                    [];

                  let current = 0;

                  const parts =
                    ranges.map(
                      (range) => {

                        const start =
                          current;

                        current +=
                          Number(
                            range.percentage
                          ) || 0;

                        return `${getRangeColor(
                          range.key
                        )} ${start}% ${current}%`;
                      }
                    );

                  if (
                    parts.length === 0
                  ) {
                    return "#e2e8f0";
                  }

                  return `conic-gradient(${parts.join(
                    ", "
                  )})`;
                })(),
              }}
            >

              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">

                <span className="text-3xl font-bold text-slate-800">
                  {ratingDistribution.totalRated ??
                    0}
                </span>

                <span className="text-xs text-slate-500">
                  Rated Vendors
                </span>

              </div>

            </div>

            <div className="mt-6 w-full space-y-3">

              {(ratingDistribution.ranges || []).map(
                (range) => (

                  <div
                    key={range.key}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${getRangeDotColor(
                          range.key
                        )}`}
                      />

                      <span className="text-sm text-slate-600">
                        {range.label}
                      </span>

                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {range.percentage}%
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          TOP PERFORMING VENDORS
      =================================================== */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Top Performing Vendors"
          description="Highest scoring vendors based on their latest rating."
          icon={Award}
        />

        {topPerformingVendors.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-4 py-3">
                    Rank
                  </th>

                  <th className="px-4 py-3">
                    Vendor
                  </th>

                  <th className="px-4 py-3">
                    Category
                  </th>

                  <th className="px-4 py-3">
                    Overall
                  </th>

                  <th className="px-4 py-3">
                    Quality
                  </th>

                  <th className="px-4 py-3">
                    Delivery
                  </th>

                  <th className="px-4 py-3">
                    Price
                  </th>

                  <th className="px-4 py-3">
                    Fulfillment
                  </th>

                  <th className="px-4 py-3">
                    Response
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {topPerformingVendors.map(
                  (vendor) => (

                    <tr
                      key={
                        vendor.ratingId ||
                        vendor.vendorId
                      }
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-4 py-4">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                          {vendor.rank}
                        </div>

                      </td>

                      <td className="px-4 py-4">

                        <p className="font-semibold text-slate-800">
                          {vendor.vendorName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {vendor.vendorCode}
                        </p>

                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {vendor.category || "—"}
                      </td>

                      <td className="px-4 py-4">

                        <div>

                          <p className="font-bold text-slate-800">
                            {formatScore(
                              vendor.overallScore
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            {vendor.overallRating != null
                              ? `${formatScore(
                                  vendor.overallRating
                                )} / 5`
                              : "N/A"}
                          </p>

                        </div>

                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatScore(
                          vendor.qualityScore
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatScore(
                          vendor.deliveryScore
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatScore(
                          vendor.priceScore
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatScore(
                          vendor.fulfillmentScore
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatScore(
                          vendor.responseTimeScore
                        )}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            vendor.ratingStatus
                          )}`}
                        >
                          {vendor.ratingStatus ||
                            "Unknown"}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <EmptySection
            icon={Award}
            text="No top-performing vendors available."
          />

        )}

      </div>

      {/* ===================================================
          QUALITY + DELIVERY
      =================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Quality */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <SectionHeader
            title="Best Quality Vendors"
            description="Vendors with the strongest quality performance."
            icon={ShieldCheck}
          />

          {bestQualityVendors.length > 0 ? (

            <div className="space-y-3">

              {bestQualityVendors.map(
                (vendor) => (

                  <div
                    key={
                      vendor.ratingId ||
                      vendor.vendorId
                    }
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700">
                          {vendor.rank}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {vendor.vendorName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {vendor.vendorCode}
                            {vendor.category
                              ? ` • ${vendor.category}`
                              : ""}
                          </p>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-lg font-bold text-slate-800">
                          {formatScore(
                            vendor.qualityScore
                          )}
                        </p>

                        <p className="text-xs text-slate-500">
                          {vendor.qualityRating != null
                            ? `${formatScore(
                                vendor.qualityRating
                              )} / 5`
                            : "Quality score"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <MetricMini
                        label="Rejection"
                        value={formatPercentage(
                          vendor.rejectionPercentage
                        )}
                      />

                      <MetricMini
                        label="Damage"
                        value={formatPercentage(
                          vendor.damagePercentage
                        )}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={ShieldCheck}
              text="No quality vendor data available."
            />

          )}

        </div>

        {/* Delivery */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <SectionHeader
            title="Best Delivery Vendors"
            description="Vendors with the strongest delivery performance."
            icon={Truck}
          />

          {bestDeliveryVendors.length > 0 ? (

            <div className="space-y-3">

              {bestDeliveryVendors.map(
                (vendor) => (

                  <div
                    key={
                      vendor.ratingId ||
                      vendor.vendorId
                    }
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
                          {vendor.rank}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {vendor.vendorName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {vendor.vendorCode}
                            {vendor.category
                              ? ` • ${vendor.category}`
                              : ""}
                          </p>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-lg font-bold text-slate-800">
                          {formatScore(
                            vendor.deliveryScore
                          )}
                        </p>

                        <p className="text-xs text-slate-500">
                          {vendor.deliveryRating != null
                            ? `${formatScore(
                                vendor.deliveryRating
                              )} / 5`
                            : "Delivery score"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">

                      <MetricMini
                        label="On-Time"
                        value={
                          vendor.onTimeQuantity ??
                          0
                        }
                      />

                      <MetricMini
                        label="Delayed"
                        value={
                          vendor.delayedQuantity ??
                          0
                        }
                      />

                      <MetricMini
                        label="Avg Delay"
                        value={
                          vendor.averageDelayDays != null
                            ? `${formatScore(
                                vendor.averageDelayDays
                              )} d`
                            : "N/A"
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={Truck}
              text="No delivery vendor data available."
            />

          )}

        </div>

      </div>

      {/* ===================================================
          MATERIALS + ATTENTION
      =================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Materials */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <SectionHeader
            title="Highest Materials Delivered"
            description="Vendors ranked by received material quantity."
            icon={PackageCheck}
          />

          {highestMaterialsDelivered.length > 0 ? (

            <div className="space-y-3">

              {highestMaterialsDelivered.map(
                (vendor) => (

                  <div
                    key={vendor.vendorId}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-700">
                      {vendor.rank}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate font-semibold text-slate-800">
                        {vendor.vendorName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {vendor.vendorCode}
                        {vendor.category
                          ? ` • ${vendor.category}`
                          : ""}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-slate-800">
                        {vendor.materialsDelivered}
                      </p>

                      <p className="text-xs text-slate-500">
                        Quantity
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={PackageCheck}
              text="No material delivery data available."
            />

          )}

        </div>

        {/* Attention */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <SectionHeader
            title="Vendors Needing Attention"
            description="Vendors requiring management review."
            icon={AlertTriangle}
          />

          {vendorsNeedingAttention.length > 0 ? (

            <div className="space-y-3">

              {vendorsNeedingAttention.map(
                (vendor) => (

                  <div
                    key={
                      vendor.ratingId ||
                      vendor.vendorId
                    }
                    className="rounded-xl border border-slate-100 p-4"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-800">
                          {vendor.vendorName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {vendor.vendorCode}
                          {vendor.category
                            ? ` • ${vendor.category}`
                            : ""}
                        </p>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          {vendor.issue}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getSeverityClasses(
                          vendor.severity
                        )}`}
                      >
                        {vendor.severity}
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {vendor.allIssues?.map(
                        (issue, index) => (

                          <span
                            key={`${issue.issue}-${index}`}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {issue.issue}
                          </span>

                        )
                      )}

                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">

                      <MetricMini
                        label="Overall"
                        value={
                          vendor.overallScore != null
                            ? formatScore(
                                vendor.overallScore
                              )
                            : "N/A"
                        }
                      />

                      <MetricMini
                        label="Quality"
                        value={
                          vendor.qualityScore != null
                            ? formatScore(
                                vendor.qualityScore
                              )
                            : "N/A"
                        }
                      />

                      <MetricMini
                        label="Delivery"
                        value={
                          vendor.deliveryScore != null
                            ? formatScore(
                                vendor.deliveryScore
                              )
                            : "N/A"
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  className="text-emerald-600"
                  size={22}
                />

                <div>

                  <p className="font-semibold text-emerald-800">
                    No vendors require attention
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    All currently rated vendors are within
                    the configured performance thresholds.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* ===================================================
          DELIVERY DETAILS
      =================================================== */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Delivery Performance Overview"
          description="Quantity and receipt-based delivery indicators."
          icon={Truck}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <DetailMetric
            icon={PackageOpen}
            title="Evaluated Receipts"
            value={
              summary.evaluatedDeliveryReceipts ??
              0
            }
          />

          <DetailMetric
            icon={CheckCircle2}
            title="On-Time Receipts"
            value={
              summary.onTimeReceipts ??
              0
            }
          />

          <DetailMetric
            icon={PackageCheck}
            title="Evaluated Quantity"
            value={
              summary.evaluatedDeliveryQuantity ??
              0
            }
          />

          <DetailMetric
            icon={Clock3}
            title="On-Time Quantity"
            value={
              summary.onTimeDeliveryQuantity ??
              0
            }
          />

        </div>

      </div>

      {/* ===================================================
          RECENT ACTIVITY
      =================================================== */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionHeader
          title="Recent Vendor Activity"
          description="Latest purchase, dispatch, receipt, inspection and rating events."
          icon={Activity}
        />

        {recentActivity.length > 0 ? (

          <div className="relative">

            <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200" />

            <div className="space-y-1">

              {recentActivity.map(
                (activity, index) => (

                  <ActivityRow
                    key={`${activity.type}-${activity.date}-${index}`}
                    activity={activity}
                    formatDateTime={formatDateTime}
                    getStatusClasses={getStatusClasses}
                  />

                )
              )}

            </div>

          </div>

        ) : (

          <EmptySection
            icon={Activity}
            text="No recent vendor activity available."
          />

        )}

      </div>

      {/* ===================================================
          FOOTER INFORMATION
      =================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

        <p>
          Vendor Rating Dashboard
        </p>

        <p>
          Last generated:{" "}
          {formatDateTime(
            dashboard?.generatedAt
          )}
        </p>

      </div>

    </div>

  </Layout>
  );
};


/**
 * =========================================================
 * SMALL COMPONENTS
 * =========================================================
 */

const MetricMini = ({
  label,
  value,
}) => (
  <div className="rounded-lg bg-white px-3 py-2">

    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-700">
      {value}
    </p>

  </div>
);


const DetailMetric = ({
  icon: Icon,
  title,
  value,
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
      <Icon size={19} />
    </div>

    <div>

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-800">
        {value}
      </p>

    </div>

  </div>
);


const EmptySection = ({
  icon: Icon,
  text,
}) => (
  <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">

    <Icon
      size={26}
      className="text-slate-300"
    />

    <p className="mt-3 text-sm text-slate-500">
      {text}
    </p>

  </div>
);


const ActivityRow = ({
  activity,
  formatDateTime,
  getStatusClasses,
}) => {

  const getActivityIcon = () => {

    switch (activity.type) {

      case "vendorRating":
        return (
          <Star
            size={17}
            className="text-amber-600"
          />
        );

      case "purchaseOrder":
        return (
          <PackageOpen
            size={17}
            className="text-blue-600"
          />
        );

      case "dispatch":
        return (
          <Truck
            size={17}
            className="text-violet-600"
          />
        );

      case "goodsReceipt":
        return (
          <PackageCheck
            size={17}
            className="text-emerald-600"
          />
        );

      case "qualityInspection":
        return (
          <ShieldCheck
            size={17}
            className="text-cyan-600"
          />
        );

      default:
        return (
          <Activity
            size={17}
            className="text-slate-600"
          />
        );
    }
  };


  const getActivityBackground = () => {

    switch (activity.type) {

      case "vendorRating":
        return "bg-amber-50";

      case "purchaseOrder":
        return "bg-blue-50";

      case "dispatch":
        return "bg-violet-50";

      case "goodsReceipt":
        return "bg-emerald-50";

      case "qualityInspection":
        return "bg-cyan-50";

      default:
        return "bg-slate-50";
    }
  };


  return (
    <div className="relative flex gap-4 rounded-xl p-3 transition hover:bg-slate-50">

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getActivityBackground()}`}
      >
        {getActivityIcon()}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap items-center gap-2">

            <p className="font-medium text-slate-800">
              {activity.title}
            </p>

            {activity.status && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(
                  activity.status
                )}`}
              >
                {activity.status}
              </span>
            )}

          </div>

          <span className="text-xs text-slate-400">
            {formatDateTime(
              activity.date
            )}
          </span>

        </div>

        <p className="mt-1 text-sm text-slate-500">
          {activity.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">

          {activity.reference && (
            <span>
              Ref: {activity.reference}
            </span>
          )}

          {activity.score != null && (
            <span>
              Score:{" "}
              {Number(
                activity.score
              ).toFixed(2)}
              /100
            </span>
          )}

        </div>

      </div>

    </div>
  );
};


/**
 * =========================================================
 * RATING DISTRIBUTION COLORS
 * =========================================================
 */

const getRangeColor = (key) => {

  switch (key) {

    case "4.5-5.0":
      return "#10b981";

    case "4.0-4.49":
      return "#3b82f6";

    case "3.5-3.99":
      return "#f59e0b";

    case "below-3.5":
      return "#ef4444";

    default:
      return "#cbd5e1";
  }
};


const getRangeDotColor = (key) => {

  switch (key) {

    case "4.5-5.0":
      return "bg-emerald-500";

    case "4.0-4.49":
      return "bg-blue-500";

    case "3.5-3.99":
      return "bg-amber-500";

    case "below-3.5":
      return "bg-red-500";

    default:
      return "bg-slate-300";
  }
};


export default VendorRatingDashboard;