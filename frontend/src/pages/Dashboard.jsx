import { useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Banknote,
  Check,
  ChevronDown,
  CircleAlert,
  CloudUpload,
  Coffee,
  CreditCard,
  Lightbulb,
  Plus,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

const initialTransactions = [
  {
    id: 1,
    merchant: "Whole Foods Market",
    category: "Groceries",
    date: "Today, 10:42 AM",
    amount: 2480,
    status: "Completed",
    icon: ShoppingBag,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 2,
    merchant: "Blue Tokai Coffee",
    category: "Dining",
    date: "Today, 9:18 AM",
    amount: 420,
    status: "Completed",
    icon: Coffee,
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 3,
    merchant: "Uber",
    category: "Transport",
    date: "Yesterday",
    amount: 680,
    status: "Completed",
    icon: ArrowRight,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: 4,
    merchant: "Netflix Subscription",
    category: "Entertainment",
    date: "Yesterday",
    amount: 649,
    status: "Pending",
    icon: CreditCard,
    color: "bg-rose-50 text-rose-600",
  },
  {
    id: 5,
    merchant: "Theobroma",
    category: "Dining",
    date: "Oct 22, 2026",
    amount: 835,
    status: "Completed",
    icon: Utensils,
    color: "bg-orange-50 text-orange-600",
  },
];

const spendingByMonth = [
  { month: "Jun", amount: 6420 },
  { month: "Jul", amount: 7350 },
  { month: "Aug", amount: 5980 },
  { month: "Sep", amount: 8240 },
  { month: "Oct", amount: 8908 },
  { month: "Nov", amount: 8500 },
];

const spendingByCategory = [
  { category: "Housing", amount: 35, color: "#6254d9" },
  { category: "Food & dining", amount: 24, color: "#8c7cf2" },
  { category: "Transport", amount: 16, color: "#5b9cf5" },
  { category: "Shopping", amount: 14, color: "#41c5d9" },
  { category: "Other", amount: 11, color: "#c5c6e8" },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-lg shadow-slate-900/10">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">
        {money.format(payload[0].value)}
      </p>
    </div>
  );
}

function AddExpenseModal({ onClose, onAdd }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Dining");

  function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!merchant.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onAdd({ merchant: merchant.trim(), amount: parsedAmount, category });
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Plus size={19} />
            </span>
            <h2
              id="add-expense-title"
              className="text-lg font-bold text-slate-900"
            >
              Add an expense
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Keep your spending overview up to date.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add expense form"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-700">
            Merchant
            <input
              required
              autoFocus
              value={merchant}
              onChange={(event) => setMerchant(event.target.value)}
              placeholder="e.g. Local grocery store"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-700">
              Amount (₹)
              <input
                required
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option>Dining</option>
                <option>Groceries</option>
                <option>Transport</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:brightness-105"
          >
            <Plus size={17} />
            Save expense
          </button>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ searchQuery }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [monthlySpending, setMonthlySpending] = useState(8500);
  const [remainingBudget, setRemainingBudget] = useState(11500);
  const [transactionCount, setTransactionCount] = useState(128);
  const uploadInput = useRef(null);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return transactions;
    return transactions.filter((transaction) =>
      `${transaction.merchant} ${transaction.category} ${transaction.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery, transactions]);

  function addExpense(expense) {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const categoryStyles = {
      Dining: { icon: Utensils, color: "bg-amber-50 text-amber-700" },
      Groceries: { icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
      Transport: { icon: ArrowRight, color: "bg-slate-100 text-slate-700" },
      Shopping: { icon: ShoppingBag, color: "bg-violet-50 text-violet-600" },
      Entertainment: { icon: CreditCard, color: "bg-rose-50 text-rose-600" },
      Other: { icon: BadgeIndianRupee, color: "bg-blue-50 text-blue-600" },
    };
    const style = categoryStyles[expense.category] ?? categoryStyles.Other;

    setTransactions((current) => [
      {
        id: Date.now(),
        merchant: expense.merchant,
        category: expense.category,
        date: today,
        amount: expense.amount,
        status: "Completed",
        ...style,
      },
      ...current,
    ]);
    setMonthlySpending((current) => current + expense.amount);
    setRemainingBudget((current) => current - expense.amount);
    setTransactionCount((current) => current + 1);
    setModalOpen(false);
    setNotice(`${money.format(expense.amount)} expense added successfully.`);
  }

  function handleStatementUpload(event) {
    const file = event.target.files?.[0];
    if (file) setNotice(`${file.name} is ready to be reviewed.`);
    event.target.value = "";
  }

  const stats = [
    {
      title: "Total expenses",
      value: money.format(25450 + monthlySpending - 8500),
      change: "+8.2%",
      changeLabel: "vs. last month",
      icon: Wallet,
      tone: "blue",
    },
    {
      title: "Monthly spending",
      value: money.format(monthlySpending),
      change: "-4.6%",
      changeLabel: "vs. last month",
      icon: Banknote,
      tone: "violet",
    },
    {
      title: "Transactions",
      value: transactionCount.toLocaleString("en-IN"),
      change: "+12.5%",
      changeLabel: "vs. last month",
      icon: CreditCard,
      tone: "cyan",
    },
    {
      title: "Remaining budget",
      value: money.format(remainingBudget),
      change: "On track",
      changeLabel: "of ₹20,000 monthly",
      icon: BadgeIndianRupee,
      tone: "rose",
    },
  ];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <section className="mb-6 flex flex-col justify-between gap-4 sm:mb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-violet-600">
            <span className="size-1.5 rounded-full bg-violet-500" />
            {formattedDate}
          </p>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">
            Your money, in focus.
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s your financial snapshot for this month.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <input
            ref={uploadInput}
            type="file"
            accept=".csv,.pdf,.xlsx,.xls"
            onChange={handleStatementUpload}
            className="hidden"
            aria-label="Choose a bank statement"
          />
          <button
            type="button"
            onClick={() => uploadInput.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <CloudUpload size={16} />
            Upload statement
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 text-xs font-semibold text-white shadow-md shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200"
          >
            <Plus size={16} />
            Add expense
          </button>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
        >
          <Check size={16} className="shrink-0" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="rounded-md p-1 transition hover:bg-emerald-100"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <section
        aria-label="Expense summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Spending overview
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Your monthly expenses over time
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
            >
              Last 6 months
              <ChevronDown size={13} />
            </button>
          </div>
          <div className="h-[255px] w-full sm:h-[275px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spendingByMonth}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
                barCategoryGap="34%"
              >
                <defs>
                  <linearGradient id="spendingBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6758dc" />
                    <stop offset="100%" stopColor="#9b8cf5" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#eef0f6"
                  strokeDasharray="3 5"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#98a0b3", fontSize: 10 }}
                  dy={9}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#98a0b3", fontSize: 10 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                  tickCount={5}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#f6f5ff", radius: 8 }}
                />
                <Bar
                  dataKey="amount"
                  name="Spending"
                  fill="url(#spendingBar)"
                  radius={[6, 6, 2, 2]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
            <span className="size-2 rounded-full bg-violet-500" />
            Monthly spending
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-emerald-600">
              <ArrowDownRight size={13} />
              4.6% less than October
            </span>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
          <div className="mb-1">
            <h2 className="text-sm font-bold text-slate-900">
              Spending by category
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Where your money goes
            </p>
          </div>
          <div className="relative mx-auto h-[225px] w-full max-w-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={66}
                  outerRadius={94}
                  paddingAngle={4}
                  stroke="none"
                >
                  {spendingByCategory.map((category) => (
                    <Cell key={category.category} fill={category.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "of expenses"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #eef0f6",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, .08)",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-medium text-slate-400">
                This month
              </span>
              <span className="mt-1 text-lg font-bold text-slate-900">
                {money.format(monthlySpending)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-1">
            {spendingByCategory.map((category) => (
              <div
                key={category.category}
                className="flex min-w-0 items-center gap-2"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="truncate text-[10px] text-slate-500">
                  {category.category}
                </span>
                <span className="ml-auto text-[10px] font-semibold text-slate-700">
                  {category.amount}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(24,28,66,0.035)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent transactions
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Your latest activity at a glance
              </p>
            </div>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 transition hover:text-violet-900"
            >
              View all transactions
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[610px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                    Merchant
                  </th>
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Date
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
                {filteredTransactions.slice(0, 5).map((transaction) => {
                  const Icon = transaction.icon;
                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-50 last:border-0 transition hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-3 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${transaction.color}`}
                          >
                            <Icon size={15} />
                          </span>
                          <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">
                            {transaction.merchant}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-500">
                        {transaction.category}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[10px] text-slate-500">
                        {transaction.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-semibold text-slate-800">
                        {money.format(transaction.amount)}
                      </td>
                      <td className="px-5 py-3 text-right sm:px-6">
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
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-xs text-slate-500"
                    >
                      No transactions match “{searchQuery}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_4px_18px_rgba(24,28,66,0.035)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#f2f1ff] via-[#f8f7ff] to-white px-5 pb-4 pt-5 sm:px-6">
            <div className="pointer-events-none absolute -right-6 -top-10 size-32 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="relative flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  AI spending insights
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  A little more clarity for your money
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4 px-5 py-4 sm:px-6">
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ShoppingBag size={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-800">
                  Housing is your top category
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  It accounts for 35% of your monthly spending.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CircleAlert size={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-800">
                  Dining is trending up
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  You&apos;ve spent 12% more on dining than last month.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Lightbulb size={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-800">
                  A small saving adds up
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  Cutting two takeout meals a week could save about ₹1,600 a
                  month.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check size={13} />
              </span>
              <p className="text-[10px] font-medium text-emerald-800">
                You&apos;re on track to stay within budget this month.
              </p>
              <ArrowUpRight
                size={14}
                className="ml-auto shrink-0 text-emerald-600"
              />
            </div>
          </div>
        </article>
      </section>

      {modalOpen && (
        <AddExpenseModal
          onClose={() => setModalOpen(false)}
          onAdd={addExpense}
        />
      )}
    </>
  );
}

export default Dashboard;