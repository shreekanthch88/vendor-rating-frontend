import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Star,
  TrendingUp,
  Truck,
  Award,
  Loader2,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedEmail")
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  // =====================================================
  // ROLE BASED REDIRECT
  // =====================================================

  const redirectUserByRole = (user) => {
    console.log(
      "======================================"
    );

    console.log(
      "ROLE BASED REDIRECT"
    );

    console.log(
      "User:",
      user
    );

    console.log(
      "Role:",
      user?.role
    );

    console.log(
      "======================================"
    );

    // ---------------------------------------------------
    // QUALITY MANAGER
    // ---------------------------------------------------

    if (user?.role === "QUALITY_MANAGER") {
      console.log(
        "QUALITY_MANAGER detected"
      );

      console.log(
        "Redirecting to Quality Inspection..."
      );

      navigate(
        "/quality-inspection/inspections",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // VENDOR
    // ---------------------------------------------------

    if (user?.role === "VENDOR") {
      console.log(
        "VENDOR detected"
      );

      console.log(
        "Redirecting to Vendor Dashboard..."
      );

      navigate(
        "/vendor/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // SUPER ADMIN
    // ---------------------------------------------------

    if (user?.role === "SUPER_ADMIN") {
      console.log(
        "SUPER_ADMIN detected"
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // ADMIN
    // ---------------------------------------------------

    if (user?.role === "ADMIN") {
      console.log(
        "ADMIN detected"
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // PURCHASE MANAGER
    // ---------------------------------------------------

    if (user?.role === "PURCHASE_MANAGER") {
      console.log(
        "PURCHASE_MANAGER detected"
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // FINANCE MANAGER
    // ---------------------------------------------------

    if (user?.role === "FINANCE_MANAGER") {
      console.log(
        "FINANCE_MANAGER detected"
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // UNKNOWN ROLE
    // ---------------------------------------------------

    console.warn(
      "Unknown role:",
      user?.role
    );

    navigate(
      "/dashboard",
      {
        replace: true,
      }
    );
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // CALL LOGIN API
      // =================================================

      const data = await loginUser(
        formData
      );

      console.log(
        "======================================"
      );

      console.log(
        "LOGIN RESPONSE"
      );

      console.log(
        data
      );

      console.log(
        "USER FROM RESPONSE:",
        data?.user
      );

      console.log(
        "ROLE FROM RESPONSE:",
        data?.user?.role
      );

      console.log(
        "======================================"
      );

      // =================================================
      // VALIDATE RESPONSE
      // =================================================

      if (
        !data ||
        !data.user ||
        !data.token
      ) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      // =================================================
      // SAVE USER AND TOKEN
      // =================================================

      login(
        data.user,
        data.token
      );

      console.log(
        "User saved successfully."
      );

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // =================================================
      // ROLE BASED REDIRECT
      // =================================================

      redirectUserByRole(
        data.user
      );

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Invalid Email or Password"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen w-full bg-[#030919] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-[1240px] min-h-[720px] bg-[#081229] border border-blue-900/30 rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* =========================================================================
            LEFT PANEL: Branding & Visual Showcase Dashboard
           ========================================================================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative bg-gradient-to-br from-[#061026] via-[#081738] to-[#040c1d]">
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.45)] border border-blue-400/30">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Vendor Rating
              </h2>
              <p className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 uppercase">
                System
              </p>
            </div>
          </div>

          {/* Center Heading & Tagline */}
          <div className="relative z-10 my-8">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.2] tracking-tight">
              Building Better Partnerships <br />
              Through{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                Performance
              </span>
            </h1>

            <div className="w-12 h-1 bg-blue-500 rounded-full mt-4 mb-4 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
              Evaluate. Analyze. Improve. <br />
              <span className="text-slate-400 text-xs sm:text-sm font-normal">
                Make data-driven decisions with our comprehensive vendor rating system.
              </span>
            </p>
          </div>

          {/* Interactive Graphic: Floating Tablet Preview */}
          <div className="relative z-10 w-full max-w-lg mx-auto lg:mx-0">
            {/* Ambient glow behind device */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/25 via-cyan-500/20 to-indigo-500/25 rounded-3xl blur-xl" />

            <div className="relative bg-[#0b162f]/90 border border-blue-500/30 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              {/* Tablet Top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Overall Rating</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
              </div>

              {/* Gauge and Trend Section */}
              <div className="grid grid-cols-12 gap-3 mt-3.5 items-center">
                {/* Score Circular Gauge */}
                <div className="col-span-5 flex flex-col items-center justify-center bg-[#0d1c3e]/70 border border-blue-800/30 rounded-xl p-3.5">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-400"
                        strokeDasharray="92, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-black text-white tracking-tight">4.6</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1.5 text-amber-400 text-[10px]">
                    {"★".repeat(5)}
                  </div>
                </div>

                {/* Performance Trend Chart */}
                <div className="col-span-7 bg-[#0d1c3e]/70 border border-blue-800/30 rounded-xl p-3.5 flex flex-col justify-between h-full min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">Performance Trend</span>
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  {/* Wave SVG Graph */}
                  <div className="w-full h-12 mt-1">
                    <svg className="w-full h-full" viewBox="0 0 160 50" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,35 Q20,40 40,25 T80,30 T120,15 T160,10 L160,50 L0,50 Z"
                        fill="url(#trendGrad)"
                      />
                      <path
                        d="M0,35 Q20,40 40,25 T80,30 T120,15 T160,10"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="40" cy="25" r="2.5" fill="#ffffff" />
                      <circle cx="80" cy="30" r="2.5" fill="#ffffff" />
                      <circle cx="120" cy="15" r="2.5" fill="#ffffff" />
                      <circle cx="160" cy="10" r="2.5" fill="#ffffff" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="bg-[#0e1e42]/80 border border-blue-800/25 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center text-blue-400 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] text-slate-400">Quality</div>
                  <div className="text-xs font-bold text-white mt-0.5">4.7</div>
                  <div className="text-[8px] font-semibold text-emerald-400">↑ 8.5%</div>
                </div>

                <div className="bg-[#0e1e42]/80 border border-blue-800/25 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center text-emerald-400 mb-1">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] text-slate-400">Delivery</div>
                  <div className="text-xs font-bold text-white mt-0.5">4.5</div>
                  <div className="text-[8px] font-semibold text-emerald-400">↑ 6.2%</div>
                </div>

                <div className="bg-[#0e1e42]/80 border border-blue-800/25 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center text-amber-400 mb-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] text-slate-400">Service</div>
                  <div className="text-xs font-bold text-white mt-0.5">4.6</div>
                  <div className="text-[8px] font-semibold text-emerald-400">↑ 7.1%</div>
                </div>

                <div className="bg-[#0e1e42]/80 border border-blue-800/25 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center text-indigo-400 mb-1">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] text-slate-400">Compliance</div>
                  <div className="text-xs font-bold text-white mt-0.5">4.8</div>
                  <div className="text-[8px] font-semibold text-emerald-400">↑ 9.3%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: Sleek White Login Form Card
           ========================================================================= */}
        <div className="lg:col-span-5 bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between rounded-t-[32px] lg:rounded-t-none lg:rounded-l-[44px] shadow-[-15px_0_35px_rgba(0,0,0,0.15)] relative">
          <div className="w-full max-w-md mx-auto my-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome Back! <span className="animate-bounce inline-block">👋</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1.5">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full h-12 pl-11 pr-4 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full h-12 pl-11 pr-11 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember Me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Please contact your system administrator to reset your password.");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* OAuth Mock buttons (Google & Microsoft) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  alert("SSO integration is available for enterprise domain users. Please use Email & Password.")
                }
                className="h-11 border border-slate-200 hover:bg-slate-50/80 rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700 transition active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("SSO integration is available for enterprise domain users. Please use Email & Password.")
                }
                className="h-11 border border-slate-200 hover:bg-slate-50/80 rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700 transition active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 pt-4 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Your data is safe and secured with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;