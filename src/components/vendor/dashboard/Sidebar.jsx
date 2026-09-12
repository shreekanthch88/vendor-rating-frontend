import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  RefreshCcw,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Building2,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useVendorAuth,
} from "../../../context/VendorAuthContext";


const menus = [

  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/vendor/dashboard",
  },

  {
    name: "Purchase Orders",
    icon: ShoppingCart,
    path: "/vendor/purchase-orders",
  },

  {
    name: "Dispatches",
    icon: Truck,
    path: "/vendor/dispatches",
  },

  {
    name: "Replacement",
    icon: RefreshCcw,
    path: "/vendor/replacement-requests",
  },

  {
    name: "Invoices",
    icon: FileText,
    path: "/vendor/invoices",
  },

  {
    name: "Payments",
    icon: CreditCard,
    path: "/vendor/payments",
  },

  {
    name: "Performance",
    icon: BarChart3,
    path: "/vendor/performance",
  },

  {
    name: "Notifications",
    icon: Bell,
    path: "/vendor/notifications",
  },

  {
    name: "Company Profile",
    icon: Building2,
    path: "/vendor/profile",
  },

];


const Sidebar = () => {

  const navigate =
    useNavigate();

  const {
    logout,
  } = useVendorAuth();


  const handleLogout = () => {

    logout();

    navigate(
      "/vendor/login",
      {
        replace: true,
      }
    );

  };


  return (

    <aside
      className="flex h-screen w-72 flex-col bg-[#0F172A] text-white"
    >

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="border-b border-slate-700 px-6 py-6">

        <h1 className="text-3xl font-bold tracking-wide">
          VRM
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Vendor Portal
        </p>

      </div>


     

      


      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <ul className="space-y-2">

          {menus.map(
            (
              menu
            ) => {

              const Icon =
                menu.icon;


              return (

                <li
                  key={menu.name}
                >

                  <NavLink
                    to={menu.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >

                    <Icon
                      size={20}
                    />

                    <span>
                      {menu.name}
                    </span>

                  </NavLink>

                </li>

              );

            }
          )}

        </ul>

      </nav>


      {/* =====================================================
          LOGOUT
      ===================================================== */}

      <div className="border-t border-slate-700 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 transition hover:bg-red-700"
        >

          <LogOut
            size={20}
          />

          Logout

        </button>

      </div>

    </aside>

  );

};


export default Sidebar;