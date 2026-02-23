"use client";

import { useState } from "react";
import { deleteGroup } from "@/lib/actions/admin-actions";
import { useRouter } from "next/navigation";
import { FiTrash2, FiUsers, FiCalendar, FiSearch, FiFolder } from "react-icons/fi";

export default function GroupsTable({ groups }: { groups: any[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this group? All expenses and settlements will be removed.")) return;
    setDeleting(id);
    try {
      await deleteGroup(id);
      router.refresh();
    } catch {
      alert("Failed to delete group");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];

  return (
    <>
      <style>{`
        .group-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
        .group-card { transition: box-shadow 0.2s, transform 0.2s; }
        .del-icon-btn:hover:not(:disabled) { background: #fee2e2 !important; color: #dc2626 !important; }
        .del-icon-btn { transition: background 0.15s, color 0.15s; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.5rem 0.875rem",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.625rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          maxWidth: "360px",
        }}>
          <FiSearch size={15} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: "none", border: "none", outline: "none",
              fontSize: "0.875rem", color: "#374151", width: "100%",
            }}
          />
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div style={{
            backgroundColor: "white", borderRadius: "0.875rem",
            border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "3.5rem", textAlign: "center",
          }}>
            <FiFolder size={32} style={{ color: "#e5e7eb", margin: "0 auto 0.75rem" }} />
            <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "4px" }}>No groups found</p>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              {searchTerm ? "Try a different search term" : "No groups have been created yet"}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}>
            {filtered.map((group, gi) => {
              const accent = COLORS[gi % COLORS.length];
              const isDeleting = deleting === group._id;
              return (
                <div key={group._id} className="group-card" style={{
                  backgroundColor: "white",
                  borderRadius: "0.875rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}>
                  {/* Accent bar */}
                  <div style={{ height: "3px", backgroundColor: accent }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{
                          width: "38px", height: "38px", borderRadius: "10px",
                          backgroundColor: `${accent}18`, border: `1px solid ${accent}30`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <FiFolder size={17} style={{ color: accent }} />
                        </div>
                        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                          {group.name}
                        </h3>
                      </div>
                      <button
                        className="del-icon-btn"
                        onClick={() => handleDelete(group._id)}
                        disabled={isDeleting}
                        style={{
                          padding: "0.375rem",
                          background: "none", border: "none",
                          borderRadius: "0.375rem",
                          color: "#9ca3af", cursor: isDeleting ? "not-allowed" : "pointer",
                          opacity: isDeleting ? 0.5 : 1,
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FiUsers size={13} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {group.members?.length || 0} members
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FiCalendar size={13} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          Created {formatDate(group.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Member tags */}
                    {group.members && group.members.length > 0 && (
                      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "0.875rem" }}>
                        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Members</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                          {group.members.slice(0, 4).map((member: string, idx: number) => (
                            <span key={idx} style={{
                              padding: "3px 8px", borderRadius: "5px",
                              fontSize: "0.72rem", fontWeight: 500,
                              backgroundColor: "#f3f4f6", color: "#4b5563",
                            }}>
                              {member}
                            </span>
                          ))}
                          {group.members.length > 4 && (
                            <span style={{
                              padding: "3px 8px", borderRadius: "5px",
                              fontSize: "0.72rem", fontWeight: 500,
                              backgroundColor: "#f3f4f6", color: "#9ca3af",
                            }}>
                              +{group.members.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          Showing {filtered.length} of {groups.length} groups
        </p>
      </div>
    </>
  );
}