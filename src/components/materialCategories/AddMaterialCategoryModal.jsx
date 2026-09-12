import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createCategory,
  getCategoryHierarchy,
} from "../../services/materialCategoryService";

const AddMaterialCategoryModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const initialForm = {
    categoryName: "",
    parentCategory: "",
    description: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadParentCategories();
    }
  }, [isOpen]);

  const loadParentCategories = async () => {
    try {
      const response = await getCategoryHierarchy();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryName.trim()) {
      toast.warning("Category Name is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        parentCategory:
          formData.parentCategory || null,
      };

      if (onSave) {
        await onSave(payload);
      } else {
        await createCategory(payload);
      }

      setFormData(initialForm);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold">
          Add Material Category
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Category Name */}
          <div>
            <label className="mb-2 block font-medium">
              Category Name
            </label>

            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Enter category name"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="mb-2 block font-medium">
              Parent Category
            </label>

            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                None (Root Category)
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.categoryCode} -{" "}
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
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
              placeholder="Enter description"
            />
          </div>

          {/* Status */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddMaterialCategoryModal;