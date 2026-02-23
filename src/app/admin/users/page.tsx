import { getUsers } from "@/lib/actions/admin-actions";
import UserTable from "../_components/UserTable";
import { FiUsers } from "react-icons/fi";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>Users</h1>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Manage and monitor all registered users</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#f0fdf4", border: "1px solid #d1fae5",
          borderRadius: "0.625rem",
        }}>
          <FiUsers size={14} style={{ color: "#10b981" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
            {users.length} Users
          </span>
        </div>
      </div>
      <UserTable users={users} />
    </div>
  );
}