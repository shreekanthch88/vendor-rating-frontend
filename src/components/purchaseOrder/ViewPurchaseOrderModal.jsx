import {
  X,
  Printer,
  FileDown,
  Building2,
  CalendarDays,
  User,
  Truck,
  Package,
  IndianRupee,
} from "lucide-react";

const ViewPurchaseOrderModal = ({
  isOpen,
  purchaseOrder,
  onClose,
  onPrint,
  onExport,
  fulfillment = null,
  fulfillmentLoading = false,
}) => {
  if (!isOpen || !purchaseOrder) return null;

  /* ==========================================
      Helpers
  ========================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Closed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex h-[94vh] w-[95%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex items-center justify-between border-b bg-white px-8 py-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-blue-100 p-3">

              <Building2
                size={28}
                className="text-blue-700"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Purchase Order Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {purchaseOrder.poNumber || "-"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                purchaseOrder.status
              )}`}
            >
              {purchaseOrder.status || "Draft"}
            </span>

            <button
              onClick={() => onPrint?.(purchaseOrder)}
              className="rounded-xl border p-2 transition hover:bg-slate-100"
            >
              <Printer size={18} />
            </button>

            <button
              onClick={() => onExport?.(purchaseOrder)}
              className="rounded-xl border p-2 transition hover:bg-slate-100"
            >
              <FileDown size={18} />
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border p-2 transition hover:bg-red-50 hover:text-red-600"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        {/* ==========================================
            Body
        ========================================== */}

        <div className="flex-1 space-y-8 overflow-y-auto bg-slate-50 p-8">

          {/* ==========================================
              Purchase Order & Vendor Information
          ========================================== */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Purchase Order Information */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <CalendarDays
                  size={22}
                  className="text-blue-600"
                />

                <h3 className="text-xl font-bold">
                  Purchase Order Information
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>

                  <p className="text-sm text-slate-500">
                    PO Number
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.poNumber || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Purchase Requisition
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.purchaseRequisition?.prNumber ||
                      purchaseOrder.purchaseRequisition ||
                      "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Order Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatDate(
                      purchaseOrder.orderDate
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Expected Delivery
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatDate(
                      purchaseOrder.expectedDeliveryDate
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Priority
                  </p>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      purchaseOrder.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : purchaseOrder.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {purchaseOrder.priority || "-"}
                  </span>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Currency
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.currency || "INR"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Payment Terms
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.paymentTerms || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.status || "-"}
                  </p>

                </div>

              </div>

            </div>

            {/* Vendor Information */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <User
                  size={22}
                  className="text-green-600"
                />

                <h3 className="text-xl font-bold">
                  Vendor Information
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>

                  <p className="text-sm text-slate-500">
                    Vendor Code
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.vendorCode || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Vendor Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.vendorName || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Vendor Category
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.vendorCategory || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Business Type
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.businessType || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Contact Person
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.contactPerson || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Mobile
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.mobile || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {purchaseOrder.vendor?.email || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    GST Number
                  </p>

                  <p className="mt-1 font-semibold">
                    {purchaseOrder.vendor?.gstNumber || "-"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              Material Items
          ========================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Package
                  size={22}
                  className="text-purple-600"
                />

                <h3 className="text-xl font-bold">
                  Material Items
                </h3>

              </div>

              <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                Total Items : {purchaseOrder.items?.length || 0}
              </span>

            </div>

            <div className="overflow-x-auto rounded-xl border">

              <table className="min-w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      #
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Material Code
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Material Name
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Unit
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold">
                      Unit Price
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Discount %
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      GST %
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold">
                      Line Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {(purchaseOrder.items || []).map(
                    (item, index) => {

                      const quantity =
                        Number(item.quantity || 0);

                      const unitPrice =
                        Number(item.unitPrice || 0);

                      const discount =
                        Number(
                          item.discountPercentage || 0
                        );

                      const gst =
                        Number(
                          item.taxPercentage || 0
                        );

                      const gross =
                        quantity * unitPrice;

                      const discountAmount =
                        gross * discount / 100;

                      const taxable =
                        gross - discountAmount;

                      const gstAmount =
                        taxable * gst / 100;

                      const lineTotal =
                        taxable + gstAmount;

                      return (

                        <tr
                          key={index}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="px-4 py-3">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {item.materialCode || "-"}
                          </td>

                          <td className="px-4 py-3">

                            <div>

                              <p className="font-semibold">
                                {item.materialName || "-"}
                              </p>

                              <p className="text-xs text-slate-500">
                                {item.description || ""}
                              </p>

                            </div>

                          </td>

                          <td className="px-4 py-3 text-center">
                            {quantity}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {item.unitOfMeasure || "-"}
                          </td>

                          <td className="px-4 py-3 text-right">

                            <div className="flex items-center justify-end gap-1">

                              <IndianRupee size={14} />

                              {formatCurrency(unitPrice)}

                            </div>

                          </td>

                          <td className="px-4 py-3 text-center">
                            {discount}%
                          </td>

                          <td className="px-4 py-3 text-center">
                            {gst}%
                          </td>

                          <td className="px-4 py-3 text-right font-bold text-green-700">

                            <div className="flex items-center justify-end gap-1">

                              <IndianRupee size={14} />

                              {formatCurrency(lineTotal)}

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                  {(!purchaseOrder.items ||
                    purchaseOrder.items.length === 0) && (

                    <tr>

                      <td
                        colSpan="9"
                        className="py-10 text-center text-slate-500"
                      >
                        No Material Items Available
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ==========================================
              FULFILLMENT SUMMARY
          ========================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-slate-800">
                  Fulfillment Summary
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Actual fulfillment based on dispatch, receipt,
                  quality acceptance and replacement activity.
                </p>

              </div>

              {!fulfillmentLoading &&
                fulfillment?.final && (

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      fulfillment.final.isFullyFulfilled
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {fulfillment.final.isFullyFulfilled
                      ? "Fully Fulfilled"
                      : "Pending Fulfillment"}
                  </span>

                )}

            </div>

            {fulfillmentLoading ? (

              <div className="rounded-xl border bg-slate-50 p-10 text-center">

                <p className="text-sm text-slate-500">
                  Loading fulfillment information...
                </p>

              </div>

            ) : !fulfillment ? (

              <div className="rounded-xl border bg-slate-50 p-10 text-center">

                <p className="text-sm text-slate-500">
                  Fulfillment information is not available.
                </p>

              </div>

            ) : (

              <>

                {/* ==========================================
                    Overall Fulfillment
                ========================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">

                  <div className="rounded-xl border bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                      Ordered
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {fulfillment.orderedQuantity ?? 0}
                    </p>

                  </div>

                  <div className="rounded-xl border bg-blue-50 p-4">

                    <p className="text-sm text-blue-600">
                      Final Fulfilled
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      {fulfillment.final?.fulfilledQuantity ?? 0}
                    </p>

                  </div>

                  <div className="rounded-xl border bg-yellow-50 p-4">

                    <p className="text-sm text-yellow-700">
                      Pending
                    </p>

                    <p className="mt-1 text-2xl font-bold text-yellow-700">
                      {fulfillment.final?.pendingQuantity ?? 0}
                    </p>

                  </div>

                  <div className="rounded-xl border bg-green-50 p-4">

                    <p className="text-sm text-green-700">
                      Fulfillment
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-700">
                      {fulfillment.final?.fulfillmentPercentage ?? 0}%
                    </p>

                  </div>

                </div>

                {/* ==========================================
                    Fulfillment Progress
                ========================================== */}

                <div className="mb-6">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-600">
                      Overall Fulfillment Progress
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      {fulfillment.final?.fulfillmentPercentage ?? 0}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${Math.min(
                          Number(
                            fulfillment.final?.fulfillmentPercentage || 0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                {/* ==========================================
                    Original Material
                ========================================== */}

                <div className="mb-6">

                  <h4 className="mb-4 text-lg font-semibold text-slate-800">
                    Original Material
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Dispatched
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.original?.dispatchedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Received
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.original?.receivedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <p className="text-xs text-green-700">
                        Accepted
                      </p>

                      <p className="mt-1 font-bold text-green-700">
                        {fulfillment.original?.acceptedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                      <p className="text-xs text-red-700">
                        Rejected
                      </p>

                      <p className="mt-1 font-bold text-red-700">
                        {fulfillment.original?.rejectedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">

                      <p className="text-xs text-orange-700">
                        Damaged
                      </p>

                      <p className="mt-1 font-bold text-orange-700">
                        {fulfillment.original?.damagedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                      <p className="text-xs text-yellow-700">
                        Short
                      </p>

                      <p className="mt-1 font-bold text-yellow-700">
                        {fulfillment.original?.shortQuantity ?? 0}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ==========================================
                    Replacement Material
                ========================================== */}

                <div>

                  <h4 className="mb-4 text-lg font-semibold text-slate-800">
                    Replacement Material
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Requested
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.replacement?.requestedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Approved
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.replacement?.approvedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Dispatched
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.replacement?.dispatchedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border p-4">

                      <p className="text-xs text-slate-500">
                        Received
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {fulfillment.replacement?.receivedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <p className="text-xs text-green-700">
                        Accepted
                      </p>

                      <p className="mt-1 font-bold text-green-700">
                        {fulfillment.replacement?.acceptedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                      <p className="text-xs text-red-700">
                        Rejected
                      </p>

                      <p className="mt-1 font-bold text-red-700">
                        {fulfillment.replacement?.rejectedQuantity ?? 0}
                      </p>

                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">

                      <p className="text-xs text-orange-700">
                        Damaged
                      </p>

                      <p className="mt-1 font-bold text-orange-700">
                        {fulfillment.replacement?.damagedQuantity ?? 0}
                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}

          </div>

          {/* ==========================================
              Delivery Information & Financial Summary
          ========================================== */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Delivery Information */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <Truck
                  size={22}
                  className="text-orange-600"
                />

                <h3 className="text-xl font-bold">
                  Delivery Information
                </h3>

              </div>

              <div className="space-y-5">

                <div>

                  <p className="mb-2 text-sm text-slate-500">
                    Delivery Address
                  </p>

                  <div className="rounded-xl border bg-slate-50 p-4">

                    <p className="whitespace-pre-line text-slate-700">
                      {purchaseOrder.deliveryAddress || "-"}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <p className="text-sm text-slate-500">
                      Delivery Location
                    </p>

                    <p className="mt-1 font-semibold">
                      {purchaseOrder.deliveryLocation || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Shipping Method
                    </p>

                    <p className="mt-1 font-semibold">
                      {purchaseOrder.shippingMethod || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Contact Person
                    </p>

                    <p className="mt-1 font-semibold">
                      {purchaseOrder.contactPerson || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Contact Number
                    </p>

                    <p className="mt-1 font-semibold">
                      {purchaseOrder.contactNumber || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Transport Details
                    </p>

                    <p className="mt-1 font-semibold">
                      {purchaseOrder.transportDetails || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Expected Delivery
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatDate(
                        purchaseOrder.expectedDeliveryDate
                      )}
                    </p>

                  </div>

                </div>

                <div>

                  <p className="mb-2 text-sm text-slate-500">
                    Buyer Remarks
                  </p>

                  <div className="rounded-xl border bg-slate-50 p-4">

                    <p className="whitespace-pre-line text-slate-700">
                      {purchaseOrder.buyerRemarks ||
                        "No remarks available."}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Financial Summary */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <IndianRupee
                  size={22}
                  className="text-green-600"
                />

                <h3 className="text-xl font-bold">
                  Financial Summary
                </h3>

              </div>

              {(() => {

                const subtotal =
                  (purchaseOrder.items || []).reduce(
                    (sum, item) =>
                      sum +
                      (Number(item.quantity || 0) *
                        Number(item.unitPrice || 0)),
                    0
                  );

                const totalDiscount =
                  (purchaseOrder.items || []).reduce(
                    (sum, item) => {

                      const gross =
                        Number(item.quantity || 0) *
                        Number(item.unitPrice || 0);

                      return (
                        sum +
                        (gross *
                          Number(item.discountPercentage || 0)) /
                          100
                      );

                    },
                    0
                  );

                const taxable =
                  subtotal - totalDiscount;

                const totalGST =
                  (purchaseOrder.items || []).reduce(
                    (sum, item) => {

                      const gross =
                        Number(item.quantity || 0) *
                        Number(item.unitPrice || 0);

                      const discount =
                        (gross *
                          Number(item.discountPercentage || 0)) /
                        100;

                      const taxableAmount =
                        gross - discount;

                      return (
                        sum +
                        (taxableAmount *
                          Number(item.taxPercentage || 0)) /
                          100
                      );

                    },
                    0
                  );

                const freight =
                  Number(
                    purchaseOrder.freightCharges || 0
                  );

                const grandTotal =
                  taxable + totalGST + freight;

                return (

                  <div className="space-y-4">

                    <div className="flex justify-between rounded-lg bg-slate-50 p-4">

                      <span>
                        Subtotal
                      </span>

                      <span className="font-semibold">
                        ₹ {formatCurrency(subtotal)}
                      </span>

                    </div>

                    <div className="flex justify-between rounded-lg bg-red-50 p-4">

                      <span>
                        Discount
                      </span>

                      <span className="font-semibold text-red-600">
                        ₹ {formatCurrency(totalDiscount)}
                      </span>

                    </div>

                    <div className="flex justify-between rounded-lg bg-blue-50 p-4">

                      <span>
                        GST
                      </span>

                      <span className="font-semibold text-blue-600">
                        ₹ {formatCurrency(totalGST)}
                      </span>

                    </div>

                    <div className="flex justify-between rounded-lg bg-yellow-50 p-4">

                      <span>
                        Freight Charges
                      </span>

                      <span className="font-semibold text-yellow-700">
                        ₹ {formatCurrency(freight)}
                      </span>

                    </div>

                    <div className="flex justify-between rounded-xl bg-green-100 p-5">

                      <span className="text-lg font-bold">
                        Grand Total
                      </span>

                      <span className="text-2xl font-bold text-green-700">
                        ₹ {formatCurrency(grandTotal)}
                      </span>

                    </div>

                  </div>

                );

              })()}

            </div>

          </div>

        </div>

        {/* ==========================================
            Footer Actions
        ========================================== */}

        <div className="flex items-center justify-between border-t bg-white px-8 py-5">

          {/* Purchase Order Info */}

          <div>

            <p className="text-sm text-slate-500">
              Purchase Order Number
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              {purchaseOrder.poNumber || "-"}
            </h3>

          </div>

          {/* Action Buttons */}

          <div className="flex items-center gap-3">

            {/* Print */}

            <button
              type="button"
              onClick={() => onPrint?.(purchaseOrder)}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100"
            >

              <Printer size={18} />

              Print

            </button>

            {/* Export PDF */}

            <button
              type="button"
              onClick={() => onExport?.(purchaseOrder)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >

              <FileDown size={18} />

              Export PDF

            </button>

            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
            >

              <X size={18} />

              Close

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewPurchaseOrderModal;