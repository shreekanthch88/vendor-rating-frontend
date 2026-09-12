import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PurchaseTrendChart = ({
  data = [],
}) => {

  const chartData =
    data.length > 0
      ? data
      : [
          {
            month: "Jan",
            orders: 18,
          },
          {
            month: "Feb",
            orders: 25,
          },
          {
            month: "Mar",
            orders: 22,
          },
          {
            month: "Apr",
            orders: 31,
          },
          {
            month: "May",
            orders: 28,
          },
          {
            month: "Jun",
            orders: 35,
          },
          {
            month: "Jul",
            orders: 41,
          },
          {
            month: "Aug",
            orders: 38,
          },
          {
            month: "Sep",
            orders: 44,
          },
          {
            month: "Oct",
            orders: 40,
          },
          {
            month: "Nov",
            orders: 47,
          },
          {
            month: "Dec",
            orders: 52,
          },
        ];

  return (

    <div className="h-80 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
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
            dataKey="month"
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
            formatter={(value) => [
              `${value} Orders`,
              "Purchase Orders",
            ]}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="orders"
            name="Purchase Orders"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 5,
            }}
            activeDot={{
              r: 7,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default PurchaseTrendChart;