import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StatCard from "../components/StatCard";
import {
  expenseAccounts,
  expenseCategories,
  initialExpenses,
} from "../data/expenses";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const categoryColors = [
  "#6254d9",
  "#8c7cf2",
  "#5b9cf5",
  "#41c5d9",
  "#f59e0b",
  "#f472b6",
  "#34d399",
  "#fb7185",
  "#64748b",
  "#a78bfa",
  "#2dd4bf",
  "#c5c6e8",
];

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const monthKey = (date) => date.slice(0, 7);

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthLabel(value) {
  return new Date(`${value}-01T12:00:00`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function ExpenseModal({ expense, onClose, onSave }) {
  const [values, setValues] = useState(() => ({
    amount: expense?.amount ?? "",
    date: expense?.date ?? today(),
    category: expense?.category ?? "Food",
    merchant: expense?.merchant ?? "",
    account: expense?.account ?? expenseAccounts[0],
    paymentMode: expense?.paymentMode ?? "UPI",
    notes: expense?.notes ?? "",
  }));
  const [error, setError] = useState("");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(values.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!values.date || !values.category) {
      setError("Date and category are required.");
      return;
    }

    onSave({ ...values, amount });
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ReceiptText size={19} />
            </span>
            <h2
              id="expense-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {expense ? "Edit expense" : "Add expense"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Record the details of your spending.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close expense form"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-700">
              Amount (₹) *
              <input
                autoFocus
                required
                type="number"
                min="0.01"
                step="0.01"
                value={values.amount}
                onChange={(event) => update("amount", event.target.value)}
                placeholder="0"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Date *
              <input
                required
                type="date"
                value={values.date}
                onChange={(event) => update("date", event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Category *
              <select
                required
                value={values.category}
                onChange={(event) => update("category", event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                {expenseCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Account
              <select
                value={values.account}
                onChange={(event) => update("account", event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                {expenseAccounts.map((account) => (
                  <option key={account}>{account}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Merchant / description
              <input
                value={values.merchant}
                onChange={(event) => update("merchant", event.target.value)}
                placeholder="e.g. Coffee shop"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Payment mode
              <select
                value={values.paymentMode}
                onChange={(event) => update("paymentMode", event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-700">
            Notes
            <textarea
              rows="2"
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Add a note (optional)"
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          {error && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:brightness-105"
          >
            <Plus size={16} />
            {expense ? "Save changes" : "Save expense"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [modalExpense, setModalExpense] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");

  const currentMonth = today().slice(0, 7);
  const months = useMemo(
    () =>
      [...new Set([currentMonth, ...expenses.map((expense) => monthKey(expense.date))])]
        .sort()
        .reverse(),
    [currentMonth, expenses],
  );
  const currentMonthExpenses = expenses.filter(
    (expense) => monthKey(expense.date) === currentMonth,
  );
  const currentMonthTotal = currentMonthExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const elapsedDays = new Date().getDate();
  const categoryTotals = currentMonthExpenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});
  const highestCategory = Object.entries(categoryTotals).sort(
    (first, second) => second[1] - first[1],
  )[0]?.[0];
  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount], index) => ({
      category,
      amount,
      color: categoryColors[index % categoryColors.length],
    }),
  );

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesQuery =
        !query ||
        `${expense.merchant} ${expense.category} ${expense.account} ${expense.paymentMode} ${expense.notes}`
          .toLowerCase()
          .includes(query);
      return (
        matchesQuery &&
        (monthFilter === "all" || monthKey(expense.date) === monthFilter) &&
        (categoryFilter === "all" || expense.category === categoryFilter) &&
        (accountFilter === "all" || expense.account === accountFilter)
      );
    });
  }, [accountFilter, categoryFilter, expenses, monthFilter, search]);

  function saveExpense(values) {
    if (modalExpense) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === modalExpense.id ? { ...expense, ...values } : expense,
        ),
      );
    } else {
      setExpenses((current) => [{ ...values, id: Date.now() }, ...current]);
    }
    closeModal();
  }

  function closeModal() {
    setModalOpen(false);
    setModalExpense(null);
  }

  function deleteExpense(id) {
    if (window.confirm("Delete this expense? This action cannot be undone.")) {
      setExpenses((current) => current.filter((expense) => expense.id !== id));
    }
  }

  const stats = [
    {
      title: "Total expenses this month",
      value: money.format(currentMonthTotal),
      change: `${currentMonthExpenses.length} items`,
      changeLabel: "recorded this month",
      icon: Wallet,
      tone: "blue",
    },
    {
      title: "Average daily spend",
      value: money.format(currentMonthTotal / Math.max(elapsedDays, 1)),
      change: "Daily average",
      changeLabel: "based on this month",
      icon: Banknote,
      tone: "violet",
    },
    {
      title: "Highest spending category",
      value: highestCategory || "—",
      change: highestCategory
        ? money.format(categoryTotals[highestCategory])
        : money.format(0),
      changeLabel: "this month",
      icon: ShoppingBag,
      tone: "cyan",
    },
    {
      title: "Number of expenses",
      value: currentMonthExpenses.length.toLocaleString("en-IN"),
      change: "This month",
      changeLabel: "expense entries",
      icon: CircleDollarSign,
      tone: "rose",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            <span className="size-1.5 rounded-full bg-violet-500" />
            Spending overview
          </p>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and organize where your money goes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-xs font-semibold text-white shadow-md shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200 sm:self-auto"
        >
          <Plus size={16} />
          Add expense
        </button>
      </section>

      <section
        aria-label="Expense summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(24,28,66,0.035)]">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Expense history
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Search, filter, and manage your expense entries.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <label className="relative sm:col-span-2 xl:col-span-1">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search expenses..."
                    aria-label="Search expenses"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </label>
                <select
                  aria-label="Filter by month"
                  value={monthFilter}
                  onChange={(event) => setMonthFilter(event.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 outline-none focus:border-violet-300"
                >
                  <option value="all">All months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {monthLabel(month)}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter by category"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 outline-none focus:border-violet-300"
                >
                  <option value="all">All categories</option>
                  {expenseCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by account"
                  value={accountFilter}
                  onChange={(event) => setAccountFilter(event.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 outline-none focus:border-violet-300"
                >
                  <option value="all">All accounts</option>
                  {expenseAccounts.map((account) => (
                    <option key={account}>{account}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[690px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {["Merchant", "Category", "Date", "Account", "Amount", ""].map(
                    (heading, index) => (
                      <th
                        key={`${heading}-${index}`}
                        className={`px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 ${
                          index === 0 ? "pl-5 sm:pl-6" : ""
                        } ${index === 4 ? "text-right" : ""}`}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-slate-50 last:border-0 transition hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 pl-5 sm:pl-6">
                      <p className="text-[11px] font-semibold text-slate-800">
                        {expense.merchant || expense.category}
                      </p>
                      {expense.notes && (
                        <p className="mt-0.5 max-w-36 truncate text-[10px] text-slate-400">
                          {expense.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[10px] text-slate-500">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-500">
                      {expense.account}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-semibold text-slate-800">
                      {money.format(expense.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${expense.merchant || expense.category}`}
                          onClick={() => {
                            setModalExpense(expense);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${expense.merchant || expense.category}`}
                          onClick={() => deleteExpense(expense.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-xs text-slate-500"
                    >
                      No expenses match the selected search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Category split
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              This month&apos;s expenses by category
            </p>
          </div>
          {categoryData.length > 0 ? (
            <>
              <div className="relative mx-auto mt-2 h-[205px] max-w-[290px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={58}
                      outerRadius={84}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categoryData.map((item) => (
                        <Cell key={item.category} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [money.format(value), "Spent"]}
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
                  <span className="text-[10px] text-slate-400">This month</span>
                  <span className="mt-1 text-sm font-bold text-slate-900">
                    {money.format(currentMonthTotal)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {categoryData.slice(0, 5).map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center gap-2 text-[10px]"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 truncate text-slate-500">
                      {item.category}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {money.format(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-xs text-slate-500">
              No expenses recorded this month yet.
            </div>
          )}
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50/70 px-3 py-2.5 text-[10px] text-blue-800">
            <CalendarDays size={14} className="shrink-0" />
            <span>Expenses are shown in Indian rupees.</span>
            <CreditCard size={14} className="ml-auto shrink-0" />
          </div>
        </article>
      </section>

      {modalOpen && (
        <ExpenseModal
          expense={modalExpense}
          onClose={closeModal}
          onSave={saveExpense}
        />
      )}
    </div>
  );
}

export default Expenses;
