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
  // Auth endpoints
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

  // Forgot password endpoints
  forgotPassword: async (email: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to send reset code');
    }
    return data.data;
  },

  verifyCode: async (email: string, code: string): Promise<{ resetToken: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid code');
    }
    return data.data; // expected to contain resetToken
  },

  resetPassword: async (resetToken: string, password: string, confirmPassword: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Password reset failed');
    }
  },

  // User profile
  getProfile: async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to get profile");
    return data.data;
  },
};

// Export API_BASE_URL for other uses
export { API_BASE_URL };