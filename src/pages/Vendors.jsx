import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { Plus, Search } from "lucide-react";

import VendorDashboardCards from "../components/vendors/VendorDashboardCards";
import VendorTable from "../components/vendors/VendorTable";
import AddVendorWizard from "../components/vendors/AddVendorWizard";
import ViewVendorModal from "../components/vendors/ViewVendorModal";
import EditVendorModal from "../components/vendors/EditVendorModal";
import DeleteVendorModal from "../components/vendors/DeleteVendormodal";

import {
  createVendor,
  getAllVendors,
} from "../services/vendorService";

const Vendors = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  

  useEffect(() => {
    loadVendors();
  }, [page,statusFilter]);

  const loadVendors = async () => {
  try {
    setLoading(true);

    const data = await getAllVendors(
      page,
  limit,
  search,
  statusFilter
);

    setVendors(data.vendors || []);
    setTotalPages(data.pages || 1);
setTotalVendors(data.total || 0);
  } catch (error) {
    console.error("Error loading vendors:", error);
  } finally {
    setLoading(false);
  }
};

  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
};

  const handleEdit = (vendor) => {
  setSelectedVendor(vendor);
  setShowEditModal(true);
};

  const handleDelete = (vendor) => {
  setSelectedVendor(vendor);
  setShowDeleteModal(true);
};
  const handleSaveVendor = async (vendorData) => {
    try {
      await createVendor(vendorData);

      alert("Vendor created successfully.");

      setShowAddVendor(false);
      setDashboardKey((prev) => prev + 1);
      await loadVendors();
    } catch (error) {
      console.error("Create Vendor Error:", error);
      
      const errorData = error.response?.data;
      let displayMessage = errorData?.message;

      if (!displayMessage && Array.isArray(errorData?.errors)) {
        displayMessage = errorData.errors
          .map((err) => `${err.path || err.param || "Field"}: ${err.msg}`)
          .join("\n");
      }

      alert(displayMessage || "Failed to create vendor.");
    }
  };

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Vendor Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage vendors, performance, and ratings.
            </p>
          </div>

          <button
            onClick={() => setShowAddVendor(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Vendor
          </button>

        </div>

        {/* Search */}
        <div className="flex w-full gap-2 md:w-[550px]">

  <div className="relative flex-1">

    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search vendors..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          loadVendors();
        }
      }}
      className="w-full rounded-lg border py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
    />

  </div>

  <button
    onClick={loadVendors}
    className="rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700"
  >
    Search
  </button>

</div>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none"
>
  <option value="">All Status</option>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
  <option value="Pending">Pending</option>
  <option value="Blacklisted">Blacklisted</option>
</select>
        

        {/* Dashboard */}
        <div className="mt-8">
          <VendorDashboardCards key={dashboardKey} />
        </div>

        {/* Vendor Table */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Vendor List
            </h2>

            <span className="text-sm text-gray-500">
              Total Vendors: {totalVendors}
            </span>

          </div>
          

          <VendorTable
            vendors={vendors}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </div>
      <div className="mt-6 flex items-center justify-between">
  <button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
    className="rounded border px-4 py-2 disabled:opacity-50"
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
    className="rounded border px-4 py-2 disabled:opacity-50"
  >
    Next
  </button>
</div>

      <AddVendorWizard
        isOpen={showAddVendor}
        onClose={() => setShowAddVendor(false)}
        onSave={handleSaveVendor}
      />

      <ViewVendorModal
  isOpen={showViewModal}
  vendor={selectedVendor}
  onClose={() => {
    setShowViewModal(false);
    setSelectedVendor(null);
  }}
/>

<EditVendorModal
  isOpen={showEditModal}
  onClose={() => {
    setShowEditModal(false);
    setSelectedVendor(null);
  }}
  vendor={selectedVendor}
  onSuccess={() => {
    setDashboardKey((prev) => prev + 1);
    loadVendors();
    setShowEditModal(false);
    setSelectedVendor(null);
  }}
/>
<DeleteVendorModal
  isOpen={showDeleteModal}
  vendor={selectedVendor}
  onClose={() => {
    setShowDeleteModal(false);
    setSelectedVendor(null);
  }}
  onSuccess={() => {
    setDashboardKey((prev) => prev + 1);
    loadVendors();
    setShowDeleteModal(false);
    setSelectedVendor(null);
  }}
/>

    </Layout>
  );
};

export default Vendors;