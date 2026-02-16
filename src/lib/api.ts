// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// ── Token Management ──
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token || document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] || null;
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=2592000; samesite=lax; secure`;
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!localStorage.getItem("user");
};

export const logout = () => {
  clearToken();
  window.location.href = "/authentication/login";
};

// ── Core Fetch with Auth & Error Handling ──
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  console.log(`🌐 Fetching: ${url}`);

  const res = await fetch(url, { ...options, headers });

  let data: ApiResponse<T>;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    console.error('❌ Invalid JSON response:', text.substring(0, 200));
    throw new Error(`Invalid JSON response: ${text.substring(0, 150)}...`);
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      window.location.href = "/authentication/login?session=expired";
      throw new Error("TOKEN_EXPIRED");
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  if (!data.success) {
    throw new Error(data.message || "API returned unsuccessful response");
  }

  return data;
}

// ── Types ──
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  _id?: string; // Some APIs use _id
}

export interface Group {
  id: string;
  name: string;
  members: number;
  totalBalance: number;
  memberDetails?: Array<{
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  }>;
  createdBy?: {
    _id: string;
    username: string;
  };
  totalExpenses?: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  groupName: string;
  youPaid?: boolean;
  youOwe?: number;
}

export interface Balance {
  userId: string;
  name: string;
  amount: number;
}

export interface DashboardData {
  groups: Group[];
  recentExpenses: Expense[];
  balances: Balance[];
  summary: {
    totalOwedToYou: number;
    totalYouOwe: number;
    pendingCount: number;
  };
}

export interface GroupDetails {
  group: Group & {
    members: Array<{
      _id: string;
      username: string;
      email: string;
      profileImage?: string;
    }>;
    createdBy: {
      _id: string;
      username: string;
      email: string;
      profileImage?: string;
    };
    totalExpenses: number;
  };
  expenses: Expense[];
  balances: Array<{
    userId: string;
    balance: number;
  }>;
  simplifiedDebts: Array<{
    from: string;
    to: string;
    amount: number;
  }>;
  userBalance: number;
  userBalanceText: string;
}

export interface SettlementData {
  from: string;
  to: string;
  amount: number;
  groupId: string;
}

export interface FriendRequest {
  id: string;
  user: User;
  createdAt: string;
}

// ── API Methods ──
export const api = {
  // ── User ──
  getMe: async (): Promise<User> => {
    const res = await fetchWithAuth<{ user: User }>("/users/me");
    return res.data!.user;
  },

  // ── Dashboard ──
  getDashboard: async (): Promise<DashboardData> => {
    const res = await fetchWithAuth<DashboardData>("/dashboard");
    return res.data!;
  },

  // ── Groups ──
  getGroups: async (): Promise<Group[]> => {
    const res = await fetchWithAuth<{ groups: Group[] }>("/groups");
    if (Array.isArray(res.data)) {
      return res.data as Group[];
    }
    return res.data!.groups || [];
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const res = await fetchWithAuth<Group>(`/groups/${groupId}`);
    return res.data!;
  },

  getGroupDetails: async (groupId: string): Promise<GroupDetails> => {
    const res = await fetchWithAuth<GroupDetails>(`/groups/${groupId}/details`);
    return res.data!;
  },

  // ✅ UPDATED: Create group with all member addition methods
  createGroup: async (data: { 
    name: string; 
    memberIds?: string[];
    memberEmails?: string[];
    memberUsernames?: string[];
  }): Promise<Group> => {
    const res = await fetchWithAuth<Group>("/groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  addMemberToGroup: async (groupId: string, userId: string): Promise<Group> => {
    const res = await fetchWithAuth<Group>(`/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return res.data!;
  },

  // ✅ UPDATED: Search users (returns User array)
  searchUsers: async (query: string): Promise<User[]> => {
    const res = await fetchWithAuth<{ data: User[] }>(`/groups/search?query=${encodeURIComponent(query)}`);
    // Handle different response formats
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data!.data || [];
  },

  // ✅ UPDATED: Get friends (returns User array)
  getFriends: async (): Promise<User[]> => {
    const res = await fetchWithAuth<{ data: User[] }>("/friends");
    // Handle different response formats
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data!.data || [];
  },

  // ── Expenses ──
  getRecentExpenses: async (): Promise<Expense[]> => {
    const res = await fetchWithAuth<{ expenses: Expense[] }>("/expenses/recent");
    if (Array.isArray(res.data)) {
      return res.data as Expense[];
    }
    return res.data!.expenses || [];
  },

  getGroupExpenses: async (groupId: string): Promise<Expense[]> => {
    const res = await fetchWithAuth<{ expenses: Expense[] }>(`/expenses/group/${groupId}`);
    if (Array.isArray(res.data)) {
      return res.data as Expense[];
    }
    return res.data!.expenses || [];
  },

  createExpense: async (data: {
    description: string;
    amount: number;
    paidBy: string;
    splitWith: string[];
    groupId: string;
    splitType?: 'equal' | 'unequal' | 'percentage' | 'exact';
    participants?: Array<{ userId: string; value?: number; percentage?: number }>;
  }): Promise<Expense> => {
    const res = await fetchWithAuth<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  updateExpense: async (expenseId: string, data: Partial<Expense>): Promise<Expense> => {
    const res = await fetchWithAuth<Expense>(`/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  deleteExpense: async (expenseId: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetchWithAuth<{ success: boolean; message: string }>(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
    return res.data!;
  },

  // ── Balances ──
  getBalances: async (): Promise<Balance[]> => {
    const res = await fetchWithAuth<{ balances: Balance[] }>("/balances");
    if (Array.isArray(res.data)) {
      return res.data as Balance[];
    }
    return res.data!.balances || [];
  },

  getGroupBalances: async (groupId: string): Promise<Balance[]> => {
    const res = await fetchWithAuth<{ balances: Balance[] }>(`/balances/group/${groupId}`);
    if (Array.isArray(res.data)) {
      return res.data as Balance[];
    }
    return res.data!.balances || [];
  },

  // ── Friends ──
  getPendingFriendRequests: async (): Promise<FriendRequest[]> => {
    const res = await fetchWithAuth<{ data: FriendRequest[] }>("/friends/pending");
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data!.data || [];
  },

  sendFriendRequest: async (username: string): Promise<any> => {
    const res = await fetchWithAuth("/friends/request", {
      method: "POST",
      body: JSON.stringify({ username })
    });
    return res.data;
  },

  acceptFriendRequest: async (requestId: string): Promise<any> => {
    const res = await fetchWithAuth(`/friends/accept/${requestId}`, {
      method: "POST"
    });
    return res.data;
  },

  // ── Settlements ──
  settleUp: async (data: SettlementData): Promise<any> => {
    const res = await fetchWithAuth("/settlements", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return res.data;
  },

  getGroupSettlements: async (groupId: string): Promise<any[]> => {
    const res = await fetchWithAuth<{ data: any[] }>(`/settlements/group/${groupId}`);
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data!.data || [];
  },

  // ── Profile ──
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await fetchWithAuth<User>("/users/update-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  // ── Health Check ──
  healthCheck: async (): Promise<{ status: string }> => {
    const res = await fetchWithAuth<{ status: string }>("/health");
    return res.data!;
  },
};