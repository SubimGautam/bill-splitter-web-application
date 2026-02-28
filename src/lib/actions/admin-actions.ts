"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  const data = await res.json();
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

export async function getAllSettlements() {
  return fetchWithAuth("/admin/settlements");
}

export async function getAllExpenses() {
  return fetchWithAuth("/admin/expenses");
}

// Delete a group (admin only)
export async function deleteGroup(groupId: string) {
  return fetchWithAuth(`/admin/groups/${groupId}`, { method: "DELETE" });
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