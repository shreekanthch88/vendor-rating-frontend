import {
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";

const PurchaseRequisitionFilters = ({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  priority,
  setPriority,
  onSearch,
  onReset,
}) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="mb-4 flex items-center gap-2">
        <Filter className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold">
          Filters
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

        {/* Search */}
        <div className="relative lg:col-span-2">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search PR Number / Purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Departments</option>
          <option value="Production">Production</option>
          <option value="Purchase">Purchase</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Quality">Quality</option>
          <option value="Stores">Stores</option>
          <option value="Administration">Administration</option>
          <option value="Finance">Finance</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">

        <button
          onClick={onSearch}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border px-6 py-2 hover:bg-gray-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>

    </div>
  );
};

export default PurchaseRequisitionFilters;