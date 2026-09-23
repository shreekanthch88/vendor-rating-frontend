import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import { useVendorAuth } from "../../context/VendorAuthContext";

const Profile = () => {
  const { vendorUser, vendorProfile } = useVendorAuth();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="text-blue-600" size={26} />
            Company Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your registered vendor credentials and business details.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} />
            {vendorProfile?.status || "Active"}
          </span>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-8 text-white flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center text-3xl font-bold border border-white/20 shadow-inner">
            {vendorProfile?.vendorName?.charAt(0) || "V"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {vendorProfile?.vendorName || "Vendor Business"}
            </h2>
            <p className="text-sm text-blue-200 mt-0.5">
              Code: <span className="font-mono font-semibold">{vendorProfile?.vendorCode || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Business Information
            </h3>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Tag size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Category</span>
                <span className="text-sm font-semibold text-slate-800">
                  {vendorProfile?.vendorCategory || "Standard Supplier"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Account Status</span>
                <span className="text-sm font-semibold text-slate-800">
                  {vendorProfile?.status || "Active"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Building2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Vendor ID</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  {vendorProfile?._id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Primary Contact & Account
            </h3>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Contact Person</span>
                <span className="text-sm font-semibold text-slate-800">
                  {vendorUser?.name || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                <span className="text-sm font-semibold text-slate-800">
                  {vendorUser?.email || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Phone Number</span>
                <span className="text-sm font-semibold text-slate-800">
                  {vendorUser?.phone || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

