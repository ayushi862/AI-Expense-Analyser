function createMockUser(email, fullName) {
  const normalizedEmail = email.trim().toLowerCase();
  const role = normalizedEmail.includes("admin")
    ? "admin"
    : normalizedEmail.includes("premium")
      ? "premium"
      : "user";
  const derivedName =
    fullName?.trim() ||
    normalizedEmail
      .split("@")[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return {
    id: normalizedEmail,
    fullName: derivedName,
    email: normalizedEmail,
    role,
  };
}

function createMockSession(email, fullName) {
  return {
    token: `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user: createMockUser(email, fullName),
  };
}

// TODO: Replace these mock implementations with POST /api/auth/login and POST /api/auth/register.
export async function login(email, password) {
  if (!email.trim() || !password) {
    throw new Error("Email and password are required.");
  }

  return createMockSession(email);
}

export async function signup(fullName, email, password) {
  if (!fullName.trim() || !email.trim() || !password) {
    throw new Error("Name, email, and password are required.");
  }

  return createMockSession(email, fullName);
}
