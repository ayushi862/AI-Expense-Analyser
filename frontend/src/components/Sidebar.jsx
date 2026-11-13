import {
  ArrowLeftRight,
  Bot,
  ChartNoAxesCombined,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const mainItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets", path: "/budgets", icon: Wallet },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Reports", path: "/reports", icon: FileText },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#101329] px-4 pb-5 pt-6 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-2">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
            aria-label="AI Expense Analyser dashboard"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 p-1 shadow-lg shadow-violet-900/30">
              <img
                src="/src/assets/hero.png"
                alt=""
                className="size-full object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
              />
            </span>
            <span className="text-[15px] font-bold leading-tight tracking-tight">
              Spendwise
              <span className="mt-1 block text-[10px] font-medium tracking-[0.16em] text-indigo-200/75">
                AI EXPENSE ANALYSER
              </span>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>
        <nav aria-label="Main navigation" className="space-y-1">
          {mainItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-indigo-950/35"
                    : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.9} />
              <span className="flex-1">{name}</span>
              <ChevronRight
                size={15}
                className="opacity-0 transition group-hover:opacity-70"
              />
            </NavLink>
          ))}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Personal
        </p>
        <nav aria-label="Personal navigation" className="space-y-1">
          <NavLink
            to="/assistant"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              }`
            }
          >
            <Bot size={18} strokeWidth={1.9} />
            <span>AI Assistant</span>
            <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-violet-200">
              AI
            </span>
          </NavLink>
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              }`
            }
          >
            <Settings size={18} strokeWidth={1.9} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
            <Bot size={18} />
          </div>
          <p className="text-xs font-semibold text-white">Your money, smarter</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            Get a clearer picture of your spending with AI insights.
          </p>
          <NavLink
            to="/assistant"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-200 hover:text-white"
          >
            Explore AI
            <ChevronRight size={13} />
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;