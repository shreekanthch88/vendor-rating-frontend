import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import {
  createVendorUser,
} from "../../services/vendorUserService";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  designation: "",
  isPrimaryContact: false,
};

const AddVendorUserModal = ({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}) => {
  const [formData, setFormData] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  if (!isOpen) return null;

  /* ============================
      Input Change
  ============================ */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ============================
      Validation
  ============================ */

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Full Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required.";
    }

    if (
      formData.password &&
      formData.password.length < 6
    ) {
      newErrors.password =
        "Minimum 6 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

    /* ============================
      Save User
  ============================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await createVendorUser(
        vendor._id,
        formData
      );

      setFormData(initialState);

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create Vendor User."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================
      Close Modal
  ============================ */

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* ================= Header ================= */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-blue-100 p-3">

              <UserPlus
                size={24}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                Add Vendor User

              </h2>

              <p className="text-sm text-gray-500">

                Create a login account for this vendor.

              </p>

            </div>

          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* ================= Form ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

                      {/* Full Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name
                  ? "border-red-500"
                  : ""
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}

          </div>

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-500"
                  : ""
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password *
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={`w-full rounded-lg border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}

          </div>

          {/* Phone & Designation */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Designation
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter Designation"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Primary Contact */}

          <div className="rounded-lg border bg-gray-50 p-4">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="isPrimaryContact"
                checked={
                  formData.isPrimaryContact
                }
                onChange={handleChange}
                className="h-5 w-5"
              />

              <span className="font-medium text-gray-700">
                Set as Primary Contact
              </span>

            </label>

            <p className="mt-2 text-sm text-gray-500">
              Primary contacts are the main communication
              point for purchase orders, invoices and
              notifications.
            </p>

          </div>

                    {/* Footer */}

          <div className="flex items-center justify-between border-t pt-6">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border px-6 py-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddVendorUserModal;