import React from "react";

import {
  Truck,
  Eye,
  History,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
} from "lucide-react";


const DispatchOverviewTable = ({
  dispatches = [],
  loading = false,

  page = 1,
  pages = 0,
  total = 0,

  onDispatch,
  onView,
  onPageChange,
}) => {

  // =========================================================
  // HELPERS
  // =========================================================

  const getPurchaseOrder = (record) => {
    return (
      record?.purchaseOrder ||
      record?.po ||
      null
    );
  };


  const getPONumber = (record) => {
    const purchaseOrder =
      getPurchaseOrder(record);

    return (
      record?.poNumber ||
      purchaseOrder?.poNumber ||
      "—"
    );
  };


  const getPODate = (record) => {
    const purchaseOrder =
      getPurchaseOrder(record);

    return (
      record?.poDate ||
      purchaseOrder?.orderDate ||
      purchaseOrder?.createdAt ||
      null
    );
  };


  const getRequiredDate = (record) => {
    const purchaseOrder =
      getPurchaseOrder(record);

    return (
      record?.requiredDate ||
      purchaseOrder?.expectedDeliveryDate ||
      purchaseOrder?.requiredDate ||
      null
    );
  };


  const getOrderedQuantity = (record) => {
    return Number(
      record?.orderedQuantity ||
      record?.purchaseOrder
        ?.orderedQuantity ||
      0
    );
  };


  const getDispatchedQuantity = (record) => {
    return Number(
      record?.cumulativeDispatchedQuantity ??
      record?.totalDispatchedQuantity ??
      record?.dispatchedQuantity ??
      record?.dispatchQuantity ??
      0
    );
  };


  const getRemainingQuantity = (record) => {
    if (
      record?.remainingQuantity !==
      undefined &&
      record?.remainingQuantity !==
      null
    ) {
      return Number(
        record.remainingQuantity
      );
    }

    const ordered =
      getOrderedQuantity(record);

    const dispatched =
      getDispatchedQuantity(record);

    return Math.max(
      ordered - dispatched,
      0
    );
  };


  const getStatus = (record) => {
    const remaining =
      getRemainingQuantity(record);

    const status =
      record?.status;

    if (
      status === "Cancelled" ||
      status === "Rejected"
    ) {
      return status;
    }

    if (
      status === "In Transit"
    ) {
      return "In Transit";
    }

    if (
      status === "Delivered"
    ) {
      return "Delivered";
    }

    if (
      remaining > 0 &&
      getDispatchedQuantity(record) > 0
    ) {
      return "Partial";
    }

    if (
      remaining === 0 &&
      getOrderedQuantity(record) > 0
    ) {
      return "Dispatched";
    }

    return status || "Ready";
  };


  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatQuantity = (value) => {
    return Number(
      value || 0
    ).toLocaleString("en-IN");
  };


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "Ready":
        return "bg-blue-50 text-blue-700";

      case "Partial":
        return "bg-amber-50 text-amber-700";

      case "Dispatched":
        return "bg-green-50 text-green-700";

      case "In Transit":
        return "bg-purple-50 text-purple-700";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      case "Cancelled":
        return "bg-slate-100 text-slate-600";

      case "Rejected":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-5">

          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />

        </div>


        <div className="space-y-4 p-5">

          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-slate-100"
              />
            )
          )}

        </div>

      </div>
    );
  }


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!dispatches.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-5">

          <h2 className="text-lg font-semibold text-slate-800">
            Dispatch Overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Purchase orders available for dispatch
            and dispatch tracking.
          </p>

        </div>


        <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

            <PackageCheck
              size={30}
              className="text-slate-400"
            />

          </div>


          <h3 className="mt-4 text-base font-semibold text-slate-700">
            No dispatch records found
          </h3>

          <p className="mt-1 max-w-md text-sm text-slate-400">
            There are no dispatch records matching
            the selected filters.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // TABLE
  // =========================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-800">
            Dispatch Overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Purchase orders available for dispatch
            and dispatch tracking.
          </p>

        </div>


        <div className="text-sm text-slate-500">

          Total Records:
          <span className="ml-1 font-semibold text-slate-700">
            {total}
          </span>

        </div>

      </div>


      {/* =====================================================
          TABLE CONTAINER
          ===================================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-[1150px] w-full">

          <thead>

            <tr className="border-b border-slate-100 bg-slate-50">

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Purchase Order
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                PO Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Required Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ordered
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dispatched
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pending
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {dispatches.map(
              (record) => {

                const ordered =
                  getOrderedQuantity(
                    record
                  );

                const dispatched =
                  getDispatchedQuantity(
                    record
                  );

                const remaining =
                  getRemainingQuantity(
                    record
                  );

                const status =
                  getStatus(record);


                return (
                  <tr
                    key={
                      record?._id ||
                      record?.id ||
                      getPONumber(record)
                    }
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >

                    {/* ======================================
                        PO NUMBER
                        ====================================== */}

                    <td className="px-5 py-4">

                      <div className="font-semibold text-slate-800">
                        {getPONumber(record)}
                      </div>

                      {record?.dispatchNumber && (
                        <div className="mt-1 text-xs text-slate-400">
                          {record.dispatchNumber}
                        </div>
                      )}

                    </td>


                    {/* ======================================
                        PO DATE
                        ====================================== */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(
                        getPODate(record)
                      )}
                    </td>


                    {/* ======================================
                        REQUIRED DATE
                        ====================================== */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(
                        getRequiredDate(record)
                      )}
                    </td>


                    {/* ======================================
                        ORDERED
                        ====================================== */}

                    <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                      {formatQuantity(
                        ordered
                      )}
                    </td>


                    {/* ======================================
                        DISPATCHED
                        ====================================== */}

                    <td className="px-5 py-4 text-right text-sm font-medium text-green-600">
                      {formatQuantity(
                        dispatched
                      )}
                    </td>


                    {/* ======================================
                        PENDING
                        ====================================== */}

                    <td className="px-5 py-4 text-right">

                      <span
                        className={
                          remaining > 0
                            ? "text-sm font-semibold text-amber-600"
                            : "text-sm font-medium text-slate-500"
                        }
                      >
                        {formatQuantity(
                          remaining
                        )}
                      </span>

                    </td>


                    {/* ======================================
                        STATUS
                        ====================================== */}

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </td>


                    {/* ======================================
                        ACTION
                        ====================================== */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">

                        {/* ==================================
                            DISPATCH BUTTON
                            ================================== */}

                        {remaining > 0 &&
                          status !==
                            "Cancelled" &&
                          status !==
                            "Rejected" && (

                          <button
                            type="button"
                            onClick={() =>
                              onDispatch?.(
                                record
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >

                            <Truck
                              size={15}
                            />

                            Dispatch

                          </button>
                        )}


                        {/* ==================================
                            VIEW / HISTORY
                            ================================== */}

                        <button
                          type="button"
                          onClick={() =>
                            onView?.(
                              record
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >

                          {remaining === 0 ? (
                            <History
                              size={15}
                            />
                          ) : (
                            <Eye
                              size={15}
                            />
                          )}

                          {remaining === 0
                            ? "History"
                            : "View"}

                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          PAGINATION
          ===================================================== */}

      {pages > 1 && (

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Page
            <span className="mx-1 font-semibold text-slate-700">
              {page}
            </span>

            of

            <span className="mx-1 font-semibold text-slate-700">
              {pages}
            </span>

          </p>


          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                onPageChange?.(
                  page - 1
                )
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                size={17}
              />
            </button>


            {Array.from(
              {
                length: Math.min(
                  pages,
                  5
                ),
              },
              (_, index) => {

                const pageNumber =
                  index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      onPageChange?.(
                        pageNumber
                      )
                    }
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                      page ===
                      pageNumber
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}


            <button
              type="button"
              disabled={
                page >= pages
              }
              onClick={() =>
                onPageChange?.(
                  page + 1
                )
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight
                size={17}
              />
            </button>

          </div>

        </div>
      )}

    </div>
  );
};


export default DispatchOverviewTable;