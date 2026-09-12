import { Eye } from "lucide-react";

import GoodsReceiptStatusBadge
  from "./GoodsReceiptStatusBadge";


const GoodsReceiptTable = ({
  goodsReceipts = [],
  loading = false,
  onView,
}) => {

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );

  };


  // =====================================================
  // TOTAL RECEIVED QUANTITY
  // =====================================================

  const getTotalReceivedQuantity = (grn) => {

    return (grn.items || []).reduce(
      (total, item) =>
        total +
        Number(
          item.receivedQuantity || 0
        ),
      0
    );

  };


  return (

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                GRN Number
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                PO Number
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Vendor
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                Dispatch
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                Receipt Date
              </th>

              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">
                Received Qty
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>

            </tr>

          </thead>


          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>

            {/* LOADING */}

            {loading && (

              <tr>

                <td
                  colSpan={8}
                  className="py-16 text-center text-slate-500"
                >

                  Loading Goods Receipts...

                </td>

              </tr>

            )}


            {/* EMPTY */}

            {!loading &&
              goodsReceipts.length === 0 && (

                <tr>

                  <td
                    colSpan={8}
                    className="py-16 text-center text-slate-500"
                  >

                    No Goods Receipts Found.

                  </td>

                </tr>

              )}


            {/* DATA */}

            {!loading &&
              goodsReceipts.length > 0 &&
              goodsReceipts.map(
                (grn) => (

                  <tr
                    key={grn._id}
                    className="border-t transition hover:bg-slate-50"
                  >

                    {/* GRN NUMBER */}

                    <td className="px-4 py-4 font-semibold text-slate-800">

                      {grn.grnNumber || "-"}

                    </td>


                    {/* PO NUMBER */}

                    <td className="px-4 py-4 text-slate-700">

                      {
                        grn.purchaseOrder
                          ?.poNumber || "-"
                      }

                    </td>


                    {/* VENDOR */}

                    <td className="px-4 py-4">

                      <p className="font-medium text-slate-800">

                        {
                          grn.vendor
                            ?.vendorName || "-"
                        }

                      </p>

                      <p className="text-xs text-slate-500">

                        {
                          grn.vendor
                            ?.vendorCode || ""
                        }

                      </p>

                    </td>


                    {/* DISPATCH */}

                    <td className="px-4 py-4 text-slate-700">

                      {
                        grn.dispatch
                          ?.dispatchNumber || "-"
                      }

                    </td>


                    {/* RECEIPT DATE */}

                    <td className="px-4 py-4 text-center text-slate-700">

                      {
                        formatDate(
                          grn.receiptDate
                        )
                      }

                    </td>


                    {/* RECEIVED QUANTITY */}

                    <td className="px-4 py-4 text-right font-semibold text-slate-800">

                      {
                        getTotalReceivedQuantity(
                          grn
                        )
                      }

                    </td>


                    {/* STATUS */}

                    <td className="px-4 py-4 text-center">

                      <GoodsReceiptStatusBadge
                        status={grn.status}
                      />

                    </td>


                    {/* ACTIONS */}

                    <td className="px-4 py-4 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          onView?.(grn)
                        }
                        title="View Goods Receipt"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >

                        <Eye size={17} />

                      </button>

                    </td>

                  </tr>

                )
              )}

          </tbody>

        </table>

      </div>

    </div>

  );

};


export default GoodsReceiptTable;