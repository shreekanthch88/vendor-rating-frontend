import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const VENDOR_CATEGORIES = [
  "Raw Material",
  "Packaging",
  "Service",
  "Contractor",
  "Transport",
  "Office Supplies",
  "Other",
];

const BasicInfoStep = ({ formData, handleChange, errors = {} }) => {
  const { user } = useContext(AuthContext);
  const isAdminOrSuperAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  return (
    <div className="space-y-5">

      {/* Vendor Name */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Vendor Name <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="vendorName"
          value={formData.vendorName || ""}
          onChange={handleChange}
          placeholder="Enter vendor / company name"
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${
            errors.vendorName
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />

        {errors.vendorName && (
          <p className="mt-1 text-xs text-red-600">{errors.vendorName}</p>
        )}
      </div>

      {/* Vendor Category — controlled dropdown matching the DB enum */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Vendor Category
        </label>

        <select
          name="vendorCategory"
          value={formData.vendorCategory || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">— Select Category —</option>
          {VENDOR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Business Type */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Business Type
        </label>

        <select
          name="businessType"
          value={formData.businessType || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">— Select Business Type —</option>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Distributor">Distributor</option>
          <option value="Wholesaler">Wholesaler</option>
          <option value="Retailer">Retailer</option>
          <option value="Service Provider">Service Provider</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={2}
          placeholder="Brief description of the vendor (optional)"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        />
      </div>

      {/* Vendor Status */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Vendor Status
        </label>

        {isAdminOrSuperAdmin ? (
          <div>
            <select
              name="status"
              value={formData.status || "Pending"}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 bg-white font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="Pending">Pending (Under Review)</option>
              <option value="Active">Active (Approved)</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>

            <p className="mt-1 text-xs text-slate-500">
              Set to <strong>Active</strong> to approve this vendor for purchase orders and dispatches.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                formData.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : formData.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {formData.status || "Pending"}
            </span>

            <span className="text-xs text-gray-400">
              (Only Admin and Super Admin can change status)
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default BasicInfoStep;