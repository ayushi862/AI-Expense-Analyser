import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Download,
  Filter,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const transactions = [
  {
    id: 1,
    merchant: "Whole Foods Market",
    category: "Groceries",
    date: "Today, 10:42 AM",
    amount: 2480,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 2,
    merchant: "Blue Tokai Coffee",
    category: "Dining",
    date: "Today, 9:18 AM",
    amount: 420,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 3,
    merchant: "Uber",
    category: "Transport",
    date: "Yesterday",
    amount: 680,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 4,
    merchant: "Netflix Subscription",
    category: "Entertainment",
    date: "Yesterday",
    amount: 649,
    type: "Expense",
    status: "Pending",
  },
  {
    id: 5,
    merchant: "Theobroma",
    category: "Dining",
    date: "Oct 22, 2026",
    amount: 835,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 6,
    merchant: "Salary Deposit",
    category: "Income",
    date: "Oct 22, 2026",
    amount: 65000,
    type: "Income",
    status: "Completed",
  },
  {
    id: 7,
    merchant: "Flipkart",
    category: "Shopping",
    date: "Oct 21, 2026",
    amount: 1920,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 8,
    merchant: "IRCTC",
    category: "Travel",
    date: "Oct 18, 2026",
    amount: 2285,
    type: "Expense",
    status: "Pending",
  },
  {
    id: 9,
    merchant: "Apple App Store",
    category: "Entertainment",
    date: "Oct 17, 2026",
    amount: 499,
    type: "Expense",
    status: "Completed",
  },
  {
    id: 10,
    merchant: "Freelance Project",
    category: "Income",
    date: "Oct 16, 2026",
    amount: 18400,
    type: "Income",
    status: "Completed",
  },
];

function StatPill({ label, value, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_18px_rgba(24,28,66,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function Transactions({ searchQuery = "" }) {
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return transactions;

    return transactions.filter((transaction) =>
      `${transaction.merchant} ${transaction.category} ${transaction.status} ${transaction.type}`
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery]);

  const expenseTotal = filteredTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const incomeTotal = filteredTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const pendingCount = filteredTransactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;

  const expenseEntries = filteredTransactions.filter(
    (transaction) => transaction.type === "Expense",
  );
  const avgExpense =
    expenseEntries.length > 0 ? expenseTotal / expenseEntries.length : 0;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            <span className="size-1.5 rounded-full bg-violet-500" />
            Activity log
          </p>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Transactions
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200"
          >
            <Plus size={15} />
            Add transaction
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatPill
          label="Total expenses"
          value={money.format(expenseTotal)}
          icon={ArrowDownRight}
          tone="blue"
        />
        <StatPill
          label="Total income"
          value={money.format(incomeTotal)}
          icon={ArrowUpRight}
          tone="violet"
        />
        <StatPill
          label="Average spend"
          value={money.format(avgExpense)}
          icon={TrendingUp}
          tone="emerald"
        />
        <StatPill
          label="Pending"
          value={pendingCount.toString()}
          icon={CircleDollarSign}
          tone="amber"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(24,28,66,0.035)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent activity</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              A full view of your synced spending and income entries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Filter size={13} />
              Filters
            </button>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
              {filteredTransactions.length} items
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  Merchant
                </th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Category
                </th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Date
                </th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Type
                </th>
                <th className="px-4 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Amount
                </th>
                <th className="px-5 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-50 last:border-0 transition hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-9 items-center justify-center rounded-xl ${
                          transaction.type === "Income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        {transaction.type === "Income" ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-800">
                          {transaction.merchant}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {transaction.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[10px] text-slate-600">
                    {transaction.category}
                  </td>
                  <td className="px-4 py-3.5 text-[10px] text-slate-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                        transaction.type === "Income"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-[11px] font-semibold text-slate-900">
                    {transaction.type === "Income" ? "+" : "-"}
                    {money.format(transaction.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-right sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                        transaction.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No transactions match “{searchQuery}”.
          </div>
        )}
      </section>
    </div>
  );
}

export default Transactions;
