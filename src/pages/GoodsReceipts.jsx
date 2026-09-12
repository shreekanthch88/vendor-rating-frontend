import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Plus,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import Layout from "../layout/Layout";

import {
  getAllGoodsReceipts,
  createGoodsReceipt,
  getEligibleDispatches,
} from "../services/goodsReceiptService";

import GoodsReceiptDashboardCards
  from "../components/goodsReceipt/GoodsReceiptDashboardCards";

import GoodsReceiptFilters
  from "../components/goodsReceipt/GoodsReceiptFilters";

import GoodsReceiptTable
  from "../components/goodsReceipt/GoodsReceiptTable";

import GoodsReceiptPagination
  from "../components/goodsReceipt/GoodsReceiptPagination";

import ViewGoodsReceiptModal
  from "../components/goodsReceipt/ViewGoodsReceiptModal";

import SelectDispatchModal
  from "../components/goodsReceipt/SelectDispatchModal";

import GoodsReceiptStepIndicator
  from "../components/goodsReceipt/GoodsReceiptStepIndicator";

import GoodsReceiptStep1
  from "../components/goodsReceipt/GoodsReceiptStep1";

import GoodsReceiptStep2
  from "../components/goodsReceipt/GoodsReceiptStep2";

import GoodsReceiptStep3
  from "../components/goodsReceipt/GoodsReceiptStep3";

import GoodsReceiptStep4
  from "../components/goodsReceipt/GoodsReceiptStep4";


const GoodsReceipts = () => {

  // =====================================================
  // GRN LIST
  // =====================================================

  const [searchParams] = useSearchParams();
  const dispatchIdFromUrl = searchParams.get("dispatchId");

  const [goodsReceipts, setGoodsReceipts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [receiptType, setReceiptType] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

  const [pages, setPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);


  // =====================================================
  // VIEW GRN
  // =====================================================

  const [selectedGRN, setSelectedGRN] =
    useState(null);


  // =====================================================
  // CREATE GRN WIZARD
  // =====================================================

  const [showDispatchSelector, setShowDispatchSelector] =
    useState(false);

  const [selectedDispatch, setSelectedDispatch] =
    useState(null);

  const [currentStep, setCurrentStep] =
    useState(1);

  const [verifiedReceipt, setVerifiedReceipt] =
    useState(null);

  const [receiptDetails, setReceiptDetails] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);


  // =====================================================
  // LOAD GRNs
  // =====================================================

  const loadGoodsReceipts = async () => {

    try {

      setLoading(true);

      const response =
        await getAllGoodsReceipts(
          page,
          limit,
          search,
          status,
          receiptType
        );

      setGoodsReceipts(
        response.data || []
      );

      setPages(
        response.pagination?.totalPages || 1
      );

      setTotal(
        response.pagination?.total || 0
      );

    } catch (error) {

      console.error(
        "Goods Receipt Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadGoodsReceipts();

  }, [
    page,
    search,
    status,
    receiptType,
  ]);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    await loadGoodsReceipts();

  };


  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {

    setSearch("");

    setStatus("");

    setReceiptType("");

    setPage(1);

  };


  // =====================================================
  // VIEW GRN
  // =====================================================

  const handleView = (grn) => {

    setSelectedGRN(grn);

  };


  // =====================================================
  // START CREATE GRN
  // =====================================================

  const handleCreateGRN = () => {

    setCurrentStep(1);

    setSelectedDispatch(null);

    setVerifiedReceipt(null);

    setReceiptDetails(null);

    setSubmitting(false);

    setShowDispatchSelector(true);

  };


  // =====================================================
  // SELECT DISPATCH
  // =====================================================

  const handleSelectDispatch = (
    dispatch
  ) => {

    console.log(
      "Selected delivered dispatch:",
      dispatch
    );

    setSelectedDispatch(
      dispatch
    );

    setShowDispatchSelector(false);

    setCurrentStep(1);

  };

  // =====================================================
  // AUTO SELECT DISPATCH FROM URL (NOTIFICATIONS)
  // =====================================================

  useEffect(() => {
    if (dispatchIdFromUrl) {
      getEligibleDispatches()
        .then((response) => {
          const list = response?.data || [];
          const match = list.find((d) => String(d._id) === String(dispatchIdFromUrl));
          if (match) {
            handleSelectDispatch(match);
          } else {
            setShowDispatchSelector(true);
          }
        })
        .catch((err) => {
          console.error("Could not load dispatch from URL:", err);
        });
    }
  }, [dispatchIdFromUrl]);


  // =====================================================
  // OPEN DISPATCH SELECTOR
  // =====================================================

  const handleOpenDispatchSelector = () => {

    setShowDispatchSelector(true);

  };


  // =====================================================
  // STEP 1 → STEP 2
  // =====================================================

  const handleStep1Next = () => {

    if (!selectedDispatch) {
      return;
    }

    setCurrentStep(2);

  };


  // =====================================================
  // STEP 2 → STEP 3
  // =====================================================

  const handleStep2Next = (
    receiptData
  ) => {

    console.log(
      "Verified receipt data:",
      receiptData
    );

    setVerifiedReceipt(
      receiptData
    );

    setCurrentStep(3);

  };


  // =====================================================
  // STEP 2 BACK
  // =====================================================

  const handleStep2Back = () => {

    setCurrentStep(1);

  };


  // =====================================================
  // STEP 3 → STEP 4
  // =====================================================

  const handleStep3Next = (
    details
  ) => {

    console.log(
      "Receipt details:",
      details
    );

    setReceiptDetails(
      details
    );

    setCurrentStep(4);

  };


  // =====================================================
  // STEP 3 BACK
  // =====================================================

  const handleStep3Back = () => {

    setCurrentStep(2);

  };


  // =====================================================
  // STEP 4 BACK
  // =====================================================

  const handleStep4Back = () => {

    setCurrentStep(3);

  };


  // =====================================================
  // HELPER
  // GET REPLACEMENT ITEM
  // =====================================================

  const getReplacementItem = (
    dispatch
  ) => {

    if (!dispatch?.items) {
      return null;
    }

    return dispatch.items.find(
      (item) =>
        item?.isReplacement === true
    ) || null;

  };


  // =====================================================
  // HELPER
  // CHECK REPLACEMENT DISPATCH
  // =====================================================

  const isReplacementDispatch = (
    dispatch
  ) => {

    if (!dispatch) {
      return false;
    }

    if (
      dispatch.dispatchType ===
      "Replacement"
    ) {
      return true;
    }

    return Boolean(
      dispatch.items?.some(
        (item) =>
          item?.isReplacement === true
      )
    );

  };


  // =====================================================
  // STEP 4 SUBMIT
  // =====================================================

  const handleSubmitGRN = async () => {

    if (
      submitting ||
      !selectedDispatch ||
      !verifiedReceipt ||
      !receiptDetails
    ) {
      return;
    }


    try {

      setSubmitting(true);


      // =================================================
      // DETECT REPLACEMENT DISPATCH
      // =================================================

      const replacementDispatch =
        isReplacementDispatch(
          selectedDispatch
        );


      // =================================================
      // GET REPLACEMENT ITEM
      // =================================================

      const replacementItem =
        getReplacementItem(
          selectedDispatch
        );


      // =================================================
      // GET REPLACEMENT REQUEST ID
      // =================================================

      const replacementRequestId =
        replacementItem?.replacementRequest?._id ||
        replacementItem?.replacementRequest ||
        null;


      // =================================================
      // DETERMINE RECEIPT TYPE
      // =================================================

      const finalReceiptType =
        replacementDispatch
          ? "Replacement"
          : (
              receiptDetails?.receiptType ||
              "Normal"
            );


      // =================================================
      // VALIDATE REPLACEMENT REQUEST
      // =================================================

      if (
        replacementDispatch &&
        !replacementRequestId
      ) {

        throw new Error(
          "Replacement Request ID could not be identified from the selected replacement dispatch."
        );

      }


      // =================================================
      // BUILD FINAL GRN PAYLOAD
      // =================================================

      const payload = {

        purchaseOrder:
          selectedDispatch?.purchaseOrder?._id ||
          selectedDispatch?.purchaseOrder ||
          null,

        dispatch:
          selectedDispatch?._id ||
          null,

        vendor:
          selectedDispatch?.vendor?._id ||
          selectedDispatch?.vendor ||
          null,

        receiptDate:
          receiptDetails.receiptDate,

        receivedBy:
          receiptDetails.receivedBy,

        department:
          receiptDetails.department,

        status:
          "Received",

        receiptType:
          finalReceiptType,

        replacementRequest:
          replacementDispatch
            ? replacementRequestId
            : null,

        items:
          verifiedReceipt.items,

        documents:
          receiptDetails.documents || [],

        remarks:
          receiptDetails.remarks || "",

      };


      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "======================================"
      );

      console.log(
        "CREATING GOODS RECEIPT"
      );

      console.log(
        "DISPATCH NUMBER:",
        selectedDispatch?.dispatchNumber
      );

      console.log(
        "DISPATCH TYPE:",
        selectedDispatch?.dispatchType
      );

      console.log(
        "IS REPLACEMENT:",
        replacementDispatch
      );

      console.log(
        "REPLACEMENT ITEM:",
        replacementItem
      );

      console.log(
        "REPLACEMENT REQUEST:",
        replacementRequestId
      );

      console.log(
        "GRN PAYLOAD:",
        payload
      );

      console.log(
        "======================================"
      );


      // =================================================
      // CALL BACKEND
      // =================================================

      const response =
        await createGoodsReceipt(
          payload
        );


      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "======================================"
      );

      console.log(
        "GOODS RECEIPT CREATED"
      );

      console.log(
        response
      );

      console.log(
        "======================================"
      );


      // =================================================
      // RESET WIZARD
      // =================================================

      setSelectedDispatch(null);

      setVerifiedReceipt(null);

      setReceiptDetails(null);

      setCurrentStep(1);

      setShowDispatchSelector(false);


      // =================================================
      // REFRESH GRN LIST
      // =================================================

      await loadGoodsReceipts();


      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      alert(
        response?.message ||
        (
          replacementDispatch
            ? "Replacement Goods Receipt created successfully."
            : "Goods Receipt created successfully."
        )
      );


    } catch (error) {

      console.error(
        "Create Goods Receipt Error:",
        error
      );


      // =================================================
      // BACKEND ERROR
      // =================================================

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create Goods Receipt.";


      alert(
        message
      );


    } finally {

      setSubmitting(false);

    }

  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancelCreate = () => {

    if (submitting) {
      return;
    }

    setSelectedDispatch(null);

    setVerifiedReceipt(null);

    setReceiptDetails(null);

    setShowDispatchSelector(false);

    setCurrentStep(1);

  };


  // =====================================================
  // BACK TO LIST
  // =====================================================

  const handleBackToList = () => {

    handleCancelCreate();

  };


  // =====================================================
  // CREATE GRN WIZARD
  // =====================================================

  if (selectedDispatch) {

    return (

      <Layout>

        <div className="space-y-6">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

            <div>

              <h1 className="text-3xl font-bold text-slate-800">

                Create Goods Receipt (GRN)

              </h1>

              <p className="mt-1 text-sm text-slate-500">

                Record and verify material receipt
                against a delivered dispatch.

              </p>

            </div>


            <button
              type="button"
              onClick={handleBackToList}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >

              <ArrowLeft size={18} />

              Back to Goods Receipts

            </button>

          </div>


          {/* =================================================
              STEP INDICATOR
          ================================================= */}

          <GoodsReceiptStepIndicator
            currentStep={currentStep}
          />


          {/* =================================================
              STEP 1
          ================================================= */}

          {currentStep === 1 && (

            <GoodsReceiptStep1

              dispatch={
                selectedDispatch
              }

              onOpenDispatchSelector={
                handleOpenDispatchSelector
              }

              onNext={
                handleStep1Next
              }

              onCancel={
                handleCancelCreate
              }

            />

          )}


          {/* =================================================
              STEP 2
          ================================================= */}

          {currentStep === 2 && (

            <GoodsReceiptStep2

              dispatch={
                selectedDispatch
              }

              onBack={
                handleStep2Back
              }

              onNext={
                handleStep2Next
              }

              onCancel={
                handleCancelCreate
              }

            />

          )}


          {/* =================================================
              STEP 3
          ================================================= */}

          {currentStep === 3 && (

            <GoodsReceiptStep3

              dispatch={
                selectedDispatch
              }

              verifiedReceipt={
                verifiedReceipt
              }

              onBack={
                handleStep3Back
              }

              onNext={
                handleStep3Next
              }

              onCancel={
                handleCancelCreate
              }

            />

          )}


          {/* =================================================
              STEP 4
          ================================================= */}

          {currentStep === 4 && (

            <GoodsReceiptStep4

              dispatch={
                selectedDispatch
              }

              verifiedReceipt={
                verifiedReceipt
              }

              receiptDetails={
                receiptDetails
              }

              onBack={
                handleStep4Back
              }

              onSubmit={
                handleSubmitGRN
              }

              onCancel={
                handleCancelCreate
              }

              submitting={
                submitting
              }

            />

          )}

        </div>


        {/* =================================================
            DISPATCH SELECTOR
        ================================================= */}

        {showDispatchSelector && (

          <SelectDispatchModal

            onClose={() =>
              setShowDispatchSelector(false)
            }

            onSelect={
              handleSelectDispatch
            }

          />

        )}

      </Layout>

    );

  }


  // =====================================================
  // NORMAL GRN LIST
  // =====================================================

  return (

    <Layout>

      <div className="space-y-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">

              Goods Receipt

            </h1>

            <p className="mt-1 text-sm text-slate-500">

              Manage material receipts, GRNs
              and receiving records.

            </p>

          </div>


          <div className="flex gap-3">


            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >

              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>


            {/* CREATE */}

            <button
              type="button"
              onClick={handleCreateGRN}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
            >

              <Plus size={18} />

              Create GRN

            </button>

          </div>

        </div>


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <GoodsReceiptDashboardCards />


        {/* =================================================
            FILTERS
        ================================================= */}

        <GoodsReceiptFilters

          search={search}

          status={status}

          receiptType={receiptType}

          onSearchChange={(value) => {

            setSearch(value);

            setPage(1);

          }}

          onStatusChange={(value) => {

            setStatus(value);

            setPage(1);

          }}

          onReceiptTypeChange={(value) => {

            setReceiptType(value);

            setPage(1);

          }}

          onReset={
            handleResetFilters
          }

        />


        {/* =================================================
            TABLE
        ================================================= */}

        <GoodsReceiptTable

          goodsReceipts={
            goodsReceipts
          }

          loading={loading}

          onView={
            handleView
          }

        />


        {/* =================================================
            PAGINATION
        ================================================= */}

        <GoodsReceiptPagination

          page={page}

          pages={pages}

          total={total}

          onPrevious={() => {

            if (page > 1) {

              setPage(
                (currentPage) =>
                  currentPage - 1
              );

            }

          }}

          onNext={() => {

            if (page < pages) {

              setPage(
                (currentPage) =>
                  currentPage + 1
              );

            }

          }}

        />

      </div>


      {/* =================================================
          VIEW GRN
      ================================================= */}

      {selectedGRN && (

        <ViewGoodsReceiptModal

          grn={
            selectedGRN
          }

          onClose={() =>
            setSelectedGRN(null)
          }

        />

      )}


      {/* =================================================
          DISPATCH SELECTOR
      ================================================= */}

      {showDispatchSelector && (

        <SelectDispatchModal

          onClose={() =>
            setShowDispatchSelector(false)
          }

          onSelect={
            handleSelectDispatch
          }

        />

      )}

    </Layout>

  );

};


export default GoodsReceipts;