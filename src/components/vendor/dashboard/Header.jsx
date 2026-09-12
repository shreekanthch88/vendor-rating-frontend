import {
  Search,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";

import { useVendorAuth } from "../../../context/VendorAuthContext";
import VendorNotificationBell from "../common/VendorNotificationBell";

const Header = () => {
  const { vendorUser, vendorProfile } =
    useVendorAuth();

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          Welcome,
          {" "}
          {vendorUser?.name || "Vendor"}
        </h1>

        <p className="text-sm text-slate-500">
          {today}
        </p>

      </div>

      {/* Center */}

      <div className="relative w-[420px]">

        <Search
          size={18}
          className="absolute left-4 top-4 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search Purchase Orders..."
          className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-600"
        />

      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <VendorNotificationBell />

        {/* Settings */}

        <button className="rounded-xl bg-slate-100 p-3 hover:bg-slate-200">

          <Settings size={20} />

        </button>

        {/* Profile */}

        <div className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 hover:bg-slate-50">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">

            {vendorUser?.name?.charAt(0) || "V"}

          </div>

          <div>

            <h3 className="text-sm font-semibold">

              {vendorUser?.name || "Vendor"}

            </h3>

            <p className="text-xs text-slate-500">

              {vendorProfile?.vendorCode || "Vendor"}

            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-slate-500"
          />

        </div>

      </div>

    </header>
  );
};

export default Header;