const ReviewStep = ({ formData }) => {
  const Section = ({ title, children }) => (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 border-b pb-2">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );

  const Field = ({ label, value, span }) => (
    <div className={span ? "col-span-2" : ""}>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="block text-sm font-medium text-gray-800 mt-0.5">
        {value || <span className="text-gray-400 italic">—</span>}
      </span>
    </div>
  );

  const addr = formData.address || {};
  const bank = formData.bankDetails || {};

  const fullAddress = [
    addr.line1,
    addr.line2,
    addr.city,
    addr.district,
    addr.state,
    addr.country,
    addr.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">Review Vendor Details</h3>
      <p className="text-sm text-slate-500">
        Please verify all information before saving.
      </p>

      {/* Basic Info */}
      <Section title="Basic Information">
        <Field label="Vendor Name" value={formData.vendorName} />
        <Field label="Vendor Category" value={formData.vendorCategory} />
        <Field label="Business Type" value={formData.businessType} />
        <Field
          label="Status"
          value={
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
          }
        />
        {formData.description && (
          <Field label="Description" value={formData.description} span />
        )}
      </Section>

      {/* Compliance */}
      <Section title="Compliance">
        <Field label="GST Number (GSTIN)" value={formData.gstNumber} />
        <Field label="PAN Number" value={formData.panNumber} />
        <Field label="MSME / Udyam Number" value={formData.msmeNumber} />
        <Field label="CIN Number" value={formData.cinNumber} />
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <Field label="Contact Person" value={formData.contactPerson} />
        <Field label="Designation" value={formData.designation} />
        <Field label="Email" value={formData.email} />
        <Field label="Mobile" value={formData.mobile} />
        <Field label="Alternate Mobile" value={formData.alternateMobile} />
        <Field label="Website" value={formData.website} />
      </Section>

      {/* Address */}
      <Section title="Address">
        <Field label="Full Address" value={fullAddress || undefined} span />
      </Section>

      {/* Bank Details */}
      <Section title="Bank Details">
        <Field label="Bank Name" value={bank.bankName} />
        <Field label="Account Holder" value={bank.accountHolder} />
        <Field label="Account Number" value={bank.accountNumber} />
        <Field label="IFSC Code" value={bank.ifscCode} />
        <Field label="Branch" value={bank.branch} />
      </Section>

      {/* Purchase Configuration */}
      <Section title="Purchase Configuration">
        <Field label="Payment Terms" value={formData.paymentTerms} />
        <Field label="Credit Days" value={formData.creditDays?.toString()} />
        <Field label="Lead Time (days)" value={formData.leadTime?.toString()} />
        <Field label="Currency" value={formData.currency} />
        <Field
          label="Preferred Vendor"
          value={formData.preferredVendor ? "Yes ✓" : "No"}
        />
      </Section>
    </div>
  );
};

export default ReviewStep;