import {
  Trophy,
  Building2,
  Truck,
  Star,
  IndianRupee,
  Package,
} from "lucide-react";

const VendorComparisonCard = ({
  vendors = [],
}) => {

  const comparisonData =
    vendors.length > 0
      ? vendors
      : [
          {
            vendorName: "ABC Pvt Ltd",
            overallScore: 94,
            deliveryScore: 96,
            qualityScore: 92,
            priceScore: 90,
            totalOrders: 42,
          },
          {
            vendorName: "XYZ Industries",
            overallScore: 88,
            deliveryScore: 84,
            qualityScore: 90,
            priceScore: 89,
            totalOrders: 35,
          },
          {
            vendorName: "Global Tech",
            overallScore: 82,
            deliveryScore: 80,
            qualityScore: 85,
            priceScore: 81,
            totalOrders: 28,
          },
        ];

  const bestVendor = [...comparisonData].sort(
    (a, b) => b.overallScore - a.overallScore
  )[0];

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Vendor Comparison
          </h2>

          <p className="text-sm text-slate-500">
            Compare vendor performance.
          </p>

        </div>

        <Trophy
          size={30}
          className="text-yellow-500"
        />

      </div>

      <div className="space-y-4">

        {comparisonData.map((vendor) => (

          <div
            key={vendor.vendorName}
            className={`rounded-xl border p-5 transition ${
              vendor.vendorName === bestVendor.vendorName
                ? "border-green-300 bg-green-50"
                : "border-slate-200"
            }`}
          >

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Building2
                  size={22}
                  className="text-blue-600"
                />

                <div>

                  <h3 className="font-semibold">

                    {vendor.vendorName}

                  </h3>

                  <p className="text-sm text-slate-500">

                    Overall Score: {vendor.overallScore}%

                  </p>

                </div>

              </div>

              {vendor.vendorName === bestVendor.vendorName && (

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                  Best Vendor

                </span>

              )}

            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              <div className="flex items-center gap-2">

                <Truck
                  size={18}
                  className="text-blue-600"
                />

                <div>

                  <p className="text-xs text-slate-500">
                    Delivery
                  </p>

                  <p className="font-semibold">
                    {vendor.deliveryScore}%
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Star
                  size={18}
                  className="text-yellow-500"
                />

                <div>

                  <p className="text-xs text-slate-500">
                    Quality
                  </p>

                  <p className="font-semibold">
                    {vendor.qualityScore}%
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <IndianRupee
                  size={18}
                  className="text-green-600"
                />

                <div>

                  <p className="text-xs text-slate-500">
                    Price
                  </p>

                  <p className="font-semibold">
                    {vendor.priceScore}%
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Package
                  size={18}
                  className="text-purple-600"
                />

                <div>

                  <p className="text-xs text-slate-500">
                    Orders
                  </p>

                  <p className="font-semibold">
                    {vendor.totalOrders}
                  </p>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default VendorComparisonCard;