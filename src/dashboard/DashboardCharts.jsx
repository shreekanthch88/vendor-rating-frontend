import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  Active: "#16A34A", // Green
  Pending: "#EAB308", // Amber / Yellow
  Inactive: "#64748B", // Slate
  Blacklisted: "#EF4444", // Red
};

const DEFAULT_COLORS = ["#16A34A", "#EAB308", "#64748B", "#EF4444"];

const DashboardCharts = ({ analytics }) => {
  // Real purchase trend from backend
  const purchaseData = analytics?.monthlyPurchaseTrend || [];

  // Vendor status data from backend (filter out 0-value items for clean rendering)
  const rawStatusData = analytics?.vendorStatusChart || [];
  const statusData = rawStatusData.filter((item) => item.value > 0);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Monthly Purchase Trend */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5 text-gray-800">
          Monthly Purchase Trend
        </h2>

        {purchaseData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-gray-400 text-sm">
            No purchase order trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={purchaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === "orders" ? `${value} orders` : value,
                  "Orders",
                ]}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563EB" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Vendor Status Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5 text-gray-800">
          Vendor Status Distribution
        </h2>

        {statusData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-gray-400 text-sm">
            No vendor status data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={95}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] ||
                      DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} vendors`, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;