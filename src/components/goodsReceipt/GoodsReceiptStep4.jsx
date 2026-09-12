import {
  CheckCircle2,
  PackageCheck,
  Truck,
  User,
  Building2,
  CalendarDays,
  FileText,
  AlertTriangle,
} from "lucide-react";

const GoodsReceiptStep4 = ({
  dispatch,
  verifiedReceipt,
  receiptDetails,
  onBack,
  onSubmit,
  onCancel,
  submitting = false,
}) => {

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // VERIFIED ITEMS
  // =====================================================

  const items =
    verifiedReceipt?.items || [];


  // =====================================================
  // SUMMARY
  // =====================================================

  const summary =
    verifiedReceipt?.receiptSummary || {
      dispatched: 0,
      received: 0,
      short: 0,
      damaged: 0,
    };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = () => {

    if (submitting) {
      return;
    }

    onSubmit();

  };


  return (
    <div className="space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

            <CheckCircle2 size={23} />

          </div>

          <div>

            <h2 className="text-lg font-semibold text-slate-800">
              Review & Submit Goods Receipt
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review all receipt information before creating
              the Goods Receipt Note.
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          SOURCE INFORMATION
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

            <Truck size={20} />

          </div>

          <div>

            <h3 className="font-semibold text-slate-800">
              Delivery Information
            </h3>

            <p className="text-sm text-slate-500">
              Source of this Goods Receipt.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* PO */}

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Purchase Order
            </p>

            <p className="mt-1 font-semibold text-slate-800">

              {
                dispatch?.purchaseOrder
                  ?.poNumber || "-"
              }

            </p>

          </div>


          {/* DISPATCH */}

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Dispatch Number
            </p>

            <p className="mt-1 font-semibold text-blue-600">

              {
                dispatch?.dispatchNumber || "-"
              }

            </p>

          </div>


          {/* VENDOR */}

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Vendor
            </p>

            <p className="mt-1 font-semibold text-slate-800">

              {
                dispatch?.vendor
                  ?.vendorName || "-"
              }

            </p>

          </div>


          {/* STATUS */}

          <div className="rounded-xl bg-green-50 p-4">

            <p className="text-xs text-slate-500">
              Delivery Status
            </p>

            <p className="mt-1 font-semibold text-green-700">
              Delivered
            </p>

          </div>

        </div>


        {/* DATES */}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

            <CalendarDays
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                Dispatch Date
              </p>

              <p className="text-sm font-medium text-slate-700">

                {
                  formatDate(
                    dispatch?.dispatchDate
                  )
                }

              </p>

            </div>

          </div>


          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

            <CalendarDays
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                Expected Delivery
              </p>

              <p className="text-sm font-medium text-slate-700">

                {
                  formatDate(
                    dispatch?.expectedDeliveryDate
                  )
                }

              </p>

            </div>

          </div>


          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

            <Truck
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                LR / Tracking
              </p>

              <p className="text-sm font-medium text-slate-700">

                {
                  dispatch?.lrNumber ||
                  dispatch?.trackingNumber ||
                  "-"
                }

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          RECEIPT DETAILS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h3 className="font-semibold text-slate-800">
            Receipt Details
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Information entered by the receiving team.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

            <CalendarDays
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                Receipt Date
              </p>

              <p className="text-sm font-semibold text-slate-700">

                {
                  receiptDetails?.receiptDate ||
                  "-"
                }

              </p>

            </div>

          </div>


          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

            <User
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                Received By
              </p>

              <p className="text-sm font-semibold text-slate-700">

                {
                  receiptDetails?.receivedBy ||
                  "-"
                }

              </p>

            </div>

          </div>


          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

            <Building2
              size={18}
              className="text-slate-400"
            />

            <div>

              <p className="text-xs text-slate-500">
                Department
              </p>

              <p className="text-sm font-semibold text-slate-700">

                {
                  receiptDetails?.department ||
                  "-"
                }

              </p>

            </div>

          </div>


          <div className="rounded-xl bg-blue-50 p-4">

            <p className="text-xs text-slate-500">
              Receipt Type
            </p>

            <p className="mt-1 text-sm font-semibold text-blue-700">

              {
                receiptDetails?.receiptType ||
                "-"
              }

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          ITEM VERIFICATION
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

              <PackageCheck size={20} />

            </div>

            <div>

              <h3 className="font-semibold text-slate-800">
                Verified Material Quantities
              </h3>

              <p className="text-sm text-slate-500">
                Final quantities that will be recorded in the GRN.
              </p>

            </div>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[900px] w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Material
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ordered
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dispatched
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Previously Received
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Received
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Short
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Damaged
                </th>

              </tr>

            </thead>


            <tbody>

              {items.map((item, index) => (

                <tr
                  key={
                    item._id ||
                    item.material ||
                    index
                  }
                  className="border-t border-slate-200"
                >

                  <td className="px-5 py-4">

                    <p className="font-semibold text-slate-800">

                      {
                        item.materialName ||
                        "-"
                      }

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                      {
                        item.materialCode ||
                        "-"
                      }

                    </p>

                  </td>


                  <td className="px-5 py-4 text-right text-slate-700">

                    {
                      item.orderedQuantity ??
                      0
                    }

                  </td>


                  <td className="px-5 py-4 text-right font-semibold text-blue-600">

                    {
                      item.dispatchQuantity ??
                      0
                    }

                  </td>


                  <td className="px-5 py-4 text-right text-slate-700">

                    {
                      item.previouslyReceivedQuantity ??
                      0
                    }

                  </td>


                  <td className="px-5 py-4 text-right font-semibold text-green-600">

                    {
                      item.receivedQuantity ??
                      0
                    }

                  </td>


                  <td className="px-5 py-4 text-right font-semibold text-yellow-600">

                    {
                      item.shortQuantity ??
                      0
                    }

                  </td>


                  <td className="px-5 py-4 text-right font-semibold text-red-600">

                    {
                      item.damageQuantity ??
                      0
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          FINAL SUMMARY
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

          <p className="text-sm text-slate-500">
            Dispatched
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">

            {summary.dispatched}

          </p>

          <p className="text-xs text-slate-500">
            From selected dispatch
          </p>

        </div>


        <div className="rounded-xl border border-green-200 bg-green-50 p-5">

          <p className="text-sm text-slate-500">
            Accepted
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">

            {summary.received}

          </p>

          <p className="text-xs text-slate-500">
            Received quantity
          </p>

        </div>


        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm text-slate-500">
            Short
          </p>

          <p className="mt-1 text-2xl font-bold text-yellow-700">

            {summary.short}

          </p>

          <p className="text-xs text-slate-500">
            Short quantity
          </p>

        </div>


        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="text-sm text-slate-500">
            Damaged
          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">

            {summary.damaged}

          </p>

          <p className="text-xs text-slate-500">
            Damaged quantity
          </p>

        </div>

      </div>


      {/* =================================================
          REMARKS
      ================================================= */}

      {receiptDetails?.remarks && (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-3">

            <FileText
              size={20}
              className="mt-0.5 text-slate-400"
            />

            <div>

              <h3 className="font-semibold text-slate-800">
                Receipt Remarks
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">

                {receiptDetails.remarks}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          DOCUMENTS
      ================================================= */}

      {receiptDetails?.documents?.length > 0 && (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-semibold text-slate-800">
            Attached Documents
          </h3>

          <div className="mt-3 space-y-2">

            {receiptDetails.documents.map(
              (file, index) => (

                <div
                  key={index}
                  className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >

                  {file.name}

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =================================================
          FINAL WARNING
      ================================================= */}

      <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-yellow-600"
        />

        <div>

          <p className="font-semibold text-yellow-800">
            Please verify before submitting.
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            Once the Goods Receipt is created, these
            quantities become part of the official
            receipt record for this dispatch.
          </p>

        </div>

      </div>


      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            ← Back
          </button>


          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <CheckCircle2 size={18} />

            {submitting
              ? "Creating GRN..."
              : "Create Goods Receipt"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default GoodsReceiptStep4;