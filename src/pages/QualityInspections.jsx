import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardCheck,
  RefreshCw,
  Plus,
  Search,
  Eye,
  Play,
} from "lucide-react";

import {
  getAllQualityInspections,
} from "../services/qualityInspectionService";


const QualityInspections = () => {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [inspections, setInspections] = useState([]);

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
      limit: 10,
    });


  // =====================================================
  // LOAD INSPECTIONS
  // =====================================================

  const loadInspections = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getAllQualityInspections(
          page,
          10,
          search,
          status
        );


      if (
        response?.data &&
        Array.isArray(response.data)
      ) {

        setInspections(
          response.data
        );

      } else if (
        Array.isArray(response)
      ) {

        setInspections(
          response
        );

      } else {

        setInspections([]);

      }


      if (response?.pagination) {

        setPagination(
          response.pagination
        );

      }

    } catch (err) {

      console.error(
        "Load Quality Inspections Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load quality inspections."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL / FILTER LOAD
  // =====================================================

  useEffect(() => {

    loadInspections();

  }, [
    page,
    status,
  ]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {

    setSearch(
      event.target.value
    );

    setPage(1);

  };


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {

    loadInspections();

  };


  // =====================================================
  // CREATE INSPECTION
  // =====================================================

  const handleCreateInspection = () => {

    navigate(
      "/quality-inspection/create"
    );

  };


  // =====================================================
  // OPEN INSPECTION
  // =====================================================

  const handleOpenInspection = (
    inspection
  ) => {

    if (!inspection?._id) {

      console.error(
        "Inspection ID is missing:",
        inspection
      );

      return;

    }


    const inspectionStatus =
      inspection.status || "Draft";

    // For completed or submitted inspections, open the details
    if (
      inspectionStatus === "Completed" ||
      inspectionStatus === "Submitted"
    ) {
      navigate(
        `/quality-inspection/inspections/${inspection._id}`
      );
      return;
    }

    // For drafts, resume at the step where it was last drafted
    const step = Number(inspection.currentStep) || 2;
    switch (step) {
      case 3:
        navigate(
          `/quality-inspection/inspections/${inspection._id}/material-inspection`
        );
        break;
      case 4:
        navigate(
          `/quality-inspection/inspections/${inspection._id}/specifications`
        );
        break;
      case 5:
        navigate(
          `/quality-inspection/inspections/${inspection._id}/defects-documents`
        );
        break;
      case 6:
        navigate(
          `/quality-inspection/inspections/${inspection._id}/final-decision`
        );
        break;
      case 2:
      default:
        navigate(
          `/quality-inspection/inspections/${inspection._id}`
        );
        break;
    }

  };


  // =====================================================
  // ACTION LABEL
  // =====================================================

  const getActionLabel = (
    inspectionStatus
  ) => {

    switch (
      inspectionStatus
    ) {

      case "Draft":

        return "Continue";

      case "In Progress":

        return "Continue";

      default:

        return "View";

    }

  };


  // =====================================================
  // ACTION ICON
  // =====================================================

  const getActionIcon = (
    inspectionStatus
  ) => {

    if (
      inspectionStatus === "Draft" ||
      inspectionStatus === "In Progress"
    ) {

      return (
        <Play size={15} />
      );

    }

    return (
      <Eye size={15} />
    );

  };


  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (
    inspectionStatus
  ) => {

    switch (
      inspectionStatus
    ) {

      case "Draft":

        return (
          "bg-slate-100 text-slate-700"
        );

      case "In Progress":

        return (
          "bg-blue-100 text-blue-700"
        );

      case "Completed":

        return (
          "bg-green-100 text-green-700"
        );

      case "Rejected":

        return (
          "bg-red-100 text-red-700"
        );

      case "Conditional":

        return (
          "bg-yellow-100 text-yellow-700"
        );

      default:

        return (
          "bg-slate-100 text-slate-600"
        );

    }

  };


  // =====================================================
  // RESULT BADGE
  // =====================================================

  const getResultClass = (
    result
  ) => {

    switch (
      result
    ) {

      case "Accepted":

        return (
          "bg-green-100 text-green-700"
        );

      case "Partially Accepted":

        return (
          "bg-yellow-100 text-yellow-700"
        );

      case "Accepted with Damage":

        return (
          "bg-blue-100 text-blue-700"
        );

      case "Rejected":

        return (
          "bg-red-100 text-red-700"
        );

      case "Conditional":
      case "Conditional Acceptance":

        return (
          "bg-orange-100 text-orange-700"
        );

      case "Hold":

        return (
          "bg-purple-100 text-purple-700"
        );

      default:

        return (
          "bg-slate-100 text-slate-600"
        );

    }

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {

      return "-";

    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">

              <ClipboardCheck
                size={23}
              />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-slate-800">

                Quality Inspections

              </h1>


              <p className="mt-1 text-sm text-slate-500">

                Manage material quality inspections,
                results and inspection history.

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex items-center gap-2">


          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >

            <RefreshCw
              size={17}
            />

            Refresh

          </button>


          <button
            type="button"
            onClick={
              handleCreateInspection
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >

            <Plus
              size={18}
            />

            Create Inspection

          </button>

        </div>

      </div>


      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />


            <input
              type="text"
              value={search}
              onChange={
                handleSearch
              }
              placeholder="Search inspection..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >

            <option value="">
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

            <option value="Rejected">
              Rejected
            </option>

            <option value="Conditional">
              Conditional
            </option>

          </select>


          {/* SUMMARY */}

          <div className="flex items-center rounded-xl bg-slate-50 px-4 py-2.5">

            <span className="text-sm text-slate-500">

              Total Inspections:

            </span>


            <span className="ml-2 font-bold text-slate-800">

              {
                pagination.total ||
                inspections.length
              }

            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          {error}

        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


        <div className="overflow-x-auto">

          <table className="min-w-full">


            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Inspection

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  GRN

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  PO

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Vendor

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Inspection Date

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Status

                </th>


                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Result

                </th>


                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">

                  Action

                </th>

              </tr>

            </thead>


            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody className="divide-y divide-slate-100">


              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />


                    <p className="mt-3 text-sm text-slate-500">

                      Loading inspections...

                    </p>

                  </td>

                </tr>


              ) : inspections.length === 0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center"
                  >

                    <ClipboardCheck
                      size={42}
                      className="mx-auto text-slate-300"
                    />


                    <p className="mt-3 font-semibold text-slate-700">

                      No inspections found

                    </p>


                    <p className="mt-1 text-sm text-slate-400">

                      There are currently no quality
                      inspections matching your filters.

                    </p>

                  </td>

                </tr>


              ) : (

                /* DATA */

                inspections.map(
                  (inspection) => {

                    const inspectionId =
                      inspection._id;


                    const inspectionStatus =
                      inspection.status ||
                      "Draft";


                    const actionLabel =
                      getActionLabel(
                        inspectionStatus
                      );


                    return (

                      <tr
                        key={
                          inspectionId
                        }
                        className="transition hover:bg-slate-50"
                      >


                        {/* INSPECTION */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-800">

                            {
                              inspection.inspectionNumber ||
                              inspection.inspectionNo ||
                              "-"
                            }

                          </p>

                        </td>


                        {/* GRN */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">

                            {
                              inspection
                                .goodsReceipt
                                ?.grnNumber ||

                              inspection
                                .grn
                                ?.grnNumber ||

                              "-"
                            }

                          </span>

                        </td>


                        {/* PO */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-600">

                            {
                              inspection
                                .purchaseOrder
                                ?.poNumber ||

                              inspection
                                .goodsReceipt
                                ?.purchaseOrder
                                ?.poNumber ||

                              "-"
                            }

                          </span>

                        </td>


                        {/* VENDOR */}

                        <td className="px-5 py-4">

                          <div>

                            <p className="text-sm font-medium text-slate-700">

                              {
                                inspection
                                  .vendor
                                  ?.vendorName ||
                                "-"
                              }

                            </p>


                            <p className="text-xs text-slate-400">

                              {
                                inspection
                                  .vendor
                                  ?.vendorCode ||
                                ""
                              }

                            </p>

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-600">

                            {
                              formatDate(
                                inspection.inspectionDate ||
                                inspection.createdAt
                              )
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClass(
                                inspectionStatus
                              )}
                            `}
                          >

                            {
                              inspectionStatus
                            }

                          </span>

                        </td>


                        {/* RESULT */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getResultClass(
                                inspection.overallResult ||
                                inspection.result
                              )}
                            `}
                          >

                            {
                              inspection.overallResult ||
                              inspection.result ||
                              "Pending"
                            }

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenInspection(
                                inspection
                              )
                            }
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              transition

                              ${
                                inspectionStatus ===
                                  "Draft" ||
                                inspectionStatus ===
                                  "In Progress"

                                  ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"

                                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              }
                            `}
                          >

                            {
                              getActionIcon(
                                inspectionStatus
                              )
                            }


                            {
                              actionLabel
                            }

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          inspections.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">


              <p className="text-sm text-slate-500">

                Page{" "}

                <span className="font-semibold text-slate-700">

                  {page}

                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">

                  {
                    pagination.pages ||
                    1
                  }

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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Previous

                </button>


                <button
                  type="button"
                  disabled={
                    page >=
                    (
                      pagination.pages ||
                      1
                    )
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Next

                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );

};


export default QualityInspections;