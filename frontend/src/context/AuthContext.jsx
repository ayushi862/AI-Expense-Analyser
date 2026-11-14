import { useEffect, useState } from "react";
import * as authService from "../services/authService";
import AuthContext from "./authContext";

const STORAGE_KEY = "spenddiary_auth";

function readStoredSession() {
  const storedSession = window.localStorage.getItem(STORAGE_KEY);
  if (!storedSession) return { user: null, token: null };

  try {
    const session = JSON.parse(storedSession);
    if (session?.token && session?.user) return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    if (session.token && session.user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  async function login(email, password) {
    const nextSession = await authService.login(email, password);
    setSession(nextSession);
    return nextSession;
  }

  async function signup(fullName, email, password) {
    const nextSession = await authService.signup(fullName, email, password);
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    setSession({ user: null, token: null });
  }

  return (
    <AuthContext.Provider
      value={{ user: session.user, token: session.token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
