import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
 CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
];

const VendorPurchaseChart = ({
  data = [],
}) => {

  const chartData =
    data.length > 0
      ? data
      : [
          {
            vendor: "ABC Pvt Ltd",
            orders: 32,
          },
          {
            vendor: "XYZ Industries",
            orders: 24,
          },
          {
            vendor: "Global Tech",
            orders: 18,
          },
          {
            vendor: "Prime Metals",
            orders: 14,
          },
          {
            vendor: "Steel Works",
            orders: 11,
          },
        ];

  return (

    <div className="h-80 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="vendor"
            tick={{
              fontSize: 11,
            }}
            angle={-15}
            textAnchor="end"
            interval={0}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${value} Orders`,
              "Purchase Orders",
            ]}
          />

          <Bar
            dataKey="orders"
            radius={[8, 8, 0, 0]}
            maxBarSize={45}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.vendor}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

};

export default VendorPurchaseChart;