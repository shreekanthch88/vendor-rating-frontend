import { Search, RotateCcw } from "lucide-react";

const GoodsReceiptFilters = ({
  search,
  status,
  receiptType,
  onSearchChange,
  onStatusChange,
  onReceiptTypeChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Search */}
        <div>
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
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search GRN, PO or vendor..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Statuses
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Received">
              Received
            </option>

            <option value="Quality Check">
              Quality Check
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        {/* Receipt Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Receipt Type
          </label>

          <select
            value={receiptType}
            onChange={(event) =>
              onReceiptTypeChange(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Types
            </option>

            <option value="Normal">
              Normal
            </option>

            <option value="Replacement">
              Replacement
            </option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={17} />
            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default GoodsReceiptFilters;