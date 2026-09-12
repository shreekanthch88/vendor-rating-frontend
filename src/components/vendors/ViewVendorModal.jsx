import { useState, useEffect, useCallback } from "react";
import VendorUsersTab from "./VendorUsersTab";
import GenerateVendorRatingModal from "./GenerateVendorRatingModal";
import ViewPurchaseOrderModal from "../purchaseOrder/ViewPurchaseOrderModal";
import VendorRatingEvaluationModal from "../vendorRating/VendorRatingEvaluationModal";
import VendorRatingStatusBadge from "../vendorRating/VendorRatingStatusBadge";

import {
  getLatestVendorRating,
  getVendorRatings,
} from "../../services/vendorRatingService";
import { getAllPurchaseOrders } from "../../services/purchaseOrderService";

import {
  Building2,
  BarChart3,
  ShoppingCart,
  Users,
  Star,
  FileText,
  X,
  Search,
  Calendar,
  Sparkles,
  Eye,
  Pencil,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Package,
} from "lucide-react";

const tabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "purchaseOrders", label: "Purchase Orders", icon: ShoppingCart },
  { id: "users", label: "Users", icon: Users },
  { id: "ratings", label: "Ratings", icon: Star },
  { id: "documents", label: "Documents", icon: FileText },
];

const ViewVendorModal = ({ isOpen, vendor, onClose }) => {
  const [activeTab, setActiveTab] = useState("company");

  // Performance & Ratings state
  const [latestRating, setLatestRating] = useState(null);
  const [ratingsList, setRatingsList] = useState([]);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingsListLoading, setRatingsListLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedRatingForEvaluation, setSelectedRatingForEvaluation] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Purchase Orders state
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poLoading, setPoLoading] = useState(false);
  const [poSearch, setPoSearch] = useState("");
  const [poStatusFilter, setPoStatusFilter] = useState("");
  const [selectedPO, setSelectedPO] = useState(null);
  const [showPOModal, setShowPOModal] = useState(false);

  // Load live data for vendor
  const loadPerformanceData = useCallback(async () => {
    if (!vendor?._id) return;
    try {
      setRatingLoading(true);
      const res = await getLatestVendorRating(vendor._id);
      setLatestRating(res.data || null);
    } catch (err) {
      // 404 means no rating generated yet, normal
      setLatestRating(null);
    } finally {
      setRatingLoading(false);
    }
  }, [vendor]);

  const loadRatingsList = useCallback(async () => {
    if (!vendor?._id) return;
    try {
      setRatingsListLoading(true);
      const res = await getVendorRatings({ vendorId: vendor._id, limit: 50 });
      setRatingsList(res.data?.ratings || []);
    } catch (err) {
      console.error("Error loading vendor ratings list:", err);
      setRatingsList([]);
    } finally {
      setRatingsListLoading(false);
    }
  }, [vendor]);

  const loadPurchaseOrders = useCallback(async () => {
    if (!vendor?._id) return;
    try {
      setPoLoading(true);
      const res = await getAllPurchaseOrders(
        1,
        100,
        poSearch,
        poStatusFilter,
        vendor._id
      );
      setPurchaseOrders(res.purchaseOrders || []);
    } catch (err) {
      console.error("Error loading vendor POs:", err);
      setPurchaseOrders([]);
    } finally {
      setPoLoading(false);
    }
  }, [vendor, poSearch, poStatusFilter]);

  useEffect(() => {
    if (isOpen && vendor?._id) {
      loadPerformanceData();
      loadRatingsList();
      loadPurchaseOrders();
    }
  }, [isOpen, vendor, loadPerformanceData, loadRatingsList, loadPurchaseOrders]);

  if (!isOpen || !vendor) return null;

  /* =========================================================================
     Calculations & Formatters
  ========================================================================= */

  const totalPOAmount = purchaseOrders.reduce(
    (sum, po) => sum + Number(po.grandTotal || 0),
    0
  );

  const completedPOCount = purchaseOrders.filter((po) =>
    ["Completed", "Delivered", "Fulfilled"].includes(po.status)
  ).length;

  const openPOCount = purchaseOrders.filter((po) =>
    ["Draft", "Submitted", "Approved", "Sent", "Accepted"].includes(po.status)
  ).length;

  const cancelledPOCount = purchaseOrders.filter((po) =>
    ["Cancelled", "Rejected"].includes(po.status)
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const getScoreColor = (score) => {
    const val = Number(score || 0);
    if (val >= 85) return "text-green-600";
    if (val >= 70) return "text-blue-600";
    if (val >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    const val = Number(score || 0);
    if (val >= 85) return "bg-green-600";
    if (val >= 70) return "bg-blue-600";
    if (val >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPOStatusBadge = (status) => {
    const styles = {
      Draft: "bg-gray-100 text-gray-700 border-gray-200",
      Submitted: "bg-blue-50 text-blue-700 border-blue-200",
      Approved: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Sent: "bg-purple-50 text-purple-700 border-purple-200",
      Accepted: "bg-teal-50 text-teal-700 border-teal-200",
      Delivered: "bg-green-50 text-green-700 border-green-200",
      Completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  // Helper Cards
  const InfoCard = ({ label, value }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-gray-900 break-all">
        {value || "—"}
      </p>
    </div>
  );

  const PerformanceCard = ({ title, value, subtitle }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );

  const ScoreCard = ({ title, score, weight, remarks }) => {
    const hasScore = score !== null && score !== undefined && score !== "";
    const numVal = hasScore ? Number(score) : null;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            {weight !== undefined && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                Weight: {weight}%
              </span>
            )}
          </div>

          <div className="my-4 text-center">
            {hasScore ? (
              <div className={`text-4xl font-extrabold ${getScoreColor(numVal)}`}>
                {numVal.toFixed(1)}
                <span className="text-xs font-normal text-gray-400 ml-1">/100</span>
              </div>
            ) : (
              <div className="text-2xl font-semibold text-gray-400 py-2">
                N/A
              </div>
            )}
          </div>

          {hasScore && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreBg(numVal)}`}
                style={{ width: `${Math.min(numVal, 100)}%` }}
              />
            </div>
          )}
        </div>

        {remarks && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2 border-t pt-2" title={remarks}>
            {remarks}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex h-[92vh] w-[96%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ================= Header ================= */}
        <div className="flex items-center justify-between border-b bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {vendor.vendorName}
              </h2>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                  vendor.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : vendor.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : vendor.status === "Blacklisted"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {vendor.status}
              </span>
              {latestRating?.ratingCategory && (
                <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-0.5 text-xs font-semibold">
                  ★ {latestRating.ratingCategory}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Vendor Code:{" "}
              <span className="font-semibold text-gray-700">{vendor.vendorCode}</span>
              {" • "}Category: <span className="font-medium text-gray-700">{vendor.vendorCategory}</span>
              {" • "}Type: <span className="font-medium text-gray-700">{vendor.businessType}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-700 px-3.5 py-2 text-xs font-semibold hover:bg-blue-100 transition"
            >
              <Sparkles size={15} />
              Evaluate Rating
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= Tabs ================= */}
        <div className="border-b bg-gray-50/80 px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? "border-blue-600 bg-white text-blue-600 shadow-sm"
                      : "border-transparent text-gray-600 hover:bg-gray-100/70 hover:text-gray-900"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                  {tab.id === "purchaseOrders" && purchaseOrders.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-blue-100 text-blue-700 px-2 py-0.2 text-xs font-semibold">
                      {purchaseOrders.length}
                    </span>
                  )}
                  {tab.id === "ratings" && ratingsList.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-amber-100 text-amber-800 px-2 py-0.2 text-xs font-semibold">
                      {ratingsList.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= Tab Content ================= */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {/* ================================================================
              1. COMPANY TAB
          ================================================================ */}
          {activeTab === "company" && (
            <div className="space-y-6">
              {/* Company Information */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50/50 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Company Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard label="Vendor Code" value={vendor.vendorCode} />
                  <InfoCard label="Vendor Name" value={vendor.vendorName} />
                  <InfoCard label="Vendor Category" value={vendor.vendorCategory} />
                  <InfoCard label="Business Type" value={vendor.businessType} />
                  <InfoCard label="Status" value={vendor.status} />
                  <InfoCard label="Description" value={vendor.description} />
                </div>
              </div>

              {/* Compliance */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50/50 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Compliance Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard label="GST Number" value={vendor.gstNumber} />
                  <InfoCard label="PAN Number" value={vendor.panNumber} />
                  <InfoCard label="MSME Number" value={vendor.msmeNumber} />
                  <InfoCard label="CIN Number" value={vendor.cinNumber} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50/50 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard label="Contact Person" value={vendor.contactPerson} />
                  <InfoCard label="Designation" value={vendor.designation} />
                  <InfoCard label="Email" value={vendor.email} />
                  <InfoCard label="Mobile" value={vendor.mobile} />
                  <InfoCard label="Alternate Mobile" value={vendor.alternateMobile} />
                  <InfoCard label="Website" value={vendor.website} />
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50/50 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Registered Address
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard label="Address Line 1" value={vendor.address?.line1} />
                  <InfoCard label="Address Line 2" value={vendor.address?.line2} />
                  <InfoCard label="City" value={vendor.address?.city} />
                  <InfoCard label="District" value={vendor.address?.district} />
                  <InfoCard label="State" value={vendor.address?.state} />
                  <InfoCard label="Country" value={vendor.address?.country} />
                  <InfoCard label="Pincode" value={vendor.address?.pincode} />
                </div>
              </div>

              {/* Bank Details */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-gray-50/50 px-6 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Bank Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard label="Bank Name" value={vendor.bankDetails?.bankName} />
                  <InfoCard label="Account Holder" value={vendor.bankDetails?.accountHolder} />
                  <InfoCard label="Account Number" value={vendor.bankDetails?.accountNumber} />
                  <InfoCard label="IFSC Code" value={vendor.bankDetails?.ifscCode} />
                  <InfoCard label="Branch" value={vendor.bankDetails?.branch} />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              2. PERFORMANCE TAB
          ================================================================ */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              {/* Order Transaction Metrics */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  title="Total Orders"
                  value={purchaseOrders.length}
                  subtitle="Purchase orders issued"
                />
                <PerformanceCard
                  title="Completed Orders"
                  value={completedPOCount}
                  subtitle="Delivered & fulfilled"
                />
                <PerformanceCard
                  title="Open Orders"
                  value={openPOCount}
                  subtitle="Active in procurement pipeline"
                />
                <PerformanceCard
                  title="Overall Performance Score"
                  value={
                    latestRating?.finalOverallScore !== undefined && latestRating?.finalOverallScore !== null
                      ? `${latestRating.finalOverallScore.toFixed(1)} / 100`
                      : "Not Evaluated"
                  }
                  subtitle={
                    latestRating?.ratingCategory
                      ? `Status: ${latestRating.ratingCategory}`
                      : "Generate evaluation to compute"
                  }
                />
              </div>

              {/* Overall Score Highlight Banner */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-white shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <div>
                    <span className="rounded-full bg-blue-800/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Overall Vendor Rating Score
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold">
                      {vendor.vendorName}
                    </h2>
                    <p className="mt-1 text-sm text-blue-200">
                      {latestRating?.evaluationPeriod
                        ? `Evaluation Period: ${formatDate(latestRating.evaluationPeriod.fromDate)} — ${formatDate(latestRating.evaluationPeriod.toDate)}`
                        : "No evaluation snapshot recorded yet"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-6xl font-black text-white">
                        {latestRating?.finalOverallScore !== undefined && latestRating?.finalOverallScore !== null
                          ? latestRating.finalOverallScore.toFixed(1)
                          : "0"}
                      </div>
                      <div className="mt-1 text-xs font-medium text-blue-200">
                        Score / 100
                      </div>
                    </div>

                    <div className="border-l border-blue-700/60 pl-6 space-y-2">
                      <div>
                        <span className="text-xs text-blue-300">Category:</span>
                        <div className="text-sm font-bold text-yellow-400">
                          {latestRating?.ratingCategory || "Pending Evaluation"}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-blue-300">Status:</span>
                        <div className="text-sm font-semibold">
                          <VendorRatingStatusBadge status={latestRating?.status || "Draft"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8 Weighted Performance Parameters */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50/50">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Parameter Score Breakdown
                    </h3>
                    <p className="text-xs text-gray-500">
                      Live scores calculated by the 8-parameter evaluation algorithm
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
                  >
                    <Sparkles size={14} />
                    Recalculate Rating
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <ScoreCard
                    title="Delivery Performance"
                    score={latestRating?.delivery?.finalScore}
                    weight={latestRating?.delivery?.weight ?? 30}
                    remarks={latestRating?.delivery?.remarks}
                  />

                  <ScoreCard
                    title="Quality Performance"
                    score={latestRating?.quality?.finalScore}
                    weight={latestRating?.quality?.weight ?? 25}
                    remarks={latestRating?.quality?.remarks}
                  />

                  <ScoreCard
                    title="Order Fulfillment"
                    score={latestRating?.fulfillment?.finalScore}
                    weight={latestRating?.fulfillment?.weight ?? 15}
                    remarks={latestRating?.fulfillment?.remarks}
                  />

                  <ScoreCard
                    title="Price Competitiveness"
                    score={latestRating?.price?.finalScore}
                    weight={latestRating?.price?.weight ?? 10}
                    remarks={latestRating?.price?.remarks}
                  />

                  <ScoreCard
                    title="Response Time"
                    score={latestRating?.responseTime?.finalScore}
                    weight={latestRating?.responseTime?.weight ?? 5}
                    remarks={latestRating?.responseTime?.remarks}
                  />

                  <ScoreCard
                    title="PO Acceptance"
                    score={latestRating?.poAcceptance?.finalScore}
                    weight={latestRating?.poAcceptance?.weight ?? 5}
                    remarks={latestRating?.poAcceptance?.remarks}
                  />

                  <ScoreCard
                    title="Documentation"
                    score={latestRating?.documentation?.finalScore}
                    weight={latestRating?.documentation?.weight ?? 5}
                    remarks={latestRating?.documentation?.remarks}
                  />

                  <ScoreCard
                    title="Communication"
                    score={latestRating?.communication?.finalScore}
                    weight={latestRating?.communication?.weight ?? 5}
                    remarks={latestRating?.communication?.remarks}
                  />
                </div>
              </div>

              {!latestRating && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-6 text-center">
                  <AlertTriangle className="mx-auto text-yellow-600 mb-2" size={28} />
                  <h4 className="font-semibold text-yellow-900">
                    No Rating Evaluation Found for this Vendor
                  </h4>
                  <p className="mt-1 text-xs text-yellow-800 max-w-md mx-auto">
                    Click the button below to generate the initial performance evaluation using all past transaction records.
                  </p>
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-yellow-700 transition"
                  >
                    <Sparkles size={16} />
                    Generate Evaluation Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              3. PURCHASE ORDERS TAB
          ================================================================ */}
          {activeTab === "purchaseOrders" && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  title="Total Orders"
                  value={purchaseOrders.length}
                  subtitle="Total POs issued"
                />
                <PerformanceCard
                  title="Open Orders"
                  value={openPOCount}
                  subtitle="In draft, approved or sent"
                />
                <PerformanceCard
                  title="Completed Orders"
                  value={completedPOCount}
                  subtitle="Delivered and closed"
                />
                <PerformanceCard
                  title="Total Purchase Spend"
                  value={formatCurrency(totalPOAmount)}
                  subtitle="Cumulative PO value"
                />
              </div>

              {/* Filters */}
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search Purchase Order by PO Number..."
                      value={poSearch}
                      onChange={(e) => setPoSearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={poStatusFilter}
                      onChange={(e) => setPoStatusFilter(e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={loadPurchaseOrders}
                      title="Refresh Purchase Orders"
                      className="rounded-lg border border-gray-300 p-2.5 text-gray-600 hover:bg-gray-100 transition"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          PO Number
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Order Date
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Expected Date
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Items
                        </th>
                        <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Grand Total
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white text-sm">
                      {poLoading ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                              <span>Loading Purchase Orders...</span>
                            </div>
                          </td>
                        </tr>
                      ) : purchaseOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-gray-400">
                            No Purchase Orders found for this vendor.
                          </td>
                        </tr>
                      ) : (
                        purchaseOrders.map((po) => (
                          <tr key={po._id} className="hover:bg-gray-50/70 transition">
                            <td className="px-5 py-4 font-bold text-blue-700">
                              {po.poNumber}
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {formatDate(po.orderDate || po.createdAt)}
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {formatDate(po.expectedDeliveryDate)}
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {po.items?.length || 0} item(s)
                            </td>
                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                              {formatCurrency(po.grandTotal)}
                            </td>
                            <td className="px-5 py-4 text-center">
                              {getPOStatusBadge(po.status)}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedPO(po);
                                  setShowPOModal(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                              >
                                <Eye size={14} />
                                View PO
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              4. USERS TAB
          ================================================================ */}
          {activeTab === "users" && <VendorUsersTab vendor={vendor} />}

          {/* ================================================================
              5. RATINGS TAB
          ================================================================ */}
          {activeTab === "ratings" && (
            <div className="space-y-6">
              {/* Header with Evaluate Action */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Vendor Rating Evaluations
                  </h2>
                  <p className="text-xs text-gray-500">
                    Historical evaluation snapshots and assessment scores
                  </p>
                </div>

                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                >
                  <Sparkles size={16} />
                  Generate New Rating
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  title="Total Evaluations"
                  value={ratingsList.length}
                  subtitle="Recorded rating snapshots"
                />
                <PerformanceCard
                  title="Latest Final Score"
                  value={
                    latestRating?.finalOverallScore !== undefined && latestRating?.finalOverallScore !== null
                      ? `${latestRating.finalOverallScore.toFixed(1)} / 100`
                      : "—"
                  }
                  subtitle={latestRating?.ratingCategory || "Not Evaluated"}
                />
                <PerformanceCard
                  title="Latest Evaluation Status"
                  value={latestRating?.status || "None"}
                  subtitle={
                    latestRating?.evaluationPeriod
                      ? `Period: ${formatDate(latestRating.evaluationPeriod.fromDate)} — ${formatDate(latestRating.evaluationPeriod.toDate)}`
                      : "No evaluations"
                  }
                />
                <PerformanceCard
                  title="Evaluator Review"
                  value={
                    latestRating?.evaluatorOverallScore !== null && latestRating?.evaluatorOverallScore !== undefined
                      ? `${latestRating.evaluatorOverallScore.toFixed(1)} / 100`
                      : "System Only"
                  }
                  subtitle={
                    latestRating?.evaluatedBy?.name
                      ? `By ${latestRating.evaluatedBy.name}`
                      : "Pending evaluator input"
                  }
                />
              </div>

              {/* Ratings List Table */}
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Evaluation Period
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          System Score
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Evaluator Score
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Final Score
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Category
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Evaluated Date
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white text-sm">
                      {ratingsListLoading ? (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                              <span>Loading ratings...</span>
                            </div>
                          </td>
                        </tr>
                      ) : ratingsList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-gray-400">
                            No rating evaluations recorded yet. Click "Generate New Rating" to create one.
                          </td>
                        </tr>
                      ) : (
                        ratingsList.map((rating) => (
                          <tr key={rating._id} className="hover:bg-gray-50/70 transition">
                            <td className="px-5 py-4 font-medium text-gray-900">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                <span>
                                  {formatDate(rating.evaluationPeriod?.fromDate)} — {formatDate(rating.evaluationPeriod?.toDate)}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-gray-700">
                              {rating.systemOverallScore !== null && rating.systemOverallScore !== undefined
                                ? `${rating.systemOverallScore.toFixed(1)}/100`
                                : "—"}
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-gray-700">
                              {rating.evaluatorOverallScore !== null && rating.evaluatorOverallScore !== undefined
                                ? `${rating.evaluatorOverallScore.toFixed(1)}/100`
                                : "—"}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`text-base font-bold ${getScoreColor(
                                  rating.finalOverallScore
                                )}`}
                              >
                                {rating.finalOverallScore !== null && rating.finalOverallScore !== undefined
                                  ? `${rating.finalOverallScore.toFixed(1)}`
                                  : "0"}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                {rating.ratingCategory || "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <VendorRatingStatusBadge status={rating.status} />
                            </td>

                            <td className="px-5 py-4 text-gray-600 text-xs">
                              {formatDate(rating.createdAt)}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedRatingForEvaluation(rating);
                                    setShowEvaluationModal(true);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                                >
                                  <Pencil size={13} />
                                  Evaluate
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              6. DOCUMENTS TAB
          ================================================================ */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Vendor Compliance & Documents
                </h3>
                <p className="text-xs text-gray-500">
                  Official certificates and statutory verification details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* GST Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                      <FileCheck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">GST Registration</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Goods and Services Tax</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {vendor.gstNumber || "Not Provided"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      vendor.gstNumber ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendor.gstNumber ? "Registered" : "Pending"}
                  </span>
                </div>

                {/* PAN Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">PAN Card</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Permanent Account Number</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {vendor.panNumber || "Not Provided"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      vendor.panNumber ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendor.panNumber ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* MSME Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">MSME / Udyam</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Micro, Small & Medium Enterprise</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {vendor.msmeNumber || "Not Registered"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      vendor.msmeNumber ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendor.msmeNumber ? "Active" : "N/A"}
                  </span>
                </div>

                {/* CIN Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">CIN Number</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Corporate Identification Number</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {vendor.cinNumber || "Not Provided"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      vendor.cinNumber ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendor.cinNumber ? "Active" : "N/A"}
                  </span>
                </div>
              </div>

              {/* Bank Proof Section */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4">Bank Account & Settlement Information</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {vendor.bankDetails?.bankName || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {vendor.bankDetails?.accountNumber || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {vendor.bankDetails?.ifscCode || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Vendor Rating Modal */}
      <GenerateVendorRatingModal
        isOpen={showGenerateModal}
        vendor={vendor}
        onClose={() => setShowGenerateModal(false)}
        onSuccess={() => {
          setShowGenerateModal(false);
          loadPerformanceData();
          loadRatingsList();
        }}
      />

      {/* Purchase Order View Modal */}
      {selectedPO && (
        <ViewPurchaseOrderModal
          isOpen={showPOModal}
          purchaseOrder={selectedPO}
          onClose={() => {
            setShowPOModal(false);
            setSelectedPO(null);
          }}
        />
      )}

      {/* Evaluator Modal */}
      {selectedRatingForEvaluation && (
        <VendorRatingEvaluationModal
          isOpen={showEvaluationModal}
          rating={selectedRatingForEvaluation}
          onClose={() => {
            setShowEvaluationModal(false);
            setSelectedRatingForEvaluation(null);
          }}
          onSuccess={() => {
            setShowEvaluationModal(false);
            setSelectedRatingForEvaluation(null);
            loadPerformanceData();
            loadRatingsList();
          }}
        />
      )}
    </div>
  );
};

export default ViewVendorModal;