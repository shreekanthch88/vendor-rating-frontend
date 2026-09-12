import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const BasicInfoStep = ({ formData, handleChange }) => {
  const { user } = useContext(AuthContext);
  const isAdminOrSuperAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  return (
    <div className="space-y-5">

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Vendor Name
        </label>

        <input
          type="text"
          name="vendorName"
          value={formData.vendorName || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Vendor Category
        </label>

        <input
          type="text"
          name="vendorCategory"
          value={formData.vendorCategory || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Business Type
        </label>

        <select
          name="businessType"
          value={formData.businessType || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select</option>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Distributor">Distributor</option>
          <option value="Wholesaler">Wholesaler</option>
          <option value="Service Provider">Service Provider</option>
        </select>
      </div>

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
              className="w-full rounded-lg border p-3 bg-white font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="Pending">Pending (Under Review)</option>
              <option value="Active">Active (Approved)</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>

            <p className="mt-1 text-xs text-slate-500">
              Change status to Active to approve this vendor for purchase orders and dispatches.
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