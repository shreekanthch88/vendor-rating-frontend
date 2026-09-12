import {
  Menu,
  X,
  LogOut,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
  useState,
} from "react";

import qualityInspectionSidebarMenu from "../constants/qualityInspectionSidebarMenu";

import { AuthContext } from "../context/AuthContext";


const QualityInspectionLayout = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const navigate = useNavigate();

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const {
    user,
    logout,
  } = useContext(AuthContext);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  return (

    <div className="min-h-screen bg-slate-50">


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          bg-slate-900
          text-white
          shadow-xl
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >


        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">

              <ShieldCheck
                size={22}
              />

            </div>


            <div>

              <h1 className="text-sm font-bold tracking-wide">
                QUALITY
              </h1>

              <p className="text-xs text-slate-400">
                INSPECTION
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >

            <X
              size={20}
            />

          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">

            Quality Management

          </p>


          <div className="space-y-1">

            {qualityInspectionSidebarMenu.map(
              (item) => {

                const Icon =
                  item.icon;

                return (

                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={({ isActive }) =>
                      `
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition

                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                      `
                    }
                  >

                    <Icon
                      size={19}
                      className="shrink-0"
                    />

                    <span>
                      {item.title}
                    </span>

                  </NavLink>

                );

              }
            )}

          </div>

        </nav>


        {/* =================================================
            USER SECTION
        ================================================= */}

        <div className="border-t border-slate-800 p-4">


          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">

              <UserCircle
                size={20}
              />

            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-white">

                {user?.name ||
                  "Quality Manager"}

              </p>


              <p className="truncate text-xs text-slate-400">

                {user?.role ||
                  "QUALITY_MANAGER"}

              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut
              size={18}
            />

            Logout

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="lg:pl-64">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:px-6">


          <div className="flex items-center gap-3">


            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >

              <Menu
                size={21}
              />

            </button>


            <div>

              <p className="text-sm font-semibold text-slate-800">

                Quality Inspection Portal

              </p>


              <p className="hidden text-xs text-slate-400 sm:block">

                Quality assurance & material inspection

              </p>

            </div>

          </div>


          {/* =================================================
              USER HEADER
          ================================================= */}

          <div className="flex items-center gap-3">


            <div className="hidden text-right sm:block">

              <p className="text-sm font-medium text-slate-700">

                {user?.name ||
                  "Quality Manager"}

              </p>


              <p className="text-xs text-slate-400">

                {user?.role ||
                  "QUALITY_MANAGER"}

              </p>

            </div>


            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">

              <UserCircle
                size={20}
              />

            </div>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main>

          <Outlet />

        </main>

      </div>

    </div>

  );

};


export default QualityInspectionLayout;