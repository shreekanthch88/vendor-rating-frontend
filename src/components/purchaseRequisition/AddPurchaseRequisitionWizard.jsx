import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Save } from "lucide-react";

import BasicInformationStep from "./steps/BasicInformationStep";
import MaterialItemsStep from "./steps/MaterialItemsStep";
import ReviewStep from "./steps/ReviewStep";

const AddPurchaseRequisitionWizard = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isEdit = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(
  initialData || {
    prNumber: "",
    department: "",
    requiredDate: "",
    priority: "Medium",
    purpose: "",
    remarks: "",
  }
);

const [materialItems, setMaterialItems] = useState(
  initialData?.items || [
    {
      material: "",
      materialCode: "",
      materialName: "",
      unitOfMeasure: "",
      quantity: 1,
      estimatedCost: 0,
      remarks: "",
    },
  ]
);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // ==========================================
  // Auto Generate PR Number
  // ==========================================
  const generatePRNumber = () => {
    const number = Math.floor(1000 + Math.random() * 9000);

    setFormData((prev) => ({
      ...prev,
      prNumber: `PR${number}`,
    }));
  };

  // Generate PR Number when modal opens
 useEffect(() => {
  if (isOpen) {
    generatePRNumber();
  }
}, [isOpen]);

  // ==========================================
  // Step Validation
  // ==========================================
  const validateStep = () => {
    const validationErrors = {};

    if (currentStep === 1) {
      if (!formData.department) {
        validationErrors.department = "Department is required";
      }

      if (!formData.requiredDate) {
        validationErrors.requiredDate = "Required Date is required";
      }

      if (!formData.priority) {
        validationErrors.priority = "Priority is required";
      }

      if (!formData.purpose.trim()) {
        validationErrors.purpose = "Purpose is required";
      }
    }

    if (currentStep === 2) {
      if (!materialItems.length) {
        validationErrors.materials =
          "At least one material is required";
      }

      materialItems.forEach((item, index) => {
        if (!item.material) {
          validationErrors[`material_${index}`] =
            "Select a material";
        }

        if (!item.quantity || item.quantity <= 0) {
          validationErrors[`quantity_${index}`] =
            "Quantity must be greater than zero";
        }

        if (!item.estimatedCost || item.estimatedCost <= 0) {
          validationErrors[`cost_${index}`] =
            "Estimated Cost must be greater than zero";
        }
      });
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // ==========================================
  // Next Step
  // ==========================================
  const handleNext = () => {
    if (!validateStep()) return;

    nextStep();
  };

  // ==========================================
  // Save Draft
  // ==========================================
  const handleSaveDraft = async () => {
    try {
      const payload = {
        ...formData,
        items: materialItems,
        status: "Draft",
      };

      await onSave(payload);

      alert("Purchase Requisition Draft Saved Successfully.");

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Unable to save draft.");
    }
  };

  // ==========================================
  // Submit Purchase Requisition
  // ==========================================
  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setSaving(true);

      const payload = {
        ...formData,
        items: materialItems,
        status: "Submitted",
      };

      await onSave(payload);

      alert("Purchase Requisition Submitted Successfully.");

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Failed to submit Purchase Requisition.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetForm = () => {
  setCurrentStep(1);

  const number = Math.floor(1000 + Math.random() * 9000);

  setFormData({
    prNumber: `PR${number}`,
    department: "",
    requiredDate: "",
    priority: "Medium",
    purpose: "",
    remarks: "",
  });

  setMaterialItems([
     {
    material: "",
    materialCode: "",
    materialName: "",
    unitOfMeasure: "",
    quantity: 1,
    estimatedCost: 0,
    remarks: "",
  },
]);

  setErrors({});
};

const handleClose = () => {
  const hasChanges =
    formData.department ||
    formData.requiredDate ||
    formData.purpose ||
    materialItems.some((item) => item.material);

  if (hasChanges) {
    const confirmClose = window.confirm(
      "You have unsaved changes. Close anyway?"
    );

    if (!confirmClose) return;
  }

  resetForm();
  onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="flex h-[92vh] w-[95%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
  {isEdit
    ? "Edit Purchase Requisition"
    : "Create Purchase Requisition"}
</h2>

            <p className="mt-1 text-sm text-gray-500">
  {isEdit
    ? "Update the Purchase Requisition details."
    : "Create a new Purchase Requisition for procurement."}
</p>

          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Stepper */}

        <div className="border-b bg-gray-50 px-8 py-6">

          <div className="flex items-center justify-center">

            {[
              "Basic Information",
              "Material Items",
              "Review & Submit",
            ].map((step, index) => {

              const stepNumber = index + 1;

              return (

                <div
                  key={step}
                  className="flex items-center"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                        currentStep >= stepNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {stepNumber}
                    </div>

                    <span className="mt-2 text-sm font-medium">
                      {step}
                    </span>

                  </div>

                  {stepNumber !== 3 && (
                    <div
                      className={`mx-6 h-1 w-24 rounded ${
                        currentStep > stepNumber
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                </div>

              );

            })}

          </div>

        </div>

        <div className="h-2 w-full bg-gray-200">

          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width:
                currentStep === 1
                  ? "33%"
                  : currentStep === 2
                  ? "66%"
                  : "100%",
            }}
          />

        </div>

        <div className="bg-blue-50 py-2 text-center font-medium text-blue-700">

          Step {currentStep} of 3

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-8">

          <div className="mb-6 rounded-xl border bg-blue-50 p-5">

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              <div>

                <p className="text-xs text-gray-500">
                  Department
                </p>

                <p className="font-semibold">
                  {formData.department || "-"}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Priority
                </p>

                <p className="font-semibold">
                  {formData.priority}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Materials
                </p>

                <p className="font-semibold">
                  {materialItems.length}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Estimated Amount
                </p>

                <p className="font-semibold text-blue-700">
                  ₹{" "}
                  {materialItems
                    .reduce(
                      (sum, item) =>
                        sum +
                        (Number(item.quantity) ?? 0) *
                          (Number(item.estimatedCost) || 0),
                      0
                    )
                    .toLocaleString()}
                </p>

              </div>

            </div>

          </div>

          {currentStep === 1 && (
            <BasicInformationStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <MaterialItemsStep
              materialItems={materialItems}
              setMaterialItems={setMaterialItems}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              formData={formData}
              materialItems={materialItems}
            />
          )}

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t bg-gray-50 px-8 py-5">

          <button
            onClick={previousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-lg border px-5 py-3 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div className="flex gap-3">

            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"
            >
              <Save size={18} />
              Save Draft
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving || Object.keys(errors).length > 0}
                className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
              >
                {saving
                  ? "Submitting..."
                  : "Submit Purchase Requisition"}
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddPurchaseRequisitionWizard;
