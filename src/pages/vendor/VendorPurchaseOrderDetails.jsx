import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Building2,
  MapPin,
  CreditCard,
  Package,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getVendorPurchaseOrderById,
  acceptVendorPurchaseOrder,
  rejectVendorPurchaseOrder,
} from "../../services/vendorPurchaseOrderService";

import PurchaseOrderStatusBadge from "../../components/vendor/purchase-orders/PurchaseOrderStatusBadge";

const VendorPurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchaseOrder, setPurchaseOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [accepting, setAccepting] =
  useState(false);

  const [rejecting, setRejecting] =
  useState(false);

const [acceptRemarks, setAcceptRemarks] =
  useState("");

const [rejectRemarks, setRejectRemarks] =
  useState("");

  /**
   * ==========================================
   * Load Purchase Order
   * ==========================================
   */
  const loadPurchaseOrder = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await getVendorPurchaseOrderById(id);

        setPurchaseOrder(
          response?.data || null
        );
      } catch (error) {
        console.error(
          "Purchase Order Details Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          "Failed to load purchase order.";

        toast.error(message);

        setPurchaseOrder(null);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    loadPurchaseOrder();
  }, [loadPurchaseOrder]);

  /**
   * ==========================================
   * Format Currency
   * ==========================================
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency:
        purchaseOrder?.currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  /**
   * ==========================================
   * Format Date
   * ==========================================
   */
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /**
   * ==========================================
   * Loading
   * ==========================================
   */
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={30}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading purchase order...
          </p>
        </div>
      </div>
    );
  }

  /**
   * ==========================================
   * Not Found
   * ==========================================
   */
  if (!purchaseOrder) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <FileText
            size={30}
            className="text-slate-400"
          />
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          Purchase Order Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          The purchase order could not be found
          or is no longer available.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/vendor/purchase-orders")
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Purchase Orders
        </button>
      </div>
    );
  }

  const vendor =
    purchaseOrder.vendor || {};

  const purchaseRequisition =
    purchaseOrder.purchaseRequisition || {};

  const items =
    purchaseOrder.items || [];

  const status = purchaseOrder?.status || "Unknown";
  const canRespond = status === "Sent";

  const getStatusMessage = () => {
    switch (status) {
      case "Sent":
        return "Awaiting vendor response.";
      case "Accepted":
        return "Purchase Order accepted by vendor.";
      case "Rejected":
        return "Purchase Order rejected by vendor.";
      default:
        return "Purchase Order status updated.";
    }
  };

  const handleAcceptPurchaseOrder =
  async () => {
    try {
      if (!id) {
        toast.error(
          "Purchase Order ID is missing."
        );
        return;
      }

      setAccepting(true);

      const response =
        await acceptVendorPurchaseOrder(
          id,
          acceptRemarks
        );

      console.log(
        "Accept Purchase Order Response:",
        response
      );

      toast.success(
        "Purchase Order accepted successfully."
      );

      /*
       * Update the page immediately with the
       * Purchase Order returned by backend.
       */

      if (response?.data) {
        setPurchaseOrder(
          response.data
        );
      }

      setAcceptRemarks("");

    } catch (error) {
      console.error(
        "Accept Purchase Order Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to accept Purchase Order.";

      toast.error(message);

    } finally {
      setAccepting(false);
    }
  };

  const handleRejectPurchaseOrder =
  async () => {
    try {
      if (!id) {
        toast.error("Purchase Order ID is missing.");
        return;
      }

      if (!rejectRemarks.trim()) {
        toast.error("Please enter a rejection reason.");
        return;
      }

      setRejecting(true);

      const response =
        await rejectVendorPurchaseOrder(
          id,
          rejectRemarks
        );

      toast.success(
        "Purchase Order rejected successfully."
      );

      if (response?.data) {
        setPurchaseOrder(response.data);
      }

      setRejectRemarks("");
    } catch (error) {
      console.error(
        "Reject Purchase Order Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reject Purchase Order.";

      toast.error(message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ======================================
          Page Header
          ====================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/vendor/purchase-orders")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">
                {purchaseOrder.poNumber}
              </h1>

              <PurchaseOrderStatusBadge
                status={purchaseOrder.status}
              />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Purchase Order Details
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadPurchaseOrder}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ======================================
          Current Status
          ====================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          Current Status
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <PurchaseOrderStatusBadge status={status} />
          <p className="text-sm text-slate-500">
            {getStatusMessage()}
          </p>
        </div>
      </div>

      {/* ======================================
          Vendor Response
          ====================================== */}
      {purchaseOrder.vendorResponseDate && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Vendor Response
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Response</p>
              <p className="mt-1 font-semibold text-slate-800">
                {purchaseOrder.vendorAccepted === true
                  ? "Accepted"
                  : purchaseOrder.vendorAccepted === false
                  ? "Rejected"
                  : "Responded"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Response Date</p>
              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(purchaseOrder.vendorResponseDate)}
              </p>
            </div>
          </div>

          {purchaseOrder.vendorRemarks && (
            <div className="mt-5">
              <p className="text-sm text-slate-500">Vendor Remarks</p>
              <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                {purchaseOrder.vendorRemarks}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================
          Basic Information
          ====================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">
            Order Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic purchase order information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              PO Number
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {purchaseOrder.poNumber}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              PR Number
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {purchaseRequisition.prNumber ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Order Date
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays
                size={16}
                className="text-slate-400"
              />

              {formatDate(
                purchaseOrder.orderDate
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Expected Delivery
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays
                size={16}
                className="text-slate-400"
              />

              {formatDate(
                purchaseOrder.expectedDeliveryDate
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Payment Terms
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold text-slate-800">
              <CreditCard
                size={16}
                className="text-slate-400"
              />

              {purchaseOrder.paymentTerms ||
                "-"}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Currency
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {purchaseOrder.currency ||
                "INR"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Priority
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {purchaseOrder.priority ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Delivery Location
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold text-slate-800">
              <MapPin
                size={16}
                className="text-slate-400"
              />

              {purchaseOrder.deliveryLocation ||
                "-"}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================
          Vendor Information
          ====================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <Building2
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-bold text-slate-800">
                Vendor Information
              </h2>
            </div>
          </div>

          <div className="space-y-4 p-6">

            <div>
              <p className="text-xs text-slate-400">
                Vendor Name
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {vendor.vendorName ||
                  vendor.companyName ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Vendor Code
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {vendor.vendorCode ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {vendor.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {vendor.phone || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* Delivery */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <MapPin
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-bold text-slate-800">
                Delivery Information
              </h2>
            </div>
          </div>

          <div className="space-y-4 p-6">

            <div>
              <p className="text-xs text-slate-400">
                Delivery Location
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {purchaseOrder.deliveryLocation ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Expected Delivery
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(
                  purchaseOrder.expectedDeliveryDate
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Delivery Instructions
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {purchaseOrder.deliveryInstructions ||
                  "No delivery instructions provided."}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================
          Material Items
          ====================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">
            <Package
              size={20}
              className="text-blue-600"
            />

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Material Items
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Materials included in this purchase
                order.
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            {items.length} Item
            {items.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Material
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Code
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Unit
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Unit Price
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Discount
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Tax
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {items.map((item, index) => (
                <tr key={index}>

                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-800">
                      {item.materialName ||
                        item.material?.materialName ||
                        "-"}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {item.materialCode ||
                      item.material?.materialCode ||
                      "-"}
                  </td>

                  <td className="px-6 py-5 text-right font-medium text-slate-700">
                    {item.quantity}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {item.unitOfMeasure ||
                      "-"}
                  </td>

                  <td className="px-6 py-5 text-right text-sm font-medium text-slate-700">
                    {formatCurrency(
                      item.unitPrice
                    )}
                  </td>

                  <td className="px-6 py-5 text-right text-sm text-slate-600">
                    {item.discountPercentage ||
                      0}
                    %
                  </td>

                  <td className="px-6 py-5 text-right text-sm text-slate-600">
                    {item.taxPercentage || 0}%
                  </td>

                  <td className="px-6 py-5 text-right text-sm font-bold text-slate-800">
                    {formatCurrency(
                      item.lineTotal
                    )}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================
          Amount Summary
          ====================================== */}
      <div className="flex justify-end">

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:max-w-md">

          <h2 className="mb-5 text-lg font-bold text-slate-800">
            Amount Summary
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-700">
                {formatCurrency(
                  purchaseOrder.subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-slate-700">
                -
                {formatCurrency(
                  purchaseOrder.discountAmount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Tax
              </span>

              <span className="font-medium text-slate-700">
                {formatCurrency(
                  purchaseOrder.taxAmount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Freight
              </span>

              <span className="font-medium text-slate-700">
                {formatCurrency(
                  purchaseOrder.freightCharges
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between">

                <span className="text-base font-bold text-slate-800">
                  Grand Total
                </span>

                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(
                    purchaseOrder.grandTotal
                  )}
                </span>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================================================
          Vendor Actions
          ================================================== */}
      {canRespond && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Purchase Order Response
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review this purchase order and submit your response.
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Acceptance Remarks
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              value={acceptRemarks}
              onChange={(e) => setAcceptRemarks(e.target.value)}
              rows={3}
              placeholder="Enter remarks for accepting this Purchase Order..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Rejection Reason
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              rows={3}
              placeholder="Enter the reason for rejecting this Purchase Order..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleRejectPurchaseOrder}
              disabled={rejecting || accepting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {rejecting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Reject Purchase Order
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAcceptPurchaseOrder}
              disabled={accepting || rejecting}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {accepting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Accept Purchase Order
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorPurchaseOrderDetails;
