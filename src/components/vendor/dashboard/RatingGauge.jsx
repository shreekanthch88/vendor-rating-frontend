import {
  Award,
  TrendingUp,
} from "lucide-react";

const RatingGauge = () => {
  const rating = 92;
  const grade = "A+";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Vendor Rating
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall Performance Score
          </p>

        </div>

        <Award
          size={28}
          className="text-yellow-500"
        />

      </div>

      {/* Gauge */}

      <div className="flex flex-col items-center">

        <div className="relative flex h-52 w-52 items-center justify-center">

          <svg
            className="h-52 w-52 -rotate-90"
            viewBox="0 0 160 160"
          >

            {/* Background */}

            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />

            {/* Progress */}

            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#2563EB"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={427}
              strokeDashoffset={
                427 - (427 * rating) / 100
              }
            />

          </svg>

          <div className="absolute text-center">

            <h1 className="text-5xl font-bold text-blue-700">
              {rating}%
            </h1>

            <p className="mt-2 text-lg font-semibold text-slate-600">
              Grade {grade}
            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="mt-8 grid w-full grid-cols-3 gap-4">

          <div className="rounded-xl bg-slate-50 p-4 text-center">

            <h3 className="text-2xl font-bold text-green-600">
              98%
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Delivery
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">

            <h3 className="text-2xl font-bold text-blue-600">
              91%
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Quality
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">

            <h3 className="text-2xl font-bold text-orange-600">
              88%
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Price
            </p>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between rounded-xl bg-blue-50 p-4">

        <div>

          <p className="text-sm text-slate-500">
            Performance Trend
          </p>

          <h3 className="font-semibold text-slate-700">
            Excellent Performance
          </h3>

        </div>

        <TrendingUp
          size={30}
          className="text-green-600"
        />

      </div>

    </div>
  );
};

export default RatingGauge;