import {
  Search,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

const PurchaseOrderFilters = ({
  search,
  setSearch,

  status,
  setStatus,

  vendor,
  setVendor,

  priority,
  setPriority,

  onRefresh,
}) => {

  const handleReset = () => {

    setSearch("");

    setStatus("");

    setVendor("");

    setPriority("");

  };

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

        {/* Search */}

        <div className="relative lg:col-span-4">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search Purchase Order..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          <option value="">
            All Status
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Submitted">
            Submitted
          </option>

          <option value="Approved">
            Approved
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

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

        {/* Vendor */}

        <input
          type="text"
          placeholder="Vendor"
          value={vendor}
          onChange={(e) =>
            setVendor(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        />

        {/* Priority */}

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          <option value="">
            All Priority
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>

          <option value="Critical">
            Critical
          </option>

        </select>

        {/* Refresh */}

        <button
          onClick={onRefresh}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          <RefreshCcw size={18} />

          Refresh
        </button>

        {/* Reset */}

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold transition hover:bg-slate-100"
        >
          <RotateCcw size={18} />

          Reset
        </button>

      </div>

    </div>

  );

};

export default PurchaseOrderFilters;