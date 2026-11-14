import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  Check,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Menu,
  PieChart,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const features = [
  {
    icon: FileSpreadsheet,
    title: "CSV statement import",
    description:
      "Bring in a statement and get your transactions ready to understand in moments.",
    tone: "blue",
  },
  {
    icon: Sparkles,
    title: "AI categorisation",
    description:
      "Automatically organise spending into clear, useful categories.",
    tone: "violet",
  },
  {
    icon: Target,
    title: "Budgets with smart alerts",
    description:
      "Set category limits and get a heads-up at 80% and when you reach 100%.",
    tone: "cyan",
  },
  {
    icon: Repeat2,
    title: "Recurring payment detection",
    description:
      "Spot subscriptions and regular bills so you always know what is coming.",
    tone: "amber",
  },
  {
    icon: Bot,
    title: "AI chat assistant",
    description:
      "Ask plain-language questions about your habits and spending trends.",
    tone: "rose",
  },
  {
    icon: FileText,
    title: "Reports and exports",
    description:
      "Create PDF reports and export your transaction data to Excel.",
    tone: "emerald",
  },
];

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload a statement",
    description:
      "Import your bank statement as a CSV and bring your transactions together.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Let AI categorise",
    description:
      "Transactions are sorted into categories to make your money easier to read.",
  },
  {
    number: "03",
    icon: PieChart,
    title: "Get clear insights",
    description:
      "Explore trends, budgets, recurring payments, and practical ways to save.",
  },
];

const plans = [
  {
    name: "Free",
    description: "A clear start to smarter spending.",
    price: "₹0",
    period: "forever",
    features: [
      "Monthly spending dashboard",
      "CSV statement import",
      "Expense categories and budgets",
      "Basic spending insights",
    ],
    action: "Get started free",
    to: "/signup",
    featured: false,
  },
  {
    name: "Premium",
    description: "More depth for your financial picture.",
    price: "₹199",
    period: "per month",
    features: [
      "Everything in Free",
      "AI chat assistant",
      "Recurring payment detection",
      "PDF reports and Excel export",
    ],
    action: "Explore Premium",
    to: "/signup",
    featured: true,
  },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Logo() {
  return (
    <Link
      to="/"
      aria-label="SpendDiary home"
      className="flex shrink-0 items-center gap-2.5"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-violet-200/60">
        <Wallet size={19} strokeWidth={2.2} />
      </span>
      <span className="text-[17px] font-bold tracking-tight text-slate-900">
        SpendDiary
      </span>
    </Link>
  );
}

function PreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-400/20 to-violet-500/25 blur-2xl" />
      <div className="relative rounded-3xl border border-white/10 bg-white p-4 shadow-[0_30px_90px_rgba(4,8,35,0.35)] sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <PieChart size={16} />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-900">
                Monthly overview
              </p>
              <p className="text-[9px] text-slate-400">November 2026</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-2 py-1.5 text-[9px] font-semibold text-slate-500"
          >
            This month <ChevronDown size={11} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-3.5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium text-white/75">Spent so far</p>
              <ArrowDownRight size={14} className="text-white/75" />
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight">
              {money.format(42680)}
            </p>
            <p className="mt-1 text-[9px] text-white/75">within your monthly plan</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium text-slate-500">Saved</p>
              <ArrowUpRight size={14} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              {money.format(17320)}
            </p>
            <p className="mt-1 text-[9px] font-semibold text-emerald-600">
              +12% from last month
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-900">
                Spending breakdown
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">
                Your top categories this month
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">
              On track
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Housing", amount: 58, value: "₹24,000", color: "bg-violet-500" },
              { name: "Food & groceries", amount: 36, value: "₹9,840", color: "bg-blue-500" },
              { name: "Transport", amount: 22, value: "₹4,120", color: "bg-cyan-500" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className={`size-2 shrink-0 rounded-full ${item.color}`}
                />
                <span className="w-24 truncate text-[9px] text-slate-500">
                  {item.name}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.amount}%` }}
                  />
                </div>
                <span className="w-14 text-right text-[9px] font-semibold text-slate-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-violet-100 bg-violet-50/70 p-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
            <Sparkles size={14} />
          </span>
          <div>
            <p className="text-[9px] font-bold text-slate-800">
              A helpful insight
            </p>
            <p className="mt-0.5 text-[9px] leading-4 text-slate-500">
              You spent less on dining this month. Keep it up!
            </p>
          </div>
          <Bell size={13} className="ml-auto shrink-0 text-violet-400" />
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-semibold text-slate-500 transition hover:text-violet-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-xs font-semibold text-white shadow-md shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Go to dashboard
                <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-xs font-semibold text-white shadow-md shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 sm:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg sm:hidden">
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-xs font-semibold text-white"
                >
                  Go to dashboard <ArrowRight size={15} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <section className="relative isolate overflow-hidden bg-[#101329]">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-36 top-12 size-[500px] rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold text-indigo-100">
              <Sparkles size={13} className="text-violet-300" />
              A calmer way to understand your money
            </div>
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[58px]">
              Statements in.
              <span className="block bg-gradient-to-r from-blue-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Insights out.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Turn everyday transactions into a clearer picture of your
              spending, budgets, and savings goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-emerald-400" />
                Free to get started
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Your data stays yours
              </span>
            </div>
          </div>
          <PreviewCard />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f8fc] to-transparent" />
      </section>

      <section
        id="features"
        className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
              A clearer view of your finances
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Make every transaction count.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Simple tools to help you stay informed and feel in control of
              everyday spending.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, tone }) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(24,28,66,0.09)] sm:p-6"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-xl ${
                    tone === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : tone === "violet"
                        ? "bg-violet-50 text-violet-600"
                        : tone === "cyan"
                          ? "bg-cyan-50 text-cyan-700"
                          : tone === "amber"
                            ? "bg-amber-50 text-amber-700"
                            : tone === "rose"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-slate-100 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From statement to smarter choices.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article
                key={number}
                className="relative rounded-2xl border border-slate-100 bg-[#fbfbfe] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-100 text-violet-700">
                    <Icon size={20} />
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-violet-100">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Start simple. Grow when you&apos;re ready.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Pick a plan that fits the way you want to understand your money.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-3xl border p-6 shadow-[0_10px_36px_rgba(24,28,66,0.06)] sm:p-8 ${
                  plan.featured
                    ? "border-violet-300 bg-white ring-4 ring-violet-100/70"
                    : "border-slate-100 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}
                <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-slate-600"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.to}
                  className={`mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold transition hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-violet-200/70 hover:shadow-lg"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {plan.action}
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#101329] px-6 py-10 shadow-[0_18px_50px_rgba(16,19,41,0.18)] sm:px-10 sm:py-12 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-32 size-80 rounded-full bg-violet-500/25 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-36 left-1/4 size-72 rounded-full bg-blue-500/20 blur-[80px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
                Your next insight is a few clicks away
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to see your spending differently?
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Start with a free account and make your money easier to
                understand.
              </p>
            </div>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-xs font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              {user ? "Go to dashboard" : "Get started free"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-center text-[10px] text-slate-400">
            © {new Date().getFullYear()} SpendDiary. Your money, in focus.
          </p>
          <nav aria-label="Footer navigation" className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[10px] font-semibold text-slate-500 transition hover:text-violet-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-[10px] font-semibold text-slate-500 transition hover:text-violet-700"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

export default Home;
