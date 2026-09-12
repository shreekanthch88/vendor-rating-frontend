import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Save,
  RefreshCw,
} from "lucide-react";

import {
  getQualityInspectionById,
  updateQualityInspection,
} from "../../services/qualityInspectionService";


const InspectionDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();


  // =====================================================
  // STATE
  // =====================================================

  const [inspection, setInspection] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


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
        "Inspection Details Response:",
        response
      );

      setInspection(
        response?.data || response
      );

    } catch (err) {

      console.error(
        "Inspection Details Error:",
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
  // UPDATE FIELD
  // =====================================================

  const handleChange = (
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
  // SAVE DRAFT
  // =====================================================

  const handleSave = async () => {

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
        "Inspection details saved successfully."
      );

    } catch (err) {

      console.error(
        "Save Inspection Details Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to save inspection details."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // NEXT STEP
  // =====================================================

  const handleNext = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      /*
       * Save the current Step 2 data before
       * moving to Step 3.
       */

      await updateQualityInspection(
        id,
        inspection
      );

      navigate(
        `/quality-inspection/inspections/${id}/material-inspection`
      );

    } catch (err) {

      console.error(
        "Save Before Next Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Please save the inspection details before continuing."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {

    navigate(
      "/quality-inspection/inspections"
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

            Loading inspection details...

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

        <h2 className="text-lg font-bold text-red-800">

          Inspection Not Found

        </h2>

        <p className="mt-2 text-sm text-red-600">

          {error ||
            "The requested Quality Inspection could not be found."}

        </p>

        <button
          type="button"
          onClick={handleBack}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >

          Back to Inspections

        </button>

      </div>

    );

  }


  // =====================================================
  // STATUS
  // =====================================================

  const status =
    inspection.status ||
    "Draft";


  const isEditable =
    status === "Draft" ||
    status === "In Progress";


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

            Back to Inspections

          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <ClipboardCheck size={23} />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-900">

                Inspection Details

              </h1>

              <p className="mt-1 text-sm text-slate-500">

                Complete the basic information before
                material inspection.

              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={loadInspection}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >

            <RefreshCw size={16} />

            Refresh

          </button>


          {isEditable && (

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >

              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save Draft"}

            </button>

          )}

        </div>

      </div>


      {/* =================================================
          SIX STEP PROGRESS
      ================================================= */}

      <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex min-w-[900px] items-center">

          <Step
            number="1"
            title="Select GRN"
            completed
          />

          <StepLine />

          <Step
            number="2"
            title="Inspection Details"
            active
          />

          <StepLine />

          <Step
            number="3"
            title="Material Inspection"
          />

          <StepLine />

          <Step
            number="4"
            title="Specifications"
          />

          <StepLine />

          <Step
            number="5"
            title="Defects & Docs"
          />

          <StepLine />

          <Step
            number="6"
            title="Final Decision"
          />

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (

        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          {error}

        </div>

      )}


      {success && (

        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          {success}

        </div>

      )}


      {/* =================================================
          INSPECTION INFORMATION
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">

            Inspection Information

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Verify the information received from the Goods
            Receipt before starting the inspection.

          </p>

        </div>


        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">


          {/* INSPECTION NUMBER */}

          <InfoField
            label="Inspection Number"
            value={
              inspection.inspectionNumber ||
              inspection.inspectionNo ||
              "-"
            }
          />


          {/* GRN */}

          <InfoField
            label="Goods Receipt Number"
            value={
              inspection.goodsReceipt?.grnNumber ||
              inspection.grn?.grnNumber ||
              inspection.goodsReceiptNumber ||
              "-"
            }
          />


          {/* PO */}

          <InfoField
            label="Purchase Order"
            value={
              inspection.purchaseOrder?.poNumber ||
              inspection.poNumber ||
              inspection.goodsReceipt
                ?.purchaseOrder
                ?.poNumber ||
              "-"
            }
          />


          {/* VENDOR */}

          <InfoField
            label="Vendor"
            value={
              inspection.vendor?.vendorName ||
              inspection.vendor?.companyName ||
              inspection.goodsReceipt
                ?.vendor
                ?.vendorName ||
              "-"
            }
          />


          {/* MATERIAL */}

          <InfoField
            label="Material"
            value={
              inspection.material?.materialName ||
              inspection.materialName ||
              inspection.items?.[0]?.materialName ||
              "-"
            }
          />


          {/* INSPECTION DATE */}

          <InfoField
            label="Inspection Date"
            value={
              formatDate(
                inspection.inspectionDate ||
                inspection.createdAt
              )
            }
          />


          {/* CREATED BY */}

          <InfoField
            label="Inspector"
            value={
              inspection.createdBy?.name ||
              "-"
            }
          />


          {/* STATUS */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">

              Status

            </label>

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold

                ${
                  status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }
              `}
            >

              {status}

            </span>

          </div>


          {/* RESULT */}

          <InfoField
            label="Inspection Result"
            value={
              inspection.result ||
              "Pending"
            }
          />

        </div>

      </div>


      {/* =================================================
          INSPECTION REMARKS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">

            Inspection Remarks

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Add any initial observations before proceeding
            to material inspection.

          </p>

        </div>


        <div className="p-6">

          <textarea
            rows={5}
            disabled={!isEditable}
            value={
              inspection.remarks ||
              ""
            }
            onChange={(event) =>
              handleChange(
                "remarks",
                event.target.value
              )
            }
            placeholder="Enter inspection remarks..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >

          <ArrowLeft size={17} />

          Back

        </button>


        <div className="flex items-center gap-3">

          {isEditable && (

            <button
              type="button"
              disabled={saving}
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
            disabled={saving}
            onClick={handleNext}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            Next: Material Inspection

            <ArrowRight size={17} />

          </button>

        </div>

      </div>

    </div>

  );

};


// =========================================================
// STEP COMPONENT
// =========================================================

const Step = ({
  number,
  title,
  active = false,
  completed = false,
}) => {

  return (

    <div className="flex items-center gap-2">

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
// INFO FIELD
// =========================================================

const InfoField = ({
  label,
  value,
}) => {

  return (

    <div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">

        {label}

      </label>

      <div className="min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">

        {value}

      </div>

    </div>

  );

};


// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (
  date
) => {

  if (!date) {
    return "-";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "-";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

};


export default InspectionDetails;