import { useEffect, useState } from "react";
import {
  X,
  Search,
  CalendarDays,
  Truck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  getEligibleDispatches,
} from "../../services/goodsReceiptService";

const SelectDispatchModal = ({
  onClose,
  onSelect,
}) => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD ELIGIBLE DISPATCHES
  // =====================================================

  const loadDispatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEligibleDispatches();

      setDispatches(response.data || []);
    } catch (error) {
      console.error(
        "Eligible dispatch error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load delivered dispatches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDispatches();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredDispatches =
    dispatches.filter((dispatch) => {
      const query =
        search.trim().toLowerCase();

      const dispatchNumber =
        dispatch.dispatchNumber
          ?.toLowerCase() || "";

      const poNumber =
        dispatch.purchaseOrder?.poNumber
          ?.toLowerCase() || "";

      const vendorName =
        dispatch.vendor?.vendorName
          ?.toLowerCase() || "";

      const lrNumber =
        dispatch.lrNumber
          ?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        dispatchNumber.includes(query) ||
        poNumber.includes(query) ||
        vendorName.includes(query) ||
        lrNumber.includes(query);

      const deliveryDate =
        dispatch.updatedAt ||
        dispatch.expectedDeliveryDate;

      const formattedDate =
        deliveryDate
          ? new Date(deliveryDate)
          : null;

      const matchesFromDate =
        !fromDate ||
        (
          formattedDate &&
          formattedDate >=
            new Date(`${fromDate}T00:00:00`)
        );

      const matchesToDate =
        !toDate ||
        (
          formattedDate &&
          formattedDate <=
            new Date(`${toDate}T23:59:59`)
        );

      return (
        matchesSearch &&
        matchesFromDate &&
        matchesToDate
      );
    });

  // =====================================================
  // SELECT
  // =====================================================

  const selectedDispatch =
    dispatches.find(
      (dispatch) =>
        dispatch._id === selectedId
    );

  // =====================================================
  // CONTINUE
  // =====================================================

  const handleContinue = () => {
    if (!selectedDispatch) {
      return;
    }

    onSelect(selectedDispatch);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Select Dispatch / Delivery
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
            INFORMATION
        ================================================= */}

        <div className="px-6 pt-5">

          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">

            <Truck
              size={18}
              className="text-blue-600"
            />

            <p className="text-sm text-blue-700">
              Only delivered dispatches are shown.
              Select a dispatch to create Goods Receipt.
            </p>

          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-3">

          {/* SEARCH */}

          <div className="relative">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>

            <Search
              size={18}
              className="absolute left-3 top-[42px] text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search dispatch, LR No..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* FROM DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              From Date
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* TO DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              To Date
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="flex-1 overflow-auto px-6">

          <div className="overflow-hidden rounded-xl border border-slate-200">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="w-12 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dispatch No.
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dispatch Date
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    LR No.
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Delivered Date
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dispatched Qty
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {loading && (
                  <tr>

                    <td
                      colSpan="7"
                      className="px-4 py-16 text-center"
                    >

                      <div className="flex items-center justify-center gap-3 text-slate-500">

                        <Loader2
                          size={20}
                          className="animate-spin"
                        />

                        Loading delivered dispatches...

                      </div>

                    </td>

                  </tr>
                )}

                {/* ERROR */}

                {!loading && error && (
                  <tr>

                    <td
                      colSpan="7"
                      className="px-4 py-12 text-center text-sm text-red-600"
                    >
                      {error}
                    </td>

                  </tr>
                )}

                {/* EMPTY */}

                {!loading &&
                  !error &&
                  filteredDispatches.length ===
                    0 && (
                    <tr>

                      <td
                        colSpan="7"
                        className="px-4 py-16 text-center"
                      >

                        <Truck
                          size={40}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-600">
                          No delivered dispatches found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Only dispatches marked as
                          Delivered can be received.
                        </p>

                      </td>

                    </tr>
                  )}

                {/* DATA */}

                {!loading &&
                  !error &&
                  filteredDispatches.map(
                    (dispatch, index) => {

                      const isSelected =
                        selectedId ===
                        dispatch._id;

                      const quantity =
                        (dispatch.items || [])
                          .reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              Number(
                                item.dispatchQuantity ||
                                  0
                              ),
                            0
                          );

                      const unit =
                        dispatch.items?.[0]
                          ?.unitOfMeasure || "";

                      return (
                        <tr
                          key={
                            dispatch._id
                          }
                          onClick={() =>
                            setSelectedId(
                              dispatch._id
                            )
                          }
                          className={`
                            cursor-pointer
                            border-t
                            border-slate-200
                            transition
                            ${
                              isSelected
                                ? "bg-blue-50"
                                : "hover:bg-slate-50"
                            }
                          `}
                        >

                          <td className="px-4 py-4 text-center">

                            <div className="flex justify-center">

                              <div
                                className={`
                                  flex
                                  h-5
                                  w-5
                                  items-center
                                  justify-center
                                  rounded-full
                                  border-2
                                  ${
                                    isSelected
                                      ? "border-blue-600"
                                      : "border-slate-300"
                                  }
                                `}
                              >

                                {isSelected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-4 py-4">

                            <span className="font-semibold text-blue-600">
                              {
                                dispatch.dispatchNumber ||
                                "-"
                              }
                            </span>

                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">

                            {
                              formatDate(
                                dispatch.dispatchDate
                              )
                            }

                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">

                            {
                              dispatch.lrNumber ||
                              "-"
                            }

                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">

                            {
                              formatDate(
                                dispatch.updatedAt
                              )
                            }

                          </td>

                          <td className="px-4 py-4 text-right">

                            <span className="font-semibold text-slate-800">
                              {quantity.toLocaleString()}
                            </span>

                            <span className="ml-1 text-xs text-slate-500">
                              {unit}
                            </span>

                          </td>

                          <td className="px-4 py-4 text-center">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                              <CheckCircle2
                                size={13}
                              />

                              Delivered

                            </span>

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
            FOOTER
        ================================================= */}

        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredDispatches.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {dispatches.length}
            </span>{" "}
            entries

          </p>

          <div className="flex items-center gap-3">

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
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              Select & Continue

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SelectDispatchModal;