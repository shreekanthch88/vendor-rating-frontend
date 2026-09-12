import { useState } from "react";

import BasicInfoStep from "./steps/BasicInfoStep";
import ComplianceStep from "./steps/ComplianceStep";
import ContactStep from "./steps/ContactStep";
import AddressStep from "./steps/AddressStep";
import BankDetailsStep from "./steps/BankDetailsStep";
import ReviewStep from "./steps/ReviewStep";

const initialFormData = {
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

const AddVendorWizard = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  if (!isOpen) return null;

  // -----------------------------
  // Top Level Fields
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------
  // Address
  // -----------------------------
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // -----------------------------
  // Bank Details
  // -----------------------------
  const handleBankChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value,
      },
    }));
  };

  // -----------------------------
  // Navigation
  // -----------------------------
  const nextStep = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // -----------------------------
  // Close
  // -----------------------------
  const handleClose = () => {
    setStep(1);
    setFormData(initialFormData);
    onClose();
  };

  // -----------------------------
  // Save
  // -----------------------------
  const handleSubmit = () => {
    onSave(formData);

    setStep(1);
    setFormData(initialFormData);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">Add Vendor</h2>

          <p className="mt-2 text-gray-500">
            Step {step} of 6
          </p>
        </div>

        {/* Body */}
        <div className="min-h-[420px] p-6">

          {step === 1 && (
            <BasicInfoStep
              formData={formData}
              handleChange={handleChange}
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
            <ReviewStep
              formData={formData}
            />
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-6">

          <button
            onClick={handleClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="space-x-3">

            {step > 1 && (
              <button
                onClick={previousStep}
                className="rounded-lg border px-5 py-2 hover:bg-gray-100"
              >
                Previous
              </button>
            )}

            {step < 6 ? (
              <button
                onClick={nextStep}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
              >
                Save Vendor
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AddVendorWizard;