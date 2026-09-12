import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Package,
  RefreshCw,
  Save,
  Send,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import qualityInspectionService
  from "../../services/qualityInspectionService.js";

import replacementRequestService
  from "../../services/replacementRequestService.js";


export default function CreateReplacementRequest() {

  const navigate =
    useNavigate();


  // =========================================================
  // QUALITY INSPECTION STATE
  // =========================================================

  const [
    eligibleInspections,
    setEligibleInspections,
  ] = useState([]);


  const [
    selectedInspectionId,
    setSelectedInspectionId,
  ] = useState("");


  const [
    selectedInspection,
    setSelectedInspection,
  ] = useState(null);


  const [
    loadingInspections,
    setLoadingInspections,
  ] = useState(false);


  const [
    loadingInspection,
    setLoadingInspection,
  ] = useState(false);


  // =========================================================
  // REPLACEMENT ITEMS
  // =========================================================

  const [
    items,
    setItems,
  ] = useState([]);


  // =========================================================
  // REQUEST INFORMATION
  // =========================================================

  const [
    reason,
    setReason,
  ] = useState("");


  const [
    remarks,
    setRemarks,
  ] = useState("");


  const [
    requiredReplacementDate,
    setRequiredReplacementDate,
  ] = useState("");


  // =========================================================
  // UI STATE
  // =========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =========================================================
  // LOAD REPLACEMENT-ELIGIBLE INSPECTIONS
  // =========================================================

  useEffect(() => {

    const loadEligibleInspections =
      async () => {

        try {

          setLoadingInspections(true);

          setError("");


          const response =
            await qualityInspectionService
              .getReplacementEligibleQualityInspections();


          const inspections =
            response?.data ||
            [];


          setEligibleInspections(
            Array.isArray(inspections)
              ? inspections
              : []
          );

        } catch (err) {

          console.error(
            "Failed to load replacement eligible Quality Inspections:",
            err
          );


          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load Quality Inspections eligible for replacement."
          );

        } finally {

          setLoadingInspections(false);

        }

      };


    loadEligibleInspections();

  }, []);


  // =========================================================
  // SELECT QUALITY INSPECTION
  // =========================================================

  const handleInspectionChange =
    async (event) => {

      const inspectionId =
        event.target.value;


      setSelectedInspectionId(
        inspectionId
      );


      setSelectedInspection(null);

      setItems([]);

      setError("");


      if (!inspectionId) {
        return;
      }


      try {

        setLoadingInspection(true);


        const response =
          await qualityInspectionService
            .getQualityInspectionById(
              inspectionId
            );


        const inspection =
          response?.data ||
          response;


        setSelectedInspection(
          inspection
        );


        // ===================================================
        // MAP ACTUAL INSPECTION ITEMS
        // ===================================================

        const inspectionItems =
          Array.isArray(
            inspection?.items
          )
            ? inspection.items
            : [];


        const replacementItems =
          inspectionItems
            .filter(
              (item) => {

                const replacementQuantity =
                  Number(
                    item?.replacementRequiredQuantity ||
                    item?.replacementQuantity ||
                    0
                  );


                const rejectedQuantity =
                  Number(
                    item?.rejectedQuantity ||
                    0
                  );


                const damagedQuantity =
                  Number(
                    item?.damagedQuantity ||
                    0
                  );


                // =================================================
                // SHORT QUANTITY
                // =================================================
                //
                // Short quantity can also require replacement.
                //
                // Supported backend field names:
                //
                // shortQuantity
                // inspectionShortQuantity
                // shortageQuantity
                //
                // =================================================

                const shortQuantity =
                  Number(
                    item?.shortQuantity ??
                    item?.inspectionShortQuantity ??
                    item?.shortageQuantity ??
                    0
                  );


                return (
                  replacementQuantity > 0 ||
                  rejectedQuantity > 0 ||
                  damagedQuantity > 0 ||
                  shortQuantity > 0
                );

              }
            )
            .map(
              (item) => {

                const replacementQuantity =
                  Number(
                    item?.replacementRequiredQuantity ??
                    item?.replacementQuantity ??
                    0
                  );


                const rejectedQuantity =
                  Number(
                    item?.rejectedQuantity ||
                    0
                  );


                const damagedQuantity =
                  Number(
                    item?.damagedQuantity ||
                    0
                  );


                const shortQuantity =
                  Number(
                    item?.shortQuantity ??
                    item?.inspectionShortQuantity ??
                    item?.shortageQuantity ??
                    0
                  );


                // =================================================
                // MAXIMUM REPLACEMENT QUANTITY
                // =================================================
                //
                // Rejected + Damaged + Short
                //
                // Short quantity is now independently
                // replacement-eligible.
                //
                // If backend already provides a replacement
                // quantity, preserve it.
                //
                // Otherwise calculate it from all
                // replacement-eligible quantities.
                //
                // =================================================

                const calculatedReplacementQuantity =
                  rejectedQuantity +
                  damagedQuantity +
                  shortQuantity;


                const finalReplacementQuantity =
                  replacementQuantity > 0
                    ? replacementQuantity
                    : calculatedReplacementQuantity;


                return {

                  ...item,

                  shortQuantity,

                  replacementQuantity:
                    finalReplacementQuantity,

                  maximumReplacementQuantity:
                    Math.max(
                      finalReplacementQuantity,
                      calculatedReplacementQuantity
                    ),

                };

              }
            );


        setItems(
          replacementItems
        );


      } catch (err) {

        console.error(
          "Failed to load Quality Inspection:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load selected Quality Inspection."
        );

      } finally {

        setLoadingInspection(false);

      }

    };


  // =========================================================
  // UPDATE REPLACEMENT QUANTITY
  // =========================================================
  //
  // Replacement quantity cannot exceed:
  //
  // Rejected
  // +
  // Damaged
  // +
  // Short
  //
  // =========================================================

  const updateReplacementQuantity =
    (
      index,
      value
    ) => {

      const quantity =
        Math.max(
          0,
          Number(value) || 0
        );


      setItems(
        (currentItems) =>
          currentItems.map(
            (
              item,
              itemIndex
            ) => {

              if (
                itemIndex !== index
              ) {

                return item;

              }


              const rejectedQuantity =
                Number(
                  item?.rejectedQuantity ||
                  0
                );


              const damagedQuantity =
                Number(
                  item?.damagedQuantity ||
                  0
                );


              const shortQuantity =
                Number(
                  item?.shortQuantity ??
                  item?.inspectionShortQuantity ??
                  item?.shortageQuantity ??
                  0
                );


              const maximumReplacementQuantity =
                Math.max(
                  0,
                  rejectedQuantity +
                  damagedQuantity +
                  shortQuantity
                );


              return {

                ...item,

                shortQuantity,

                maximumReplacementQuantity,

                replacementQuantity:
                  Math.min(
                    quantity,
                    maximumReplacementQuantity
                  ),

              };

            }
          )
      );

    };


  // =========================================================
  // GET MATERIAL NAME
  // =========================================================

  const getMaterialName =
    (item) => {

      return (
        item?.materialName ||
        item?.itemName ||
        item?.material?.materialName ||
        item?.material?.name ||
        item?.materialCode ||
        item?.material?.materialCode ||
        "-"
      );

    };


  // =========================================================
  // GET PO NUMBER
  // =========================================================

  const getPurchaseOrderNumber =
    () => {

      const purchaseOrder =
        selectedInspection?.purchaseOrder;


      if (
        typeof purchaseOrder === "object" &&
        purchaseOrder !== null
      ) {

        return (
          purchaseOrder?.poNumber ||
          purchaseOrder?.purchaseOrderNumber ||
          purchaseOrder?._id ||
          "-"
        );

      }


      return (
        purchaseOrder ||
        "-"
      );

    };


  // =========================================================
  // GET GRN NUMBER
  // =========================================================

  const getGoodsReceiptNumber =
    () => {

      const goodsReceipt =
        selectedInspection?.goodsReceipt;


      if (
        typeof goodsReceipt === "object" &&
        goodsReceipt !== null
      ) {

        return (
          goodsReceipt?.grnNumber ||
          goodsReceipt?.receiptNumber ||
          goodsReceipt?._id ||
          "-"
        );

      }


      return (
        goodsReceipt ||
        "-"
      );

    };


  // =========================================================
  // GET VENDOR NAME
  // =========================================================

  const getVendorName =
    () => {

      const vendor =
        selectedInspection?.vendor;


      if (
        typeof vendor === "object" &&
        vendor !== null
      ) {

        return (
          vendor?.vendorName ||
          vendor?.companyName ||
          vendor?.name ||
          "-"
        );

      }


      return (
        vendor ||
        "-"
      );

    };


  // =========================================================
  // GET ORIGINAL DISPATCH ID
  // =========================================================

  const getOriginalDispatchId =
    () => {

      const dispatch =
        selectedInspection?.dispatch ||
        selectedInspection?.originalDispatch;


      if (
        typeof dispatch === "object" &&
        dispatch !== null
      ) {

        return (
          dispatch?._id ||
          dispatch?.dispatchNumber ||
          dispatch?.dispatchNo ||
          ""
        );

      }


      return (
        dispatch ||
        ""
      );

    };


  // =========================================================
  // TOTALS
  // =========================================================

  const totalInspected =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.inspectedQuantity ||
          0
        ),
      0
    );


  const totalAccepted =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.acceptedQuantity ||
          0
        ),
      0
    );


  const totalRejected =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.rejectedQuantity ||
          0
        ),
      0
    );


  const totalDamaged =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.damagedQuantity ||
          0
        ),
      0
    );


  // =========================================================
  // TOTAL SHORT
  // =========================================================

  const totalShort =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.shortQuantity ??
          item?.inspectionShortQuantity ??
          item?.shortageQuantity ??
          0
        ),
      0
    );


  const totalReplacement =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.replacementQuantity ||
          0
        ),
      0
    );


  const totalMaximumReplacement =
    items.reduce(
      (
        total,
        item
      ) => {

        const rejectedQuantity =
          Number(
            item?.rejectedQuantity ||
            0
          );


        const damagedQuantity =
          Number(
            item?.damagedQuantity ||
            0
          );


        const shortQuantity =
          Number(
            item?.shortQuantity ??
            item?.inspectionShortQuantity ??
            item?.shortageQuantity ??
            0
          );


        return (
          total +
          rejectedQuantity +
          damagedQuantity +
          shortQuantity
        );

      },
      0
    );
  // =========================================================
  // VALIDATE REQUEST
  // =========================================================

  const validateRequest =
    () => {

      if (!selectedInspection) {

        setError(
          "Please select a Quality Inspection."
        );

        return false;

      }


      if (!getPurchaseOrderNumber()) {

        setError(
          "Purchase Order information is missing from the Quality Inspection."
        );

        return false;

      }


      if (!getOriginalDispatchId()) {

        setError(
          "Original Dispatch information is missing from the Quality Inspection."
        );

        return false;

      }


      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        setError(
          "No rejected, damaged, or short items requiring replacement were found."
        );

        return false;

      }


      const hasReplacementQuantity =
        items.some(
          (item) =>
            Number(
              item?.replacementQuantity ||
              0
            ) > 0
        );


      if (!hasReplacementQuantity) {

        setError(
          "Replacement quantity must be greater than zero."
        );

        return false;

      }


      // =====================================================
      // VALIDATE EACH ITEM
      // =====================================================

      const invalidItem =
        items.find(
          (item) => {

            const rejectedQuantity =
              Number(
                item?.rejectedQuantity ||
                0
              );


            const damagedQuantity =
              Number(
                item?.damagedQuantity ||
                0
              );


            const shortQuantity =
              Number(
                item?.shortQuantity ??
                item?.inspectionShortQuantity ??
                item?.shortageQuantity ??
                0
              );


            const replacementQuantity =
              Number(
                item?.replacementQuantity ||
                0
              );


            const maximumReplacementQuantity =
              rejectedQuantity +
              damagedQuantity +
              shortQuantity;


            return (
              replacementQuantity >
              maximumReplacementQuantity
            );

          }
        );


      if (invalidItem) {

        setError(
          "Replacement quantity cannot exceed the rejected, damaged, and short quantity for an item."
        );

        return false;

      }


      if (
        !reason.trim()
      ) {

        setError(
          "Replacement reason is required."
        );

        return false;

      }


      if (
        !requiredReplacementDate
      ) {

        setError(
          "Required replacement date is required."
        );

        return false;

      }


      return true;

    };


  // =========================================================
  // BUILD PAYLOAD
  // =========================================================

  const buildPayload =
    () => {

      return {

        purchaseOrderId:
          selectedInspection?.purchaseOrder?._id ||
          selectedInspection?.purchaseOrder ||
          "",


        originalDispatchId:
          getOriginalDispatchId(),


        qualityInspectionId:
          selectedInspection?._id ||
          selectedInspectionId ||
          null,


        goodsReceiptId:
          selectedInspection?.goodsReceipt?._id ||
          selectedInspection?.goodsReceipt ||
          null,


        items:

          items.map(
            (item) => {

              const shortQuantity =
                Number(
                  item?.shortQuantity ??
                  item?.inspectionShortQuantity ??
                  item?.shortageQuantity ??
                  0
                );

              const matName =
                getMaterialName(item);

              return {

                material:
                  item?.material?._id ||
                  item?.material ||
                  null,


                materialCode:
                  item?.materialCode ||
                  item?.material?.materialCode ||
                  "",


                materialName:
                  item?.materialName ||
                  (matName !== "-" ? matName : "") ||
                  item?.itemName ||
                  item?.material?.materialName ||
                  item?.material?.name ||
                  "",


                unitOfMeasure:
                  item?.unitOfMeasure ||
                  item?.uom ||
                  item?.material?.unitOfMeasure ||
                  item?.material?.uom ||
                  "PCS",


                itemName:
                  matName,


                receivedQuantity:
                  Number(
                    item?.receivedQuantity ||
                    0
                  ),


                originalAcceptedQuantity:
                  Number(
                    item?.acceptedQuantity ||
                    0
                  ),


                rejectedQuantity:
                  Number(
                    item?.rejectedQuantity ||
                    0
                  ),


                damagedQuantity:
                  Number(
                    item?.damagedQuantity ||
                    0
                  ),


                // =================================================
                // SHORT QUANTITY
                // =================================================

                shortQuantity,


                replacementQuantity:
                  Number(
                    item?.replacementQuantity ||
                    0
                  ),

              };

            }
          ),


        reason:
          reason.trim(),


        remarks:
          remarks.trim(),


        requiredReplacementDate,

      };

    };


  // =========================================================
  // CREATE DRAFT
  // =========================================================

  const createDraft =
    async () => {

      setError("");


      if (
        !validateRequest()
      ) {

        return null;

      }


      try {

        setLoading(true);


        const payload =
          buildPayload();


        const response =
          await replacementRequestService
            .createOrganizationReplacementRequest(
              payload
            );


        const createdRequest =
          response?.data ||
          response?.replacementRequest ||
          response;


        return createdRequest;

      } catch (err) {

        console.error(
          "Create Replacement Request Error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create replacement request."
        );


        return null;

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // SAVE DRAFT
  // =========================================================

  const handleSaveDraft =
    async () => {

      const createdRequest =
        await createDraft();


      if (!createdRequest) {

        return;

      }


      const requestId =
        createdRequest?._id ||
        createdRequest?.id;


      if (requestId) {

        navigate(
          `/quality-inspection/replacements/${requestId}`
        );

      } else {

        navigate(
          "/quality-inspection/replacements"
        );

      }

    };


  // =========================================================
  // CREATE + SUBMIT
  // =========================================================

  const handleCreateAndSubmit =
    async () => {

      const createdRequest =
        await createDraft();


      if (!createdRequest) {

        return;

      }


      const requestId =
        createdRequest?._id ||
        createdRequest?.id;


      if (!requestId) {

        setError(
          "Replacement request was created but its ID was not returned."
        );

        return;

      }


      try {

        setLoading(true);


        await replacementRequestService
          .submitOrganizationReplacementRequest(
            requestId
          );


        navigate(
          `/quality-inspection/replacements/${requestId}`
        );

      } catch (err) {

        console.error(
          "Submit Replacement Request Error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Replacement request was created but could not be submitted."
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // BACK
  // =========================================================

  const handleBack =
    () => {

      navigate(
        "/quality-inspection/replacements"
      );

    };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl space-y-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div>

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 disabled:opacity-50"
          >

            <ArrowLeft size={17} />

            Back to Replacement Requests

          </button>


          <p className="text-sm text-slate-500">
            Quality Inspection / Replacement
          </p>


          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Create Replacement Request
          </h1>


          <p className="mt-1 text-sm text-slate-500">
            Create a replacement request from a completed Quality
            Inspection requiring replacement.
          </p>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* =================================================
            SELECT ORIGINAL QUALITY INSPECTION
        ================================================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <FileText
              size={20}
              className="mt-0.5 text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Select Original Quality Inspection
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Only completed inspections with a replacement
                requirement are available.
              </p>

            </div>

          </div>


          <div className="mt-5">

            <label className="text-sm font-medium text-slate-700">

              Quality Inspection

              <span className="ml-1 text-red-500">
                *
              </span>

            </label>


            <select
              value={
                selectedInspectionId
              }
              onChange={
                handleInspectionChange
              }
              disabled={
                loadingInspections ||
                loading ||
                loadingInspection
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >

              <option value="">

                {loadingInspections
                  ? "Loading Quality Inspections..."
                  : "Select Quality Inspection"}

              </option>


              {eligibleInspections.map(
                (inspection) => (

                  <option
                    key={
                      inspection?._id
                    }
                    value={
                      inspection?._id
                    }
                  >

                    {inspection?.inspectionNumber ||
                      inspection?.qualityInspectionNumber ||
                      inspection?._id}

                  </option>

                )
              )}

            </select>


            {!loadingInspections &&
              eligibleInspections.length === 0 && (

                <p className="mt-2 text-xs text-slate-500">

                  No completed Quality Inspections currently
                  require replacement.

                </p>

              )}

          </div>

        </section>


        {/* =================================================
            LOADING SELECTED INSPECTION
        ================================================= */}

        {loadingInspection && (

          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">

            <RefreshCw
              size={17}
              className="animate-spin"
            />

            Loading Quality Inspection details...

          </div>

        )}


        {/* =================================================
            INSPECTION SUMMARY
        ================================================= */}

        {selectedInspection && (

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <FileText
                size={18}
                className="text-blue-600"
              />

              <div>

                <h2 className="font-semibold text-slate-900">
                  Original Inspection Summary
                </h2>

                <p className="text-xs text-slate-500">
                  Information loaded directly from the Quality
                  Inspection.
                </p>

              </div>

            </div>


            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Quality Inspection
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {selectedInspection?.inspectionNumber ||
                    selectedInspection?.qualityInspectionNumber ||
                    selectedInspection?._id ||
                    "-"}
                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Purchase Order
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {getPurchaseOrderNumber()}
                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Goods Receipt
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {getGoodsReceiptNumber()}
                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Vendor
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {getVendorName()}
                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Inspection Date
                </p>

                <p className="mt-1 font-semibold text-slate-800">

                  {selectedInspection?.inspectionDate
                    ? new Date(
                        selectedInspection.inspectionDate
                      ).toLocaleDateString()
                    : "-"}

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Overall Result
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {selectedInspection?.overallResult ||
                    selectedInspection?.result ||
                    "-"}
                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Status
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {selectedInspection?.status ||
                    "-"}
                </p>

              </div>


              <div className="rounded-lg bg-blue-50 p-4">

                <p className="text-xs text-blue-600">
                  Replacement Required
                </p>

                <p className="mt-1 font-semibold text-blue-700">
                  {selectedInspection?.replacementRequired
                    ? "Yes"
                    : "No"}
                </p>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            REPLACEMENT REQUIREMENT
        ================================================= */}

        {selectedInspection && (

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <Package
                size={18}
                className="text-blue-600"
              />

              <div>

                <h2 className="font-semibold text-slate-900">
                  Replacement Requirement
                </h2>

                <p className="text-xs text-slate-500">
                  Rejected, damaged, and short quantities can be
                  included in the replacement request.
                </p>

              </div>

            </div>


            <div className="mt-5 overflow-x-auto">

              <table className="min-w-[1100px] w-full text-sm">

                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                  <tr>

                    <th className="px-4 py-3">
                      Material
                    </th>

                    <th className="px-4 py-3 text-right">
                      Inspected
                    </th>

                    <th className="px-4 py-3 text-right">
                      Accepted
                    </th>

                    <th className="px-4 py-3 text-right">
                      Rejected
                    </th>

                    <th className="px-4 py-3 text-right">
                      Damaged
                    </th>

                    <th className="px-4 py-3 text-right">
                      Short
                    </th>

                    <th className="px-4 py-3 text-right">
                      Max Replacement
                    </th>

                    <th className="px-4 py-3 text-right">
                      Replacement
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {items.length > 0 ? (

                    items.map(
                      (
                        item,
                        index
                      ) => {

                        const shortQuantity =
                          Number(
                            item?.shortQuantity ??
                            item?.inspectionShortQuantity ??
                            item?.shortageQuantity ??
                            0
                          );


                        const rejectedQuantity =
                          Number(
                            item?.rejectedQuantity ||
                            0
                          );


                        const damagedQuantity =
                          Number(
                            item?.damagedQuantity ||
                            0
                          );


                        const maximumReplacementQuantity =
                          rejectedQuantity +
                          damagedQuantity +
                          shortQuantity;


                        return (

                          <tr
                            key={
                              item?._id ||
                              item?.id ||
                              item?.material?._id ||
                              index
                            }
                          >

                            <td className="px-4 py-4 font-semibold text-slate-800">

                              {getMaterialName(
                                item
                              )}

                            </td>


                            <td className="px-4 py-4 text-right text-slate-700">

                              {Number(
                                item?.inspectedQuantity ||
                                0
                              )}

                            </td>


                            <td className="px-4 py-4 text-right text-green-600">

                              {Number(
                                item?.acceptedQuantity ||
                                0
                              )}

                            </td>


                            <td className="px-4 py-4 text-right text-red-600">

                              {rejectedQuantity}

                            </td>


                            <td className="px-4 py-4 text-right text-orange-600">

                              {damagedQuantity}

                            </td>


                            <td className="px-4 py-4 text-right text-yellow-700 font-semibold">

                              {shortQuantity}

                            </td>


                            <td className="px-4 py-4 text-right font-semibold text-slate-700">

                              {maximumReplacementQuantity}

                            </td>


                            <td className="px-4 py-4 text-right">

                              <input
                                type="number"
                                min="0"
                                max={
                                  maximumReplacementQuantity
                                }
                                value={
                                  item?.replacementQuantity ??
                                  0
                                }
                                onChange={
                                  (event) =>
                                    updateReplacementQuantity(
                                      index,
                                      event.target.value
                                    )
                                }
                                className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />

                            </td>

                          </tr>

                        );

                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="px-4 py-12 text-center text-sm text-slate-500"
                      >

                        No rejected, damaged, or short items requiring
                        replacement were found in this Quality Inspection.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                TOTALS
            ================================================= */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Inspected
                </p>

                <p className="mt-1 text-xl font-bold text-slate-800">
                  {totalInspected}
                </p>

              </div>


              <div className="rounded-lg bg-green-50 p-4">

                <p className="text-xs text-green-600">
                  Accepted
                </p>

                <p className="mt-1 text-xl font-bold text-green-700">
                  {totalAccepted}
                </p>

              </div>


              <div className="rounded-lg bg-red-50 p-4">

                <p className="text-xs text-red-600">
                  Rejected
                </p>

                <p className="mt-1 text-xl font-bold text-red-700">
                  {totalRejected}
                </p>

              </div>


              <div className="rounded-lg bg-orange-50 p-4">

                <p className="text-xs text-orange-600">
                  Damaged
                </p>

                <p className="mt-1 text-xl font-bold text-orange-700">
                  {totalDamaged}
                </p>

              </div>


              <div className="rounded-lg bg-yellow-50 p-4">

                <p className="text-xs text-yellow-600">
                  Short
                </p>

                <p className="mt-1 text-xl font-bold text-yellow-700">
                  {totalShort}
                </p>

              </div>


              <div className="rounded-lg bg-blue-50 p-4">

                <p className="text-xs text-blue-600">
                  Replacement
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700">
                  {totalReplacement}
                </p>

              </div>

            </div>


            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">

              <p className="font-semibold">
                Replacement Quantity Rule
              </p>

              <p className="mt-1">
                Maximum replacement quantity =
                rejected quantity + damaged quantity + short quantity.
              </p>

              <p className="mt-1">
                Short quantities are now treated as replacement-eligible
                quantities even when rejected and damaged quantities are zero.
              </p>

            </div>

          </section>

        )}


        {/* =================================================
            REQUEST INFORMATION
        ================================================= */}

        {selectedInspection && (

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Replacement Request Information
            </h2>


            <div className="mt-5 grid gap-5 lg:grid-cols-2">


              {/* REASON */}

              <div className="lg:col-span-2">

                <label className="text-sm font-medium text-slate-700">

                  Replacement Reason

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>


                <textarea
                  rows="3"
                  value={reason}
                  onChange={
                    (event) =>
                      setReason(
                        event.target.value
                      )
                  }
                  placeholder="Enter the reason for replacement..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* REQUIRED DATE */}

              <div>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">

                  <CalendarDays
                    size={16}
                  />

                  Required Replacement Date

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <input
                  type="date"
                  value={
                    requiredReplacementDate
                  }
                  onChange={
                    (event) =>
                      setRequiredReplacementDate(
                        event.target.value
                      )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* REMARKS */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Remarks
                </label>


                <textarea
                  rows="3"
                  value={remarks}
                  onChange={
                    (event) =>
                      setRemarks(
                        event.target.value
                      )
                  }
                  placeholder="Additional remarks..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col justify-end gap-3 sm:flex-row">

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >

            <ArrowLeft size={17} />

            Cancel

          </button>


          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={
              loading ||
              loadingInspection ||
              !selectedInspection ||
              items.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (

              <RefreshCw
                size={17}
                className="animate-spin"
              />

            ) : (

              <Save
                size={17}
              />

            )}

            Save Draft

          </button>


          <button
            type="button"
            onClick={
              handleCreateAndSubmit
            }
            disabled={
              loading ||
              loadingInspection ||
              !selectedInspection ||
              items.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (

              <RefreshCw
                size={17}
                className="animate-spin"
              />

            ) : (

              <Send
                size={17}
              />

            )}

            Create & Submit

          </button>

        </div>


        {/* =================================================
            BUSINESS RULE
        ================================================= */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">

          <p className="font-semibold">
            Replacement Quantity Rule
          </p>

          <p className="mt-1">
            Replacement quantity is loaded from the completed
            Quality Inspection and can include rejected, damaged,
            and short quantities. It is tracked separately from
            the original Purchase Order quantity.
          </p>

        </div>

      </div>

    </div>

  );

}
