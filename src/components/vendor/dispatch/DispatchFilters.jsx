import React from "react";

import {
  Search,
  Filter,
  RotateCcw,
  RefreshCw,
  CalendarDays,
} from "lucide-react";


const DispatchFilters = ({
  search = "",
  status = "",
  purchaseOrder = "",
  fromDate = "",
  toDate = "",

  onSearchChange,
  onStatusChange,
  onPurchaseOrderChange,
  onFromDateChange,
  onToDateChange,

  onApply,
  onReset,
  onRefresh,

  loading = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* =====================================================
          FILTER HEADER
          ===================================================== */}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Filter
              size={18}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Dispatch Filters
            </h2>

            <p className="text-xs text-slate-400">
              Search and filter dispatch records
            </p>
          </div>
        </div>


        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onApply}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={16} />

            Search
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={16} />

            Reset
          </button>


          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>


      {/* =====================================================
          FILTER FIELDS
          ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* ===================================================
            SEARCH
            =================================================== */}

        <div className="xl:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange?.(
                  e.target.value
                )
              }
              placeholder="Search PO, dispatch number or material..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>


        {/* ===================================================
            STATUS
            =================================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange?.(
                e.target.value
              )
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Status
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Dispatched">
              Dispatched
            </option>

            <option value="Partial">
              Partial
            </option>

            <option value="In Transit">
              In Transit
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>


        {/* ===================================================
            PURCHASE ORDER
            =================================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Purchase Order
          </label>

          <input
            type="text"
            value={purchaseOrder}
            onChange={(e) =>
              onPurchaseOrderChange?.(
                e.target.value
              )
            }
            placeholder="PO number"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        {/* ===================================================
            FROM DATE
            =================================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            From Date
          </label>

          <div className="relative">

            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                onFromDateChange?.(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>


        {/* ===================================================
            TO DATE
            =================================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            To Date
          </label>

          <div className="relative">

            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                onToDateChange?.(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTIVE FILTER SUMMARY
          ===================================================== */}

      {(search ||
        status ||
        purchaseOrder ||
        fromDate ||
        toDate) && (

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">

          <span className="text-xs font-medium text-slate-400">
            Active filters:
          </span>


          {search && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Search: {search}
            </span>
          )}


          {status && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              Status: {status}
            </span>
          )}


          {purchaseOrder && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              PO: {purchaseOrder}
            </span>
          )}


          {fromDate && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              From: {fromDate}
            </span>
          )}


          {toDate && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              To: {toDate}
            </span>
          )}

        </div>
      )}

    </div>
  );
};


export default DispatchFilters;
