import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import Layout from "../layout/Layout";

import PurchaseRequisitionDashboardCards from "../components/purchaseRequisition/PurchaseRequisitionDashboardCards";
import PurchaseRequisitionFilters from "../components/purchaseRequisition/PurchaseRequisitionFilters";
import PurchaseRequisitionTable from "../components/purchaseRequisition/PurchaseRequisitionTable";
import PurchaseRequisitionPagination from "../components/purchaseRequisition/PurchaseRequisitionPagination";

import AddPurchaseRequisitionWizard from "../components/purchaseRequisition/AddPurchaseRequisitionWizard";
import ViewPurchaseRequisitionModal from "../components/purchaseRequisition/ViewPurchaseRequisitionModal";
import EditPurchaseRequisitionModal from "../components/purchaseRequisition/EditPurchaseRequisitionModal";
import DeletePurchaseRequisitionModal from "../components/purchaseRequisition/DeletePurchaseRequisitionModal";
import RejectPurchaseRequisitionModal from "../components/purchaseRequisition/RejectPurchaseRequisitionModal";

import {
  getAllPurchaseRequisitions,
  createPurchaseRequisition,
  updatePurchaseRequisition,
  deletePurchaseRequisition,
  submitPurchaseRequisition,
  approvePurchaseRequisition,
  rejectPurchaseRequisition,
} from "../services/purchaseRequisitionService";

const PurchaseRequisitions = () => {

  const [requisitions, setRequisitions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [total, setTotal] = useState(0);

  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [department, setDepartment] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [selectedRequisition, setSelectedRequisition] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showAdd, setShowAdd] = useState(false);

  const [showView, setShowView] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [showReject, setShowReject] = useState(false);

  const loadPurchaseRequisitions = async () => {
    try {
      setLoading(true);

      const response = await getAllPurchaseRequisitions({
        page,
        limit,
        search: debouncedSearch,
        status,
        department,
        priority,
      });

      setRequisitions(response.requisitions || []);

      setPages(response.pages || 1);

      setTotal(response.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadPurchaseRequisitions();
  }, [
    page,
    limit,
    debouncedSearch,
    department,
    status,
    priority,
  ]);

  const handleCardStatusSelect = (cardStatus) => {
    setStatus((prev) => (prev === cardStatus ? "" : cardStatus));
    setPage(1);
  };

  const handleSearch = () => {
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setDepartment("");
    setStatus("");
    setPriority("");
    setPage(1);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    loadPurchaseRequisitions();
  };

  const handleCreate = async (payload) => {
    await createPurchaseRequisition(payload);
    setShowAdd(false);
    setRefreshTrigger((prev) => prev + 1);
    loadPurchaseRequisitions();
  };

  const handleUpdate = async (payload) => {
    await updatePurchaseRequisition(
      selectedRequisition._id,
      payload
    );
    setShowEdit(false);
    setRefreshTrigger((prev) => prev + 1);
    loadPurchaseRequisitions();
  };

  const handleDelete = async (id) => {
    await deletePurchaseRequisition(id);
    setShowDelete(false);
    setRefreshTrigger((prev) => prev + 1);
    loadPurchaseRequisitions();
  };

  const handleSubmit = async (requisition) => {
    const confirmSubmit = window.confirm(
      `Are you sure you want to submit Purchase Requisition ${requisition.prNumber}?`
    );
    if (!confirmSubmit) return;

    try {
      await submitPurchaseRequisition(
        requisition._id
      );
      setRefreshTrigger((prev) => prev + 1);
      loadPurchaseRequisitions();
      alert("Purchase Requisition Submitted Successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to submit Purchase Requisition."
      );
    }
  };

  const handleApprove = async (requisition) => {
    const confirmApprove = window.confirm(
      `Are you sure you want to approve Purchase Requisition ${requisition.prNumber}?`
    );
    if (!confirmApprove) return;

    try {
      await approvePurchaseRequisition(
        requisition._id
      );
      setRefreshTrigger((prev) => prev + 1);
      loadPurchaseRequisitions();
      alert("Purchase Requisition Approved Successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to approve Purchase Requisition."
      );
    }
  };

  const handleReject = async (requisition, reason) => {
    try {
      if (!reason || !reason.trim()) {
        alert("Rejection reason is required.");
        return;
      }

      await rejectPurchaseRequisition(
        requisition._id,
        reason.trim()
      );

      setShowReject(false);
      setSelectedRequisition(null);
      setRefreshTrigger((prev) => prev + 1);
      loadPurchaseRequisitions();

      alert("Purchase Requisition Rejected Successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to reject Purchase Requisition."
      );
    }
  };

  return (

    <Layout>
              <div className="space-y-6">

        {/* Page Header */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Purchase Requisitions
            </h1>

            <p className="mt-1 text-gray-500">
              Manage Purchase Requisitions, approvals, and procurement requests.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border bg-white px-5 py-3 hover:bg-gray-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              New Purchase Requisition
            </button>

          </div>

        </div>

        {/* Dashboard */}

        <PurchaseRequisitionDashboardCards
          selectedStatus={status}
          onSelectStatus={handleCardStatusSelect}
          refreshTrigger={refreshTrigger}
        />

        {/* Filters */}

        <PurchaseRequisitionFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={(dept) => {
            setDepartment(dept);
            setPage(1);
          }}
          status={status}
          setStatus={(st) => {
            setStatus(st);
            setPage(1);
          }}
          priority={priority}
          setPriority={(prio) => {
            setPriority(prio);
            setPage(1);
          }}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* Table */}

        <PurchaseRequisitionTable
          requisitions={requisitions}
          loading={loading}

          onView={(pr) => {
            setSelectedRequisition(pr);
            setShowView(true);
          }}

          onEdit={(pr) => {
            setSelectedRequisition(pr);
            setShowEdit(true);
          }}

          onDelete={(pr) => {
            setSelectedRequisition(pr);
            setShowDelete(true);
          }}

          onSubmit={handleSubmit}

          onApprove={handleApprove}

          onReject={(pr) => {
  setSelectedRequisition(pr);
  setShowReject(true);
}}
        />

        {/* Pagination */}

        <PurchaseRequisitionPagination
          page={page}
          totalPages={pages}
          totalRecords={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
        />

      </div>
            {/* Add Purchase Requisition */}

      <AddPurchaseRequisitionWizard
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleCreate}
      />

      {/* View Purchase Requisition */}

      <ViewPurchaseRequisitionModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedRequisition(null);
        }}
        requisition={selectedRequisition}
      />

      {/* Edit Purchase Requisition */}

      <EditPurchaseRequisitionModal
        isOpen={showEdit}
        onClose={() => {
          setShowEdit(false);
          setSelectedRequisition(null);
        }}
        requisition={selectedRequisition}
        onUpdate={handleUpdate}
      />

      {/* Delete Purchase Requisition */}

      <DeletePurchaseRequisitionModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedRequisition(null);
        }}
        requisition={selectedRequisition}
        onDelete={handleDelete}
      />

      <RejectPurchaseRequisitionModal
  isOpen={showReject}
  onClose={() => {
    setShowReject(false);
    setSelectedRequisition(null);
  }}
  requisition={selectedRequisition}
  onReject={handleReject}
/>

    </Layout>

  );
};

export default PurchaseRequisitions;