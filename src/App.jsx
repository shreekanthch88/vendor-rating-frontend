import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==================================================
// ADMIN PAGES
import PortalGateway from "./pages/PortalGateway";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Vendors from "./pages/Vendors";
import MaterialCategories from "./pages/MaterialCategories";
import Materials from "./pages/Materials";
import PurchaseRequisitions from "./pages/PurchaseRequisitions";
import PurchaseOrders from "./pages/PurchaseOrders";
import GoodsReceipts from "./pages/GoodsReceipts";
import Notifications from "./pages/Notifications";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import VendorNotifications from "./vendor/pages/VendorNotifications";

// ==================================================
// ADMIN ROUTE GUARDS
// ==================================================

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

// ==================================================
// VENDOR PAGES
// ==================================================

import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorPurchaseOrders from "./pages/vendor/VendorPurchaseOrders";
import VendorPurchaseOrderDetails from "./pages/vendor/VendorPurchaseOrderDetails";
import VendorCreateDispatch from "./pages/vendor/VendorCreateDispatch";
import VendorDispatchDetails from "./pages/vendor/VendorDispatchDetails";
import VendorDispatches from "./pages/vendor/VendorDispatches";
import VendorInvoices from "./pages/vendor/VendorInvoices";
import VendorCreateInvoice from "./pages/vendor/VendorCreateInvoice";
import VendorInvoiceDetails from "./pages/vendor/VendorInvoiceDetails";
import VendorPayments from "./pages/vendor/VendorPayments";
import VendorProfile from "./pages/vendor/Profile";
// ==================================================
// VENDOR LAYOUT & AUTHENTICATION
// ==================================================

import VendorLayout from "./layout/VendorLayout";

import {
  VendorAuthProvider,
} from "./context/VendorAuthContext";



import VendorProtectedRoute from "./routes/VendorProtectedRoute";
import VendorReplacementRequestDetails
  from "./pages/vendor/VendorReplacementRequestDetails";

import VendorReplacementRequests
  from "./pages/vendor/VendorReplacementRequests";

import VendorRatings from "./pages/VendorRatings";
import VendorRatingDetails from "./pages/VendorRatingDetails";
import VendorRatingDashboard
  from "./pages/VendorRatingDashboard";
// ==================================================
// QUALITY INSPECTION
// ==================================================

import QualityInspectionLayout from "./layout/QualityInspectionLayout";

import QualityInspectionProtectedRoute from "./routes/QualityInspectionProtectedRoute";

import QualityInspections from "./pages/QualityInspections";

import QualityInspectionDashboard
  from "./pages/qualityInspection/QualityInspectionDashboard";

import QualityInspectionAnalytics
  from "./pages/qualityInspection/QualityInspectionAnalytics";

import CreateQualityInspection
  from "./pages/qualityInspection/CreateQualityInspection";


import InspectionDetails
  from "./pages/qualityInspection/InspectionDetails";

import MaterialInspection
  from "./pages/qualityInspection/MaterialInspection";

import Specifications
  from "./pages/qualityInspection/Specifications";

import DefectsAndDocuments
  from "./pages/qualityInspection/DefectsAndDocuments"; 

import FinalDecision
  from "./pages/qualityInspection/FinalDecision";

import DeviationAcceptance from "./pages/qualityInspection/DeviationAcceptance";

import ReInspections
  from "./pages/qualityInspection/ReInspections";

import ReInspection
  from "./pages/qualityInspection/ReInspection";

import ReInspectionDetails
  from "./pages/qualityInspection/ReInspectionDetails";

import ReInspectionFinalDecision
  from "./pages/qualityInspection/ReInspectionFinalDecision";

import ReInspectionHistory
  from "./pages/qualityInspection/ReInspectionHistory";

// ==================================================
// REPLACEMENT REQUESTS
// ==================================================

import ReplacementRequests
  from "./pages/qualityInspection/ReplacementRequests";

import ReplacementRequestDetails
  from "./pages/qualityInspection/ReplacementRequestDetails";

import CreateReplacementRequest
  from "./pages/qualityInspection/CreateReplacementRequest";

import VendorPerformance from "./pages/vendor/Performance";
// ==================================================
// NOT FOUND PAGE
// ==================================================

const NotFound = () => {

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="text-center">

        <div className="text-7xl font-bold text-slate-300">
          404
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Page Not Available
        </h1>

        <p className="mt-2 text-slate-500 max-w-md mx-auto">
          The page you are trying to access does not exist
          or has not been implemented yet.
        </p>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-6 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go Back
        </button>

      </div>

    </div>
  );
};


// ==================================================
// APP
// ==================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================================
            ADMIN / ORGANIZATION LOGIN
            ================================================== */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        {/* ==================================================
            ADMIN DASHBOARD
            ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN USERS
            ================================================== */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN VENDORS
            ================================================== */}

        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            MATERIAL CATEGORIES
            ================================================== */}

        <Route
          path="/material-categories"
          element={
            <ProtectedRoute>
              <MaterialCategories />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            MATERIALS
            ================================================== */}

        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <Materials />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            PURCHASE REQUISITIONS
            ================================================== */}

        <Route
          path="/purchase-requisitions"
          element={
            <ProtectedRoute>
              <PurchaseRequisitions />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            PURCHASE ORDERS
            ================================================== */}

        <Route
          path="/purchase-orders"
          element={
            <ProtectedRoute>
              <PurchaseOrders />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            GOODS RECEIPT / GRN
            ================================================== */}

        <Route
          path="/grn"
          element={
            <ProtectedRoute>
              <GoodsReceipts />
            </ProtectedRoute>
          }
        />
{/* ==================================================
    ADMIN VENDOR RATINGS
    ================================================== */}

<Route
  path="/ratings"
  element={
    <ProtectedRoute>
      <VendorRatings />
    </ProtectedRoute>
  }
/>


{/* ==================================================
    ADMIN VENDOR RATING DETAILS
    ================================================== */}

<Route
  path="/ratings/:id"
  element={
    <ProtectedRoute>
      <VendorRatingDetails />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    ADMIN VENDOR RATING DASHBOARD
    ================================================== */}

<Route
  path="/vendor-rating-dashboard"
  element={
    <ProtectedRoute>
      <VendorRatingDashboard />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    ADMIN NOTIFICATIONS
    ================================================== */}

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    ADMIN INVOICES
    ================================================== */}

<Route
  path="/invoices"
  element={
    <ProtectedRoute>
      <Invoices />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    ADMIN PAYMENTS
    ================================================== */}

<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    SETTINGS
    ================================================== */}

<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

{/* ==================================================
    QUALITY INSPECTION
    ==================================================

    SUPER_ADMIN
    ADMIN
    QUALITY_MANAGER

    All three can access the Quality Inspection module.

    QUALITY_MANAGER:
    Dedicated Quality Inspection portal.

    SUPER_ADMIN / ADMIN:
    Can access Quality Inspection from the
    organization portal.
    ================================================== */}

{/* ==================================================
    QUALITY INSPECTION
    ================================================== */}

<Route
  path="/quality-inspection"
  element={
    <QualityInspectionProtectedRoute>
      <QualityInspectionLayout />
    </QualityInspectionProtectedRoute>
  }
>

  

  {/* ==================================================
      QUALITY INSPECTION DASHBOARD
      ================================================== */}

  <Route
    path="dashboard"
    element={
      <QualityInspectionDashboard />
    }
  />

  {/* ==================================================
      QUALITY INSPECTION ANALYTICS
      ================================================== */}

  <Route
    path="analytics"
    element={
      <QualityInspectionAnalytics />
    }
  />


  {/* ==================================================
      ALL INSPECTIONS
      ================================================== */}

  <Route
    path="inspections"
    element={
      <QualityInspections />
    }
  />

    {/* ==================================================
      INSPECTION DETAILS / WORKFLOW
      ================================================== */}

  <Route
  path="inspections/:id"
  element={
    <InspectionDetails />
  }
/>

<Route
  path="inspections/:id/material-inspection"
  element={
    <MaterialInspection />
  }
/>

<Route
  path="inspections/:id/specifications"
  element={
    <Specifications />
  }
/>

<Route
  path="inspections/:id/defects-documents"
  element={
    <DefectsAndDocuments />
  }
/>

<Route
  path="inspections/:id/final-decision"
  element={
    <FinalDecision />
  }
/>

<Route
  path="inspections/:id/deviation"
  element={
    <DeviationAcceptance />
  }
/>

{/* ==================================================
    RE-INSPECTIONS LIST
    ================================================== */}

<Route
  path="re-inspections"
  element={
    <ReInspections />
  }
/>


{/* ==================================================
    CREATE RE-INSPECTION
    ================================================== */}

<Route
    path="re-inspections/create"
    element={
      <ReInspection />
    }
  />


{/* ==================================================
    RE-INSPECTION DETAILS
    ================================================== */}

<Route
  path="re-inspections/:id"
  element={
    <ReInspectionDetails />
  }
/>

<Route
  path="re-inspections/:id/final-decision"
  element={
    <ReInspectionFinalDecision />
  }
/>

<Route
  path="re-inspections/history/:originalInspectionId"
  element={
    <ReInspectionHistory />
  }
/>

{/* ==================================================
    REPLACEMENT REQUESTS
    ================================================== */}

<Route
  path="replacements"
  element={
    <ReplacementRequests />
  }
/>


{/* ==================================================
    REPLACEMENT REQUEST DETAILS
    ================================================== */}

<Route
  path="replacements/:id"
  element={
    <ReplacementRequestDetails />
  }
/>


{/* ==================================================
    CREATE REPLACEMENT REQUEST
    ================================================== */}

<Route
  path="replacements/create"
  element={
    <CreateReplacementRequest />
  }
/>

{/* Create Inspection */}

  <Route
    path="create"
    element={
      <CreateQualityInspection />
    }
  />

</Route>




        {/* ==================================================
            VENDOR LOGIN
            ================================================== */}

        <Route
          path="/vendor/login"
          element={
            <VendorAuthProvider>
              <VendorLogin />
            </VendorAuthProvider>
          }
        />


        {/* ==================================================
            VENDOR DASHBOARD
            ================================================== */}

        <Route
          path="/vendor/dashboard"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorDashboard />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />


        {/* ==================================================
            VENDOR PURCHASE ORDERS
            ================================================== */}

        <Route
          path="/vendor/purchase-orders"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorPurchaseOrders />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />


        {/* ==================================================
            VENDOR PURCHASE ORDER DETAILS
            ================================================== */}

        <Route
          path="/vendor/purchase-orders/:id"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorPurchaseOrderDetails />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />


        {/* ==================================================
            VENDOR DISPATCHES
            ================================================== */}

        <Route
          path="/vendor/dispatches"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorDispatches />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />


        {/* ==================================================
            VENDOR CREATE DISPATCH
            ================================================== */}

        <Route
          path="/vendor/dispatches/create/:purchaseOrderId"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorCreateDispatch />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />

        {/* ==================================================
    VENDOR CREATE REPLACEMENT DISPATCH
    ================================================== */}

<Route
  path="/vendor/dispatches/create-replacement/:replacementRequestId"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>

        <VendorLayout>

          <VendorCreateDispatch />

        </VendorLayout>

      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>


        {/* ==================================================
            VENDOR DISPATCH DETAILS
            ================================================== */}

        <Route
          path="/vendor/dispatches/:id"
          element={
            <VendorAuthProvider>
              <VendorProtectedRoute>

                <VendorLayout>

                  <VendorDispatchDetails />

                </VendorLayout>

              </VendorProtectedRoute>
            </VendorAuthProvider>
          }
        />

        {/* ==================================================
    VENDOR REPLACEMENT REQUESTS
    ==================================================

    Vendor:
    Replacement
        ↓
    Replacement Requests
        ↓
    View Request
    ================================================== */}

<Route
  path="/vendor/replacement-requests"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>

        <VendorLayout>

          <VendorReplacementRequests />

        </VendorLayout>

      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

        
  <Route
  path="/vendor/replacement-requests/:id"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>

        <VendorLayout>

          <VendorReplacementRequestDetails />

        </VendorLayout>

      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

{/* ==================================================
    VENDOR CREATE REPLACEMENT DISPATCH
    ================================================== */}

<Route
  path="/vendor/replacement-requests/:replacementRequestId/dispatch"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>

        <VendorLayout>

          <VendorCreateDispatch />

        </VendorLayout>

      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

<Route
  path="/vendor/performance"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorPerformance />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

{/* ==================================================
    VENDOR NOTIFICATIONS
    ================================================== */}

<Route
  path="/vendor/notifications"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorNotifications />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

{/* ==================================================
    VENDOR INVOICES
    ================================================== */}

<Route
  path="/vendor/invoices"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorInvoices />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

<Route
  path="/vendor/invoices/create"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorCreateInvoice />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

<Route
  path="/vendor/invoices/create/:purchaseOrderId"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorCreateInvoice />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

<Route
  path="/vendor/invoices/:id"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorInvoiceDetails />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

{/* ==================================================
    VENDOR PAYMENTS
    ================================================== */}

<Route
  path="/vendor/payments"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorPayments />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>

{/* ==================================================
    VENDOR PROFILE
    ================================================== */}

<Route
  path="/vendor/profile"
  element={
    <VendorAuthProvider>
      <VendorProtectedRoute>
        <VendorLayout>
          <VendorProfile />
        </VendorLayout>
      </VendorProtectedRoute>
    </VendorAuthProvider>
  }
/>



        {/* ==================================================
            ROOT
            ==================================================

            Root is only used when the application is opened
            without a specific route.

            It goes to organization login.
            ================================================== */}

        <Route
          path="/"
          element={<PortalGateway />}
        />


        {/* ==================================================
            404 / UNKNOWN ROUTES
            ==================================================

            IMPORTANT:
            Unknown routes are NOT redirected to login.

            This prevents unfinished/incorrect sidebar links
            from unexpectedly sending users to login or
            another portal.
            ================================================== */}

        <Route
          path="*"
          element={
            <NotFound />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}




export default App;