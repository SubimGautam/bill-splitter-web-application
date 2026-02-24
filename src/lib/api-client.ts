const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
  // Also set cookie for middleware
  document.cookie = `token=${token}; path=/; max-age=604800; samesite=lax`;
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
};

// API functions
export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Login failed");
    return data.data;
  },

  register: async (username: string, email: string, password: string, confirmPassword: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Registration failed");
    return data.data;
  },
};