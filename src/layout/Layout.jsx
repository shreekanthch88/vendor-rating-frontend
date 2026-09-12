import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar
        sidebarOpen={sidebarOpen}
      />

      <Navbar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() =>
          setSidebarOpen(!sidebarOpen)
        }
      />

      <main
        className={`transition-all duration-300 pt-20 ${
          sidebarOpen
            ? "ml-72"
            : "ml-20"
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;