import { useState } from "react";

import {
  CalendarDays,
  User,
  Building2,
  FileText,
  Paperclip,
} from "lucide-react";


const GoodsReceiptStep3 = ({
  dispatch,
  verifiedReceipt,
  onBack,
  onNext,
  onCancel,
}) => {

  // =====================================================
  // DEFAULT DATE
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];


  // =====================================================
  // FORM STATE
  // =====================================================

  const [receiptDate, setReceiptDate] =
    useState(today);

  const [receivedBy, setReceivedBy] =
    useState("");

  const [department, setDepartment] =
    useState("Stores");

  const [receiptType, setReceiptType] =
    useState("Normal");

  const [remarks, setRemarks] =
    useState("");

  const [documents, setDocuments] =
    useState([]);

  const [error, setError] =
    useState("");


  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleDocuments = (event) => {

    const files =
      Array.from(
        event.target.files || []
      );

    setDocuments(files);

  };


  // =====================================================
  // VALIDATE
  // =====================================================

  const validate = () => {

    if (!receiptDate) {

      return "Receipt date is required.";

    }

    if (!receivedBy.trim()) {

      return "Received By is required.";

    }

    if (!department.trim()) {

      return "Department is required.";

    }

    if (!receiptType) {

      return "Receipt type is required.";

    }

    return "";

  };


  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {

    const validationError =
      validate();

    if (validationError) {

      setError(
        validationError
      );

      return;

    }

    setError("");

    onNext({

      receiptDate,

      receivedBy,

      department,

      receiptType,

      remarks,

      documents,

    });

  };


  return (

    <div className="space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

            <FileText size={22} />

          </div>

          <div>

            <h2 className="text-lg font-semibold text-slate-800">

              Receipt Details

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Enter the details of the physical material
              receipt.

            </p>

          </div>

        </div>


        {/* =================================================
            SOURCE SUMMARY
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Purchase Order
            </p>

            <p className="mt-1 font-semibold text-slate-800">

              {
                dispatch.purchaseOrder
                  ?.poNumber || "-"
              }

            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Dispatch Number
            </p>

            <p className="mt-1 font-semibold text-blue-600">

              {
                dispatch.dispatchNumber ||
                "-"
              }

            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Vendor
            </p>

            <p className="mt-1 font-semibold text-slate-800">

              {
                dispatch.vendor
                  ?.vendorName || "-"
              }

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          RECEIPT INFORMATION
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h3 className="text-lg font-semibold text-slate-800">

            Receipt Information

          </h3>

          <p className="mt-1 text-sm text-slate-500">

            Record who received the material and
            where it was received.

          </p>

        </div>


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


          {/* =================================================
              RECEIPT DATE
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Receipt Date
              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={receiptDate}
                onChange={(event) =>
                  setReceiptDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>


          {/* =================================================
              RECEIVED BY
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Received By
              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                value={receivedBy}
                onChange={(event) =>
                  setReceivedBy(
                    event.target.value
                  )
                }
                placeholder="Enter receiver name"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>


          {/* =================================================
              DEPARTMENT
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Department
              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <div className="relative">

              <Building2
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                value={department}
                onChange={(event) =>
                  setDepartment(
                    event.target.value
                  )
                }
                placeholder="Enter department"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>


          {/* =================================================
              RECEIPT TYPE
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Receipt Type
              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <select
              value={receiptType}
              onChange={(event) =>
                setReceiptType(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="Normal">
                Normal
              </option>

              <option value="Replacement">
                Replacement
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* =================================================
          RECEIPT SUMMARY
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-lg font-semibold text-slate-800">

          Receipt Summary

        </h3>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-blue-50 p-4">

            <p className="text-xs text-slate-500">
              Dispatched
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">

              {
                verifiedReceipt
                  ?.receiptSummary
                  ?.dispatched || 0
              }

            </p>

          </div>


          <div className="rounded-xl bg-green-50 p-4">

            <p className="text-xs text-slate-500">
              Received
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">

              {
                verifiedReceipt
                  ?.receiptSummary
                  ?.received || 0
              }

            </p>

          </div>


          <div className="rounded-xl bg-yellow-50 p-4">

            <p className="text-xs text-slate-500">
              Short
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">

              {
                verifiedReceipt
                  ?.receiptSummary
                  ?.short || 0
              }

            </p>

          </div>


          <div className="rounded-xl bg-red-50 p-4">

            <p className="text-xs text-slate-500">
              Damaged
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">

              {
                verifiedReceipt
                  ?.receiptSummary
                  ?.damaged || 0
              }

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          DOCUMENTS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

            <Paperclip size={19} />

          </div>

          <div>

            <h3 className="font-semibold text-slate-800">

              Receipt Documents

            </h3>

            <p className="text-sm text-slate-500">

              Attach delivery challan, receipt copy
              or other supporting documents.

            </p>

          </div>

        </div>


        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30">

          <Paperclip
            size={28}
            className="text-slate-400"
          />

          <p className="mt-3 text-sm font-medium text-slate-700">

            Click to attach documents

          </p>

          <p className="mt-1 text-xs text-slate-500">

            PDF, JPG, PNG or other supported documents

          </p>

          <input
            type="file"
            multiple
            className="hidden"
            onChange={
              handleDocuments
            }
          />

        </label>


        {/* FILE LIST */}

        {documents.length > 0 && (

          <div className="mt-4 space-y-2">

            {documents.map(
              (file, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                >

                  <div className="flex items-center gap-3">

                    <FileText
                      size={18}
                      className="text-slate-500"
                    />

                    <span className="text-sm text-slate-700">

                      {file.name}

                    </span>

                  </div>

                  <span className="text-xs text-slate-400">

                    {
                      (
                        file.size /
                        1024
                      ).toFixed(1)
                    } KB

                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          REMARKS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <label className="mb-2 block text-sm font-medium text-slate-700">

          Receipt Remarks

        </label>

        <textarea
          rows={4}
          value={remarks}
          onChange={(event) =>
            setRemarks(
              event.target.value
            )
          }
          placeholder="Enter any remarks related to the receipt..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          {error}

        </div>

      )}


      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </button>


          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-blue-600 px-7 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
};

export default GoodsReceiptStep3;