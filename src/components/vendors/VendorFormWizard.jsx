import { useEffect, useState } from "react";

import BasicInfoStep from "./steps/BasicInfoStep";
import ComplianceStep from "./steps/ComplianceStep";
import ContactStep from "./steps/ContactStep";
import AddressStep from "./steps/AddressStep";
import BankDetailsStep from "./steps/BankDetailsStep";
import PurchaseConfigStep from "./steps/PurchaseConfigStep";
import ReviewStep from "./steps/ReviewStep";

// ======================================================
// Default blank form — every field the model accepts
// ======================================================
export const initialVendorFormData = {
  // Basic Information
  vendorName: "",
  vendorCategory: "",
  businessType: "",
  description: "",

  // Compliance
  gstNumber: "",
  panNumber: "",
  msmeNumber: "",
  cinNumber: "",

  // Contact
  contactPerson: "",
  designation: "",
  email: "",
  mobile: "",
  alternateMobile: "",
  website: "",

  // Address
  address: {
    line1: "",
    line2: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
  },

  // Bank Details
  bankDetails: {
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
  },

  // Purchase Configuration
  paymentTerms: "30 Days",
  creditDays: 30,
  leadTime: 0,
  currency: "INR",

  // Vendor Preference
  preferredVendor: false,
  status: "Pending",
};

// ======================================================
// Step Titles
// ======================================================
const STEPS = [
  "Basic Information",
  "Compliance",
  "Contact",
  "Address",
  "Bank Details",
  "Purchase Config",
  "Review",
];

const TOTAL_STEPS = STEPS.length;

// ======================================================
// Per-step validation
// ======================================================
const validateStep = (step, formData) => {
  const errs = {};

  if (step === 1) {
    if (!formData.vendorName?.trim()) {
      errs.vendorName = "Vendor name is required.";
    }
  }

  if (step === 3) {
    if (!formData.contactPerson?.trim()) {
      errs.contactPerson = "Contact person is required.";
    }

    if (!formData.email?.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.mobile?.trim()) {
      errs.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errs.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
  }

  return errs;
};

// ======================================================
// Wizard Component
// ======================================================
const VendorFormWizard = ({
  isOpen,
  onClose,
  initialData,
  title,
  submitText,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(
    initialData || initialVendorFormData
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync initial data when the modal is opened for edit
  useEffect(() => {
    setFormData(initialData || initialVendorFormData);
    setStep(1);
    setErrors({});
  }, [initialData]);

  if (!isOpen) return null;

  // -------------------------------------------------------
  // Top-level field handler
  // -------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // -------------------------------------------------------
  // Nested address handler
  // -------------------------------------------------------
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // -------------------------------------------------------
  // Nested bank handler
  // -------------------------------------------------------
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value },
    }));
  };

  // -------------------------------------------------------
  // Navigation
  // -------------------------------------------------------
  const goNext = () => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
  };

  const goPrev = () => {
    setErrors({});
    if (step > 1) setStep((prev) => prev - 1);
  };

  // -------------------------------------------------------
  // Cancel / Close
  // -------------------------------------------------------
  const handleClose = () => {
    setStep(1);
    setFormData(initialData || initialVendorFormData);
    setErrors({});
    onClose();
  };

  // -------------------------------------------------------
  // Submit — strip empty optional enum strings so MongoDB
  // does not reject them (e.g. vendorCategory="")
  // -------------------------------------------------------
  const buildPayload = (data) => {
    const payload = { ...data };

    // Optional enum fields: send undefined (omit) when blank so the
    // model's default kicks in instead of failing validation.
    const OPTIONAL_ENUM_FIELDS = ["vendorCategory", "businessType"];
    OPTIONAL_ENUM_FIELDS.forEach((field) => {
      if (!payload[field]) delete payload[field];
    });

    // Optional plain strings: strip blanks so we don't store empty strings
    const OPTIONAL_STRINGS = [
      "description",
      "gstNumber", "panNumber", "msmeNumber", "cinNumber",
      "designation", "alternateMobile", "website",
    ];
    OPTIONAL_STRINGS.forEach((field) => {
      if (!payload[field]?.trim()) delete payload[field];
    });

    return payload;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onSubmit(buildPayload(formData));
      setStep(1);
      setFormData(initialData || initialVendorFormData);
      setErrors({});
      onClose();
    } catch {
      // Error handling is done by the parent onSubmit
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="border-b px-6 py-5 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

          {/* Step progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm text-gray-500 font-medium">
                Step {step} of {TOTAL_STEPS} — {STEPS[step - 1]}
              </p>
              <p className="text-xs text-gray-400">
                {Math.round((step / TOTAL_STEPS) * 100)}% complete
              </p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && (
            <BasicInfoStep
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {step === 2 && (
            <ComplianceStep
              formData={formData}
              handleChange={handleChange}
            />
          )}
          {step === 3 && (
            <ContactStep
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {step === 4 && (
            <AddressStep
              formData={formData}
              handleAddressChange={handleAddressChange}
            />
          )}
          {step === 5 && (
            <BankDetailsStep
              formData={formData}
              handleBankChange={handleBankChange}
            />
          )}
          {step === 6 && (
            <PurchaseConfigStep
              formData={formData}
              handleChange={handleChange}
            />
          )}
          {step === 7 && (
            <ReviewStep formData={formData} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                ← Previous
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition disabled:opacity-60"
              >
                {submitting ? "Saving..." : submitText}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorFormWizard;
