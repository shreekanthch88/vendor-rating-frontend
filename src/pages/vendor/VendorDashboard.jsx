import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useVendorAuth } from "../../context/VendorAuthContext";

import {
  getVendorPurchaseOrders,
} from "../../services/vendorPurchaseOrderService";

import {
  getVendorRatingDashboard,
} from "../../services/vendorRatingService";


const VendorDashboard = () => {

  const navigate = useNavigate();

  const {
    vendorUser,
    vendorProfile,
    loading: authLoading,
  } = useVendorAuth();


  // =========================================================
  // STATE
  // =========================================================

  const [purchaseOrders, setPurchaseOrders] =
    useState([]);

  const [ratingDashboard, setRatingDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboard = useCallback(
    async () => {

      if (
        authLoading ||
        !vendorUser
      ) {
        return;
      }

      try {

        setLoading(true);

        /*
         * IMPORTANT:
         *
         * We do NOT send a vendorId here.
         *
         * Backend identifies the vendor from
         * authenticated req.user.vendor.
         */

        const [
          purchaseOrderResponse,
          ratingResponse,
        ] = await Promise.all([

          getVendorPurchaseOrders({
            page: 1,
            limit: 10,
          }),

          getVendorRatingDashboard(
            vendorProfile?._id
          ),

        ]);


        // ===================================================
        // PURCHASE ORDERS
        // ===================================================

        const orders =
          Array.isArray(
            purchaseOrderResponse?.purchaseOrders
          )
            ? purchaseOrderResponse.purchaseOrders
            : [];

        setPurchaseOrders(
          orders
        );


        // ===================================================
        // RATING
        // ===================================================

        /*
         * Backend service returns:
         *
         * {
         *   success: true,
         *   data: {...}
         * }
         */

        setRatingDashboard(
          ratingResponse?.data || null
        );


      } catch (error) {

        console.error(
          "Vendor Dashboard Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load vendor dashboard.";

        toast.error(
          message
        );

      } finally {

        setLoading(false);

      }

    },
    [
      authLoading,
      vendorUser,
      vendorProfile,
    ]
  );


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadDashboard();

  }, [
    loadDashboard,
  ]);


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {

    try {

      setRefreshing(true);

      await loadDashboard();

    } finally {

      setRefreshing(false);

    }
  };


  // =========================================================
  // VENDOR INFORMATION
  // =========================================================

  const vendorName =
    vendorProfile?.vendorName ||
    "Vendor";

  const vendorCode =
    vendorProfile?.vendorCode ||
    "-";

  const vendorCategory =
    vendorProfile?.vendorCategory ||
    "-";


  // =========================================================
  // PURCHASE ORDER CALCULATIONS
  // =========================================================

  const totalPOs =
    Number(
      purchaseOrderCountFallback(
        purchaseOrders
      )
    );


  const activePOs =
    purchaseOrders.filter(
      (po) =>
        [
          "Sent",
          "Accepted",
          "Partially Dispatched",
          "Dispatched",
          "In Transit",
        ].includes(
          po.status
        )
    ).length;


  const pendingAcceptance =
    purchaseOrders.filter(
      (po) =>
        po.status === "Sent"
    ).length;


  const completedPOs =
    purchaseOrders.filter(
      (po) =>
        [
          "Delivered",
          "Closed",
        ].includes(
          po.status
        )
    ).length;


  const totalOrderValue =
    purchaseOrders.reduce(
      (
        total,
        po
      ) =>
        total +
        Number(
          po.totalAmount || 0
        ),
      0
    );


  // =========================================================
  // RATING DATA
  // =========================================================

  const hasRating =
    ratingDashboard?.hasRating === true;


  const overallScore =
    hasRating
      ? Number(
          ratingDashboard?.overallScore || 0
        )
      : null;


  const systemScore =
    hasRating
      ? Number(
          ratingDashboard?.systemOverallScore || 0
        )
      : null;


  const evaluatorScore =
    hasRating
      ? ratingDashboard?.evaluatorOverallScore
      : null;


  const ratingCategory =
    hasRating
      ? ratingDashboard?.ratingCategory
      : null;


  // =========================================================
  // RATING PARAMETERS
  // =========================================================

  const ratingParameters =
    hasRating
      ? Object.entries(
          ratingDashboard?.parameters || {}
        )
      : [];


  // =========================================================
  // RATING BAR
  // =========================================================

  const getRatingBarClass = (
    score
  ) => {

    const value =
      Number(score || 0);

    if (value >= 85) {
      return "bg-emerald-500";
    }

    if (value >= 70) {
      return "bg-blue-500";
    }

    if (value >= 50) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };


  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =========================================================
  // CURRENCY
  // =========================================================

  const formatCurrency = (
    amount
  ) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(amount || 0)
    );

  };


  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "Accepted":
        return "bg-emerald-50 text-emerald-700";

      case "Delivered":
      case "Closed":
        return "bg-blue-50 text-blue-700";

      case "Sent":
        return "bg-amber-50 text-amber-700";

      case "Rejected":
        return "bg-red-50 text-red-700";

      case "Dispatched":
      case "In Transit":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    authLoading ||
    loading
  ) {

    return (

      <div className="flex min-h-[600px] items-center justify-center">

        <div className="flex flex-col items-center gap-3">

          <RefreshCw
            size={30}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading your vendor dashboard...
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="space-y-8">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium text-blue-600">
            Vendor Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Welcome, {vendorUser?.name || vendorName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's an overview of your procurement
            activities and vendor performance.
          </p>

        </div>


        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* =====================================================
          VENDOR IDENTITY
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Vendor Account
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              {vendorName}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

              <span>
                Code:
                <strong className="ml-1 text-slate-700">
                  {vendorCode}
                </strong>
              </span>

              <span>
                Category:
                <strong className="ml-1 text-slate-700">
                  {vendorCategory}
                </strong>
              </span>

            </div>

          </div>


          <div className="rounded-xl bg-blue-50 px-5 py-4">

            <p className="text-xs font-medium text-blue-600">
              Account Status
            </p>

            <p className="mt-1 text-lg font-bold text-blue-800">
              {vendorProfile?.status || "-"}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
          ===================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <DashboardMetric
          title="Total Purchase Orders"
          value={totalPOs}
          icon={ShoppingCart}
          description="Your purchase orders"
        />

        <DashboardMetric
          title="Active Orders"
          value={activePOs}
          icon={Activity}
          description="Currently in progress"
        />

        <DashboardMetric
          title="Pending Acceptance"
          value={pendingAcceptance}
          icon={Clock3}
          description="Awaiting your response"
        />

        <DashboardMetric
          title="Completed Orders"
          value={completedPOs}
          icon={CheckCircle2}
          description="Delivered / closed"
        />

      </div>


      {/* =====================================================
          RATING + ORDER VALUE
          ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Rating */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-500">
                Vendor Rating
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Performance Scorecard
              </h2>

            </div>

            <Star
              size={25}
              className="text-amber-500"
              fill="currentColor"
            />

          </div>


          {!hasRating ? (

            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

              <Star
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No vendor rating available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your rating will appear here once an
                evaluation has been generated.
              </p>

            </div>

          ) : (

            <div className="mt-6">

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Overall */}

                <div className="rounded-2xl bg-slate-50 p-5 text-center">

                  <p className="text-sm text-slate-500">
                    Overall Rating
                  </p>

                  <p className="mt-2 text-5xl font-bold text-blue-600">
                    {overallScore?.toFixed(1)}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    / 100
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {ratingCategory || "Not Rated"}
                  </div>

                </div>


                {/* System */}

                <div className="rounded-2xl border border-slate-200 p-5">

                  <p className="text-sm text-slate-500">
                    System Score
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-800">
                    {systemScore !== null
                      ? systemScore.toFixed(1)
                      : "N/A"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Automatically calculated
                  </p>

                </div>


                {/* Evaluator */}

                <div className="rounded-2xl border border-slate-200 p-5">

                  <p className="text-sm text-slate-500">
                    Evaluator Score
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-800">
                    {evaluatorScore !== null &&
                    evaluatorScore !== undefined
                      ? Number(
                          evaluatorScore
                        ).toFixed(1)
                      : "N/A"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Human evaluation
                  </p>

                </div>

              </div>


              {/* Parameters */}

              {ratingParameters.length > 0 && (

                <div className="mt-7">

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="font-semibold text-slate-800">
                      Rating Parameters
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/vendor/performance"
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </button>

                  </div>


                  <div className="space-y-4">

                    {ratingParameters.map(
                      ([
                        name,
                        parameter,
                      ]) => {

                        const score =
                          parameter?.score;

                        const weight =
                          parameter?.weight;

                        return (

                          <div
                            key={name}
                          >

                            <div className="mb-1.5 flex items-center justify-between text-sm">

                              <span className="font-medium capitalize text-slate-700">
                                {formatParameterName(
                                  name
                                )}
                              </span>

                              <span className="text-slate-500">
                                {score !== null &&
                                score !== undefined
                                  ? Number(
                                      score
                                    ).toFixed(1)
                                  : "N/A"}

                                {" "}
                                <span className="text-xs text-slate-400">
                                  ({weight}%)
                                </span>

                              </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className={`h-full rounded-full ${getRatingBarClass(
                                  score
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      Number(
                                        score || 0
                                      )
                                    )
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>


        {/* Order Value */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-500">
                Purchase Order Value
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Current View
              </h2>

            </div>

            <Package
              size={25}
              className="text-blue-600"
            />

          </div>


          <div className="mt-8">

            <p className="text-3xl font-bold text-slate-800">
              {formatCurrency(
                totalOrderValue
              )}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Based on the latest vendor purchase
              orders returned by the backend.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/vendor/purchase-orders"
              )
            }
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Purchase Orders
            <ArrowRight size={17} />
          </button>

        </div>

      </div>


      {/* =====================================================
          RECENT PURCHASE ORDERS
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-slate-500">
              Procurement Activity
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Recent Purchase Orders
            </h2>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/vendor/purchase-orders"
              )
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight size={16} />
          </button>

        </div>


        {purchaseOrders.length === 0 ? (

          <div className="p-10 text-center">

            <ShoppingCart
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              No purchase orders found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Purchase orders assigned to this vendor
              will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    PO Number
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Expected Delivery
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {purchaseOrders
                  .slice(0, 5)
                  .map(
                    (po) => (

                      <tr
                        key={po._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/vendor/purchase-orders/${po._id}`
                              )
                            }
                            className="font-semibold text-blue-600 hover:text-blue-700"
                          >
                            {po.poNumber || "-"}
                          </button>

                        </td>


                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(
                            po.orderDate ||
                            po.createdAt
                          )}
                        </td>


                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(
                            po.expectedDeliveryDate
                          )}
                        </td>


                        <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">
                          {formatCurrency(
                            po.totalAmount
                          )}
                        </td>


                        <td className="px-6 py-4 text-center">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              po.status
                            )}`}
                          >
                            {po.status || "-"}
                          </span>

                        </td>


                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/vendor/purchase-orders/${po._id}`
                              )
                            }
                            className="text-slate-400 hover:text-blue-600"
                          >

                            <ArrowRight
                              size={18}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <QuickAction
          icon={ShoppingCart}
          title="Purchase Orders"
          description="View and manage your POs"
          onClick={() =>
            navigate(
              "/vendor/purchase-orders"
            )
          }
        />

        <QuickAction
          icon={Truck}
          title="Dispatches"
          description="Manage material dispatches"
          onClick={() =>
            navigate(
              "/vendor/dispatches"
            )
          }
        />

        <QuickAction
          icon={BarChart3}
          title="Performance"
          description="View your complete rating"
          onClick={() =>
            navigate(
              "/vendor/performance"
            )
          }
        />

      </div>

    </div>

  );

};


// =========================================================
// DASHBOARD METRIC
// =========================================================

const DashboardMetric = ({
  title,
  value,
  icon: Icon,
  description,
}) => {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>


        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon size={21} />

        </div>

      </div>

    </div>

  );

};


// =========================================================
// QUICK ACTION
// =========================================================

const QuickAction = ({
  icon: Icon,
  title,
  description,
  onClick,
}) => {

  return (

    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon size={21} />

        </div>


        <div>

          <p className="font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>


        <ArrowRight
          size={18}
          className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
        />

      </div>

    </button>

  );

};


// =========================================================
// HELPERS
// =========================================================

const formatParameterName = (
  name
) => {

  const names = {

    delivery:
      "Delivery Performance",

    quality:
      "Quality Performance",

    fulfillment:
      "Order Fulfillment",

    price:
      "Price Competitiveness",

    responseTime:
      "Response Time",

    poAcceptance:
      "PO Acceptance",

    documentation:
      "Documentation",

    communication:
      "Communication",

  };

  return (
    names[name] ||
    name
      .replace(
        /([A-Z])/g,
        " $1"
      )
      .replace(
        /^./,
        (char) =>
          char.toUpperCase()
      )
  );

};


const purchaseOrderCountFallback = (
  orders
) => {

  return Array.isArray(
    orders
  )
    ? orders.length
    : 0;

};


export default VendorDashboard;