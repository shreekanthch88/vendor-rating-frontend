import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  if (totalPages <= 1 && totalRecords <= pageSize) {
    return null;
  }

  const startRecord =
    totalRecords === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(
    currentPage * pageSize,
    totalRecords
  );

  const getVisiblePages = () => {
    const pages = [];

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
      {/* Left Side */}
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

      {/* Right Side */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Page Size */}
        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange?.(
              Number(e.target.value)
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {pageSizeOptions.map((size) => (
            <option
              key={size}
              value={size}
            >
              {size} / page
            </option>
          ))}
        </select>

        {/* Previous */}
        <button
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="rounded-lg border border-gray-300 p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition
              ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="rounded-lg border border-gray-300 p-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;