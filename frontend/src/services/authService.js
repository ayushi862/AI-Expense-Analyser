
const API_URL = "http://localhost:5000/api/auth";

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

export async function registerUser(name, email, password) {
  return apiRequest("/register", {
    name,
    email,
    password,
  });
}

export async function loginUser(email, password) {
  return apiRequest("/login", {
    email,
    password,
  });
}
