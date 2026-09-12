import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  PackageCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import replacementRequestService from "../../services/replacementRequestService.js";


// =========================================================
// HELPERS
// =========================================================

const formatDate = (value) => {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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


const getStatusClass = (status) => {

  const styles = {
    Draft:
      "border-slate-200 bg-slate-50 text-slate-700",

    "Pending Approval":
      "border-amber-200 bg-amber-50 text-amber-700",

    Approved:
      "border-blue-200 bg-blue-50 text-blue-700",

    "Vendor Accepted":
      "border-indigo-200 bg-indigo-50 text-indigo-700",

    "Replacement Dispatched":
      "border-purple-200 bg-purple-50 text-purple-700",

    "Replacement Received":
      "border-cyan-200 bg-cyan-50 text-cyan-700",

    "Replacement Under Inspection":
      "border-violet-200 bg-violet-50 text-violet-700",

    Completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    Rejected:
      "border-red-200 bg-red-50 text-red-700",

    Cancelled:
      "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    styles[status] ||
    "border-slate-200 bg-slate-50 text-slate-600"
  );
};


const getRequestNumber = (request) => {

  return (
    request?.requestNumber ||
    request?.requestNo ||
    "-"
  );
};


const getPONumber = (request) => {

  return (
    request?.purchaseOrder?.poNumber ||
    request?.poNumber ||
    "-"
  );
};


const getGRNNumber = (request) => {

  return (
    request?.goodsReceipt?.grnNumber ||
    request?.grnNumber ||
    "-"
  );
};


const getInspectionNumber = (request) => {

  return (
    request?.qualityInspection?.inspectionNumber ||
    request?.qualityInspection?.qiNumber ||
    request?.inspectionNumber ||
    "-"
  );
};


const getDispatchNumber = (request) => {

  return (
    request?.originalDispatch?.dispatchNumber ||
    request?.originalDispatch?.dispatchNo ||
    request?.originalDispatchId?.dispatchNumber ||
    request?.originalDispatchId?.dispatchNo ||
    "-"
  );
};


const getVendorName = (request) => {

  return (
    request?.vendor?.vendorName ||
    request?.vendor?.companyName ||
    request?.vendorName ||
    "-"
  );
};


const getItems = (request) => {

  return Array.isArray(request?.items)
    ? request.items
    : [];
};


const getQuantity = (
  item,
  ...fields
) => {

  for (const field of fields) {

    if (
      item?.[field] !== undefined &&
      item?.[field] !== null
    ) {

      return Number(
        item[field]
      );
    }
  }

  return 0;
};


const getTotalQuantity = (
  request,
  fields
) => {

  return getItems(request).reduce(
    (total, item) =>
      total +
      getQuantity(
        item,
        ...fields
      ),
    0
  );
};


const getMaterialName = (item) => {

  return (
    item?.materialName ||
    item?.material?.materialName ||
    item?.materialCode ||
    item?.material?.materialCode ||
    "-"
  );
};


// =========================================================
// COMPONENT
// =========================================================

export default function ReplacementRequestDetails() {

  const navigate =
    useNavigate();

  const {
    id,
  } = useParams();


  // =======================================================
  // STATE
  // =======================================================

  const [
    request,
    setRequest,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    remarks,
    setRemarks,
  ] = useState("");


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  const [
    actionError,
    setActionError,
  ] = useState("");


  // =======================================================
  // LOAD REQUEST
  // =======================================================

  const loadRequest = async () => {

    if (!id) {

      setError(
        "Replacement Request ID is missing."
      );

      setLoading(false);

      return;
    }


    try {

      setLoading(true);

      setError("");


      const response =
        await replacementRequestService
          .getOrganizationReplacementRequestById(
            id
          );


      const replacementRequest =
        response?.data ||
        response?.replacementRequest ||
        response;


      setRequest(
        replacementRequest
      );


      setRemarks(
        replacementRequest?.remarks ||
        ""
      );

    } catch (err) {

      console.error(
        "Get Replacement Request Details Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load replacement request."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadRequest();

  }, [id]);


  // =======================================================
  // BACK
  // =======================================================

  const handleBack = () => {

    navigate(
      "/quality-inspections/replacement-requests"
    );
  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async () => {

    if (!id) {
      return;
    }


    try {

      setActionLoading(true);

      setActionError("");


      await replacementRequestService
        .submitOrganizationReplacementRequest(
          id
        );


      await loadRequest();

    } catch (err) {

      console.error(
        "Submit Replacement Request Error:",
        err
      );


      setActionError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit replacement request."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // =======================================================
  // APPROVE
  // =======================================================

  const handleApprove = async () => {

    if (!id) {
      return;
    }


    try {

      setActionLoading(true);

      setActionError("");


      await replacementRequestService
        .approveOrganizationReplacementRequest(
          id,
          remarks
        );


      await loadRequest();

    } catch (err) {

      console.error(
        "Approve Replacement Request Error:",
        err
      );


      setActionError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve replacement request."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // =======================================================
  // REJECT
  // =======================================================

  const handleReject = async () => {

    if (!id) {
      return;
    }


    if (!remarks.trim()) {

      setActionError(
        "Rejection reason is required."
      );

      return;
    }


    try {

      setActionLoading(true);

      setActionError("");


      await replacementRequestService
        .rejectOrganizationReplacementRequest(
          id,
          remarks
        );


      await loadRequest();

    } catch (err) {

      console.error(
        "Reject Replacement Request Error:",
        err
      );


      setActionError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reject replacement request."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="mx-auto flex min-h-[500px] max-w-7xl items-center justify-center">

          <div className="text-center">

            <RefreshCw
              size={34}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 font-semibold text-slate-800">
              Loading replacement request...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Fetching the latest data from the backend.
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error || !request) {

    return (

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >

            <ArrowLeft size={17} />

            Back to Replacement Requests

          </button>


          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-start gap-3">

              <XCircle
                size={22}
                className="mt-0.5 text-red-600"
              />

              <div>

                <h2 className="font-semibold text-red-800">
                  Unable to load replacement request
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error ||
                    "Replacement request was not found."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // DATA
  // =======================================================

  const status =
    request?.status ||
    "Draft";


  const items =
    getItems(request);


  const rejectedQuantity =
    getTotalQuantity(
      request,
      [
        "rejectedQuantity",
        "rejectedQty",
      ]
    );


  const damagedQuantity =
    getTotalQuantity(
      request,
      [
        "damagedQuantity",
        "damagedQty",
      ]
    );


  const replacementQuantity =
    getTotalQuantity(
      request,
      [
        "replacementQuantity",
        "replacementQty",
        "quantity",
      ]
    );


  const acceptedQuantity =
    getTotalQuantity(
      request,
      [
        "acceptedQuantity",
        "acceptedQty",
      ]
    );


  const receivedQuantity =
    getTotalQuantity(
      request,
      [
        "receivedQuantity",
        "receivedQty",
      ]
    );


  const originalPOQuantity =
    getTotalQuantity(
      request,
      [
        "originalPOQuantity",
        "poQuantity",
        "orderedQuantity",
      ]
    );


  const submittedBy =
    request?.requestedBy?.name ||
    request?.requestedBy?.fullName ||
    request?.requestedBy?.email ||
    "-";


  const approvedBy =
    request?.approvedBy?.name ||
    request?.approvedBy?.fullName ||
    request?.approvedBy?.email ||
    "-";


  // =======================================================
  // WORKFLOW STATE
  // =======================================================

  const workflow = [

    [
      "Inspection",
      "Completed",
      true,
    ],

    [
      "Replacement Decision",
      request?.replacementDecision
        ? "Completed"
        : "Required",
      Boolean(
        request?.replacementDecision
      ),
    ],

    [
      "Request",
      "Created",
      true,
    ],

    [
      "Approval",
      status === "Pending Approval"
        ? "Pending"
        : [
            "Approved",
            "Vendor Accepted",
            "Replacement Dispatched",
            "Replacement Received",
            "Replacement Under Inspection",
            "Completed",
          ].includes(status)
          ? "Approved"
          : status === "Rejected"
            ? "Rejected"
            : "Waiting",
      [
        "Approved",
        "Vendor Accepted",
        "Replacement Dispatched",
        "Replacement Received",
        "Replacement Under Inspection",
        "Completed",
      ].includes(status),
    ],

    [
      "Vendor Action",
      [
        "Vendor Accepted",
        "Replacement Dispatched",
        "Replacement Received",
        "Replacement Under Inspection",
        "Completed",
      ].includes(status)
        ? "In Progress"
        : "Waiting",
      [
        "Vendor Accepted",
        "Replacement Dispatched",
        "Replacement Received",
        "Replacement Under Inspection",
        "Completed",
      ].includes(status),
    ],

  ];


  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl space-y-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              type="button"
              onClick={handleBack}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >

              <ArrowLeft size={17} />

              Back to Replacement Requests

            </button>


            <div className="flex flex-wrap items-center gap-3">

              <div>

                <p className="text-sm text-slate-500">
                  Replacement Request
                </p>

                <h1 className="text-2xl font-bold text-slate-900">
                  {getRequestNumber(
                    request
                  )}
                </h1>

              </div>


              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                  status
                )}`}
              >

                {status}

              </span>

            </div>


            <p className="mt-2 text-sm text-slate-500">
              Review the replacement requirement generated from
              Quality Inspection.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            {status === "Draft" && (

              <button
                type="button"
                onClick={handleSubmit}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {actionLoading && (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                )}

                Submit for Approval

              </button>

            )}


            {status === "Pending Approval" && (

              <>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <XCircle size={16} />

                  Reject

                </button>


                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <CheckCircle2 size={16} />

                  Approve

                </button>

              </>

            )}

          </div>

        </div>


        {/* =================================================
            ACTION ERROR
        ================================================= */}

        {actionError && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {actionError}

          </div>

        )}


        {/* =================================================
            WORKFLOW STATUS
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-5 md:grid-cols-5">

            {workflow.map(
              (
                [
                  title,
                  workflowStatus,
                  completed,
                ],
                index
              ) => (

                <div
                  key={title}
                  className="relative"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        completed
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >

                      {completed ? (
                        <CheckCircle2
                          size={18}
                        />
                      ) : (
                        <Clock3
                          size={18}
                        />
                      )}

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        {title}
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        {workflowStatus}
                      </p>

                    </div>

                  </div>


                  {index < 4 && (

                    <div className="absolute left-9 top-5 hidden h-px w-full bg-slate-200 md:block" />

                  )}

                </div>

              )
            )}

          </div>

        </div>


        {/* =================================================
            ORIGINAL TRANSACTION
        ================================================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <FileText
              size={18}
              className="text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Original Transaction
              </h2>

              <p className="text-xs text-slate-500">
                Source transaction from which the replacement was generated.
              </p>

            </div>

          </div>


          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              [
                "PO Number",
                getPONumber(request),
              ],

              [
                "GRN Number",
                getGRNNumber(request),
              ],

              [
                "Quality Inspection",
                getInspectionNumber(request),
              ],

              [
                "Original Dispatch",
                getDispatchNumber(request),
              ],

              [
                "Vendor",
                getVendorName(request),
              ],

              [
                "Inspection Date",
                formatDate(
                  request?.inspectionDate ||
                  request?.qualityInspection?.inspectionDate
                ),
              ],

              [
                "Inspection Status",
                request?.qualityInspection?.status ||
                request?.inspectionStatus ||
                "Completed",
              ],

              [
                "Replacement Required",
                "Yes",
              ],

            ].map(
              ([
                label,
                value,
              ]) => (

                <div
                  key={label}
                  className="rounded-lg bg-slate-50 p-4"
                >

                  <p className="text-xs font-medium text-slate-500">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {value || "-"}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* =================================================
            INSPECTION RESULT
        ================================================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <PackageCheck
              size={18}
              className="text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Quality Inspection Result
              </h2>

              <p className="text-xs text-slate-500">
                Quantities used to determine the replacement requirement.
              </p>

            </div>

          </div>


          <div className="mt-5 overflow-x-auto">

            <table className="min-w-[850px] w-full text-sm">

              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                <tr>

                  <th className="px-4 py-3">
                    Material
                  </th>

                  <th className="px-4 py-3 text-right">
                    Received
                  </th>

                  <th className="px-4 py-3 text-right">
                    Inspected
                  </th>

                  <th className="px-4 py-3 text-right">
                    Accepted
                  </th>

                  <th className="px-4 py-3 text-right">
                    Rejected
                  </th>

                  <th className="px-4 py-3 text-right">
                    Damaged
                  </th>

                  <th className="px-4 py-3 text-right">
                    Replacement
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {items.length > 0 ? (

                  items.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                      >

                        <td className="px-4 py-4 font-semibold text-slate-800">

                          {getMaterialName(
                            item
                          )}

                        </td>

                        <td className="px-4 py-4 text-right">

                          {getQuantity(
                            item,
                            "receivedQuantity",
                            "receivedQty"
                          )}

                        </td>

                        <td className="px-4 py-4 text-right">

                          {getQuantity(
                            item,
                            "inspectedQuantity",
                            "inspectedQty"
                          )}

                        </td>

                        <td className="px-4 py-4 text-right text-emerald-600">

                          {getQuantity(
                            item,
                            "acceptedQuantity",
                            "acceptedQty"
                          )}

                        </td>

                        <td className="px-4 py-4 text-right text-red-600">

                          {getQuantity(
                            item,
                            "rejectedQuantity",
                            "rejectedQty"
                          )}

                        </td>

                        <td className="px-4 py-4 text-right text-orange-600">

                          {getQuantity(
                            item,
                            "damagedQuantity",
                            "damagedQty"
                          )}

                        </td>

                        <td className="px-4 py-4 text-right font-bold text-blue-600">

                          {getQuantity(
                            item,
                            "replacementQuantity",
                            "replacementQty",
                            "quantity"
                          )}

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >

                      No inspection item details are available.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            REPLACEMENT REQUEST DETAILS
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">

            <h2 className="font-semibold text-slate-900">
              Replacement Request Details
            </h2>


            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <div>

                <p className="text-xs text-slate-500">
                  Replacement Reason
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {request?.reason ||
                    "Not specified"}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-500">
                  Required Replacement Date
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(
                    request?.requiredReplacementDate
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-500">
                  Requested Quantity
                </p>

                <p className="mt-1 font-semibold text-blue-600">
                  {replacementQuantity}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-500">
                  Replacement Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                    status
                  )}`}
                >

                  {status}

                </span>

              </div>

            </div>


            <div className="mt-6">

              <p className="text-xs font-medium text-slate-500">
                Quality Manager Remarks
              </p>

              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">

                {request?.remarks ||
                  "No remarks provided."}

              </div>

            </div>


            {status === "Pending Approval" && (

              <div className="mt-6">

                <p className="text-xs font-medium text-slate-500">

                  Approval / Rejection Remarks

                </p>

                <textarea
                  rows="4"
                  value={remarks}
                  onChange={(event) =>
                    setRemarks(
                      event.target.value
                    )
                  }
                  placeholder="Enter approval remarks or rejection reason..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            )}

          </section>


          {/* =================================================
              QUANTITY SUMMARY
          ================================================= */}

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Quantity Summary
            </h2>


            <div className="mt-5 space-y-4">

              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-sm text-slate-500">
                  Original PO Quantity
                </span>

                <span className="font-semibold text-slate-800">
                  {originalPOQuantity}
                </span>

              </div>


              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-sm text-slate-500">
                  Received Quantity
                </span>

                <span className="font-semibold text-slate-700">
                  {receivedQuantity}
                </span>

              </div>


              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-sm text-slate-500">
                  Accepted Quantity
                </span>

                <span className="font-semibold text-emerald-600">
                  {acceptedQuantity}
                </span>

              </div>


              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-sm text-slate-500">
                  Rejected Quantity
                </span>

                <span className="font-semibold text-red-600">
                  {rejectedQuantity}
                </span>

              </div>


              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-sm text-slate-500">
                  Damaged Quantity
                </span>

                <span className="font-semibold text-orange-600">
                  {damagedQuantity}
                </span>

              </div>


              <div className="flex items-center justify-between pt-1">

                <span className="text-sm font-semibold text-slate-700">
                  Replacement Quantity
                </span>

                <span className="text-lg font-bold text-blue-600">
                  {replacementQuantity}
                </span>

              </div>

            </div>

          </aside>

        </div>


        {/* =================================================
            SUPPORTING INFORMATION
        ================================================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Supporting Information
          </h2>


          <div className="mt-5 grid gap-6 lg:grid-cols-2">

            <div>

              <p className="text-xs font-medium text-slate-500">
                Inspection Documents
              </p>

              <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">

                {Array.isArray(
                  request?.documents
                ) &&
                request.documents.length > 0 ? (

                  <div className="space-y-2">

                    {request.documents.map(
                      (
                        document,
                        index
                      ) => (

                        <div
                          key={
                            document?._id ||
                            document?.id ||
                            index
                          }
                          className="flex items-center gap-2"
                        >

                          <FileText
                            size={16}
                            className="text-blue-600"
                          />

                          <span>
                            {document?.fileName ||
                              document?.name ||
                              `Document ${index + 1}`}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  "No supporting documents are attached."

                )}

              </div>

            </div>


            <div>

              <p className="text-xs font-medium text-slate-500">
                Request Information
              </p>

              <div className="mt-2 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">

                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Requested By
                  </span>

                  <span className="font-semibold text-slate-800">
                    {submittedBy}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Requested Date
                  </span>

                  <span className="font-semibold text-slate-800">
                    {formatDate(
                      request?.createdAt
                    )}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Approved By
                  </span>

                  <span className="font-semibold text-slate-800">
                    {approvedBy}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-slate-500">
                    Approved Date
                  </span>

                  <span className="font-semibold text-slate-800">
                    {formatDate(
                      request?.approvedAt
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="flex flex-col justify-end gap-3 sm:flex-row">

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >

            <ArrowLeft size={17} />

            Back

          </button>


          {status === "Draft" && (

            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <CheckCircle2 size={17} />

              Submit for Approval

            </button>

          )}


          {status === "Pending Approval" && (

            <>

              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <XCircle size={17} />

                Reject

              </button>


              <button
                type="button"
                onClick={handleApprove}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <CheckCircle2 size={17} />

                Approve

              </button>

            </>

          )}

        </div>


        {/* =================================================
            BUSINESS RULE
        ================================================= */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">

          <p className="font-semibold">
            Replacement Quantity Rule
          </p>

          <p className="mt-1">
            Replacement quantity is tracked separately from the
            original PO quantity. It must not increase the original
            PO quantity or original fulfillment quantity.
          </p>

        </div>

      </div>

    </div>
  );
}