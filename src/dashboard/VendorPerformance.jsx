const VendorPerformance = ({ analytics }) => {
  const totalVendors = analytics?.totalVendors || 0;
  const activeVendors = analytics?.activeVendors || 0;
  const pendingVendors = analytics?.pendingVendors || 0;
  const inactiveVendors = analytics?.inactiveVendors || 0;

  const activePercentage =
    totalVendors > 0
      ? Math.round((activeVendors / totalVendors) * 100)
      : 0;

  const pendingPercentage =
    totalVendors > 0
      ? Math.round((pendingVendors / totalVendors) * 100)
      : 0;

  const inactivePercentage =
    totalVendors > 0
      ? Math.round((inactiveVendors / totalVendors) * 100)
      : 0;

  const stats = [
    {
      label: "Active Vendors",
      value: activeVendors,
      percentage: activePercentage,
      color: "bg-green-600",
    },
    {
      label: "Pending (Under Review)",
      value: pendingVendors,
      percentage: pendingPercentage,
      color: "bg-amber-500",
    },
    {
      label: "Inactive Vendors",
      value: inactiveVendors,
      percentage: inactivePercentage,
      color: "bg-slate-400",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">
        Vendor Performance
      </h2>

      <div className="mb-6">
        <p className="text-gray-500 text-sm">Total Vendors</p>
        <p className="text-3xl font-bold">{totalVendors}</p>
      </div>

      {stats.map((item) => (
        <div key={item.label} className="mb-5">
          <div className="flex justify-between mb-2">
            <span>{item.label}</span>

            <span>
              {item.value} ({item.percentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className={`${item.color || "bg-blue-600"} h-3 rounded-full transition-all duration-500`}
              style={{
                width: `${item.percentage}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorPerformance;