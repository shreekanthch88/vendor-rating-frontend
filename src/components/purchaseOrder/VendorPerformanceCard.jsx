import {
  Truck,
  Star,
  IndianRupee,
  Package,
  TrendingUp,
} from "lucide-react";

const VendorPerformanceCard = ({
  vendor = {},
}) => {

  const metrics = [
    {
      label: "Delivery Score",
      value: vendor.deliveryScore ?? 0,
      color: "bg-blue-500",
      icon: Truck,
    },
    {
      label: "Quality Score",
      value: vendor.qualityScore ?? 0,
      color: "bg-green-500",
      icon: Star,
    },
    {
      label: "Price Score",
      value: vendor.priceScore ?? 0,
      color: "bg-yellow-500",
      icon: IndianRupee,
    },
    {
      label: "Response Score",
      value: vendor.responseScore ?? 0,
      color: "bg-purple-500",
      icon: TrendingUp,
    },
  ];

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">

            {vendor.vendorName || "Vendor Performance"}

          </h2>

          <p className="text-sm text-slate-500">

            Overall Vendor Performance

          </p>

        </div>

        <div className="rounded-xl bg-blue-100 p-3">

          <Package
            size={28}
            className="text-blue-600"
          />

        </div>

      </div>

      <div className="space-y-5">

        {metrics.map((metric, index) => {

          const Icon = metric.icon;

          return (

            <div key={index}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Icon
                    size={18}
                    className="text-slate-600"
                  />

                  <span className="text-sm font-medium">

                    {metric.label}

                  </span>

                </div>

                <span className="font-bold">

                  {metric.value}%

                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className={`h-full rounded-full ${metric.color}`}
                  style={{
                    width: `${metric.value}%`,
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>

      <hr className="my-6" />

      <div className="flex items-center justify-between">

        <span className="font-semibold">

          Overall Rating

        </span>

        <span className="text-2xl font-bold text-green-600">

          {vendor.overallScore ?? 0}%

        </span>

      </div>

    </div>

  );

};

export default VendorPerformanceCard;