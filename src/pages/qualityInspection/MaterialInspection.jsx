import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  RefreshCw,
  Save,
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  getQualityInspectionById,
  updateQualityInspection,
} from "../../services/qualityInspectionService";


const MaterialInspection = () => {

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
        "Material Inspection Response:",
        response
      );


      setInspection(
        response?.data ||
        response
      );

    } catch (err) {

      console.error(
        "Load Material Inspection Error:",
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
  // CHECK EDITABLE
  // =====================================================

  const isEditable =
    inspection?.status === "Draft" ||
    inspection?.status === "In Progress";


  // =====================================================
  // UPDATE ITEM
  // =====================================================

  const updateItem = (
    index,
    field,
    value
  ) => {

    setInspection(
      (current) => {

        if (!current) {

          return current;

        }


        const items =
          Array.isArray(
            current.items
          )
            ? [...current.items]
            : [];


        items[index] = {

          ...items[index],

          [field]: value,

        };


        return {

          ...current,

          items,

        };

      }
    );

  };


  // =====================================================
  // UPDATE INSPECTION FIELD
  // =====================================================

  const updateInspectionField = (
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
          {
            ...inspection,
            currentStep: 3,
          }
        );


      setInspection(
        response?.data ||
        response
      );


      setSuccess(
        "Material inspection saved successfully."
      );

    } catch (err) {

      console.error(
        "Save Material Inspection Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to save material inspection."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = async () => {

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      /*
       * Save the material inspection
       * before moving to Specifications.
       */

      await updateQualityInspection(
        id,
        {
          ...inspection,
          currentStep: 4,
        }
      );


      navigate(
        `/quality-inspection/inspections/${id}/specifications`
      );

    } catch (err) {

      console.error(
        "Save Before Specifications Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Please save the material inspection before continuing."
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
      `/quality-inspection/inspections/${id}`
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

            Loading material inspection...

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


  const items =
    Array.isArray(
      inspection.items
    )
      ? inspection.items
      : [];


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

            Back to Inspection Details

          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <PackageCheck size={23} />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-900">

                Material Inspection

              </h1>


              <p className="mt-1 text-sm text-slate-500">

                Record quantity inspection results
                for each material.

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
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}`)}
          />

          <StepLine />

          <Step
            number="3"
            title="Material Inspection"
            active
            onClick={() => navigate(`/quality-inspection/inspections/${id}/material-inspection`)}
          />

          <StepLine />

          <Step
            number="4"
            title="Specifications"
            onClick={() => navigate(`/quality-inspection/inspections/${id}/specifications`)}
          />

          <StepLine />

          <Step
            number="5"
            title="Defects & Docs"
            onClick={() => navigate(`/quality-inspection/inspections/${id}/defects-documents`)}
          />

          <StepLine />

          <Step
            number="6"
            title="Final Decision"
            onClick={() => navigate(`/quality-inspection/inspections/${id}/final-decision`)}
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
          MATERIAL ITEMS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">

            Material Inspection Items

          </h2>


          <p className="mt-1 text-sm text-slate-500">

            Record accepted, rejected, damaged and
            short quantities for each material.

          </p>

        </div>


        {items.length === 0 ? (

          <div className="p-12 text-center">

            <PackageCheck
              size={42}
              className="mx-auto text-slate-300"
            />


            <p className="mt-4 font-semibold text-slate-700">

              No inspection items found

            </p>


            <p className="mt-1 text-sm text-slate-500">

              No material items are associated with
              this Quality Inspection.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Material

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Received

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Inspection Qty

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Accepted

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Rejected

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Damaged

                  </th>


                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Short

                  </th>


                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    Method

                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {items.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item._id ||
                        index
                      }
                      className="hover:bg-slate-50"
                    >


                      {/* MATERIAL */}

                      <td className="min-w-[220px] px-5 py-5">

                        <p className="font-semibold text-slate-800">

                          {
                            item.materialName ||
                            item.material?.materialName ||
                            item.itemName ||
                            item.name ||
                            "-"
                          }

                        </p>


                        {item.materialCode && (

                          <p className="mt-1 text-xs text-slate-400">

                            Code: {item.materialCode}

                          </p>

                        )}


                        {item.description && (

                          <p className="mt-1 text-xs text-slate-400">

                            {item.description}

                          </p>

                        )}

                      </td>


                      {/* RECEIVED */}

                      <td className="px-5 py-5 text-right">

                        <span className="font-semibold text-slate-700">

                          {
                            item.receivedQuantity ??
                            0
                          }

                        </span>

                      </td>


                      {/* INSPECTION QUANTITY */}

                      <td className="px-5 py-5 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            value={
                              item.inspectionQuantity ??
                              item.receivedQuantity ??
                              0
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "inspectionQuantity",
                                Number(
                                  event.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                        ) : (

                          <span className="font-semibold text-slate-700">

                            {
                              item.inspectionQuantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      {/* ACCEPTED */}

                      <td className="px-5 py-5 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            value={
                              item.acceptedQuantity ??
                              0
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "acceptedQuantity",
                                Number(
                                  event.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-right text-sm outline-none focus:border-green-500"
                          />

                        ) : (

                          <span className="font-semibold text-green-700">

                            {
                              item.acceptedQuantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      {/* REJECTED */}

                      <td className="px-5 py-5 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            value={
                              item.rejectedQuantity ??
                              0
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "rejectedQuantity",
                                Number(
                                  event.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-right text-sm outline-none focus:border-red-500"
                          />

                        ) : (

                          <span className="font-semibold text-red-700">

                            {
                              item.rejectedQuantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      {/* DAMAGED */}

                      <td className="px-5 py-5 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            value={
                              item.damagedQuantity ??
                              0
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "damagedQuantity",
                                Number(
                                  event.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-right text-sm outline-none focus:border-orange-500"
                          />

                        ) : (

                          <span className="font-semibold text-orange-700">

                            {
                              item.damagedQuantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      {/* SHORT */}

                      <td className="px-5 py-5 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            max={
                              Math.max(
                                Number(
                                  item.orderedQuantity ||
                                  0
                                ) -
                                Number(
                                  item.receivedQuantity ||
                                  0
                                ),
                                0
                              )
                            }
                            value={
                              item.inspectionShortQuantity ??
                              item.shortQuantity ??
                              0
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "inspectionShortQuantity",
                                Math.min(
                                  Number(
                                    event.target.value
                                  ),
                                  Math.max(
                                    Number(
                                      item.orderedQuantity ||
                                      0
                                    ) -
                                    Number(
                                      item.receivedQuantity ||
                                      0
                                    ),
                                    0
                                  )
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-right text-sm outline-none focus:border-yellow-500"
                          />

                        ) : (

                          <span className="font-semibold text-yellow-700">

                            {
                              item.inspectionShortQuantity ??
                              item.shortQuantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      {/* METHOD */}

                      <td className="min-w-[170px] px-5 py-5">

                        {isEditable ? (

                          <select
                            value={
                              item.inspectionMethod ||
                              "100% Inspection"
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "inspectionMethod",
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >

                            <option value="100% Inspection">
                              100% Inspection
                            </option>

                            <option value="Sampling">
                              Sampling
                            </option>

                            <option value="Visual Inspection">
                              Visual Inspection
                            </option>

                            <option value="Document Review">
                              Document Review
                            </option>

                          </select>

                        ) : (

                          <span className="text-sm text-slate-600">

                            {
                              item.inspectionMethod ||
                              "-"
                            }

                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          GENERAL REMARKS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">

          Material Inspection Remarks

        </h2>


        <p className="mt-1 text-sm text-slate-500">

          Add observations related to the material
          quantities and inspection.

        </p>


        <textarea
          rows={4}
          disabled={!isEditable}
          value={
            inspection.materialInspectionRemarks ||
            ""
          }
          onChange={(event) =>
            updateInspectionField(
              "materialInspectionRemarks",
              event.target.value
            )
          }
          placeholder="Enter material inspection remarks..."
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        />

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

            Next: Specifications

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


export default MaterialInspection;
