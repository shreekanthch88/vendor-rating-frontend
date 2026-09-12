const AddressStep = ({ formData, handleAddressChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Address Line 1
        </label>
        <input
          type="text"
          name="line1"
          value={formData.address.line1}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Address Line 2
        </label>
        <input
          type="text"
          name="line2"
          value={formData.address.line2}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.address.city}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          District
        </label>
        <input
          type="text"
          name="district"
          value={formData.address.district}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          State
        </label>
        <input
          type="text"
          name="state"
          value={formData.address.state}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={formData.address.country}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Pincode
        </label>
        <input
          type="text"
          name="pincode"
          value={formData.address.pincode}
          onChange={handleAddressChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

    </div>
  );
};

export default AddressStep;