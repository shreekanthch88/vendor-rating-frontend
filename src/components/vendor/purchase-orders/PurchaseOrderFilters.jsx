import React from "react";
import {
  Search,
  RotateCcw,
  RefreshCw,
  Filter,
} from "lucide-react";

const PurchaseOrderFilters = ({
  search = "",
  status = "",
  onSearchChange,
  onStatusChange,
  onReset,
  onRefresh,
  loading = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Filter
              size={19}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800">
              Purchase Order Filters
            </h2>

            <p className="text-xs text-slate-400">
              Search and filter your purchase orders
            </p>
          </div>

        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_auto]">

        {/* Search */}
        <div>
          <label
            htmlFor="purchaseOrderSearch"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search Purchase Orders
          </label>

          <div className="relative">

            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="purchaseOrderSearch"
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              placeholder="Search by PO number..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="purchaseOrderStatus"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Status
          </label>

          <select
            id="purchaseOrderStatus"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Statuses
            </option>

            <option value="Sent">
              Sent
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Partially Delivered">
              Partially Delivered
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Closed">
              Closed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">

          <button
            type="button"
            onClick={onReset}
            disabled={
              loading ||
              (!search && !status)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            <RotateCcw size={16} />

            Reset
          </button>

        </div>

      </div>
    </div>
  );
};

export default PurchaseOrderFilters;