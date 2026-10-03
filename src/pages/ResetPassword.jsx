import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { resetPassword, requestPasswordReset } from "../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isVendor = searchParams.get("portal") === "vendor";
  const loginUrl = isVendor ? "/vendor/login" : "/login";
  const loginLabel = isVendor ? "Back to Vendor Login" : "Back to Login";

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");

  // Start 60s cooldown if email is provided via query params
  useEffect(() => {
    if (searchParams.get("email")) {
      setCountdown(60);
    }
  }, [searchParams]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    if (!email) {
      setErrorMessage("Please enter your email to resend OTP.");
      return;
    }
    if (countdown > 0) return;

    try {
      setResendLoading(true);
      setErrorMessage("");
      setResendSuccess("");

      const response = await requestPasswordReset(
        email.trim().toLowerCase(),
        isVendor ? "vendor" : "staff"
      );
      setResendSuccess(response.message || "A new OTP has been sent to your email!");
      setCountdown(60);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP sent to your email.");
      return;
    }

    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter to confirm.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
        portal: isVendor ? "vendor" : "staff",
      });

      setSuccessMessage(
        response.message ||
          `Password updated successfully! Redirecting to ${isVendor ? "Vendor Login" : "login"}...`
      );

      // Redirect directly to the appropriate portal (Vendor Login or Staff Login)
      setTimeout(() => {
        navigate(loginUrl, { replace: true });
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password. Please verify the OTP code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Glow Decorative Shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 border border-slate-100">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-sm border border-blue-100">
            {isVendor ? <Building2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isVendor ? "Vendor Portal" : "Reset Password"}
          </h2>
          <p className="text-slate-500 text-sm mt-1.5">
            {isVendor
              ? "Enter the 6-digit OTP sent to your vendor email and set a new password."
              : "Enter the 6-digit OTP and choose a new password."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Resend Success Notification */}
        {resendSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-600" />
            <span>{resendSuccess}</span>
          </div>
        )}

        {/* Overall Success Notification */}
        {successMessage && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-bold">{successMessage}</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Redirecting to {isVendor ? "Vendor Login" : "login"} page...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="name@company.com"
                required
                disabled={loading || !!successMessage}
                className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
              />
            </div>
          </div>

          {/* OTP Code with Resend Option */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                6-Digit OTP Code
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || resendLoading || loading || !!successMessage}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 transition flex items-center gap-1"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <>
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="123456"
                maxLength={6}
                required
                disabled={loading || !!successMessage}
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-base tracking-[6px] font-mono font-bold text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="At least 6 characters"
                required
                disabled={loading || !!successMessage}
                className="w-full h-11 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Re-enter password"
                required
                disabled={loading || !!successMessage}
                className="w-full h-11 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-7 pt-5 border-t border-slate-100 text-center">
          <Link
            to={loginUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{loginLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
