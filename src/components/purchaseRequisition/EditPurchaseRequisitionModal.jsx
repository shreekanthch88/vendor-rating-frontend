import AddPurchaseRequisitionWizard from "./AddPurchaseRequisitionWizard";

const EditPurchaseRequisitionModal = ({
  isOpen,
  onClose,
  requisition,
  onUpdate,
}) => {
  if (!isOpen || !requisition) return null;

  return (
    <AddPurchaseRequisitionWizard
      isOpen={isOpen}
      onClose={onClose}
      initialData={requisition}
      isEdit={true}
      onSave={onUpdate}
    />
  );
};

export default EditPurchaseRequisitionModal;