import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

import {
  getGoodsReceiptById,
} from "../../services/goodsReceiptService";

const ViewGoodsReceiptModal = ({
  grn,
  onClose,
}) => {

  const [goodsReceipt, setGoodsReceipt] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD GRN DETAILS
  // =====================================================

  useEffect(() => {

    const loadGoodsReceipt = async () => {

      if (!grn?._id) {
        return;
      }

      try {

        setLoading(true);
        setError("");

        const response =
          await getGoodsReceiptById(
            grn._id
          );

        setGoodsReceipt(
          response.data
        );

      } catch (error) {

        console.error(
          "GRN Details Error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load Goods Receipt details."
        );

      } finally {

        setLoading(false);

      }

    };

    loadGoodsReceipt();

  }, [grn]);


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
  // CLOSE
  // =====================================================

  const handleClose = () => {

    if (!loading) {
      onClose();
    }

  };


  if (!grn) {
    return null;
  }


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Goods Receipt Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {grn.grnNumber || "GRN Details"}
            </p>

          </div>


          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>

        </div>


        {/* =================================================
            BODY
        ================================================= */}

        <div className="max-h-[calc(90vh-85px)] overflow-y-auto p-6">


          {/* LOADING */}

          {loading && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-slate-500">

                <Loader2
                  size={22}
                  className="animate-spin"
                />

                Loading Goods Receipt...

              </div>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">

              {error}

            </div>

          )}


          {/* DATA */}

          {!loading &&
            !error &&
            goodsReceipt && (

              <div className="space-y-6">


                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div>

                  <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Receipt Information
                  </h3>


                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        GRN Number
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {goodsReceipt.grnNumber || "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Receipt Date
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {formatDate(
                          goodsReceipt.receiptDate
                        )}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {goodsReceipt.status || "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Receipt Type
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {goodsReceipt.receiptType || "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Department
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {goodsReceipt.department || "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Received By
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {
                          goodsReceipt.receivedBy?.name ||
                          "-"
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    PURCHASE ORDER / VENDOR / DISPATCH
                ================================================= */}

                <div>

                  <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Source Information
                  </h3>


                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


                    <div className="rounded-xl border border-slate-200 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Purchase Order
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {
                          goodsReceipt.purchaseOrder?.poNumber ||
                          "-"
                        }
                      </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Vendor
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {
                          goodsReceipt.vendor?.vendorName ||
                          "-"
                        }
                      </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Dispatch
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {
                          goodsReceipt.dispatch?.dispatchNumber ||
                          "-"
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    ITEMS
                ================================================= */}

                <div>

                  <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Received Items
                  </h3>


                  <div className="overflow-x-auto rounded-xl border border-slate-200">

                    <table className="min-w-full">

                      <thead className="bg-slate-100">

                        <tr>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                            Material
                          </th>

                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                            Ordered
                          </th>

                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                            Dispatched
                          </th>

                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                            Received
                          </th>

                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                            Short
                          </th>

                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                            Damage
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {(goodsReceipt.items || []).map(
                          (item) => (

                            <tr
                              key={item._id}
                              className="border-t border-slate-200"
                            >

                              <td className="px-4 py-3">

                                <p className="font-medium text-slate-800">
                                  {item.materialName || "-"}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {item.materialCode || "-"}
                                </p>

                              </td>

                              <td className="px-4 py-3 text-right">
                                {item.orderedQuantity ?? 0}
                              </td>

                              <td className="px-4 py-3 text-right">
                                {item.dispatchedQuantity ?? 0}
                              </td>

                              <td className="px-4 py-3 text-right font-semibold text-green-700">
                                {item.receivedQuantity ?? 0}
                              </td>

                              <td className="px-4 py-3 text-right">
                                {item.shortQuantity ?? 0}
                              </td>

                              <td className="px-4 py-3 text-right">
                                {item.damageQuantity ?? 0}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>


                {/* =================================================
                    REMARKS
                ================================================= */}

                <div>

                  <h3 className="mb-3 text-lg font-semibold text-slate-800">
                    Remarks
                  </h3>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">

                    {
                      goodsReceipt.remarks ||
                      "No remarks provided."
                    }

                  </div>

                </div>


                {/* =================================================
                    QUALITY INSPECTION
                ================================================= */}

                <div>

                  <h3 className="mb-3 text-lg font-semibold text-slate-800">
                    Quality Inspection
                  </h3>

                  <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">

                    {goodsReceipt.qualityInspection
                      ? "Quality inspection linked."
                      : "Quality inspection pending."}

                  </div>

                </div>

              </div>

            )}

        </div>

      </div>

    </div>

  );
};

export default ViewGoodsReceiptModal;