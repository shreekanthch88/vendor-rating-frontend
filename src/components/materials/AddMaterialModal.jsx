import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { createMaterial } from "../../services/materialService";
import { getAllCategories } from "../../services/materialCategoryService";
import { getAllVendors } from "../../services/vendorService";

const AddMaterialModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    materialName: "",
    category: "",
    description: "",
    unitOfMeasure: "Nos",
    standardCost: "",
    preferredVendor: "",
    status: "Active",
  });

  useEffect(() => {
    if (isOpen) {
      loadDropdowns();
    }
  }, [isOpen]);

  const loadDropdowns = async () => {
    try {
      const [categoryRes, vendorRes] = await Promise.all([
        getAllCategories(1, 1000, "", "Active"),
        getAllVendors(1, 1000, "", "Active"),
      ]);

      setCategories(categoryRes.categories || []);
      setVendors(vendorRes.vendors || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.materialName.trim()) {
      return toast.warning("Material Name is required.");
    }

    if (!formData.category) {
      return toast.warning("Category is required.");
    }

    if (!formData.standardCost) {
      return toast.warning("Standard Cost is required.");
    }

    try {
      setLoading(true);

      await createMaterial({
        ...formData,
        standardCost: Number(formData.standardCost),
        preferredVendor:
          formData.preferredVendor || null,
      });

      toast.success("Material created successfully.");

      setFormData({
        materialName: "",
        category: "",
        description: "",
        unitOfMeasure: "Nos",
        standardCost: "",
        preferredVendor: "",
        status: "Active",
      });

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create material."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">
            Add Material
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="mb-2 block font-medium">
                Material Name
              </label>

              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.categoryCode} - {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Unit of Measure
              </label>

              <select
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option>Nos</option>
                <option>Kg</option>
                <option>Gram</option>
                <option>Liter</option>
                <option>Meter</option>
                <option>Feet</option>
                <option>Box</option>
                <option>Packet</option>
                <option>Piece</option>
                <option>Roll</option>
                <option>Set</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Standard Cost
              </label>

              <input
                type="number"
                name="standardCost"
                value={formData.standardCost}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Preferred Vendor
              </label>

              <select
                name="preferredVendor"
                value={formData.preferredVendor}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">
                  Select Vendor
                </option>

                {vendors.map((vendor) => (
                  <option
                    key={vendor._id}
                    value={vendor._id}
                  >
                    {vendor.vendorCode} - {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Material"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddMaterialModal;