"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/actions/admin-actions";
import { useRouter } from "next/navigation";
import { FiTrash2, FiSearch, FiUser } from "react-icons/fi";

export default function UserTable({ users }: { users: any[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    u => u.username?.toLowerCase().includes(search.toLowerCase()) ||
         u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      router.refresh();
    } catch {
      alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const cols = "40px 1fr 1.5fr 100px 90px";

  return (
    <>
      <style>{`
        .user-row:hover { background: #fafafa !important; }
        .del-btn:hover:not(:disabled) { background: #fecaca !important; }
        .del-btn { transition: background 0.15s; }
        .user-row { transition: background 0.12s; }
      `}</style>
      <div style={{
        backgroundColor: "white",
        borderRadius: "0.875rem",
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        {/* Search + meta bar */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 0.875rem",
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            flex: 1, maxWidth: "320px",
          }}>
            <FiSearch size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "none", border: "none", outline: "none",
                fontSize: "0.8rem", color: "#374151", width: "100%",
              }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
            {filtered.length} of {users.length} users
          </span>
        </div>

        {/* Table head */}
        <div style={{
          display: "grid",
          gridTemplateColumns: cols,
          gap: "1rem",
          padding: "0.625rem 1.25rem",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #f3f4f6",
        }}>
          {["", "Username", "Email", "Role", "Action"].map(h => (
            <span key={h} style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <FiUser size={28} style={{ color: "#e5e7eb", margin: "0 auto 0.75rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
              {search ? "No users match your search" : "No users found"}
            </p>
          </div>
        ) : (
          filtered.map((user, idx) => {
            const initials = user.username?.charAt(0).toUpperCase() || "?";
            const isDeleting = deleting === user._id;
            const isAdmin = user.role === "admin";

            return (
              <div
                key={user._id}
                className="user-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: cols,
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.75rem 1.25rem",
                  borderBottom: idx < filtered.length - 1 ? "1px solid #f9fafb" : "none",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 700,
                }}>
                  {initials}
                </div>

                {/* Username */}
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", marginBottom: "1px" }}>
                    {user.username}
                  </p>
                </div>

                {/* Email */}
                <span style={{ fontSize: "0.8rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>

                {/* Role */}
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "3px 10px", borderRadius: "999px",
                  fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize",
                  backgroundColor: isAdmin ? "#fffbeb" : "#f0fdf4",
                  color: isAdmin ? "#d97706" : "#10b981",
                  border: `1px solid ${isAdmin ? "#fde68a" : "#d1fae5"}`,
                  width: "fit-content",
                }}>
                  {user.role}
                </span>

                {/* Delete */}
                <button
                  className="del-btn"
                  onClick={() => handleDelete(user._id)}
                  disabled={isDeleting}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "0.375rem 0.625rem",
                    backgroundColor: "#fee2e2", color: "#dc2626",
                    border: "none", borderRadius: "0.375rem",
                    fontSize: "0.72rem", fontWeight: 600,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.5 : 1,
                    width: "fit-content",
                  }}
                >
                  <FiTrash2 size={11} />
                  {isDeleting ? "..." : "Delete"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}