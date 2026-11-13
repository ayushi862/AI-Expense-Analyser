import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

const pageTitles = {
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/assistant": "AI Assistant",
  "/settings": "Settings",
};

function ComingSoon({ title }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-white bg-white p-10 text-center shadow-[0_16px_50px_rgba(54,48,105,0.08)]">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-violet-700">
          <Sparkles size={25} />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Coming soon
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          This section is on the roadmap. Your expense overview is ready in the
          meantime.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </section>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen min-w-0 lg:pl-[260px]">
        <Navbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <Routes>
            <Route
              path="/"
              element={<Dashboard searchQuery={searchQuery} />}
            />
            {Object.entries(pageTitles).map(([path, pageTitle]) => (
              <Route
                key={path}
                path={path}
                element={<ComingSoon title={pageTitle} />}
              />
            ))}
            <Route path="*" element={<ComingSoon title="Page not found" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
