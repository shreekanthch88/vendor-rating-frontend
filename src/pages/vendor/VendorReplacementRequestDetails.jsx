import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Package,
  RefreshCw,
  Truck,
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

import vendorReplacementRequestService
  from "../../services/vendorReplacementRequestService";


export default function VendorReplacementRequestDetails() {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [
    replacementRequest,
    setReplacementRequest,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    accepting,
    setAccepting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    vendorRemarks,
    setVendorRemarks,
  ] = useState("");


  const [
    showAcceptBox,
    setShowAcceptBox,
  ] = useState(false);


  // =========================================================
  // LOAD REQUEST
  // =========================================================

  useEffect(() => {

    loadReplacementRequest();

  }, [id]);


  const loadReplacementRequest =
    async () => {

      try {

        setLoading(true);

        setError("");

        setSuccess("");


        const response =
          await vendorReplacementRequestService
            .getVendorReplacementRequestById(
              id
            );


        const data =
          response?.data ||
          response;


        setReplacementRequest(
          data
        );


      } catch (err) {

        console.error(
          "Failed to load vendor replacement request:",
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


  // =========================================================
  // ACCEPT REQUEST
  // =========================================================

  const handleAccept =
    async () => {

      try {

        setAccepting(true);

        setError("");

        setSuccess("");


        const response =
          await vendorReplacementRequestService
            .acceptReplacementRequest(
              id,
              vendorRemarks.trim()
            );


        const updatedRequest =
          response?.data ||
          response?.replacementRequest ||
          response;


        if (
          updatedRequest &&
          typeof updatedRequest === "object"
        ) {

          setReplacementRequest(
            updatedRequest
          );

        } else {

          await loadReplacementRequest();

        }


        setSuccess(
          "Replacement request accepted successfully."
        );


        setShowAcceptBox(
          false
        );


      } catch (err) {

        console.error(
          "Accept replacement request error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to accept replacement request."
        );

      } finally {

        setAccepting(false);

      }

    };


  // =========================================================
  // HELPERS
  // =========================================================

  const getStatus =
    () => {

      return (
        replacementRequest?.status ||
        replacementRequest?.requestStatus ||
        "-"
      );

    };


  const getStatusClass =
    () => {

      const status =
        String(
          getStatus()
        ).toLowerCase();


      if (
        status === "approved"
      ) {

        return "bg-blue-50 text-blue-700 border-blue-200";

      }


      if (
        status.includes("accepted")
      ) {

        return "bg-green-50 text-green-700 border-green-200";

      }


      if (
        status.includes("rejected")
      ) {

        return "bg-red-50 text-red-700 border-red-200";

      }


      if (
        status.includes("pending")
      ) {

        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      }


      return "bg-slate-50 text-slate-700 border-slate-200";

    };


  const getRequestNumber =
    () => {

      return (
        replacementRequest?.replacementRequestNumber ||
        replacementRequest?.requestNumber ||
        replacementRequest?.replacementNumber ||
        replacementRequest?._id ||
        "-"
      );

    };


  const getPONumber =
    () => {

      const purchaseOrder =
        replacementRequest?.purchaseOrder;


      if (
        typeof purchaseOrder === "object" &&
        purchaseOrder !== null
      ) {

        return (
          purchaseOrder?.poNumber ||
          purchaseOrder?.purchaseOrderNumber ||
          purchaseOrder?._id ||
          "-"
        );

      }


      return (
        replacementRequest?.poNumber ||
        purchaseOrder ||
        "-"
      );

    };


  const getVendorName =
    () => {

      const vendor =
        replacementRequest?.vendor;


      if (
        typeof vendor === "object" &&
        vendor !== null
      ) {

        return (
          vendor?.vendorName ||
          vendor?.companyName ||
          vendor?.name ||
          "-"
        );

      }


      return (
        vendor ||
        "-"
      );

    };


  const getInspectionNumber =
    () => {

      const inspection =
        replacementRequest?.qualityInspection;


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
        replacementRequest?.qualityInspectionNumber ||
        inspection ||
        "-"
      );

    };


  const getReason =
    () => {

      return (
        replacementRequest?.reason ||
        "-"
      );

    };


  const getRequiredDate =
    () => {

      if (
        !replacementRequest?.requiredReplacementDate
      ) {

        return "-";

      }


      return new Date(
        replacementRequest.requiredReplacementDate
      ).toLocaleDateString();

    };


  const getItems =
    () => {

      return Array.isArray(
        replacementRequest?.items
      )
        ? replacementRequest.items
        : [];

    };


  const getReplacementQuantity =
    (item) => {

      return Number(
        item?.replacementQuantity ||
        0
      );

    };


  const getTotalReplacementQuantity =
    () => {

      return getItems().reduce(
        (
          total,
          item
        ) =>
          total +
          getReplacementQuantity(
            item
          ),
        0
      );

    };


  const getTotalRejected =
    () => {

      return getItems().reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item?.rejectedQuantity ||
            0
          ),
        0
      );

    };


  const getTotalDamaged =
    () => {

      return getItems().reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item?.damagedQuantity ||
            0
          ),
        0
      );

    };


  const getTotalShort =
    () => {

      return getItems().reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item?.shortQuantity ||
            0
          ),
        0
      );

    };


  const canAccept =
    String(
      getStatus()
    ).toLowerCase() === "approved";


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="flex items-center gap-3 text-slate-600">

          <RefreshCw
            size={20}
            className="animate-spin"
          />

          Loading Replacement Request...

        </div>

      </div>

    );

  }


  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (
    !replacementRequest
  ) {

    return (

      <div className="p-6">

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="font-semibold text-red-700">
            Replacement Request could not be loaded.
          </p>


          <p className="mt-1 text-sm text-red-600">
            {error ||
              "The requested replacement request does not exist."}
          </p>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/vendor/replacement-requests"
              )
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >

            <ArrowLeft
              size={16}
            />

            Back to Replacement Requests

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl space-y-6">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/vendor/replacement-requests"
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >

            <ArrowLeft
              size={17}
            />

            Back to Replacement Requests

          </button>


          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

            <div>

              <p className="text-sm text-slate-500">
                Vendor Portal / Replacement Request
              </p>


              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Replacement Request
              </h1>


              <p className="mt-1 text-sm text-slate-500">
                Review the replacement requirement and respond
                to the organization.
              </p>

            </div>


            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass()}`}
            >

              {String(
                getStatus()
              ).toLowerCase() === "approved" ? (

                <CheckCircle2
                  size={17}
                />

              ) : (

                <Clock3
                  size={17}
                />

              )}

              {getStatus()}

            </div>

          </div>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* ===================================================
            SUCCESS
        =================================================== */}

        {success && (

          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">

            <CheckCircle2
              size={18}
            />

            {success}

          </div>

        )}


        {/* ===================================================
            REQUEST SUMMARY
        =================================================== */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <FileText
              size={20}
              className="text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Request Summary
              </h2>

              <p className="text-xs text-slate-500">
                Details provided by the organization.
              </p>

            </div>

          </div>


          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Replacement Request
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getRequestNumber()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Purchase Order
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getPONumber()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Quality Inspection
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getInspectionNumber()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Vendor
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getVendorName()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Replacement Reason
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getReason()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Required Replacement Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getRequiredDate()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Requested Quantity
              </p>

              <p className="mt-1 font-semibold text-blue-700">
                {getTotalReplacementQuantity()}
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs text-slate-500">
                Created Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">

                {replacementRequest?.createdAt
                  ? new Date(
                      replacementRequest.createdAt
                    ).toLocaleDateString()
                  : "-"}

              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            QUANTITY SUMMARY
        =================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm text-red-600">
              Rejected
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">
              {getTotalRejected()}
            </p>

          </div>


          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

            <p className="text-sm text-orange-600">
              Damaged
            </p>

            <p className="mt-1 text-2xl font-bold text-orange-700">
              {getTotalDamaged()}
            </p>

          </div>


          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

            <p className="text-sm text-yellow-700">
              Short
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-800">
              {getTotalShort()}
            </p>

          </div>


          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

            <p className="text-sm text-blue-600">
              Replacement Required
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {getTotalReplacementQuantity()}
            </p>

          </div>

        </section>


        {/* ===================================================
            REPLACEMENT ITEMS
        =================================================== */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <Package
              size={20}
              className="text-blue-600"
            />

            <div>

              <h2 className="font-semibold text-slate-900">
                Replacement Items
              </h2>

              <p className="text-xs text-slate-500">
                Materials and quantities that must be replaced.
              </p>

            </div>

          </div>


          <div className="mt-5 overflow-x-auto">

            <table className="min-w-[1000px] w-full text-sm">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-4 py-3">
                    Material
                  </th>

                  <th className="px-4 py-3">
                    Material Code
                  </th>

                  <th className="px-4 py-3">
                    UOM
                  </th>

                  <th className="px-4 py-3 text-right">
                    Rejected
                  </th>

                  <th className="px-4 py-3 text-right">
                    Damaged
                  </th>

                  <th className="px-4 py-3 text-right">
                    Short
                  </th>

                  <th className="px-4 py-3 text-right">
                    Replacement
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {getItems().length > 0 ? (

                  getItems().map(
                    (
                      item,
                      index
                    ) => {

                      const material =
                        item?.material;


                      const materialName =
                        item?.materialName ||
                        item?.itemName ||
                        material?.materialName ||
                        material?.name ||
                        "-";


                      const materialCode =
                        item?.materialCode ||
                        material?.materialCode ||
                        "-";


                      const unitOfMeasure =
                        item?.unitOfMeasure ||
                        item?.uom ||
                        material?.unitOfMeasure ||
                        "-";


                      return (

                        <tr
                          key={
                            item?._id ||
                            item?.material?._id ||
                            index
                          }
                          className="hover:bg-slate-50"
                        >

                          <td className="px-4 py-4 font-semibold text-slate-800">

                            {materialName}

                          </td>


                          <td className="px-4 py-4 text-slate-600">

                            {materialCode}

                          </td>


                          <td className="px-4 py-4 text-slate-600">

                            {unitOfMeasure}

                          </td>


                          <td className="px-4 py-4 text-right text-red-600">

                            {Number(
                              item?.rejectedQuantity ||
                              0
                            )}

                          </td>


                          <td className="px-4 py-4 text-right text-orange-600">

                            {Number(
                              item?.damagedQuantity ||
                              0
                            )}

                          </td>


                          <td className="px-4 py-4 text-right text-yellow-700">

                            {Number(
                              item?.shortQuantity ||
                              0
                            )}

                          </td>


                          <td className="px-4 py-4 text-right font-bold text-blue-700">

                            {Number(
                              item?.replacementQuantity ||
                              0
                            )}

                          </td>

                        </tr>

                      );

                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-slate-500"
                    >

                      No replacement items found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ===================================================
            ORGANIZATION REMARKS
        =================================================== */}

        {replacementRequest?.remarks && (

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Organization Remarks
            </h2>


            <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">

              {replacementRequest.remarks}

            </div>

          </section>

        )}


        {/* ===================================================
            APPROVAL INFORMATION
        =================================================== */}

        {replacementRequest?.approval && (

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-semibold text-slate-900">
              Approval Information
            </h2>


            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Approval Status
                </p>

                <p className="mt-1 font-semibold text-slate-800">

                  {replacementRequest?.approval?.status ||
                    "Approved"}

                </p>

              </div>


              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Approval Date
                </p>

                <p className="mt-1 font-semibold text-slate-800">

                  {replacementRequest?.approval?.approvedAt
                    ? new Date(
                        replacementRequest.approval.approvedAt
                      ).toLocaleDateString()
                    : "-"}

                </p>

              </div>


              {replacementRequest?.approval?.remarks && (

                <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">

                  <p className="text-xs text-slate-500">
                    Approval Remarks
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {replacementRequest.approval.remarks}
                  </p>

                </div>

              )}

            </div>

          </section>

        )}


        {/* ===================================================
            ACCEPT ACTION
        =================================================== */}

        {canAccept && (

          <section className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">

            {!showAcceptBox ? (

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={20}
                      className="text-blue-600"
                    />

                    <h2 className="font-semibold text-slate-900">
                      Vendor Action Required
                    </h2>

                  </div>


                  <p className="mt-1 text-sm text-slate-500">

                    Please review the replacement quantities before
                    accepting this request.

                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setShowAcceptBox(
                      true
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >

                  <CheckCircle2
                    size={17}
                  />

                  Accept Replacement Request

                </button>

              </div>

            ) : (

              <div>

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={20}
                    className="text-blue-600"
                  />

                  <h2 className="font-semibold text-slate-900">
                    Confirm Replacement Acceptance
                  </h2>

                </div>


                <p className="mt-2 text-sm text-slate-500">

                  By accepting this request, you confirm that your
                  organization will arrange the replacement materials
                  according to the approved quantities.

                </p>


                <div className="mt-4 rounded-lg bg-blue-50 p-4">

                  <p className="text-sm font-semibold text-blue-800">
                    Total Replacement Quantity
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {getTotalReplacementQuantity()}
                  </p>

                </div>


                <div className="mt-5">

                  <label className="text-sm font-medium text-slate-700">

                    Vendor Remarks

                    <span className="ml-1 text-xs font-normal text-slate-400">
                      (Optional)
                    </span>

                  </label>


                  <textarea
                    rows="4"
                    value={
                      vendorRemarks
                    }
                    onChange={
                      (event) =>
                        setVendorRemarks(
                          event.target.value
                        )
                    }
                    placeholder="Enter remarks regarding replacement acceptance..."
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAcceptBox(
                        false
                      )
                    }
                    disabled={
                      accepting
                    }
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >

                    Cancel

                  </button>


                  <button
                    type="button"
                    onClick={
                      handleAccept
                    }
                    disabled={
                      accepting
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {accepting ? (

                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                    ) : (

                      <CheckCircle2
                        size={17}
                      />

                    )}

                    {accepting
                      ? "Accepting..."
                      : "Confirm & Accept"}

                  </button>

                </div>

              </div>

            )}

          </section>

        )}


        {/* ===================================================
            ACCEPTED STATE
        =================================================== */}

        {String(
          getStatus()
        ).toLowerCase().includes("accepted") && (

          <section className="rounded-xl border border-green-200 bg-green-50 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={22}
                className="mt-0.5 text-green-600"
              />

              <div>

                <h2 className="font-semibold text-green-800">
                  Replacement Request Accepted
                </h2>

                <p className="mt-1 text-sm text-green-700">

                  You have accepted this replacement request.
                  The next step is to create and submit the
                  replacement dispatch.

                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/vendor/replacement-requests/${id}/dispatch`
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >

                  <Truck
                    size={17}
                  />

                  Create Replacement Dispatch

                </button>

              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            REJECTED STATE
        =================================================== */}

        {String(
          getStatus()
        ).toLowerCase().includes("rejected") && (

          <section className="rounded-xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <XCircle
                size={22}
                className="mt-0.5 text-red-600"
              />

              <div>

                <h2 className="font-semibold text-red-800">
                  Replacement Request Rejected
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  This replacement request is no longer available
                  for vendor acceptance.
                </p>

              </div>

            </div>

          </section>

        )}

      </div>

    </div>

  );

}