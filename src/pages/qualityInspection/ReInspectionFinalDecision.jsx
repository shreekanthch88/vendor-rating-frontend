import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Save,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import api from "../../services/api";

import {
  getReInspectionById,
  updateReInspection,
} from "../../services/reInspectionService";


// =========================================================
// HELPERS
// =========================================================

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};


const getVendorName = (vendor) => {
  if (!vendor) return "-";

  if (typeof vendor === "string") {
    return vendor;
  }

  return (
    vendor.vendorName ||
    vendor.companyName ||
    vendor.name ||
    "-"
  );
};


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


const getPONumber = (data) => {
  return (
    data?.purchaseOrder?.poNumber ||
    data?.purchaseOrderNumber ||
    data?.poNumber ||
    "-"
  );
};


const getGRNNumber = (data) => {
  return (
    data?.goodsReceipt?.grnNumber ||
    data?.goodsReceiptNumber ||
    data?.grnNumber ||
    "-"
  );
};


// =========================================================
// RESULT COLOR
// =========================================================

const getResultClass = (result) => {
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
// COMPONENT
// =========================================================

const ReInspectionFinalDecision = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  // =======================================================
  // STATE
  // =======================================================

  const [reInspection, setReInspection] =
    useState(null);

  const [items, setItems] =
    useState([]);

  const [decision, setDecision] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // =======================================================
  // LOAD RE-INSPECTION
  // =======================================================

  const loadReInspection = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response =
        await getReInspectionById(id);

      console.log(
        "Final Decision RI Response:",
        response
      );

      const data =
        response?.data ||
        response?.reInspection ||
        response;

      if (!data) {
        throw new Error(
          "Re-inspection record was not found."
        );
      }

      setReInspection(data);

      setItems(
        Array.isArray(data.items)
          ? data.items
          : []
      );

      setDecision(
        data.overallResult &&
          data.overallResult !== "Pending"
          ? data.overallResult
          : ""
      );

      setRemarks(
        data.remarks || ""
      );

    } catch (err) {
      console.error(
        "Load Final Decision Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load re-inspection."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      loadReInspection();
    }
  }, [id]);


  // =======================================================
  // TOTALS
  // =======================================================

  const totals = useMemo(() => {
    return items.reduce(
      (total, item) => {
        total.inspection += Number(
          item.inspectionQuantity || 0
        );

        total.accepted += Number(
          item.acceptedQuantity || 0
        );

        total.rejected += Number(
          item.rejectedQuantity || 0
        );

        total.damaged += Number(
          item.damagedQuantity || 0
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
  }, [items]);


  // =======================================================
  // PENDING
  // =======================================================

  const pendingQuantity = Math.max(
    0,
    totals.inspection -
      totals.accepted -
      totals.rejected -
      totals.damaged
  );


  // =======================================================
  // READ ONLY
  // =======================================================

  const isCompleted =
    reInspection?.status ===
    "Completed";

  const isCancelled =
    reInspection?.status ===
    "Cancelled";


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateDecision = () => {
    if (!decision) {
      setError(
        "Please select the final decision."
      );

      return false;
    }

    if (
      decision ===
        "Conditional Acceptance" &&
      !remarks.trim()
    ) {
      setError(
        "Decision remarks are required for Conditional Acceptance."
      );

      return false;
    }

    setError("");

    return true;
  };


  // =======================================================
  // SAVE DECISION DRAFT
  // =======================================================

  const handleSaveDraft = async () => {
    if (
      isCompleted ||
      isCancelled
    ) {
      return;
    }

    if (!validateDecision()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        overallResult:
          decision,

        remarks:
          remarks.trim(),

        items: items.map(
          (item) => ({
            material:
              getId(
                item.material
              ),

            materialCode:
              item.materialCode || "",

            materialName:
              item.materialName || "",

            inspectionQuantity:
              Number(
                item.inspectionQuantity || 0
              ),

            acceptedQuantity:
              Number(
                item.acceptedQuantity || 0
              ),

            rejectedQuantity:
              Number(
                item.rejectedQuantity || 0
              ),

            damagedQuantity:
              Number(
                item.damagedQuantity || 0
              ),

            remarks:
              item.remarks || "",
          })
        ),
      };


      await updateReInspection(
        id,
        payload
      );


      setSuccessMessage(
        "Final decision draft saved successfully."
      );

      await loadReInspection();

    } catch (err) {
      console.error(
        "Save Final Decision Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save final decision."
      );

    } finally {
      setSaving(false);
    }
  };


  // =======================================================
  // CONFIRM
  // =======================================================

 const handleConfirm = async () => {
  if (isCompleted || isCancelled) {
    return;
  }

  if (!validateDecision()) {
    return;
  }

  try {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    const response = await api.patch(
      `/re-inspections/${id}/complete`,
      {
        overallResult: decision,
        remarks: remarks.trim(),
      }
    );

    console.log(
      "Complete Re-Inspection Response:",
      response.data
    );

    const completedRI =
      response?.data?.data;

    if (!completedRI) {
      throw new Error(
        "Completion succeeded but no updated re-inspection was returned."
      );
    }

    // Update the page immediately
    setReInspection(completedRI);

    setItems(
      Array.isArray(completedRI.items)
        ? completedRI.items
        : []
    );

    setDecision(
      completedRI.overallResult || ""
    );

    setRemarks(
      completedRI.remarks || ""
    );

    setSuccessMessage(
      "Re-inspection completed successfully."
    );

  } catch (err) {
    console.error(
      "Complete Re-Inspection Error:",
      err
    );

    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to complete re-inspection."
    );

  } finally {
    setSaving(false);
  }
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
              Loading final decision...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // NOT FOUND
  // =======================================================

  if (!reInspection) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <AlertCircle
            size={35}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Re-Inspection Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "Unable to load this re-inspection."}
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

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/quality-inspection/re-inspections/${id}`
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>


          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-xl font-bold text-slate-900">
                Final Decision
              </h1>

              <StatusBadge
                status={
                  reInspection.status
                }
              />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Review the completed re-inspection before final confirmation.
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={loadReInspection}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

          <CheckCircle2
            size={18}
            className="text-emerald-600"
          />

          <p className="text-sm font-semibold text-emerald-700">
            {successMessage}
          </p>

        </div>
      )}


      {/* =================================================
          RI SUMMARY
      ================================================= */}

      <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-2">

            <ClipboardCheck
              size={18}
              className="text-blue-600"
            />

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Re-Inspection Summary
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Reference information from the re-inspection record.
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">

          <InfoCell
            label="RI Number"
            value={
              reInspection.reInspectionNumber
            }
          />

          <InfoCell
            label="Type"
            value={
              reInspection.reinspectionType ===
              "ORIGINAL_MATERIAL"
                ? "Original Material"
                : "Replacement Material"
            }
          />

          <InfoCell
            label="Original QI"
            value={
              reInspection
                ?.originalInspection
                ?.inspectionNumber ||
              "-"
            }
          />

          <InfoCell
            label="PO Number"
            value={
              getPONumber(
                reInspection
              )
            }
          />

          <InfoCell
            label="GRN Number"
            value={
              getGRNNumber(
                reInspection
              )
            }
          />

        </div>


        <div className="grid grid-cols-1 border-t border-slate-200 md:grid-cols-2 lg:grid-cols-3">

          <InfoCell
            label="Vendor"
            value={
              getVendorName(
                reInspection.vendor
              )
            }
          />

          <InfoCell
            label="Re-Inspection Reason"
            value={
              reInspection.reason
            }
          />

          <InfoCell
            label="Created On"
            value={
              formatDate(
                reInspection.createdAt
              )
            }
          />

        </div>

      </div>


      {/* =================================================
          INSPECTION TOTALS
      ================================================= */}

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-5">

        <SummaryCard
          label="Total Inspection Qty"
          value={
            totals.inspection
          }
          type="default"
        />

        <SummaryCard
          label="Total Accepted"
          value={
            totals.accepted
          }
          type="accepted"
        />

        <SummaryCard
          label="Total Rejected"
          value={
            totals.rejected
          }
          type="rejected"
        />

        <SummaryCard
          label="Total Damaged"
          value={
            totals.damaged
          }
          type="damaged"
        />

        <SummaryCard
          label="Pending"
          value={
            pendingQuantity
          }
          type={
            pendingQuantity === 0
              ? "accepted"
              : "pending"
          }
        />

      </div>


      {/* =================================================
          MATERIAL RESULTS
      ================================================= */}

      <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-base font-bold text-slate-900">
            Material Inspection Results
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Read-only summary of the quantities recorded during re-inspection.
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[900px] w-full">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  #
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Material
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Re-Inspection Qty
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

              {items.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >

                    <ClipboardCheck
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No inspection items found.
                    </p>

                  </td>

                </tr>

              ) : (

                items.map(
                  (item, index) => {

                    const qty =
                      Number(
                        item.inspectionQuantity ||
                          0
                      );

                    const accepted =
                      Number(
                        item.acceptedQuantity ||
                          0
                      );

                    const rejected =
                      Number(
                        item.rejectedQuantity ||
                          0
                      );

                    const damaged =
                      Number(
                        item.damagedQuantity ||
                          0
                      );

                    let result =
                      "Pending";

                    if (
                      accepted === qty &&
                      rejected === 0 &&
                      damaged === 0
                    ) {
                      result = "Accepted";
                    } else if (
                      rejected === qty
                    ) {
                      result = "Rejected";
                    } else if (
                      accepted > 0
                    ) {
                      result =
                        "Partially Accepted";
                    } else if (
                      damaged > 0
                    ) {
                      result =
                        "Accepted with Damage";
                    }

                    return (
                      <tr
                        key={
                          item._id ||
                          item.material ||
                          index
                        }
                        className="border-b border-slate-100 last:border-0"
                      >

                        <td className="px-4 py-4 text-xs font-semibold text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4">

                          <p className="text-xs font-bold text-slate-800">
                            {item.materialName ||
                              "-"}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.materialCode ||
                              "-"}
                          </p>

                        </td>

                        <td className="px-4 py-4 text-right text-xs font-bold text-slate-800">
                          {qty}
                        </td>

                        <td className="px-4 py-4 text-right text-xs font-bold text-emerald-600">
                          {accepted}
                        </td>

                        <td className="px-4 py-4 text-right text-xs font-bold text-red-600">
                          {rejected}
                        </td>

                        <td className="px-4 py-4 text-right text-xs font-bold text-orange-600">
                          {damaged}
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex items-center justify-between gap-3">

                            <span className="max-w-[250px] truncate text-xs text-slate-600">
                              {item.remarks ||
                                "-"}
                            </span>

                            <span
                              className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getResultClass(
                                result
                              )}`}
                            >
                              {result}
                            </span>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>


            <tfoot>

              <tr className="border-t-2 border-slate-200 bg-slate-50">

                <td
                  colSpan="2"
                  className="px-4 py-4 text-right text-xs font-bold uppercase text-slate-700"
                >
                  Total
                </td>

                <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                  {totals.inspection}
                </td>

                <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">
                  {totals.accepted}
                </td>

                <td className="px-4 py-4 text-right text-sm font-bold text-red-600">
                  {totals.rejected}
                </td>

                <td className="px-4 py-4 text-right text-sm font-bold text-orange-600">
                  {totals.damaged}
                </td>

                <td />

              </tr>

            </tfoot>

          </table>

        </div>

      </div>


      {/* =================================================
          FINAL DECISION
      ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-base font-bold text-slate-900">
            Final Decision
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select the final disposition based on the completed re-inspection.
          </p>

        </div>


        <div className="p-5">

          <label className="mb-3 block text-sm font-bold text-slate-800">
            Overall Result
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>


          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

            {[
              "Accepted",
              "Partially Accepted",
              "Rejected",
              "Accepted with Damage",
              "Conditional Acceptance",
            ].map(
              (option) => {

                const selected =
                  decision ===
                  option;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={
                      isCompleted ||
                      isCancelled
                    }
                    onClick={() => {
                      setDecision(
                        option
                      );

                      setError("");
                      setSuccessMessage("");
                    }}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      selected
                        ? getResultClass(
                            option
                          )
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          selected
                            ? "border-current"
                            : "border-slate-300"
                        }`}
                      >

                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}

                      </span>

                      <span className="text-xs font-semibold">
                        {option}
                      </span>

                    </div>

                  </button>
                );
              }
            )}

          </div>


          {/* REMARKS */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-bold text-slate-800">
              Decision Remarks
              {decision ===
                "Conditional Acceptance" && (
                <span className="ml-1 text-red-500">
                  *
                </span>
              )}
            </label>

            <textarea
              rows="4"
              disabled={
                isCompleted ||
                isCancelled
              }
              value={remarks}
              onChange={(event) => {
                setRemarks(
                  event.target.value
                );

                setError("");
                setSuccessMessage("");
              }}
              placeholder="Enter final decision remarks..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

          </div>


          {/* DECISION INFORMATION */}

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Decision By
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {reInspection?.completedBy?.name ||
                  reInspection?.createdBy?.name ||
                  "Current Quality Manager"}
              </p>

            </div>


            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">

                <CalendarDays size={13} />

                Decision Date

              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {formatDate(
                  reInspection.completedAt
                ) !== "-"
                  ? formatDate(
                      reInspection.completedAt
                    )
                  : formatDate(
                      new Date()
                    )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div className="sticky bottom-0 z-20 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/quality-inspection/re-inspections/${id}`
              )
            }
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Inspection
          </button>


          <div className="flex flex-col gap-2 sm:flex-row">

            {!isCompleted &&
              !isCancelled && (
                <button
                  type="button"
                  onClick={
                    handleSaveDraft
                  }
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >

                  {saving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}

                  Save Draft

                </button>
              )}


            <button
              type="button"
              onClick={
                handleConfirm
              }
              disabled={
                saving ||
                isCompleted ||
                isCancelled
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={16}
                />
              )}

              Confirm & Complete

            </button>

          </div>

        </div>

      </div>

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
    <div className="border-b border-slate-200 px-5 py-4 last:border-b-0">

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
// STATUS BADGE
// =========================================================

const StatusBadge = ({
  status,
}) => {
  const styles = {
    Draft:
      "border-amber-200 bg-amber-50 text-amber-700",

    "In Progress":
      "border-blue-200 bg-blue-50 text-blue-700",

    Completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    Cancelled:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ||
        "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status || "-"}
    </span>
  );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  label,
  value,
  type,
}) => {
  const styles = {
    default:
      "border-slate-200 bg-white text-slate-900",

    accepted:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    rejected:
      "border-red-200 bg-red-50 text-red-700",

    damaged:
      "border-orange-200 bg-orange-50 text-orange-700",

    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        styles[type] ||
        styles.default
      }`}
    >

      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold">
        {value}
      </p>

    </div>
  );
};


export default ReInspectionFinalDecision;