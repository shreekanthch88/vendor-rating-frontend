import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { Plus, Search } from "lucide-react";

import MaterialDashboardCards from "../components/materials/MaterialDashboard";
import MaterialTable from "../components/materials/MaterialTable";

import AddMaterialModal from "../components/materials/AddMaterialModal";
import ViewMaterialModal from "../components/materials/ViewMaterialModal";
import EditMaterialModal from "../components/materials/EditMaterialModal";
import DeleteMaterialModal from "../components/materials/DeleteMaterialModal";

import { getAllMaterials } from "../services/materialService";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const loadMaterials = async () => {
    try {
      setLoading(true);

      const response = await getAllMaterials({
        page,
        search,
        status,
      });

      setMaterials(response.materials || []);
      setPages(response.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [page, search, status]);

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Materials
            </h1>

            <p className="text-gray-500">
              Manage all materials used in procurement.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Material
          </button>

        </div>

        {/* Dashboard */}
        <MaterialDashboardCards refreshTrigger={refreshKey} />

        {/* Filters */}
        <div className="rounded-xl bg-white p-4 shadow">

          <div className="flex flex-wrap gap-4">

            <div className="relative flex-1">

              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search Material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border py-2 pl-10 pr-3"
              />

            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>

        </div>

        {/* Table */}
        <MaterialTable
          materials={materials}
          loading={loading}
          onView={(material) => {
            setSelectedMaterial(material);
            setShowView(true);
          }}
          onEdit={(material) => {
            setSelectedMaterial(material);
            setShowEdit(true);
          }}
          onDelete={(material) => {
            setSelectedMaterial(material);
            setShowDelete(true);
          }}
        />

        {/* Pagination */}
        <div className="flex justify-end gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

      {/* Modals */}
      <AddMaterialModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          setRefreshKey((prev) => prev + 1);
          loadMaterials();
        }}
      />

      <ViewMaterialModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        material={selectedMaterial}
      />

      <EditMaterialModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        material={selectedMaterial}
        onSuccess={() => {
          setShowEdit(false);
          setRefreshKey((prev) => prev + 1);
          loadMaterials();
        }}
      />

      <DeleteMaterialModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        material={selectedMaterial}
        onSuccess={() => {
          setShowDelete(false);
          setRefreshKey((prev) => prev + 1);
          loadMaterials();
        }}
      />

    </Layout>
  );
};

export default Materials;