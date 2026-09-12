import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Search,
  AlertCircle,
  Package,
  Truck,
  ClipboardCheck,
  Info,
} from "lucide-react";

import api from "../../services/api";
import {
  createReInspection,
  getEligibleReplacementReceipts,
} from "../../services/reInspectionService";

// =========================================================
// HELPERS
// =========================================================

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getName = (value) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return value.vendorName || value.companyName || value.name || "-";
};

const getPO = (inspection) =>
  inspection?.purchaseOrder?.poNumber || inspection?.poNumber || "-";

const getGRN = (inspection) =>
  inspection?.goodsReceipt?.grnNumber || inspection?.grnNumber || "-";

const getVendor = (inspection) => getName(inspection?.vendor);

const getInspectionDate = (inspection) => {
  const date = inspection?.inspectionDate;
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =========================================================
// PAGE
// =========================================================

const ReInspection = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------
  // STEP
  // -------------------------------------------------------
  const [step, setStep] = useState(1);

  // -------------------------------------------------------
  // DATA
  // -------------------------------------------------------
  const [inspections, setInspections] = useState([]);
  const [loadingInspections, setLoadingInspections] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------
  const [inspectionSearch, setInspectionSearch] = useState("");

  // -------------------------------------------------------
  // FORM
  // -------------------------------------------------------
  const [reinspectionType, setReinspectionType] = useState("");
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [replacementReceipts, setReplacementReceipts] = useState([]);
  const [selectedReplacementReceipt, setSelectedReplacementReceipt] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState("");
  const [specificReason, setSpecificReason] = useState("");
  const [remarks, setRemarks] = useState("");

  // =======================================================
  // LOAD COMPLETED QUALITY INSPECTIONS
  // =======================================================
  useEffect(() => {
    const loadInspections = async () => {
      try {
        setLoadingInspections(true);
        setError("");

        const response = await api.get("/quality-inspections", {
          params: {
            status: "Completed",
            limit: 100,
          },
        });

        const responseData = response?.data;
        const data =
          responseData?.data?.qualityInspections ||
          responseData?.data?.inspections ||
          responseData?.data ||
          responseData?.qualityInspections ||
          responseData ||
          [];

        setInspections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load Quality Inspections Error:", err);
        setError(
          err?.response?.data?.message ||
            "Unable to load completed quality inspections."
        );
      } finally {
        setLoadingInspections(false);
      }
    };

    loadInspections();
  }, []);

  // =======================================================
  // FILTER INSPECTIONS
  // =======================================================
  const filteredInspections = useMemo(() => {
    const value = inspectionSearch.trim().toLowerCase();
    if (!value) return inspections;

    return inspections.filter((inspection) => {
      return (
        String(inspection?.inspectionNumber || "")
          .toLowerCase()
          .includes(value) ||
        String(getPO(inspection)).toLowerCase().includes(value) ||
        String(getGRN(inspection)).toLowerCase().includes(value) ||
        String(getVendor(inspection)).toLowerCase().includes(value)
      );
    });
  }, [inspections, inspectionSearch]);

  // =======================================================
  // SELECT INSPECTION
  // =======================================================
  const handleSelectInspection = (inspection) => {
    setSelectedInspection(inspection);
    setSelectedItems({});
    setReplacementReceipts([]);
    setSelectedReplacementReceipt(null);
    setError("");
  };

  useEffect(() => {
    const loadReplacementReceipts = async () => {
      if (
        reinspectionType !== "REPLACEMENT_MATERIAL" ||
        !selectedInspection
      ) {
        return;
      }

      try {
        const response = await getEligibleReplacementReceipts(
          getId(selectedInspection)
        );
        const receipts = response?.data || [];
        const safeReceipts = Array.isArray(receipts) ? receipts : [];
        setReplacementReceipts(safeReceipts);
        if (safeReceipts.length === 1) {
          setSelectedReplacementReceipt(safeReceipts[0]);
        } else {
          setSelectedReplacementReceipt(null);
        }
        setSelectedItems({});
      } catch (err) {
        setReplacementReceipts([]);
        setSelectedReplacementReceipt(null);
        setError(
          err?.response?.data?.message ||
            "Unable to load received replacement materials."
        );
      }
    };

    loadReplacementReceipts();
  }, [reinspectionType, selectedInspection]);

  // =======================================================
  // MATERIAL ITEMS
  // =======================================================
  const originalItems = useMemo(() => {
    if (reinspectionType === "REPLACEMENT_MATERIAL") {
      return selectedReplacementReceipt?.items || [];
    }

    if (!selectedInspection || !Array.isArray(selectedInspection.items)) {
      return [];
    }

    return selectedInspection.items;
  }, [reinspectionType, selectedInspection, selectedReplacementReceipt]);

  // =======================================================
  // AVAILABLE QUANTITY
  // =======================================================
  const getAvailableQuantity = (item) => {
    const rejected = Number(item?.rejectedQuantity || 0);
    const damaged = Number(item?.damagedQuantity || 0);

    if (reinspectionType === "ORIGINAL_MATERIAL") {
      return rejected + damaged;
    }

    return Number(item?.availableQuantity || 0);
  };

  // =======================================================
  // TOGGLE ITEM
  // =======================================================
  const toggleItem = (item, index) => {
    const key =
      getId(item.material) || item.materialCode || String(index);

    const currentlySelected = selectedItems[key];

    if (currentlySelected) {
      setSelectedItems((previous) => {
        const copy = { ...previous };
        delete copy[key];
        return copy;
      });
      return;
    }

    const available = getAvailableQuantity(item);
    if (available <= 0) {
      return;
    }

    setSelectedItems((previous) => ({
      ...previous,
      [key]: {
        material: getId(item.material),
        materialCode: item.materialCode || "",
        materialName: item.materialName || "",
        inspectionQuantity: available,
        originalRejectedQuantity: Number(item.rejectedQuantity || 0),
        originalDamagedQuantity: Number(item.damagedQuantity || 0),
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        damagedQuantity: 0,
        remarks: "",
      },
    }));
  };

  // =======================================================
  // UPDATE RE-INSPECTION QTY
  // =======================================================
  const updateInspectionQuantity = (item, index, value) => {
    const key =
      getId(item.material) || item.materialCode || String(index);

    if (!selectedItems[key]) {
      return;
    }

    const available = getAvailableQuantity(item);
    let quantity = Number(value);

    if (Number.isNaN(quantity)) {
      quantity = 0;
    }

    quantity = Math.max(0, Math.min(quantity, available));

    setSelectedItems((previous) => ({
      ...previous,
      [key]: {
        ...previous[key],
        inspectionQuantity: quantity,
      },
    }));
  };

  // =======================================================
  // VALIDATE STEP 1
  // =======================================================
  const validateStepOne = () => {
    if (!reinspectionType) {
      setError("Please select a re-inspection type.");
      return false;
    }
    setError("");
    return true;
  };

  // =======================================================
  // VALIDATE STEP 2
  // =======================================================
  const validateStepTwo = () => {
    const selected = Object.values(selectedItems);

    if (selected.length === 0) {
      setError("Please select at least one material for re-inspection.");
      return false;
    }

    const invalid = selected.some(
      (item) => Number(item.inspectionQuantity) <= 0
    );

    if (invalid) {
      setError(
        "Every selected material must have a re-inspection quantity greater than zero."
      );
      return false;
    }

    setError("");
    return true;
  };

  // =======================================================
  // VALIDATE STEP 3
  // =======================================================
  const validateStepThree = () => {
    if (!reason.trim()) {
      setError("Please select a reason for re-inspection.");
      return false;
    }

    if (!specificReason.trim()) {
      setError("Please provide the specific reason for re-inspection.");
      return false;
    }

    setError("");
    return true;
  };

  // =======================================================
  // NEXT
  // =======================================================
  const handleNext = () => {
    if (step === 1) {
      if (!validateStepOne()) return;
    }
    if (step === 2) {
      if (!validateStepTwo()) return;
    }
    if (step === 3) {
      if (!validateStepThree()) return;
    }
    setStep((previous) => Math.min(previous + 1, 4));
  };

  // =======================================================
  // BACK
  // =======================================================
  const handleBack = () => {
    if (step === 1) {
      navigate("/quality-inspection/re-inspections");
      return;
    }
    setError("");
    setStep((previous) => Math.max(previous - 1, 1));
  };

  // =======================================================
  // TOTAL
  // =======================================================
  const selectedMaterialItems = Object.values(selectedItems);
  const totalInspectionQuantity = selectedMaterialItems.reduce(
    (total, item) => total + Number(item.inspectionQuantity || 0),
    0
  );

  // =======================================================
  // CREATE
  // =======================================================
  const handleCreate = async () => {
    if (!selectedInspection) {
      setError("Original inspection is required.");
      return;
    }

    if (selectedMaterialItems.length === 0) {
      setError("At least one material is required.");
      return;
    }

    if (!validateStepThree()) {
      return;
    }

    const originalInspectionId = getId(selectedInspection);
    const goodsReceiptId =
      reinspectionType === "REPLACEMENT_MATERIAL"
        ? getId(selectedReplacementReceipt)
        : getId(selectedInspection.goodsReceipt);
    const purchaseOrderId = getId(selectedInspection.purchaseOrder);
    const vendorId = getId(selectedInspection.vendor);

    if (
      !originalInspectionId ||
      !goodsReceiptId ||
      !purchaseOrderId ||
      !vendorId
    ) {
      setError(
        "The selected Quality Inspection does not contain the required Purchase Order, GRN, Vendor, or Inspection reference."
      );
      return;
    }

    if (
      reinspectionType === "REPLACEMENT_MATERIAL" &&
      !selectedReplacementReceipt
    ) {
      setError("Please select the received replacement GRN.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        originalInspection: originalInspectionId,
        reinspectionType,
        goodsReceipt: goodsReceiptId,
        purchaseOrder: purchaseOrderId,
        vendor: vendorId,
        reason: `${reason.trim()}${
          specificReason.trim() ? ` - ${specificReason.trim()}` : ""
        }`,
        items: selectedMaterialItems.map((item) => ({
          material: item.material,
          materialCode: item.materialCode,
          materialName: item.materialName,
          inspectionQuantity: Number(item.inspectionQuantity),
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          damagedQuantity: 0,
          remarks: item.remarks || "",
        })),
        remarks: remarks.trim(),
      };

      const response = await createReInspection(payload);
      const created =
        response?.data || response?.reInspection || response;
      const createdId = getId(created);

      if (createdId) {
        navigate(`/quality-inspection/re-inspections/${createdId}`);
        return;
      }

      navigate("/quality-inspection/re-inspections");
    } catch (err) {
      console.error("Create Re-Inspection Error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create re-inspection."
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // STEP TITLE
  // =======================================================
  const steps = [
    { number: 1, title: "Choose Type" },
    { number: 2, title: "Select Material(s)" },
    { number: 3, title: "Re-Inspection Details" },
    { number: 4, title: "Review" },
  ];

  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/quality-inspection/re-inspections")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Create Re-Inspection
          </h1>
          <p className="text-sm text-slate-500">
            Create a controlled re-inspection request from an existing quality inspection.
          </p>
        </div>
      </div>

      {/* STEPPER */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center">
          {steps.map((item, index) => (
            <div key={item.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                    step >= item.number
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {step > item.number ? <Check size={15} /> : item.number}
                </div>

                <span
                  className={`mt-1 hidden text-[11px] font-semibold sm:block ${
                    step >= item.number ? "text-blue-700" : "text-slate-400"
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    step > item.number ? "bg-blue-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <StepCard
          number="1"
          title="Select Re-Inspection Type"
          description="Choose the material source that needs to be re-inspected."
        >
          <div className="mb-6">
            <p className="mb-1 text-sm font-semibold text-slate-800">
              Re-Inspection Type
            </p>
            <p className="text-xs text-slate-500">
              Select one of the supported re-inspection scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* ORIGINAL */}
            <TypeCard
              selected={reinspectionType === "ORIGINAL_MATERIAL"}
              icon={<Package size={30} />}
              title="Original Material"
              description="Re-inspect material from the original Quality Inspection, normally for rejected, damaged, disputed, or management-requested quantities."
              onClick={() => setReinspectionType("ORIGINAL_MATERIAL")}
            />

            {/* REPLACEMENT */}
            <TypeCard
              selected={reinspectionType === "REPLACEMENT_MATERIAL"}
              icon={<Truck size={30} />}
              title="Replacement Material"
              description="Re-inspect replacement material received against an approved replacement request."
              onClick={() => setReinspectionType("REPLACEMENT_MATERIAL")}
            />
          </div>

          {reinspectionType === "REPLACEMENT_MATERIAL" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900">
              <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
              <div className="text-xs">
                <p className="font-semibold text-blue-900">
                  Replacement Material Re-Inspection
                </p>
                <p className="mt-1 leading-relaxed text-blue-700">
                  Re-inspect newly delivered replacement batches received at the warehouse (Replacement GRN) to fulfill previously rejected quantities. Click <b>Next</b> to select the Quality Inspection and Replacement GRN.
                </p>
              </div>
            </div>
          )}

          {reinspectionType === "ORIGINAL_MATERIAL" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900">
              <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
              <div className="text-xs">
                <p className="font-semibold text-blue-900">
                  Original Material Re-Inspection
                </p>
                <p className="mt-1 leading-relaxed text-blue-700">
                  Re-evaluate rejected or damaged materials from the original inspection for rework, deviation, or second-opinion approval. Click <b>Next</b> to select the inspection and materials.
                </p>
              </div>
            </div>
          )}
        </StepCard>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <StepCard
          number="2"
          title="Select Material(s) for Re-Inspection"
          description="Select the original Quality Inspection and choose one or more materials."
        >
          {/* INSPECTION SEARCH */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Original Quality Inspection
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={inspectionSearch}
                onChange={(event) => setInspectionSearch(event.target.value)}
                placeholder="Search by QI No, PO No, GRN No, Vendor..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* INSPECTION SELECTOR */}
          <div className="mb-6 grid max-h-64 grid-cols-1 gap-3 overflow-y-auto">
            {loadingInspections ? (
              <div className="flex items-center justify-center rounded-lg border border-slate-200 py-10">
                <Loader2
                  size={20}
                  className="animate-spin text-blue-600"
                />
                <span className="ml-2 text-sm text-slate-500">
                  Loading inspections...
                </span>
              </div>
            ) : filteredInspections.length === 0 ? (
              <div className="rounded-lg border border-slate-200 py-10 text-center">
                <ClipboardCheck
                  size={25}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  No completed inspections found
                </p>
              </div>
            ) : (
              filteredInspections.map((inspection) => {
                const selected =
                  getId(selectedInspection) === getId(inspection);

                return (
                  <button
                    key={inspection._id}
                    type="button"
                    onClick={() => handleSelectInspection(inspection)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-700">
                            {inspection.inspectionNumber || "-"}
                          </span>

                          {inspection.status && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              {inspection.status}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 md:grid-cols-4">
                          <span>
                            PO: <b className="text-slate-700">{getPO(inspection)}</b>
                          </span>

                          <span>
                            GRN: <b className="text-slate-700">{getGRN(inspection)}</b>
                          </span>

                          <span>
                            Vendor: <b className="text-slate-700">{getVendor(inspection)}</b>
                          </span>

                          <span>
                            Date: <b className="text-slate-700">{getInspectionDate(inspection)}</b>
                          </span>
                        </div>
                      </div>

                      {selected && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check size={15} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* SELECTED INSPECTION */}
          {selectedInspection && (
            <div className="mb-5 rounded-xl border border-slate-200 bg-white">
              {reinspectionType === "REPLACEMENT_MATERIAL" && (
                <div className="border-b border-slate-200 bg-blue-50/50 px-4 py-3.5">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Received Replacement GRN
                    </label>
                    <span className="text-[11px] font-medium text-slate-500">
                      {replacementReceipts.length} GRN(s) available
                    </span>
                  </div>

                  {replacementReceipts.length === 0 ? (
                    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />
                      <div>
                        <p className="font-semibold text-amber-900">
                          No Replacement GRN Found
                        </p>
                        <p className="mt-0.5 text-amber-700">
                          Replacement materials must first be dispatched by the vendor and received at the gate (Replacement Goods Receipt) before they can be re-inspected.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={getId(selectedReplacementReceipt)}
                      onChange={(event) => {
                        const receipt = replacementReceipts.find(
                          (item) => getId(item) === event.target.value
                        );
                        setSelectedReplacementReceipt(receipt || null);
                        setSelectedItems({});
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select a received replacement GRN</option>
                      {replacementReceipts.map((receipt) => (
                        <option key={getId(receipt)} value={getId(receipt)}>
                          {receipt.grnNumber || "Replacement GRN"}
                          {receipt.receiptDate
                            ? ` (${new Date(receipt.receiptDate).toLocaleDateString("en-IN")})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-bold text-slate-800">
                  Select Material(s) for Re-Inspection
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Only quantities eligible for the selected re-inspection scenario are available.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[950px] w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="w-12 px-4 py-3 text-center text-[10px] font-bold uppercase text-slate-500">
                        Select
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                        Material Code
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                        {reinspectionType === "REPLACEMENT_MATERIAL"
                          ? "Received Qty"
                          : "Rejected Qty"}
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                        {reinspectionType === "REPLACEMENT_MATERIAL"
                          ? "Previously Re-Inspected"
                          : "Damaged Qty"}
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                        Available
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                        Re-Inspection Qty
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {originalItems.map((item, index) => {
                      const key =
                        getId(item.material) ||
                        item.materialCode ||
                        String(index);
                      const available = getAvailableQuantity(item);
                      const selected = selectedItems[key];

                      return (
                        <tr
                          key={key}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={Boolean(selected)}
                              disabled={available <= 0}
                              onChange={() => toggleItem(item, index)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <p className="text-xs font-semibold text-slate-800">
                              {item.materialName || "-"}
                            </p>
                            {item.unitOfMeasure && (
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {item.unitOfMeasure}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-600">
                            {item.materialCode || "-"}
                          </td>

                          <td className="px-4 py-3 text-right text-xs font-semibold text-red-600">
                            {reinspectionType === "REPLACEMENT_MATERIAL"
                              ? Number(item.receivedQuantity || 0)
                              : Number(item.rejectedQuantity || 0)}
                          </td>

                          <td className="px-4 py-3 text-right text-xs font-semibold text-orange-600">
                            {reinspectionType === "REPLACEMENT_MATERIAL"
                              ? Number(
                                  item.previouslyReInspectedQuantity || 0
                                )
                              : Number(item.damagedQuantity || 0)}
                          </td>

                          <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                            {available}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <input
                                type="number"
                                min="0"
                                max={available}
                                disabled={!selected}
                                value={
                                  selected ? selected.inspectionQuantity : 0
                                }
                                onChange={(event) =>
                                  updateInspectionQuantity(
                                    item,
                                    index,
                                    event.target.value
                                  )
                                }
                                className="h-9 w-24 rounded-md border border-slate-200 px-2 text-right text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </StepCard>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <StepCard
          number="3"
          title="Re-Inspection Details"
          description="Provide the reason and specific justification for the re-inspection."
        >
          {/* TYPE */}
          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
              Type
            </p>
            <p className="mt-1 text-sm font-bold text-blue-900">
              {reinspectionType === "ORIGINAL_MATERIAL"
                ? "Original Material"
                : "Replacement Material"}
            </p>
          </div>

          {/* SUMMARY */}
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            <InfoBox
              label="Original Inspection"
              value={selectedInspection?.inspectionNumber || "-"}
            />
            <InfoBox
              label="PO Number"
              value={getPO(selectedInspection)}
            />
            <InfoBox
              label="GRN Number"
              value={getGRN(selectedInspection)}
            />
            <InfoBox
              label="Vendor"
              value={getVendor(selectedInspection)}
            />
          </div>

          {/* TOTAL */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Re-Inspection Quantity (Total)
            </label>
            <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
              <span className="text-sm font-bold text-slate-900">
                {totalInspectionQuantity}
              </span>
            </div>
          </div>

          {/* REASON */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Reason for Re-Inspection
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select reason</option>
                <option value="Quality Dispute">Quality Dispute</option>
                <option value="Management Requested">Management Requested</option>
                <option value="Vendor Requested">Vendor Requested</option>
                <option value="Inspection Clarification">Inspection Clarification</option>
                <option value="Documentation Review">Documentation Review</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* SPECIFIC REASON */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Specific Reason
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              value={specificReason}
              onChange={(event) => setSpecificReason(event.target.value)}
              rows={4}
              placeholder="Explain why this material needs to be re-inspected..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* REMARKS */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Remarks
            </label>

            <textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              rows={3}
              placeholder="Additional remarks..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </StepCard>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <StepCard
          number="4"
          title="Review Re-Inspection"
          description="Review all information before creating the re-inspection."
        >
          {/* HEADER SUMMARY */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
              <InfoBox
                label="Type"
                value={
                  reinspectionType === "ORIGINAL_MATERIAL"
                    ? "Original Material"
                    : "Replacement Material"
                }
              />
              <InfoBox
                label="Original Inspection"
                value={selectedInspection?.inspectionNumber || "-"}
              />
              <InfoBox
                label="PO Number"
                value={getPO(selectedInspection)}
              />
              <InfoBox
                label="GRN Number"
                value={getGRN(selectedInspection)}
              />
            </div>
          </div>

          {/* REASON */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Re-Inspection Reason
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {reason}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {specificReason}
            </p>
          </div>

          {/* ITEMS */}
          <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-800">
                Selected Material(s)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                      Material
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                      Material Code
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                      Original Rejected
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                      Original Damaged
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                      Re-Inspection Qty
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {selectedMaterialItems.map((item) => (
                    <tr
                      key={item.material || item.materialCode}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                        {item.materialName}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {item.materialCode}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-red-600">
                        {item.originalRejectedQuantity}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-orange-600">
                        {item.originalDamagedQuantity}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-bold text-blue-700">
                        {item.inspectionQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTAL */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryBox
              label="Selected Materials"
              value={selectedMaterialItems.length}
            />
            <SummaryBox
              label="Re-Inspection Quantity"
              value={totalInspectionQuantity}
            />
            <SummaryBox label="Status After Creation" value="Draft" />
          </div>
        </StepCard>
      )}

      {/* FOOTER ACTIONS */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={16} />
                Create Re-Inspection
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================
// STEP CARD
// =========================================================

const StepCard = ({ number, title, description, children }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
            {number}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
};

// =========================================================
// TYPE CARD
// =========================================================

const TypeCard = ({ selected, icon, title, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-6 text-left transition ${
        selected
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
          selected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-600">
        {selected ? (
          <>
            <Check size={14} />
            Selected
          </>
        ) : (
          "Select"
        )}
      </div>
    </button>
  );
};

// =========================================================
// INFO BOX
// =========================================================

const InfoBox = ({ label, value }) => {
  return (
    <div className="p-4">
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
// SUMMARY BOX
// =========================================================

const SummaryBox = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default ReInspection;
