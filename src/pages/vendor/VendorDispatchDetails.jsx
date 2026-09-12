import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaTruck,
  FaBox,
  FaLocationDot,
  FaFileLines,
  FaCircleCheck,
  FaClock,
} from "react-icons/fa6";

import {
  getVendorDispatchById,
  updateVendorDispatchStatus,
} from "../../services/vendorDispatchService";


const VendorDispatchDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [dispatch, setDispatch] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

const [updatingStatus, setUpdatingStatus] =
  useState(false);

const [statusRemarks, setStatusRemarks] =
  useState("");

const [statusLocation, setStatusLocation] =
  useState("");

const [nextStatus, setNextStatus] =
  useState("");
  // =====================================================
  // LOAD DISPATCH
  // =====================================================

  useEffect(() => {

    const loadDispatch = async () => {

      try {

        setLoading(true);

        const response =
          await getVendorDispatchById(id);

        console.log(
          "Dispatch Details Response:",
          response
        );

        setDispatch(
          response?.data || null
        );

      } catch (error) {

        console.error(
          "Dispatch Details Error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load dispatch."
        );

      } finally {

        setLoading(false);

      }
    };


    if (id) {
      loadDispatch();
    }

  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-sm text-slate-500">
          Loading dispatch details...
        </div>

      </div>

    );

  }


  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!dispatch) {

    return (

      <div className="p-6">

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

          <p className="text-sm text-slate-500">
            Dispatch not found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/vendor/dispatches")
            }
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Dispatches
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (value) => {

    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
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


  const statusClass = {

    Draft:
      "bg-slate-100 text-slate-700",

    Dispatched:
      "bg-blue-100 text-blue-700",

    "In Transit":
      "bg-orange-100 text-orange-700",

    Delivered:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

  };


  const status =
    dispatch.status || "Draft";

  // =====================================================
  // UPDATE DISPATCH STATUS
  // =====================================================

  const handleStatusUpdate = async (nextStatus) => {
    if (!dispatch?._id) {
      toast.error("Dispatch ID is missing.");
      return;
    }

    const resolvedLocation =
      nextStatus === "Delivered"
        ? (dispatch?.purchaseOrder?.deliveryLocation || statusLocation || "")
        : statusLocation;

    try {
      setUpdatingStatus(true);

      const response = await updateVendorDispatchStatus(
        dispatch._id,
        {
          status: nextStatus,
          remarks: statusRemarks,
          location: resolvedLocation,
        }
      );

      console.log(
        "Updated Dispatch Status:",
        response
      );

      setDispatch(
        response?.data || dispatch
      );

      setStatusRemarks("");
      setStatusLocation("");
      setNextStatus("");

      toast.success(
        response?.message ||
        "Dispatch status updated successfully."
      );

    } catch (error) {

      console.error(
        "Status Update Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update dispatch status."
      );

    } finally {

      setUpdatingStatus(false);

    }
  };

// =====================================================
// REAL TRACKING HISTORY
// =====================================================

const trackingHistory = Array.isArray(
  dispatch.trackingHistory
)
  ? [...dispatch.trackingHistory].sort(
      (a, b) =>
        new Date(a.updatedAt) -
        new Date(b.updatedAt)
    )
  : [];


  return (

    <div className="space-y-6 p-6">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/vendor/dispatches")
            }
            className="mt-1 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <FaArrowLeft />
          </button>

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-xl font-semibold text-slate-800">
                {dispatch.dispatchNumber}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusClass[status] ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {status}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Purchase Order:{" "}
              <span className="font-medium text-slate-700">
                {dispatch.purchaseOrder?.poNumber ||
                  "—"}
              </span>
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          DISPATCH SUMMARY
          ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-xs text-slate-400">
            Dispatch Date
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatDate(
              dispatch.dispatchDate
            )}
          </p>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-xs text-slate-400">
            Expected Delivery
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatDate(
              dispatch.expectedDeliveryDate
            )}
          </p>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-xs text-slate-400">
            Dispatch Type
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {dispatch.dispatchType ||
              "—"}
          </p>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-xs text-slate-400">
            Vendor
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {dispatch.vendor?.vendorName ||
              "—"}
          </p>

        </div>

      </div>


      {/* =================================================
          TRACKING TIMELINE
          ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-base font-semibold text-slate-800">
            Shipment Tracking
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current status and shipment progress.
          </p>

        </div>


        <div className="p-6">

          <div className="p-6">

  {trackingHistory.length > 0 ? (

    <div className="relative">

      {trackingHistory.map(
        (item, index) => {

          const isLast =
            index ===
            trackingHistory.length - 1;

          return (

            <div
              key={
                item._id ||
                `${item.status}-${item.updatedAt}-${index}`
              }
              className="relative flex gap-4 pb-8 last:pb-0"
            >

              {/* Vertical line */}

              {!isLast && (

                <div className="absolute left-[17px] top-9 h-full w-px bg-slate-200" />

              )}


              {/* Status Icon */}

              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  item.status === "Delivered"
                    ? "bg-green-600 text-white"
                    : item.status === "In Transit"
                    ? "bg-orange-500 text-white"
                    : item.status === "Cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >

                {item.status === "Delivered" ? (
                  <FaCircleCheck />
                ) : item.status === "In Transit" ? (
                  <FaTruck />
                ) : (
                  <FaClock />
                )}

              </div>


              {/* Tracking Information */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      {item.status}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.updatedAt
                        ? new Date(
                            item.updatedAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "—"}
                    </p>

                  </div>

                </div>


                {/* Location */}

                {item.location && (

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">

                    <FaLocationDot className="text-blue-600" />

                    <span>
                      {item.location}
                    </span>

                  </div>

                )}


                {/* Remarks */}

                {item.remarks && (

                  <div className="mt-2 rounded-lg bg-slate-50 p-3">

                    <p className="text-xs text-slate-400">
                      Remarks
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {item.remarks}
                    </p>

                  </div>

                )}

              </div>

            </div>

          );

        }
      )}

    </div>

  ) : (

    <div className="rounded-lg bg-slate-50 p-6 text-center">

      <FaClock className="mx-auto text-xl text-slate-300" />

      <p className="mt-2 text-sm text-slate-500">
        No tracking updates available yet.
      </p>

    </div>

  )}

</div>

          

        </div>

      </div>


      {/* =================================================
          UPDATE SHIPMENT STATUS
          ================================================= */}

      {status !== "Delivered" &&
        status !== "Cancelled" && (

          <div className="rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-base font-semibold text-slate-800">
                Update Shipment Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the current shipment progress.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">

              <div>

                <label className="text-xs font-medium text-slate-500">
                  Current Status
                </label>

                <div className="mt-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {status}
                </div>

              </div>


              <div>

                <label className="text-xs font-medium text-slate-500">
                  Next Status
                </label>

                <select
                  value={nextStatus}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setNextStatus(selected);
                    if (selected === "Delivered") {
                      setStatusLocation(dispatch?.purchaseOrder?.deliveryLocation || "");
                    } else if (selected === "In Transit") {
                      setStatusLocation("");
                    }
                  }}
                  disabled={updatingStatus}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
                >

                  <option value="">
                    Select status
                  </option>

                  {status === "Dispatched" && (
                    <option value="In Transit">
                      In Transit
                    </option>
                  )}

                  {status === "In Transit" && (
                    <option value="Delivered">
                      Delivered
                    </option>
                  )}

                </select>

              </div>


              <div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-500">
                    {nextStatus === "Delivered" ? "Delivery Location" : "Current Location"}
                  </label>

                  {nextStatus === "Delivered" && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      Admin PO Location
                    </span>
                  )}

                  {nextStatus === "In Transit" && (
                    <span className="rounded bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                      Editable Transit Location
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={
                    nextStatus === "Delivered"
                      ? (dispatch?.purchaseOrder?.deliveryLocation || statusLocation || "Not specified in PO")
                      : statusLocation
                  }
                  onChange={(e) => {
                    if (nextStatus !== "Delivered") {
                      setStatusLocation(e.target.value);
                    }
                  }}
                  readOnly={nextStatus === "Delivered"}
                  placeholder={
                    nextStatus === "Delivered"
                      ? (dispatch?.purchaseOrder?.deliveryLocation || "Delivery location from Admin PO")
                      : "Enter current transit location (e.g. Pune Hub, Toll Plaza)"
                  }
                  className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                    nextStatus === "Delivered"
                      ? "border-slate-200 bg-slate-100 font-medium text-slate-700 cursor-not-allowed"
                      : "border-slate-200 bg-white focus:border-blue-500 text-slate-800"
                  }`}
                />

                {nextStatus === "Delivered" && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Auto-filled from Buyer Purchase Order delivery location.
                  </p>
                )}

              </div>


              <div className="md:col-span-3">

                <label className="text-xs font-medium text-slate-500">
                  Remarks
                </label>

                <textarea
                  value={statusRemarks}
                  onChange={(e) =>
                    setStatusRemarks(e.target.value)
                  }
                  rows={3}
                  placeholder="Enter shipment status remarks"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

              </div>

            </div>


            <div className="flex justify-end border-t border-slate-100 px-6 py-4">

              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => {
                  if (!nextStatus) {
                    toast.error("Please select the next status.");
                    return;
                  }

                  handleStatusUpdate(nextStatus);
                }}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {updatingStatus
                  ? "Updating..."
                  : "Update Status"}

              </button>

            </div>

          </div>

        )}


      {/* =================================================
          SHIPMENT INFORMATION
          ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-2">

            <FaTruck className="text-blue-600" />

            <h2 className="text-base font-semibold text-slate-800">
              Shipment Information
            </h2>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">

          <div>
            <p className="text-xs text-slate-400">
              Transporter
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.transporterName || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Vehicle Number
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.vehicleNumber || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Driver
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.driverName || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Driver Contact
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.driverContact || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Shipping Method
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.shippingMethod || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              LR Number
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.lrNumber || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Tracking Number
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.trackingNumber || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              AWB Number
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.awbNumber || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Consignment Number
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.consignmentNumber || "—"}
            </p>
          </div>

        </div>

      </div>


      {/* =================================================
          ITEM TRACKING
          ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-2">

            <FaBox className="text-blue-600" />

            <div>

              <h2 className="text-base font-semibold text-slate-800">
                Item Tracking
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quantity movement for this dispatch.
              </p>

            </div>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Material
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  UOM
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Ordered
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Previously Dispatched
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  This Dispatch
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Remaining
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {(dispatch.items || []).map(
                (item, index) => (

                  <tr
                    key={
                      item._id ||
                      item.material ||
                      index
                    }
                  >

                    <td className="px-5 py-4">

                      <p className="font-medium text-slate-700">
                        {item.materialCode}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.materialName}
                      </p>

                    </td>


                    <td className="px-5 py-4 text-slate-600">
                      {item.unitOfMeasure}
                    </td>


                    <td className="px-5 py-4 text-right">
                      {item.orderedQuantity}
                    </td>


                    <td className="px-5 py-4 text-right">
                      {item.previouslyDispatchedQuantity}
                    </td>


                    <td className="px-5 py-4 text-right font-semibold text-blue-700">
                      {item.dispatchQuantity}
                    </td>


                    <td className="px-5 py-4 text-right font-semibold text-slate-800">
                      {item.remainingQuantity}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          PACKAGE INFORMATION
          ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-2">

            <FaBox className="text-blue-600" />

            <h2 className="text-base font-semibold text-slate-800">
              Package Information
            </h2>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">

          <div>
            <p className="text-xs text-slate-400">
              Package Count
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.packageCount ?? 0}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Total Weight
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.totalWeight ?? 0}{" "}
              {dispatch.weightUnit || "Kg"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Package Type
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.packageType || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs text-slate-400">
              Delivery Location
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {dispatch.purchaseOrder?.deliveryLocation ||
                "—"}
            </p>
          </div>

        </div>

      </div>


      {/* =================================================
          DOCUMENTS
          ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-2">

            <FaFileLines className="text-blue-600" />

            <h2 className="text-base font-semibold text-slate-800">
              Dispatch Documents
            </h2>

          </div>

        </div>


        <div className="p-6">

          {Array.isArray(
            dispatch.documents
          ) &&
          dispatch.documents.length > 0 ? (

            <div className="space-y-3">

              {dispatch.documents.map(
                (document, index) => (

                  <div
                    key={
                      document._id ||
                      index
                    }
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >

                    <div>

                      <p className="text-sm font-medium text-slate-700">
                        {document.fileName ||
                          document.documentType ||
                          "Document"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {document.documentType ||
                          "Other"}
                      </p>

                    </div>

                    {document.fileUrl && (

                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>

                    )}

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="py-6 text-center text-sm text-slate-400">
              No documents uploaded.
            </div>

          )}

        </div>

      </div>


      {/* =================================================
          REMARKS
          ================================================= */}

      {dispatch.remarks && (

        <div className="rounded-xl border border-slate-200 bg-white p-6">

          <h2 className="text-base font-semibold text-slate-800">
            Remarks
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {dispatch.remarks}
          </p>

        </div>

      )}

    </div>

  );

};

export default VendorDispatchDetails;
