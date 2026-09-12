import {
  Building2,
  ClipboardList,
  Clock3,
  TrendingUp,
  Ban,
} from "lucide-react";

const DashboardCards = ({ analytics }) => {
  const cards = [
    {
      title: "Total Users",
      value: analytics?.totalUsers ?? 0,
      change: "",
      icon: ClipboardList,
      bg: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Vendors",
      value: analytics?.totalVendors ?? 0,
      change: "",
      icon: Building2,
      bg: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      title: "Active Vendors",
      value: analytics?.activeVendors ?? 0,
      change: "",
      icon: TrendingUp,
      bg: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Pending Vendors",
      value: analytics?.pendingVendors ?? 0,
      change: "",
      icon: Clock3,
      bg: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "Inactive Vendors",
      value: analytics?.inactiveVendors ?? 0,
      change: "",
      icon: Ban,
      bg: "bg-slate-100",
      textColor: "text-slate-600",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>

                {card.change && (
                  <p className="mt-2 text-green-600 text-sm">
                    {card.change}
                  </p>
                )}
              </div>

              <div className={`rounded-xl p-4 ${card.bg}`}>
                <Icon
                  size={26}
                  className={card.textColor}
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