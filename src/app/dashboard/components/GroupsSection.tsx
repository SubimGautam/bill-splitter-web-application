"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Group } from "@/lib/api";

interface GroupsSectionProps {
  groups: Group[];
  onGroupCreated: () => void;
}

export const GroupsSection = ({ groups, onGroupCreated }: GroupsSectionProps) => {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");

  const addMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || members.length === 0) return;
    try {
      await api.createGroup({ name: newGroupName, members });
      setShowCreateModal(false);
      setNewGroupName("");
      setMembers([]);
      onGroupCreated();
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  // Debug: Log the groups to see what we're getting
  console.log("GroupsSection received groups:", groups);

  const handleGroupClick = (group: Group) => {
    // Try multiple possible ID fields
    const groupId = group.id || group.id || (group as any).groupId;
    
    console.log("Clicked group object:", group);
    console.log("Extracted groupId:", groupId);
    
    if (!groupId) {
      console.error("No valid ID found in group:", group);
      alert("Error: Group has no ID");
      return;
    }
    
    // Navigate to the group page
    router.push(`/groups/${groupId}`);
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Groups</h2>
        <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
          + New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div style={styles.emptyState}>
          <p>You don't have any groups yet.</p>
          <button onClick={() => setShowCreateModal(true)} style={styles.emptyButton}>
            Create your first group
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {groups.map((group, index) => {
            // Get the ID - try multiple possibilities
            const groupId = group.id || group.id || (group as any).groupId;
            const displayId = groupId || "no-id";
            
            return (
              <div
                key={displayId + index} // Fallback key if ID is missing
                onClick={() => handleGroupClick(group)}
                style={styles.card}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow || "")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.boxShadow = styles.card.boxShadow || "")
                }
              >
                <h3 style={styles.cardTitle}>{group.name || "Unnamed Group"}</h3>
                <p style={styles.cardMeta}>{group.members?.length || 0} members</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardLabel}>Total balance</span>
                  <span style={styles.cardBalance}>
                    Rs {(group.totalBalance || 0).toFixed(2)}
                  </span>
                </div>
                {/* Debug info - remove after fixing */}
                <div style={{ fontSize: "10px", color: "#999", marginTop: "10px" }}>
                  ID: {displayId}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create New Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={styles.input}
            />
            <div style={styles.memberSection}>
              <label style={styles.label}>Members</label>
              <div style={styles.memberInputGroup}>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  style={styles.memberInput}
                />
                <button onClick={addMember} style={styles.addButton}>
                  Add
                </button>
              </div>
              <div style={styles.memberList}>
                {members.map((name, idx) => (
                  <span key={idx} style={styles.memberChip}>
                    {name}
                    <button onClick={() => removeMember(idx)} style={styles.removeButton}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowCreateModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleCreateGroup} style={styles.submitButton}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#111827",
  },
  createButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f9fafb",
    borderRadius: "1rem",
    color: "#6b7280",
  },
  emptyButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
  },
  card: {
    cursor: "pointer",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.2s",
  },
  cardHover: {
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#111827",
  },
  cardMeta: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
  },
  cardLabel: {
    color: "#9ca3af",
  },
  cardBalance: {
    fontWeight: 600,
    color: "#111827",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "1rem",
    width: "400px",
    maxWidth: "90%",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
  },
  memberSection: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  memberInputGroup: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  memberInput: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  },
  addButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  memberList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  memberChip: {
    backgroundColor: "#e5e7eb",
    padding: "0.25rem 0.5rem",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
  },
  removeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: 1,
  },
  modalActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  submitButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
};