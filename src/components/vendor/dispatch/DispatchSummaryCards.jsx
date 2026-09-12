import React from "react";

import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Package,
  CircleAlert,
} from "lucide-react";


const DispatchSummaryCards = ({
  readyToDispatch = 0,
  dispatched = 0,
  partialDispatch = 0,
  inTransit = 0,
  pendingQuantity = 0,
  delayed = 0,
}) => {

  const cards = [
    {
      title: "Ready to Dispatch",
      value: readyToDispatch,
      description: "Purchase orders awaiting dispatch",
      icon: Truck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Dispatched",
      value: dispatched,
      description: "Dispatches completed",
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Partial Dispatch",
      value: partialDispatch,
      description: "Orders with pending quantities",
      icon: Package,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },

    {
      title: "In Transit",
      value: inTransit,
      description: "Shipments currently in transit",
      icon: Truck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Pending Quantity",
      value: pendingQuantity,
      description: "Items still pending delivery",
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Delayed",
      value: delayed,
      description: "Dispatches requiring attention",
      icon: CircleAlert,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >

            {/* =================================================
                TOP SECTION
                ================================================= */}

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </p>
              </div>


              {/* =================================================
                  ICON
                  ================================================= */}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={21}
                  className={card.iconColor}
                />
              </div>

            </div>


            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <div className="mt-4">

              <p className="text-xs leading-5 text-slate-400">
                {card.description}
              </p>

            </div>

          </div>
        );
      })}

    </div>
  );
};


export default DispatchSummaryCards;