import { getGroups } from "@/lib/actions/admin-actions";
import GroupsTable from "../_components/GroupsTable";
import { FiFolder } from "react-icons/fi";

export default async function GroupsPage() {
  try {
    const groups = await getGroups();

    return (
      <div>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem" 
        }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
              Groups
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Manage and monitor all groups in the system
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#f0fdf4", border: "1px solid #d1fae5",
            borderRadius: "0.625rem",
          }}>
            <FiFolder size={14} style={{ color: "#10b981" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
              {groups.length} Groups
            </span>
          </div>
        </div>
        <GroupsTable groups={groups} />
      </div>
    );
  } catch {
    return (
      <div>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Groups</h1>
        </div>
        <div style={{
          backgroundColor: "white", borderRadius: "0.875rem",
          border: "1px solid #fecaca", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          padding: "2.5rem", textAlign: "center",
        }}>
          <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>Failed to load groups. Please try again later.</p>
        </div>
      </div>
    );
  }
}