import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb", // Draft
  "#f59e0b", // Submitted
  "#10b981", // Approved
  "#8b5cf6", // Sent
  "#06b6d4", // Accepted
  "#ef4444", // Rejected
  "#22c55e", // Delivered
  "#64748b", // Cancelled
];

const StatusChart = ({ data = [] }) => {

  const chartData =
    data.length > 0
      ? data
      : [
          { status: "Draft", count: 12 },
          { status: "Submitted", count: 8 },
          { status: "Approved", count: 18 },
          { status: "Sent", count: 6 },
          { status: "Accepted", count: 9 },
          { status: "Rejected", count: 3 },
          { status: "Delivered", count: 14 },
          { status: "Cancelled", count: 2 },
        ];

  return (
    <div className="h-80 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={45}
            paddingAngle={3}
            label={({ status, percent }) =>
              `${status} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.status}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `${value} Orders`,
              "Count",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );

};

export default StatusChart;