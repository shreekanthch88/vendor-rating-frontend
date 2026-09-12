import Sidebar from "../components/vendor/dashboard/Sidebar";
import Header from "../components/vendor/dashboard/Header";

const VendorLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default VendorLayout;