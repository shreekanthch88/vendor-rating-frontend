import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  updateCategory,
  getCategoryHierarchy,
} from "../../services/materialCategoryService";

const EditMaterialCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategory: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        categoryName: category.categoryName || "",
        parentCategory: category.parentCategory?._id || "",
        description: category.description || "",
        status: category.status || "Active",
      });

      loadParentCategories();
    }
  }, [isOpen, category]);

  const loadParentCategories = async () => {
    try {
      const response = await getCategoryHierarchy();
      setCategories(response.data || []);
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

    if (!formData.categoryName.trim()) {
      toast.warning("Category Name is required.");
      return;
    }

    try {
      setLoading(true);

      await updateCategory(category._id, {
        ...formData,
        parentCategory:
          formData.parentCategory || null,
      });

      toast.success("Category updated successfully.");

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update category."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">
            Edit Material Category
          </h2>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
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
            />
          </div>

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

              {categories
                .filter((item) => item._id !== category._id)
                .map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.categoryCode} - {item.categoryName}
                  </option>
                ))}
            </select>
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
              {loading ? "Updating..." : "Update"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditMaterialCategoryModal;