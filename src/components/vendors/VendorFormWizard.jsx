import { useEffect, useState } from "react";

import BasicInfoStep from "./steps/BasicInfoStep";
import ComplianceStep from "./steps/ComplianceStep";
import ContactStep from "./steps/ContactStep";
import AddressStep from "./steps/AddressStep";
import BankDetailsStep from "./steps/BankDetailsStep";
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

  // Purchase Configuration — defaults (not shown to user, used by backend/PO)
  paymentTerms: "30 Days",
  creditDays: 30,
  leadTime: 0,
  currency: "INR",

  // Vendor Preference
  preferredVendor: false,
  status: "Pending",
};

// ======================================================
// Helper: Deep merge data with initial template
// ======================================================
export const getCleanFormData = (data) => ({
  ...initialVendorFormData,
  ...(data || {}),
  address: {
    ...initialVendorFormData.address,
    ...(data?.address || {}),
  },
  bankDetails: {
    ...initialVendorFormData.bankDetails,
    ...(data?.bankDetails || {}),
  },
});

// ======================================================
// Step Titles — 6 steps (Payment Terms/Purchase Config removed)
// ======================================================
const STEPS = [
  "Basic Information",
  "Compliance",
  "Contact",
  "Address",
  "Bank Details",
  "Review",
];

const TOTAL_STEPS = STEPS.length;

// ======================================================
// Regex helpers
// ======================================================
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/;
const PINCODE_REGEX = /^\d{6}$/;
const LETTERS_ONLY_REGEX = /^[a-zA-Z\s.'-]+$/;

// ======================================================
// Per-step validation
// ======================================================
const validateStep = (step, formData) => {
  const errs = {};

  // ── Step 1: Basic Information ───────────────────────
  if (step === 1) {
    if (!formData.vendorName?.trim()) {
      errs.vendorName = "Vendor name is required.";
    } else if (formData.vendorName.trim().length < 3) {
      errs.vendorName = "Vendor name must be at least 3 characters.";
    }
  }

  // ── Step 2: Compliance — PAN & GST format ──────────
  if (step === 2) {
    const pan = (formData.panNumber || "").trim();
    const gst = (formData.gstNumber || "").trim();

    if (pan && !PAN_REGEX.test(pan)) {
      errs.panNumber =
        "Invalid PAN format. Expected: ABCDE1234F (5 letters, 4 digits, 1 letter).";
    }
    if (gst && !GST_REGEX.test(gst)) {
      errs.gstNumber =
        "Invalid GSTIN format. Expected: 29ABCDE1234F1Z5 (15 characters).";
    }
  }

  // ── Step 3: Contact ─────────────────────────────────
  if (step === 3) {
    const contactPerson = (formData.contactPerson || "").trim();
    const email = (formData.email || "").trim();
    const mobile = (formData.mobile || "").trim();
    const alternateMobile = (formData.alternateMobile || "").trim();

    if (!contactPerson) {
      errs.contactPerson = "Contact person name is required.";
    } else if (contactPerson.length < 2) {
      errs.contactPerson = "Contact person name must be at least 2 characters.";
    }

    if (!email) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!mobile) {
      errs.mobile = "Mobile number is required.";
    } else if (!MOBILE_REGEX.test(mobile)) {
      errs.mobile = "Enter a valid 10-digit Indian mobile number (starts with 6-9).";
    }

    if (alternateMobile && !MOBILE_REGEX.test(alternateMobile)) {
      errs.alternateMobile = "Enter a valid 10-digit Indian mobile number.";
    }
  }

  // ── Step 4: Address — optional pincode format ───────
  if (step === 4) {
    const pincode = (formData.address?.pincode || "").trim();
    if (pincode && !PINCODE_REGEX.test(pincode)) {
      errs.pincode = "Pincode must be exactly 6 digits.";
    }
  }

  // ── Step 5: Bank Details ────────────────────────────
  if (step === 5) {
    const accountHolder = (formData.bankDetails?.accountHolder || "").trim();
    const accountNumber = (formData.bankDetails?.accountNumber || "").trim();
    const ifscCode = (formData.bankDetails?.ifscCode || "").trim();
    const hasBankData =
      accountHolder ||
      accountNumber ||
      ifscCode ||
      (formData.bankDetails?.bankName || "").trim();

    if (hasBankData) {
      if (accountHolder) {
        if (accountHolder.length < 3) {
          errs.accountHolder = "Account holder name must be at least 3 characters.";
        } else if (!LETTERS_ONLY_REGEX.test(accountHolder)) {
          errs.accountHolder = "Account holder name must contain only letters (no numbers).";
        }
      }
      if (accountNumber && !ACCOUNT_NUMBER_REGEX.test(accountNumber)) {
        errs.accountNumber = "Account number must be 9 to 18 digits only.";
      }
      if (ifscCode && !IFSC_REGEX.test(ifscCode)) {
        errs.ifscCode =
          "IFSC must be 11 characters: 4 letters + 0 + 6 letters/digits (e.g. SBIN0001234).";
      }
    }
  }

  // Step 6 = Review — no validation needed
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
  isEdit = false,
}) => {
  const isEditMode =
    isEdit || Boolean(initialData?._id) || title?.toLowerCase().includes("edit");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => getCleanFormData(initialData));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(getCleanFormData(initialData));
      setStep(1);
      setErrors({});
      setSubmitError("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // ── Top-level field handler ─────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
    setSubmitError("");
  };

  // ── Nested address handler ──────────────────────────
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  // ── Nested bank handler ─────────────────────────────
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value },
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  // ── Navigation ──────────────────────────────────────
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
    setSubmitError("");
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setStep(1);
    setFormData(getCleanFormData(initialData));
    setErrors({});
    setSubmitError("");
    onClose();
  };

  // ── Build payload — strip blanks, keep purchase defaults
  const buildPayload = (data) => {
    const payload = { ...data };

    const OPTIONAL_ENUMS = ["vendorCategory", "businessType"];
    OPTIONAL_ENUMS.forEach((f) => {
      if (!payload[f]) delete payload[f];
    });

    const OPTIONAL_STRINGS = [
      "description",
      "gstNumber",
      "panNumber",
      "msmeNumber",
      "cinNumber",
      "designation",
      "alternateMobile",
      "website",
    ];
    OPTIONAL_STRINGS.forEach((f) => {
      if (!payload[f]?.trim()) delete payload[f];
    });

    // Always send purchase config defaults so backend/PO is unaffected
    if (!payload.paymentTerms) payload.paymentTerms = "30 Days";
    if (payload.creditDays === undefined || payload.creditDays === "")
      payload.creditDays = 30;
    if (payload.leadTime === undefined || payload.leadTime === "")
      payload.leadTime = 0;
    if (!payload.currency) payload.currency = "INR";

    return payload;
  };

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    // Validate current step
    let stepErrors = validateStep(step, formData);

    // In edit mode, ensure at least vendorName is valid
    if (isEditMode && !formData.vendorName?.trim()) {
      stepErrors.vendorName = "Vendor name is required.";
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");
      await onSubmit(buildPayload(formData));
      setStep(1);
      setFormData(getCleanFormData(initialData));
      setErrors({});
      setSubmitError("");
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save vendor. Please check all fields and try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="border-b px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {isEditMode && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Edit Mode — Save from any step
              </span>
            )}
          </div>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {submitError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <strong className="font-semibold">Error: </strong>{submitError}
            </div>
          )}

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
              errors={errors}
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
              errors={errors}
            />
          )}
          {step === 5 && (
            <BankDetailsStep
              formData={formData}
              handleBankChange={handleBankChange}
              errors={errors}
            />
          )}
          {step === 6 && (
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

            {isEditMode ? (
              // ── EDIT MODE: Show Next (if not last step) AND Update button on ALL steps ──
              <>
                {step < TOTAL_STEPS && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-lg border border-blue-600 bg-blue-50 px-5 py-2 text-blue-700 hover:bg-blue-100 transition font-medium"
                  >
                    Next →
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition font-semibold disabled:opacity-60 shadow-sm"
                >
                  {submitting ? "Updating..." : (submitText || "Update Vendor")}
                </button>
              </>
            ) : (
              // ── ADD MODE: Sequential wizard flow ──
              step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition font-semibold"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition font-semibold disabled:opacity-60 shadow-sm"
                >
                  {submitting ? "Saving..." : (submitText || "Save Vendor")}
                </button>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorFormWizard;
