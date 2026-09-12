import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import {
  getQualityInspectionById,
  updateQualityInspection,
} from "../../services/qualityInspectionService";


const DefectsAndDocuments = () => {

  const navigate = useNavigate();
  const { id } = useParams();

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
        "Defects & Documents Response:",
        response
      );

      setInspection(
        response?.data || response
      );

    } catch (err) {

      console.error(
        "Load Defects & Documents Error:",
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
  // DEFECTS
  // =====================================================

  const defects =
    Array.isArray(inspection?.defects)
      ? inspection.defects
      : [];


  // =====================================================
  // DOCUMENTS
  // =====================================================

  const documents =
    Array.isArray(inspection?.documents)
      ? inspection.documents
      : [];


  // =====================================================
  // UPDATE INSPECTION FIELD
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
  // ADD DEFECT
  // =====================================================

  const addDefect = () => {

    setInspection(
      (current) => {

        const currentDefects =
          Array.isArray(current?.defects)
            ? [...current.defects]
            : [];

        currentDefects.push({

          defectType: "",

          description: "",

          quantity: 0,

          severity: "Minor",

          remarks: "",

        });

        return {

          ...current,

          defects: currentDefects,

        };

      }
    );

  };


  // =====================================================
  // UPDATE DEFECT
  // =====================================================

  const updateDefect = (
    index,
    field,
    value
  ) => {

    setInspection(
      (current) => {

        const currentDefects =
          Array.isArray(current?.defects)
            ? [...current.defects]
            : [];

        currentDefects[index] = {

          ...currentDefects[index],

          [field]: value,

        };

        return {

          ...current,

          defects: currentDefects,

        };

      }
    );

  };


  // =====================================================
  // REMOVE DEFECT
  // =====================================================

  const removeDefect = (
    index
  ) => {

    setInspection(
      (current) => {

        const currentDefects =
          Array.isArray(current?.defects)
            ? [...current.defects]
            : [];

        currentDefects.splice(
          index,
          1
        );

        return {

          ...current,

          defects: currentDefects,

        };

      }
    );

  };


  // =====================================================
  // ADD DOCUMENT
  // =====================================================

  const addDocument = () => {

    setInspection(
      (current) => {

        const currentDocuments =
          Array.isArray(current?.documents)
            ? [...current.documents]
            : [];

        currentDocuments.push({

          documentType: "",

          documentName: "",

          documentNumber: "",

          remarks: "",

        });

        return {

          ...current,

          documents: currentDocuments,

        };

      }
    );

  };


  // =====================================================
  // UPDATE DOCUMENT
  // =====================================================

  const updateDocument = (
    index,
    field,
    value
  ) => {

    setInspection(
      (current) => {

        const currentDocuments =
          Array.isArray(current?.documents)
            ? [...current.documents]
            : [];

        currentDocuments[index] = {

          ...currentDocuments[index],

          [field]: value,

        };

        return {

          ...current,

          documents: currentDocuments,

        };

      }
    );

  };


  // =====================================================
  // REMOVE DOCUMENT
  // =====================================================

  const removeDocument = (
    index
  ) => {

    setInspection(
      (current) => {

        const currentDocuments =
          Array.isArray(current?.documents)
            ? [...current.documents]
            : [];

        currentDocuments.splice(
          index,
          1
        );

        return {

          ...current,

          documents: currentDocuments,

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
          inspection
        );

      setInspection(
        response?.data ||
        response
      );

      setSuccess(
        "Defects and documents saved successfully."
      );

    } catch (err) {

      console.error(
        "Save Defects & Documents Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to save defects and documents."
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
        inspection
      );

      navigate(
        `/quality-inspection/inspections/${id}/final-decision`
      );

    } catch (err) {

      console.error(
        "Save Before Final Decision Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Please save the inspection before continuing."
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
      `/quality-inspection/inspections/${id}/specifications`
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

            Loading defects and documents...

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

            Back to Specifications

          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <AlertTriangle size={23} />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-900">

                Defects & Documents

              </h1>

              <p className="mt-1 text-sm text-slate-500">

                Record quality defects and supporting
                inspection documents.

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
          STEP PROGRESS
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
          />

          <StepLine />

          <Step
            number="3"
            title="Material Inspection"
            completed
          />

          <StepLine />

          <Step
            number="4"
            title="Specifications"
            completed
          />

          <StepLine />

          <Step
            number="5"
            title="Defects & Docs"
            active
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
          DEFECT SECTION
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Defects

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Record all defects identified during
              inspection.

            </p>

          </div>


          {isEditable && (

            <button
              type="button"
              onClick={addDefect}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >

              <Plus size={16} />

              Add Defect

            </button>

          )}

        </div>


        {defects.length === 0 ? (

          <div className="p-10 text-center">

            <AlertTriangle
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-slate-700">

              No defects recorded

            </p>

            <p className="mt-1 text-sm text-slate-500">

              If defects are found during inspection,
              add them here.

            </p>

            {isEditable && (

              <button
                type="button"
                onClick={addDefect}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >

                <Plus size={16} />

                Add First Defect

              </button>

            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-[1050px] w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Defect Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Severity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Remarks
                  </th>

                  {isEditable && (

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  )}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {defects.map(
                  (
                    defect,
                    index
                  ) => (

                    <tr
                      key={
                        defect._id ||
                        index
                      }
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        {isEditable ? (

                          <select
                            value={
                              defect.defectType ||
                              ""
                            }
                            onChange={(event) =>
                              updateDefect(
                                index,
                                "defectType",
                                event.target.value
                              )
                            }
                            className="w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >

                            <option value="">
                              Select type
                            </option>

                            <option value="Dimensional">
                              Dimensional
                            </option>

                            <option value="Visual">
                              Visual
                            </option>

                            <option value="Functional">
                              Functional
                            </option>

                            <option value="Material">
                              Material
                            </option>

                            <option value="Packaging">
                              Packaging
                            </option>

                            <option value="Documentation">
                              Documentation
                            </option>

                            <option value="Other">
                              Other
                            </option>

                          </select>

                        ) : (

                          <span className="text-sm font-medium text-slate-700">

                            {
                              defect.defectType ||
                              "-"
                            }

                          </span>

                        )}

                      </td>


                      <td className="min-w-[260px] px-5 py-4">

                        {isEditable ? (

                          <textarea
                            rows={2}
                            value={
                              defect.description ||
                              ""
                            }
                            onChange={(event) =>
                              updateDefect(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Describe the defect..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />

                        ) : (

                          <span className="text-sm text-slate-600">

                            {
                              defect.description ||
                              "-"
                            }

                          </span>

                        )}

                      </td>


                      <td className="px-5 py-4 text-right">

                        {isEditable ? (

                          <input
                            type="number"
                            min="0"
                            value={
                              defect.quantity ??
                              0
                            }
                            onChange={(event) =>
                              updateDefect(
                                index,
                                "quantity",
                                Number(
                                  event.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-blue-500"
                          />

                        ) : (

                          <span className="font-semibold text-slate-700">

                            {
                              defect.quantity ??
                              0
                            }

                          </span>

                        )}

                      </td>


                      <td className="px-5 py-4">

                        {isEditable ? (

                          <select
                            value={
                              defect.severity ||
                              "Minor"
                            }
                            onChange={(event) =>
                              updateDefect(
                                index,
                                "severity",
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >

                            <option value="Minor">
                              Minor
                            </option>

                            <option value="Major">
                              Major
                            </option>

                            <option value="Critical">
                              Critical
                            </option>

                          </select>

                        ) : (

                          <SeverityBadge
                            severity={
                              defect.severity
                            }
                          />

                        )}

                      </td>


                      <td className="min-w-[220px] px-5 py-4">

                        {isEditable ? (

                          <input
                            type="text"
                            value={
                              defect.remarks ||
                              ""
                            }
                            onChange={(event) =>
                              updateDefect(
                                index,
                                "remarks",
                                event.target.value
                              )
                            }
                            placeholder="Remarks"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />

                        ) : (

                          <span className="text-sm text-slate-600">

                            {
                              defect.remarks ||
                              "-"
                            }

                          </span>

                        )}

                      </td>


                      {isEditable && (

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              removeDefect(index)
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            title="Remove defect"
                          >

                            <Trash2 size={17} />

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


      {/* =================================================
          DOCUMENT SECTION
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Inspection Documents

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Record certificates, test reports,
              photographs and supporting documents.

            </p>

          </div>


          {isEditable && (

            <button
              type="button"
              onClick={addDocument}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >

              <Plus size={16} />

              Add Document

            </button>

          )}

        </div>


        {documents.length === 0 ? (

          <div className="p-10 text-center">

            <FileText
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-slate-700">

              No documents added

            </p>

            <p className="mt-1 text-sm text-slate-500">

              Add certificates or supporting documents
              if required.

            </p>

            {isEditable && (

              <button
                type="button"
                onClick={addDocument}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >

                <Plus size={16} />

                Add First Document

              </button>

            )}

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {documents.map(
              (
                document,
                index
              ) => (

                <div
                  key={
                    document._id ||
                    index
                  }
                  className="p-6"
                >

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                    <Field
                      label="Document Type"
                      value={
                        document.documentType ||
                        ""
                      }
                      disabled={!isEditable}
                      placeholder="Certificate"
                      onChange={(value) =>
                        updateDocument(
                          index,
                          "documentType",
                          value
                        )
                      }
                    />


                    <Field
                      label="Document Name"
                      value={
                        document.documentName ||
                        ""
                      }
                      disabled={!isEditable}
                      placeholder="Test Report"
                      onChange={(value) =>
                        updateDocument(
                          index,
                          "documentName",
                          value
                        )
                      }
                    />


                    <Field
                      label="Document Number"
                      value={
                        document.documentNumber ||
                        ""
                      }
                      disabled={!isEditable}
                      placeholder="DOC-001"
                      onChange={(value) =>
                        updateDocument(
                          index,
                          "documentNumber",
                          value
                        )
                      }
                    />


                    <Field
                      label="Remarks"
                      value={
                        document.remarks ||
                        ""
                      }
                      disabled={!isEditable}
                      placeholder="Remarks"
                      onChange={(value) =>
                        updateDocument(
                          index,
                          "remarks",
                          value
                        )
                      }
                    />

                  </div>


                  <div className="mt-4 flex items-center justify-between">

                    <button
                      type="button"
                      disabled={!isEditable}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
                    >

                      <Upload size={16} />

                      Attach File

                    </button>


                    {isEditable && (

                      <button
                        type="button"
                        onClick={() =>
                          removeDocument(index)
                        }
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >

                        <Trash2 size={16} />

                        Remove

                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          GENERAL REMARKS
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">

          Defect & Document Remarks

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Add overall observations before moving to
          the final decision.

        </p>


        <textarea
          rows={4}
          disabled={!isEditable}
          value={
            inspection.defectDocumentRemarks ||
            ""
          }
          onChange={(event) =>
            updateField(
              "defectDocumentRemarks",
              event.target.value
            )
          }
          placeholder="Enter overall remarks..."
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

            Next: Final Decision

            <ArrowRight size={17} />

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
// SUMMARY
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
// FIELD
// =========================================================

const Field = ({
  label,
  value,
  disabled,
  placeholder,
  onChange,
}) => {

  return (

    <div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">

        {label}

      </label>

      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
      />

    </div>

  );

};


// =========================================================
// SEVERITY BADGE
// =========================================================

const SeverityBadge = ({
  severity,
}) => {

  if (severity === "Critical") {

    return (

      <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

        Critical

      </span>

    );

  }


  if (severity === "Major") {

    return (

      <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">

        Major

      </span>

    );

  }


  return (

    <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700">

      Minor

    </span>

  );

};


export default DefectsAndDocuments;