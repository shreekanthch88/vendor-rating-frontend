import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Printer,
  FileText,
  MoreVertical,
  CheckCircle,
  XCircle,
  Send,
  X,
} from "lucide-react";

const PurchaseOrderTable = ({
  purchaseOrders = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onExport,
  onApprove,
  onSubmit,
  onSubmitSelected,
  onReject,
  onSendToVendor,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Close 3-dots dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".po-action-menu-container")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const selectedPurchaseOrders = purchaseOrders.filter((po) =>
    selectedIds.includes(po._id)
  );

  const draftsCount = selectedPurchaseOrders.filter(
    (po) => po.status === "Draft"
  ).length;

  const submittedCount = selectedPurchaseOrders.filter(
    (po) => po.status === "Submitted"
  ).length;

  const areAllPurchaseOrdersSelected =
    purchaseOrders.length > 0 &&
    selectedIds.length === purchaseOrders.length;

  const togglePurchaseOrder = (id) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((selectedId) => selectedId !== id)
        : [...currentIds, id]
    );
  };

  const toggleAllPurchaseOrders = () => {
    setSelectedIds(
      areAllPurchaseOrdersSelected
        ? []
        : purchaseOrders.map((po) => po._id)
    );
  };

  const handleApproveSelected = async () => {
    if (!selectedPurchaseOrders.length || !onApprove) return;

    setIsApproving(true);
    try {
      const approved = await onApprove(selectedPurchaseOrders);
      if (approved) {
        setSelectedIds([]);
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleSubmitSelected = async () => {
    if (!selectedPurchaseOrders.length) return;

    const draftOrders = selectedPurchaseOrders.filter(
      (po) => po.status === "Draft"
    );

    if (!draftOrders.length) {
      alert("No Draft Purchase Orders among selected items to submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmitSelected) {
        const success = await onSubmitSelected(draftOrders);
        if (success) setSelectedIds([]);
      } else if (onSubmit) {
        for (const po of draftOrders) {
          await onSubmit(po);
        }
        setSelectedIds([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ==========================================
   * Status Badge
   * ==========================================
   */

  const getStatusBadge = (status) => {

    switch (status) {

      case "Draft":

        return "bg-gray-100 text-gray-700";

      case "Submitted":

        return "bg-blue-100 text-blue-700";

      case "Approved":

        return "bg-green-100 text-green-700";

      case "Sent":

        return "bg-purple-100 text-purple-700";

      case "Accepted":

        return "bg-emerald-100 text-emerald-700";

      case "Delivered":

        return "bg-green-100 text-green-700";

      case "Cancelled":

        return "bg-red-100 text-red-700";

      default:

        return "bg-slate-100 text-slate-700";

    }

  };

  /**
   * ==========================================
   * Currency Formatter
   * ==========================================
   */

  const formatCurrency = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };

  return (

    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* ==========================================
          Top Selection Action Banner
      ========================================== */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 bg-blue-50/90 px-6 py-3.5 backdrop-blur-sm transition">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
              {selectedIds.length}
            </span>
            <span className="text-sm font-semibold text-blue-950">
              {selectedIds.length === 1
                ? "1 Purchase Order Selected"
                : `${selectedIds.length} Purchase Orders Selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {draftsCount > 0 && (
              <button
                type="button"
                onClick={handleSubmitSelected}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Send size={14} />
                {isSubmitting
                  ? "Submitting..."
                  : `Submit Selected (${draftsCount})`}
              </button>
            )}

            {submittedCount > 0 && (
              <button
                type="button"
                onClick={handleApproveSelected}
                disabled={isApproving}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <CheckCircle size={14} />
                {isApproving
                  ? "Approving..."
                  : `Approve Selected (${submittedCount})`}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <X size={14} />
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">

        <table className="min-w-full">
                  {/* ==========================================
              Table Header
          ========================================== */}

          <thead className="bg-slate-100">

            <tr>

              {/* Select */}

              <th className="w-12 px-4 py-4">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  checked={areAllPurchaseOrdersSelected}
                  onChange={toggleAllPurchaseOrders}
                  aria-label="Select all purchase orders"
                />

              </th>

              {/* PO Number */}

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">

                PO Number

              </th>

              {/* Purchase Requisition */}

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">

                Purchase Requisition

              </th>

              {/* Vendor */}

              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">

                Vendor

              </th>

              {/* Order Date */}

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">

                Order Date

              </th>

              {/* Expected Delivery */}

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">

                Expected Delivery

              </th>

              {/* Priority */}

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">

                Priority

              </th>

              {/* Total Amount */}

              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">

                Total Amount

              </th>

              {/* Status */}

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">

                Status

              </th>

              {/* Actions */}

              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-700">

                Actions

              </th>

            </tr>

          </thead>

          <tbody> 
                      {/* ==========================================
              Table Body
          ========================================== */}

          {loading ? (

            <tr>

              <td
                colSpan={10}
                className="py-16 text-center text-slate-500"
              >

                Loading Purchase Orders...

              </td>

            </tr>

          ) : purchaseOrders.length === 0 ? (

            <tr>

              <td
                colSpan={10}
                className="py-16 text-center text-slate-500"
              >

                No Purchase Orders Found.

              </td>

            </tr>

          ) : (

            purchaseOrders.map((po) => (

              <tr
                key={po._id}
                className="border-t transition hover:bg-slate-50"
              >

                {/* Checkbox */}

                <td className="px-4 py-4">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={selectedIds.includes(po._id)}
                    onChange={() => togglePurchaseOrder(po._id)}
                    aria-label={`Select ${po.poNumber}`}
                  />

                </td>

                {/* PO Number */}

                <td className="px-4 py-4">

                  <div>

                    <p className="font-semibold text-slate-800">

                      {po.poNumber}

                    </p>

                  </div>

                </td>

                {/* Purchase Requisition */}

                <td className="px-4 py-4">

                  {po.purchaseRequisition?.prNumber ||

                    "-"}

                </td>

                {/* Vendor */}

                <td className="px-4 py-4">

                  <div>

                    <p className="font-medium">

                      {po.vendor?.vendorName ||

                        "-"}

                    </p>

                    <p className="text-xs text-slate-500">

                      {po.vendor?.vendorCode}

                    </p>

                  </div>

                </td>

                {/* Order Date */}

                <td className="px-4 py-4 text-center">

                  {new Date(
                    po.orderDate
                  ).toLocaleDateString()}

                </td>

                {/* Expected Delivery */}

                <td className="px-4 py-4 text-center">

                  {new Date(
                    po.expectedDeliveryDate
                  ).toLocaleDateString()}

                </td>

                {/* Priority */}

                <td className="px-4 py-4 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold

                    ${
                      po.priority === "High"

                        ? "bg-red-100 text-red-700"

                        : po.priority === "Medium"

                        ? "bg-yellow-100 text-yellow-700"

                        : "bg-green-100 text-green-700"

                    }`}
                  >

                    {po.priority}

                  </span>

                </td>

                {/* Total */}

                <td className="px-4 py-4 text-right font-semibold">

                  ₹ {formatCurrency(po.grandTotal ?? po.totalAmount ?? 0)}

                </td>

                {/* Status */}

                <td className="px-4 py-4 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold

                    ${getStatusBadge(po.status)}`}
                  >

                    {po.status}

                  </span>

                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                  <div className="po-action-menu-container relative inline-flex items-center justify-center gap-1.5">
                    {/* View */}
                    <button
                      onClick={() => onView(po)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="View Details"
                    >
                      <Eye size={17} />
                    </button>

                    {/* Primary Lifecycle Button */}
                    {po.status === "Draft" && (
                      <button
                        onClick={() => onSubmit(po)}
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                        title="Submit for Approval"
                      >
                        Submit
                      </button>
                    )}

                    {po.status === "Submitted" && (
                      <button
                        onClick={() => onApprove([po])}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                        title="Approve Order"
                      >
                        Approve
                      </button>
                    )}

                    {po.status === "Approved" && (
                      <button
                        onClick={() => onSendToVendor(po)}
                        className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        title="Send to Vendor"
                      >
                        Send
                      </button>
                    )}

                    {/* More Actions Dropdown */}
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === po._id ? null : po._id
                          );
                        }}
                        className={`rounded-lg p-1.5 transition ${
                          activeMenuId === po._id
                            ? "bg-slate-200 text-slate-900"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        title="More Actions"
                      >
                        <MoreVertical size={17} />
                      </button>

                      {activeMenuId === po._id && (
                        <div className="absolute right-0 z-30 mt-1 w-44 origin-top-right rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEdit(po);
                            }}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Pencil size={14} className="text-amber-600" />
                            Edit Order
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onPrint(po);
                            }}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Printer size={14} className="text-emerald-600" />
                            Print Order
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onExport(po);
                            }}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            <FileText size={14} className="text-violet-600" />
                            Export PDF
                          </button>

                          {po.status === "Submitted" && onReject && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onReject(po);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                            >
                              <XCircle size={14} />
                              Reject Order
                            </button>
                          )}

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(po);
                            }}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={14} />
                            Delete Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

              </tr>

            ))

          )}

          </tbody>

        </table>

      </div>
            {/* ==========================================
          Table Footer
      ========================================== */}

      <div className="flex flex-col items-center justify-between gap-4 border-t bg-slate-50 px-6 py-4 md:flex-row">

        {/* Left */}

        <div className="flex items-center gap-6 text-sm text-slate-600">

          <span>

            Total Purchase Orders :

            <strong className="ml-2 text-slate-800">

              {purchaseOrders.length}

            </strong>

          </span>

          <span>

            Selected :

            <strong className="ml-2 text-blue-600">

              {selectedIds.length}

            </strong>

          </span>

        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200/70"
            >
              Clear Selection
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmitSelected}
            disabled={draftsCount === 0 || isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            title={draftsCount === 0 ? "Select Draft orders to submit" : "Submit selected draft orders"}
          >
            <Send size={14} />
            {isSubmitting ? "Submitting..." : `Submit Selected ${draftsCount > 0 ? `(${draftsCount})` : ""}`}
          </button>

          <button
            type="button"
            onClick={handleApproveSelected}
            disabled={submittedCount === 0 || isApproving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            title={submittedCount === 0 ? "Select Submitted orders to approve" : "Approve selected orders"}
          >
            <CheckCircle size={14} />
            {isApproving ? "Approving..." : `Approve Selected ${submittedCount > 0 ? `(${submittedCount})` : ""}`}
          </button>

        </div>

      </div>

      {/* ==========================================
          Empty State
      ========================================== */}

      {!loading && purchaseOrders.length === 0 && (

        <div className="border-t bg-white px-8 py-16 text-center">

          <div className="mx-auto max-w-md">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              <FileText
                size={40}
                className="text-slate-400"
              />

            </div>

            <h3 className="text-xl font-bold text-slate-700">

              No Purchase Orders Found

            </h3>

            <p className="mt-3 text-slate-500">

              Create your first Purchase Order to begin
              managing vendor procurement.

            </p>

          </div>
        </div>

        

      )}

     </div>   

    );

};

export default PurchaseOrderTable;
