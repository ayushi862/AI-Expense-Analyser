
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
        data = await loginUser(email, password);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {isLogin
            ? "Login to manage your expenses."
            : "Register to start managing your expenses."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="ml-2 font-semibold text-violet-600"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <Link
          to="/"
          className="mt-5 block text-center text-xs text-slate-400"
        >
          AI Expense Analyser
        </Link>
      </div>
    </div>
  );
}

export default Auth;
