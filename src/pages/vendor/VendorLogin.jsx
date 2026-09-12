import { useState } from "react";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useVendorAuth } from "../../context/VendorAuthContext";

const VendorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useVendorAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      /**
       * ============================================
       * Return to Original Requested Page
       * ============================================
       *
       * Example:
       *
       * /vendor/purchase-orders/123
       *
       * If the Vendor came directly to the login page,
       * fall back to the Vendor Dashboard.
       */
      const from =
        location.state?.from;

      if (from) {
        const destination =
          `${from.pathname || ""}${from.search || ""}${from.hash || ""}`;

        if (
          destination.startsWith(
            "/vendor/"
          )
        ) {
          navigate(
            destination,
            { replace: true }
          );
          return;
        }
      }

      navigate(
        "/vendor/dashboard",
        { replace: true }
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* Main Container */}

      <div className="mx-auto flex min-h-screen max-w-[1700px]">

        {/* =======================================================
            LEFT PANEL
        ======================================================= */}

        <div className="relative hidden w-[58%] overflow-hidden bg-gradient-to-br from-[#1e63d5] via-[#0f56c7] to-[#0d4db5] lg:flex">

          {/* Background Pattern */}

          <div className="absolute inset-0 opacity-10">

            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

          </div>

          {/* Decorative Circles */}

          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl" />

          {/* Content */}

          <div className="relative flex w-full flex-col justify-between p-16">

            {/* Logo */}

            <div>

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">

                  <Building2
                    size={34}
                    className="text-blue-700"
                  />

                </div>

                <div>

                  <h1 className="text-4xl font-bold text-white">
                    VRM
                  </h1>

                  <p className="text-lg text-blue-100">
                    Vendor Portal
                  </p>

                </div>

              </div>

            </div>

            {/* Hero Text */}

            <div className="max-w-xl">

              <h2 className="text-5xl font-bold leading-tight text-white">

                Welcome to

                <br />

                Vendor Portal

              </h2>

              <p className="mt-8 text-lg leading-8 text-blue-100">

                Streamline your procurement process with our
                secure vendor collaboration platform.

                <br />
                <br />

                Manage purchase orders, dispatches,
                invoices, payments and performance
                from one centralized portal.

              </p>

            </div>

            {/* Illustration Placeholder */}

            <div className="relative mt-10 flex flex-1 items-end justify-center">

              <div className="flex h-[360px] w-full max-w-[700px] items-center justify-center rounded-3xl border border-dashed border-white/30 bg-white/5">

                <span className="text-xl font-semibold tracking-wide text-blue-100">
                  Warehouse + Truck Illustration
                </span>

              </div>

            </div>

            {/* Footer */}

            <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-8">

              <div>

                <p className="text-sm text-blue-100">
                  © 2026 Vendor Rating Mechanism
                </p>

              </div>

              <div className="flex gap-8 text-sm text-blue-100">

                <span>Secure</span>
                <span>Reliable</span>
                <span>Transparent</span>

              </div>

            </div>

          </div>

        </div>

        {/* =======================================================
            RIGHT PANEL
        ======================================================= */}

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[42%]">

          <div className="w-full max-w-[470px] rounded-3xl bg-white p-10 shadow-2xl">

            {/* Avatar */}

            <div className="flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

                <Building2
                  size={40}
                  className="text-blue-700"
                />

              </div>

            </div>

            {/* Heading */}

            <div className="mt-6 text-center">

              <h2 className="text-3xl font-bold text-gray-800">
                Vendor Login
              </h2>

              <p className="mt-2 text-gray-500">
                Sign in to access your vendor portal
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-6"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    className="absolute left-4 top-4 text-gray-400"
                    size={20}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter Email Address"
                    className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none focus:border-blue-600"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-4 top-4 text-gray-400"
                    size={20}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter Password"
                    className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-12 outline-none focus:border-blue-600"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-4 text-gray-500"
                  >

                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}

                  </button>

                </div>

              </div>

              {/* Remember */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-gray-600">
                    Remember Me
                  </span>

                </label>

                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              {/* Error */}

              {error && (

                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>

              )}

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Logging In...
                  </>
                ) : (
                  "Login"
                )}

              </button>

              {/* Divider */}

              <div className="relative">

                <div className="absolute inset-0 flex items-center">

                  <div className="w-full border-t" />

                </div>

                <div className="relative flex justify-center">

                  <span className="bg-white px-4 text-gray-400">
                    OR
                  </span>

                </div>

              </div>

              {/* OTP */}

              <button
                type="button"
                className="h-14 w-full rounded-xl border-2 border-blue-600 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login with OTP
              </button>

            </form>

            {/* Footer */}

            <div className="mt-10 text-center">

              <p className="text-sm text-gray-500">
                Need assistance?
              </p>

              <button
                type="button"
                className="mt-2 font-semibold text-blue-600 hover:underline"
              >
                Contact Administrator
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VendorLogin;