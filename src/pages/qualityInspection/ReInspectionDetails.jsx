import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  History,
  Loader2,
  RefreshCw,
  Save,
  AlertCircle,
} from "lucide-react";

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
// RESULT CALCULATION
// =========================================================

const calculateOverallResult = (items) => {
  if (!items || items.length === 0) {
    return "Pending";
  }

  let totalInspection = 0;
  let totalAccepted = 0;
  let totalRejected = 0;
  let totalDamaged = 0;

  items.forEach((item) => {
    totalInspection += Number(
      item.inspectionQuantity || 0
    );

    totalAccepted += Number(
      item.acceptedQuantity || 0
    );

    totalRejected += Number(
      item.rejectedQuantity || 0
    );

    totalDamaged += Number(
      item.damagedQuantity || 0
    );
  });

  if (totalInspection <= 0) {
    return "Pending";
  }

  if (
    totalAccepted === totalInspection &&
    totalRejected === 0 &&
    totalDamaged === 0
  ) {
    return "Accepted";
  }

  if (
    totalRejected === totalInspection &&
    totalDamaged === 0
  ) {
    return "Rejected";
  }

  if (
    totalAccepted > 0 &&
    (totalRejected > 0 ||
      totalDamaged > 0)
  ) {
    if (
      totalDamaged > 0 &&
      totalRejected === 0
    ) {
      return "Accepted with Damage";
    }

    return "Partially Accepted";
  }

  if (
    totalAccepted === 0 &&
    totalRejected === 0 &&
    totalDamaged > 0
  ) {
    return "Accepted with Damage";
  }

  return "Pending";
};


// =========================================================
// MAIN COMPONENT
// =========================================================

const ReInspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =======================================================
  // STATE
  // =======================================================

  const [reInspection, setReInspection] =
    useState(null);

  const [items, setItems] = useState([]);

  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // =======================================================
  // LOAD RI
  // =======================================================

  const loadReInspection = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response =
        await getReInspectionById(id);

      console.log(
        "Re-Inspection Details Response:",
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
          ? data.items.map((item) => ({
              ...item,

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
            }))
          : []
      );

      setRemarks(
        data.remarks || ""
      );

    } catch (err) {
      console.error(
        "Load Re-Inspection Details Error:",
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
  // READ ONLY
  // =======================================================

  const isReadOnly =
    reInspection?.status ===
      "Completed" ||
    reInspection?.status ===
      "Cancelled";


  // =======================================================
  // UPDATE ITEM
  // =======================================================

  const updateItem = (
    index,
    field,
    value
  ) => {
    if (isReadOnly) {
      return;
    }

    setItems((previous) =>
      previous.map(
        (item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          return {
            ...item,
            [field]: value,
          };
        }
      )
    );

    setError("");
    setSuccessMessage("");
  };


  // =======================================================
  // NUMERIC UPDATE
  // =======================================================

  const updateQuantity = (
    index,
    field,
    value
  ) => {
    if (isReadOnly) {
      return;
    }

    let quantity =
      Number(value);

    if (Number.isNaN(quantity)) {
      quantity = 0;
    }

    quantity = Math.max(
      0,
      quantity
    );

    const item =
      items[index];

    const inspectionQuantity =
      Number(
        item?.inspectionQuantity || 0
      );

    if (
      field === "acceptedQuantity" ||
      field === "rejectedQuantity" ||
      field === "damagedQuantity"
    ) {
      quantity = Math.min(
        quantity,
        inspectionQuantity
      );
    }

    updateItem(
      index,
      field,
      quantity
    );
  };


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
  // OVERALL RESULT
  // =======================================================

  const overallResult = useMemo(
    () =>
      calculateOverallResult(
        items
      ),
    [items]
  );


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateItems = () => {
    if (items.length === 0) {
      setError(
        "No materials are available for this re-inspection."
      );

      return false;
    }

    for (
      let index = 0;
      index < items.length;
      index++
    ) {
      const item =
        items[index];

      const inspection =
        Number(
          item.inspectionQuantity || 0
        );

      const accepted =
        Number(
          item.acceptedQuantity || 0
        );

      const rejected =
        Number(
          item.rejectedQuantity || 0
        );

      const damaged =
        Number(
          item.damagedQuantity || 0
        );

      if (inspection <= 0) {
        setError(
          `Inspection quantity must be greater than zero for ${item.materialName || "the selected material"}.`
        );

        return false;
      }

      if (
        accepted < 0 ||
        rejected < 0 ||
        damaged < 0
      ) {
        setError(
          `Quantity cannot be negative for ${item.materialName || "the selected material"}.`
        );

        return false;
      }

      if (
        accepted +
          rejected +
          damaged >
        inspection
      ) {
        setError(
          `Accepted + Rejected + Damaged cannot exceed the re-inspection quantity for ${item.materialName || "the selected material"}.`
        );

        return false;
      }
    }

    setError("");

    return true;
  };


  // =======================================================
  // SAVE DRAFT
  // =======================================================

  const handleSaveDraft = async () => {
    if (isReadOnly) {
      return;
    }

    if (!validateItems()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = {
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

        overallResult,

        remarks:
          remarks.trim(),
      };


      console.log(
        "Update Re-Inspection Payload:",
        payload
      );


      const response =
        await updateReInspection(
          id,
          payload
        );


      const updated =
        response?.data ||
        response?.reInspection ||
        response;


      if (updated) {
        setReInspection(
          updated
        );
      }

      setSuccessMessage(
        "Re-inspection saved successfully."
      );

      await loadReInspection();

    } catch (err) {
      console.error(
        "Save Re-Inspection Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save re-inspection."
      );
    } finally {
      setSaving(false);
    }
  };


  // =======================================================
  // PROCEED TO FINAL DECISION
  // =======================================================

  const handleProceedToFinalDecision =
    async () => {
      if (isReadOnly) {
        navigate(
          `/quality-inspection/re-inspections/${id}/final-decision`
        );

        return;
      }

      if (!validateItems()) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccessMessage("");

        const payload = {
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

          overallResult,

          remarks:
            remarks.trim(),
        };


        await updateReInspection(
          id,
          payload
        );


        navigate(
          `/quality-inspection/re-inspections/${id}/final-decision`
        );

      } catch (err) {
        console.error(
          "Proceed To Final Decision Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to proceed to final decision."
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
              Loading re-inspection...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // ERROR / NOT FOUND
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
              "The requested re-inspection record could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/quality-inspection/re-inspections"
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
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
                "/quality-inspection/re-inspections"
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>


          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-xl font-bold text-slate-900">
                Re-Inspection Details
              </h1>

              <StatusBadge
                status={
                  reInspection.status
                }
              />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              {reInspection.reInspectionNumber ||
                "-"}{" "}
              · Actual re-inspection workspace
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={loadReInspection}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

        </div>

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
          RE-INSPECTION HEADER INFORMATION
      ================================================= */}

      <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">

          <InfoCell
            label="Re-Inspection No."
            value={
              reInspection.reInspectionNumber
            }
          />

          <InfoCell
            label="Original Inspection"
            value={
              reInspection
                ?.originalInspection
                ?.inspectionNumber ||
              "-"
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
            green={
              reInspection.reinspectionType ===
              "REPLACEMENT_MATERIAL"
            }
          />

          <InfoCell
            label="Vendor"
            value={getVendorName(
              reInspection.vendor
            )}
          />

          <InfoCell
            label="Status"
            value={
              reInspection.status
            }
          />

        </div>

      </div>


      {/* =================================================
          REFERENCE INFORMATION
      ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-2">

            <ClipboardCheck
              size={18}
              className="text-blue-600"
            />

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Original Inspection Reference
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Original Quality Inspection information is read-only.
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

          <InfoCell
            label="Original QI Number"
            value={
              reInspection
                ?.originalInspection
                ?.inspectionNumber
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

          <InfoCell
            label="Original Inspection Date"
            value={formatDate(
              reInspection
                ?.originalInspection
                ?.inspectionDate
            )}
          />

        </div>

      </div>


      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

        <div className="flex items-center">

          <ProgressStep
            number="1"
            label="Created"
            active
            completed
          />

          <ProgressLine
            active
          />

          <ProgressStep
            number="2"
            label="Inspection"
            active
            completed={
              reInspection.status ===
              "Completed"
            }
          />

          <ProgressLine
            active={
              reInspection.status ===
                "In Progress" ||
              reInspection.status ===
                "Completed"
            }
          />

          <ProgressStep
            number="3"
            label="Final Decision"
            active={
              reInspection.status ===
              "Completed"
            }
          />

          <ProgressLine
            active={
              reInspection.status ===
              "Completed"
            }
          />

          <ProgressStep
            number="4"
            label="Completed"
            active={
              reInspection.status ===
              "Completed"
            }
          />

        </div>

      </div>


      {/* =================================================
          MATERIAL INSPECTION
      ================================================= */}

      <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Material Inspection
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Record the result of the physical re-inspection for each selected material.
              </p>

            </div>


            {isReadOnly && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Read Only
              </span>
            )}

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="w-10 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  #
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Material Details
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

                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Pending
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
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >

                    <ClipboardCheck
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No inspection items found
                    </p>

                  </td>

                </tr>

              ) : (

                items.map(
                  (item, index) => {

                    const inspectionQuantity =
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

                    const pending =
                      Math.max(
                        0,
                        inspectionQuantity -
                          accepted -
                          rejected -
                          damaged
                      );

                    const invalid =
                      accepted +
                        rejected +
                        damaged >
                      inspectionQuantity;

                    return (
                      <tr
                        key={
                          item._id ||
                          item.material ||
                          index
                        }
                        className={`border-b border-slate-100 last:border-0 ${
                          invalid
                            ? "bg-red-50/50"
                            : "hover:bg-slate-50/60"
                        }`}
                      >

                        {/* NUMBER */}

                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {index + 1}
                        </td>


                        {/* MATERIAL */}

                        <td className="px-4 py-4">

                          <p className="text-xs font-bold text-slate-800">
                            {item.materialName ||
                              "-"}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            Code:{" "}
                            {item.materialCode ||
                              "-"}
                          </p>

                        </td>


                        {/* INSPECTION QTY */}

                        <td className="px-4 py-4 text-right">

                          <span className="inline-flex min-w-20 justify-end rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800">
                            {inspectionQuantity}
                          </span>

                        </td>


                        {/* ACCEPTED */}

                        <td className="px-4 py-4">

                          <div className="flex justify-end">

                            <input
                              type="number"
                              min="0"
                              max={
                                inspectionQuantity
                              }
                              disabled={
                                isReadOnly
                              }
                              value={
                                accepted
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  index,
                                  "acceptedQuantity",
                                  event.target
                                    .value
                                )
                              }
                              className="h-9 w-24 rounded-md border border-emerald-300 bg-white px-2 text-right text-xs font-semibold text-emerald-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                            />

                          </div>

                        </td>


                        {/* REJECTED */}

                        <td className="px-4 py-4">

                          <div className="flex justify-end">

                            <input
                              type="number"
                              min="0"
                              max={
                                inspectionQuantity
                              }
                              disabled={
                                isReadOnly
                              }
                              value={
                                rejected
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  index,
                                  "rejectedQuantity",
                                  event.target
                                    .value
                                )
                              }
                              className="h-9 w-24 rounded-md border border-red-300 bg-white px-2 text-right text-xs font-semibold text-red-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                            />

                          </div>

                        </td>


                        {/* DAMAGED */}

                        <td className="px-4 py-4">

                          <div className="flex justify-end">

                            <input
                              type="number"
                              min="0"
                              max={
                                inspectionQuantity
                              }
                              disabled={
                                isReadOnly
                              }
                              value={
                                damaged
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  index,
                                  "damagedQuantity",
                                  event.target
                                    .value
                                )
                              }
                              className="h-9 w-24 rounded-md border border-orange-300 bg-white px-2 text-right text-xs font-semibold text-orange-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                            />

                          </div>

                        </td>


                        {/* PENDING */}

                        <td className="px-4 py-4 text-right">

                          <span
                            className={`inline-flex min-w-20 justify-end rounded-md border px-3 py-2 text-xs font-bold ${
                              pending === 0
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {pending}
                          </span>

                        </td>


                        {/* REMARKS */}

                        <td className="px-4 py-4">

                          <input
                            type="text"
                            disabled={
                              isReadOnly
                            }
                            value={
                              item.remarks ||
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateItem(
                                index,
                                "remarks",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Enter remarks..."
                            className="h-9 min-w-[220px] rounded-md border border-slate-200 px-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                          />

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>


            {/* TOTAL */}

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

                <td className="px-4 py-4 text-right text-sm font-bold text-amber-600">
                  {Math.max(
                    0,
                    totals.inspection -
                      totals.accepted -
                      totals.rejected -
                      totals.damaged
                  )}
                </td>

                <td />

              </tr>

            </tfoot>

          </table>

        </div>

      </div>


      {/* =================================================
          RESULT SUMMARY
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
          label="Overall Result"
          value={
            overallResult
          }
          type="result"
        />

      </div>


      {/* =================================================
          REMARKS
      ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <label className="mb-2 block text-sm font-bold text-slate-800">
          Re-Inspection Remarks
        </label>

        <textarea
          rows="4"
          disabled={
            isReadOnly
          }
          value={remarks}
          onChange={(event) => {
            setRemarks(
              event.target.value
            );

            setError("");
            setSuccessMessage("");
          }}
          placeholder="Enter overall remarks about the re-inspection..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />

      </div>


     {/* =================================================
    ACTION BAR
    ================================================= */}

<div className="sticky bottom-0 z-20 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur">

  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <div>

      <p className="text-xs text-slate-500">
        Overall Result
      </p>

      <p className="text-sm font-bold text-slate-900">
        {overallResult}
      </p>

    </div>


    <div className="flex flex-col gap-2 sm:flex-row">

      {/* BACK */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/quality-inspection/re-inspections"
          )
        }
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>


      <button
        type="button"
        onClick={() =>
          navigate(
            `/quality-inspection/re-inspections/history/${reInspection.originalInspection?._id}`
          )
        }
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <History size={16} />
        View History
      </button>


      {/* =================================================
          ACTIVE RI
          ================================================= */}

      {!isReadOnly && (
        <>

          {/* SAVE DRAFT */}

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


          {/* FINAL DECISION */}

          <button
            type="button"
            onClick={
              handleProceedToFinalDecision
            }
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <>
                Proceed to Final Decision

                <ArrowRight
                  size={16}
                />
              </>
            )}

          </button>

        </>
      )}


      {/* =================================================
          COMPLETED RI
          ================================================= */}

      {reInspection.status ===
        "Completed" && (

        <button
          type="button"
          onClick={() =>
            navigate(
              `/quality-inspection/re-inspections/${id}/final-decision`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700"
        >

          <CheckCircle2
            size={16}
          />

          View Final Decision

        </button>

      )}


      {/* =================================================
          CANCELLED RI
          ================================================= */}

      {reInspection.status ===
        "Cancelled" && (

        <span className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600">
          Re-Inspection Cancelled
        </span>

      )}

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
  green = false,
}) => {
  return (
    <div className="px-5 py-4">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-sm font-semibold ${
          green
            ? "text-emerald-600"
            : "text-slate-800"
        }`}
      >
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
// PROGRESS STEP
// =========================================================

const ProgressStep = ({
  number,
  label,
  active,
  completed,
}) => {
  return (
    <div className="flex min-w-[75px] flex-col items-center">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
          active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 bg-white text-slate-400"
        }`}
      >
        {completed ? (
          <Check size={15} />
        ) : (
          number
        )}
      </div>

      <p
        className={`mt-1 text-[10px] font-semibold ${
          active
            ? "text-blue-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

    </div>
  );
};


// =========================================================
// PROGRESS LINE
// =========================================================

const ProgressLine = ({
  active,
}) => {
  return (
    <div
      className={`mx-2 h-px flex-1 ${
        active
          ? "bg-blue-500"
          : "bg-slate-200"
      }`}
    />
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

    result:
      "border-blue-200 bg-blue-50 text-blue-700",
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

      <p className="mt-2 break-words text-lg font-bold">
        {value}
      </p>

    </div>
  );
};


export default ReInspectionDetails;
