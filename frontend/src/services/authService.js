const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, body) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function createSession(data) {
  return {
    token: data.token,
    user: {
      id: data.user.id,
      name: data.user.name,
      fullName: data.user.name,
      email: data.user.email,
      role: data.user.role || "user",
    },
  };
}

export async function login(email, password) {
  const data = await apiRequest("/login", {
    email,
    password,
  });

  return createSession(data);
}

export async function signup(fullName, email, password) {
  await apiRequest("/register", {
    name: fullName,
    email,
    password,
  });

  const data = await apiRequest("/login", {
    email,
    password,
  });

  return createSession(data);
}