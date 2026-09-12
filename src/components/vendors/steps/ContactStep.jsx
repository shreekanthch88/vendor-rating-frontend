const ContactStep = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>
        <label className="block mb-2 font-medium">
          Contact Person
        </label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Mobile
        </label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Alternate Mobile
        </label>
        <input
          type="text"
          name="alternateMobile"
          value={formData.alternateMobile}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

    </div>
  );
};

export default ContactStep;