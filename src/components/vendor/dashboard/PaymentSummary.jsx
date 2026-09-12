import {
  CreditCard,
  Wallet,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";

const payments = [
  {
    title: "Pending Payments",
    value: "₹ 4,85,000",
    color: "text-red-600",
    bg: "bg-red-100",
    icon: CreditCard,
  },
  {
    title: "Received This Month",
    value: "₹ 12,40,000",
    color: "text-green-600",
    bg: "bg-green-100",
    icon: Wallet,
  },
  {
    title: "Total Revenue",
    value: "₹ 58,20,000",
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: CircleDollarSign,
  },
];

const recentTransactions = [
  {
    id: "PAY001",
    date: "08 Aug 2026",
    amount: "₹ 1,20,000",
    status: "Paid",
  },
  {
    id: "PAY002",
    date: "05 Aug 2026",
    amount: "₹ 2,80,000",
    status: "Paid",
  },
  {
    id: "PAY003",
    date: "02 Aug 2026",
    amount: "₹ 85,000",
    status: "Processing",
  },
];

const PaymentSummary = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Payment Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Financial Overview
        </p>

      </div>

      {/* Cards */}

      <div className="space-y-4">

        {payments.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-xl border p-4"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`rounded-xl p-3 ${item.bg}`}
                >
                  <Icon
                    size={24}
                    className={item.color}
                  />
                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="text-xl font-bold">
                    {item.value}
                  </h3>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Divider */}

      <div className="my-8 border-t" />

      {/* Recent Transactions */}

      <div>

        <h3 className="mb-4 text-lg font-semibold">
          Recent Transactions
        </h3>

        <div className="space-y-4">

          {recentTransactions.map((txn) => (

            <div
              key={txn.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >

              <div>

                <h4 className="font-semibold">
                  {txn.id}
                </h4>

                <p className="text-sm text-slate-500">
                  {txn.date}
                </p>

              </div>

              <div className="text-right">

                <h4 className="font-semibold">
                  {txn.amount}
                </h4>

                <div className="mt-1 flex items-center justify-end gap-1 text-green-600">

                  <CheckCircle2 size={16} />

                  <span className="text-sm">
                    {txn.status}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default PaymentSummary;