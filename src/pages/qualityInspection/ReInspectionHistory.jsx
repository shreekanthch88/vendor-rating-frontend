import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  RefreshCw,
  Loader2,
  History,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  PackageCheck,
  User,
  CalendarDays,
} from "lucide-react";

import {
  getReInspectionHistory,
} from "../../services/reInspectionService";


// =========================================================
// HELPERS
// =========================================================

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const getVendorName = (vendor) => {
  if (!vendor) return "-";

  return (
    vendor.vendorName ||
    vendor.companyName ||
    vendor.name ||
    "-"
  );
};


const getPONumber = (purchaseOrder) => {
  if (!purchaseOrder) return "-";

  return (
    purchaseOrder.poNumber ||
    "-"
  );
};


const getGRNNumber = (goodsReceipt) => {
  if (!goodsReceipt) return "-";

  return (
    goodsReceipt.grnNumber ||
    "-"
  );
};


// =========================================================
// STATUS
// =========================================================

const getStatusStyle = (status) => {
  switch (status) {

    case "Completed":
      return {
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };

    case "In Progress":
      return {
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
        icon: Clock3,
      };

    case "Draft":
      return {
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
      };

    case "Cancelled":
      return {
        className:
          "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
      };

    default:
      return {
        className:
          "border-slate-200 bg-slate-50 text-slate-600",
        icon: Clock3,
      };
  }
};


// =========================================================
// RESULT
// =========================================================

const getResultStyle = (result) => {

  switch (result) {

    case "Accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Partially Accepted":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "Accepted with Damage":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "Conditional Acceptance":
      return "border-purple-200 bg-purple-50 text-purple-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};


// =========================================================
// TYPE
// =========================================================

const getTypeLabel = (type) => {

  if (
    type ===
    "REPLACEMENT_MATERIAL"
  ) {
    return "Replacement Material";
  }

  return "Original Material";
};


const getTypeStyle = (type) => {

  if (
    type ===
    "REPLACEMENT_MATERIAL"
  ) {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
};


// =========================================================
// COMPONENT
// =========================================================

const ReInspectionHistory = () => {

  const navigate = useNavigate();

  const {
    originalInspectionId,
  } = useParams();


  // =======================================================
  // STATE
  // =======================================================

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [expandedId, setExpandedId] =
    useState(null);


  // =======================================================
  // LOAD HISTORY
  // =======================================================

  const loadHistory = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getReInspectionHistory(
          originalInspectionId
        );

      console.log(
        "Re-Inspection History:",
        response
      );

      const data =
        response?.data ||
        [];

      setHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Load Re-Inspection History Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load re-inspection history."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (
      originalInspectionId
    ) {
      loadHistory();
    }

  }, [
    originalInspectionId,
  ]);


  // =======================================================
  // EMPTY
  // =======================================================

  const toggleExpanded = (id) => {

    setExpandedId(
      expandedId === id
        ? null
        : id
    );

  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50">

        <div className="flex min-h-[600px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">

              <Loader2
                size={23}
                className="animate-spin text-blue-600"
              />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading re-inspection history...
            </p>

          </div>

        </div>

      </div>
    );

  }


  // =======================================================
  // MAIN
  // =======================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/quality-inspection/re-inspections"
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>


          <div>

            <div className="flex items-center gap-2">

              <History
                size={20}
                className="text-blue-600"
              />

              <h1 className="text-xl font-bold text-slate-900">
                Re-Inspection History
              </h1>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Complete history of re-inspections linked to the original Quality Inspection.
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={loadHistory}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >

          <RefreshCw size={15} />

          Refresh

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <AlertCircle
            size={18}
            className="mt-0.5 text-red-600"
          />

          <div>

            <p className="text-sm font-semibold text-red-700">
              Unable to load history
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <SummaryCard
          label="Total Re-Inspections"
          value={history.length}
          icon={History}
        />


        <SummaryCard
          label="Completed"
          value={
            history.filter(
              (item) =>
                item.status ===
                "Completed"
            ).length
          }
          icon={CheckCircle2}
        />


        <SummaryCard
          label="Active"
          value={
            history.filter(
              (item) =>
                item.status ===
                  "Draft" ||
                item.status ===
                  "In Progress"
            ).length
          }
          icon={Clock3}
        />

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {history.length === 0 ? (

        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <History
            size={38}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-base font-bold text-slate-800">
            No Re-Inspection History
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            No re-inspection records have been created for this Quality Inspection yet.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/quality-inspection/re-inspections"
              )
            }
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Re-Inspections
          </button>

        </div>

      ) : (

        /* =================================================
           HISTORY TIMELINE
           ================================================= */

        <div className="space-y-5">

          {history.map(
            (item, index) => {

              const itemId =
                item._id;

              const expanded =
                expandedId === itemId;

              const status =
                getStatusStyle(
                  item.status
                );

              const StatusIcon =
                status.icon;


              const items =
                Array.isArray(
                  item.items
                )
                  ? item.items
                  : [];


              const totals =
                items.reduce(
                  (
                    total,
                    material
                  ) => {

                    total.inspection +=
                      Number(
                        material.inspectionQuantity ||
                          0
                      );

                    total.accepted +=
                      Number(
                        material.acceptedQuantity ||
                          0
                      );

                    total.rejected +=
                      Number(
                        material.rejectedQuantity ||
                          0
                      );

                    total.damaged +=
                      Number(
                        material.damagedQuantity ||
                          0
                      );

                    return total;

                  },
                  {
                    inspection: 0,
                    accepted: 0,
                    rejected: 0,
                    damaged: 0,
                  }
                );


              return (

                <div
                  key={itemId}
                  className="relative"
                >

                  {/* TIMELINE LINE */}

                  {index <
                    history.length - 1 && (

                    <div className="absolute left-[22px] top-[50px] h-[calc(100%+20px)] w-px bg-slate-200" />

                  )}


                  <div className="relative pl-12">

                    {/* TIMELINE ICON */}

                    <div className="absolute left-0 top-4 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-50 bg-white shadow-sm">

                      <StatusIcon
                        size={18}
                        className={
                          item.status ===
                          "Completed"
                            ? "text-emerald-600"
                            : item.status ===
                              "Cancelled"
                            ? "text-red-600"
                            : "text-blue-600"
                        }
                      />

                    </div>


                    {/* CARD */}

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">


                      {/* CARD HEADER */}

                      <div className="border-b border-slate-200 px-5 py-4">

                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="text-base font-bold text-slate-900">
                                {item.reInspectionNumber ||
                                  "Re-Inspection"}
                              </h2>


                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                              >
                                {item.status ||
                                  "-"}
                              </span>


                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getTypeStyle(
                                  item.reinspectionType
                                )}`}
                              >
                                {getTypeLabel(
                                  item.reinspectionType
                                )}
                              </span>


                              {item.overallResult && (

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getResultStyle(
                                    item.overallResult
                                  )}`}
                                >
                                  {item.overallResult}
                                </span>

                              )}

                            </div>


                            <p className="mt-2 text-xs text-slate-500">
                              Created on{" "}
                              <span className="font-semibold text-slate-700">
                                {formatDateTime(
                                  item.createdAt
                                )}
                              </span>
                            </p>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/quality-inspection/re-inspections/${item._id}`
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >

                            <Eye size={15} />

                            View Details

                          </button>

                        </div>

                      </div>


                      {/* BASIC INFORMATION */}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

                        <InfoCell
                          label="Original Inspection"
                          value={
                            item
                              ?.originalInspection
                              ?.inspectionNumber ||
                            "-"
                          }
                        />

                        <InfoCell
                          label="Vendor"
                          value={
                            getVendorName(
                              item.vendor
                            )
                          }
                        />

                        <InfoCell
                          label="Purchase Order"
                          value={
                            getPONumber(
                              item.purchaseOrder
                            )
                          }
                        />

                        <InfoCell
                          label="Goods Receipt"
                          value={
                            getGRNNumber(
                              item.goodsReceipt
                            )
                          }
                        />

                      </div>


                      {/* REASON */}

                      <div className="border-t border-slate-200 px-5 py-4">

                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Re-Inspection Reason
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {item.reason ||
                            "-"}
                        </p>

                      </div>


                      {/* QUANTITY SUMMARY */}

                      <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">

                        <QuantityCell
                          label="Inspected"
                          value={
                            totals.inspection
                          }
                        />

                        <QuantityCell
                          label="Accepted"
                          value={
                            totals.accepted
                          }
                          className="text-emerald-600"
                        />

                        <QuantityCell
                          label="Rejected"
                          value={
                            totals.rejected
                          }
                          className="text-red-600"
                        />

                        <QuantityCell
                          label="Damaged"
                          value={
                            totals.damaged
                          }
                          className="text-orange-600"
                        />

                      </div>


                      {/* EXPAND BUTTON */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleExpanded(
                            itemId
                          )
                        }
                        className="flex w-full items-center justify-center border-t border-slate-200 px-5 py-3 text-xs font-semibold text-blue-600 hover:bg-slate-50"
                      >

                        {expanded
                          ? "Hide Material Details"
                          : "View Material Details"}

                      </button>


                      {/* MATERIAL DETAILS */}

                      {expanded && (

                        <div className="border-t border-slate-200">

                          <div className="overflow-x-auto">

                            <table className="min-w-[850px] w-full">

                              <thead>

                                <tr className="bg-slate-50">

                                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Material
                                  </th>

                                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Inspected
                                  </th>

                                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                    Accepted
                                  </th>

                                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-red-600">
                                    Rejected
                                  </th>

                                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-orange-600">
                                    Damaged
                                  </th>

                                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Remarks
                                  </th>

                                </tr>

                              </thead>


                              <tbody>

                                {items.length ===
                                0 ? (

                                  <tr>

                                    <td
                                      colSpan="6"
                                      className="px-5 py-8 text-center text-sm text-slate-500"
                                    >
                                      No material records found.
                                    </td>

                                  </tr>

                                ) : (

                                  items.map(
                                    (
                                      material,
                                      materialIndex
                                    ) => (

                                      <tr
                                        key={
                                          material._id ||
                                          materialIndex
                                        }
                                        className="border-t border-slate-100"
                                      >

                                        <td className="px-4 py-4">

                                          <p className="text-xs font-bold text-slate-800">
                                            {material.materialName ||
                                              "-"}
                                          </p>

                                          <p className="mt-1 text-[10px] text-slate-500">
                                            {material.materialCode ||
                                              "-"}
                                          </p>

                                        </td>


                                        <td className="px-4 py-4 text-right text-xs font-bold text-slate-800">
                                          {Number(
                                            material.inspectionQuantity ||
                                              0
                                          )}
                                        </td>


                                        <td className="px-4 py-4 text-right text-xs font-bold text-emerald-600">
                                          {Number(
                                            material.acceptedQuantity ||
                                              0
                                          )}
                                        </td>


                                        <td className="px-4 py-4 text-right text-xs font-bold text-red-600">
                                          {Number(
                                            material.rejectedQuantity ||
                                              0
                                          )}
                                        </td>


                                        <td className="px-4 py-4 text-right text-xs font-bold text-orange-600">
                                          {Number(
                                            material.damagedQuantity ||
                                              0
                                          )}
                                        </td>


                                        <td className="px-4 py-4 text-xs text-slate-600">
                                          {material.remarks ||
                                            "-"}
                                        </td>

                                      </tr>

                                    )
                                  )

                                )}

                              </tbody>

                            </table>

                          </div>

                        </div>

                      )}


                      {/* AUDIT */}

                      <div className="grid grid-cols-1 border-t border-slate-200 md:grid-cols-2">

                        <AuditCell
                          icon={User}
                          label="Created By"
                          name={
                            item?.createdBy
                              ?.name ||
                            "-"
                          }
                          date={
                            formatDateTime(
                              item.createdAt
                            )
                          }
                        />


                        <AuditCell
                          icon={CheckCircle2}
                          label="Completed By"
                          name={
                            item?.completedBy
                              ?.name ||
                            "-"
                          }
                          date={
                            item.completedAt
                              ? formatDateTime(
                                  item.completedAt
                                )
                              : "Not completed"
                          }
                        />

                      </div>


                      {/* FINAL REMARKS */}

                      {item.remarks && (

                        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Final Remarks
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {item.remarks}
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>
  );
};


// =========================================================
// INFO CELL
// =========================================================

const InfoCell = ({
  label,
  value,
}) => {

  return (
    <div className="border-b border-slate-200 px-5 py-4">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>

    </div>
  );
};


// =========================================================
// QUANTITY CELL
// =========================================================

const QuantityCell = ({
  label,
  value,
  className = "text-slate-800",
}) => {

  return (
    <div className="border-r border-slate-200 px-5 py-4 last:border-r-0">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${className}`}
      >
        {value}
      </p>

    </div>
  );
};


// =========================================================
// AUDIT CELL
// =========================================================

const AuditCell = ({
  icon: Icon,
  label,
  name,
  date,
}) => {

  return (
    <div className="flex items-start gap-3 border-r border-slate-200 px-5 py-4 last:border-r-0">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">

        <Icon
          size={15}
          className="text-slate-500"
        />

      </div>

      <div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-800">
          {name}
        </p>

        <p className="mt-1 text-[10px] text-slate-500">
          {date}
        </p>

      </div>

    </div>
  );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  label,
  value,
  icon: Icon,
}) => {

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <Icon
          size={17}
          className="text-slate-400"
        />

      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};


export default ReInspectionHistory;