import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../layout/Layout";
import { Plus } from "lucide-react";

import PurchaseOrderDashboardCards from "../components/purchaseOrder/PurchaseOrderDashboardCards";
import PurchaseOrderCharts from "../components/purchaseOrder/PurchaseOrderCharts";
import PurchaseOrderFilters from "../components/purchaseOrder/PurchaseOrderFilters";
import PurchaseOrderTable from "../components/purchaseOrder/PurchaseOrderTable";
import PurchaseOrderPagination from "../components/purchaseOrder/PurchaseOrderPagination";

import AddPurchaseOrderWizard from "../components/purchaseOrder/AddPurchaseOrderWizard";
import ViewPurchaseOrderModal from "../components/purchaseOrder/ViewPurchaseOrderModal";
import EditPurchaseOrderModal from "../components/purchaseOrder/EditPurchaseOrderModal";
import DeletePurchaseOrderModal from "../components/purchaseOrder/DeletePurchaseOrderModal";

import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
  submitPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  sendPurchaseOrderToVendor,
  getPurchaseOrderDashboard,
  getPurchaseOrderCharts,
  getPurchaseOrderFulfillment,
} from "../services/purchaseOrderService";

const PurchaseOrders = () => {

  /**
   * ==========================================
   * States
   * ==========================================
   */

  const [searchParams] = useSearchParams();
  const poIdFromQuery = searchParams.get("id");

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vendor, setVendor] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [dashboard, setDashboard] = useState({});

  const [charts, setCharts] = useState({
    trendData: [],
    statusData: [],
    departmentData: [],
    vendorData: [],
  });

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState(null);

  const [purchaseOrderFulfillment, setPurchaseOrderFulfillment] =
  useState(null);

const [fulfillmentLoading, setFulfillmentLoading] =
  useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /**
   * ==========================================
   * Load Purchase Orders
   * ==========================================
   */

  const loadPurchaseOrders = async () => {

    try {

      setLoading(true);

      const response =
        await getAllPurchaseOrders(
          page,
          limit,
          search,
          status,
          vendor,
          priority
        );

      setPurchaseOrders(
        response.purchaseOrders || []
      );

      setPages(response.pages || 1);

      setTotal(response.total || 0);

    } catch (error) {

      console.error(
        "Purchase Order Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  /**
   * ==========================================
   * Load Dashboard
   * ==========================================
   */

  const loadDashboard = async () => {

    try {

      const response =
        await getPurchaseOrderDashboard();

      setDashboard(
        response.data || {}
      );

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

    }

  };

  /**
   * ==========================================
   * Load Charts
   * ==========================================
   */

  const loadCharts = async () => {

    try {

      const response =
        await getPurchaseOrderCharts();

      setCharts(
        response.data || {
          trendData: [],
          statusData: [],
          departmentData: [],
          vendorData: [],
        }
      );

    } catch (error) {

      console.error(
        "Charts Error:",
        error
      );

    }

  };

  /**
   * ==========================================
   * Initial Load
   * ==========================================
   */

  useEffect(() => {

    loadPurchaseOrders();

    loadDashboard();

    loadCharts();

  }, [
    page,
    limit,
    search,
    status,
    vendor,
    priority,
  ]);

    /**
   * ==========================================
   * Refresh All Data
   * ==========================================
   */

  const refreshPage = async () => {

    await loadPurchaseOrders();

    await loadDashboard();

    await loadCharts();

  };

  /**
   * ==========================================
   * Print Purchase Order
   * ==========================================
   */

  const handlePrint = (purchaseOrder) => {

    console.log(
      "Print Purchase Order:",
      purchaseOrder
    );

    window.print();

  };

  /**
   * ==========================================
   * Export Purchase Order
   * ==========================================
   */

  const handleExport = (purchaseOrder) => {
    const po = purchaseOrder || selectedPurchaseOrder;
    if (!po) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order - ${po.poNumber || "PO"}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e40af; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0369a1; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
            .card h3 { margin-top: 0; font-size: 14px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
            .label { color: #64748b; font-weight: 500; }
            .val { font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
            th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 12px; border-bottom: 2px solid #cbd5e1; color: #475569; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .totals { width: 300px; margin-left: auto; margin-top: 15px; font-size: 13px; }
            .totals .row { padding: 4px 0; }
            .totals .grand { font-size: 16px; font-weight: bold; color: #1e40af; border-top: 2px solid #cbd5e1; padding-top: 8px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">PURCHASE ORDER</div>
              <div style="color: #64748b; font-size: 13px; margin-top: 4px;">PO Number: <strong>${po.poNumber || "-"}</strong></div>
            </div>
            <div>
              <span class="badge">${po.status || "Draft"}</span>
            </div>
          </div>
          <div class="grid">
            <div class="card">
              <h3>Vendor Details</h3>
              <div class="row"><span class="label">Vendor:</span><span class="val">${po.vendor?.vendorName || po.vendor?.companyName || "-"}</span></div>
              <div class="row"><span class="label">Code:</span><span class="val">${po.vendor?.vendorCode || "-"}</span></div>
              <div class="row"><span class="label">Category:</span><span class="val">${po.vendor?.vendorCategory || "-"}</span></div>
              <div class="row"><span class="label">Email:</span><span class="val">${po.vendor?.email || "-"}</span></div>
              <div class="row"><span class="label">Mobile:</span><span class="val">${po.vendor?.mobile || po.vendor?.phone || "-"}</span></div>
              <div class="row"><span class="label">GST:</span><span class="val">${po.vendor?.gstNumber || "-"}</span></div>
            </div>
            <div class="card">
              <h3>Order Information</h3>
              <div class="row"><span class="label">Order Date:</span><span class="val">${po.orderDate ? new Date(po.orderDate).toLocaleDateString('en-IN') : "-"}</span></div>
              <div class="row"><span class="label">Expected Delivery:</span><span class="val">${po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString('en-IN') : "-"}</span></div>
              <div class="row"><span class="label">Payment Terms:</span><span class="val">${po.paymentTerms || "Net 30"}</span></div>
              <div class="row"><span class="label">Currency:</span><span class="val">${po.currency || "INR"}</span></div>
              <div class="row"><span class="label">Priority:</span><span class="val">${po.priority || "Medium"}</span></div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Unit</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${(po.items || []).map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${it.materialName || it.material?.materialName || it.material?.materialCode || "Item"}</strong></td>
                  <td>${it.unitOfMeasure || it.material?.unitOfMeasure || "Unit"}</td>
                  <td style="text-align: right;">${it.quantity}</td>
                  <td style="text-align: right;">₹${Number(it.unitPrice || 0).toFixed(2)}</td>
                  <td style="text-align: right;">₹${Number(it.totalPrice || (it.quantity * it.unitPrice) || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="row"><span class="label">Subtotal:</span><span class="val">₹${Number(po.subtotal || 0).toFixed(2)}</span></div>
            <div class="row"><span class="label">Tax Amount:</span><span class="val">₹${Number(po.taxAmount || 0).toFixed(2)}</span></div>
            <div class="row"><span class="label">Freight Charges:</span><span class="val">₹${Number(po.freightCharges || 0).toFixed(2)}</span></div>
            <div class="row grand"><span class="label">Grand Total:</span><span class="val">₹${Number(po.grandTotal || 0).toFixed(2)}</span></div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  /**
   * ==========================================
   * View Purchase Order
   * ==========================================
   */

  const handleView = async (purchaseOrder) => {

  try {

    setSelectedPurchaseOrder(
      purchaseOrder
    );

    setPurchaseOrderFulfillment(null);

    setFulfillmentLoading(true);

    setShowView(true);

    const [fulfillmentRes, fullPORes] = await Promise.allSettled([
      getPurchaseOrderFulfillment(purchaseOrder._id),
      getPurchaseOrderById(purchaseOrder._id),
    ]);

    if (fulfillmentRes.status === "fulfilled") {
      setPurchaseOrderFulfillment(
        fulfillmentRes.value.data || null
      );
    }

    if (fullPORes.status === "fulfilled" && (fullPORes.value.data || fullPORes.value)) {
      setSelectedPurchaseOrder(
        fullPORes.value.data || fullPORes.value
      );
    }

  } catch (error) {

    console.error(
      "Purchase Order Fulfillment Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
      "Failed to load Purchase Order fulfillment."
    );

  } finally {

    setFulfillmentLoading(false);

  }

};

  /**
   * Auto-open purchase order from URL query parameter (e.g. notifications)
   */
  useEffect(() => {
    if (poIdFromQuery) {
      getPurchaseOrderById(poIdFromQuery)
        .then((response) => {
          if (response?.data) {
            handleView(response.data);
          }
        })
        .catch((err) => {
          console.error("Could not load PO from URL parameter:", err);
        });
    }
  }, [poIdFromQuery]);

  /**
   * ==========================================
   * Edit Purchase Order
   * ==========================================
   */

  const handleEdit = (purchaseOrder) => {

    setSelectedPurchaseOrder(
      purchaseOrder
    );

    setShowEdit(true);

  };

  /**
   * ==========================================
   * Open Delete Dialog
   * ==========================================
   */

  const openDeleteDialog = (
    purchaseOrder
  ) => {

    setSelectedPurchaseOrder(
      purchaseOrder
    );

    setShowDelete(true);

  };

  /**
   * ==========================================
   * Delete Purchase Order
   * ==========================================
   */

  const handleDelete = async () => {

    try {

      await deletePurchaseOrder(
        selectedPurchaseOrder._id
      );

      alert(
        "Purchase Order deleted successfully."
      );

      setShowDelete(false);

      setSelectedPurchaseOrder(null);

      await refreshPage();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete Purchase Order."
      );

    }

  };

  /**
   * ==========================================
   * Submit Purchase Order
   * ==========================================
   */

  const handleSubmit = async (
    purchaseOrder
  ) => {

    try {

      await submitPurchaseOrder(
        purchaseOrder._id
      );

      alert(
        "Purchase Order submitted successfully."
      );

      await refreshPage();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to submit Purchase Order."
      );

    }

  };

  /**
   * ==========================================
   * Submit Selected Purchase Orders (Bulk)
   * ==========================================
   */

  const handleSubmitSelected = async (selectedOrders) => {
    const draftOrders = selectedOrders.filter(
      (purchaseOrder) => purchaseOrder.status === "Draft"
    );

    if (!draftOrders.length) {
      alert("Only Draft Purchase Orders can be submitted.");
      return false;
    }

    try {
      setLoading(true);

      await Promise.all(
        draftOrders.map((purchaseOrder) =>
          submitPurchaseOrder(purchaseOrder._id)
        )
      );

      alert(
        `${draftOrders.length} Purchase Order(s) submitted successfully.`
      );

      await refreshPage();
      return true;
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to submit selected Purchase Orders."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==========================================
   * Approve Purchase Orders
   * ==========================================
   */

  const handleApproveSelected =
    async (selectedOrders) => {

      const invalidOrders =
        selectedOrders.filter(
          (purchaseOrder) =>
            purchaseOrder.status !==
            "Submitted"
        );

      if (invalidOrders.length) {

        alert(
          "Only Submitted Purchase Orders can be approved."
        );

        return false;

      }

      try {

        await Promise.all(

          selectedOrders.map(
            (purchaseOrder) =>

              approvePurchaseOrder(
                purchaseOrder._id
              )

          )

        );

        alert(
          "Purchase Order approved successfully."
        );

        await refreshPage();

        return true;

      } catch (error) {

        console.error(error);

        alert(
          error?.response?.data?.message ||
          "Approval failed."
        );

        return false;

      }

    };

  /**
   * ==========================================
   * Reject Purchase Order
   * ==========================================
   */

  const handleReject = async (
    purchaseOrder
  ) => {

    const reason = window.prompt(
      "Enter rejection reason"
    );

    if (!reason) return;

    try {

      await rejectPurchaseOrder(

        purchaseOrder._id,

        reason

      );

      alert(
        "Purchase Order rejected successfully."
      );

      await refreshPage();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to reject Purchase Order."
      );

    }

  };

  /**
   * ==========================================
   * Send Purchase Order To Vendor
   * ==========================================
   */

  const handleSendToVendor =
    async (purchaseOrder) => {

      try {

        await sendPurchaseOrderToVendor(
          purchaseOrder._id
        );

        alert(
          "Purchase Order sent to Vendor."
        );

        await refreshPage();

      } catch (error) {

        console.error(error);

        alert(
          error?.response?.data?.message ||
          "Failed to send Purchase Order."
        );

      }

    };
      return (

    <Layout>

      <div className="space-y-6">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">

              Purchase Orders

            </h1>

            <p className="mt-1 text-sm text-slate-500">

              Create, manage, approve and track Purchase Orders.

            </p>

          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
          >

            <Plus size={18} />

            Create Purchase Order

          </button>

        </div>

        {/* ==========================================
            Dashboard Cards
        ========================================== */}

        <PurchaseOrderDashboardCards
          statistics={dashboard}
        />

        {/* ==========================================
            Charts
        ========================================== */}

        <PurchaseOrderCharts
          trendData={charts.trendData}
          statusData={charts.statusData}
          departmentData={charts.departmentData}
          vendorData={charts.vendorData}
        />

        {/* ==========================================
            Filters
        ========================================== */}

        <PurchaseOrderFilters

          search={search}
          setSearch={setSearch}

          status={status}
          setStatus={setStatus}

          vendor={vendor}
          setVendor={setVendor}

          priority={priority}
          setPriority={setPriority}

          onRefresh={refreshPage}

        />

        {/* ==========================================
            Purchase Order Table
        ========================================== */}

        <PurchaseOrderTable

          purchaseOrders={purchaseOrders}

          loading={loading}

          onView={handleView}

          onEdit={handleEdit}

          onDelete={openDeleteDialog}

          onPrint={handlePrint}

          onExport={handleExport}

          onApprove={handleApproveSelected}

          onSubmit={handleSubmit}

          onSubmitSelected={handleSubmitSelected}

          onReject={handleReject}

          onSendToVendor={handleSendToVendor}

        />

        {/* ==========================================
            Pagination
        ========================================== */}

        <PurchaseOrderPagination

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
            {/* ==========================================
          Add Purchase Order Wizard
      ========================================== */}

      <AddPurchaseOrderWizard

        isOpen={showAdd}

        onClose={() => {

          setShowAdd(false);

        }}

        onSuccess={async () => {

          setShowAdd(false);

          await refreshPage();

        }}

      />

      {/* ==========================================
          View Purchase Order
      ========================================== */}

      <ViewPurchaseOrderModal

  isOpen={showView}

  onClose={() => {

    setShowView(false);

    setSelectedPurchaseOrder(null);

    setPurchaseOrderFulfillment(null);

  }}

  purchaseOrder={selectedPurchaseOrder}

  fulfillment={purchaseOrderFulfillment}

  fulfillmentLoading={fulfillmentLoading}

/>

      {/* ==========================================
          Edit Purchase Order
      ========================================== */}

      <EditPurchaseOrderModal

        isOpen={showEdit}

        onClose={() => {

          setShowEdit(false);

          setSelectedPurchaseOrder(null);

        }}

        purchaseOrder={selectedPurchaseOrder}

        onSuccess={async () => {

          setShowEdit(false);

          setSelectedPurchaseOrder(null);

          await refreshPage();

        }}

      />

      {/* ==========================================
          Delete Purchase Order
      ========================================== */}

      <DeletePurchaseOrderModal

        isOpen={showDelete}

        purchaseOrder={selectedPurchaseOrder}

        onClose={() => {

          setShowDelete(false);

          setSelectedPurchaseOrder(null);

        }}

        onSuccess={async () => {

          setShowDelete(false);

          setSelectedPurchaseOrder(null);

          await refreshPage();

        }}

      />

    </Layout>

  );

};

export default PurchaseOrders;
