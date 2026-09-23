/**
 * AddVendorWizard
 *
 * Thin wrapper around the shared VendorFormWizard that wires up
 * the "Add Vendor" flow (blank form + "Save Vendor" submit text).
 *
 * Previously this file duplicated the entire wizard; that logic now
 * lives in VendorFormWizard.jsx.
 */
import VendorFormWizard, {
  initialVendorFormData,
} from "./VendorFormWizard";

const AddVendorWizard = ({ isOpen, onClose, onSave }) => {
  return (
    <VendorFormWizard
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialVendorFormData}
      title="Add Vendor"
      submitText="Save Vendor"
      onSubmit={onSave}
    />
  );
};

export default AddVendorWizard;