import { useMemo, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const ReviewStep = ({
  formData,
}) => {

  const [confirmed, setConfirmed] = useState(false);

  /**
   * ==========================================
   * Validation Checks
   * ==========================================
   */

  const validations = useMemo(() => ({

    purchaseRequisition:
      !!formData.purchaseRequisition,

    vendor:
      !!formData.vendor,

    materials:
      formData.items?.length > 0,

    deliveryAddress:
      !!formData.deliveryAddress,

    expectedDelivery:
      !!formData.expectedDeliveryDate,

    grandTotal:
      Number(formData.totalAmount) > 0,

  }), [formData]);

  const allValid = Object.values(validations)
    .every(Boolean);

  const formatCurrency = (value) =>

    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (

    <div className="space-y-8">
          {/* ==========================================
          Purchase Order Summary
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-slate-800">

            Purchase Order Review

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Verify all Purchase Order information before creating
            the Purchase Order.

          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Purchase Requisition */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Purchase Requisition

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.purchaseRequisition || "-"}

            </h4>

          </div>

          {/* Expected Delivery */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Expected Delivery

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.expectedDeliveryDate || "-"}

            </h4>

          </div>

          {/* Priority */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Priority

            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold

              ${
                formData.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : formData.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >

              {formData.priority}

            </span>

          </div>

          {/* Currency */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Currency

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.currency}

            </h4>

          </div>

          {/* Payment Terms */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Payment Terms

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.paymentTerms || "-"}

            </h4>

          </div>

          {/* Delivery Location */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Delivery Location

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.deliveryLocation || "-"}

            </h4>

          </div>

          {/* Freight */}

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="text-sm text-slate-500">

              Freight Charges

            </p>

            <h4 className="mt-2 font-semibold text-green-600">

              ₹ {formatCurrency(formData.freightCharges)}

            </h4>

          </div>

          {/* Total Amount */}

          <div className="rounded-xl bg-green-50 p-5">

            <p className="text-sm text-green-600">

              Grand Total

            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-700">

              ₹ {formatCurrency(formData.totalAmount)}

            </h3>

          </div>

        </div>

        {/* Buyer Remarks */}

        <div className="mt-8">

          <h3 className="mb-3 text-lg font-semibold">

            Buyer Remarks

          </h3>

          <div className="rounded-xl border bg-slate-50 p-5">

            <p className="whitespace-pre-line text-slate-700">

              {formData.buyerRemarks ||

                "No buyer remarks provided."}

            </p>

          </div>

        </div>

      </div>

            {/* ==========================================
          Vendor & Delivery Summary
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ================= Vendor Summary ================= */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-6 text-xl font-bold text-slate-800">

            Vendor Information

          </h3>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <p className="text-sm text-slate-500">

                Vendor ID

              </p>

              <h4 className="mt-2 font-semibold">

                {formData.vendor || "-"}

              </h4>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Payment Terms

              </p>

              <h4 className="mt-2 font-semibold">

                {formData.paymentTerms || "-"}

              </h4>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Currency

              </p>

              <h4 className="mt-2 font-semibold">

                {formData.currency || "-"}

              </h4>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Priority

              </p>

              <h4 className="mt-2 font-semibold">

                {formData.priority || "-"}

              </h4>

            </div>

          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-5">

            <p className="text-sm text-blue-600">

              Vendor Selected Successfully

            </p>

            <h3 className="mt-2 text-lg font-bold text-blue-700">

              This Purchase Order will be issued to the selected
              vendor after submission.

            </h3>

          </div>

        </div>

        {/* ================= Delivery Summary ================= */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-6 text-xl font-bold text-slate-800">

            Delivery Information

          </h3>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-slate-500">

                Delivery Address

              </p>

              <div className="mt-2 rounded-lg bg-slate-50 p-4">

                <p className="whitespace-pre-line">

                  {formData.deliveryAddress ||

                    "Not Available"}

                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>

                <p className="text-sm text-slate-500">

                  Delivery Location

                </p>

                <h4 className="mt-2 font-semibold">

                  {formData.deliveryLocation || "-"}

                </h4>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Shipping Method

                </p>

                <h4 className="mt-2 font-semibold">

                  {formData.shippingMethod || "-"}

                </h4>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Contact Person

                </p>

                <h4 className="mt-2 font-semibold">

                  {formData.contactPerson || "-"}

                </h4>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Contact Number

                </p>

                <h4 className="mt-2 font-semibold">

                  {formData.contactNumber || "-"}

                </h4>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Expected Delivery

                </p>

                <h4 className="mt-2 font-semibold">

                  {formData.expectedDeliveryDate || "-"}

                </h4>

              </div>
            </div>

            <div>

              <p className="text-sm text-slate-500">

                Delivery Instructions

              </p>

              <div className="mt-2 rounded-lg bg-slate-50 p-4">

                <p className="whitespace-pre-line">

                  {formData.deliveryInstructions ||

                    "No delivery instructions provided."}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

            {/* ==========================================
          Material Items Review
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h3 className="text-xl font-bold text-slate-800">

              Material Items

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Review all materials included in this Purchase Order.

            </p>

          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2">

            <span className="text-sm font-semibold text-blue-700">

              Total Items : {formData.items?.length || 0}

            </span>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">

                  Material

                </th>

                <th className="px-4 py-3 text-center">

                  Qty

                </th>

                <th className="px-4 py-3 text-center">

                  Unit

                </th>

                <th className="px-4 py-3 text-right">

                  Unit Price

                </th>

                <th className="px-4 py-3 text-center">

                  Discount %

                </th>

                <th className="px-4 py-3 text-center">

                  GST %

                </th>

                <th className="px-4 py-3 text-right">

                  Total

                </th>

              </tr>

            </thead>

            <tbody>

              {formData.items?.map((item, index) => {

                const qty =
                  Number(item.quantity) || 0;

                const price =
                  Number(item.unitPrice) || 0;

                const discount =
                  Number(item.discountPercentage) || 0;

                const gst =
                  Number(item.taxPercentage) || 0;

                const gross =
                  qty * price;

                const discountAmount =
                  gross * (discount / 100);

                const taxable =
                  gross - discountAmount;

                const gstAmount =
                  taxable * (gst / 100);

                const total =
                  taxable + gstAmount;

                return (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="px-4 py-3">

                      <div>

                        <p className="font-semibold">

                          {item.materialName}

                        </p>

                        <p className="text-xs text-slate-500">

                          {item.materialCode}

                        </p>

                      </div>

                    </td>

                    <td className="px-4 py-3 text-center">

                      {qty}

                    </td>

                    <td className="px-4 py-3 text-center">

                      {item.unitOfMeasure}

                    </td>

                    <td className="px-4 py-3 text-right">

                      ₹ {formatCurrency(price)}

                    </td>

                    <td className="px-4 py-3 text-center">

                      {discount}%

                    </td>

                    <td className="px-4 py-3 text-center">

                      {gst}%

                    </td>

                    <td className="px-4 py-3 text-right font-bold text-green-600">

                      ₹ {formatCurrency(total)}

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          Financial Summary
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-xl font-bold">

          Financial Summary

        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-xl bg-slate-100 p-5">

            <p className="text-sm text-slate-500">

              Subtotal

            </p>

            <h3 className="mt-2 text-xl font-bold">

              ₹ {formatCurrency(formData.subtotal)}

            </h3>

          </div>

          <div className="rounded-xl bg-red-50 p-5">

            <p className="text-sm text-red-600">

              Discount

            </p>

            <h3 className="mt-2 text-xl font-bold text-red-600">

              ₹ {formatCurrency(formData.discountAmount)}

            </h3>

          </div>

          <div className="rounded-xl bg-blue-50 p-5">

            <p className="text-sm text-blue-600">

              GST

            </p>

            <h3 className="mt-2 text-xl font-bold text-blue-700">

              ₹ {formatCurrency(formData.gstAmount)}

            </h3>

          </div>

          <div className="rounded-xl bg-yellow-50 p-5">

            <p className="text-sm text-yellow-700">

              Freight

            </p>

            <h3 className="mt-2 text-xl font-bold text-yellow-700">

              ₹ {formatCurrency(formData.freightCharges)}

            </h3>

          </div>

          <div className="rounded-xl bg-green-50 p-5">

            <p className="text-sm text-green-700">

              Grand Total

            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-700">

              ₹ {formatCurrency(formData.totalAmount)}

            </h2>

          </div>

        </div>

      </div>

            {/* ==========================================
          Validation Checklist
      ========================================== */}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

        <h3 className="mb-6 text-xl font-bold text-amber-700">

          Purchase Order Validation

        </h3>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Purchase Requisition Selected</span>

            {validations.purchaseRequisition ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Vendor Selected</span>

            {validations.vendor ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Material Items Available</span>

            {validations.materials ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Delivery Address Available</span>

            {validations.deliveryAddress ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Expected Delivery Date</span>

            {validations.expectedDelivery ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4">

            <span>Grand Total Calculated</span>

            {validations.grandTotal ? (

              <CheckCircle
                size={22}
                className="text-green-600"
              />

            ) : (

              <AlertCircle
                size={22}
                className="text-red-600"
              />

            )}

          </div>

        </div>

      </div>

      {/* ==========================================
          Terms & Conditions
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 text-xl font-bold text-slate-800">

          Terms & Conditions

        </h3>

        <div className="rounded-xl bg-slate-50 p-5">

          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">

            <li>

              All Purchase Order information has been verified.

            </li>

            <li>

              Vendor selection complies with procurement policy.

            </li>

            <li>

              Material quantities and commercial values have been reviewed.

            </li>

            <li>

              Delivery information is complete and accurate.

            </li>

            <li>

              This Purchase Order will be forwarded for the next approval or vendor communication as per your workflow.

            </li>

          </ul>

        </div>

      </div>

      {/* ==========================================
          Confirmation
      ========================================== */}

      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

        <label className="flex cursor-pointer items-start gap-4">

          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) =>
              setConfirmed(e.target.checked)
            }
            className="mt-1 h-5 w-5 rounded"
          />

          <div>

            <h4 className="font-semibold text-green-700">

              Confirmation

            </h4>

            <p className="mt-1 text-sm text-green-700">

              I confirm that all Purchase Order information has
              been verified and is accurate. I understand that
              this Purchase Order will be created once I proceed.

            </p>

          </div>

        </label>

        {!allValid && (

          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-600">

              Some mandatory information is missing.
              Please go back and complete all previous steps.

            </p>

          </div>

        )}

      </div>

            {/* ==========================================
          Purchase Order Status
      ========================================== */}

      <div
        className={`rounded-2xl border p-6 ${
          allValid && confirmed
            ? "border-green-200 bg-green-50"
            : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-center gap-4">

          {allValid && confirmed ? (

            <CheckCircle
              size={32}
              className="text-green-600"
            />

          ) : (

            <AlertCircle
              size={32}
              className="text-yellow-600"
            />

          )}

          <div>

            <h3 className="text-lg font-bold">

              {allValid && confirmed
                ? "Purchase Order Ready"
                : "Purchase Order Not Ready"}

            </h3>

            <p className="mt-1 text-sm text-slate-600">

              {allValid && confirmed
                ? "All required information has been verified. Click 'Create Purchase Order' to submit."
                : "Complete all validations and confirm the declaration before creating the Purchase Order."}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ReviewStep;