import PurchaseTrendChart from "./PurchaseTrendChart";
import StatusChart from "./StatusChart";
import DepartmentChart from "./DepartmentChart";
import VendorPurchaseChart from "./VendorPurchaseChart";

const PurchaseOrderCharts = ({
  trendData = [],
  statusData = [],
  departmentData = [],
  vendorData = [],
  loading = false,
}) => {

  if (loading) {

    return (

      <div className="rounded-2xl bg-white p-8 shadow-sm">

        <div className="flex items-center justify-center py-20">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        </div>

      </div>

    );

  }

  return (

    <div className="space-y-6">

      {/* ==========================================
          Section Header
      ========================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Purchase Order Analytics

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Monitor purchase trends, vendor performance,
          department activity and order status.

        </p>

      </div>

      {/* ==========================================
          Charts Grid
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* ==========================================
            Purchase Trend Chart
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-800">

              Purchase Trend

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Monthly Purchase Orders created.

            </p>

          </div>

          <PurchaseTrendChart
            data={trendData}
          />

        </div>

        {/* ==========================================
            Status Distribution
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-800">

              Order Status Distribution

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Current Purchase Order status overview.

            </p>

          </div>

          <StatusChart
            data={statusData}
          />

        </div>

                {/* ==========================================
            Department Purchase Orders
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-800">

              Department-wise Purchase Orders

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Purchase Orders grouped by department.

            </p>

          </div>

          <DepartmentChart
            data={departmentData}
          />

        </div>

        {/* ==========================================
            Vendor Purchase Orders
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-800">

              Vendor-wise Purchase Orders

            </h3>

            <p className="mt-1 text-sm text-slate-500">

              Compare Purchase Orders across vendors.

            </p>

          </div>

          <VendorPurchaseChart
            data={vendorData}
          />

        </div>
              </div>

    </div>

  );

};

export default PurchaseOrderCharts;