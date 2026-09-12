import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
} from "lucide-react";

import {
  createPurchaseOrder,
} from "../../services/purchaseOrderService";

import BasicInformationStep from "./steps/BasicInformationStep";
import VendorSelectionStep from "./steps/VendorSelectionStep";
import MaterialItemsStep from "./steps/MaterialItemsStep";
import DeliveryInformationStep from "./steps/DeliveryInformationStep";
import ReviewStep from "./steps/ReviewStep";

const steps = [
  "Basic Information",
  "Vendor Selection",
  "Material Items",
  "Delivery Information",
  "Review",
];

const AddPurchaseOrderWizard = ({
  isOpen,
  onClose,
  onSuccess,
}) => {

  const [currentStep, setCurrentStep] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] =
    useState({

      /* Basic Information */

      purchaseRequisition: "",

      orderDate: "",

      expectedDeliveryDate: "",

      priority: "Medium",

      paymentTerms: "",

      currency: "INR",

      deliveryLocation: "",

      buyerRemarks: "",

      /* Vendor */

      vendor: "",

      /* Materials */

      items: [],

      /* Delivery */

      deliveryAddress: "",

      contactPerson: "",

      contactNumber: "",

      shippingMethod: "",

      transportDetails: "",

      freightCharges: 0,

    });

      /**
   * ==========================================
   * Validate Current Step
   * ==========================================
   */

const validateStep = () => {

  const newErrors = {};

  switch (currentStep) {

    case 0:

      if (!formData.purchaseRequisition) {
        newErrors.purchaseRequisition =
          "Purchase Requisition is required.";
      }

      if (!formData.expectedDeliveryDate) {
        newErrors.expectedDeliveryDate =
          "Expected Delivery Date is required.";
      }

      break;

    case 1:

      if (!formData.vendor) {
        newErrors.vendor =
          "Vendor selection is required.";
      }

      break;

    case 2:

      if (formData.items.length === 0) {
        newErrors.items =
          "Add at least one material.";
      }

      break;

    case 3:

      if (!formData.deliveryAddress) {
        newErrors.deliveryAddress =
          "Delivery Address is required.";
      }

      break;

    default:
      break;
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;

};

    /**
   * ==========================================
   * Next Step
   * ==========================================
   */

  const handleNext = () => {

    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {

      setCurrentStep(currentStep + 1);

    }

  };

  /**
   * ==========================================
   * Previous Step
   * ==========================================
   */

  const handlePrevious = () => {

    if (currentStep > 0) {

      setCurrentStep(currentStep - 1);

    }

  };
    /**
   * ==========================================
   * Reset Form
   * ==========================================
   */
  const resetForm = () => {

    setCurrentStep(0);

    setFormData({

      /* Basic Information */

      purchaseRequisition: "",

      orderDate: "",

      expectedDeliveryDate: "",

      priority: "Medium",

      paymentTerms: "",

      currency: "INR",

      deliveryLocation: "",

      buyerRemarks: "",

      /* Vendor */

      vendor: "",

      /* Materials */

      items: [],

      /* Delivery */

      deliveryAddress: "",

      contactPerson: "",

      contactNumber: "",

      shippingMethod: "",

      transportDetails: "",

      freightCharges: 0,

    });

  };

  /**
   * ==========================================
   * Create Purchase Order
   * ==========================================
   */
  const handleCreatePurchaseOrder = async () => {

    if (!validateStep()) return;

    try {

      setLoading(true);

      const payload = {

        purchaseRequisition:
          formData.purchaseRequisition,

        vendor:
          formData.vendor,

        expectedDeliveryDate:
          formData.expectedDeliveryDate,

        paymentTerms:
          formData.paymentTerms,

        deliveryLocation:
          formData.deliveryLocation,

        currency:
          formData.currency,

        priority:
          formData.priority,

        buyerRemarks:
          formData.buyerRemarks,

        freightCharges:
          Number(formData.freightCharges),

        items:
          formData.items,

      };

      await createPurchaseOrder(payload);

      console.log(
  "Purchase Order created successfully."
);

      resetForm();

      onSuccess();

    } catch (error) {
  console.error("========== CREATE PO ERROR ==========");

  console.error("Status:", error.response?.status);

  console.error(
    "Response:",
    error.response?.data
  );

  console.error(
    "Response JSON:",
    JSON.stringify(
      error.response?.data,
      null,
      2
    )
  );

  console.error(
    "Request URL:",
    error.config?.url
  );

  console.error(
    "Request Data:",
    error.config?.data
  );

  console.error(
    "======================================"
  );

  alert(
    error.response?.data?.message ||
    "Failed to create Purchase Order."
  );
} finally {
  setLoading(false);
}

  };
  /**
 * ==========================================
 * Close Wizard
 * ==========================================
 */
const closeWizard = () => {

  if (loading) return;

  resetForm();

  setErrors({});

  onClose();

};
  if (!isOpen) return null;

    return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="flex h-[95vh] w-[96%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold">

              Create Purchase Order

            </h2>

            <p className="text-sm text-gray-500">

              Complete the steps below to generate a Purchase Order.

            </p>

          </div>

          <button
            onClick={closeWizard}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Stepper */}

        <div className="border-b bg-slate-50 px-8 py-6">

          <div className="flex items-center justify-between">

            {steps.map((step, index) => (

              <div
                key={step}
                className="flex flex-1 items-center"
              >

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold

                  ${
                    index < currentStep
                      ? "bg-green-600 text-white"
                      : index === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >

                  {index < currentStep ? (

                    <Check size={18} />

                  ) : (

                    index + 1

                  )}

                </div>

                <div className="ml-3">

                  <p className="text-sm font-semibold">

                    {step}

                  </p>

                </div>

                {index !== steps.length - 1 && (

                  <div className="mx-4 h-1 flex-1 rounded bg-gray-300" />

                )}

              </div>

            ))}

          </div>

        </div>
                {/* ==========================================
            Wizard Body
        ========================================== */}

        <div
  key={currentStep}
  className="flex-1 overflow-y-auto p-8 transition-all duration-300 animate-fade"
>

          {currentStep === 0 && (
            <BasicInformationStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 1 && (
            <VendorSelectionStep
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === 2 && (
            <MaterialItemsStep
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === 3 && (
            <DeliveryInformationStep
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === 4 && (
            <ReviewStep
              formData={formData}
            />
          )}

        </div>

                {/* ==========================================
            Footer
        ========================================== */}

        <div className="flex items-center justify-between border-t bg-slate-50 px-8 py-5">

          {/* Left Side */}

          <button
            onClick={closeWizard}
            className="rounded-xl border border-slate-300 px-6 py-2.5 font-medium transition hover:bg-slate-100"
          >
            Cancel
          </button>

          {/* Right Side */}

          <div className="flex items-center gap-3">

            {currentStep > 0 && (

              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100"
              >
                <ChevronLeft size={18} />

                Previous

              </button>

            )}

            {currentStep < steps.length - 1 ? (

              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Next

                <ChevronRight size={18} />

              </button>

            ) : (

              <button
                onClick={handleCreatePurchaseOrder}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Creating..."
                  : "Create Purchase Order"}

              </button>

            )}

          </div>

        </div>

      </div>

    </div>
    )

};

export default AddPurchaseOrderWizard;
