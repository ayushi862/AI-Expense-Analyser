import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

function Navbar({ title, searchQuery, onSearchChange, onMenuClick }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 lg:hidden"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                {title === "Dashboard" ? "Welcome back, Sarah" : title}
              </p>
              <Sparkles
                size={15}
                className="hidden shrink-0 text-violet-500 sm:block"
              />
            </div>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              {title === "Dashboard"
                ? "Here’s what’s happening with your finances today."
                : "Your personal finance workspace"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Open transaction search"
              aria-expanded={searchOpen}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(80vw,280px)] rounded-xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-900/10">
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search transactions..."
                  aria-label="Search transactions"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
            )}
          </div>
          <label className="relative hidden w-52 md:block xl:w-64">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search transactions..."
              aria-label="Search transactions"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className="relative flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10">
                <p className="text-sm font-bold text-slate-900">
                  You’re all caught up
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your weekly spending summary is ready to review.
                </p>
                <div className="mt-3 rounded-xl bg-violet-50 p-3 text-xs font-medium text-violet-800">
                  Dining is 12% higher than last month.
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              className="flex items-center gap-2 rounded-xl p-1.5 pr-1 text-left transition hover:bg-slate-50"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-violet-300/50">
                SC
              </span>
              <span className="hidden sm:block">
                <span className="block text-xs font-semibold leading-4 text-slate-800">
                  Sarah Chen
                </span>
                <span className="block text-[10px] leading-4 text-slate-500">
                  Personal account
                </span>
              </span>
              <ChevronDown
                size={14}
                className="hidden text-slate-400 sm:block"
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-900/10">
                <p className="px-3 py-2 text-xs font-semibold text-slate-500">
                  Signed in as Sarah
                </p>
                <div className="h-px bg-slate-100" />
                <p className="px-3 py-2 text-xs text-slate-600">
                  Personal account
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;