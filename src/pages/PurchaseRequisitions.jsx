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

  const [department, setDepartment] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [selectedRequisition, setSelectedRequisition] = useState(null);

  const [showAdd, setShowAdd] = useState(false);

  const [showView, setShowView] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [showReject, setShowReject] = useState(false);

  const loadPurchaseRequisitions = async () => {

    try {

      setLoading(true);

      const response =
        await getAllPurchaseRequisitions(
          page,
          limit,
          search,
          status,
          department,
          priority
        );

      setRequisitions(
        response.requisitions || []
      );

      setPages(response.pages || 1);

      setTotal(response.total || 0);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPurchaseRequisitions();

  }, [
    page,
    limit,
    search,
    department,
    status,
    priority,
  ]);

  const handleSearch = () => {

    setPage(1);

    loadPurchaseRequisitions();

  };

  const handleReset = () => {

    setSearch("");

    setDepartment("");

    setStatus("");

    setPriority("");

    setPage(1);

  };

  const handleRefresh = () => {

    loadPurchaseRequisitions();

  };

  const handleCreate = async (payload) => {

    await createPurchaseRequisition(payload);

    setShowAdd(false);

    loadPurchaseRequisitions();

  };

  const handleUpdate = async (payload) => {

    await updatePurchaseRequisition(
      selectedRequisition._id,
      payload
    );

    setShowEdit(false);

    loadPurchaseRequisitions();

  };

  const handleDelete = async (id) => {

    await deletePurchaseRequisition(id);

    setShowDelete(false);

    loadPurchaseRequisitions();

  };

  const handleSubmit = async (requisition) => {

    await submitPurchaseRequisition(
      requisition._id
    );

    loadPurchaseRequisitions();

  };

  const handleApprove = async (requisition) => {

    await approvePurchaseRequisition(
      requisition._id
    );

    loadPurchaseRequisitions();

  };

  const handleReject = async (requisition) => {
  try {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) return;

    await rejectPurchaseRequisition(
      requisition._id,
      reason
    );

    loadPurchaseRequisitions();

    alert("Purchase Requisition Rejected Successfully.");

  } catch (error) {
    console.error(error);
    alert("Failed to reject Purchase Requisition.");
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

        <PurchaseRequisitionDashboardCards />

        {/* Filters */}

        <PurchaseRequisitionFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
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