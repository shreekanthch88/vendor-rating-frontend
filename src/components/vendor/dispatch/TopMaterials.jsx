import React, { useMemo } from "react";

import {
  Package,
  TrendingUp,
} from "lucide-react";


const TopMaterials = ({
  data = {},
}) => {
  const dispatches = Array.isArray(
    data?.dispatches
  )
    ? data.dispatches
    : [];


  // =========================================================
  // BUILD MATERIAL SUMMARY
  // =========================================================

  const materials = useMemo(() => {
    const grouped = {};

    dispatches.forEach((dispatch) => {
      const items = Array.isArray(
        dispatch?.items
      )
        ? dispatch.items
        : [];


      // -------------------------------------------------------
      // Dispatch with item-level data
      // -------------------------------------------------------

      if (items.length > 0) {
        items.forEach((item) => {
          const materialId =
            item?.material?._id ||
            item?.materialId ||
            item?.materialCode ||
            item?.materialName;

          if (!materialId) {
            return;
          }


          const materialCode =
            item?.materialCode ||
            item?.material?.materialCode ||
            "—";


          const materialName =
            item?.materialName ||
            item?.material?.materialName ||
            item?.material?.name ||
            "Unknown Material";


          const quantity = Number(
            item?.dispatchQuantity ||
            item?.quantity ||
            item?.dispatchedQuantity ||
            0
          );


          const unit =
            item?.unitOfMeasure ||
            item?.material?.unitOfMeasure ||
            item?.uom ||
            "";


          if (!grouped[materialId]) {
            grouped[materialId] = {
              materialCode,
              materialName,
              quantity: 0,
              unit,
            };
          }


          grouped[materialId].quantity +=
            quantity;
        });

        return;
      }


      // -------------------------------------------------------
      // Fallback for flat dispatch records
      // -------------------------------------------------------

      const materialId =
        dispatch?.material?._id ||
        dispatch?.materialId ||
        dispatch?.materialCode ||
        dispatch?.materialName;


      if (!materialId) {
        return;
      }


      const materialCode =
        dispatch?.materialCode ||
        dispatch?.material?.materialCode ||
        "—";


      const materialName =
        dispatch?.materialName ||
        dispatch?.material?.materialName ||
        dispatch?.material?.name ||
        "Unknown Material";


      const quantity = Number(
        dispatch?.dispatchQuantity ||
        dispatch?.quantity ||
        dispatch?.dispatchedQuantity ||
        0
      );


      const unit =
        dispatch?.unitOfMeasure ||
        dispatch?.material?.unitOfMeasure ||
        dispatch?.uom ||
        "";


      if (!grouped[materialId]) {
        grouped[materialId] = {
          materialCode,
          materialName,
          quantity: 0,
          unit,
        };
      }


      grouped[materialId].quantity +=
        quantity;
    });


    return Object.values(grouped)
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);

  }, [dispatches]);


  // =========================================================
  // TOTAL QUANTITY
  // =========================================================

  const totalQuantity = useMemo(() => {
    return materials.reduce(
      (total, material) =>
        total + material.quantity,
      0
    );
  }, [materials]);


  // =========================================================
  // FORMAT NUMBER
  // =========================================================

  const formatNumber = (value) => {
    return Number(
      value || 0
    ).toLocaleString("en-IN");
  };


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!materials.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Top Materials
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Highest dispatched materials
            </p>
          </div>


          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

            <Package
              size={19}
              className="text-blue-600"
            />

          </div>

        </div>


        <div className="flex min-h-[260px] flex-col items-center justify-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

            <Package
              size={25}
              className="text-slate-400"
            />

          </div>


          <h3 className="mt-4 text-sm font-semibold text-slate-700">
            No material data
          </h3>


          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
            Material dispatch information will
            appear here when dispatch records
            are available.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN COMPONENT
  // =========================================================

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-800">
            Top Materials
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Highest dispatched materials
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
          MATERIAL LIST
          ===================================================== */}

      <div className="mt-5 space-y-4">

        {materials.map(
          (material, index) => {

            const percentage =
              totalQuantity > 0
                ? (
                    material.quantity /
                    totalQuantity
                  ) * 100
                : 0;


            return (
              <div
                key={`${material.materialCode}-${index}`}
              >

                {/* =========================================
                    MATERIAL HEADER
                    ========================================= */}

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {material.materialName}
                    </p>


                    <p className="mt-0.5 text-xs text-slate-400">
                      {material.materialCode}
                    </p>

                  </div>


                  <div className="shrink-0 text-right">

                    <p className="text-sm font-bold text-slate-700">
                      {formatNumber(
                        material.quantity
                      )}
                    </p>


                    {material.unit && (
                      <p className="text-[10px] text-slate-400">
                        {material.unit}
                      </p>
                    )}

                  </div>

                </div>


                {/* =========================================
                    PROGRESS
                    ========================================= */}

                <div className="mt-2">

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>


                {/* =========================================
                    PERCENTAGE
                    ========================================= */}

                <div className="mt-1 flex justify-between">

                  <span className="text-[10px] text-slate-400">
                    Dispatch share
                  </span>

                  <span className="text-[10px] font-medium text-slate-500">
                    {percentage.toFixed(1)}%
                  </span>

                </div>

              </div>
            );
          }
        )}

      </div>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="mt-5 border-t border-slate-100 pt-4">

        <div className="flex items-center justify-between">

          <span className="text-xs text-slate-400">
            Materials shown
          </span>

          <span className="text-sm font-semibold text-slate-700">
            {materials.length}
          </span>

        </div>


        <div className="mt-2 flex items-center justify-between">

          <span className="text-xs text-slate-400">
            Total dispatched quantity
          </span>

          <span className="text-sm font-semibold text-blue-600">
            {formatNumber(
              totalQuantity
            )}
          </span>

        </div>

      </div>

    </div>
  );
};


export default TopMaterials;