import {
  ShoppingCart,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";

const cards = [
  {
    title: "Active Purchase Orders",
    value: 24,
    icon: ShoppingCart,
    color: "bg-blue-500",
  },
  {
    title: "Pending Deliveries",
    value: 8,
    icon: Truck,
    color: "bg-green-500",
  },
  {
    title: "Pending Invoices",
    value: 12,
    icon: FileText,
    color: "bg-yellow-500",
  },
  {
    title: "Pending Payments",
    value: "₹ 2.45 L",
    icon: CreditCard,
    color: "bg-red-500",
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>

              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.color}`}
              >
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default DashboardCards;