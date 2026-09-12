import { useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";

const MaterialItemsStep = ({
  formData,
  setFormData,
  errors = {},
  setErrors,
}) => {

  /**
   * ==========================================
   * Update Item
   * ==========================================
   */

  const updateItem = (index, field, value) => {

    const updatedItems = [...formData.items];

    updatedItems[index] = {

      ...updatedItems[index],

      [field]: value,

    };

    setFormData((prev) => ({

      ...prev,

      items: updatedItems,

    }));

    if (setErrors) {

      setErrors((prev) => ({

        ...prev,

        items: "",

      }));

    }

  };

  /**
   * ==========================================
   * Remove Item
   * ==========================================
   */

  const removeItem = (index) => {

    const updatedItems = [...formData.items];

    updatedItems.splice(index, 1);

    setFormData((prev) => ({

      ...prev,

      items: updatedItems,

    }));

  };

  /**
   * ==========================================
   * Calculate Line Total
   * ==========================================
   */

  const calculateLineTotal = (item) => {

    const quantity =
      Number(item.quantity) || 0;

    const unitPrice =
      Number(item.unitPrice) || 0;

    const discount =
      Number(item.discountPercentage) || 0;

    const gst =
      Number(item.taxPercentage) || 0;

    const grossAmount =
      quantity * unitPrice;

    const discountAmount =
      grossAmount * (discount / 100);

    const taxableAmount =
      grossAmount - discountAmount;

    const gstAmount =
      taxableAmount * (gst / 100);

    return taxableAmount + gstAmount;

  };

  /**
   * ==========================================
   * Calculate Summary
   * ==========================================
   */

  const summary = useMemo(() => {

    let subtotal = 0;

    let discount = 0;

    let gst = 0;

    formData.items.forEach((item) => {

      const quantity =
        Number(item.quantity) || 0;

      const unitPrice =
        Number(item.unitPrice) || 0;

      const discountPercentage =
        Number(item.discountPercentage) || 0;

      const taxPercentage =
        Number(item.taxPercentage) || 0;

      const gross =
        quantity * unitPrice;

      const discountAmount =
        gross * (discountPercentage / 100);

      const taxable =
        gross - discountAmount;

      const gstAmount =
        taxable * (taxPercentage / 100);

      subtotal += gross;

      discount += discountAmount;

      gst += gstAmount;

    });

    const freight =
      Number(formData.freightCharges) || 0;

    const grandTotal =
      subtotal -
      discount +
      gst +
      freight;

    return {

      subtotal,

      discount,

      gst,

      freight,

      grandTotal,

    };

  }, [formData.items, formData.freightCharges]);

  /**
   * ==========================================
   * Auto Save Totals
   * ==========================================
   */

  useEffect(() => {

    setFormData((prev) => ({

      ...prev,

      subtotal: summary.subtotal,

      discountAmount:
        summary.discount,

      gstAmount:
        summary.gst,

      totalAmount:
        summary.grandTotal,

    }));

  }, [summary]);
    return (

    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Material Items

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Review the materials copied from the Purchase
          Requisition and enter the commercial details.

        </p>

      </div>

      {/* Validation */}

      {errors.items && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">

          <p className="text-sm font-medium text-red-600">

            {errors.items}

          </p>

        </div>

      )}

      {/* ==========================================
          Material Table
      ========================================== */}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">

                Material Code

              </th>

              <th className="px-4 py-3 text-left">

                Material Name

              </th>

              <th className="px-4 py-3 text-center">

                Quantity

              </th>

              <th className="px-4 py-3 text-center">

                Unit

              </th>

              <th className="px-4 py-3 text-center">

                Unit Price

              </th>

              <th className="px-4 py-3 text-center">

                Discount %

              </th>

              <th className="px-4 py-3 text-center">

                GST %

              </th>

              <th className="px-4 py-3 text-right">

                Line Total

              </th>

              <th className="px-4 py-3 text-center">

                Actions

              </th>

            </tr>

          </thead>

          <tbody>

            {formData.items.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="py-12 text-center text-slate-500"
                >

                  No materials available.

                </td>

              </tr>

            ) : (

              formData.items.map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >

                  {/* Material Code */}

                  <td className="px-4 py-3 font-medium">

                    {item.materialCode || "-"}

                  </td>

                  {/* Material Name */}

                  <td className="px-4 py-3">

                    {item.materialName || "-"}

                  </td>

                  {/* Quantity */}

                  <td className="px-4 py-3 text-center">

                    {item.quantity}

                  </td>

                  {/* Unit */}

                  <td className="px-4 py-3 text-center">

                    {item.unitOfMeasure}

                  </td>

                                    {/* Unit Price */}

                  <td className="px-4 py-3">

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                      className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-right outline-none focus:border-blue-500"
                    />

                  </td>

                  {/* Discount */}

                  <td className="px-4 py-3">

                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.discountPercentage}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "discountPercentage",
                          e.target.value
                        )
                      }
                      className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none focus:border-blue-500"
                    />

                  </td>

                  {/* GST */}

                  <td className="px-4 py-3">

                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.taxPercentage}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "taxPercentage",
                          e.target.value
                        )
                      }
                      className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none focus:border-blue-500"
                    />

                  </td>

                  {/* Line Total */}

                  <td className="px-4 py-3 text-right font-bold text-green-600">

                    ₹{" "}

                    {calculateLineTotal(item).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}

                  </td>

                  {/* Delete */}

                  <td className="px-4 py-3 text-center">

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                      title="Remove Item"
                    >

                      <Trash2 size={18} />

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ==========================================
          Item Remarks
      ========================================== */}

      {formData.items.length > 0 && (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-lg font-bold text-slate-800">

            Item Remarks

          </h3>

          <div className="space-y-4">

            {formData.items.map((item, index) => (

              <div
                key={index}
                className="grid grid-cols-1 gap-4 lg:grid-cols-4"
              >

                <div className="font-medium">

                  {item.materialName}

                </div>

                <div className="lg:col-span-3">

                  <textarea
                    rows={2}
                    placeholder="Remarks for this material..."
                    value={item.remarks || ""}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "remarks",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      )}
            {/* ==========================================
          Financial Summary
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h3 className="text-xl font-bold text-slate-800">

            Purchase Order Summary

          </h3>

          <p className="mt-1 text-sm text-slate-500">

            Review the financial summary before proceeding.

          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Summary Cards */}

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-100 p-4">

              <p className="text-sm text-slate-500">

                Subtotal

              </p>

              <h4 className="mt-2 text-xl font-bold">

                ₹{" "}

                {summary.subtotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}

              </h4>

            </div>

            <div className="rounded-xl bg-red-50 p-4">

              <p className="text-sm text-red-600">

                Discount

              </p>

              <h4 className="mt-2 text-xl font-bold text-red-600">

                ₹{" "}

                {summary.discount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}

              </h4>

            </div>

            <div className="rounded-xl bg-blue-50 p-4">

              <p className="text-sm text-blue-600">

                GST

              </p>

              <h4 className="mt-2 text-xl font-bold text-blue-600">

                ₹{" "}

                {summary.gst.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}

              </h4>

            </div>

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-sm text-green-600">

                Grand Total

              </p>

              <h4 className="mt-2 text-2xl font-bold text-green-600">

                ₹{" "}

                {summary.grandTotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}

              </h4>

            </div>

          </div>

          {/* Charges */}

          <div className="rounded-xl border border-slate-200 p-5">

            <h4 className="mb-5 text-lg font-semibold">

              Additional Charges

            </h4>

            <div className="space-y-5">

              {/* Freight */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Freight Charges

                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.freightCharges}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      freightCharges: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Currency */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Currency

                </label>

                <input
                  type="text"
                  value={formData.currency}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
                />

              </div>

              {/* Total Items */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Total Materials

                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.items.length}
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

            {/* ==========================================
          Purchase Summary Information
      ========================================== */}

      {formData.items.length > 0 && (

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-800">

              Purchase Order Information

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Review the material calculations before proceeding
              to the Delivery Information step.

            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Total Materials */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">

                Total Materials

              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-600">

                {formData.items.length}

              </h2>

            </div>

            {/* Total Quantity */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">

                Total Quantity

              </p>

              <h2 className="mt-2 text-2xl font-bold text-indigo-600">

                {

                  formData.items.reduce(

                    (total, item) =>

                      total + Number(item.quantity || 0),

                    0

                  )

                }

              </h2>

            </div>

            {/* Average GST */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">

                Average GST

              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-600">

                {

                  formData.items.length

                    ? (

                        formData.items.reduce(

                          (total, item) =>

                            total +

                            Number(item.taxPercentage || 0),

                          0

                        ) /

                        formData.items.length

                      ).toFixed(2)

                    : 0

                }

                %

              </h2>

            </div>

            {/* Average Discount */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">

                Average Discount

              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">

                {

                  formData.items.length

                    ? (

                        formData.items.reduce(

                          (total, item) =>

                            total +

                            Number(item.discountPercentage || 0),

                          0

                        ) /

                        formData.items.length

                      ).toFixed(2)

                    : 0

                }

                %

              </h2>

            </div>

          </div>

        </div>

      )}

      {/* ==========================================
          Empty State
      ========================================== */}

      {formData.items.length === 0 && (

        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-16 text-center">

          <h3 className="text-xl font-semibold text-slate-700">

            No Material Items Available

          </h3>

          <p className="mt-3 text-slate-500">

            Material items are copied automatically from the
            selected Purchase Requisition.

          </p>

          <p className="mt-2 text-sm text-slate-400">

            Please go back and select a Purchase Requisition.

          </p>

        </div>

      )}

      {/* ==========================================
          Validation Notes
      ========================================== */}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

        <h4 className="font-semibold text-amber-700">

          Validation Checklist

        </h4>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-700">

          <li>

            Unit Price must be greater than zero.

          </li>

          <li>

            Discount Percentage should be between 0% and 100%.

          </li>

          <li>

            GST Percentage should be between 0% and 100%.

          </li>

          <li>

            Verify quantities before creating the Purchase Order.

          </li>

          <li>

            Review Grand Total before proceeding.

          </li>

        </ul>

      </div>
          </div>

  );

};

export default MaterialItemsStep;