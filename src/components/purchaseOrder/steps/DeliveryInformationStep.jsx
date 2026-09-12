import { useEffect } from "react";

const DeliveryInformationStep = ({
  formData,
  setFormData,
  errors = {},
  setErrors,
}) => {

  /**
   * ==========================================
   * Update Field
   * ==========================================
   */

  const updateField = (field, value) => {

    setFormData((prev) => ({

      ...prev,

      [field]: value,

    }));

    if (setErrors) {

      setErrors((prev) => ({

        ...prev,

        [field]: "",

      }));

    }

  };

  /**
   * ==========================================
   * Default Shipping Method
   * ==========================================
   */

  useEffect(() => {

    if (!formData.shippingMethod) {

      setFormData((prev) => ({

        ...prev,

        shippingMethod: "Road",

      }));

    }

  }, []);

  return (

    <div className="space-y-8">
          {/* ==========================================
          Header
      ========================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Delivery Information

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Configure delivery location, contact details and
          receiving information for this Purchase Order.

        </p>

      </div>

      {/* ==========================================
          Delivery Information
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-bold">

          Delivery Details

        </h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Delivery Address */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-semibold">

              Delivery Address

              <span className="text-red-500"> *</span>

            </label>

            <textarea

              rows={4}

              placeholder="Enter complete delivery address..."

              value={formData.deliveryAddress}

              onChange={(e) =>

                updateField(

                  "deliveryAddress",

                  e.target.value

                )

              }

              className={`w-full rounded-xl border px-4 py-3 outline-none

              ${

                errors.deliveryAddress

                  ? "border-red-500"

                  : "border-slate-300 focus:border-blue-500"

              }`}

            />

            {errors.deliveryAddress && (

              <p className="mt-2 text-sm text-red-600">

                {errors.deliveryAddress}

              </p>

            )}

          </div>

          {/* Delivery Location */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Delivery Location

            </label>

            <input

              type="text"

              placeholder="Warehouse / Plant / Office"

              value={formData.deliveryLocation}

              onChange={(e) =>

                updateField(

                  "deliveryLocation",

                  e.target.value

                )

              }

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

            />

          </div>

          {/* Contact Person */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Contact Person

            </label>

            <input

              type="text"

              placeholder="Receiver Name"

              value={formData.contactPerson}

              onChange={(e) =>

                updateField(

                  "contactPerson",

                  e.target.value

                )

              }

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

            />

          </div>

          {/* Contact Number */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Contact Number

            </label>

            <input

              type="text"

              placeholder="Mobile Number"

              value={formData.contactNumber}

              onChange={(e) =>

                updateField(

                  "contactNumber",

                  e.target.value

                )

              }

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

            />

          </div>

          {/* Expected Delivery Date */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Expected Delivery Date

            </label>

            <input

              type="date"

              min={new Date().toISOString().split("T")[0]}

              value={formData.expectedDeliveryDate}

              onChange={(e) =>

                updateField(

                  "expectedDeliveryDate",

                  e.target.value

                )

              }

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

            />

          </div>

          {/* Delivery Time */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Delivery Time Slot

            </label>

            <select

              value={formData.deliveryTimeSlot || ""}

              onChange={(e) =>

                updateField(

                  "deliveryTimeSlot",

                  e.target.value

                )

              }

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

            >

              <option value="">

                Select Time Slot

              </option>

              <option value="09:00-12:00">

                09:00 AM - 12:00 PM

              </option>

              <option value="12:00-03:00">

                12:00 PM - 03:00 PM

              </option>

              <option value="03:00-06:00">

                03:00 PM - 06:00 PM

              </option>

            </select>

          </div>

        </div>

      </div>

            {/* ==========================================
          Shipping & Logistics
      ========================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-bold">

          Shipping & Logistics

        </h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Shipping Method */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Shipping Method

            </label>

            <select
              value={formData.shippingMethod}
              onChange={(e) =>
                updateField(
                  "shippingMethod",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >

              <option value="Road">

                Road

              </option>

              <option value="Rail">

                Rail

              </option>

              <option value="Air">

                Air

              </option>

              <option value="Sea">

                Sea

              </option>

              <option value="Courier">

                Courier

              </option>

            </select>

          </div>

          {/* Receiving Warehouse */}

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Receiving Warehouse

            </label>

            <input
              type="text"
              placeholder="Warehouse Name"
              value={formData.receivingWarehouse || ""}
              onChange={(e) =>
                updateField(
                  "receivingWarehouse",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Delivery Instructions */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-semibold">

              Delivery Instructions

            </label>

            <textarea
              rows={4}
              placeholder="Special unloading instructions, gate entry, handling requirements..."
              value={formData.deliveryInstructions || ""}
              onChange={(e) =>
                updateField(
                  "deliveryInstructions",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Special Notes */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-semibold">

              Special Notes

            </label>

            <textarea
              rows={3}
              placeholder="Additional notes for supplier..."
              value={formData.specialNotes || ""}
              onChange={(e) =>
                updateField(
                  "specialNotes",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </div>
            {/* ==========================================
          Delivery Summary
      ========================================== */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

        <div className="mb-6">

          <h3 className="text-xl font-bold text-slate-800">

            Delivery Summary

          </h3>

          <p className="mt-1 text-sm text-slate-500">

            Review the delivery information before proceeding
            to the final Purchase Order review.

          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Delivery Location */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Delivery Location

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.deliveryLocation || "-"}

            </h4>

          </div>

          {/* Shipping Method */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Shipping Method

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.shippingMethod || "-"}

            </h4>

          </div>

          {/* Expected Delivery */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Expected Delivery

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.expectedDeliveryDate
                ? new Date(
                    formData.expectedDeliveryDate
                  ).toLocaleDateString()
                : "-"}

            </h4>

          </div>

          {/* Material Count */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Total Materials

            </p>

            <h4 className="mt-2 text-2xl font-bold text-blue-600">

              {formData.items?.length || 0}

            </h4>

          </div>

          {/* Contact Person */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Contact Person

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.contactPerson || "-"}

            </h4>

          </div>

          {/* Contact Number */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Contact Number

            </p>

            <h4 className="mt-2 font-semibold text-slate-800">

              {formData.contactNumber || "-"}

            </h4>

          </div>

          {/* Freight Charges */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">

              Freight Charges

            </p>

            <h4 className="mt-2 font-semibold text-green-600">

              ₹{" "}

              {Number(
                formData.freightCharges || 0
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}

            </h4>

          </div>

          {/* Grand Total */}

          <div className="rounded-xl bg-green-50 p-5 shadow-sm">

            <p className="text-sm text-green-600">

              Grand Total

            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-700">

              ₹{" "}

              {Number(
                formData.totalAmount || 0
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}

            </h3>

          </div>

        </div>

        {/* Delivery Address */}

        <div className="mt-8 rounded-xl border bg-white p-5">

          <h4 className="mb-3 text-lg font-bold">

            Delivery Address

          </h4>

          <p className="text-slate-700 whitespace-pre-line">

            {formData.deliveryAddress ||

              "Delivery address not provided."}

          </p>

        </div>

        {/* Delivery Instructions */}

        <div className="mt-6 rounded-xl border bg-white p-5">

          <h4 className="mb-3 text-lg font-bold">

            Delivery Instructions

          </h4>

          <p className="text-slate-700 whitespace-pre-line">

            {formData.deliveryInstructions ||

              "No delivery instructions provided."}

          </p>

        </div>

      </div>

            {/* ==========================================
          Validation Checklist
      ========================================== */}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

        <h3 className="text-lg font-bold text-amber-700">

          Delivery Checklist

        </h3>

        <p className="mt-2 text-sm text-amber-700">

          Please verify the following before proceeding to the
          Review & Submit step.

        </p>

        <ul className="mt-5 list-disc space-y-3 pl-6 text-sm text-amber-700">

          <li>

            Verify the delivery address is correct.

          </li>

          <li>

            Confirm the contact person and mobile number.

          </li>

          <li>

            Ensure the expected delivery date is achievable.

          </li>

          <li>

            Verify the shipping method and transport details.

          </li>

          <li>

            Check freight charges before final approval.

          </li>

          <li>

            Review any delivery instructions or special notes.

          </li>

        </ul>

      </div>

      {/* ==========================================
          Completion Notice
      ========================================== */}

      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

        <h3 className="text-lg font-bold text-green-700">

          Delivery Information Completed

        </h3>

        <p className="mt-2 text-sm text-green-700">

          Delivery information has been captured successfully.
          Continue to the <strong>Review</strong> step to verify
          all Purchase Order details before creating the Purchase
          Order.

        </p>

      </div>

    </div>

  );

};

export default DeliveryInformationStep;