import {
  CalendarDays,
  Truck,
  Search,
  ChevronDown,
} from "lucide-react";

const GoodsReceiptStep1 = ({
  dispatch,
  onOpenDispatchSelector,
  onNext,
  onCancel,
}) => {

  if (!dispatch) {
    return null;
  }


  // =====================================================
  // DATE FORMAT
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
  // TOTALS
  // =====================================================

  const orderedQuantity =
    (dispatch.purchaseOrder?.items || [])
      .reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      );

  const dispatchedQuantity =
    (dispatch.items || [])
      .reduce(
        (total, item) =>
          total +
          Number(
            item.dispatchQuantity || 0
          ),
        0
      );

  const previouslyReceivedQuantity =
    (dispatch.items || [])
      .reduce(
        (total, item) =>
          total +
          Number(
            item.previouslyReceivedQuantity ||
              0
          ),
        0
      );

  const remainingQuantity =
    Math.max(
      orderedQuantity -
        previouslyReceivedQuantity -
        dispatchedQuantity,
      0
    );

  const canReceive =
    Math.max(
      dispatchedQuantity,
      0
    );


  return (
    <div className="space-y-6">

      {/* =================================================
          SELECT DELIVERY
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Select Delivered Dispatch / Delivery
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose the delivered dispatch against which
            you want to create Goods Receipt.
          </p>

        </div>


        {/* =================================================
            DELIVERY SELECTION
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* PO */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              PO Number
            </label>

            <button
              type="button"
              onClick={onOpenDispatchSelector}
              className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left transition hover:border-blue-400"
            >

              <span className="font-medium text-slate-800">
                {
                  dispatch.purchaseOrder
                    ?.poNumber || "-"
                }
              </span>

              <ChevronDown
                size={18}
                className="text-slate-400"
              />

            </button>

          </div>


          {/* VENDOR */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vendor
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

              <span className="font-medium text-slate-800">

                {
                  dispatch.vendor
                    ?.vendorName || "-"
                }

              </span>

            </div>

          </div>


          {/* DISPATCH NUMBER */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Dispatch Number
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

              <span className="font-medium text-blue-600">

                {
                  dispatch.dispatchNumber ||
                  "-"
                }

              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            DELIVERY DETAILS
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* DISPATCH DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Dispatch Date
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700">

                {
                  formatDate(
                    dispatch.dispatchDate
                  )
                }

              </div>

            </div>

          </div>


          {/* EXPECTED DELIVERY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Expected Delivery Date
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700">

                {
                  formatDate(
                    dispatch.expectedDeliveryDate
                  )
                }

              </div>

            </div>

          </div>


          {/* ACTUAL DELIVERY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Actual Delivery Date
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700">

                {
                  formatDate(
                    dispatch.updatedAt
                  )
                }

              </div>

            </div>

          </div>


          {/* LR */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              LR / Tracking No.
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">

              {
                dispatch.lrNumber ||
                dispatch.trackingNumber ||
                "-"
              }

            </div>

          </div>

        </div>


        {/* =================================================
            DELIVERY STATUS
        ================================================= */}

        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Delivery Status
          </label>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

            <span className="h-2 w-2 rounded-full bg-green-500" />

            Delivered

          </div>

        </div>

      </div>


      {/* =================================================
          DISPATCH SUMMARY
      ================================================= */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

            <Truck size={20} />

          </div>

          <div>

            <h3 className="font-semibold text-slate-800">
              Dispatch Summary
            </h3>

            <p className="text-sm text-slate-500">
              Quantity summary for the selected delivery.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">


          {/* PO ORDERED */}

          <div>

            <p className="text-xs text-slate-500">
              PO Ordered Qty
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">

              {orderedQuantity.toLocaleString()}

            </p>

          </div>


          {/* DISPATCHED */}

          <div>

            <p className="text-xs text-slate-500">
              Total Dispatched Qty
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">

              {dispatchedQuantity.toLocaleString()}

            </p>

          </div>


          {/* PREVIOUSLY RECEIVED */}

          <div>

            <p className="text-xs text-slate-500">
              Previously Received Qty
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">

              {previouslyReceivedQuantity.toLocaleString()}

            </p>

          </div>


          {/* REMAINING */}

          <div>

            <p className="text-xs text-slate-500">
              Remaining to Receive
            </p>

            <p className="mt-1 text-xl font-bold text-orange-600">

              {remainingQuantity.toLocaleString()}

            </p>

          </div>


          {/* MAX */}

          <div>

            <p className="text-xs text-slate-500">
              You Can Receive (Max)
            </p>

            <p className="mt-1 text-xl font-bold text-green-600">

              {canReceive.toLocaleString()}

            </p>

          </div>

        </div>

      </div>


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


        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-blue-600 px-7 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default GoodsReceiptStep1;