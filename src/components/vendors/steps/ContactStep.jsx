const ContactStep = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* Contact Person */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Contact Person <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          placeholder="Primary contact name"
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${
            errors.contactPerson
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.contactPerson && (
          <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>
        )}
      </div>

      {/* Designation */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Designation
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation || ""}
          onChange={handleChange}
          placeholder="e.g. Purchase Manager"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="vendor@example.com"
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Mobile <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          maxLength={10}
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${
            errors.mobile
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.mobile && (
          <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
        )}
      </div>

      {/* Alternate Mobile */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Alternate Mobile
        </label>
        <input
          type="text"
          name="alternateMobile"
          value={formData.alternateMobile || ""}
          onChange={handleChange}
          placeholder="Optional alternate number"
          maxLength={10}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Website
        </label>
        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          placeholder="https://www.example.com"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

    </div>
  );
};

export default ContactStep;