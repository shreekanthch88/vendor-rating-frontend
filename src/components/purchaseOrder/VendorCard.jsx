import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Package,
  IndianRupee,
  Star,
  CheckCircle,
} from "lucide-react";

const VendorCard = ({
  vendor = {},
}) => {

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">

            <Building2
              size={26}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-800">

              {vendor.vendorName || "Vendor"}

            </h2>

            <p className="text-sm text-slate-500">

              {vendor.companyName || "-"}

            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            vendor.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vendor.status || "Inactive"}
        </span>

      </div>

      {/* Contact */}

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-2">

          <Mail
            size={16}
            className="text-slate-500"
          />

          <span>

            {vendor.email || "-"}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <Phone
            size={16}
            className="text-slate-500"
          />

          <span>

            {vendor.phone || "-"}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <MapPin
            size={16}
            className="text-slate-500"
          />

          <span>

            {vendor.city || vendor.address || "-"}

          </span>

        </div>

      </div>

      <hr className="my-5" />

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="mb-2 flex items-center gap-2">

            <Package
              size={18}
              className="text-blue-600"
            />

            <span className="text-sm">

              Orders

            </span>

          </div>

          <h3 className="text-2xl font-bold">

            {vendor.totalOrders || 0}

          </h3>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="mb-2 flex items-center gap-2">

            <IndianRupee
              size={18}
              className="text-green-600"
            />

            <span className="text-sm">

              Purchase

            </span>

          </div>

          <h3 className="text-lg font-bold">

            {formatCurrency(
              vendor.totalPurchaseValue
            )}

          </h3>

        </div>

      </div>

      <hr className="my-5" />

      {/* Rating */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold">

            Rating

          </span>

        </div>

        <span className="font-bold text-yellow-600">

          {vendor.rating || 0}/5

        </span>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <CheckCircle
            size={18}
            className="text-green-600"
          />

          <span className="font-semibold">

            Performance

          </span>

        </div>

        <span className="font-bold text-green-700">

          {vendor.performanceScore || 0}%

        </span>

      </div>

    </div>

  );

};

export default VendorCard;