import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", rating: 82 },
  { month: "Feb", rating: 84 },
  { month: "Mar", rating: 87 },
  { month: "Apr", rating: 86 },
  { month: "May", rating: 90 },
  { month: "Jun", rating: 92 },
];

const RatingChart = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Rating Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly Vendor Performance
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="rating"
              stroke="#2563EB"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default RatingChart;