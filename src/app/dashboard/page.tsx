"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, type Group } from "@/lib/api";
import { 
  FiHome, 
  FiCreditCard, 
  FiTrendingUp, 
  FiFileText, 
  FiPieChart, 
  FiSettings,
  FiUser,
  FiPlus,
  FiCheck,
  FiX,
  FiClock,
  FiDollarSign,
  FiUsers
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for the professional UI
  const mockParticipations = [
    {
      name: "Sujal Gauchan",
      amount: 28.20,
      status: "pending",
      avatar: "S"
    },
    {
      name: "Miraj Gansi",
      amount: 28.20,
      status: "pending",
      avatar: "M"
    },
    {
      name: "Alina Lync",
      amount: 35.20,
      status: "pending",
      avatar: "A",
      pendingBill: {
        place: "Kasturi Bar",
        total: 440.00,
        percentage: 55
      }
    },
    {
      name: "Ted Mosby",
      amount: 28.20,
      status: "pending",
      avatar: "T",
      pendingBill: {
        place: "Part and Grill",
        total: 380.60,
        percentage: 75
      }
    }
  ];

  const mockFriends = [
    { name: "Sushant", avatar: "S", online: true },
    { name: "Jessica", avatar: "J", online: false },
    { name: "Rojan", avatar: "R", online: true }
  ];

  const mockNotifications = [
    {
      from: "Ted",
      message: "requested you for a Splitbill payment of $72.80 from Sushi & bar",
      time: "5 min ago",
      amount: 72.10,
      totalBill: 360.80
    }
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await api.getGroups();
      setGroups(data);
    } catch (err) {
      console.error("Failed to load groups:", err);
    } finally {
      setLoading(false);
    }
  };

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
      loadGroups();
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "wallet", label: "My Wallet", icon: FiCreditCard },
    { id: "transfers", label: "Transfers", icon: FiTrendingUp },
    { id: "bill", label: "Bill", icon: FiFileText },
    { id: "statistics", label: "Statistics", icon: FiPieChart },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>💰 Splito</div>
        <nav style={styles.nav}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navItem,
                  backgroundColor: activeTab === item.id ? "#f3f4f6" : "transparent",
                  color: activeTab === item.id ? "#10b981" : "#4b5563"
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <div style={styles.headerRight}>
            <div style={styles.notificationBadge}>3</div>
            <div style={styles.userAvatar}>
              <FiUser size={20} />
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeContent}>
            <h2 style={styles.welcomeTitle}>Hello, Subim 🍴</h2>
            <div style={styles.restaurantInfo}>
              <h3 style={styles.restaurantName}>Pizza Inn</h3>
              <p style={styles.restaurantAddress}>124, Main Street, NY</p>
            </div>
            <div style={styles.splitInfo}>
              <div style={styles.splitWith}>
                <FiUsers size={20} />
                <span>Split with +2</span>
              </div>
              <div style={styles.totalBill}>
                <span>Total Bill</span>
                <strong>$360.80</strong>
              </div>
            </div>
            <button style={styles.splitNowButton}>Split Now</button>
          </div>
          <div style={styles.welcomeIllustration}>
            {/* Illustration placeholder */}
            <div style={styles.illustrationCircle} />
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={styles.twoColumn}>
          {/* Left Column - Participations */}
          <div style={styles.leftColumn}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Participate (5 person)</h3>
              <button style={styles.viewAllButton}>View all</button>
            </div>

            <div style={styles.participationList}>
              {mockParticipations.map((person, index) => (
                <div key={index} style={styles.participationCard}>
                  <div style={styles.participantInfo}>
                    <div style={styles.avatar}>{person.avatar}</div>
                    <div>
                      <p style={styles.participantName}>{person.name}</p>
                      <p style={styles.participantAmount}>${person.amount.toFixed(2)}</p>
                      {person.pendingBill && (
                        <div style={styles.pendingBill}>
                          <p style={styles.pendingBillText}>
                            Pending Bill • {person.pendingBill.place}
                          </p>
                          <p style={styles.pendingBillDetails}>
                            Total Payment: ${person.pendingBill.total.toFixed(2)} • {person.pendingBill.percentage}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={styles.participantActions}>
                    {person.status === "pending" && (
                      <>
                        <button style={styles.declineButton}>
                          <FiX size={16} /> Decline
                        </button>
                        <button style={styles.acceptButton}>
                          <FiCheck size={16} /> Accept
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Friends & Notifications */}
          <div style={styles.rightColumn}>
            {/* Friends Section */}
            <div style={styles.friendsSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Friends</h3>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  style={styles.addFriendButton}
                >
                  <FiPlus size={16} /> Add
                </button>
              </div>

              <div style={styles.friendsList}>
                {mockFriends.map((friend, index) => (
                  <div key={index} style={styles.friendItem}>
                    <div style={styles.friendInfo}>
                      <div style={styles.friendAvatar}>
                        {friend.avatar}
                        {friend.online && <span style={styles.onlineDot} />}
                      </div>
                      <span style={styles.friendName}>{friend.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Section */}
            <div style={styles.notificationSection}>
              <h3 style={styles.sectionTitle}>Hey Subim!</h3>
              {mockNotifications.map((notif, index) => (
                <div key={index} style={styles.notificationCard}>
                  <p style={styles.notificationMessage}>
                    <strong>{notif.from}</strong> {notif.message}
                  </p>
                  <div style={styles.notificationDetails}>
                    <div style={styles.notificationAmount}>
                      <FiDollarSign size={16} />
                      <span>SplitBill ${notif.amount.toFixed(2)}</span>
                    </div>
                    <p style={styles.notificationTotal}>
                      Total Bill ${notif.totalBill.toFixed(2)}
                    </p>
                  </div>
                  <p style={styles.notificationTime}>{notif.time}</p>
                </div>
              ))}
            </div>

            {/* Your Groups Section */}
            <div style={styles.groupsSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Your Groups</h3>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  style={styles.createGroupButton}
                >
                  <FiPlus size={16} /> New Group
                </button>
              </div>

              {groups.length === 0 ? (
                <p style={styles.emptyText}>No groups yet</p>
              ) : (
                groups.map((group) => (
                  <div
                    key={group._id}
                    onClick={() => router.push(`/groups/${group._id}`)}
                    style={styles.groupCard}
                  >
                    <div style={styles.groupInfo}>
                      <div style={styles.groupAvatar}>
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={styles.groupName}>{group.name}</p>
                        <p style={styles.groupMembers}>{group.members?.length || 0} members</p>
                      </div>
                    </div>
                    <span style={styles.groupBalance}>
                      Rs {(group.totalBalance || 0).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    padding: "2rem 1rem",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: "2rem",
    paddingLeft: "1rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    cursor: "pointer",
    width: "100%",
    textAlign: "left" as const,
    transition: "all 0.2s",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto" as const,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  notificationBadge: {
    backgroundColor: "#ef4444",
    color: "white",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  userAvatar: {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: "1.5rem",
    padding: "2rem",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1.5rem",
  },
  restaurantInfo: {
    marginBottom: "1.5rem",
  },
  restaurantName: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
  },
  restaurantAddress: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  splitInfo: {
    display: "flex",
    gap: "2rem",
    marginBottom: "1.5rem",
  },
  splitWith: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4b5563",
  },
  totalBill: {
    display: "flex",
    flexDirection: "column" as const,
  },
  splitNowButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  welcomeIllustration: {
    width: "200px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationCircle: {
    width: "120px",
    height: "120px",
    backgroundColor: "#f3f4f6",
    borderRadius: "50%",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "1.5rem",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#111827",
  },
  viewAllButton: {
    background: "none",
    border: "none",
    color: "#10b981",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  participationList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  participationCard: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  participantInfo: {
    display: "flex",
    gap: "1rem",
  },
  avatar: {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  participantName: {
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
  },
  participantAmount: {
    fontSize: "0.875rem",
    color: "#10b981",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  pendingBill: {
    marginTop: "0.5rem",
    padding: "0.5rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
  },
  pendingBillText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
  },
  pendingBillDetails: {
    fontSize: "0.75rem",
    color: "#111827",
    fontWeight: 500,
  },
  participantActions: {
    display: "flex",
    gap: "0.5rem",
  },
  declineButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  acceptButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  friendsSection: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  addFriendButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  friendsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  friendItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  friendAvatar: {
    width: "2rem",
    height: "2rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 500,
    position: "relative" as const,
  },
  onlineDot: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    border: "2px solid white",
  },
  friendName: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#111827",
  },
  notificationSection: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  notificationCard: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
  },
  notificationMessage: {
    fontSize: "0.875rem",
    color: "#4b5563",
    marginBottom: "0.75rem",
  },
  notificationDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  notificationAmount: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: 500,
  },
  notificationTotal: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  notificationTime: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  groupsSection: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  createGroupButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  emptyText: {
    textAlign: "center" as const,
    color: "#6b7280",
    padding: "2rem",
  },
  groupCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    cursor: "pointer",
    borderBottom: "1px solid #f3f4f6",
  },
  groupInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  groupAvatar: {
    width: "2rem",
    height: "2rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  groupName: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#111827",
    marginBottom: "0.25rem",
  },
  groupMembers: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  groupBalance: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
  },
  modalOverlay: {
    position: "fixed" as const,
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
    flexWrap: "wrap" as const,
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