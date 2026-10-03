import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  ClipboardCheck,
  User2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

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

                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                            Remarks
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

                              <td className="px-4 py-3 text-sm text-slate-600">
                                {item.remarks || (
                                  <span className="text-slate-400">—</span>
                                )}
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

                  {goodsReceipt.qualityInspection &&
                  typeof goodsReceipt.qualityInspection ===
                    "object" ? (

                    (() => {
                      const qi =
                        goodsReceipt.qualityInspection;

                      // ── Result badge colours ──────────────────────
                      const resultStyles = {
                        Accepted: {
                          icon: (
                            <CheckCircle2
                              size={14}
                            />
                          ),
                          cls: "bg-green-100 text-green-700",
                        },
                        "Accepted with Damage": {
                          icon: (
                            <AlertTriangle
                              size={14}
                            />
                          ),
                          cls: "bg-amber-100 text-amber-700",
                        },
                        "Partially Accepted": {
                          icon: (
                            <AlertTriangle
                              size={14}
                            />
                          ),
                          cls: "bg-amber-100 text-amber-700",
                        },
                        "Conditional Acceptance": {
                          icon: (
                            <AlertTriangle
                              size={14}
                            />
                          ),
                          cls: "bg-amber-100 text-amber-700",
                        },
                        Hold: {
                          icon: (
                            <Clock size={14} />
                          ),
                          cls: "bg-slate-100 text-slate-600",
                        },
                        Rejected: {
                          icon: (
                            <XCircle size={14} />
                          ),
                          cls: "bg-red-100 text-red-700",
                        },
                      };

                      const result =
                        qi.overallResult ||
                        "Accepted";
                      const style =
                        resultStyles[result] ||
                        resultStyles.Accepted;

                      return (
                        <div className="rounded-xl border border-slate-200 p-5">

                          {/* Top row – number + result */}
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                            <div className="flex items-center gap-2">
                              <ClipboardCheck
                                size={18}
                                className="text-blue-600"
                              />
                              <span className="font-semibold text-blue-700">
                                {qi.inspectionNumber ||
                                  "—"}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.cls}`}
                              >
                                {style.icon}
                                {result}
                              </span>
                            </div>

                            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-xs text-slate-500">
                              {qi.status || "—"}
                            </span>

                          </div>

                          {/* Info grid */}
                          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                            <div className="flex items-start gap-2 text-sm">
                              <User2
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <div>
                                <p className="text-xs text-slate-500">
                                  Inspected By
                                </p>
                                <p className="font-medium text-slate-800">
                                  {qi.inspectedBy
                                    ?.name || "—"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                              <CalendarDays
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <div>
                                <p className="text-xs text-slate-500">
                                  Inspection Date
                                </p>
                                <p className="font-medium text-slate-800">
                                  {formatDate(
                                    qi.inspectionDate
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                              <ClipboardCheck
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <div>
                                <p className="text-xs text-slate-500">
                                  Department
                                </p>
                                <p className="font-medium text-slate-800">
                                  {qi.department ||
                                    "Quality"}
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* Quantity summary */}
                          <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center text-sm">

                            <div>
                              <p className="text-xs text-slate-500">
                                Accepted
                              </p>
                              <p className="mt-1 text-lg font-bold text-green-700">
                                {qi.totalAcceptedQuantity ??
                                  0}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Rejected
                              </p>
                              <p className="mt-1 text-lg font-bold text-red-600">
                                {qi.totalRejectedQuantity ??
                                  0}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Damaged
                              </p>
                              <p className="mt-1 text-lg font-bold text-amber-600">
                                {qi.totalDamagedQuantity ??
                                  0}
                              </p>
                            </div>

                          </div>

                          {/* Inspector remarks */}
                          {qi.remarks && (
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                              <p className="mb-1 text-xs font-medium text-slate-500">
                                Inspector Remarks
                              </p>
                              {qi.remarks}
                            </div>
                          )}

                        </div>
                      );
                    })()

                  ) : (

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      <Clock
                        size={18}
                        className="shrink-0 text-slate-400"
                      />
                      Quality inspection is pending for
                      this Goods Receipt.
                    </div>

                  )}

                </div>

              </div>

            )}

        </div>

      </div>

    </div>

  );
};

export default ViewGoodsReceiptModal;