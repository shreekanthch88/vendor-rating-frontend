import { useMemo, useState } from "react";

import {
  PackageCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";


const GoodsReceiptStep2 = ({
  dispatch,
  onBack,
  onNext,
  onCancel,
}) => {

  const [items, setItems] = useState(
    (dispatch?.items || []).map((item) => ({
      ...item,

      receivedQuantity: Number(
        item.dispatchQuantity || 0
      ),

      shortQuantity: 0,

      damageQuantity: 0,

      remarks: "",
    }))
  );


  // =====================================================
  // UPDATE ITEM
  // =====================================================

  const updateItem = (
    index,
    field,
    value
  ) => {

    setItems((currentItems) =>
      currentItems.map(
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

  };


  // =====================================================
  // ITEM VALIDATION
  // =====================================================

  const validation = useMemo(() => {

    const errors = [];

    items.forEach((item, index) => {

      const dispatched =
        Number(
          item.dispatchQuantity || 0
        );

      const received =
        Number(
          item.receivedQuantity || 0
        );

      const short =
        Number(
          item.shortQuantity || 0
        );

      const damaged =
        Number(
          item.damageQuantity || 0
        );


      // Cannot exceed dispatched quantity

      if (received > dispatched) {

        errors.push(
          `${item.materialName || `Item ${index + 1}`}: received quantity cannot exceed dispatched quantity.`
        );

      }


      // Cannot exceed dispatch when
      // all receipt conditions are combined

      if (
        received +
          short +
          damaged >
        dispatched
      ) {

        errors.push(
          `${item.materialName || `Item ${index + 1}`}: received + short + damaged cannot exceed dispatched quantity.`
        );

      }


      // Negative values

      if (
        received < 0 ||
        short < 0 ||
        damaged < 0
      ) {

        errors.push(
          `${item.materialName || `Item ${index + 1}`}: quantities cannot be negative.`
        );

      }

    });


    return errors;

  }, [items]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {

    return items.reduce(
      (result, item) => {

        result.dispatched += Number(
          item.dispatchQuantity || 0
        );

        result.received += Number(
          item.receivedQuantity || 0
        );

        result.short += Number(
          item.shortQuantity || 0
        );

        result.damaged += Number(
          item.damageQuantity || 0
        );

        return result;

      },
      {
        dispatched: 0,
        received: 0,
        short: 0,
        damaged: 0,
      }
    );

  }, [items]);


  // =====================================================
  // CONTINUE
  // =====================================================

  const handleNext = () => {

    if (validation.length > 0) {
      return;
    }

    onNext({
      ...dispatch,

      items,

      receiptSummary: summary,
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

            <PackageCheck size={22} />

          </div>

          <div>

            <h2 className="text-lg font-semibold text-slate-800">
              Verify Received Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Verify the actual quantity received against
              the selected delivery.
            </p>

          </div>

        </div>


        {/* SOURCE */}

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
                dispatch.dispatchNumber || "-"
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
          IMPORTANT BUSINESS RULE
      ================================================= */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>

          <p className="font-semibold text-blue-800">
            Receipt quantity is limited to this dispatch.
          </p>

          <p className="mt-1 text-sm text-blue-700">
            The pending quantity from the Purchase Order
            belongs to a future dispatch and cannot be
            received against this dispatch.
          </p>

        </div>

      </div>


      {/* =================================================
          ITEMS TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h3 className="font-semibold text-slate-800">
            Material Verification
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter actual received, short and damaged
            quantities.
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Material
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ordered
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  This Dispatch
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

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Remarks
                </th>

              </tr>

            </thead>


            <tbody>

              {items.map((item, index) => {

                const dispatched =
                  Number(
                    item.dispatchQuantity || 0
                  );

                const received =
                  Number(
                    item.receivedQuantity || 0
                  );

                const short =
                  Number(
                    item.shortQuantity || 0
                  );

                const damaged =
                  Number(
                    item.damageQuantity || 0
                  );

                const invalid =
                  received +
                    short +
                    damaged >
                  dispatched;

                return (

                  <tr
                    key={
                      item._id ||
                      item.material ||
                      index
                    }
                    className="border-t border-slate-200"
                  >

                    {/* MATERIAL */}

                    <td className="px-5 py-5">

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


                    {/* ORDERED */}

                    <td className="px-5 py-5 text-right">

                      <span className="font-medium text-slate-700">

                        {
                          item.orderedQuantity ??
                          0
                        }

                      </span>

                      <span className="ml-1 text-xs text-slate-400">

                        {
                          item.unitOfMeasure ||
                          ""
                        }

                      </span>

                    </td>


                    {/* THIS DISPATCH */}

                    <td className="px-5 py-5 text-right">

                      <span className="font-semibold text-blue-600">

                        {dispatched}

                      </span>

                      <span className="ml-1 text-xs text-slate-400">

                        {
                          item.unitOfMeasure ||
                          ""
                        }

                      </span>

                    </td>


                    {/* PREVIOUSLY RECEIVED */}

                    <td className="px-5 py-5 text-right">

                      <span className="font-medium text-slate-700">

                        {
                          Number(
                            item.previouslyReceivedQuantity ||
                              0
                          )
                        }

                      </span>

                    </td>


                    {/* RECEIVED */}

                    <td className="px-5 py-5">

                      <input
                        type="number"
                        min="0"
                        max={dispatched}
                        value={
                          item.receivedQuantity
                        }
                        onChange={(event) =>
                          updateItem(
                            index,
                            "receivedQuantity",
                            event.target.value
                          )
                        }
                        className={`
                          w-28
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-right
                          outline-none
                          focus:ring-2

                          ${
                            invalid
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                          }
                        `}
                      />

                    </td>


                    {/* SHORT */}

                    <td className="px-5 py-5">

                      <input
                        type="number"
                        min="0"
                        max={dispatched}
                        value={
                          item.shortQuantity
                        }
                        onChange={(event) =>
                          updateItem(
                            index,
                            "shortQuantity",
                            event.target.value
                          )
                        }
                        className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                      />

                    </td>


                    {/* DAMAGED */}

                    <td className="px-5 py-5">

                      <input
                        type="number"
                        min="0"
                        max={dispatched}
                        value={
                          item.damageQuantity
                        }
                        onChange={(event) =>
                          updateItem(
                            index,
                            "damageQuantity",
                            event.target.value
                          )
                        }
                        className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </td>


                    {/* REMARKS */}

                    <td className="px-5 py-5">

                      <input
                        type="text"
                        value={
                          item.remarks
                        }
                        onChange={(event) =>
                          updateItem(
                            index,
                            "remarks",
                            event.target.value
                          )
                        }
                        placeholder="Remarks"
                        className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          VALIDATION
      ================================================= */}

      {validation.length > 0 && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex items-start gap-3">

            <XCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>

              <p className="font-semibold text-red-800">
                Please correct the following:
              </p>

              <ul className="mt-2 list-disc pl-5 text-sm text-red-700">

                {validation.map(
                  (message, index) => (

                    <li key={index}>
                      {message}
                    </li>

                  )
                )}

              </ul>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            This Dispatch
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {summary.dispatched}
          </p>

        </div>


        <div className="rounded-xl border border-green-200 bg-green-50 p-5">

          <p className="text-sm text-slate-500">
            Accepted at Receipt
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            {summary.received}
          </p>

        </div>


        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm text-slate-500">
            Short
          </p>

          <p className="mt-1 text-2xl font-bold text-yellow-700">
            {summary.short}
          </p>

        </div>


        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="text-sm text-slate-500">
            Damaged
          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">
            {summary.damaged}
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
            disabled={
              validation.length > 0
            }
            onClick={handleNext}
            className="rounded-xl bg-blue-600 px-7 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
};

export default GoodsReceiptStep2;