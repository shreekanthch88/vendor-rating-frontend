import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Factory,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Truck,
  BarChart3,
  FileText,
  Handshake,
  AlertCircle,
} from "lucide-react";
import { useVendorAuth } from "../../context/VendorAuthContext";

const VendorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useVendorAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email.trim().toLowerCase(), password);

      const from = location.state?.from;
      if (from) {
        const destination = `${from.pathname || ""}${from.search || ""}${from.hash || ""}`;
        if (destination.startsWith("/vendor/")) {
          navigate(destination, { replace: true });
          return;
        }
      }

      navigate("/vendor/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      title: "Track Orders",
      subtitle: "View and manage your purchase orders and dispatches",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      title: "Monitor Performance",
      subtitle: "Check your ratings and performance metrics",
    },
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      title: "Manage Documents",
      subtitle: "Upload and maintain required documents",
    },
    {
      icon: <Handshake className="w-5 h-5 text-white" />,
      title: "Build Stronger Partnerships",
      subtitle: "Deliver quality and grow together",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0265dc] via-[#0152c0] to-[#003e9c] font-sans flex items-center justify-center">
      {/* Decorative Wavy Background Accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[550px] w-[550px] rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-900/30 blur-2xl" />

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row items-center justify-between px-6 py-8 sm:px-12 lg:px-16 xl:px-20 max-w-[1700px] mx-auto">
        
        {/* =========================================================
            LEFT PANEL: Branding & Feature Cards
           ========================================================= */}
        <div className="flex w-full flex-col justify-between pt-4 pb-8 lg:w-[54%] lg:py-8 lg:min-h-[85vh]">
          {/* Top Logo & Tagline */}
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-black/10 shrink-0">
                <Factory className="h-9 w-9 text-[#0265dc]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Vendor Rating
                </h1>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Mechanism
                </h1>
              </div>
            </div>

            {/* Tagline */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-blue-100/90">
              <span>Collaborate</span>
              <span className="text-blue-300/60">|</span>
              <span>Deliver</span>
              <span className="text-blue-300/60">|</span>
              <span>Improve</span>
              <span className="text-blue-300/60">|</span>
              <span>Grow</span>
            </div>
          </div>

          {/* Features List */}
          <div className="my-8 sm:my-10 space-y-5 sm:space-y-6 max-w-lg">
            {featureItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 border border-white/20 shadow-inner backdrop-blur-sm shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Truck & Warehouse Illustration */}
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 shadow-xl bg-blue-900/40 mt-auto">
            <img
              src="/images/vendor-truck.jpg"
              alt="Vendor Logistics & Warehouse"
              className="h-44 sm:h-52 w-full object-cover object-center filter brightness-95"
            />
            {/* Smooth gradient overlay to blend into the theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0265dc]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* =========================================================
            RIGHT PANEL: Floating Clean White Login Card
           ========================================================= */}
        <div className="flex w-full items-center justify-center py-6 lg:w-[44%] lg:justify-end">
          <div className="relative w-full max-w-[490px] rounded-[32px] bg-white p-8 sm:p-11 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80">
            
            {/* Centered Avatar Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#bfdbfe]/60 border border-[#93c5fd]/60 mb-6">
              <div className="relative flex items-center justify-center">
                {/* Silhouette user icon */}
                <svg
                  className="h-14 w-14 text-[#0265dc]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 12c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5z" />
                </svg>
                {/* Company badge badge on bottom-right */}
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#0265dc] text-white border-2 border-white shadow-sm">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a2558]">
                Vendor Login
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Access your vendor account to manage orders, view performance and more.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your email address"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0265dc] focus:ring-4 focus:ring-[#0265dc]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0265dc] focus:ring-4 focus:ring-[#0265dc]/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link (Right Aligned as in design) */}
              <div className="flex justify-end pt-0.5">
                <Link
                  to="/forgot-password?portal=vendor"
                  className="text-xs font-semibold text-[#0265dc] hover:text-blue-800 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0265dc] text-base font-bold text-white shadow-md shadow-blue-600/30 transition duration-150 hover:bg-[#0054bc] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
            </form>

            {/* Portal Switcher */}
            <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
              Are you an internal staff member?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0265dc] hover:underline"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorLogin;