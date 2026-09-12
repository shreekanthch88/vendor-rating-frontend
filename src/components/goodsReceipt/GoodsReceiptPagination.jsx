const GoodsReceiptPagination = ({
  page,
  pages,
  total,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 md:flex-row">

      <span className="text-sm text-slate-600">

        Total Goods Receipts:

        <strong className="ml-2 text-slate-800">
          {total}
        </strong>

      </span>


      <div className="flex items-center gap-3">

        <button
          type="button"
          disabled={page <= 1}
          onClick={onPrevious}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>


        <span className="text-sm font-medium text-slate-700">
          Page {page} of {pages}
        </span>


        <button
          type="button"
          disabled={page >= pages}
          onClick={onNext}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default GoodsReceiptPagination;