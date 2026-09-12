import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PurchaseOrderPagination = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {

  /**
   * ==========================================
   * Generate Visible Pages
   * ==========================================
   */

  const getPages = () => {

    const pages = [];

    const start = Math.max(
      1,
      currentPage - 2
    );

    const end = Math.min(
      totalPages,
      currentPage + 2
    );

    for (let i = start; i <= end; i++) {

      pages.push(i);

    }

    return pages;

  };

  const pages = getPages();

  return (

    <div className="mt-6 flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* ==========================================
          Left Section
      ========================================== */}

      <div>

        <p className="text-sm text-slate-600">

          Showing page

          <span className="mx-1 font-bold">

            {currentPage}

          </span>

          of

          <span className="mx-1 font-bold">

            {totalPages}

          </span>

        </p>

        <p className="mt-1 text-sm text-slate-500">

          Total Purchase Orders :

          <span className="ml-1 font-semibold">

            {totalRecords}

          </span>

        </p>

      </div>

      {/* ==========================================
          Right Section
      ========================================== */}

      <div className="flex flex-wrap items-center gap-3">

                {/* First Page */}

        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-lg border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous */}

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}

        <div className="flex items-center gap-2">

          {pages.map((page) => (

            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-lg font-semibold transition ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-slate-100"
              }`}
            >
              {page}
            </button>

          ))}

        </div>

        {/* Next */}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last Page */}

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="rounded-lg border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsRight size={18} />
        </button>

                {/* ==========================================
            Rows Per Page
        ========================================== */}

        <div className="flex items-center gap-2">

          <label className="text-sm font-medium text-slate-600">
            Rows:
          </label>

          <select
            value={pageSize}
            onChange={(e) =>
              onPageSizeChange(Number(e.target.value))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

        </div>

      </div>

    </div>

  );

};

export default PurchaseOrderPagination;