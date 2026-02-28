"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiTrash2,
  FiPlus,
  FiUser,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";
import { api, type Group, type Expense } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/app/providers/AuthProvider";

type Tab = "dashboard" | "groups" | "expenses" | "analytics" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedGroupForExpense, setSelectedGroupForExpense] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");

  // Expense form state
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payments, setPayments] = useState<{ name: string; amount: number }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Helper: load all expenses from all groups (fallback if no dedicated endpoint)
  const loadAllExpenses = async (groupsList: Group[]): Promise<Expense[]> => {
    try {
      const expensesPromises = groupsList.map((group) =>
        api.getGroupExpenses(group._id).catch(() => [])
      );
      const expensesArrays = await Promise.all(expensesPromises);
      const allExpenses = expensesArrays.flat().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      // Attach group name by looking up the group from the list
      return allExpenses.map((exp) => {
        const group = groupsList.find(g => g._id === (exp.groupId || exp.group));
        return {
          ...exp,
          groupName: group?.name || "Unknown",
        };
      });
    } catch (err) {
      console.error("Failed to load expenses", err);
      return [];
    }
  };

  // Helper: compute total balance for each group based on expenses
  const computeGroupBalances = (groupsList: Group[], expensesList: Expense[]): Group[] => {
    const balanceMap = new Map<string, number>();
    expensesList.forEach((exp) => {
      const groupId = exp.group?.toString();
      if (groupId) {
        balanceMap.set(groupId, (balanceMap.get(groupId) || 0) + (exp.totalAmount || exp.amount || 0));
      }
    });
    return groupsList.map((g) => ({
      ...g,
      totalBalance: balanceMap.get(g._id.toString()) || 0,
    }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const groupsData = await api.getGroups();
      let expensesData: Expense[] = [];
      if (api.getRecentExpenses) {
        expensesData = await api.getRecentExpenses();
        // If the endpoint doesn't include groupName, attach it
        expensesData = expensesData.map((exp) => {
          const group = groupsData.find(g => g._id === (exp.groupId || exp.group));
          return { 
            ...exp, 
            groupName: group?.name || "Unknown",
            // Ensure we have totalAmount for display
            totalAmount: exp.totalAmount || exp.amount || 0
          };
        });
      } else {
        expensesData = await loadAllExpenses(groupsData);
      }
      const groupsWithBalance = computeGroupBalances(groupsData, expensesData);
      setGroups(groupsWithBalance);
      setExpenses(expensesData);
    } catch (err) {
      console.error("Failed to load data:", err);
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
      setShowCreateGroupModal(false);
      setNewGroupName("");
      setMembers([]);
      loadData();
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await api.deleteGroup(groupId);
      loadData();
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  const openAddExpenseModal = (group: Group) => {
    setSelectedGroupForExpense(group);
    setExpenseDescription("");
    setExpenseAmount("");
    setPayments(group.members.map(name => ({ name, amount: 0 })));
    setShowAddExpenseModal(true);
  };

  const updatePaymentAmount = (name: string, amount: number) => {
    setPayments(prev =>
      prev.map(p => (p.name === name ? { ...p, amount } : p))
    );
  };

  const handleAddExpense = async () => {
    if (!selectedGroupForExpense) return;

    if (!expenseDescription.trim() || !expenseAmount) {
      alert("Please fill all fields");
      return;
    }

    const total = parseFloat(expenseAmount);
    if (isNaN(total) || total <= 0) {
      alert("Invalid amount");
      return;
    }

    // Validate total payments = total amount
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalPayments - total) > 0.01) {
      alert(`Total payments (${totalPayments}) must equal total amount (${total})`);
      return;
    }

    // Calculate equal share with proper rounding
    const memberCount = selectedGroupForExpense.members.length;
    const equalShare = total / memberCount;
    
    // Create splits that sum EXACTLY to total amount
    const splitsForBackend = selectedGroupForExpense.members.map((name, index) => {
      if (index === memberCount - 1) {
        const previousSum = Array.from({ length: memberCount - 1 }).reduce((sum, _, i) => {
          return sum + (Math.floor(equalShare * 100) / 100);
        }, 0);
        const lastAmount = Number((total - previousSum).toFixed(2));
        return { name, amount: lastAmount };
      } else {
        return { name, amount: Math.floor(equalShare * 100) / 100 };
      }
    });

    try {
      await api.createExpense({
        description: expenseDescription,
        totalAmount: total,
        payments: payments.filter(p => p.amount > 0),
        splits: splitsForBackend,
        groupId: selectedGroupForExpense._id,
      });
      setShowAddExpenseModal(false);
      loadData();
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Failed to add expense: " + (err as Error).message);
    }
  };

  const chartData = groups.map((g) => ({
    name: g.name.length > 10 ? g.name.substring(0, 10) + "…" : g.name,
    balance: g.totalBalance || 0,
  }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleLogout = () => {
    logout();
    router.push("/authentication/login");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Sidebar navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "groups", label: "Groups", icon: FiUsers },
    { id: "expenses", label: "Expenses", icon: FiDollarSign },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "settings", label: "Settings", icon: FiSettings },
  ] as const;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>💰 Splito</div>
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navItem,
                  backgroundColor: activeTab === item.id ? "#f3f4f6" : "transparent",
                  color: activeTab === item.id ? "#10b981" : "#4b5563",
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
      <div style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {navItems.find((i) => i.id === activeTab)?.label || "Dashboard"}
          </h1>
          <div style={styles.userSection}>
            
  <button
    onClick={() => router.push("/profile")}
    style={styles.profileButton}
  >
    <FiUser size={20} />
    <span>{user?.username || "User"}</span>
  </button>
  <button onClick={handleLogout} style={styles.logoutButton} title="Logout">
    <FiLogOut size={20} />
  </button>
</div>
        </header>

        {/* Render content based on active tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards — "You are owed" removed */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Groups</p>
                <p style={styles.statValue}>{groups.length}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Expenses</p>
                <p style={styles.statValue}>{expenses.length}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Pending Settlements</p>
                <p style={styles.statValue}>3</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div style={styles.columns}>
              {/* Left Column: Groups */}
              <div style={styles.leftColumn}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Your Groups</h2>
                  <button
                    onClick={() => setShowCreateGroupModal(true)}
                    style={styles.createButton}
                  >
                    <FiPlus size={16} /> New Group
                  </button>
                </div>

                {groups.length === 0 ? (
                  <p style={styles.emptyText}>No groups yet. Create one!</p>
                ) : (
                  groups.map((group) => (
                    <div key={group._id} style={styles.groupCard}>
                      <div
                        style={styles.groupInfo}
                        onClick={() => router.push(`/groups/${group._id}`)}
                      >
                        <div style={styles.groupAvatar}>
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={styles.groupName}>{group.name}</h3>
                          <p style={styles.groupMeta}>{group.members?.length || 0} members</p>
                        </div>
                      </div>
                      <div style={styles.groupActions}>
                        <button
                          onClick={() => openAddExpenseModal(group)}
                          style={styles.addExpenseButton}
                          title="Add expense"
                        >
                          <FiDollarSign size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group._id)}
                          style={styles.deleteButton}
                          title="Delete group"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Recent Expenses */}
                <div style={{ marginTop: "2rem" }}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Recent Expenses</h2>
                    <button
                      style={styles.viewAllButton}
                      onClick={() => setActiveTab("expenses")}
                    >
                      View all
                    </button>
                  </div>
                  {expenses.length === 0 ? (
                    <p style={styles.emptyText}>No expenses yet.</p>
                  ) : (
                    expenses.slice(0, 5).map((exp) => {
                      // Use totalAmount if available, otherwise fall back to amount
                      const displayAmount = exp.totalAmount || exp.amount || 0;
                      return (
                        <div key={exp._id} style={styles.expenseItem}>
                          <div>
                            <p style={styles.expenseDesc}>{exp.description}</p>
                            <p style={styles.expenseMeta}>
                              {exp.groupName || "Unknown"} • Paid by {
                                exp.payments && exp.payments.length > 0 
                                  ? exp.payments.map((p: any) => p.name).join(", ") 
                                  : exp.paidBy || "Unknown"
                              }
                            </p>
                          </div>
                          <p style={styles.expenseAmount}>Rs {displayAmount.toFixed(2)}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Charts only — Quick Summary removed */}
              <div style={styles.rightColumn}>
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Balances by Group</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="balance" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={styles.pieCard}>
                  <h3 style={styles.chartTitle}>Expense Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="balance"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "groups" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Groups</h2>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                style={styles.createButton}
              >
                <FiPlus size={16} /> New Group
              </button>
            </div>
            {groups.length === 0 ? (
              <p style={styles.emptyText}>No groups yet. Create one!</p>
            ) : (
              groups.map((group) => (
                <div key={group._id} style={styles.groupCard}>
                  <div
                    style={styles.groupInfo}
                    onClick={() => router.push(`/groups/${group._id}`)}
                  >
                    <div style={styles.groupAvatar}>
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={styles.groupName}>{group.name}</h3>
                      <p style={styles.groupMeta}>{group.members?.length || 0} members</p>
                    </div>
                  </div>
                  <div style={styles.groupActions}>
                    <button
                      onClick={() => openAddExpenseModal(group)}
                      style={styles.addExpenseButton}
                      title="Add expense"
                    >
                      <FiDollarSign size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group._id)}
                      style={styles.deleteButton}
                      title="Delete group"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Expenses</h2>
            </div>
            {expenses.length === 0 ? (
              <p style={styles.emptyText}>No expenses yet.</p>
            ) : (
              expenses.map((exp) => {
                const displayAmount = exp.totalAmount || exp.amount || 0;
                return (
                  <div key={exp._id} style={styles.expenseItem}>
                    <div>
                      <p style={styles.expenseDesc}>{exp.description}</p>
                      <p style={styles.expenseMeta}>
                        {exp.groupName || "Unknown"} • Paid by {
                          exp.payments && exp.payments.length > 0 
                            ? exp.payments.map((p: any) => p.name).join(", ") 
                            : exp.paidBy || "Unknown"
                        } • {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p style={styles.expenseAmount}>Rs {displayAmount.toFixed(2)}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 style={styles.sectionTitle}>Analytics</h2>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Balances by Group</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="balance" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...styles.pieCard, marginTop: "1.5rem" }}>
              <h3 style={styles.chartTitle}>Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="balance"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 style={styles.sectionTitle}>Settings</h2>
            <div style={styles.summaryCard}>
              <div style={styles.summaryItem}>
                <span>Username</span>
                <strong>{user?.username}</strong>
              </div>
              <div style={styles.summaryItem}>
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>
              <div style={styles.summaryItem}>
                <span>Member since</span>
                <strong>{new Date().toLocaleDateString()}</strong>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => router.push("/profile")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiUser size={18} /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiLogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateGroupModal(false)}>
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
                    <button onClick={() => removeMember(idx)} style={styles.removeButton}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowCreateGroupModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleCreateGroup} style={styles.submitButton}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && selectedGroupForExpense && (
        <div style={styles.modalOverlay} onClick={() => setShowAddExpenseModal(false)}>
          <div style={{ ...styles.modalContent, width: "500px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add Expense to {selectedGroupForExpense.name}</h3>
            <input
              type="text"
              placeholder="Description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              style={styles.input}
            />

            {/* Who paid how much */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ ...styles.label, fontWeight: 600, color: "#047857" }}>
                💰 Who paid how much?
              </label>
              {payments.map((p) => (
                <div key={p.name} style={styles.participantRow}>
                  <span style={styles.participantName}>{p.name}</span>
                  <input
                    type="number"
                    value={p.amount}
                    onChange={(e) => {
                      const newAmount = parseFloat(e.target.value) || 0;
                      updatePaymentAmount(p.name, newAmount);
                    }}
                    style={styles.participantInput}
                    placeholder="Amount paid"
                  />
                </div>
              ))}
              
              {expenseAmount && (
                <div style={{ 
                  marginTop: "0.5rem", 
                  fontSize: "0.875rem",
                  color: Math.abs(payments.reduce((sum, p) => sum + p.amount, 0) - parseFloat(expenseAmount)) < 0.01 
                    ? "#10b981" 
                    : "#dc2626"
                }}>
                  Total payments: Rs {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} / Rs {parseFloat(expenseAmount || "0").toFixed(2)}
                </div>
              )}
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setShowAddExpenseModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleAddExpense} style={styles.submitButton}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "4px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
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
    flexDirection: "column",
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
    textAlign: "left",
    transition: "all 0.2s",
  },
  main: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    borderRadius: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    padding: "0.5rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "1.5rem",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
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
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "1rem",
  },
  groupCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "0.75rem",
    transition: "box-shadow 0.2s",
    cursor: "pointer",
  },
  groupInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flex: 1,
  },
  groupAvatar: {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.125rem",
  },
  groupName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
  },
  groupMeta: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  groupActions: {
    display: "flex",
    gap: "0.5rem",
  },
  addExpenseButton: {
    padding: "0.5rem",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    padding: "0.5rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    background: "none",
    border: "none",
    color: "#10b981",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  expenseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  expenseDesc: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#111827",
  },
  expenseMeta: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  expenseAmount: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
  },
  chartCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  pieCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#111827",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
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
    maxHeight: "90vh",
    overflowY: "auto",
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
  participantsSection: {
    marginBottom: "1rem",
  },
  participantRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  participantName: {
    width: "100px",
    fontWeight: 500,
  },
  participantInput: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
  },
};