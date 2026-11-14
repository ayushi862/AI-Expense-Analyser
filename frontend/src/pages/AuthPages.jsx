import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const returnTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(fullName, email, password);
      } else {
        await login(email, password);
      }
      navigate(returnTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to authenticate. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-white bg-white p-7 shadow-[0_16px_50px_rgba(54,48,105,0.08)] sm:p-9">
        <Link
          to="/"
          className="text-sm font-bold tracking-tight text-violet-700"
        >
          SpendDiary
        </Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
          {isSignup ? "Create your account" : "Welcome back"}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {isSignup ? "Sign up" : "Log in"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Mock authentication is enabled for this frontend preview.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <label className="block text-xs font-semibold text-slate-700">
              Full name
              <input
                required
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          )}
          <label className="block text-xs font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Password
            <input
              required
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          {error && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          {isSignup ? "Already have an account?" : "New to SpendDiary?"}{" "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="font-semibold text-violet-700 hover:text-violet-900"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}

export function Login() {
  return <AuthForm mode="login" />;
}

export function Signup() {
  return <AuthForm mode="signup" />;
}
