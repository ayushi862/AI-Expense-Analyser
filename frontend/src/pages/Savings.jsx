import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Lightbulb,
  Plus,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../components/StatCard";
import {
  incomeExpensesByMonth,
  initialSavingsGoals,
} from "../data/savings";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function SavingsModal({ mode, goal, onClose, onSave }) {
  const isContribution = mode === "contribution";
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(isContribution ? amount : targetAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!isContribution && (!name.trim() || !targetDate)) {
      setError("Goal name and target date are required.");
      return;
    }

    onSave(
      isContribution
        ? { amount: parsedAmount }
        : {
            name: name.trim(),
            targetAmount: parsedAmount,
            targetDate,
          },
    );
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
        aria-labelledby="savings-modal-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              {isContribution ? <Banknote size={19} /> : <Target size={19} />}
            </span>
            <h2
              id="savings-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {isContribution ? `Add money to ${goal.name}` : "Add a savings goal"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isContribution
                ? "Add to the amount you have saved so far."
                : "Give your next savings milestone a name and a target."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close savings form"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isContribution ? (
            <label className="block text-xs font-semibold text-slate-700">
              Amount to add (₹)
              <input
                autoFocus
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          ) : (
            <>
              <label className="block text-xs font-semibold text-slate-700">
                Goal name
                <input
                  autoFocus
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. New home"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Target amount (₹)
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={targetAmount}
                    onChange={(event) => setTargetAmount(event.target.value)}
                    placeholder="0"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Target date
                  <input
                    required
                    type="date"
                    value={targetDate}
                    onChange={(event) => setTargetDate(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </label>
              </div>
            </>
          )}
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
            {isContribution ? "Add to savings" : "Create goal"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Savings() {
  const [goals, setGoals] = useState(initialSavingsGoals);
  const [selectedMonth, setSelectedMonth] = useState(
    incomeExpensesByMonth[incomeExpensesByMonth.length - 1].monthKey,
  );
  const [modal, setModal] = useState(null);
  const selectedData =
    incomeExpensesByMonth.find((month) => month.monthKey === selectedMonth) ??
    incomeExpensesByMonth[incomeExpensesByMonth.length - 1];
  const savingsRate =
    selectedData.income > 0
      ? (selectedData.savings / selectedData.income) * 100
      : 0;
  const chartData = useMemo(
    () =>
      incomeExpensesByMonth.map((month) => ({
        ...month,
        savings: month.income - month.expenses,
      })),
    [],
  );

  const stats = [
    {
      title: "Total income",
      value: money.format(selectedData.income),
      change: selectedData.month,
      changeLabel: "selected month",
      icon: ArrowUpRight,
      tone: "blue",
    },
    {
      title: "Total expenses",
      value: money.format(selectedData.expenses),
      change: selectedData.month,
      changeLabel: "selected month",
      icon: ArrowDownRight,
      tone: "rose",
    },
    {
      title: "Net savings",
      value: money.format(selectedData.savings),
      change: selectedData.month,
      changeLabel: "income minus expenses",
      icon: Wallet,
      tone: "violet",
    },
    {
      title: "Savings rate",
      value: `${savingsRate.toFixed(1)}%`,
      change: "Saved",
      changeLabel: "of monthly income",
      icon: TrendingUp,
      tone: "cyan",
    },
  ];

  function saveGoal(goal) {
    setGoals((current) => [{ ...goal, id: Date.now(), savedAmount: 0 }, ...current]);
    setModal(null);
  }

  function addMoney({ amount }) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === modal.goal.id
          ? { ...goal, savedAmount: goal.savedAmount + amount }
          : goal,
      ),
    );
    setModal(null);
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            <span className="size-1.5 rounded-full bg-violet-500" />
            Income and goals
          </p>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Savings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            See how your income, spending, and goals are progressing.
          </p>
        </div>
        <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm sm:self-auto">
          <span className="sr-only">Select month</span>
          <CalendarDays size={15} className="text-violet-600" />
          <select
            aria-label="Select month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="h-10 min-w-32 bg-transparent pr-1 text-xs font-semibold outline-none"
          >
            {incomeExpensesByMonth.map((month) => (
              <option key={month.monthKey} value={month.monthKey}>
                {month.month} {month.monthKey.slice(0, 4)}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section
        aria-label="Savings summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Income vs expenses
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Monthly cash flow and savings over the last six months
              </p>
            </div>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
              Last 6 months
            </span>
          </div>
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
                barCategoryGap="24%"
              >
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
                  formatter={(value, name) => [money.format(value), name]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #eef0f6",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, .08)",
                    fontSize: "11px",
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#6254d9"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#5b9cf5"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="savings"
                  name="Savings"
                  fill="#41c5d9"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-500">
            {[
              ["Income", "#6254d9"],
              ["Expenses", "#5b9cf5"],
              ["Savings", "#41c5d9"],
            ].map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border border-violet-100 bg-gradient-to-br from-[#f2f1ff] via-[#f8f7ff] to-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
            <Lightbulb size={19} />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
            A little progress adds up
          </p>
          <h2 className="mt-2 text-lg font-bold leading-7 text-slate-900">
            You saved 37% of your income this month.
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Keep building the habit. Consistent saving can make long-term goals
            feel much closer.
          </p>
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span>{selectedData.month} savings rate</span>
              <span className="font-bold text-violet-700">
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100"
              role="progressbar"
              aria-label="Savings rate"
              aria-valuenow={Math.round(savingsRate)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
              />
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Savings goals</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Set a target and build your savings step by step.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: "goal" })}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl border border-violet-200 bg-violet-50 px-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 sm:self-auto"
          >
            <Plus size={15} />
            Add goal
          </button>
        </div>
        {goals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
                  : 0;
              return (
                <article
                  key={goal.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-violet-100 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Target size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xs font-bold text-slate-900">
                        {goal.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Target date:{" "}
                        {new Date(`${goal.targetDate}T12:00:00`).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">
                      {money.format(goal.savedAmount)}
                      <span className="ml-1 font-normal text-slate-400">
                        of {money.format(goal.targetAmount)}
                      </span>
                    </p>
                    <span className="text-[9px] text-slate-400">saved</span>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-label={`${goal.name} progress`}
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "contribution", goal })}
                    className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-[10px] font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                  >
                    <Plus size={13} />
                    Add money
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-xs text-slate-500">No savings goals yet.</p>
            <button
              type="button"
              onClick={() => setModal({ mode: "goal" })}
              className="mt-3 text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              Create your first goal
            </button>
          </div>
        )}
      </section>

      {modal && (
        <SavingsModal
          mode={modal.mode}
          goal={modal.goal}
          onClose={() => setModal(null)}
          onSave={modal.mode === "goal" ? saveGoal : addMoney}
        />
      )}
    </div>
  );
}

export default Savings;
