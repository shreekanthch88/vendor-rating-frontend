import React from "react";

const ComplianceStep = ({ formData, handleChange }) => {
  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: (value || "").toUpperCase(),
      },
    });
  };

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = !formData.panNumber || panRegex.test(formData.panNumber);

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isGstValid = !formData.gstNumber || gstRegex.test(formData.gstNumber);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50/70 border border-blue-200 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Compliance Format Guide:</p>
        <p className="text-xs text-blue-700">
          Statutory identifiers are automatically formatted to uppercase as you type. Use the format patterns below as reference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAN Number */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              PAN Number
            </label>
            <span className="text-xs font-mono text-gray-400">
              {(formData.panNumber || "").length}/10
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="panNumber"
              maxLength={10}
              placeholder="e.g. ABCDE1234F"
              value={formData.panNumber || ""}
              onChange={handleUppercaseChange}
              className={`w-full rounded-lg border p-3 font-mono text-sm tracking-wider uppercase placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-2 ${
                !isPanValid && formData.panNumber
                  ? "border-red-400 bg-red-50/30 focus:ring-red-300"
                  : formData.panNumber && isPanValid
                  ? "border-emerald-400 bg-emerald-50/30 focus:ring-emerald-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-gray-500">
              Pattern: <span className="font-mono text-blue-700 font-medium">XXXXX0000X</span> (5 Letters, 4 Digits, 1 Letter)
            </span>
            {formData.panNumber && (
              <span className={isPanValid ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                {isPanValid ? "✓ Valid Format" : "✗ Incomplete/Invalid"}
              </span>
            )}
          </div>
        </div>

        {/* GST Number */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              GST Number (GSTIN)
            </label>
            <span className="text-xs font-mono text-gray-400">
              {(formData.gstNumber || "").length}/15
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="gstNumber"
              maxLength={15}
              placeholder="e.g. 29ABCDE1234F1Z5"
              value={formData.gstNumber || ""}
              onChange={handleUppercaseChange}
              className={`w-full rounded-lg border p-3 font-mono text-sm tracking-wider uppercase placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-2 ${
                !isGstValid && formData.gstNumber
                  ? "border-red-400 bg-red-50/30 focus:ring-red-300"
                  : formData.gstNumber && isGstValid
                  ? "border-emerald-400 bg-emerald-50/30 focus:ring-emerald-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-gray-500">
              Pattern: <span className="font-mono text-blue-700 font-medium">00XXXXX0000X0Z0</span> (2 State + 10 PAN + 3 Entity/Check)
            </span>
            {formData.gstNumber && (
              <span className={isGstValid ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                {isGstValid ? "✓ Valid Format" : "✗ Incomplete/Invalid"}
              </span>
            )}
          </div>
        </div>

        {/* MSME / Udyam Number */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            MSME / Udyam Number
          </label>
          <input
            type="text"
            name="msmeNumber"
            placeholder="e.g. UDYAM-MH-01-0012345"
            value={formData.msmeNumber || ""}
            onChange={handleUppercaseChange}
            className="w-full rounded-lg border border-gray-300 p-3 font-mono text-sm tracking-wider uppercase placeholder:text-gray-400 placeholder:font-sans focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">
            Format: UDYAM-XX-00-0000000 (Optional)
          </p>
        </div>

        {/* CIN Number */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            CIN Number (Corporate ID)
          </label>
          <input
            type="text"
            name="cinNumber"
            maxLength={21}
            placeholder="e.g. L12345MH2020PLC123456"
            value={formData.cinNumber || ""}
            onChange={handleUppercaseChange}
            className="w-full rounded-lg border border-gray-300 p-3 font-mono text-sm tracking-wider uppercase placeholder:text-gray-400 placeholder:font-sans focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">
            21-digit Corporate Identification Number (Optional)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStep;