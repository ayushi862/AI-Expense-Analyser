import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatCard({ title, value, change, changeLabel, icon: Icon, tone }) {
  const tones = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      trend: "bg-emerald-50 text-emerald-700",
      glow: "from-blue-500/10",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      trend: "bg-emerald-50 text-emerald-700",
      glow: "from-violet-500/10",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-700",
      trend: "bg-emerald-50 text-emerald-700",
      glow: "from-cyan-500/10",
    },
    rose: {
      icon: "bg-rose-50 text-rose-600",
      trend: "bg-amber-50 text-amber-700",
      glow: "from-rose-500/10",
    },
  };
  const colors = tones[tone] ?? tones.blue;
  const isPositive = !change.startsWith("-");
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(24,28,66,0.035)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(24,28,66,0.09)] sm:p-5">
      <div
        className={`pointer-events-none absolute -right-7 -top-8 size-28 rounded-full bg-gradient-to-br ${colors.glow} to-transparent blur-2xl`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-[25px] font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
        >
          <Icon size={19} strokeWidth={2} />
        </span>
      </div>
      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-bold ${colors.trend}`}
        >
          <TrendIcon size={12} />
          {change}
        </span>
        <span className="text-[10px] text-slate-400">{changeLabel}</span>
      </div>
    </article>
  );
}

export default StatCard;