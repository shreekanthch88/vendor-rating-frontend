import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PurchaseRequisitionPagination = ({
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) => {
  const startRecord =
    totalRecords === 0 ? 0 : (page - 1) * limit + 1;

  const endRecord = Math.min(
    page * limit,
    totalRecords
  );

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row">

      {/* Records Info */}
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-semibold">
          {startRecord}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {endRecord}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalRecords}
        </span>{" "}
        records
      </div>

      {/* Page Size */}
      <div className="flex items-center gap-2">

        <span className="text-sm text-gray-600">
          Rows
        </span>

        <select
          value={limit}
          onChange={(e) =>
            onLimitChange(Number(e.target.value))
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="rounded bg-blue-600 px-4 py-2 font-semibold text-white">
          {page}
        </span>

        <span className="text-gray-500">
          of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronsRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default PurchaseRequisitionPagination;