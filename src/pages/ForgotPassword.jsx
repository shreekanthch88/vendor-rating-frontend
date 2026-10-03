import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { requestPasswordReset } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isVendor = searchParams.get("portal") === "vendor";
  const loginUrl = isVendor ? "/vendor/login" : "/login";
  const loginLabel = isVendor ? "Back to Vendor Login" : "Back to Login";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await requestPasswordReset(
        email.trim().toLowerCase(),
        isVendor ? "vendor" : "staff"
      );

      setSuccessMessage(
        response.message || "OTP has been successfully sent to your email!"
      );

      // Automatically navigate to reset-password after a brief moment preserving portal
      setTimeout(() => {
        const portalParam = isVendor ? "portal=vendor&" : "";
        navigate(`/reset-password?${portalParam}email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset OTP. Please verify your email."
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-sm border border-blue-100">
            {isVendor ? <Building2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isVendor ? "Vendor Portal" : "Forgot Password"}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {isVendor
              ? "Enter your registered vendor email to receive a 6-digit OTP to reset your password."
              : "Enter your registered email and we'll send you a 6-digit OTP to reset your password."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-bold">{successMessage}</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">Redirecting to OTP verification...</p>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Registered Email Address
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
                autoFocus
                disabled={loading || !!successMessage}
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Secondary Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 text-xs">
          <Link
            to={loginUrl}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{loginLabel}</span>
          </Link>

          <Link
            to={`/reset-password?${isVendor ? "portal=vendor&" : ""}${email ? `email=${encodeURIComponent(email)}` : ""}`}
            className="text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Already have an OTP? Enter code to reset
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
