import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Eye,
  Filter,
  RefreshCw,
  ClipboardList,
  Clock3,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import replacementRequestService from "../../services/replacementRequestService.js";


const statusStyles = {
  Draft:
    "bg-slate-50 text-slate-700 border-slate-200",

  "Pending Approval":
    "bg-amber-50 text-amber-700 border-amber-200",

  Approved:
    "bg-blue-50 text-blue-700 border-blue-200",

  "Vendor Accepted":
    "bg-indigo-50 text-indigo-700 border-indigo-200",

  "Replacement Dispatched":
    "bg-purple-50 text-purple-700 border-purple-200",

  "Replacement Received":
    "bg-cyan-50 text-cyan-700 border-cyan-200",

  "Replacement Under Inspection":
    "bg-violet-50 text-violet-700 border-violet-200",

  "In Progress":
    "bg-purple-50 text-purple-700 border-purple-200",

  Completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Rejected:
    "bg-red-50 text-red-700 border-red-200",

  Cancelled:
    "bg-gray-50 text-gray-600 border-gray-200",
};


// =========================================================
// DATE FORMATTER
// =========================================================

const formatDate = (value) => {

  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =========================================================
// GET REQUEST ITEMS
// =========================================================

const getItems = (request) => {

  return Array.isArray(
    request?.items
  )
    ? request.items
    : [];
};


// =========================================================
// GET TOTAL QUANTITY
// =========================================================

const getQuantityTotal = (
  request,
  field
) => {

  return getItems(request).reduce(
    (
      total,
      item
    ) =>
      total +
      Number(
        item?.[field] || 0
      ),
    0
  );
};


// =========================================================
// GET MATERIAL DISPLAY
// =========================================================

const getMaterialDisplay = (
  request
) => {

  const items =
    getItems(request);

  if (!items.length) {
    return "-";
  }

  if (items.length === 1) {

    return (
      items[0]?.materialName ||
      items[0]?.material?.materialName ||
      items[0]?.materialCode ||
      items[0]?.material ||
      "-"
    );
  }

  const firstMaterial =
    items[0]?.materialName ||
    items[0]?.material?.materialName ||
    items[0]?.materialCode ||
    items[0]?.material ||
    "Material";

  return `${firstMaterial} + ${
    items.length - 1
  } more`;
};


// =========================================================
// GET PO NUMBER
// =========================================================

const getPONumber = (
  request
) => {

  return (
    request?.purchaseOrder?.poNumber ||
    request?.poNumber ||
    "-"
  );
};


// =========================================================
// GET VENDOR NAME
// =========================================================

const getVendorName = (
  request
) => {

  return (
    request?.vendor?.vendorName ||
    request?.vendor?.companyName ||
    request?.vendorName ||
    "-"
  );
};


// =========================================================
// GET REQUEST NUMBER
// =========================================================

const getRequestNumber = (
  request
) => {

  return (
    request?.requestNumber ||
    request?.requestNo ||
    "-"
  );
};


// =========================================================
// GET REQUIRED DATE
// =========================================================

const getRequiredDate = (
  request
) => {

  return (
    request?.requiredReplacementDate ||
    request?.requiredDate ||
    null
  );
};


// =========================================================
// PAGE
// =========================================================

export default function ReplacementRequests() {

  const navigate =
    useNavigate();


  // =======================================================
  // STATE
  // =======================================================

  const [
    requests,
    setRequests,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    status,
    setStatus,
  ] = useState("");


  const [
    dateFilter,
    setDateFilter,
  ] = useState("");


  const [
    page,
    setPage,
  ] = useState(1);


  const [
    limit,
    setLimit,
  ] = useState(10);


  const [
    total,
    setTotal,
  ] = useState(0);


  const [
    pages,
    setPages,
  ] = useState(1);


  // =======================================================
  // LOAD REPLACEMENT REQUESTS
  // =======================================================

  const loadReplacementRequests =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await replacementRequestService
            .getOrganizationReplacementRequests(
              page,
              limit,
              search,
              status,
              ""
            );


        const responseData =
          response?.data &&
          !Array.isArray(
            response.data
          )
            ? response.data
            : response;


        const requestList =
          responseData?.replacementRequests ||
          responseData?.requests ||
          [];


        setRequests(
          Array.isArray(
            requestList
          )
            ? requestList
            : []
        );


        setTotal(
          Number(
            responseData?.total ||
            0
          )
        );


        setPages(
          Math.max(
            Number(
              responseData?.pages ||
              1
            ),
            1
          )
        );

      } catch (err) {

        console.error(
          "Load Replacement Requests Error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load replacement requests."
        );

        setRequests([]);

        setTotal(0);

        setPages(1);

      } finally {

        setLoading(false);
      }
    };


  // =======================================================
  // LOAD WHEN FILTER / PAGE CHANGES
  // =======================================================

  useEffect(() => {

    loadReplacementRequests();

  }, [
    page,
    limit,
    search,
    status,
  ]);


  // =======================================================
  // SUMMARY
  // =======================================================

  const summary =
    useMemo(() => {

      return {

        total:
          total,

        pendingApproval:
          requests.filter(
            (request) =>
              request.status ===
              "Pending Approval"
          ).length,

        inProgress:
          requests.filter(
            (request) =>
              [
                "Approved",
                "Vendor Accepted",
                "Replacement Dispatched",
                "Replacement Received",
                "Replacement Under Inspection",
                "In Progress",
              ].includes(
                request.status
              )
          ).length,

        completed:
          requests.filter(
            (request) =>
              request.status ===
              "Completed"
          ).length,
      };

    }, [
      requests,
      total,
    ]);


  // =======================================================
  // DATE FILTER
  // =======================================================

  const filteredRequests =
    useMemo(() => {

      if (!dateFilter) {
        return requests;
      }


      return requests.filter(
        (request) => {

          const requiredDate =
            getRequiredDate(
              request
            );


          if (!requiredDate) {
            return false;
          }


          const date =
            new Date(
              requiredDate
            );


          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return false;
          }


          const year =
            date.getFullYear();


          const month =
            String(
              date.getMonth() + 1
            ).padStart(
              2,
              "0"
            );


          const day =
            String(
              date.getDate()
            ).padStart(
              2,
              "0"
            );


          return (
            `${year}-${month}-${day}` ===
            dateFilter
          );
        }
      );

    }, [
      requests,
      dateFilter,
    ]);


  // =======================================================
  // RESET FILTERS
  // =======================================================

  const resetFilters = () => {

    setSearch("");

    setStatus("");

    setDateFilter("");

    setPage(1);
  };


  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = () => {

    loadReplacementRequests();
  };


  // =======================================================
  // SEARCH CHANGE
  // =======================================================

  const handleSearchChange = (
    event
  ) => {

    setSearch(
      event.target.value
    );

    setPage(1);
  };


  // =======================================================
  // STATUS CHANGE
  // =======================================================

  const handleStatusChange = (
    event
  ) => {

    setStatus(
      event.target.value
    );

    setPage(1);
  };


  // =======================================================
  // CREATE
  // =======================================================

  const handleCreate = () => {

  navigate(
    "/quality-inspection/replacements/create"
  );

};

  // =======================================================
  // VIEW
  // =======================================================

  const handleView = (
    id
  ) => {

    if (!id) {
      return;
    }


   navigate(
  `/quality-inspection/replacements/${id}`
);
  };


  // =======================================================
  // PREVIOUS PAGE
  // =======================================================

  const handlePrevious =
    () => {

      if (page <= 1) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage - 1
      );
    };


  // =======================================================
  // NEXT PAGE
  // =======================================================

  const handleNext =
    () => {

      if (
        page >= pages
      ) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage + 1
      );
    };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl space-y-6">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">

              <span>
                Quality Inspection
              </span>

              <span>
                /
              </span>

              <span>
                Replacement
              </span>

            </div>


            <h1 className="text-2xl font-bold text-slate-900">

              Replacement Management

            </h1>


            <p className="mt-1 text-sm text-slate-500">

              Manage replacement requests raised from
              quality inspection decisions.

            </p>

          </div>


          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >

            <Plus size={17} />

            Create Replacement Request

          </button>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* TOTAL */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Requests
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {String(
                    summary.total
                  ).padStart(2, "0")}
                </p>

              </div>


              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">

                <ClipboardList
                  size={21}
                />

              </div>

            </div>

          </div>


          {/* PENDING */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Pending Approval
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {String(
                    summary.pendingApproval
                  ).padStart(2, "0")}
                </p>

              </div>


              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">

                <Clock3
                  size={21}
                />

              </div>

            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {String(
                    summary.inProgress
                  ).padStart(2, "0")}
                </p>

              </div>


              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">

                <Truck
                  size={21}
                />

              </div>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {String(
                    summary.completed
                  ).padStart(2, "0")}
                </p>

              </div>


              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">

                <CheckCircle2
                  size={21}
                />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>

              <p className="text-sm font-semibold text-red-800">
                Unable to load replacement requests
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">


            {/* SEARCH */}

            <div className="relative lg:col-span-5">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={
                  handleSearchChange
                }
                placeholder="Search request, PO, vendor or material"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* STATUS */}

            <div className="lg:col-span-3">

              <select
                value={
                  status || "All"
                }
                onChange={
                  handleStatusChange
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Pending Approval">
                  Pending Approval
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Vendor Accepted">
                  Vendor Accepted
                </option>

                <option value="Replacement Dispatched">
                  Replacement Dispatched
                </option>

                <option value="Replacement Received">
                  Replacement Received
                </option>

                <option value="Replacement Under Inspection">
                  Replacement Under Inspection
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>


            {/* REQUIRED DATE */}

            <div className="lg:col-span-3">

              <input
                type="date"
                value={
                  dateFilter
                }
                onChange={(event) =>
                  setDateFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* RESET */}

            <button
              type="button"
              onClick={
                resetFilters
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 lg:col-span-1"
            >

              <RefreshCw
                size={16}
              />

              Reset

            </button>

          </div>


          <div className="mt-3 flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <Filter
                size={14}
              />

              Showing backend replacement requests

            </div>


            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={
                loading
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={14}
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


        {/* =================================================
            REQUEST TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">


          <div className="border-b border-slate-200 px-5 py-4">

            <div className="flex items-center justify-between gap-3">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Replacement Requests
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Requests generated from rejected or damaged
                  inspection quantities.
                </p>

              </div>


              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">

                {filteredRequests.length} Requests

              </span>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="min-w-[1150px] w-full text-sm">

              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                <tr>

                  <th className="px-5 py-4 font-semibold">
                    Request No.
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    PO Number
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Vendor
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Material
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Rejected
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Damaged
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Replacement
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Required By
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center font-semibold">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="px-5 py-14 text-center"
                    >

                      <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-blue-500"
                      />

                      <p className="mt-3 font-semibold text-slate-700">
                        Loading replacement requests...
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Fetching the latest data from the backend.
                      </p>

                    </td>

                  </tr>

                ) : filteredRequests.length > 0 ? (

                  filteredRequests.map(
                    (request) => {

                      const requestId =
                        request?._id ||
                        request?.id;


                      const rejectedQty =
                        getQuantityTotal(
                          request,
                          "rejectedQuantity"
                        );


                      const damagedQty =
                        getQuantityTotal(
                          request,
                          "damagedQuantity"
                        );


                      const replacementQty =
                        getQuantityTotal(
                          request,
                          "replacementQuantity"
                        );


                      return (

                        <tr
                          key={
                            requestId ||
                            getRequestNumber(
                              request
                            )
                          }
                          className="transition hover:bg-slate-50"
                        >


                          {/* REQUEST */}

                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  requestId
                                )
                              }
                              className="font-semibold text-blue-600 hover:text-blue-700"
                            >

                              {getRequestNumber(
                                request
                              )}

                            </button>

                          </td>


                          {/* PO */}

                          <td className="px-5 py-4 font-medium text-slate-700">

                            {getPONumber(
                              request
                            )}

                          </td>


                          {/* VENDOR */}

                          <td className="px-5 py-4 text-slate-700">

                            {getVendorName(
                              request
                            )}

                          </td>


                          {/* MATERIAL */}

                          <td className="px-5 py-4 font-medium text-slate-800">

                            {getMaterialDisplay(
                              request
                            )}

                          </td>


                          {/* REJECTED */}

                          <td className="px-5 py-4 text-right text-red-600">

                            {rejectedQty}

                          </td>


                          {/* DAMAGED */}

                          <td className="px-5 py-4 text-right text-orange-600">

                            {damagedQty}

                          </td>


                          {/* REPLACEMENT */}

                          <td className="px-5 py-4 text-right font-semibold text-blue-600">

                            {replacementQty}

                          </td>


                          {/* REQUIRED DATE */}

                          <td className="px-5 py-4 text-slate-600">

                            {formatDate(
                              getRequiredDate(
                                request
                              )
                            )}

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                statusStyles[
                                  request.status
                                ] ||
                                "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >

                              {request.status ||
                                "Unknown"}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  requestId
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >

                              <Eye
                                size={14}
                              />

                              View

                            </button>

                          </td>

                        </tr>

                      );

                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      className="px-5 py-12 text-center"
                    >

                      <ClipboardList
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 font-semibold text-slate-700">
                        No replacement requests found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing the search or filter criteria.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              FOOTER / PAGINATION
          ================================================= */}

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <div>

              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredRequests.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {total}
              </span>{" "}
              requests

            </div>


            <div className="flex items-center gap-2">


              <button
                type="button"
                onClick={
                  handlePrevious
                }
                disabled={
                  page <= 1 ||
                  loading
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                Previous

              </button>


              <span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">

                {page}

              </span>


              <span className="px-1 text-xs text-slate-400">

                of {pages}

              </span>


              <button
                type="button"
                onClick={
                  handleNext
                }
                disabled={
                  page >= pages ||
                  loading
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                Next

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            WORKFLOW INFORMATION
        ================================================= */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

          <p className="text-sm font-semibold text-blue-900">
            Replacement Workflow
          </p>

          <p className="mt-1 text-sm text-blue-800">
            Quality Inspection → Replacement Decision →
            Replacement Request → Approval → Vendor Acceptance →
            Replacement Dispatch → Replacement GRN →
            Replacement Quality Inspection → Completion
          </p>

        </div>

      </div>

    </div>
  );
}