import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Save,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  getQualityInspectionById,
  updateQualityInspection,
  completeQualityInspection,
} from "../../services/qualityInspectionService";


const FinalDecision = () => {

  const navigate = useNavigate();
  const { id } = useParams();


  // =====================================================
  // STATE
  // =====================================================

  const [inspection, setInspection] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [completing, setCompleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // LOAD INSPECTION
  // =====================================================

  const loadInspection = async () => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await getQualityInspectionById(id);

      console.log(
        "Final Decision Inspection:",
        response
      );

      setInspection(
        response?.data ||
        response
      );

    } catch (err) {

      console.error(
        "Load Final Decision Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load Quality Inspection."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (id) {
      loadInspection();
    }

  }, [id]);


  // =====================================================
  // EDITABLE
  // =====================================================

  const isEditable =
    inspection?.status === "Draft" ||
    inspection?.status === "In Progress";


  // =====================================================
  // ITEMS
  // =====================================================

  const items =
    Array.isArray(
      inspection?.items
    )
      ? inspection.items
      : [];


  // =====================================================
  // CALCULATE QUANTITIES
  // =====================================================

  const quantitySummary =
    useMemo(() => {

      return items.reduce(
        (total, item) => {

          total.received +=
            Number(
              item.receivedQuantity || 0
            );

          total.inspected +=
            Number(
              item.inspectionQuantity || 0
            );

          total.accepted +=
            Number(
              item.acceptedQuantity || 0
            );

          total.rejected +=
            Number(
              item.rejectedQuantity || 0
            );

          total.damaged +=
            Number(
              item.damagedQuantity || 0
            );

          total.short +=
            Number(
              item.inspectionShortQuantity ??
              item.shortQuantity ??
              0
            );

          return total;

        },
        {
          received: 0,
          inspected: 0,
          accepted: 0,
          rejected: 0,
          damaged: 0,
          short: 0,
        }
      );

    }, [items]);


  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const updateField = (
    field,
    value
  ) => {

    setInspection(
      (current) => ({

        ...current,

        [field]: value,

      })
    );

  };


  // =====================================================
  // DEVIATION REQUIRED
  // =====================================================

  const handleDeviationChange = (
    value
  ) => {

    if (!isEditable) {
      return;
    }

    if (value === "Yes") {

      updateField(
        "deviationRequired",
        true
      );

      /*
       * We do not set deviationApproved here.
       *
       * Approval must happen on the
       * Deviation Acceptance page.
       */

      updateField(
        "deviationApproved",
        false
      );

      updateField(
        "deviationReason",
        inspection?.deviationReason ||
        ""
      );

      return;
    }


    if (value === "No") {

      updateField(
        "deviationRequired",
        false
      );

      updateField(
        "deviationApproved",
        false
      );

      updateField(
        "deviationReason",
        ""
      );

      /*
       * If the user removes the deviation,
       * don't leave Conditional Acceptance
       * selected.
       */

      if (
        inspection?.overallResult ===
        "Conditional Acceptance"
      ) {

        updateField(
          "overallResult",
          ""
        );

      }

    }

  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    if (!inspection) {
      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");


      const response =
        await updateQualityInspection(
          id,
          inspection
        );


      setInspection(
        response?.data ||
        response
      );


      setSuccess(
        "Final decision saved successfully."
      );

    } catch (err) {

      console.error(
        "Save Final Decision Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to save final decision."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // OPEN DEVIATION ACCEPTANCE
  // =====================================================

  const handleDeviationAcceptance = async () => {

    if (!inspection) {
      return;
    }


    if (!inspection.deviationRequired) {

      setError(
        "Deviation is not required."
      );

      return;

    }


    if (
      !inspection.deviationReason ||
      !inspection.deviationReason.trim()
    ) {

      setError(
        "Please enter the deviation reason before continuing."
      );

      return;

    }


    try {

      setSaving(true);
      setError("");
      setSuccess("");


      /*
       * Save the deviation requirement and reason
       * before opening the approval page.
       */

      const response =
        await updateQualityInspection(
          id,
          {
            deviationRequired: true,
            deviationApproved: false,
            deviationReason:
              inspection.deviationReason,
          }
        );


      setInspection(
        response?.data ||
        response
      );


      navigate(
        `/quality-inspection/inspections/${id}/deviation`
      );

    } catch (err) {

      console.error(
        "Open Deviation Acceptance Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to save deviation information."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // COMPLETE INSPECTION
  // =====================================================

  const handleComplete = async () => {

    if (!inspection) {
      return;
    }


    // ---------------------------------------------------
    // DEVIATION CHECK
    // ---------------------------------------------------

    if (
      inspection.deviationRequired === true &&
      inspection.deviationApproved !== true
    ) {

      setError(
        "This inspection requires deviation acceptance before it can be completed."
      );

      return;

    }


    // ---------------------------------------------------
    // OVERALL RESULT CHECK
    // ---------------------------------------------------

    if (!inspection.overallResult) {

      setError(
        "Please select the overall inspection result."
      );

      return;

    }


    // ---------------------------------------------------
    // CONDITIONAL ACCEPTANCE CHECK
    // ---------------------------------------------------

    if (
      inspection.overallResult ===
        "Conditional Acceptance" &&
      !(
        inspection.deviationRequired === true &&
        inspection.deviationApproved === true
      )
    ) {

      setError(
        "Conditional Acceptance requires an approved deviation."
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to complete this Quality Inspection? Once completed, the inspection should not be edited as a draft."
      );


    if (!confirmed) {
      return;
    }


    try {

      setCompleting(true);
      setError("");
      setSuccess("");


      /*
       * Save the final decision first.
       */

      await updateQualityInspection(
        id,
        inspection
      );


      /*
       * Complete the inspection.
       */

      const response =
        await completeQualityInspection(
          id
        );


      console.log(
        "Completed Quality Inspection:",
        response
      );


      setSuccess(
        "Quality Inspection completed successfully."
      );


      /*
       * Return to inspection list.
       */

      setTimeout(() => {

        navigate(
          "/quality-inspection/inspections"
        );

      }, 1000);

    } catch (err) {

      console.error(
        "Complete Quality Inspection Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to complete Quality Inspection."
      );

    } finally {

      setCompleting(false);

    }

  };


  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {

    navigate(
      `/quality-inspection/inspections/${id}/defects-documents`
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading final decision...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!inspection) {

    return (

      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

        <AlertTriangle
          size={40}
          className="mx-auto text-red-500"
        />

        <h2 className="mt-4 text-lg font-bold text-red-800">
          Inspection Not Found
        </h2>

        <p className="mt-2 text-sm text-red-600">

          {error ||
            "The requested Quality Inspection could not be found."}

        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/quality-inspection/inspections"
            )
          }
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >

          Back to Inspections

        </button>

      </div>

    );

  }


  // =====================================================
  // DEVIATION STATE
  // =====================================================

  const deviationRequired =
    inspection.deviationRequired === true;

  const deviationApproved =
    inspection.deviationApproved === true;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <button
            type="button"
            onClick={handleBack}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >

            <ArrowLeft size={17} />

            Back to Defects & Documents

          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <ShieldCheck size={23} />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Final Decision
              </h1>

              <p className="mt-1 text-sm text-slate-500">

                Review the inspection results and
                complete the Quality Inspection.

              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={loadInspection}
          className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {/* =================================================
          STEP PROGRESS
      ================================================= */}

      <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex min-w-[900px] items-center">

          <Step number="1" title="Select GRN" completed />

          <StepLine />

          <Step
            number="2"
            title="Inspection Details"
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}`)}
          />

          <StepLine />

          <Step
            number="3"
            title="Material Inspection"
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}/material-inspection`)}
          />

          <StepLine />

          <Step
            number="4"
            title="Specifications"
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}/specifications`)}
          />

          <StepLine />

          <Step
            number="5"
            title="Defects & Docs"
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}/defects-documents`)}
          />

          <StepLine />

          <Step
            number="6"
            title="Final Decision"
            active
            onClick={() => navigate(`/quality-inspection/inspections/${id}/final-decision`)}
          />

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {success && (

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <CheckCircle2 size={18} className="shrink-0 text-green-600" />

            <span className="font-semibold">{success}</span>

          </div>


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="rounded-lg border border-green-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
            >
              Continue Editing
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/quality-inspection/inspections")
              }
              className="rounded-lg bg-green-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              Back to Inspections List →
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          INSPECTION SUMMARY
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold text-slate-900">
          Inspection Summary
        </h2>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          <SummaryItem
            label="Inspection No."
            value={
              inspection.inspectionNumber ||
              inspection.inspectionNo ||
              "-"
            }
          />

          <SummaryItem
            label="GRN"
            value={
              inspection.goodsReceipt?.grnNumber ||
              inspection.grn?.grnNumber ||
              inspection.goodsReceiptNumber ||
              "-"
            }
          />

          <SummaryItem
            label="Purchase Order"
            value={
              inspection.purchaseOrder?.poNumber ||
              inspection.poNumber ||
              "-"
            }
          />

          <SummaryItem
            label="Vendor"
            value={
              inspection.vendor?.vendorName ||
              inspection.vendor?.companyName ||
              "-"
            }
          />

        </div>

      </div>


      {/* =================================================
          QUANTITY SUMMARY
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-bold text-slate-900">
            Quantity Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Final quantity position based on the
            material inspection.

          </p>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

          <QuantityCard
            label="Received"
            value={quantitySummary.received}
          />

          <QuantityCard
            label="Inspected"
            value={quantitySummary.inspected}
          />

          <QuantityCard
            label="Accepted"
            value={quantitySummary.accepted}
            type="success"
          />

          <QuantityCard
            label="Rejected"
            value={quantitySummary.rejected}
            type="danger"
          />

          <QuantityCard
            label="Damaged"
            value={quantitySummary.damaged}
            type="warning"
          />

          <QuantityCard
            label="Short"
            value={quantitySummary.short}
            type="warning"
          />

        </div>

      </div>


      {/* =================================================
          OVERALL RESULT
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">
          Overall Inspection Result
        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Select the final quality result for this
          inspection.

        </p>


        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          <DecisionCard
            title="Accepted"
            description="All inspected material is acceptable."
            selected={
              inspection.overallResult ===
              "Accepted"
            }
            icon={
              <CheckCircle2 size={22} />
            }
            onClick={() =>
              isEditable &&
              updateField(
                "overallResult",
                "Accepted"
              )
            }
          />


          <DecisionCard
            title="Partially Accepted"
            description="Some quantity is accepted and some is rejected."
            selected={
              inspection.overallResult ===
              "Partially Accepted"
            }
            icon={
              <ClipboardCheck size={22} />
            }
            onClick={() =>
              isEditable &&
              updateField(
                "overallResult",
                "Partially Accepted"
              )
            }
          />


          <DecisionCard
            title="Rejected"
            description="The inspected material does not meet requirements."
            selected={
              inspection.overallResult ===
              "Rejected"
            }
            icon={
              <XCircle size={22} />
            }
            onClick={() =>
              isEditable &&
              updateField(
                "overallResult",
                "Rejected"
              )
            }
          />


          {/* -------------------------------------------------
              CONDITIONAL ACCEPTANCE
              -------------------------------------------------
              This is display-only here.
              It must come through approved deviation.
          */}

          <DecisionCard
            title="Conditional Acceptance"
            description={
              deviationApproved
                ? "Deviation has been approved. Material can be conditionally accepted."
                : "Requires an approved deviation."
            }
            selected={
              inspection.overallResult ===
              "Conditional Acceptance"
            }
            icon={
              <AlertTriangle size={22} />
            }
            disabled={
              !deviationApproved
            }
            onClick={() => {

              if (
                isEditable &&
                deviationApproved
              ) {

                updateField(
                  "overallResult",
                  "Conditional Acceptance"
                );

              }

            }}
          />

        </div>

      </div>


      {/* =================================================
          DEVIATION ACCEPTANCE
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Deviation Acceptance

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              A deviation requires approval before the
              inspection can receive Conditional Acceptance.

            </p>

          </div>


          {deviationApproved && (

            <span className="inline-flex items-center gap-2 self-start rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

              <CheckCircle2 size={15} />

              Deviation Approved

            </span>

          )}

        </div>


        <div className="mt-5">

          <label className="mb-2 block text-sm font-semibold text-slate-700">

            Deviation Required?

          </label>


          <select
            disabled={!isEditable}
            value={
              deviationRequired
                ? "Yes"
                : "No"
            }
            onChange={(event) =>
              handleDeviationChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
          >

            <option value="No">
              No
            </option>

            <option value="Yes">
              Yes
            </option>

          </select>

        </div>


        {deviationRequired && (

          <div className="mt-5 space-y-4">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Deviation Reason

              </label>


              <textarea
                rows={4}
                disabled={
                  !isEditable ||
                  deviationApproved
                }
                value={
                  inspection.deviationReason ||
                  ""
                }
                onChange={(event) =>
                  updateField(
                    "deviationReason",
                    event.target.value
                  )
                }
                placeholder="Explain the deviation from the required specification..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
              />

            </div>


            {!deviationApproved && (

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                <div className="flex items-start gap-3">

                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>

                    <p className="font-semibold text-amber-800">

                      Deviation approval required

                    </p>

                    <p className="mt-1 text-sm leading-5 text-amber-700">

                      The inspection cannot be completed
                      with Conditional Acceptance until
                      the deviation is reviewed and approved.

                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  disabled={
                    !isEditable ||
                    saving ||
                    !inspection.deviationReason?.trim()
                  }
                  onClick={
                    handleDeviationAcceptance
                  }
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <ShieldCheck size={17} />

                  {saving
                    ? "Opening..."
                    : "Review Deviation"}

                </button>

              </div>

            )}


            {deviationApproved && (

              <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>

                    <p className="font-semibold text-green-800">

                      Deviation Approved

                    </p>

                    <p className="mt-1 text-sm leading-5 text-green-700">

                      The approved deviation allows this
                      inspection to proceed with
                      Conditional Acceptance.

                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/quality-inspection/inspections/${id}/deviation`
                    )
                  }
                  className="mt-4 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                >

                  View Deviation Decision

                </button>

              </div>

            )}

          </div>

        )}

      </div>


      {/* =================================================
          REPLACEMENT / REINSPECTION
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">


        {/* REPLACEMENT */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Replacement Decision
          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Indicate whether rejected or damaged
            quantities require replacement.

          </p>


          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Replacement Required?

            </label>


            <select
              disabled={!isEditable}
              value={
                inspection.replacementRequired ===
                true
                  ? "Yes"
                  : inspection.replacementRequired ===
                    false
                  ? "No"
                  : ""
              }
              onChange={(event) => {

                const value =
                  event.target.value;

                updateField(
                  "replacementRequired",
                  value === "Yes"
                    ? true
                    : value === "No"
                    ? false
                    : undefined
                );

              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
            >

              <option value="">
                Select
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>


          {inspection.replacementRequired ===
            true && (

            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-800">

                Replacement Quantity

              </p>

              <p className="mt-1 text-sm text-blue-700">

                The backend calculates the required
                replacement quantity from rejected and
                damaged quantities.

              </p>

              <p className="mt-2 text-lg font-bold text-blue-900">

                {inspection.replacementRequiredQuantity ??
                  (
                    Number(
                      quantitySummary.rejected
                    ) +
                    Number(
                      quantitySummary.damaged
                    )
                  )}

              </p>

            </div>

          )}

        </div>


        {/* REINSPECTION */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Re-Inspection Decision
          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Re-inspection is handled as a separate
            linked inspection event.

          </p>


          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Re-Inspection Required?

            </label>


            <select
              disabled={!isEditable}
              value={
                inspection.reInspectionRequired ===
                true
                  ? "Yes"
                  : inspection.reInspectionRequired ===
                    false
                  ? "No"
                  : ""
              }
              onChange={(event) => {

                const value =
                  event.target.value;

                updateField(
                  "reInspectionRequired",
                  value === "Yes"
                    ? true
                    : value === "No"
                    ? false
                    : undefined
                );

              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
            >

              <option value="">
                Select
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>


          {inspection.reInspectionRequired ===
            true && (

            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

              <p className="text-sm font-semibold text-yellow-800">

                Re-inspection requested

              </p>

              <p className="mt-1 text-xs leading-5 text-yellow-700">

                The actual re-inspection will create a
                separate linked inspection. The original
                completed inspection will not be overwritten.

              </p>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          FINAL REMARKS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">

          Final Inspection Remarks

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Record the inspector's final observations
          and decision justification.

        </p>


        <textarea
          rows={5}
          disabled={!isEditable}
          value={
            inspection.finalRemarks ||
            ""
          }
          onChange={(event) =>
            updateField(
              "finalRemarks",
              event.target.value
            )
          }
          placeholder="Enter final inspection remarks..."
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        />

      </div>


      {/* =================================================
          CONFIRMATION
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">

            <ShieldCheck size={21} />

          </div>

          <div>

            <h3 className="font-bold text-blue-900">

              Inspection Completion

            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">

              Review all inspection information before
              completing this Quality Inspection.

              {deviationRequired &&
                !deviationApproved &&
                " This inspection cannot be completed until the deviation is approved."}

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={handleBack}
          disabled={completing}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >

          <ArrowLeft size={17} />

          Back

        </button>


        <div className="flex flex-col gap-3 sm:flex-row">

          {isEditable && (

            <button
              type="button"
              disabled={
                saving ||
                completing
              }
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Draft"}

            </button>

          )}


          <button
            type="button"
            disabled={
              completing ||
              saving ||
              !isEditable
            }
            onClick={handleComplete}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <CheckCircle2 size={18} />

            {completing
              ? "Completing..."
              : "Complete Inspection"}

          </button>

        </div>

      </div>

    </div>

  );

};


// =========================================================
// STEP
// =========================================================

const Step = ({
  number,
  title,
  active = false,
  completed = false,
  onClick,
}) => {

  return (

    <div
      onClick={onClick}
      className={`flex items-center gap-2 ${
        onClick ? "cursor-pointer transition hover:opacity-80" : ""
      }`}>

      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          text-sm
          font-bold

          ${
            active
              ? "bg-blue-600 text-white"
              : completed
              ? "bg-green-600 text-white"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >

        {completed
          ? "✓"
          : number}

      </div>


      <span
        className={`
          whitespace-nowrap
          text-sm
          font-medium

          ${
            active
              ? "text-blue-700"
              : completed
              ? "text-green-700"
              : "text-slate-500"
          }
        `}
      >

        {title}

      </span>

    </div>

  );

};


// =========================================================
// STEP LINE
// =========================================================

const StepLine = () => {

  return (

    <div className="mx-3 h-px min-w-6 flex-1 bg-slate-200" />

  );

};


// =========================================================
// SUMMARY ITEM
// =========================================================

const SummaryItem = ({
  label,
  value,
}) => {

  return (

    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

        {label}

      </p>


      <p className="mt-2 text-sm font-bold text-slate-800">

        {value}

      </p>

    </div>

  );

};


// =========================================================
// QUANTITY CARD
// =========================================================

const QuantityCard = ({
  label,
  value,
  type = "default",
}) => {

  const styles = {

    default:
      "border-slate-200 bg-slate-50 text-slate-800",

    success:
      "border-green-200 bg-green-50 text-green-800",

    danger:
      "border-red-200 bg-red-50 text-red-800",

    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-800",

  };


  return (

    <div
      className={`rounded-xl border p-4 ${styles[type]}`}
    >

      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">

        {label}

      </p>


      <p className="mt-2 text-2xl font-bold">

        {value}

      </p>

    </div>

  );

};


// =========================================================
// DECISION CARD
// =========================================================

const DecisionCard = ({
  title,
  description,
  selected,
  icon,
  onClick,
  disabled = false,
}) => {

  return (

    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-xl
        border
        p-5
        text-left
        transition

        ${
          selected
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
            : disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
        }
      `}
    >

      <div className="flex items-start justify-between">

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg

            ${
              selected
                ? "bg-blue-600 text-white"
                : disabled
                ? "bg-slate-200 text-slate-400"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >

          {icon}

        </div>


        {selected && (

          <CheckCircle2
            size={20}
            className="text-blue-600"
          />

        )}

      </div>


      <h3 className="mt-4 font-bold text-slate-900">

        {title}

      </h3>


      <p className="mt-1 text-xs leading-5 text-slate-500">

        {description}

      </p>

    </button>

  );

};


export default FinalDecision;