import {
  Eye,
  FileText,
  Package,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import vendorReplacementRequestService
  from "../../services/vendorReplacementRequestService";


const VendorReplacementRequests = () => {

  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      total: 0,
      pages: 1,
    });


  // =========================================================
  // LOAD REPLACEMENT REQUESTS
  // =========================================================

  useEffect(() => {

    loadReplacementRequests();

  }, [page, status]);


  const loadReplacementRequests =
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await vendorReplacementRequestService
            .getVendorReplacementRequests(
              page,
              10,
              search,
              status
            );


        const responseData =
          response?.data ||
          response;


        let requestList = [];


        if (
          Array.isArray(responseData)
        ) {

          requestList =
            responseData;

        } else {

          requestList =
            responseData?.requests ||
            responseData?.replacementRequests ||
            response?.requests ||
            response?.replacementRequests ||
            [];

        }


        setRequests(
          requestList
        );


        setPagination({

          total:
            response?.total ??
            responseData?.total ??
            requestList.length,

          pages:
            response?.pages ??
            responseData?.pages ??
            1,

        });


      } catch (err) {

        console.error(
          "Failed to load replacement requests:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load replacement requests."
        );


        setRequests([]);

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch =
    () => {

      setPage(1);

      loadReplacementRequests();

    };


  // =========================================================
  // RESET
  // =========================================================

  const handleReset =
    () => {

      setSearch("");
      setStatus("");
      setPage(1);

    };


  // =========================================================
  // STATUS
  // =========================================================

  const getStatus =
    (request) => {

      return (
        request?.status ||
        "-"
      );

    };


  const getStatusClasses =
    (request) => {

      const currentStatus =
        String(
          getStatus(request)
        ).toLowerCase();


      if (
        currentStatus === "approved"
      ) {

        return "bg-blue-50 text-blue-700 border-blue-200";

      }


      if (
        currentStatus.includes("accepted")
      ) {

        return "bg-green-50 text-green-700 border-green-200";

      }


      if (
        currentStatus.includes("rejected")
      ) {

        return "bg-red-50 text-red-700 border-red-200";

      }


      if (
        currentStatus.includes("pending")
      ) {

        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      }


      if (
        currentStatus.includes("dispatched")
      ) {

        return "bg-purple-50 text-purple-700 border-purple-200";

      }


      return "bg-slate-50 text-slate-700 border-slate-200";

    };


  const getStatusIcon =
    (request) => {

      const currentStatus =
        String(
          getStatus(request)
        ).toLowerCase();


      if (
        currentStatus.includes("approved") ||
        currentStatus.includes("accepted")
      ) {

        return (
          <CheckCircle2
            size={15}
          />
        );

      }


      if (
        currentStatus.includes("rejected")
      ) {

        return (
          <XCircle
            size={15}
          />
        );

      }


      return (
        <Clock3
          size={15}
        />
      );

    };


  // =========================================================
  // REQUEST NUMBER
  // =========================================================

  const getRequestNumber =
    (request) => {

      return (
        request?.replacementRequestNumber ||
        request?.requestNumber ||
        request?.replacementNumber ||
        request?._id ||
        "-"
      );

    };


  // =========================================================
  // PURCHASE ORDER
  // =========================================================

  const getPONumber =
    (request) => {

      const po =
        request?.purchaseOrder;


      if (
        typeof po === "object" &&
        po !== null
      ) {

        return (
          po?.poNumber ||
          po?.purchaseOrderNumber ||
          po?._id ||
          "-"
        );

      }


      return (
        request?.poNumber ||
        po ||
        "-"
      );

    };


  // =========================================================
  // QUALITY INSPECTION
  // =========================================================

  const getInspectionNumber =
    (request) => {

      const inspection =
        request?.qualityInspection;


      if (
        typeof inspection === "object" &&
        inspection !== null
      ) {

        return (
          inspection?.inspectionNumber ||
          inspection?.qualityInspectionNumber ||
          inspection?._id ||
          "-"
        );

      }


      return (
        request?.qualityInspectionNumber ||
        inspection ||
        "-"
      );

    };


  // =========================================================
  // REPLACEMENT QUANTITY
  // =========================================================

  const getReplacementQuantity =
    (request) => {

      const items =
        Array.isArray(
          request?.items
        )
          ? request.items
          : [];


      return items.reduce(
        (
          total,
          item
        ) => {

          return (
            total +
            Number(
              item?.replacementQuantity ||
              0
            )
          );

        },
        0
      );

    };


  // =========================================================
  // DATE
  // =========================================================

  const formatDate =
    (date) => {

      if (!date) {

        return "-";

      }


      const parsedDate =
        new Date(date);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return "-";

      }


      return parsedDate.toLocaleDateString(
        "en-GB"
      );

    };


  // =========================================================
  // VIEW
  // =========================================================

  const handleView =
    (id) => {

      if (!id) {

        return;

      }


      navigate(
        `/vendor/replacement-requests/${id}`
      );

    };


  return (

    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Replacement Requests
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review replacement requests received from the organization.
        </p>

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onKeyDown={(event) => {

                if (
                  event.key === "Enter"
                ) {

                  handleSearch();

                }

              }}
              placeholder="Search replacement request or PO..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => {

                setStatus(
                  event.target.value
                );

                setPage(1);

              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Vendor Accepted">
                Vendor Accepted
              </option>

              <option value="Partially Dispatched">
                Partially Dispatched
              </option>

              <option value="Replacement Dispatched">
                Replacement Dispatched
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

        </div>


        <div className="mt-4 flex gap-3">

          <button
            type="button"
            onClick={
              handleSearch
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >

            <Search
              size={17}
            />

            Search

          </button>


          <button
            type="button"
            onClick={
              handleReset
            }
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >

            Reset

          </button>


          <button
            type="button"
            onClick={
              loadReplacementRequests
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
          >

            <RefreshCw
              size={17}
            />

            Refresh

          </button>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          {error}

        </div>

      )}


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-3">

            <FileText
              size={20}
              className="text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Replacement Requests
              </h2>

              <p className="text-xs text-slate-500">
                Requests available for your vendor account.
              </p>

            </div>

          </div>

        </div>


        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-slate-500">

              <RefreshCw
                size={20}
                className="animate-spin"
              />

              Loading Replacement Requests...

            </div>

          </div>

        ) : requests.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <Package
              size={42}
              className="text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              No Replacement Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No replacement requests are currently available.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-[1050px] w-full">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-4">
                    Request
                  </th>

                  <th className="px-5 py-4">
                    Purchase Order
                  </th>

                  <th className="px-5 py-4">
                    Quality Inspection
                  </th>

                  <th className="px-5 py-4">
                    Reason
                  </th>

                  <th className="px-5 py-4 text-right">
                    Replacement Qty
                  </th>

                  <th className="px-5 py-4">
                    Required Date
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {requests.map(
                  (
                    request,
                    index
                  ) => {

                    const requestId =
                      request?._id;


                    return (

                      <tr
                        key={
                          requestId ||
                          index
                        }
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <div className="font-semibold text-slate-900">

                            {getRequestNumber(
                              request
                            )}

                          </div>

                          <div className="mt-1 text-xs text-slate-400">

                            {requestId || "-"}

                          </div>

                        </td>


                        <td className="px-5 py-4 text-sm font-medium text-slate-700">

                          {getPONumber(
                            request
                          )}

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {getInspectionNumber(
                            request
                          )}

                        </td>


                        <td className="max-w-[220px] px-5 py-4 text-sm text-slate-600">

                          <span className="line-clamp-2">

                            {request?.reason ||
                              "-"}

                          </span>

                        </td>


                        <td className="px-5 py-4 text-right">

                          <span className="font-bold text-blue-700">

                            {getReplacementQuantity(
                              request
                            )}

                          </span>

                        </td>


                        <td className="px-5 py-4 text-sm text-slate-600">

                          {formatDate(
                            request?.requiredReplacementDate
                          )}

                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              request
                            )}`}
                          >

                            {getStatusIcon(
                              request
                            )}

                            {getStatus(
                              request
                            )}

                          </span>

                        </td>


                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            disabled={!requestId}
                            onClick={() =>
                              handleView(
                                requestId
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Eye
                              size={16}
                            />

                            View

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {!loading &&
        requests.length > 0 && (

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">

            <p className="text-sm text-slate-500">

              Total Requests:{" "}

              <span className="font-semibold text-slate-800">

                {pagination.total}

              </span>

            </p>


            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                  )
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Previous

              </button>


              <span className="px-3 text-sm font-medium text-slate-600">

                Page {page} of{" "}
                {pagination.pages}

              </span>


              <button
                type="button"
                disabled={
                  page >=
                  pagination.pages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next

              </button>

            </div>

          </div>

        )}

    </div>

  );

};


export default VendorReplacementRequests;