import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { updateVendorUser } from "../../services/vendorUserService";

const EditVendorUserModal = ({
  isOpen,
  onClose,
  vendor,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    designation: "",
    isPrimaryContact: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        designation: user.designation || "",
        isPrimaryContact: Boolean(user.isPrimaryContact),
      });
    }
  }, [user]);

  if (!isOpen || !user || !vendor) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await updateVendorUser(vendor._id, user._id, formData);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Update Vendor User Error:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to update Vendor User."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2.5 text-yellow-700">
              <Pencil size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Edit Vendor User
              </h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email (Cannot be changed)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile number"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPrimaryContact"
                checked={formData.isPrimaryContact}
                onChange={handleChange}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Set as Primary Contact
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendorUserModal;

