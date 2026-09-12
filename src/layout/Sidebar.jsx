import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../constants/sidebarMenu";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-800 text-white shadow-xl transition-all duration-300 z-50

      ${
        sidebarOpen
          ? "w-72"
          : "w-20"
      }`}
    >

      {/* Logo */}

      <div className="h-20 border-b border-slate-700 flex items-center justify-center">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl">

            V

          </div>

          {sidebarOpen && (

            <div>

              <h1 className="font-bold text-lg">

                Vendor RM

              </h1>

              <p className="text-xs text-slate-400">

                Procurement

              </p>

            </div>

          )}

        </div>

      </div>

      {/* Menu */}

      <nav className="mt-6 px-3 overflow-y-auto h-[calc(100vh-80px)]">

        {sidebarMenu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink

              key={item.path}

              to={item.path}

              className={({ isActive }) =>

                `flex items-center rounded-xl px-4 py-3 mb-2 transition-all duration-200

                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-700 text-slate-300"
                }`

              }

            >

              <Icon
                size={20}
              />

              {sidebarOpen && (

                <span className="ml-3 text-sm font-medium">

                  {item.title}

                </span>

              )}

            </NavLink>

          );

        })}

      </nav>

    </aside>
  );
};

export default Sidebar;