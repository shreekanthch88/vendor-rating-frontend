import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Save,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getQualityInspectionById,
  updateQualityInspection,
} from "../../services/qualityInspectionService";


const Specifications = () => {

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
        "Specifications Inspection Response:",
        response
      );

      setInspection(
        response?.data ||
        response
      );

    } catch (err) {

      console.error(
        "Load Specifications Error:",
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
  // EDITABLE STATUS
  // =====================================================

  const isEditable =
    inspection?.status === "Draft" ||
    inspection?.status === "In Progress";


  // =====================================================
  // UPDATE SPECIFICATION
  // =====================================================

  const updateSpecification = (
    itemIndex,
    specificationIndex,
    field,
    value
  ) => {

    setInspection(
      (current) => {

        const items =
          Array.isArray(current?.items)
            ? [...current.items]
            : [];

        const item = {
          ...items[itemIndex],
        };


        const specifications =
          Array.isArray(
            item.specifications
          )
            ? [...item.specifications]
            : [];


        specifications[
          specificationIndex
        ] = {

          ...specifications[
            specificationIndex
          ],

          [field]: value,

        };


        item.specifications =
          specifications;

        items[itemIndex] =
          item;


        return {
          ...current,
          items,
        };

      }
    );

  };


  // =====================================================
  // ADD SPECIFICATION
  // =====================================================

  const addSpecification = (
    itemIndex
  ) => {

    setInspection(
      (current) => {

        const items =
          Array.isArray(current?.items)
            ? [...current.items]
            : [];


        const item = {
          ...items[itemIndex],
        };


        const specifications =
          Array.isArray(
            item.specifications
          )
            ? [...item.specifications]
            : [];


        specifications.push({

          parameter: "",

          requiredValue: "",

          actualValue: "",

          unit: "",

          tolerance: "",

          result: "Pending",

          remarks: "",

        });


        item.specifications =
          specifications;

        items[itemIndex] =
          item;


        return {
          ...current,
          items,
        };

      }
    );

  };


  // =====================================================
  // REMOVE SPECIFICATION
  // =====================================================

  const removeSpecification = (
    itemIndex,
    specificationIndex
  ) => {

    setInspection(
      (current) => {

        const items =
          Array.isArray(current?.items)
            ? [...current.items]
            : [];


        const item = {
          ...items[itemIndex],
        };


        const specifications =
          Array.isArray(
            item.specifications
          )
            ? [...item.specifications]
            : [];


        specifications.splice(
          specificationIndex,
          1
        );


        item.specifications =
          specifications;

        items[itemIndex] =
          item;


        return {
          ...current,
          items,
        };

      }
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
            currentStep: 4,
          }
        );


      setInspection(
        response?.data ||
        response
      );


      setSuccess(
        "Specifications saved successfully."
      );

    } catch (err) {

      console.error(
        "Save Specifications Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to save specifications."
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


      await updateQualityInspection(
        id,
        {
          ...inspection,
          currentStep: 5,
        }
      );


      navigate(
        `/quality-inspection/inspections/${id}/defects-documents`
      );

    } catch (err) {

      console.error(
        "Save Before Defects Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Please save the specifications before continuing."
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
      `/quality-inspection/inspections/${id}/material-inspection`
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
            Loading specifications...
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
    Array.isArray(inspection.items)
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

            Back to Material Inspection

          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <ClipboardCheck size={23} />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Specifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Verify material specifications and
                inspection parameters.
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
            completed
            onClick={() => navigate(`/quality-inspection/inspections/${id}/material-inspection`)}
          />

          <StepLine />

          <Step
            number="4"
            title="Specifications"
            active
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
          SPECIFICATIONS
      ================================================= */}

      <div className="space-y-6">

        {items.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

            <ClipboardCheck
              size={42}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-slate-700">
              No inspection items found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              No material items are available for
              specification inspection.
            </p>

          </div>

        ) : (

          items.map(
            (item, itemIndex) => {

              const specifications =
                Array.isArray(
                  item.specifications
                )
                  ? item.specifications
                  : [];


              return (

                <div
                  key={
                    item._id ||
                    itemIndex
                  }
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* ITEM HEADER */}

                  <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">

                        {
                          item.materialName ||
                          item.material?.materialName ||
                          item.itemName ||
                          item.name ||
                          `Material ${itemIndex + 1}`
                        }

                      </h2>

                      <p className="mt-1 text-sm text-slate-500">

                        Material specification
                        verification

                      </p>

                    </div>


                    {isEditable && (

                      <button
                        type="button"
                        onClick={() =>
                          addSpecification(
                            itemIndex
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >

                        <Plus size={16} />

                        Add Parameter

                      </button>

                    )}

                  </div>


                  {/* SPECIFICATION TABLE */}

                  {specifications.length === 0 ? (

                    <div className="p-8 text-center">

                      <p className="text-sm font-medium text-slate-600">
                        No specification parameters added.
                      </p>

                      {isEditable && (

                        <button
                          type="button"
                          onClick={() =>
                            addSpecification(
                              itemIndex
                            )
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >

                          <Plus size={16} />

                          Add First Parameter

                        </button>

                      )}

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="min-w-[1100px] w-full">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Parameter
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Required
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Actual
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Unit
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Tolerance
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Result
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Remarks
                            </th>

                            {isEditable && (

                              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Action
                              </th>

                            )}

                          </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                          {specifications.map(
                            (
                              specification,
                              specificationIndex
                            ) => (

                              <tr
                                key={
                                  specification._id ||
                                  specificationIndex
                                }
                                className="hover:bg-slate-50"
                              >

                                {/* PARAMETER */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.parameter ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "parameter",
                                          event.target.value
                                        )
                                      }
                                      placeholder="e.g. Diameter"
                                      className="w-44 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm font-medium text-slate-700">

                                      {
                                        specification.parameter ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* REQUIRED */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.requiredValue ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "requiredValue",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Required"
                                      className="w-36 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm text-slate-600">

                                      {
                                        specification.requiredValue ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* ACTUAL */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.actualValue ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "actualValue",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Actual"
                                      className="w-36 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm font-semibold text-slate-700">

                                      {
                                        specification.actualValue ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* UNIT */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.unit ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "unit",
                                          event.target.value
                                        )
                                      }
                                      placeholder="mm"
                                      className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm text-slate-600">

                                      {
                                        specification.unit ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* TOLERANCE */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.tolerance ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "tolerance",
                                          event.target.value
                                        )
                                      }
                                      placeholder="±0.5"
                                      className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm text-slate-600">

                                      {
                                        specification.tolerance ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* RESULT */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <select
                                      value={
                                        specification.result ||
                                        "Pending"
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "result",
                                          event.target.value
                                        )
                                      }
                                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    >

                                      <option value="Pending">
                                        Pending
                                      </option>

                                      <option value="Pass">
                                        Pass
                                      </option>

                                      <option value="Fail">
                                        Fail
                                      </option>

                                      <option value="Conditional">
                                        Conditional
                                      </option>

                                    </select>

                                  ) : (

                                    <ResultBadge
                                      result={
                                        specification.result
                                      }
                                    />

                                  )}

                                </td>


                                {/* REMARKS */}

                                <td className="px-4 py-4">

                                  {isEditable ? (

                                    <input
                                      type="text"
                                      value={
                                        specification.remarks ||
                                        ""
                                      }
                                      onChange={(event) =>
                                        updateSpecification(
                                          itemIndex,
                                          specificationIndex,
                                          "remarks",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Remarks"
                                      className="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />

                                  ) : (

                                    <span className="text-sm text-slate-600">

                                      {
                                        specification.remarks ||
                                        "-"
                                      }

                                    </span>

                                  )}

                                </td>


                                {/* ACTION */}

                                {isEditable && (

                                  <td className="px-4 py-4 text-center">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSpecification(
                                          itemIndex,
                                          specificationIndex
                                        )
                                      }
                                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                      title="Remove parameter"
                                    >

                                      <Trash2
                                        size={17}
                                      />

                                    </button>

                                  </td>

                                )}

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              );

            }
          )

        )}

      </div>


      {/* =================================================
          GENERAL REMARKS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">
          Specification Remarks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add overall observations related to
          specification compliance.
        </p>

        <textarea
          rows={4}
          disabled={!isEditable}
          value={
            inspection.specificationRemarks ||
            ""
          }
          onChange={(event) =>
            setInspection(
              (current) => ({
                ...current,
                specificationRemarks:
                  event.target.value,
              })
            )
          }
          placeholder="Enter specification remarks..."
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

            Next: Defects & Documents

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


// =========================================================
// RESULT BADGE
// =========================================================

const ResultBadge = ({
  result,
}) => {

  if (result === "Pass") {

    return (

      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

        <CheckCircle2 size={14} />

        Pass

      </span>

    );

  }


  if (result === "Fail") {

    return (

      <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

        Fail

      </span>

    );

  }


  if (result === "Conditional") {

    return (

      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700">

        Conditional

      </span>

    );

  }


  return (

    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">

      Pending

    </span>

  );

};


export default Specifications;