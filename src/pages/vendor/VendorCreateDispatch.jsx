import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCheck,
  FaCircleInfo,
  FaSpinner,
  FaArrowsRotate,
} from "react-icons/fa6";

import { toast } from "react-toastify";

import {
  getPurchaseOrderDispatchSummary,
  createVendorDispatch,
} from "../../services/vendorDispatchService";

import {
  getVendorReplacementRequestById,
} from "../../services/vendorReplacementRequestService";


/**
 * =========================================================
 * VENDOR CREATE DISPATCH
 * =========================================================
 *
 * Supports:
 *
 * 1. Normal Purchase Order Dispatch
 * 2. Full Dispatch
 * 3. Partial Dispatch
 * 4. Multiple Dispatches
 * 5. Replacement Dispatch
 * 6. Multiple Replacement Dispatches
 *
 * Normal:
 *
 * /vendor/dispatches/create/:purchaseOrderId
 *
 * Replacement:
 *
 * /vendor/dispatches/create-replacement/:replacementRequestId
 *
 * The same wizard is used for both workflows.
 * =========================================================
 */

function VendorCreateDispatch() {

  const navigate = useNavigate();

  const {
    purchaseOrderId,
    replacementRequestId: replacementRequestIdFromParams,
  } = useParams();

  const location = useLocation();


  // =======================================================
  // DETERMINE DISPATCH MODE
  // =======================================================

  const isReplacementRoute =
    Boolean(replacementRequestIdFromParams) ||
    location.pathname.includes(
      "/create-replacement/"
    );


  const activeReplacementRequestId =
    replacementRequestIdFromParams ||
    location.state?.replacementRequestId ||
    "";


  // =======================================================
  // STATE
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    purchaseOrder,
    setPurchaseOrder,
  ] = useState(null);

  const [
    replacementRequest,
    setReplacementRequest,
  ] = useState(null);

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);


  // =======================================================
  // STEP 2 — ITEMS & QUANTITY
  // =======================================================

  const [
    dispatchItems,
    setDispatchItems,
  ] = useState([]);

  const [
    partialDispatchReason,
    setPartialDispatchReason,
  ] = useState("");

  const [
    expectedRemainingDeliveryDate,
    setExpectedRemainingDeliveryDate,
  ] = useState("");

  const [
    partialDispatchRemarks,
    setPartialDispatchRemarks,
  ] = useState("");


  // =======================================================
  // STEP 3 — LOGISTICS & DOCUMENTS
  // =======================================================

  const [dispatchDate, setDispatchDate] =
    useState("");

  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  const [transporterName, setTransporterName] =
    useState("");

  const [vehicleNumber, setVehicleNumber] =
    useState("");

  const [driverName, setDriverName] =
    useState("");

  const [driverContact, setDriverContact] =
    useState("");

  const [shippingMethod, setShippingMethod] =
    useState("");

  const [lrNumber, setLrNumber] =
    useState("");

  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [awbNumber, setAwbNumber] =
    useState("");

  const [consignmentNumber, setConsignmentNumber] =
    useState("");

  const [packageCount, setPackageCount] =
    useState("");

  const [totalWeight, setTotalWeight] =
    useState("");

  const [weightUnit, setWeightUnit] =
    useState("Kg");

  const [packageType, setPackageType] =
    useState("");

  const [dispatchRemarks, setDispatchRemarks] =
    useState("");


  // =======================================================
  // HELPER — SAFE NUMBER
  // =======================================================

  const safeNumber = (value) => {

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };


  // =======================================================
  // HELPER — FORMAT DATE
  // =======================================================

  const formatDate =
    (date) => {

      if (!date) {
        return "—";
      }

      const value =
        new Date(date);

      if (
        Number.isNaN(
          value.getTime()
        )
      ) {
        return "—";
      }

      return value.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };


  // =======================================================
  // LOAD NORMAL PO
  // =======================================================

  const loadNormalPurchaseOrder =
    async () => {

      if (!purchaseOrderId) {

        throw new Error(
          "Purchase Order ID is missing."
        );
      }


      const response =
        await getPurchaseOrderDispatchSummary(
          purchaseOrderId
        );


      console.log(
        "Create Dispatch PO Response:",
        response
      );


      const data =
        response?.data ||
        response;


      if (!data) {

        throw new Error(
          "Purchase Order details were not found."
        );
      }


      setPurchaseOrder(data);


      const initialItems =
        Array.isArray(
          data?.items
        )
          ? data.items.map(
              (item) => {

                const orderedQuantity =
                  safeNumber(
                    item?.orderedQuantity ??
                    item?.quantity ??
                    0
                  );


                const previouslyDispatchedQuantity =
                  safeNumber(
                    item?.dispatchedQuantity ??
                    item?.previouslyDispatchedQuantity ??
                    0
                  );


                const remainingQuantity =
                  safeNumber(
                    item?.remainingQuantity ??
                    Math.max(
                      orderedQuantity -
                      previouslyDispatchedQuantity,
                      0
                    )
                  );


                return {

                  material:
                    item?.material?._id ||
                    item?.material,

                  materialCode:
                    item?.materialCode ||
                    item?.material?.materialCode ||
                    "",

                  materialName:
                    item?.materialName ||
                    item?.material?.materialName ||
                    "",

                  unitOfMeasure:
                    item?.unitOfMeasure ||
                    item?.material?.unitOfMeasure ||
                    "",

                  orderedQuantity,

                  previouslyDispatchedQuantity,

                  remainingQuantity,

                  dispatchQuantity: 0,

                  remarks: "",
                };
              }
            )
          : [];


      setDispatchItems(
        initialItems
      );
    };


  // =======================================================
  // LOAD REPLACEMENT REQUEST
  // =======================================================

  const loadReplacementRequest =
    async () => {

      if (!activeReplacementRequestId) {

        throw new Error(
          "Replacement Request ID is missing."
        );
      }


      const response =
        await getVendorReplacementRequestById(
          activeReplacementRequestId
        );


      console.log(
        "Replacement Request Response:",
        response
      );


      const request =
        response?.data ||
        response;


      if (!request) {

        throw new Error(
          "Replacement Request could not be loaded."
        );
      }


      setReplacementRequest(
        request
      );


      // =====================================================
      // VALIDATE VENDOR-SIDE STATUS
      // =====================================================

      const requestStatus =
        String(
          request?.status ||
          ""
        )
          .trim()
          .toLowerCase();


      if (
        requestStatus &&
        ![
          "approved",
          "vendor accepted",
          "vendor_accepted",
          "accepted",
          "in progress",
          "in_progress",
        ].includes(
          requestStatus
        )
      ) {

        console.warn(
          "Replacement request status:",
          request?.status
        );
      }


      // =====================================================
      // FIND PURCHASE ORDER
      // =====================================================

      const po =
        request?.purchaseOrder ||
        request?.purchaseOrderId ||
        request?.po ||
        null;


      const resolvedPurchaseOrderId =
        po?._id ||
        po ||
        "";


      if (!resolvedPurchaseOrderId) {

        throw new Error(
          "Purchase Order information is missing from the replacement request."
        );
      }


      // =====================================================
      // SET PURCHASE ORDER
      // =====================================================

      const resolvedPurchaseOrder =
        typeof po === "object"
          ? po
          : {
              _id:
                resolvedPurchaseOrderId,

              poNumber:
                request?.poNumber ||
                request?.purchaseOrderNumber ||
                "—",
            };


      setPurchaseOrder(
        resolvedPurchaseOrder
      );


      // =====================================================
      // REPLACEMENT ITEMS
      // =====================================================

      const replacementItems =
        Array.isArray(
          request?.items
        )
          ? request.items
          : [];


      if (
        replacementItems.length === 0
      ) {

        throw new Error(
          "No replacement items are available for dispatch."
        );
      }


      const initialItems =
        replacementItems.map(
          (item) => {

            const approvedQuantity =
              safeNumber(
                item?.approvedQuantity ??
                item?.replacementQuantity ??
                item?.requestedQuantity ??
                item?.quantity ??
                item?.rejectedQuantity ??
                0
              );


            const previouslyDispatchedQuantity =
              safeNumber(
                item?.replacementDispatchedQuantity ??
                item?.previouslyDispatchedQuantity ??
                item?.dispatchedQuantity ??
                item?.replacementDispatchQuantity ??
                0
              );


            const remainingQuantity =
              safeNumber(
                item?.remainingReplacementQuantity ??
                item?.remainingQuantity ??
                Math.max(
                  approvedQuantity -
                  previouslyDispatchedQuantity,
                  0
                )
              );


            return {

              material:
                item?.material?._id ||
                item?.material ||
                item?.materialId,

              materialCode:
                item?.materialCode ||
                item?.material?.materialCode ||
                "",

              materialName:
                item?.materialName ||
                item?.material?.materialName ||
                "",

              unitOfMeasure:
                item?.unitOfMeasure ||
                item?.material?.unitOfMeasure ||
                "",

              orderedQuantity:
                approvedQuantity,

              previouslyDispatchedQuantity,

              remainingQuantity,

              dispatchQuantity: 0,

              remarks:
                item?.remarks ||
                "",
            };
          }
        );


      setDispatchItems(
        initialItems
      );
    };


  // =======================================================
  // LOAD DATA
  // =======================================================

  useEffect(() => {

    const loadData =
      async () => {

        try {

          setLoading(
            true
          );


          if (
            isReplacementRoute
          ) {

            await loadReplacementRequest();

          } else {

            await loadNormalPurchaseOrder();

          }

        } catch (error) {

          console.error(
            "Create Dispatch Load Error:",
            error
          );


          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load dispatch information.";


          toast.error(
            message
          );


          navigate(
            "/vendor/dispatches",
            {
              replace: true,
            }
          );

        } finally {

          setLoading(
            false
          );
        }
      };


    loadData();

  }, [
    purchaseOrderId,
    activeReplacementRequestId,
    isReplacementRoute,
    navigate,
  ]);


  // =======================================================
  // BACK TO DISPATCH DASHBOARD
  // =======================================================

  const handleBack =
    () => {

      navigate(
        "/vendor/dispatches"
      );
    };


  // =======================================================
  // ITEM DISPATCH QUANTITY
  // =======================================================

  const handleDispatchQuantityChange = (
    index,
    value
  ) => {

    const numericValue =
      value === ""
        ? 0
        : Number(value);


    setDispatchItems(
      (previousItems) => {

        return previousItems.map(
          (
            item,
            itemIndex
          ) => {

            if (
              itemIndex !== index
            ) {
              return item;
            }


            const safeQuantity =
              Math.max(
                0,
                Math.min(
                  numericValue,
                  item.remainingQuantity
                )
              );


            return {

              ...item,

              dispatchQuantity:
                safeQuantity,
            };
          }
        );
      }
    );
  };


  // =======================================================
  // ITEM REMARKS
  // =======================================================

  const handleItemRemarksChange = (
    index,
    value
  ) => {

    setDispatchItems(
      (previousItems) => {

        return previousItems.map(
          (
            item,
            itemIndex
          ) => {

            if (
              itemIndex !== index
            ) {
              return item;
            }


            return {

              ...item,

              remarks:
                value,
            };
          }
        );
      }
    );
  };


  // =======================================================
  // STEP 1 → STEP 2
  // =======================================================

  const handleNext =
    () => {

      if (
        !purchaseOrder
      ) {

        toast.error(
          isReplacementRoute
            ? "Replacement request is not loaded yet."
            : "Purchase Order is not loaded yet."
        );

        return;
      }


      if (
        !dispatchItems.length
      ) {

        toast.error(
          isReplacementRoute
            ? "No replacement items are available."
            : "No Purchase Order items are available."
        );

        return;
      }


      setCurrentStep(
        2
      );
    };


  // =======================================================
  // STEP 2 → STEP 3
  // =======================================================

  const handleStep2Next =
    () => {

      const selectedQuantity =
        dispatchItems.reduce(
          (
            total,
            item
          ) =>
            total +
            safeNumber(
              item.dispatchQuantity
            ),
          0
        );


      if (
        selectedQuantity <= 0
      ) {

        toast.error(
          isReplacementRoute
            ? "Enter at least one replacement quantity to dispatch."
            : "Enter at least one dispatch quantity."
        );

        return;
      }


      const hasPartial =
        dispatchItems.some(
          (item) =>
            safeNumber(
              item.dispatchQuantity
            ) <
            safeNumber(
              item.remainingQuantity
            )
        );


      if (
        hasPartial
      ) {

        if (
          !partialDispatchReason
        ) {

          toast.error(
            "Reason for partial dispatch is required."
          );

          return;
        }


        if (
          !expectedRemainingDeliveryDate
        ) {

          toast.error(
            "Expected remaining delivery date is required."
          );

          return;
        }
      }


      setCurrentStep(
        3
      );
    };


  // =======================================================
  // STEP 3 → STEP 4
  // =======================================================

  const handleStep3Next =
    () => {

      if (
        !dispatchDate
      ) {

        toast.error(
          "Dispatch date is required."
        );

        return;
      }


      if (
        !expectedDeliveryDate
      ) {

        toast.error(
          "Expected delivery date is required."
        );

        return;
      }


      if (
        new Date(
          expectedDeliveryDate
        ) <
        new Date(
          dispatchDate
        )
      ) {

        toast.error(
          "Expected delivery date cannot be before dispatch date."
        );

        return;
      }


      setCurrentStep(
        4
      );
    };


  // =======================================================
  // SUBMIT DISPATCH
  // =======================================================

  const handleSubmitDispatch =
    async () => {

      if (
        submitting
      ) {
        return;
      }


      try {

        setSubmitting(
          true
        );


        // =================================================
        // PURCHASE ORDER ID
        // =================================================

        const resolvedPurchaseOrderId =
          purchaseOrder?._id ||
          purchaseOrder?.purchaseOrder?._id ||
          purchaseOrder?.data?._id ||
          purchaseOrder?.data?.purchaseOrder?._id ||
          purchaseOrder?.purchaseOrder ||
          purchaseOrder?.data?.purchaseOrder ||
          purchaseOrderId ||
          replacementRequest?.purchaseOrder?._id ||
          replacementRequest?.purchaseOrder;


        if (
          !resolvedPurchaseOrderId
        ) {

          toast.error(
            "Purchase Order information is missing."
          );

          return;
        }


        // =================================================
        // DISPATCH TYPE
        // =================================================

        const isPartial =
          dispatchItems.some(
            (item) =>
              safeNumber(
                item.dispatchQuantity
              ) <
              safeNumber(
                item.remainingQuantity
              )
          );


        const dispatchType =
          isPartial
            ? "Partial"
            : "Full";


        // =================================================
        // ITEMS
        // =================================================

        const payloadItems =
          dispatchItems
            .filter(
              (item) =>
                safeNumber(
                  item.dispatchQuantity
                ) > 0
            )
            .map(
              (item) => {

                const dispatchQuantity =
                  safeNumber(
                    item.dispatchQuantity
                  );


                return {

                  material:
                    item.material,

                  materialCode:
                    item.materialCode,

                  materialName:
                    item.materialName,

                  unitOfMeasure:
                    item.unitOfMeasure,

                  orderedQuantity:
                    safeNumber(
                      item.orderedQuantity
                    ),

                  previouslyDispatchedQuantity:
                    safeNumber(
                      item.previouslyDispatchedQuantity
                    ),

                  dispatchQuantity,

                  remainingQuantity:
                    Math.max(
                      safeNumber(
                        item.remainingQuantity
                      ) -
                      dispatchQuantity,
                      0
                    ),

                  remarks:
                    item.remarks ||
                    "",
                };
              }
            );


        if (
          payloadItems.length === 0
        ) {

          toast.error(
            "At least one item must have a dispatch quantity."
          );

          return;
        }


        // =================================================
        // FINAL PAYLOAD
        // =================================================

        const payload = {

          purchaseOrder:
            resolvedPurchaseOrderId,

          dispatchDate,

          expectedDeliveryDate,

          dispatchType,

          partialDispatchReason:
            isPartial
              ? partialDispatchReason
              : "",

          partialDispatchRemarks:
            isPartial
              ? partialDispatchRemarks
              : "",

          expectedRemainingDeliveryDate:
            isPartial
              ? expectedRemainingDeliveryDate
              : null,

          transporterName,

          vehicleNumber,

          driverName,

          driverContact,

          shippingMethod,

          lrNumber,

          trackingNumber,

          awbNumber,

          consignmentNumber,

          packageCount:
            safeNumber(
              packageCount
            ),

          totalWeight:
            safeNumber(
              totalWeight
            ),

          weightUnit,

          packageType,

          remarks:
            dispatchRemarks,

          items:
            payloadItems,

          // =================================================
          // REPLACEMENT DISPATCH
          // =================================================

          ...(isReplacementRoute &&
            activeReplacementRequestId
            ? {

                isReplacement:
                  true,

                replacementRequest:
                  activeReplacementRequestId,

              }
            : {}),

        };


        console.log(
          "FINAL DISPATCH PAYLOAD:",
          JSON.stringify(
            payload,
            null,
            2
          )
        );


        const response =
          await createVendorDispatch(
            payload
          );


        console.log(
          "Create Dispatch Response:",
          response
        );


        toast.success(
          response?.message ||
          (
            isReplacementRoute
              ? "Replacement dispatch created successfully."
              : "Dispatch created successfully."
          )
        );


        navigate(
          "/vendor/dispatches"
        );

      } catch (
        error
      ) {

        console.error(
          "Create Dispatch Error:",
          error
        );


        const message =
          error?.response?.data?.message ||
          error?.message ||
          (
            isReplacementRoute
              ? "Failed to create replacement dispatch."
              : "Failed to create dispatch."
          );


        toast.error(
          message
        );

      } finally {

        setSubmitting(
          false
        );
      }
    };


  // =======================================================
  // LOADING
  // =======================================================

  if (
    loading
  ) {

    return (
      <div className="min-h-[500px] flex items-center justify-center">

        <div className="flex items-center gap-3 text-slate-500">

          <FaSpinner
            className="animate-spin"
          />

          <span>
            {isReplacementRoute
              ? "Loading Replacement Request..."
              : "Loading Purchase Order..."}
          </span>

        </div>

      </div>
    );
  }


  // =======================================================
  // EMPTY STATE
  // =======================================================

  if (
    !purchaseOrder ||
    !dispatchItems.length
  ) {

    return (
      <div className="p-8">

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

          <h2 className="text-lg font-semibold text-slate-800">

            {isReplacementRoute
              ? "Replacement Dispatch Not Available"
              : "Purchase Order Not Found"}

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            {isReplacementRoute
              ? "No dispatchable replacement items were found for this replacement request."
              : "The selected Purchase Order could not be loaded."}

          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >

            <FaArrowLeft />

            Back to Dispatches

          </button>

        </div>

      </div>
    );
  }


  // =======================================================
  // PURCHASE ORDER VALUES
  // =======================================================

  const poNumber =
    purchaseOrder.poNumber ||
    purchaseOrder.purchaseOrderNumber ||
    replacementRequest?.poNumber ||
    replacementRequest?.purchaseOrderNumber ||
    "—";


  const poDate =
    purchaseOrder.orderDate ||
    purchaseOrder.poDate ||
    purchaseOrder.purchaseOrderDate ||
    null;


  const requiredDate =
    purchaseOrder.requiredDate ||
    purchaseOrder.purchaseRequisition?.requiredDate ||
    purchaseOrder.expectedDeliveryDate ||
    replacementRequest?.requiredReplacementDate ||
    null;


  const vendorPromisedDate =
    purchaseOrder.vendorPromisedDate ||
    purchaseOrder.expectedDeliveryDate ||
    null;


  const poStatus =
    purchaseOrder.status ||
    (
      isReplacementRoute
        ? "Replacement Approved"
        : "Accepted"
    );


  const items =
    Array.isArray(
      purchaseOrder.items
    )
      ? purchaseOrder.items
      : [];


  // =======================================================
  // REPLACEMENT VALUES
  // =======================================================

  const replacementRequestNumber =
    replacementRequest?.requestNumber ||
    replacementRequest?.replacementRequestNumber ||
    replacementRequest?.requestCode ||
    replacementRequest?.replacementNumber ||
    "—";


  const replacementStatus =
    replacementRequest?.status ||
    "Approved";


  const replacementReason =
    replacementRequest?.reason ||
    replacementRequest?.replacementReason ||
    "—";


  const replacementRemarks =
    replacementRequest?.remarks ||
    "";


  // =======================================================
  // DISPATCH TOTALS
  // =======================================================

  const totalRemainingQuantity =
    dispatchItems.reduce(
      (
        total,
        item
      ) =>
        total +
        safeNumber(
          item.remainingQuantity
        ),
      0
    );


  const totalDispatchQuantity =
    dispatchItems.reduce(
      (
        total,
        item
      ) =>
        total +
        safeNumber(
          item.dispatchQuantity
        ),
      0
    );


  // =======================================================
  // STEP DEFINITIONS
  // =======================================================

  const steps = [
    {
      number: 1,
      label:
        isReplacementRoute
          ? "Replacement Request"
          : "Select Purchase Order",
    },
    {
      number: 2,
      label: "Items & Quantity",
    },
    {
      number: 3,
      label: "Logistics & Documents",
    },
    {
      number: 4,
      label: "Review & Submit",
    },
  ];


  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-full bg-slate-50 p-6">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <FaArrowLeft />
          </button>


          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-xl font-semibold text-slate-800">
                {isReplacementRoute
                  ? "Create Replacement Dispatch"
                  : "Create Dispatch"}
              </h1>


              {isReplacementRoute && (

                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">

                  <FaArrowsRotate />

                  Replacement

                </span>

              )}

            </div>


            <p className="mt-0.5 text-sm text-slate-500">

              {isReplacementRoute
                ? "Create a dispatch against the accepted replacement request."
                : "Create a dispatch against the accepted Purchase Order."}

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          REPLACEMENT BANNER
          ================================================= */}

      {isReplacementRoute && (

        <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">

              <FaArrowsRotate />

            </div>


            <div className="flex-1">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-orange-900">
                    Replacement Dispatch
                  </p>

                  <p className="mt-1 text-xs text-orange-800">

                    Replacement Request:
                    {" "}

                    <span className="font-semibold">
                      {replacementRequestNumber}
                    </span>

                  </p>

                </div>


                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                  {replacementStatus}

                </span>

              </div>


              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">

                <div>

                  <p className="text-[11px] uppercase tracking-wide text-orange-600">
                    Replacement Reason
                  </p>

                  <p className="mt-1 text-xs text-orange-900">
                    {replacementReason}
                  </p>

                </div>


                <div>

                  <p className="text-[11px] uppercase tracking-wide text-orange-600">
                    Purchase Order
                  </p>

                  <p className="mt-1 text-xs font-semibold text-orange-900">
                    {poNumber}
                  </p>

                </div>


                <div>

                  <p className="text-[11px] uppercase tracking-wide text-orange-600">
                    Remaining Replacement Qty
                  </p>

                  <p className="mt-1 text-xs font-semibold text-orange-900">
                    {totalRemainingQuantity}
                  </p>

                </div>

              </div>


              {replacementRemarks && (

                <p className="mt-3 text-xs text-orange-800">
                  <span className="font-semibold">
                    Remarks:
                  </span>
                  {" "}
                  {replacementRemarks}
                </p>

              )}

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          STEPPER
          ================================================= */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white px-6 py-5">

        <div className="flex items-center">

          {steps.map(
            (
              step,
              index
            ) => {

              const completed =
                currentStep >
                step.number;

              const active =
                currentStep ===
                step.number;


              return (
                <div
                  key={
                    step.number
                  }
                  className="flex flex-1 items-center"
                >

                  <div className="flex items-center gap-2">

                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",

                        completed
                          ? "bg-green-600 text-white"
                          : active
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >

                      {completed ? (
                        <FaCheck />
                      ) : (
                        step.number
                      )}

                    </div>


                    <span
                      className={[
                        "whitespace-nowrap text-sm",

                        active ||
                        completed
                          ? "font-semibold text-slate-800"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>

                  </div>


                  {index <
                    steps.length -
                    1 && (

                    <div
                      className={[
                        "mx-4 h-px flex-1",

                        currentStep >
                        step.number
                          ? "bg-green-500"
                          : "bg-slate-200",
                      ].join(" ")}
                    />

                  )}

                </div>
              );

            }
          )}

        </div>

      </div>


      {/* =================================================
          STEP 1
          ================================================= */}

      {currentStep === 1 && (

        <div className="rounded-xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-base font-semibold text-slate-800">

              {isReplacementRoute
                ? "Replacement Request"
                : "Select Purchase Order"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {isReplacementRoute
                ? "Review the approved replacement request before creating the replacement dispatch."
                : "Review the accepted Purchase Order selected for dispatch."}

            </p>

          </div>


          <div className="p-6">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  PO Number
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-700">
                  {poNumber}
                </p>

              </div>


              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  PO Date
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    poDate
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Required Date
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    requiredDate
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                  {isReplacementRoute
                    ? "Replacement Status"
                    : "Vendor Promised Date"}

                </p>

                <p className="mt-1 text-sm text-slate-700">

                  {isReplacementRoute
                    ? replacementStatus
                    : formatDate(
                        vendorPromisedDate
                      )}

                </p>

              </div>

            </div>


            {isReplacementRoute ? (

              <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-600">

                    <FaArrowsRotate />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-orange-800">
                      Replacement Request Approved
                    </p>

                    <p className="text-xs text-orange-700">

                      Request:
                      {" "}
                      {replacementRequestNumber}

                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">

                    <FaCheck />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-green-800">
                      Purchase Order Accepted
                    </p>

                    <p className="text-xs text-green-700">
                      Status: {poStatus}
                    </p>

                  </div>

                </div>

              </div>

            )}


            <div className="mt-6">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">

                {isReplacementRoute
                  ? "Replacement Items Summary"
                  : "PO Items Summary"}

              </h3>


              <div className="overflow-hidden rounded-lg border border-slate-200">

                <table className="min-w-full text-sm">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Material
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Material Name
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        UOM
                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">

                        {isReplacementRoute
                          ? "Approved Qty"
                          : "Ordered Qty"}

                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Already Dispatched
                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Remaining Qty
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {dispatchItems.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item.material ||
                            index
                          }
                          className="bg-white"
                        >

                          <td className="px-4 py-3 font-medium text-slate-700">
                            {item.materialCode ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-slate-700">
                            {item.materialName ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {item.unitOfMeasure ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-right text-slate-700">
                            {item.orderedQuantity}
                          </td>

                          <td className="px-4 py-3 text-right text-slate-700">
                            {item.previouslyDispatchedQuantity}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold text-blue-700">
                            {item.remainingQuantity}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            <div className="mt-5 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">

              <div className="mt-0.5 text-blue-600">

                <FaCircleInfo />

              </div>

              <div>

                <p className="text-sm font-medium text-blue-800">

                  {isReplacementRoute
                    ? "Replacement quantities are validated against the approved replacement balance."
                    : "Dispatch quantity will be validated automatically."}

                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">

                  {isReplacementRoute
                    ? "You can dispatch the complete replacement quantity or create multiple partial replacement dispatches."
                    : "You can dispatch the remaining quantity or create a partial dispatch. The system will prevent dispatching more than the remaining quantity."}

                </p>

              </div>

            </div>

          </div>


          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Next
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          STEP 2
          ================================================= */}

      {currentStep === 2 && (

        <div className="rounded-xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-800">

                  {isReplacementRoute
                    ? "Replacement Items & Quantity"
                    : "Add Items & Quantity"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {isReplacementRoute
                    ? "Enter the replacement quantity you want to dispatch."
                    : "Enter the quantity you want to dispatch for each material."}

                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-400">
                  PO Number
                </p>

                <p className="text-sm font-semibold text-blue-700">
                  {poNumber}
                </p>

              </div>

            </div>

          </div>


          <div className="p-6">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-xs text-slate-500">
                  {isReplacementRoute
                    ? "Replacement Required Date"
                    : "PO Required Date"}
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  {formatDate(
                    requiredDate
                  )}
                </p>

              </div>


              <div className="text-right">

                <p className="text-xs text-slate-500">
                  Remaining Total
                </p>

                <p className="text-sm font-semibold text-blue-700">
                  {totalRemainingQuantity}
                  {" "}
                  {dispatchItems[0]?.unitOfMeasure ||
                    ""}
                </p>

              </div>

            </div>


            <div className="overflow-hidden rounded-lg border border-slate-200">

              <table className="min-w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Material
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      UOM
                    </th>

                    <th className="px-4 py-3 text-right font-semibold text-slate-600">

                      {isReplacementRoute
                        ? "Approved Qty"
                        : "Ordered Qty"}

                    </th>

                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Already Dispatched
                    </th>

                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Remaining Qty
                    </th>

                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Dispatch Qty
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Remarks
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {dispatchItems.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item.material ||
                          index
                        }
                        className="bg-white"
                      >

                        <td className="px-4 py-4">

                          <div>

                            <p className="font-medium text-slate-700">
                              {item.materialCode}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.materialName}
                            </p>

                          </div>

                        </td>


                        <td className="px-4 py-4 text-slate-600">
                          {item.unitOfMeasure}
                        </td>


                        <td className="px-4 py-4 text-right text-slate-700">
                          {item.orderedQuantity}
                        </td>


                        <td className="px-4 py-4 text-right text-slate-700">
                          {item.previouslyDispatchedQuantity}
                        </td>


                        <td className="px-4 py-4 text-right font-semibold text-blue-700">
                          {item.remainingQuantity}
                        </td>


                        <td className="px-4 py-4">

                          <input
                            type="number"
                            min="0"
                            max={
                              item.remainingQuantity
                            }
                            value={
                              item.dispatchQuantity ===
                              0
                                ? ""
                                : item.dispatchQuantity
                            }
                            onChange={(
                              event
                            ) =>
                              handleDispatchQuantityChange(
                                index,
                                event.target.value
                              )
                            }
                            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="0"
                          />

                        </td>


                        <td className="px-4 py-4">

                          <input
                            type="text"
                            value={
                              item.remarks
                            }
                            onChange={(
                              event
                            ) =>
                              handleItemRemarksChange(
                                index,
                                event.target.value
                              )
                            }
                            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder={
                              isReplacementRoute
                                ? "Replacement remarks"
                                : "Remaining quantity"
                            }
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PARTIAL DISPATCH
                ================================================= */}

            {dispatchItems.some(
              (item) =>
                Number(
                  item.dispatchQuantity
                ) > 0 &&
                Number(
                  item.dispatchQuantity
                ) <
                  Number(
                    item.remainingQuantity
                  )
            ) && (

              <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-5">

                <h3 className="text-sm font-semibold text-orange-800">

                  {isReplacementRoute
                    ? "Partial Replacement Dispatch Details"
                    : "Partial Dispatch Details"}

                  {" "}
                  (Required)

                </h3>


                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div>

                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Reason for Partial Dispatch *
                    </label>

                    <select
                      value={
                        partialDispatchReason
                      }
                      onChange={(
                        event
                      ) =>
                        setPartialDispatchReason(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                      <option value="">
                        Select reason
                      </option>

                      <option value="Stock Shortage">
                        Stock Shortage
                      </option>

                      <option value="Production Delay">
                        Production Delay
                      </option>

                      <option value="Raw Material Shortage">
                        Raw Material Shortage
                      </option>

                      <option value="Transportation Constraint">
                        Transportation Constraint
                      </option>

                      <option value="Quality Issue">
                        Quality Issue
                      </option>

                      <option value="Replacement Processing">
                        Replacement Processing
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  <div>

                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Expected Remaining Delivery Date *
                    </label>

                    <input
                      type="date"
                      value={
                        expectedRemainingDeliveryDate
                      }
                      onChange={(
                        event
                      ) =>
                        setExpectedRemainingDeliveryDate(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  <div>

                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Remarks
                    </label>

                    <input
                      type="text"
                      value={
                        partialDispatchRemarks
                      }
                      onChange={(
                        event
                      ) =>
                        setPartialDispatchRemarks(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter remarks"
                    />

                  </div>

                </div>

              </div>

            )}

          </div>


          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

            <button
              type="button"
              onClick={() =>
                setCurrentStep(
                  1
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </button>


            <button
              type="button"
              onClick={
                handleStep2Next
              }
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Next
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          STEP 3
          ================================================= */}

      {currentStep === 3 && (

        <div className="rounded-xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-800">
                  Logistics & Documents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the transportation and shipment information
                  for this dispatch.
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-400">
                  PO Number
                </p>

                <p className="text-sm font-semibold text-blue-700">
                  {poNumber}
                </p>

              </div>

            </div>

          </div>


          <div className="p-6">

            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Dispatch Information
            </h3>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>

                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Dispatch Date *
                </label>

                <input
                  type="date"
                  value={
                    dispatchDate
                  }
                  onChange={(
                    event
                  ) =>
                    setDispatchDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              <div>

                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Expected Delivery Date *
                </label>

                <input
                  type="date"
                  value={
                    expectedDeliveryDate
                  }
                  onChange={(
                    event
                  ) =>
                    setExpectedDeliveryDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              <div>

                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Shipping Method
                </label>

                <select
                  value={
                    shippingMethod
                  }
                  onChange={(
                    event
                  ) =>
                    setShippingMethod(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Select method
                  </option>

                  <option value="Road">
                    Road
                  </option>

                  <option value="Rail">
                    Rail
                  </option>

                  <option value="Air">
                    Air
                  </option>

                  <option value="Courier">
                    Courier
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                TRANSPORTER
                ================================================= */}

            <div className="mt-8">

              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Transporter Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Transporter Name
                  </label>

                  <input
                    type="text"
                    value={
                      transporterName
                    }
                    onChange={(
                      event
                    ) =>
                      setTransporterName(
                        event.target.value
                      )
                    }
                    placeholder="Enter transporter name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Vehicle Number
                  </label>

                  <input
                    type="text"
                    value={
                      vehicleNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setVehicleNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter vehicle number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Driver Name
                  </label>

                  <input
                    type="text"
                    value={
                      driverName
                    }
                    onChange={(
                      event
                    ) =>
                      setDriverName(
                        event.target.value
                      )
                    }
                    placeholder="Enter driver name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Driver Contact
                  </label>

                  <input
                    type="tel"
                    value={
                      driverContact
                    }
                    onChange={(
                      event
                    ) =>
                      setDriverContact(
                        event.target.value
                      )
                    }
                    placeholder="Enter driver contact"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                TRACKING
                ================================================= */}

            <div className="mt-8">

              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Tracking Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    LR Number
                  </label>

                  <input
                    type="text"
                    value={
                      lrNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setLrNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter LR number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Tracking Number
                  </label>

                  <input
                    type="text"
                    value={
                      trackingNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setTrackingNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter tracking number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    AWB Number
                  </label>

                  <input
                    type="text"
                    value={
                      awbNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setAwbNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter AWB number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Consignment Number
                  </label>

                  <input
                    type="text"
                    value={
                      consignmentNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setConsignmentNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter consignment number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                PACKAGE
                ================================================= */}

            <div className="mt-8">

              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Package Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Package Count
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      packageCount
                    }
                    onChange={(
                      event
                    ) =>
                      setPackageCount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Total Weight
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      totalWeight
                    }
                    onChange={(
                      event
                    ) =>
                      setTotalWeight(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Weight Unit
                  </label>

                  <select
                    value={
                      weightUnit
                    }
                    onChange={(
                      event
                    ) =>
                      setWeightUnit(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="Kg">
                      Kg
                    </option>

                    <option value="Ton">
                      Ton
                    </option>

                  </select>

                </div>


                <div>

                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Package Type
                  </label>

                  <input
                    type="text"
                    value={
                      packageType
                    }
                    onChange={(
                      event
                    ) =>
                      setPackageType(
                        event.target.value
                      )
                    }
                    placeholder="Box / Pallet / Bag"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                REMARKS
                ================================================= */}

            <div className="mt-8">

              <label className="mb-1 block text-xs font-medium text-slate-700">
                Dispatch Remarks
              </label>

              <textarea
                rows="3"
                value={
                  dispatchRemarks
                }
                onChange={(
                  event
                ) =>
                  setDispatchRemarks(
                    event.target.value
                  )
                }
                placeholder="Enter dispatch remarks"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>


          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

            <button
              type="button"
              onClick={() =>
                setCurrentStep(
                  2
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </button>


            <button
              type="button"
              onClick={
                handleStep3Next
              }
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Next
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          STEP 4
          ================================================= */}

      {currentStep === 4 && (

        <div className="rounded-xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-800">
                  Review & Submit
                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {isReplacementRoute
                    ? "Review the replacement dispatch before submitting."
                    : "Review all dispatch information before submitting."}

                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-400">
                  Purchase Order
                </p>

                <p className="text-sm font-semibold text-blue-700">
                  {poNumber}
                </p>

              </div>

            </div>

          </div>


          <div className="p-6">

            {/* =================================================
                REPLACEMENT SUMMARY
                ================================================= */}

            {isReplacementRoute && (

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                  <div>

                    <p className="text-xs text-orange-600">
                      Dispatch Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-900">
                      Replacement
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-orange-600">
                      Replacement Request
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-900">
                      {replacementRequestNumber}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-orange-600">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-700">
                      {replacementStatus}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-orange-600">
                      Dispatch Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-900">
                      {totalDispatchQuantity}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                PURCHASE ORDER SUMMARY
                ================================================= */}

            <div className="mt-6">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Purchase Order Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">

                <div>

                  <p className="text-xs text-slate-400">
                    PO Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {poNumber}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    PO Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      poDate
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Required Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      requiredDate
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Vendor Promised Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      vendorPromisedDate
                    )}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                DISPATCH SUMMARY
                ================================================= */}

            <div className="mt-7">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Dispatch Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4">

                <div>

                  <p className="text-xs text-slate-400">
                    Dispatch Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">

                    {isReplacementRoute
                      ? "Replacement"
                      : (
                        dispatchItems.some(
                          (item) =>
                            Number(
                              item.dispatchQuantity
                            ) <
                            Number(
                              item.remainingQuantity
                            )
                        )
                          ? "Partial"
                          : "Full"
                      )}

                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Dispatch Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      dispatchDate
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Expected Delivery
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      expectedDeliveryDate
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Shipping Method
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {shippingMethod ||
                      "—"}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                ITEMS
                ================================================= */}

            <div className="mt-7">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">

                {isReplacementRoute
                  ? "Replacement Dispatch Items"
                  : "Dispatch Items"}

              </h3>


              <div className="overflow-hidden rounded-lg border border-slate-200">

                <table className="min-w-full text-sm">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        Material
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        UOM
                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">

                        {isReplacementRoute
                          ? "Approved"
                          : "Ordered"}

                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Already Dispatched
                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Dispatch
                      </th>

                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        Balance
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {dispatchItems.map(
                      (
                        item,
                        index
                      ) => {

                        const balance =
                          Math.max(
                            Number(
                              item.remainingQuantity ||
                              0
                            ) -
                            Number(
                              item.dispatchQuantity ||
                              0
                            ),
                            0
                          );


                        return (

                          <tr
                            key={
                              item.material ||
                              index
                            }
                          >

                            <td className="px-4 py-3">

                              <p className="font-medium text-slate-700">
                                {item.materialCode}
                              </p>

                              <p className="text-xs text-slate-500">
                                {item.materialName}
                              </p>

                            </td>


                            <td className="px-4 py-3 text-slate-600">
                              {item.unitOfMeasure}
                            </td>


                            <td className="px-4 py-3 text-right">
                              {item.orderedQuantity}
                            </td>


                            <td className="px-4 py-3 text-right">
                              {item.previouslyDispatchedQuantity}
                            </td>


                            <td className="px-4 py-3 text-right font-semibold text-blue-700">
                              {item.dispatchQuantity}
                            </td>


                            <td className="px-4 py-3 text-right font-semibold text-slate-700">
                              {balance}
                            </td>

                          </tr>

                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                PARTIAL DISPATCH
                ================================================= */}

            {dispatchItems.some(
              (item) =>
                Number(
                  item.dispatchQuantity
                ) <
                Number(
                  item.remainingQuantity
                )
            ) && (

              <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">

                <h3 className="text-sm font-semibold text-orange-800">

                  {isReplacementRoute
                    ? "Partial Replacement Dispatch"
                    : "Partial Dispatch Information"}

                </h3>


                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div>

                    <p className="text-xs text-orange-600">
                      Reason
                    </p>

                    <p className="mt-1 text-sm font-medium text-orange-900">
                      {partialDispatchReason ||
                        "—"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-orange-600">
                      Expected Remaining Delivery
                    </p>

                    <p className="mt-1 text-sm font-medium text-orange-900">
                      {formatDate(
                        expectedRemainingDeliveryDate
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-orange-600">
                      Remarks
                    </p>

                    <p className="mt-1 text-sm text-orange-900">
                      {partialDispatchRemarks ||
                        "—"}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                LOGISTICS
                ================================================= */}

            <div className="mt-7">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Logistics Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4">

                <div>

                  <p className="text-xs text-slate-400">
                    Transporter
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {transporterName ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Vehicle Number
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {vehicleNumber ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Driver
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {driverName ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Driver Contact
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {driverContact ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    LR Number
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {lrNumber ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Tracking Number
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {trackingNumber ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    AWB Number
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {awbNumber ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Consignment Number
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {consignmentNumber ||
                      "—"}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                PACKAGE
                ================================================= */}

            <div className="mt-7">

              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Package Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4">

                <div>

                  <p className="text-xs text-slate-400">
                    Package Count
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {packageCount ||
                      "0"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Total Weight
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {totalWeight ||
                      "0"}
                    {" "}
                    {weightUnit}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Weight Unit
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {weightUnit}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Package Type
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {packageType ||
                      "—"}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                REMARKS
                ================================================= */}

            {dispatchRemarks && (

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs font-medium text-slate-500">
                  Dispatch Remarks
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {dispatchRemarks}
                </p>

              </div>

            )}

          </div>


          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

            <button
              type="button"
              onClick={() =>
                setCurrentStep(
                  3
                )
              }
              disabled={
                submitting
              }
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>


            <button
              type="button"
              onClick={
                handleSubmitDispatch
              }
              disabled={
                submitting
              }
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {submitting
                ? "Submitting..."
                : (
                  isReplacementRoute
                    ? "Submit Replacement Dispatch"
                    : "Submit Dispatch"
                )}

            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default VendorCreateDispatch;