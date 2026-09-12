import React, { useMemo } from "react";

import {
  TrendingUp,
  Truck,
} from "lucide-react";


const DispatchTrend = ({
  data = {},
}) => {
  const dispatches = Array.isArray(
    data?.dispatches
  )
    ? data.dispatches
    : [];


  // =========================================================
  // BUILD TREND DATA
  // =========================================================

  const trendData = useMemo(() => {
    const grouped = {};

    dispatches.forEach((record) => {
      const dateValue =
        record?.dispatchDate ||
        record?.createdAt ||
        record?.updatedAt;

      if (!dateValue) {
        return;
      }

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key =
        date.toISOString().slice(0, 10);

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          count: 0,
          quantity: 0,
        };
      }

      grouped[key].count += 1;

      grouped[key].quantity += Number(
        record?.dispatchQuantity ||
        record?.quantity ||
        record?.dispatchedQuantity ||
        0
      );
    });


    return Object.values(grouped)
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      )
      .slice(-7);

  }, [dispatches]);


  // =========================================================
  // MAX VALUE
  // =========================================================

  const maxQuantity = useMemo(() => {
    if (!trendData.length) {
      return 0;
    }

    return Math.max(
      ...trendData.map(
        (item) => item.quantity
      ),
      0
    );
  }, [trendData]);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!trendData.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Dispatch Trend
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Recent dispatch activity
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp
              size={19}
              className="text-blue-600"
            />
          </div>

        </div>


        <div className="flex min-h-[260px] flex-col items-center justify-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

            <Truck
              size={25}
              className="text-slate-400"
            />

          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-700">
            No dispatch activity
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
            Dispatch activity will appear here once
            dispatch records are available.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // CHART
  // =========================================================

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Dispatch Trend
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Recent dispatch activity
          </p>
        </div>


        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

          <TrendingUp
            size={19}
            className="text-blue-600"
          />

        </div>

      </div>


      {/* =====================================================
          CHART AREA
          ===================================================== */}

      <div className="mt-6">

        <div className="flex h-[220px] items-end gap-3">

          {trendData.map(
            (item) => {

              const height =
                maxQuantity > 0
                  ? Math.max(
                      (
                        item.quantity /
                        maxQuantity
                      ) * 100,
                      6
                    )
                  : 6;


              return (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col justify-end"
                >

                  {/* =========================================
                      VALUE
                      ========================================= */}

                  <div className="mb-2 text-center">

                    <span className="text-[10px] font-semibold text-slate-500">
                      {item.quantity}
                    </span>

                  </div>


                  {/* =========================================
                      BAR
                      ========================================= */}

                  <div className="flex h-[175px] items-end justify-center">

                    <div
                      className="w-full max-w-[34px] rounded-t-lg bg-blue-500 transition-all duration-500"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.quantity} units`}
                    />

                  </div>


                  {/* =========================================
                      DATE
                      ========================================= */}

                  <div className="mt-3 text-center">

                    <span className="text-[10px] text-slate-400">
                      {formatDate(
                        item.date
                      )}
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

        <div>

          <p className="text-xs text-slate-400">
            Dispatch Records
          </p>

          <p className="mt-1 text-lg font-bold text-slate-700">
            {dispatches.length}
          </p>

        </div>


        <div className="text-right">

          <p className="text-xs text-slate-400">
            Total Units
          </p>

          <p className="mt-1 text-lg font-bold text-blue-600">
            {trendData
              .reduce(
                (sum, item) =>
                  sum +
                  item.quantity,
                0
              )
              .toLocaleString(
                "en-IN"
              )}
          </p>

        </div>

      </div>

    </div>
  );
};


export default DispatchTrend;