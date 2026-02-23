// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Group {
  _id: string;
  name: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  totalBalance?: number;
}

export interface ExpenseSplit {
  name: string;
  amount: number;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: string;
  group: string;
  date: string;
  splits: ExpenseSplit[];
}

export interface DashboardData {
  groups: Group[];
  recentExpenses: (Expense & { groupName: string })[];
}

// Token helpers
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Core fetch with auth
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  if (!data.success) throw new Error(data.message || "API error");
  return data.data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchWithAuth<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (username: string, email: string, password: string) =>
    fetchWithAuth<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  // User
  getMe: () => fetchWithAuth<User>("/users/me"),

  // Dashboard
  getDashboard: () => fetchWithAuth<DashboardData>("/dashboard"),

 getGroupWithBalances: (groupId: string) => 
  fetchWithAuth<any>(`/groups/${groupId}/balances`),

  createSettlement: (data: { from: string; to: string; amount: number; groupId: string }) =>
  fetchWithAuth<any>("/settlements", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  

  getGroupSettlements: (groupId: string) =>
  fetchWithAuth<any[]>(`/settlements/group/${groupId}`),

  // Groups
  getGroups: () => fetchWithAuth<Group[]>("/groups"),
  getGroup: (groupId: string) => fetchWithAuth<Group>(`/groups/${groupId}`),
  createGroup: (data: { name: string; members: string[] }) =>
    fetchWithAuth<Group>("/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGroup: (groupId: string, data: { name?: string; members?: string[] }) =>
    fetchWithAuth<Group>(`/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteGroup: (groupId: string) =>
    fetchWithAuth<{ message: string }>(`/groups/${groupId}`, { method: "DELETE" }),

  // Expenses
  getGroupExpenses: (groupId: string) => fetchWithAuth<Expense[]>(`/expenses/group/${groupId}`),
    createExpense: (data: {
    description: string;
    amount: number;
    paidBy: string;
    groupId: string;
  }) => fetchWithAuth("/expenses", { method: "POST", body: JSON.stringify(data) }),
  deleteExpense: (expenseId: string) =>
    fetchWithAuth<{ message: string }>(`/expenses/${expenseId}`, { method: "DELETE" }),
    createDetailedExpense: (data: {
    description: string;
    totalAmount: number;
    payments: { name: string; amount: number }[];
    splits: { name: string; amount: number }[];
    groupId: string;
  }) => fetchWithAuth("/expenses", { method: "POST", body: JSON.stringify(data) }),
};