import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Users,
  ShieldCheck,
  FileText,
  Star,
  Settings,
  Building2,
  Truck,
  Receipt,
  TrendingUp,
  Bell,
  UserCheck,
  Package,
  Sparkles,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useVendorAuth } from "../context/VendorAuthContext";

const PortalGateway = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { vendorUser } = useVendorAuth ? useVendorAuth() : { vendorUser: null };

  const handleAdminEnter = () => {
    // If admin/staff is already logged in in this tab, navigate straight to dashboard
    const adminToken =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");
    if (user && adminToken) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleVendorEnter = () => {
    // If vendor is already logged in in this tab, navigate straight to vendor dashboard
    const vToken =
      sessionStorage.getItem("vendorToken") ||
      localStorage.getItem("vendorToken");
    if (vendorUser && vToken) {
      navigate("/vendor/dashboard");
    } else {
      navigate("/vendor/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-slate-800 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =========================================================
          TOP HEADER
          ========================================================= */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Package className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
              Vendor Rating Mechanism
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Stronger Vendors. A Better Tomorrow.
            </p>
          </div>
        </div>

        {/* Right: Tagline */}
        <div className="hidden sm:flex items-center space-x-2 text-right">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700">
              Reliable Procurement
            </div>
            <div className="text-[11px] text-slate-500">
              Sustainable Partnerships
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          SIDE VERTICAL ACCENTS (DESKTOP)
          ========================================================= */}
      {/* Left side labels */}
      <div className="hidden xl:flex flex-col items-center space-y-8 fixed left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[11px] font-bold tracking-[0.25em] text-slate-400/80 uppercase">
        <span className="hover:text-blue-600 transition-colors">PROCURE</span>
        <span className="hover:text-blue-600 transition-colors">EVALUATE</span>
        <span className="hover:text-blue-600 transition-colors">COLLABORATE</span>
        <span className="hover:text-blue-600 transition-colors">GROW</span>
        <div className="w-6 h-0.5 bg-blue-400/60 rounded-full" />
      </div>

      {/* Right side labels */}
      <div className="hidden xl:flex flex-col items-center space-y-8 fixed right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[11px] font-bold tracking-[0.25em] text-slate-400/80 uppercase">
        <span className="hover:text-emerald-600 transition-colors">QUALITY</span>
        <span className="hover:text-emerald-600 transition-colors">PERFORMANCE</span>
        <span className="hover:text-emerald-600 transition-colors">TRUST</span>
        <span className="hover:text-emerald-600 transition-colors">SUCCESS</span>
        <div className="w-6 h-0.5 bg-emerald-400/60 rounded-full" />
      </div>

      {/* =========================================================
          BACKGROUND VISUAL PANELS (LAPTOP & LOGISTICS TRUCK)
          ========================================================= */}
      {/* Left Visual: Modern Office & Laptop (Admin) */}
      <div className="hidden lg:block absolute left-0 bottom-10 w-[24vw] max-w-[380px] xl:max-w-[420px] h-[320px] xl:h-[360px] pointer-events-none select-none -z-10 rounded-r-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border-y border-r border-blue-200/60 transition-transform duration-700">
        <img
          src="/images/admin-laptop.jpg"
          alt="Better Vendors Brighter Business"
          className="w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02]"
        />
        {/* Soft edge blend gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/30 to-slate-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-6 right-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-950 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Better Vendors &bull; Brighter Business</span>
          </div>
        </div>
      </div>

      {/* Right Visual: Logistics Commercial Truck (Vendor) */}
      <div className="hidden lg:block absolute right-0 bottom-10 w-[24vw] max-w-[380px] xl:max-w-[420px] h-[320px] xl:h-[360px] pointer-events-none select-none -z-10 rounded-l-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border-y border-l border-emerald-200/60 transition-transform duration-700">
        <img
          src="/images/vendor-truck.jpg"
          alt="Partners in Progress"
          className="w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02]"
        />
        {/* Soft edge blend gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-50/30 to-slate-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-5 right-6 left-6 text-right">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Partners in Progress</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN HERO SECTION
          ========================================================= */}
      <main className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-10 my-auto flex flex-col items-center z-10">
        {/* Hero Title & Subtitles */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[11px] font-semibold tracking-[0.2em] text-blue-700 uppercase mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>WELCOME TO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Vendor Rating Mechanism
          </h2>

          <p className="mt-3 text-base sm:text-lg font-medium text-slate-700">
            Integrated Procurement &amp; Vendor Management System
          </p>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            Transparent Process &nbsp;|&nbsp; Trusted Partnerships &nbsp;|&nbsp; Sustainable Growth
          </p>
        </div>

        {/* =========================================================
            PORTAL CARDS (ADMIN & VENDOR)
            ========================================================= */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {/* -----------------------------------------------------
              CARD 1: ADMIN PORTAL
              ----------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 p-7 sm:p-8 flex flex-col justify-between relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />

            <div>
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-5 shadow-inner group-hover:scale-105 transition-transform">
                <div className="relative">
                  <Users className="w-9 h-9 stroke-[2]" />
                  <Settings className="w-4 h-4 absolute -bottom-1 -right-1 text-blue-700 bg-white rounded-full p-0.5" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-bold text-slate-900 text-center">
                Admin Portal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
                Manage procurement, vendors, quality, payments and ratings.
              </p>

              {/* Features List */}
              <div className="mt-7 space-y-3.5 text-sm text-slate-700">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Procurement Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Vendor Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Quality &amp; Compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Payments &amp; Invoices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Vendor Rating &amp; Reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">System Administration</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleAdminEnter}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all group/btn cursor-pointer"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* -----------------------------------------------------
              CARD 2: VENDOR PORTAL
              ----------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 p-7 sm:p-8 flex flex-col justify-between relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-3xl" />

            <div>
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-5 shadow-inner group-hover:scale-105 transition-transform">
                <Building2 className="w-9 h-9 stroke-[2]" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-bold text-slate-900 text-center">
                Vendor Portal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
                Manage your purchase orders, dispatches, invoices and performance.
              </p>

              {/* Features List */}
              <div className="mt-7 space-y-3.5 text-sm text-slate-700">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">View Purchase Orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Manage Dispatches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Receipt className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Submit Invoices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Track Performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Receive Notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Manage Company Profile</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleVendorEnter}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all group/btn cursor-pointer"
              >
                <span>Enter Vendor Portal</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 gap-3">
        <div>
          &copy; {new Date().getFullYear()} Vendor Rating Mechanism. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:text-slate-700 transition cursor-pointer">
            Privacy Policy
          </span>
          <span>&bull;</span>
          <span className="hover:text-slate-700 transition cursor-pointer">
            Terms of Use
          </span>
          <span>&bull;</span>
          <span className="hover:text-slate-700 transition cursor-pointer">
            Support
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PortalGateway;

