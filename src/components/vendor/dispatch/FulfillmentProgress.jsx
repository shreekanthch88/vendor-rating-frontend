import React, { useMemo } from "react";

import {
  Package,
  Truck,
  Clock3,
} from "lucide-react";


const FulfillmentProgress = ({
  data = {},
}) => {

  const dispatches =
    Array.isArray(data?.dispatches)
      ? data.dispatches
      : [];


  // =========================================================
  // CALCULATE FULFILLMENT
  // =========================================================

  const fulfillment = useMemo(() => {

    let ordered = 0;
    let dispatched = 0;

    dispatches.forEach((record) => {

      const orderedQuantity =
        Number(
          record?.orderedQuantity ||
          record?.purchaseOrder
            ?.orderedQuantity ||
          0
        );

      const dispatchedQuantity =
        Number(
          record?.cumulativeDispatchedQuantity ??
          record?.totalDispatchedQuantity ??
          record?.dispatchedQuantity ??
          record?.dispatchQuantity ??
          0
        );

      ordered += orderedQuantity;

      dispatched += dispatchedQuantity;
    });


    const pending = Math.max(
      ordered - dispatched,
      0
    );


    const percentage =
      ordered > 0
        ? Math.min(
            (dispatched / ordered) * 100,
            100
          )
        : 0;


    return {
      ordered,
      dispatched,
      pending,
      percentage,
    };

  }, [dispatches]);


  // =========================================================
  // FORMAT NUMBER
  // =========================================================

  const formatNumber = (value) => {
    return Number(
      value || 0
    ).toLocaleString("en-IN");
  };


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-800">
            Fulfillment Progress
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Overall dispatch fulfillment
          </p>

        </div>


        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

          <Package
            size={19}
            className="text-blue-600"
          />

        </div>

      </div>


      {/* =====================================================
          PERCENTAGE
          ===================================================== */}

      <div className="mt-6 flex items-end justify-between">

        <div>

          <p className="text-4xl font-bold text-slate-800">
            {Math.round(
              fulfillment.percentage
            )}%
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Fulfilled
          </p>

        </div>


        <div className="text-right">

          <p className="text-sm font-medium text-slate-600">
            {formatNumber(
              fulfillment.dispatched
            )} / {formatNumber(
              fulfillment.ordered
            )}
          </p>

          <p className="text-xs text-slate-400">
            Units dispatched
          </p>

        </div>

      </div>


      {/* =====================================================
          PROGRESS BAR
          ===================================================== */}

      <div className="mt-5">

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${fulfillment.percentage}%`,
            }}
          />

        </div>

      </div>


      {/* =====================================================
          BREAKDOWN
          ===================================================== */}

      <div className="mt-6 grid grid-cols-2 gap-3">

        {/* ===================================================
            DISPATCHED
            =================================================== */}

        <div className="rounded-xl bg-green-50 p-4">

          <div className="flex items-center gap-2">

            <Truck
              size={16}
              className="text-green-600"
            />

            <span className="text-xs font-medium text-green-700">
              Dispatched
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-green-700">
            {formatNumber(
              fulfillment.dispatched
            )}
          </p>

        </div>


        {/* ===================================================
            PENDING
            =================================================== */}

        <div className="rounded-xl bg-amber-50 p-4">

          <div className="flex items-center gap-2">

            <Clock3
              size={16}
              className="text-amber-600"
            />

            <span className="text-xs font-medium text-amber-700">
              Pending
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-amber-700">
            {formatNumber(
              fulfillment.pending
            )}
          </p>

        </div>

      </div>


      {/* =====================================================
          FOOTER INFORMATION
          ===================================================== */}

      <div className="mt-5 border-t border-slate-100 pt-4">

        <div className="flex items-center justify-between text-xs">

          <span className="text-slate-400">
            Ordered Quantity
          </span>

          <span className="font-semibold text-slate-600">
            {formatNumber(
              fulfillment.ordered
            )}
          </span>

        </div>


        <div className="mt-2 flex items-center justify-between text-xs">

          <span className="text-slate-400">
            Pending Quantity
          </span>

          <span
            className={
              fulfillment.pending > 0
                ? "font-semibold text-amber-600"
                : "font-semibold text-green-600"
            }
          >
            {formatNumber(
              fulfillment.pending
            )}
          </span>

        </div>

      </div>

    </div>
  );
};


export default FulfillmentProgress;