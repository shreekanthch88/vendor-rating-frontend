import { useEffect, useState } from "react";

import {
  X,
  Loader2,
  Truck,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

import {
  getEligibleDispatches,
} from "../../services/goodsReceiptService";


const CreateGoodsReceiptModal = ({
  onClose,
  onSelectDispatch,
}) => {

  const [dispatches, setDispatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedDispatch, setSelectedDispatch] =
    useState(null);


  // =====================================================
  // LOAD ELIGIBLE DISPATCHES
  // =====================================================

  useEffect(() => {

    const loadEligibleDispatches = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getEligibleDispatches();

        setDispatches(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Eligible Dispatch Error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load eligible dispatches."
        );

      } finally {

        setLoading(false);

      }

    };

    loadEligibleDispatches();

  }, []);


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
  // SELECT DISPATCH
  // =====================================================

  const handleSelectDispatch = () => {

    if (!selectedDispatch) {
      return;
    }

    onSelectDispatch(
      selectedDispatch
    );

  };


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Create Goods Receipt

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Select a delivered dispatch to create
              a Goods Receipt.

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >

            <X size={20} />

          </button>

        </div>


        {/* =================================================
            BODY
        ================================================= */}

        <div className="flex-1 overflow-y-auto p-6">


          {/* LOADING */}

          {loading && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-slate-500">

                <Loader2
                  size={22}
                  className="animate-spin"
                />

                Loading eligible dispatches...

              </div>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">

              {error}

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            dispatches.length === 0 && (

              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                <PackageCheck
                  size={48}
                  className="text-slate-300"
                />

                <h3 className="mt-4 text-lg font-semibold text-slate-700">

                  No Eligible Dispatches

                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">

                  There are currently no delivered dispatches
                  available for Goods Receipt.

                </p>

              </div>

            )}


          {/* DISPATCH LIST */}

          {!loading &&
            !error &&
            dispatches.length > 0 && (

              <div className="space-y-4">

                {dispatches.map(
                  (dispatch) => {

                    const isSelected =
                      selectedDispatch?._id ===
                      dispatch._id;


                    return (

                      <button
                        key={dispatch._id}
                        type="button"
                        onClick={() =>
                          setSelectedDispatch(
                            dispatch
                          )
                        }
                        className={`
                          w-full
                          rounded-2xl
                          border
                          p-5
                          text-left
                          transition
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                          }
                        `}
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                          {/* LEFT */}

                          <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                              <Truck size={24} />

                            </div>


                            <div>

                              <div className="flex flex-wrap items-center gap-3">

                                <h3 className="font-bold text-slate-800">

                                  {
                                    dispatch.dispatchNumber ||
                                    "-"
                                  }

                                </h3>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                                  {dispatch.status}

                                </span>

                              </div>


                              <p className="mt-1 text-sm text-slate-500">

                                PO:

                                <span className="ml-1 font-medium text-slate-700">

                                  {
                                    dispatch.purchaseOrder
                                      ?.poNumber ||
                                    "-"
                                  }

                                </span>

                              </p>


                              <p className="mt-1 text-sm text-slate-500">

                                Vendor:

                                <span className="ml-1 font-medium text-slate-700">

                                  {
                                    dispatch.vendor
                                      ?.vendorName ||
                                    "-"
                                  }

                                </span>

                              </p>

                            </div>

                          </div>


                          {/* RIGHT */}

                          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">


                            <div>

                              <p className="text-xs text-slate-500">
                                Dispatch Date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">

                                {
                                  formatDate(
                                    dispatch.dispatchDate
                                  )
                                }

                              </p>

                            </div>


                            <div>

                              <p className="text-xs text-slate-500">
                                Expected Delivery
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">

                                {
                                  formatDate(
                                    dispatch.expectedDeliveryDate
                                  )
                                }

                              </p>

                            </div>


                            <div>

                              <p className="text-xs text-slate-500">
                                Dispatch Type
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">

                                {
                                  dispatch.dispatchType ||
                                  "-"
                                }

                              </p>

                            </div>

                          </div>

                        </div>


                        {/* MATERIAL SUMMARY */}

                        <div className="mt-5 border-t border-slate-200 pt-4">

                          <div className="flex flex-wrap gap-4">

                            {(dispatch.items || []).map(
                              (item) => (

                                <div
                                  key={
                                    item._id
                                  }
                                  className="rounded-xl bg-slate-50 px-4 py-3"
                                >

                                  <p className="text-sm font-semibold text-slate-800">

                                    {
                                      item.materialName ||
                                      "-"
                                    }

                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">

                                    Dispatched:

                                    <span className="ml-1 font-semibold text-slate-700">

                                      {
                                        item.dispatchQuantity ??
                                        0
                                      }

                                      {" "}

                                      {
                                        item.unitOfMeasure ||
                                        ""
                                      }

                                    </span>

                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </button>

                    );

                  }
                )}

              </div>

            )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >

            Cancel

          </button>


          <button
            type="button"
            disabled={!selectedDispatch}
            onClick={handleSelectDispatch}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            Continue

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>

  );

};


export default CreateGoodsReceiptModal;