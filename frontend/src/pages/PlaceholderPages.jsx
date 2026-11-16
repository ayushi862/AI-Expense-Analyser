import { Link } from "react-router-dom";

export function PlaceholderPage({ title, description }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-white bg-white p-10 text-center shadow-[0_16px_50px_rgba(54,48,105,0.08)]">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Coming soon
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          {description || "We’re working on this section. Check back soon."}
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-6 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-white bg-white p-10 text-center shadow-[0_16px_50px_rgba(54,48,105,0.08)]">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Coming soon
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome to SpendDiary
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Your personal expense insights are coming soon. Sign in to continue
          to your dashboard.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}

export function Settings() {
  return <PlaceholderPage title="Settings" />;
}

export function AdminOverview() {
  return <PlaceholderPage title="Admin overview" />;
}

export function AdminUsers() {
  return <PlaceholderPage title="Admin users" />;
}
