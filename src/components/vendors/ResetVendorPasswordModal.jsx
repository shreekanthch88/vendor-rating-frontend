import { useState } from "react";
import { X, KeyRound, Eye, EyeOff } from "lucide-react";
import { resetVendorPassword } from "../../services/vendorUserService";

const ResetVendorPasswordModal = ({
  isOpen,
  onClose,
  vendor,
  user,
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !user || !vendor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetVendorPassword(vendor._id, user._id, password);
      alert("Password reset successfully.");
      setPassword("");
      setConfirmPassword("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5 bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-600 p-2.5 text-white">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Reset Password
              </h2>
              <p className="text-xs text-gray-500">{user.name} ({user.email})</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetVendorPasswordModal;

