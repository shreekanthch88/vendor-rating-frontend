import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PurchaseOrderSummaryCards from "../../components/vendor/purchase-orders/PurchaseOrderSummaryCards";
import PurchaseOrderFilters from "../../components/vendor/purchase-orders/PurchaseOrderFilters";
import PurchaseOrderTable from "../../components/vendor/purchase-orders/PurchaseOrderTable";

import {
  getVendorPurchaseOrders,
} from "../../services/vendorPurchaseOrderService";

const VendorPurchaseOrders = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [purchaseOrders, setPurchaseOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const limit = 10;

  // =====================================================
  // LOAD PURCHASE ORDERS
  // =====================================================

  const loadPurchaseOrders = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await getVendorPurchaseOrders({
            page,
            limit,
            search,
            status,
          });

        console.log(
          "Vendor Purchase Orders Response:",
          response
        );

        const orders =
          Array.isArray(
            response?.purchaseOrders
          )
            ? response.purchaseOrders
            : [];

        setPurchaseOrders(orders);

        setTotal(
          Number(response?.total || 0)
        );

        setPages(
          Number(response?.pages || 0)
        );
      } catch (error) {
        console.error(
          "Vendor Purchase Orders Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load purchase orders.";

        toast.error(message);

        setPurchaseOrders([]);
        setTotal(0);
        setPages(0);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      search,
      status,
    ]
  );

  // =====================================================
  // LOAD WHEN PAGE / SEARCH / FILTER CHANGES
  // =====================================================

  useEffect(() => {
    loadPurchaseOrders();
  }, [loadPurchaseOrders]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // =====================================================
  // STATUS FILTER
  // =====================================================

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    loadPurchaseOrders();
  };

  // =====================================================
  // OPEN PURCHASE ORDER DETAILS
  // =====================================================

  const handleViewPurchaseOrder = (purchaseOrder) => {
    if (!purchaseOrder) {
      toast.error(
        "Purchase Order information is missing."
      );

      return;
    }

    /*
     * IMPORTANT
     *
     * MongoDB normally returns:
     *
     * purchaseOrder._id
     *
     * This is the ID required by:
     *
     * GET /api/vendor/purchase-orders/:id
     */

    const purchaseOrderId =
      purchaseOrder._id ||
      purchaseOrder.id;

    if (!purchaseOrderId) {
      console.error(
        "Purchase Order ID missing:",
        purchaseOrder
      );

      toast.error(
        "Purchase Order ID is missing."
      );

      return;
    }

    console.log(
      "Opening Purchase Order:",
      purchaseOrderId
    );

    navigate(
      `/vendor/purchase-orders/${purchaseOrderId}`
    );
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pages
    ) {
      return;
    }

    setPage(newPage);
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    return {
      total,

      sent: purchaseOrders.filter(
        (po) =>
          po.status === "Sent"
      ).length,

      accepted: purchaseOrders.filter(
        (po) =>
          po.status === "Accepted"
      ).length,

      rejected: purchaseOrders.filter(
        (po) =>
          po.status === "Rejected"
      ).length,

      delivered:
        purchaseOrders.filter(
          (po) =>
            po.status === "Delivered"
        ).length,
    };
  }, [
    purchaseOrders,
    total,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
          ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Purchase Orders
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage purchase orders received
          from the organization.
        </p>
      </div>

      {/* =================================================
          SUMMARY CARDS
          ================================================= */}

      <PurchaseOrderSummaryCards
        total={summary.total}
        sent={summary.sent}
        accepted={summary.accepted}
        rejected={summary.rejected}
        delivered={summary.delivered}
      />

      {/* =================================================
          FILTERS
          ================================================= */}

      <PurchaseOrderFilters
        search={search}
        status={status}
        onSearchChange={
          handleSearchChange
        }
        onStatusChange={
          handleStatusChange
        }
        onReset={handleReset}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* =================================================
          TABLE
          ================================================= */}

      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
        loading={loading}
        page={page}
        pages={pages}
        total={total}
        onView={handleViewPurchaseOrder}
        onPageChange={
          handlePageChange
        }
      />

    </div>
  );
};

export default VendorPurchaseOrders;