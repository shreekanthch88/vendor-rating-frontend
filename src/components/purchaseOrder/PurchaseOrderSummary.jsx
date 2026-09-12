import {
  FileText,
  Building2,
  Calendar,
  Truck,
  IndianRupee,
  User,
} from "lucide-react";

const PurchaseOrderSummary = ({
  purchaseOrder = {},
}) => {

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

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

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-blue-100 p-3">

          <FileText
            size={24}
            className="text-blue-600"
          />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Purchase Order Summary
          </h2>

          <p className="text-sm text-slate-500">
            Review all Purchase Order information.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Purchase Order */}

        <div className="space-y-3">

          <h3 className="flex items-center gap-2 text-lg font-semibold">

            <FileText size={18} />

            Purchase Order

          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <strong>PO Number:</strong>{" "}
              {purchaseOrder.poNumber || "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {purchaseOrder.status || "-"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {purchaseOrder.priority || "-"}
            </p>

            <p>
              <strong>Order Date:</strong>{" "}
              {formatDate(
                purchaseOrder.orderDate
              )}
            </p>

          </div>

        </div>

        {/* Vendor */}

        <div className="space-y-3">

          <h3 className="flex items-center gap-2 text-lg font-semibold">

            <Building2 size={18} />

            Vendor Details

          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <strong>Name:</strong>{" "}
              {purchaseOrder.vendor?.vendorName ||
                "-"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {purchaseOrder.vendor?.email ||
                "-"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {purchaseOrder.vendor?.phone ||
                "-"}
            </p>

          </div>

        </div>

        {/* Delivery */}

        <div className="space-y-3">

          <h3 className="flex items-center gap-2 text-lg font-semibold">

            <Truck size={18} />

            Delivery

          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <strong>Expected:</strong>{" "}
              {formatDate(
                purchaseOrder.expectedDeliveryDate
              )}
            </p>

            <p>
              <strong>Delivery Address:</strong>{" "}
              {purchaseOrder.deliveryAddress ||
                "-"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {purchaseOrder.department ||
                "-"}
            </p>

          </div>

        </div>

        {/* Financial */}

        <div className="space-y-3">

          <h3 className="flex items-center gap-2 text-lg font-semibold">

            <IndianRupee size={18} />

            Financial Summary

          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <strong>Subtotal:</strong>{" "}
              {formatCurrency(
                purchaseOrder.subTotal
              )}
            </p>

            <p>
              <strong>GST:</strong>{" "}
              {formatCurrency(
                purchaseOrder.taxAmount
              )}
            </p>

            <p>
              <strong>Freight:</strong>{" "}
              {formatCurrency(
                purchaseOrder.freightCharges
              )}
            </p>

            <p className="text-base font-bold text-green-700">

              Grand Total:{" "}
              {formatCurrency(
                purchaseOrder.grandTotal ?? purchaseOrder.totalAmount ?? 0
              )}

            </p>

          </div>

        </div>

      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="flex items-center gap-2">

          <User
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm">

            <strong>Created By:</strong>{" "}
            {purchaseOrder.createdBy?.name ||
              "-"}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <Calendar
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm">

            <strong>Created On:</strong>{" "}
            {formatDate(
              purchaseOrder.createdAt
            )}

          </span>

        </div>

      </div>

    </div>

  );

};

export default PurchaseOrderSummary;