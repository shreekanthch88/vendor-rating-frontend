import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../layout/Layout";
import { Plus, Search, X } from "lucide-react";

import MaterialCategoryDashboardCards from "../components/materialCategories/MaterialCategoryDashboardCards";
import MaterialCategoryTable from "../components/materialCategories/MaterialCategoryTable";

import AddMaterialCategoryModal from "../components/materialCategories/AddMaterialCategoryModal";
import ViewMaterialCategoryModal from "../components/materialCategories/ViewMaterialCategoryModal";
import EditMaterialCategoryModal from "../components/materialCategories/EditMaterialCategoryModal";
import DeleteMaterialCategoryModal from "../components/materialCategories/DeleteMaterialCategoryModal";

import {
  getAllCategories,
  createCategory,
} from "../services/materialCategoryService";

const MaterialCategories = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch, statusFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await getAllCategories(
        page,
        limit,
        debouncedSearch.trim(),
        statusFilter
      );

      setCategories(data.categories || []);
      setTotalPages(data.pages || 1);
      setTotalCategories(data.total || 0);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    setDebouncedSearch(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);

      toast.success("Material category created successfully.");

      setShowAddModal(false);
      setRefreshKey((prev) => prev + 1);

      loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create category."
      );
    }
  };

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Material Categories
            </h1>

            <p className="mt-1 text-gray-500">
              Manage material category hierarchy.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </button>

        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">

          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2 md:max-w-[550px]">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border py-3 pl-10 pr-10 focus:border-blue-500 focus:outline-none"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 font-medium"
            >
              Search
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-4 py-3"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

        {/* Dashboard */}
        <div className="mt-8">
          <MaterialCategoryDashboardCards refreshTrigger={refreshKey} />
        </div>

        {/* Table */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Material Categories
            </h2>

            <span className="text-sm text-gray-500">
              Total Categories: {totalCategories}
            </span>
          </div>

          <MaterialCategoryTable
            categories={categories}
            loading={loading}
            onView={(category) => {
              setSelectedCategory(category);
              setShowViewModal(true);
            }}
            onEdit={(category) => {
              setSelectedCategory(category);
              setShowEditModal(true);
            }}
            onDelete={(category) => {
              setSelectedCategory(category);
              setShowDeleteModal(true);
            }}
          />

        </div>

        {/* Pagination */}
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

      </div>

      <AddMaterialCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCategory}
      />

      <ViewMaterialCategoryModal
        isOpen={showViewModal}
        category={selectedCategory}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCategory(null);
        }}
      />

      <EditMaterialCategoryModal
        isOpen={showEditModal}
        category={selectedCategory}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
          setRefreshKey((prev) => prev + 1);
          loadCategories();
        }}
      />

      <DeleteMaterialCategoryModal
        isOpen={showDeleteModal}
        category={selectedCategory}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
          setRefreshKey((prev) => prev + 1);
          loadCategories();
        }}
      />
    </Layout>
  );
};

export default MaterialCategories;