import React from "react";
import {
  Eye,
  CalendarDays,
  Package,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

const PurchaseOrderTable = ({
  purchaseOrders = [],
  loading = false,
  page = 1,
  pages = 0,
  total = 0,
  onView,
  onPageChange,
}) => {
  /**
   * ==========================================
   * Format Currency
   * ==========================================
   */
  const formatCurrency = (
    amount,
    currency = "INR"
  ) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  /**
   * ==========================================
   * Format Date
   * ==========================================
   */
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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
   * View Purchase Order
   * ==========================================
   *
   * IMPORTANT:
   * Pass the COMPLETE purchaseOrder object.
   *
   * VendorPurchaseOrders.jsx will extract:
   *
   * purchaseOrder._id
   *
   * and navigate to the details page.
   */
  const handleView = (purchaseOrder) => {
    if (!purchaseOrder) {
      console.error(
        "Purchase Order object is missing."
      );

      return;
    }

    const id =
      purchaseOrder._id ||
      purchaseOrder.id;

    if (!id) {
      console.error(
        "Purchase Order ID is missing:",
        purchaseOrder
      );

      return;
    }

    console.log(
      "Selected Purchase Order:",
      {
        id,
        poNumber:
          purchaseOrder.poNumber,
      }
    );

    onView(purchaseOrder);
  };

  /**
   * ==========================================
   * Loading State
   * ==========================================
   */
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex min-h-[350px] items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading purchase orders...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /**
   * ==========================================
   * Empty State
   * ==========================================
   */
  if (!purchaseOrders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FileText
              size={30}
              className="text-slate-400"
            />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No Purchase Orders Found
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            There are currently no purchase orders
            matching your search or filter.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ======================================
          Table Header
          ====================================== */}

      <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-bold text-slate-800">
            Purchase Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {total} purchase order
            {total !== 1 ? "s" : ""} found
          </p>

        </div>

      </div>

      {/* ======================================
          Table
          ====================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-[1050px] w-full">

          <thead>

            <tr className="border-b border-slate-200 bg-slate-50">

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Purchase Order
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Vendor
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Order Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Expected Delivery
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Priority
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {purchaseOrders.map(
              (purchaseOrder) => {

                const vendor =
                  purchaseOrder.vendor || {};

                const vendorName =
                  vendor.vendorName ||
                  vendor.companyName ||
                  vendor.name ||
                  "Unknown Vendor";

                const itemCount =
                  Array.isArray(
                    purchaseOrder.items
                  )
                    ? purchaseOrder.items.length
                    : 0;

                return (
                  <tr
                    key={
                      purchaseOrder._id ||
                      purchaseOrder.id
                    }
                    className="transition hover:bg-slate-50"
                  >

                    {/* PO */}
                    <td className="px-6 py-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            purchaseOrder
                          )
                        }
                        className="text-left"
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <FileText
                              size={18}
                              className="text-blue-600"
                            />
                          </div>

                          <div>

                            <p className="font-bold text-blue-600 hover:text-blue-700">
                              {purchaseOrder.poNumber ||
                                "-"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {itemCount} item
                              {itemCount !== 1
                                ? "s"
                                : ""}
                            </p>

                          </div>

                        </div>

                      </button>

                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-800">
                        {vendorName}
                      </p>

                      {vendor.email && (
                        <p className="mt-1 text-xs text-slate-400">
                          {vendor.email}
                        </p>
                      )}

                    </td>

                    {/* Order Date */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        {formatDate(
                          purchaseOrder.orderDate
                        )}

                      </div>

                    </td>

                    {/* Expected Delivery */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        {formatDate(
                          purchaseOrder.expectedDeliveryDate
                        )}

                      </div>

                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5 text-right">

                      <p className="font-semibold text-slate-800">
                        {formatCurrency(
                          purchaseOrder.grandTotal,
                          purchaseOrder.currency ||
                            "INR"
                        )}
                      </p>

                    </td>

                    {/* Priority */}
                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          purchaseOrder.priority ===
                          "Critical"
                            ? "bg-red-50 text-red-700"
                            : purchaseOrder.priority ===
                              "High"
                            ? "bg-orange-50 text-orange-700"
                            : purchaseOrder.priority ===
                              "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {purchaseOrder.priority ||
                          "Medium"}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <PurchaseOrderStatusBadge
                        status={
                          purchaseOrder.status
                        }
                      />

                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            purchaseOrder
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >

                        <Eye size={16} />

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

      {/* ======================================
          Pagination
          ====================================== */}

      <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-500">
          Page{" "}
          <span className="font-semibold text-slate-700">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {pages || 1}
          </span>
        </p>

        <div className="flex items-center gap-2">

          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />

            Previous
          </button>

          <button
            type="button"
            disabled={
              page >= pages ||
              pages === 0
            }
            onClick={() =>
              onPageChange(page + 1)
            }
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next

            <ChevronRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default PurchaseOrderTable;