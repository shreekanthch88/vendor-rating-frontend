import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle2,
  Clock3,
  FileCheck2,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Star,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";

import { useVendorAuth } from "../../context/VendorAuthContext";
import {
  getVendorRatingDashboard,
} from "../../services/vendorRatingService";


const Performance = () => {

  const {
    vendorProfile,
    loading: authLoading,
  } = useVendorAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD VENDOR PERFORMANCE
  // =========================================================

  const loadPerformance = async (
    isRefresh = false
  ) => {

    const vendorId =
      vendorProfile?._id;

    if (!vendorId) {
      setLoading(false);
      setError(
        "Vendor profile could not be identified."
      );
      return;
    }

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * IMPORTANT
       *
       * We use the logged-in vendor profile.
       *
       * Vendor X → X rating
       * Vendor Y → Y rating
       *
       * Backend remains the source of truth.
       */

      const response =
        await getVendorRatingDashboard(
          vendorId
        );

      /*
       * vendorRatingService returns response.data.
       *
       * Depending on backend controller response:
       *
       * response = {
       *   success: true,
       *   data: {...}
       * }
       *
       * OR:
       *
       * response = {...}
       */

      const data =
        response?.data ??
        response;

      setDashboard(data);

    } catch (err) {

      console.error(
        "Vendor Performance Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load vendor performance."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =========================================================
  // LOAD AFTER AUTHENTICATION
  // =========================================================

  useEffect(() => {

    if (authLoading) {
      return;
    }

    if (!vendorProfile?._id) {

      setLoading(false);

      setError(
        "Vendor profile could not be identified."
      );

      return;
    }

    loadPerformance();

  }, [
    authLoading,
    vendorProfile?._id,
  ]);


  // =========================================================
  // PARAMETERS
  // =========================================================

  const parameters = useMemo(() => {

    const backendParameters =
      dashboard?.parameters || {};

    const parameterDefinitions = [

      {
        key: "delivery",
        label: "Delivery Performance",
        description:
          "On-time delivery and delay performance",
        icon: Truck,
      },

      {
        key: "quality",
        label: "Quality Performance",
        description:
          "Inspection, rejection and defect performance",
        icon: ShieldCheck,
      },

      {
        key: "fulfillment",
        label: "Order Fulfillment",
        description:
          "Quantity successfully fulfilled",
        icon: PackageCheck,
      },

      {
        key: "price",
        label: "Price Competitiveness",
        description:
          "Vendor price against reference cost",
        icon: TrendingUp,
      },

      {
        key: "responseTime",
        label: "Response Time",
        description:
          "Purchase order response performance",
        icon: Clock3,
      },

      {
        key: "poAcceptance",
        label: "PO Acceptance",
        description:
          "Purchase order acceptance rate",
        icon: CheckCircle2,
      },

      {
        key: "documentation",
        label: "Documentation",
        description:
          "Transaction documentation compliance",
        icon: FileCheck2,
      },

      {
        key: "communication",
        label: "Communication",
        description:
          "Evaluator-assessed communication quality",
        icon: Activity,
      },

    ];

    return parameterDefinitions.map(
      (parameter) => ({

        ...parameter,

        score:
          backendParameters[
            parameter.key
          ]?.score ?? null,

        weight:
          backendParameters[
            parameter.key
          ]?.weight ?? 0,

      })
    );

  }, [dashboard]);


  // =========================================================
  // HELPERS
  // =========================================================

  const formatScore = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "N/A";
    }

    return Number(score).toFixed(1);
  };


  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "—";
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const getScoreColor = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "text-slate-400";
    }

    if (score >= 95) {
      return "text-emerald-600";
    }

    if (score >= 85) {
      return "text-green-600";
    }

    if (score >= 70) {
      return "text-blue-600";
    }

    if (score >= 50) {
      return "text-amber-600";
    }

    return "text-red-600";
  };


  const getProgressColor = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "bg-slate-300";
    }

    if (score >= 95) {
      return "bg-emerald-500";
    }

    if (score >= 85) {
      return "bg-green-500";
    }

    if (score >= 70) {
      return "bg-blue-500";
    }

    if (score >= 50) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };


  const getRatingLabel = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "Not Rated";
    }

    if (score >= 95) {
      return "Preferred Vendor";
    }

    if (score >= 85) {
      return "Excellent";
    }

    if (score >= 70) {
      return "Good";
    }

    if (score >= 50) {
      return "Average";
    }

    return "Poor";
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    authLoading ||
    loading
  ) {

    return (

      <div className="space-y-6">

        <div className="h-32 animate-pulse rounded-2xl bg-white" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          <div className="h-48 animate-pulse rounded-2xl bg-white" />

          <div className="h-48 animate-pulse rounded-2xl bg-white" />

          <div className="h-48 animate-pulse rounded-2xl bg-white" />

        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-white" />

      </div>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="rounded-2xl border border-red-200 bg-white p-10 shadow-sm">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

            <AlertCircle
              className="text-red-500"
              size={28}
            />

          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to load performance
          </h2>

          <p className="mt-2 max-w-lg text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadPerformance(true)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >

            <RefreshCw size={16} />

            Try Again

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // NO RATING
  // =========================================================

  if (
    !dashboard ||
    dashboard.hasRating === false
  ) {

    return (

      <div className="space-y-6">

        <PerformanceHeader
          vendorProfile={vendorProfile}
          refreshing={refreshing}
          onRefresh={() =>
            loadPerformance(true)
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">

          <div className="flex flex-col items-center text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

              <Star
                size={30}
                className="text-slate-400"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Vendor Rating Available
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              A vendor performance rating has not
              been generated for your account yet.
              Once an evaluation is completed,
              your performance score will appear
              here.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =========================================================
  // BACKEND DATA
  // =========================================================

  const overallScore =
    dashboard.overallScore;

  const systemScore =
    dashboard.systemOverallScore;

  const evaluatorScore =
    dashboard.evaluatorOverallScore;

  const ratingCategory =
    dashboard.ratingCategory ||
    getRatingLabel(
      overallScore
    );

  const status =
    dashboard.status ||
    "Draft";

  const transaction =
    dashboard.transactionSummary ||
    {};

  const replacement =
    dashboard.replacementSummary ||
    {};

  const reInspection =
    dashboard.reInspectionSummary ||
    {};

  const evaluationPeriod =
    dashboard.evaluationPeriod ||
    {};


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="space-y-6">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <PerformanceHeader
        vendorProfile={vendorProfile}
        status={status}
        evaluationPeriod={
          evaluationPeriod
        }
        refreshing={refreshing}
        onRefresh={() =>
          loadPerformance(true)
        }
      />


      {/* =====================================================
          SCORE SUMMARY
          ===================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Overall */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Overall Rating
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Vendor Performance
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">

              <Award
                size={24}
                className="text-amber-500"
              />

            </div>

          </div>


          <div className="mt-8 flex items-center gap-6">

            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[10px] border-blue-100 bg-blue-50">

              <div className="text-center">

                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    overallScore
                  )}`}
                >
                  {formatScore(
                    overallScore
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  / 100
                </div>

              </div>

            </div>


            <div>

              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {ratingCategory}
              </span>

              <p className="mt-3 text-sm leading-5 text-slate-500">
                Current overall vendor
                performance score.
              </p>

            </div>

          </div>

        </div>


        <ScoreCard
          title="System Score"
          score={systemScore}
          icon={Activity}
          description="Automatically calculated from transaction data"
        />


        <ScoreCard
          title="Evaluator Score"
          score={evaluatorScore}
          icon={Star}
          description="Final score after evaluator assessment"
        />

      </div>


      {/* =====================================================
          PARAMETERS
          ===================================================== */}

      <section>

        <div className="mb-4 flex items-end justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Performance Analysis
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Rating Parameters
            </h2>

          </div>

          <span className="text-xs text-slate-400">
            Backend calculated
          </span>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {parameters.map(
            (parameter) => (

              <ParameterCard
                key={
                  parameter.key
                }
                parameter={
                  parameter
                }
                getScoreColor={
                  getScoreColor
                }
                getProgressColor={
                  getProgressColor
                }
                formatScore={
                  formatScore
                }
              />

            )
          )}

        </div>

      </section>


      {/* =====================================================
          TRANSACTION SUMMARY
          ===================================================== */}

      <section>

        <div className="mb-4">

          <p className="text-sm font-medium text-slate-500">
            Transaction Overview
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Fulfillment & Delivery
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <MetricCard
            label="Purchase Orders"
            value={
              transaction.totalPurchaseOrders ??
              0
            }
            icon={PackageCheck}
          />

          <MetricCard
            label="Completed POs"
            value={
              transaction.completedPurchaseOrders ??
              0
            }
            icon={CheckCircle2}
          />

          <MetricCard
            label="Ordered Quantity"
            value={
              transaction.totalOrderedQuantity ??
              0
            }
            icon={PackageCheck}
          />

          <MetricCard
            label="Dispatched Quantity"
            value={
              transaction.totalDispatchedQuantity ??
              0
            }
            icon={Truck}
          />

          <MetricCard
            label="Received Quantity"
            value={
              transaction.totalReceivedQuantity ??
              0
            }
            icon={PackageCheck}
          />

          <MetricCard
            label="Accepted Quantity"
            value={
              transaction.totalAcceptedQuantity ??
              0
            }
            icon={CheckCircle2}
          />

          <MetricCard
            label="Rejected Quantity"
            value={
              transaction.totalRejectedQuantity ??
              0
            }
            icon={XCircle}
          />

          <MetricCard
            label="Pending Quantity"
            value={
              transaction.totalPendingQuantity ??
              0
            }
            icon={Clock3}
          />

        </div>

      </section>


      {/* =====================================================
          REPLACEMENT + REINSPECTION
          ===================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">


        {/* Replacement */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Replacement Activity
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                Replacement Summary
              </h3>

            </div>

            <RefreshCw
              size={22}
              className="text-orange-500"
            />

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            <MiniMetric
              label="Requests"
              value={
                replacement.requestCount ??
                0
              }
            />

            <MiniMetric
              label="Requested"
              value={
                replacement.requestedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Approved"
              value={
                replacement.approvedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Dispatched"
              value={
                replacement.dispatchedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Received"
              value={
                replacement.receivedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Accepted"
              value={
                replacement.acceptedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Rejected"
              value={
                replacement.rejectedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Pending"
              value={
                replacement.pendingQuantity ??
                0
              }
            />

          </div>

        </div>


        {/* Reinspection */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Quality Recovery
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                Re-inspection Summary
              </h3>

            </div>

            <ShieldCheck
              size={22}
              className="text-blue-500"
            />

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            <MiniMetric
              label="Re-inspections"
              value={
                reInspection.totalReInspections ??
                0
              }
            />

            <MiniMetric
              label="Inspected"
              value={
                reInspection.inspectedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Accepted"
              value={
                reInspection.acceptedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Rejected"
              value={
                reInspection.rejectedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Damaged"
              value={
                reInspection.damagedQuantity ??
                0
              }
            />

            <MiniMetric
              label="Deviation Accepted"
              value={
                reInspection.deviationAcceptedQuantity ??
                0
              }
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          EVALUATION PERIOD
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Evaluation Period
            </p>

            <p className="mt-1 font-semibold text-slate-900">

              {formatDate(
                evaluationPeriod.fromDate
              )}

              {" — "}

              {formatDate(
                evaluationPeriod.toDate
              )}

            </p>

          </div>


          <div className="text-sm text-slate-500">

            Status:

            <span className="ml-1 font-semibold text-slate-900">
              {status}
            </span>

          </div>

        </div>

      </div>

    </div>

  );

};


// =========================================================
// PERFORMANCE HEADER
// =========================================================

const PerformanceHeader = ({
  vendorProfile,
  status,
  evaluationPeriod,
  refreshing,
  onRefresh,
}) => {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-bold text-slate-900">
              Vendor Performance
            </h1>

            {status && (

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {status}
              </span>

            )}

          </div>


          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">

            <span>
              {vendorProfile?.vendorName ||
                "Vendor"}
            </span>

            {vendorProfile?.vendorCode && (

              <span>
                Code:
                <strong className="ml-1 text-slate-700">
                  {
                    vendorProfile.vendorCode
                  }
                </strong>
              </span>

            )}

            {vendorProfile?.vendorCategory && (

              <span>
                Category:
                <strong className="ml-1 text-slate-700">
                  {
                    vendorProfile.vendorCategory
                  }
                </strong>
              </span>

            )}

          </div>


          {evaluationPeriod?.fromDate && (

            <p className="mt-2 text-xs text-slate-400">

              Evaluation:

              {" "}

              {new Date(
                evaluationPeriod.fromDate
              ).toLocaleDateString(
                "en-IN"
              )}

              {" — "}

              {new Date(
                evaluationPeriod.toDate
              ).toLocaleDateString(
                "en-IN"
              )}

            </p>

          )}

        </div>


        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

    </div>

  );

};


// =========================================================
// SCORE CARD
// =========================================================

const ScoreCard = ({
  title,
  score,
  icon: Icon,
  description,
}) => {

  const color =
    score === null ||
    score === undefined
      ? "text-slate-400"
      : score >= 85
      ? "text-emerald-600"
      : score >= 70
      ? "text-blue-600"
      : score >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-3 text-4xl font-bold ${color}`}
          >

            {score === null ||
            score === undefined
              ? "N/A"
              : Number(score).toFixed(1)}

          </p>

        </div>


        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">

          <Icon
            size={21}
            className="text-slate-600"
          />

        </div>

      </div>


      <p className="mt-5 text-sm leading-5 text-slate-500">
        {description}
      </p>

    </div>

  );

};


// =========================================================
// PARAMETER CARD
// =========================================================

const ParameterCard = ({
  parameter,
  getScoreColor,
  getProgressColor,
  formatScore,
}) => {

  const Icon =
    parameter.icon;

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

          <Icon
            size={19}
            className="text-slate-600"
          />

        </div>


        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          {parameter.weight}%
        </span>

      </div>


      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
        Performance
      </p>

      <h3 className="mt-1 font-semibold text-slate-900">
        {parameter.label}
      </h3>

      <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-500">
        {parameter.description}
      </p>


      <div className="mt-5">

        <div className="flex items-end justify-between">

          <span
            className={`text-2xl font-bold ${getScoreColor(
              parameter.score
            )}`}
          >
            {formatScore(
              parameter.score
            )}
          </span>

          <span className="text-xs text-slate-400">
            / 100
          </span>

        </div>


        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`h-full rounded-full ${getProgressColor(
              parameter.score
            )}`}
            style={{
              width:
                parameter.score ===
                  null ||
                parameter.score ===
                  undefined
                  ? "0%"
                  : `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(
                          parameter.score
                        )
                      )
                    )}%`,
            }}
          />

        </div>

      </div>

    </div>

  );

};


// =========================================================
// METRIC CARD
// =========================================================

const MetricCard = ({
  label,
  value,
  icon: Icon,
}) => {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

          <Icon
            size={17}
            className="text-slate-600"
          />

        </div>

      </div>


      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>

  );

};


// =========================================================
// MINI METRIC
// =========================================================

const MiniMetric = ({
  label,
  value,
}) => {

  return (

    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>

  );

};


export default Performance;