import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DepartmentChart = ({
  data = [],
}) => {

  const chartData =
    data.length > 0
      ? data
      : [
          {
            department: "Purchase",
            orders: 24,
          },
          {
            department: "Production",
            orders: 18,
          },
          {
            department: "Maintenance",
            orders: 11,
          },
          {
            department: "Stores",
            orders: 16,
          },
          {
            department: "Quality",
            orders: 8,
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
            dataKey="department"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{
              fill: "#f8fafc",
            }}
          />
                    <Bar
            dataKey="orders"
            name="Purchase Orders"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
          
        </BarChart>

      </ResponsiveContainer>
          </div>

  );

};

export default DepartmentChart;
