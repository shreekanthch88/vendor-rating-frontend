import {
  Menu,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/common/NotificationBell";

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 transition-all duration-300 ${
        sidebarOpen ? "left-72" : "left-20"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <NotificationBell />

        {/* User */}
        <div className="flex items-center gap-2">
          <UserCircle
            size={36}
            className="text-slate-600"
          />

          <div className="hidden md:block">
            <p className="text-sm font-semibold">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-slate-500 capitalize">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <LogOut size={18} />

          <span className="hidden md:block">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;