import { useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/useAuth";
import { Login, Signup } from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import {
  AdminOverview,
  AdminUsers,
  PlaceholderPage,
  Settings,
} from "./pages/PlaceholderPages";
import Expenses from "./pages/Expenses";
import Savings from "./pages/Savings";
import Transactions from "./pages/Transactions";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/expenses": "Expenses",
  "/savings": "Savings",
  "/budgets": "Budgets",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/ai-assistant": "AI Assistant",
  "/settings": "Settings",
  "/admin": "Admin overview",
  "/admin/users": "Admin users",
};

function GuestRoute() {
  const { token, user } = useAuth();
  return token && user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] ?? "Dashboard";

  function handleLogout() {
    logout();
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="min-h-screen min-w-0 lg:pl-[260px]">
        <Navbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/transactions" element={<TransactionsRoute />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/savings" element={<Savings />} />
          <Route
            path="/budgets"
            element={<PlaceholderPage title="Budgets" />}
          />
          <Route
            path="/analytics"
            element={<PlaceholderPage title="Analytics" />}
          />
          <Route
            path="/reports"
            element={<PlaceholderPage title="Reports" />}
          />
          <Route
            path="/ai-assistant"
            element={<PlaceholderPage title="AI Assistant" />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PlaceholderPage title="Page not found" />} />
    </Routes>
  );
}

function DashboardRoute() {
  const { searchQuery } = useOutletContext();
  return <Dashboard searchQuery={searchQuery} />;
}

function TransactionsRoute() {
  const { searchQuery } = useOutletContext();
  return <Transactions searchQuery={searchQuery} />;
}

export default App;
