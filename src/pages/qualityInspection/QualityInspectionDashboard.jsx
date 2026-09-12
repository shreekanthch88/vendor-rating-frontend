import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  Search,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

import {
  getQualityInspectionDashboardSummary,
  getAllQualityInspections,
} from "../../services/qualityInspectionService";


const QualityInspectionDashboard = () => {

  const navigate = useNavigate();


  // =====================================================
  // DASHBOARD STATE
  // =====================================================

  const [summary, setSummary] = useState({
    totalInspections: 0,
    pending: 0,
    completed: 0,
    accepted: 0,
    partialRejection: 0,
    fullRejection: 0,
    damage: 0,
    replacement: 0,
    reInspection: 0,
  });


  const [resultDistribution, setResultDistribution] =
    useState({
      accepted: 0,
      partialRejection: 0,
      fullRejection: 0,
      damage: 0,
    });


  const [recentInspections, setRecentInspections] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [tableLoading, setTableLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [search, setSearch] =
    useState("");


  const [status, setStatus] =
    useState("");


  const [page, setPage] =
    useState(1);


  const [pagination, setPagination] =
    useState({
      total: 0,
      pages: 1,
      limit: 5,
    });


  // =====================================================
  // LOAD DASHBOARD SUMMARY
  // =====================================================

  const loadDashboardSummary = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getQualityInspectionDashboardSummary();


      const data =
        response?.data || {};


      setSummary(
        data?.summary || {
          totalInspections: 0,
          pending: 0,
          completed: 0,
          accepted: 0,
          partialRejection: 0,
          fullRejection: 0,
          damage: 0,
          replacement: 0,
          reInspection: 0,
        }
      );


      setResultDistribution(
        data?.resultDistribution || {
          accepted: 0,
          partialRejection: 0,
          fullRejection: 0,
          damage: 0,
        }
      );

    } catch (err) {

      console.error(
        "Load Quality Inspection Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load Quality Inspection dashboard."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD RECENT INSPECTIONS
  // =====================================================

  const loadRecentInspections = async () => {

    try {

      setTableLoading(true);

      const response =
        await getAllQualityInspections(
          page,
          5,
          search,
          status
        );


      const inspections =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];


      setRecentInspections(
        inspections
      );


      if (response?.pagination) {

        setPagination(
          response.pagination
        );

      }

    } catch (err) {

      console.error(
        "Load Recent Quality Inspections Error:",
        err
      );

    } finally {

      setTableLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadDashboardSummary();

  }, []);


  // =====================================================
  // INSPECTION TABLE LOAD
  // =====================================================

  useEffect(() => {

    loadRecentInspections();

  }, [
    page,
    status,
    search,
  ]);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    await Promise.all([
      loadDashboardSummary(),
      loadRecentInspections(),
    ]);

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {

    setSearch(
      event.target.value
    );

    setPage(1);

  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (value) => {

    switch (value) {

      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Submitted":
        return "bg-indigo-100 text-indigo-700";

      case "Draft":
        return "bg-slate-100 text-slate-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Conditional":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";

    }

  };


  // =====================================================
  // RESULT BADGE
  // =====================================================

  const getResultClass = (value) => {

    switch (value) {

      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Partially Accepted":
        return "bg-amber-100 text-amber-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Accepted with Damage":
        return "bg-orange-100 text-orange-700";

      case "Conditional":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-600";

    }

  };


  // =====================================================
  // KPI CARD
  // =====================================================

  const KpiCard = ({
    title,
    value,
    icon: Icon,
    description,
    iconClass,
  }) => {

    return (

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">

              {loading
                ? "—"
                : value}

            </p>

            {description && (

              <p className="mt-1 text-xs text-slate-400">
                {description}
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

  };


  // =====================================================
  // RESULT DISTRIBUTION
  // =====================================================

  const distributionTotal =
    resultDistribution.accepted +
    resultDistribution.partialRejection +
    resultDistribution.fullRejection +
    resultDistribution.damage;


  const getPercentage = (value) => {

    if (!distributionTotal) {
      return 0;
    }

    return Math.round(
      (value / distributionTotal) * 100
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">

              <ClipboardCheck size={24} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-800">
                Quality Inspection Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor inspections, quality results,
                replacements and re-inspections.
              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/quality-inspection/inspections"
              )
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >

            <ClipboardCheck size={17} />

            View Inspections

          </button>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadDashboardSummary}
            className="font-semibold underline"
          >
            Retry
          </button>

        </div>

      )}


      {/* =================================================
          KPI ROW 1
      ================================================= */}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Total Inspections"
          value={summary.totalInspections}
          icon={ClipboardCheck}
          description="All recorded inspections"
          iconClass="bg-blue-100 text-blue-700"
        />


        <KpiCard
          title="Pending"
          value={summary.pending}
          icon={Clock3}
          description="Awaiting completion"
          iconClass="bg-amber-100 text-amber-700"
        />


        <KpiCard
          title="Completed"
          value={summary.completed}
          icon={FileCheck2}
          description="Completed inspections"
          iconClass="bg-indigo-100 text-indigo-700"
        />


        <KpiCard
          title="Accepted"
          value={summary.accepted}
          icon={CheckCircle2}
          description="Fully accepted"
          iconClass="bg-green-100 text-green-700"
        />

      </div>


      {/* =================================================
          KPI ROW 2
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <KpiCard
          title="Partial Rejection"
          value={summary.partialRejection}
          icon={AlertTriangle}
          description="Partially accepted"
          iconClass="bg-yellow-100 text-yellow-700"
        />


        <KpiCard
          title="Full Rejection"
          value={summary.fullRejection}
          icon={XCircle}
          description="Rejected inspections"
          iconClass="bg-red-100 text-red-700"
        />


        <KpiCard
          title="Damage"
          value={summary.damage}
          icon={AlertTriangle}
          description="Damage identified"
          iconClass="bg-orange-100 text-orange-700"
        />


        <KpiCard
          title="Replacement"
          value={summary.replacement}
          icon={RefreshCw}
          description="Replacement required"
          iconClass="bg-purple-100 text-purple-700"
        />


        <KpiCard
          title="Re-inspection"
          value={summary.reInspection}
          icon={RotateCcw}
          description="Re-inspection cases"
          iconClass="bg-cyan-100 text-cyan-700"
        />

      </div>


      {/* =================================================
          RESULT DISTRIBUTION
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Inspection Result Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of completed inspection results.
            </p>

          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">

            Total Results:

            <span className="ml-1 font-bold text-slate-800">
              {distributionTotal}
            </span>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


          {/* ACCEPTED */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-600">
                Accepted
              </span>

              <span className="font-bold text-green-700">
                {resultDistribution.accepted}
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${getPercentage(
                    resultDistribution.accepted
                  )}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              {getPercentage(
                resultDistribution.accepted
              )}% of results
            </p>

          </div>


          {/* PARTIAL */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-600">
                Partial Rejection
              </span>

              <span className="font-bold text-amber-700">
                {resultDistribution.partialRejection}
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-amber-500"
                style={{
                  width: `${getPercentage(
                    resultDistribution.partialRejection
                  )}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              {getPercentage(
                resultDistribution.partialRejection
              )}% of results
            </p>

          </div>


          {/* FULL REJECTION */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-600">
                Full Rejection
              </span>

              <span className="font-bold text-red-700">
                {resultDistribution.fullRejection}
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: `${getPercentage(
                    resultDistribution.fullRejection
                  )}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              {getPercentage(
                resultDistribution.fullRejection
              )}% of results
            </p>

          </div>


          {/* DAMAGE */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-600">
                Damage
              </span>

              <span className="font-bold text-orange-700">
                {resultDistribution.damage}
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-orange-500"
                style={{
                  width: `${getPercentage(
                    resultDistribution.damage
                  )}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              {getPercentage(
                resultDistribution.damage
              )}% of results
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          INSPECTION FILTERS
      ================================================= */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search inspection, GRN or PO..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>


          {/* STATUS */}

          <select
            value={status}
            onChange={(event) => {

              setStatus(
                event.target.value
              );

              setPage(1);

            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >

            <option value="">
              All Status
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Submitted">
              Submitted
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>


          {/* TOTAL */}

          <div className="flex items-center rounded-xl bg-slate-50 px-4 py-2.5">

            <span className="text-sm text-slate-500">
              Matching Inspections:
            </span>

            <span className="ml-2 font-bold text-slate-800">

              {pagination.total ||
                recentInspections.length}

            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          RECENT INSPECTIONS
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-bold text-slate-800">
              Recent Quality Inspections
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest inspection records.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/quality-inspection/inspections"
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >

            View All

            <ArrowRight size={16} />

          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Inspection
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  GRN
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  PO
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vendor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Result
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {tableLoading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading inspections...
                    </p>

                  </td>

                </tr>

              ) : recentInspections.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >

                    <ClipboardCheck
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-semibold text-slate-700">
                      No inspections found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      No inspection records match the current filters.
                    </p>

                  </td>

                </tr>

              ) : (

                recentInspections.map(
                  (inspection) => {

                    const inspectionId =
                      inspection._id;


                    return (

                      <tr
                        key={inspectionId}
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-800">

                            {inspection.inspectionNumber ||
                              inspection.inspectionNo ||
                              "-"}

                          </p>

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {
                            inspection.goodsReceipt
                              ?.grnNumber ||
                            inspection.grn
                              ?.grnNumber ||
                            "-"
                          }

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {
                            inspection.purchaseOrder
                              ?.poNumber ||
                            inspection.goodsReceipt
                              ?.purchaseOrder
                              ?.poNumber ||
                            "-"
                          }

                        </td>


                        <td className="px-5 py-4">

                          <p className="text-sm font-medium text-slate-700">

                            {
                              inspection.vendor
                                ?.vendorName ||
                              "-"
                            }

                          </p>

                          <p className="text-xs text-slate-400">

                            {
                              inspection.vendor
                                ?.vendorCode ||
                              ""
                            }

                          </p>

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {formatDate(
                            inspection.inspectionDate ||
                            inspection.createdAt
                          )}

                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClass(
                                inspection.status
                              )}
                            `}
                          >

                            {inspection.status ||
                              "Draft"}

                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getResultClass(
                                inspection.overallResult ||
                                inspection.result
                              )}
                            `}
                          >

                            {
                              inspection.overallResult ||
                              inspection.result ||
                              "Pending"
                            }

                          </span>

                        </td>


                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/quality-inspection/inspections/${inspectionId}`
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >

                            View

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!tableLoading &&
          recentInspections.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">

                Page{" "}

                <span className="font-semibold text-slate-700">
                  {page}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">
                  {pagination.pages || 1}
                </span>

              </p>


              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Previous

                </button>


                <button
                  type="button"
                  disabled={
                    page >=
                    (pagination.pages || 1)
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Next

                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );

};


export default QualityInspectionDashboard;