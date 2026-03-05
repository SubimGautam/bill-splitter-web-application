// src/lib/actions/admin-actions.ts

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  console.log(`📡 Fetching: ${API_BASE_URL}${endpoint}`);
  
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  const data = await res.json();
  console.log(`📥 Response status: ${res.status}`, data);
  
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data.data;
}

// Get all users (admin only)
export async function getUsers() {
  return fetchWithAuth("/admin/users");
}

// Delete a user (admin only)
export async function deleteUser(userId: string) {
  return fetchWithAuth(`/admin/users/${userId}`, { method: "DELETE" });
}

// Get all groups (admin only)
export async function getGroups() {
  return fetchWithAuth("/admin/groups");
}

// Delete a group (admin only)
export async function deleteGroup(groupId: string) {
  return fetchWithAuth(`/admin/groups/${groupId}`, { method: "DELETE" });
}

// Get all expenses (admin only)
export async function getAllExpenses() {
  return fetchWithAuth("/admin/expenses");
}

// Get all settlements (admin only)
export async function getAllSettlements() {
  return fetchWithAuth("/admin/settlements");
}

// Get current admin user profile
export async function getCurrentUser() {
  return fetchWithAuth("/users/me");
}

// Update admin profile
export async function updateProfile(formData: FormData) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  
  const res = await fetch(`${API_BASE_URL}/users/update-profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Update failed");
  }
  return data;
}

// Add getStats function for admin dashboard
export async function getStats() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return { users: 0, groups: 0, settlements: 0, expenses: 0 };
    }

    // Fetch users count
    const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const usersData = await usersRes.json();
    const users = usersData.success ? usersData.data.length : 0;

    // Fetch groups
    const groupsRes = await fetch(`${API_BASE_URL}/admin/groups`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const groupsData = await groupsRes.json();
    const groups = groupsData.success ? groupsData.data : [];
    
    let totalExpenses = 0;
    let totalSettlements = 0;

    for (const group of groups) {
      try {
        const groupDetailRes = await fetch(`${API_BASE_URL}/groups/${group._id}/balances`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const groupDetailData = await groupDetailRes.json();
        
        if (groupDetailData.success && groupDetailData.data) {
          if (groupDetailData.data.expenses && Array.isArray(groupDetailData.data.expenses)) {
            totalExpenses += groupDetailData.data.expenses.length;
          }
          if (groupDetailData.data.settlements && Array.isArray(groupDetailData.data.settlements)) {
            totalSettlements += groupDetailData.data.settlements.length;
          }
        }
      } catch (error) {
        console.error(`Error fetching details for group ${group._id}:`, error);
      }
    }

    return { 
      users, 
      groups: groups.length, 
      settlements: totalSettlements, 
      expenses: totalExpenses 
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { users: 0, groups: 0, settlements: 0, expenses: 0 };
  }
}