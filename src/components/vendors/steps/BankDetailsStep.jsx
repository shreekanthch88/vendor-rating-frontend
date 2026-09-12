const BankDetailsStep = ({ formData, handleBankChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>
        <label className="block mb-2 font-medium">
          Bank Name
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankDetails.bankName}
          onChange={handleBankChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Account Holder
        </label>
        <input
          type="text"
          name="accountHolder"
          value={formData.bankDetails.accountHolder}
          onChange={handleBankChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Account Number
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.bankDetails.accountNumber}
          onChange={handleBankChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          IFSC Code
        </label>
        <input
          type="text"
          name="ifscCode"
          value={formData.bankDetails.ifscCode}
          onChange={handleBankChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Branch
        </label>
        <input
          type="text"
          name="branch"
          value={formData.bankDetails.branch}
          onChange={handleBankChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

    </div>
  );
};

export default BankDetailsStep;