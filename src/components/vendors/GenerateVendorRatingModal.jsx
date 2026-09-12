import { useState } from "react";
import { X, Calendar, Sparkles } from "lucide-react";
import { generateVendorRating } from "../../services/vendorRatingService";

const GenerateVendorRatingModal = ({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}) => {
  // Default to past 90 days
  const defaultToDate = new Date().toISOString().split("T")[0];
  const past90 = new Date();
  past90.setDate(past90.getDate() - 90);
  const defaultFromDate = past90.toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !vendor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fromDate || !toDate) {
      setError("Please select both from and to dates.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("From date cannot be after to date.");
      return;
    }

    try {
      setLoading(true);
      const res = await generateVendorRating({
        vendorId: vendor._id,
        fromDate,
        toDate,
      });

      if (onSuccess) {
        onSuccess(res.data);
      }
      onClose();
    } catch (err) {
      console.error("Generate rating error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to generate vendor rating."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Generate Rating Evaluation
              </h2>
              <p className="text-xs text-gray-500">
                Vendor: <span className="font-semibold text-blue-600">{vendor.vendorName}</span> ({vendor.vendorCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-4 text-xs text-blue-800 leading-relaxed">
            The system will analyze all transactions (Purchase Orders, Dispatches, Goods Receipts, Quality Inspections, and Re-inspections) for this vendor within the selected period to calculate automated parameter scores.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar size={15} className="text-gray-400" />
                From Date *
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar size={15} className="text-gray-400" />
                To Date *
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md hover:shadow disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Rating
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateVendorRatingModal;

