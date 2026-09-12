import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { getReInspections } from "../../services/reInspectionService";


const ReInspections = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [reInspections, setReInspections] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [type, setType] = useState("All");

  const [result, setResult] = useState("All");

  const [vendor, setVendor] = useState("All");

  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);

  const itemsPerPage = 10;


  // =====================================================
  // LOAD RE-INSPECTIONS
  // =====================================================

  const loadReInspections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReInspections();

      console.log(
        "Re-Inspections API Response:",
        response
      );

      const data =
        response?.data?.reInspections ||
        response?.data ||
        response?.reInspections ||
        response ||
        [];

      setReInspections(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Load Re-Inspections Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load re-inspections."
      );

      setReInspections([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReInspections();
  }, []);


  // =====================================================
  // NORMALIZE VALUE
  // =====================================================

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();


  // =====================================================
  // DISPLAY TYPE
  // =====================================================

  const getTypeLabel = (value) => {
    if (value === "ORIGINAL_MATERIAL") {
      return "Original Material";
    }

    if (value === "REPLACEMENT_MATERIAL") {
      return "Replacement Material";
    }

    return value || "-";
  };


  // =====================================================
  // VENDOR NAME
  // =====================================================

  const getVendorName = (item) => {
    if (item?.vendor?.vendorName) {
      return item.vendor.vendorName;
    }

    if (item?.vendor?.companyName) {
      return item.vendor.companyName;
    }

    if (item?.vendorName) {
      return item.vendorName;
    }

    return "-";
  };


  // =====================================================
  // ORIGINAL INSPECTION NUMBER
  // =====================================================

  const getOriginalInspectionNumber = (item) => {
    return (
      item?.originalInspection?.inspectionNumber ||
      item?.originalInspectionNumber ||
      "-"
    );
  };


  // =====================================================
  // PO NUMBER
  // =====================================================

  const getPONumber = (item) => {
    return (
      item?.purchaseOrder?.poNumber ||
      item?.poNumber ||
      "-"
    );
  };


  // =====================================================
  // GRN NUMBER
  // =====================================================

  const getGRNNumber = (item) => {
    return (
      item?.goodsReceipt?.grnNumber ||
      item?.grnNumber ||
      "-"
    );
  };


  // =====================================================
  // TOTAL RE-INSPECTION QUANTITY
  // =====================================================

  const getInspectionQuantity = (item) => {
    if (!Array.isArray(item?.items)) {
      return 0;
    }

    return item.items.reduce(
      (total, inspectionItem) =>
        total +
        Number(
          inspectionItem?.inspectionQuantity || 0
        ),
      0
    );
  };


  // =====================================================
  // FILTER VENDORS
  // =====================================================

  const vendorOptions = useMemo(() => {
    const values = reInspections
      .map((item) => getVendorName(item))
      .filter((value) => value && value !== "-");

    return [...new Set(values)];
  }, [reInspections]);


  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredReInspections = useMemo(() => {
    const searchValue = normalize(search);

    return reInspections.filter((item) => {
      const matchesSearch =
        !searchValue ||
        normalize(
          item?.reInspectionNumber
        ).includes(searchValue) ||
        normalize(
          getOriginalInspectionNumber(item)
        ).includes(searchValue) ||
        normalize(
          getPONumber(item)
        ).includes(searchValue) ||
        normalize(
          getGRNNumber(item)
        ).includes(searchValue) ||
        normalize(
          getVendorName(item)
        ).includes(searchValue);

      const matchesStatus =
        status === "All" ||
        item?.status === status;

      const matchesType =
        type === "All" ||
        item?.reinspectionType === type;

      const matchesResult =
        result === "All" ||
        item?.overallResult === result;

      const matchesVendor =
        vendor === "All" ||
        getVendorName(item) === vendor;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesResult &&
        matchesVendor
      );
    });
  }, [
    reInspections,
    search,
    status,
    type,
    result,
    vendor,
  ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReInspections.length /
        itemsPerPage
    )
  );


  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);


  const paginatedReInspections =
    useMemo(() => {
      const start =
        (page - 1) *
        itemsPerPage;

      return filteredReInspections.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredReInspections,
      page,
    ]);


  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const summary = useMemo(() => {
    return {
      total: reInspections.length,

      draft: reInspections.filter(
        (item) =>
          item?.status === "Draft"
      ).length,

      inProgress: reInspections.filter(
        (item) =>
          item?.status === "In Progress"
      ).length,

      completed: reInspections.filter(
        (item) =>
          item?.status === "Completed"
      ).length,

      cancelled: reInspections.filter(
        (item) =>
          item?.status === "Cancelled"
      ).length,
    };
  }, [reInspections]);


  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setType("All");
    setResult("All");
    setVendor("All");
    setPage(1);
  };


  // =====================================================
  // STATUS BADGE
  // =====================================================

  const StatusBadge = ({ value }) => {
    const styles = {
      Draft:
        "bg-amber-50 text-amber-700 border-amber-200",

      "In Progress":
        "bg-blue-50 text-blue-700 border-blue-200",

      Completed:
        "bg-emerald-50 text-emerald-700 border-emerald-200",

      Cancelled:
        "bg-red-50 text-red-700 border-red-200",
    };

    const icons = {
      Draft: Clock3,
      "In Progress": Clock3,
      Completed: CheckCircle2,
      Cancelled: XCircle,
    };

    const Icon =
      icons[value] || Clock3;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
          styles[value] ||
          "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        <Icon size={12} />

        {value || "-"}
      </span>
    );
  };


  // =====================================================
  // TYPE BADGE
  // =====================================================

  const TypeBadge = ({ value }) => {
    const isOriginal =
      value === "ORIGINAL_MATERIAL";

    return (
      <span
        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${
          isOriginal
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
        }`}
      >
        {getTypeLabel(value)}
      </span>
    );
  };


  // =====================================================
  // RESULT BADGE
  // =====================================================

  const ResultBadge = ({ value }) => {
    if (!value || value === "Pending") {
      return (
        <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {value || "Pending"}
        </span>
      );
    }

    if (value === "Accepted") {
      return (
        <span className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Accepted
        </span>
      );
    }

    if (value === "Partially Accepted") {
      return (
        <span className="inline-flex rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
          Partially Accepted
        </span>
      );
    }

    if (value === "Accepted with Damage") {
      return (
        <span className="inline-flex rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
          Accepted with Damage
        </span>
      );
    }

    if (value === "Rejected") {
      return (
        <span className="inline-flex rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
        {value}
      </span>
    );
  };


  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const handleOpen = (item) => {
    if (!item?._id) {
      return;
    }

    navigate(
      `/quality-inspection/re-inspections/${item._id}`
    );
  };


  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = () => {
    navigate(
      "/quality-inspection/re-inspections/create"
    );
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[600px] bg-slate-50 p-6">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <RefreshCw
                size={22}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading re-inspections...
            </p>
          </div>
        </div>
      </div>
    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Re-Inspections
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all re-inspection records
          </p>
        </div>


        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={17} />

          Create Re-Inspection
        </button>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">

        <SummaryCard
          label="Total"
          value={summary.total}
          icon={<RefreshCw size={18} />}
          color="blue"
        />

        <SummaryCard
          label="Draft"
          value={summary.draft}
          icon={<Clock3 size={18} />}
          color="amber"
        />

        <SummaryCard
          label="In Progress"
          value={summary.inProgress}
          icon={<Clock3 size={18} />}
          color="blue"
        />

        <SummaryCard
          label="Completed"
          value={summary.completed}
          icon={<CheckCircle2 size={18} />}
          color="green"
        />

        <SummaryCard
          label="Cancelled"
          value={summary.cancelled}
          icon={<XCircle size={18} />}
          color="red"
        />

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div className="flex-1">

            <p className="text-sm font-semibold text-red-800">
              Unable to load Re-Inspections
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={loadReInspections}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={14} />
            Retry
          </button>

        </div>
      )}


      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="border-b border-slate-200 p-4">

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                  setPage(1);
                }}
                placeholder="Search by RI No, QI No, PO No, Vendor..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* STATUS */}

            <select
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value
                );
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>

              <option value="Draft">
                Draft
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>


            {/* TYPE */}

            <select
              value={type}
              onChange={(event) => {
                setType(
                  event.target.value
                );
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Types
              </option>

              <option value="ORIGINAL_MATERIAL">
                Original Material
              </option>

              <option value="REPLACEMENT_MATERIAL">
                Replacement Material
              </option>
            </select>


            {/* RESULT */}

            <select
              value={result}
              onChange={(event) => {
                setResult(
                  event.target.value
                );
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Results
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Accepted">
                Accepted
              </option>

              <option value="Partially Accepted">
                Partially Accepted
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Accepted with Damage">
                Accepted with Damage
              </option>

              <option value="Conditional Acceptance">
                Conditional Acceptance
              </option>
            </select>


            {/* VENDOR */}

            <select
              value={vendor}
              onChange={(event) => {
                setVendor(
                  event.target.value
                );
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Vendors
              </option>

              {vendorOptions.map(
                (vendorName) => (
                  <option
                    key={vendorName}
                    value={vendorName}
                  >
                    {vendorName}
                  </option>
                )
              )}

            </select>


            {/* FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
                showFilters
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>


            {/* RESET */}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              <RotateCcw size={15} />
              Reset
            </button>

          </div>


          {showFilters && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Active Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {status}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Active Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {getTypeLabel(
                      type
                    ) === type
                      ? type
                      : getTypeLabel(type)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Active Result
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {result}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <table className="min-w-[1250px] w-full">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <TableHeader>
                  RI No.
                </TableHeader>

                <TableHeader>
                  Original QI No.
                </TableHeader>

                <TableHeader>
                  Type
                </TableHeader>

                <TableHeader>
                  PO No.
                </TableHeader>

                <TableHeader>
                  GRN No.
                </TableHeader>

                <TableHeader>
                  Vendor
                </TableHeader>

                <TableHeader align="center">
                  Re-Inspection Qty
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader>
                  Result
                </TableHeader>

                <TableHeader>
                  Created On
                </TableHeader>

                <TableHeader align="center">
                  Action
                </TableHeader>

              </tr>

            </thead>


            <tbody>

              {paginatedReInspections.length === 0 ? (

                <tr>

                  <td
                    colSpan={11}
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                      <RefreshCw size={23} />

                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">

                      No Re-Inspections found

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                      Try changing your search or filters.

                    </p>

                  </td>

                </tr>

              ) : (

                paginatedReInspections.map(
                  (item) => (

                    <tr
                      key={item._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >

                      {/* RI */}

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleOpen(item)
                          }
                          className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.reInspectionNumber ||
                            "-"}
                        </button>

                      </td>


                      {/* QI */}

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">

                        {getOriginalInspectionNumber(
                          item
                        )}

                      </td>


                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <TypeBadge
                          value={
                            item.reinspectionType
                          }
                        />

                      </td>


                      {/* PO */}

                      <td className="px-5 py-4 text-sm text-slate-700">

                        {getPONumber(item)}

                      </td>


                      {/* GRN */}

                      <td className="px-5 py-4 text-sm text-slate-700">

                        {getGRNNumber(item)}

                      </td>


                      {/* VENDOR */}

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">

                        {getVendorName(item)}

                      </td>


                      {/* QTY */}

                      <td className="px-5 py-4 text-center text-sm font-semibold text-slate-800">

                        {getInspectionQuantity(
                          item
                        )}

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          value={
                            item.status
                          }
                        />

                      </td>


                      {/* RESULT */}

                      <td className="px-5 py-4">

                        <ResultBadge
                          value={
                            item.overallResult
                          }
                        />

                      </td>


                      {/* CREATED */}

                      <td className="px-5 py-4 text-sm text-slate-600">

                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            type="button"
                            title="Open"
                            onClick={() =>
                              handleOpen(item)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={15} />
                          </button>


                          <button
                            type="button"
                            title="More"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                          >
                            <MoreVertical
                              size={16}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER / PAGINATION
        ================================================= */}

        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-700">

              {filteredReInspections.length ===
              0
                ? 0
                : (page - 1) *
                    itemsPerPage +
                  1}

            </span>

            {" "}to{" "}

            <span className="font-semibold text-slate-700">

              {Math.min(
                page *
                  itemsPerPage,
                filteredReInspections.length
              )}

            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-700">

              {filteredReInspections.length}

            </span>

            {" "}entries

          </p>


          <div className="flex items-center gap-1">

            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage(
                  (previous) =>
                    previous - 1
                )
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>


            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            )
              .slice(0, 5)
              .map((pageNumber) => (

                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    setPage(
                      pageNumber
                    )
                  }
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold ${
                    page === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>

              ))}


            <button
              type="button"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage(
                  (previous) =>
                    previous + 1
                )
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  label,
  value,
  icon,
  color,
}) => {
  const colors = {
    blue:
      "border-blue-100 bg-blue-50 text-blue-700",

    amber:
      "border-amber-100 bg-amber-50 text-amber-700",

    green:
      "border-emerald-100 bg-emerald-50 text-emerald-700",

    red:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>


        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
            colors[color]
          }`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        Re-Inspections
      </p>

    </div>
  );
};


// =========================================================
// TABLE HEADER
// =========================================================

const TableHeader = ({
  children,
  align = "left",
}) => {
  return (
    <th
      className={`px-5 py-3 text-${align} text-[11px] font-bold uppercase tracking-wide text-slate-500`}
    >
      {children}
    </th>
  );
};


export default ReInspections;