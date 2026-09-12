import { updateVendor } from "../../services/vendorService";
import VendorFormWizard from "./VendorFormWizard";

const EditVendorModal = ({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}) => {
  if (!vendor) return null;

  const handleUpdate = async (formData) => {
    try {
      await updateVendor(vendor._id, formData);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Update Vendor Error:", error);
      const errorData = error.response?.data;
      let displayMessage = errorData?.message;

      if (!displayMessage && Array.isArray(errorData?.errors)) {
        displayMessage = errorData.errors
          .map((err) => `${err.path || err.param || "Field"}: ${err.msg}`)
          .join("\n");
      }

      alert(displayMessage || "Failed to update vendor.");
    }
  };

  return (
    <VendorFormWizard
      isOpen={isOpen}
      onClose={onClose}
      initialData={vendor}
      title="Edit Vendor"
      submitText="Update Vendor"
      onSubmit={handleUpdate}
    />
  );
};

export default EditVendorModal;