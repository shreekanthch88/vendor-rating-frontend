/**
 * AddVendorWizard
 *
 * Thin wrapper around the shared VendorFormWizard that wires up
 * the "Add Vendor" flow (blank form + "Save Vendor" submit text).
 */
import VendorFormWizard from "./VendorFormWizard";

const AddVendorWizard = ({ isOpen, onClose, onSave }) => {
  return (
    <VendorFormWizard
      isOpen={isOpen}
      onClose={onClose}
      initialData={null}
      title="Add Vendor"
      submitText="Save Vendor"
      onSubmit={onSave}
      isEdit={false}
    />
  );
};

export default AddVendorWizard;