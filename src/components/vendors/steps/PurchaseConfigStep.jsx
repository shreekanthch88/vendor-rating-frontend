const PAYMENT_TERMS_OPTIONS = [
  "7 Days",
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
  "90 Days",
  "Advance",
  "COD",
];

const CURRENCY_OPTIONS = [
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "SGD", label: "SGD — Singapore Dollar" },
];

const PurchaseConfigStep = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Purchase Configuration</p>
        <p className="text-xs text-blue-700">
          Configure payment terms, lead time, and currency for this vendor. These settings
          apply to all purchase orders raised against this vendor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Payment Terms */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Payment Terms
          </label>
          <select
            name="paymentTerms"
            value={formData.paymentTerms || "30 Days"}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {PAYMENT_TERMS_OPTIONS.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Number of days after invoice date by which payment must be made.
          </p>
        </div>

        {/* Credit Days */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Credit Days
          </label>
          <input
            type="number"
            name="creditDays"
            value={formData.creditDays ?? 30}
            onChange={handleChange}
            min={0}
            max={365}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Credit period extended to this vendor (0 for no credit).
          </p>
        </div>

        {/* Lead Time */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Lead Time (days)
          </label>
          <input
            type="number"
            name="leadTime"
            value={formData.leadTime ?? 0}
            onChange={handleChange}
            min={0}
            max={365}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Expected days between PO placement and delivery.
          </p>
        </div>

        {/* Currency */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency || "INR"}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {CURRENCY_OPTIONS.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Preferred Vendor */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-4">

          <input
            type="checkbox"
            name="preferredVendor"
            id="preferredVendor"
            checked={!!formData.preferredVendor}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <div>
            <label
              htmlFor="preferredVendor"
              className="text-sm font-semibold text-gray-800 cursor-pointer"
            >
              Mark as Preferred Vendor
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Preferred vendors are shown first during Purchase Order creation and may receive priority allocations.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PurchaseConfigStep;

