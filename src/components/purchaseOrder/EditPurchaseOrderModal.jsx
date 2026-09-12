import { useState } from "react";
import { Save, X } from "lucide-react";

import { updatePurchaseOrder } from "../../services/purchaseOrderService";

const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

const getReferenceId = (reference) =>
  typeof reference === "object" ? reference?._id : reference;

const createFormData = (purchaseOrder) => ({
  purchaseRequisition: getReferenceId(purchaseOrder.purchaseRequisition),
  vendor: getReferenceId(purchaseOrder.vendor),
  expectedDeliveryDate: toDateInputValue(purchaseOrder.expectedDeliveryDate),
  paymentTerms: purchaseOrder.paymentTerms || "Net 30",
  deliveryLocation: purchaseOrder.deliveryLocation || "",
  currency: purchaseOrder.currency || "INR",
  priority: purchaseOrder.priority || "Medium",
  buyerRemarks: purchaseOrder.buyerRemarks || "",
  freightCharges: purchaseOrder.freightCharges ?? 0,
  items: (purchaseOrder.items || []).map((item) => ({
    ...item,
    material: getReferenceId(item.material),
  })),
});

const EditPurchaseOrderForm = ({
  purchaseOrder,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(() => createFormData(purchaseOrder));
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (purchaseOrder.status !== "Draft") {
      alert("Only Draft Purchase Orders can be edited.");
      return;
    }

    try {
      setLoading(true);

      await updatePurchaseOrder(purchaseOrder._id, {
        ...formData,
        freightCharges: Number(formData.freightCharges),
      });

      alert("Purchase Order updated successfully.");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to update Purchase Order."
      );
    } finally {
      setLoading(false);
    }
  };

  const isDraft = purchaseOrder.status === "Draft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">Edit Purchase Order</h2>
            <p className="text-sm text-slate-500">{purchaseOrder.poNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 transition hover:bg-slate-100"
            aria-label="Close edit purchase order"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {!isDraft && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              Only Draft Purchase Orders can be edited.
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Expected delivery date
              <input
                required
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                disabled={!isDraft || loading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Payment terms
              <select
                required
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                disabled={!isDraft || loading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              >
                {["Advance", "Cash On Delivery", "Net 15", "Net 30", "Net 45", "Net 60"].map((term) => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Priority
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={!isDraft || loading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              >
                {["Low", "Medium", "High", "Critical"].map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Freight charges
              <input
                min="0"
                step="0.01"
                type="number"
                name="freightCharges"
                value={formData.freightCharges}
                onChange={handleChange}
                disabled={!isDraft || loading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Delivery location
            <input
              required
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
              disabled={!isDraft || loading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Buyer remarks
            <textarea
              name="buyerRemarks"
              rows="3"
              value={formData.buyerRemarks}
              onChange={handleChange}
              disabled={!isDraft || loading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
            />
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Order items ({formData.items.length})</p>
            <p className="mt-1">Material line items remain unchanged in this edit dialog.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDraft || loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

const EditPurchaseOrderModal = ({
  isOpen,
  purchaseOrder,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !purchaseOrder) return null;

  return (
    <EditPurchaseOrderForm
      key={purchaseOrder._id}
      purchaseOrder={purchaseOrder}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default EditPurchaseOrderModal;
