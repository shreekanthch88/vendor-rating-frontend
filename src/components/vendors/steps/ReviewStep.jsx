const ReviewStep = ({ formData }) => {
  return (
    <div className="space-y-6">

      <h3 className="text-xl font-bold">
        Review Vendor Details
      </h3>

      <div className="grid grid-cols-2 gap-5">

        <div><strong>Vendor Name:</strong> {formData.vendorName}</div>
        <div><strong>Category:</strong> {formData.vendorCategory}</div>
        <div><strong>Business Type:</strong> {formData.businessType}</div>
        <div>
          <strong>Status:</strong>{" "}
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              formData.status === "Active"
                ? "bg-green-100 text-green-700"
                : formData.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {formData.status || "Pending"}
          </span>
        </div>

        <div><strong>GST:</strong> {formData.gstNumber}</div>
        <div><strong>PAN:</strong> {formData.panNumber}</div>

        <div><strong>Contact:</strong> {formData.contactPerson}</div>
        <div><strong>Email:</strong> {formData.email}</div>

        <div><strong>Mobile:</strong> {formData.mobile}</div>

        <div className="col-span-2">
          <strong>Address:</strong><br />

          {formData.address.line1}<br />
          {formData.address.line2}<br />
          {formData.address.city},
          {formData.address.district},
          {formData.address.state}<br />
          {formData.address.country} - {formData.address.pincode}
        </div>

        <div><strong>Bank:</strong> {formData.bankDetails.bankName}</div>

        <div><strong>Account:</strong> {formData.bankDetails.accountNumber}</div>

        <div><strong>IFSC:</strong> {formData.bankDetails.ifscCode}</div>

      </div>

    </div>
  );
};

export default ReviewStep;