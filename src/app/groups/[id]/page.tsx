"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FiArrowLeft, FiUsers, FiDollarSign, FiCheckCircle, FiPlus, FiUserPlus, FiRefreshCw } from "react-icons/fi";

interface GroupDetail {
  group: {
    _id: string;
    name: string;
    members: string[];
  };
  expenses: any[];
  settlements: any[];
  balances: { name: string; amount: number }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);

  // Expense form state
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payments, setPayments] = useState<{ name: string; amount: number }[]>([]);

  // Settlement form state
  const [settlementFrom, setSettlementFrom] = useState("");
  const [settlementTo, setSettlementTo] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📡 Fetching group balances for ID:", id);
      
      const data = await api.getGroupWithBalances(id);
      console.log("✅ Received data:", data);
      
      const formattedData: GroupDetail = {
        group: data.group,
        expenses: data.expenses || [],
        settlements: data.settlements || [],
        balances: data.balances || []
      };
      
      setGroupDetail(formattedData);
    } catch (err: any) {
      console.error("❌ Failed to load group data", err);
      setError(err.message || "Failed to load group data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  const addMember = async () => {
    if (!newMemberName.trim() || !groupDetail) return;
    const updatedMembers = [...groupDetail.group.members, newMemberName.trim()];
    try {
      await api.updateGroup(groupDetail.group._id, { members: updatedMembers });
      loadData();
      setNewMemberName("");
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  const openExpenseModal = () => {
    if (!groupDetail) return;
    setExpenseDescription("");
    setExpenseAmount("");
    setPayments(groupDetail.group.members.map(name => ({ name, amount: 0 })));
    setShowAddExpense(true);
  };

  const updatePaymentAmount = (name: string, amount: number) => {
    setPayments(prev => prev.map(p => (p.name === name ? { ...p, amount } : p)));
  };

  const handleAddExpense = async () => {
    if (!groupDetail) return;
    if (!expenseDescription.trim() || !expenseAmount) {
      alert("Please fill all fields");
      return;
    }
    const total = parseFloat(expenseAmount);
    if (isNaN(total) || total <= 0) {
      alert("Invalid amount");
      return;
    }
    const totalPayments = payments.reduce((sum: number, p) => sum + p.amount, 0);
    if (Math.abs(totalPayments - total) > 0.01) {
      alert(`Total payments (${totalPayments}) must equal total amount (${total})`);
      return;
    }

    const memberCount = groupDetail.group.members.length;
    const equalShare = total / memberCount;
    const splitsForBackend = groupDetail.group.members.map((name, index) => {
      if (index === memberCount - 1) {
        const previousSum = Array.from({ length: memberCount - 1 }).reduce<number>(
          (acc) => acc + (Math.floor(equalShare * 100) / 100),
          0
        );
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
        groupId: groupDetail.group._id,
      });
      setShowAddExpense(false);
      loadData();
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Failed to add expense: " + (err as Error).message);
    }
  };

  const handleSettleUp = async () => {
    if (!settlementFrom || !settlementTo || !settlementAmount) {
      alert("Please select both members and enter an amount");
      return;
    }
    if (settlementFrom === settlementTo) {
      alert("Cannot settle with yourself");
      return;
    }
    const amount = parseFloat(settlementAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    const from = settlementFrom;
    const to = settlementTo;
    const amt = amount;

    setShowSettleModal(false);
    setSettlementFrom("");
    setSettlementTo("");
    setSettlementAmount("");
    setLoading(true);

    try {
      console.log("💰 Creating settlement:", { from, to, amt, groupId: id });
      await api.createSettlement({ from, to, amount: amt, groupId: id });
      await loadData();
      console.log("✅ Settlement created, data reloaded");
    } catch (err) {
      console.error("❌ Settlement failed:", err);
      alert("Failed to record settlement");
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const manualRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    loadData();
  };

  const getSuggestedSettlements = () => {
    if (!groupDetail || !Array.isArray(groupDetail.balances)) return [];
    const debtors = groupDetail.balances
      .filter(b => b && b.amount < -0.01)
      .map(b => ({ ...b, amount: Math.abs(b.amount) }))
      .sort((a, b) => b.amount - a.amount);
    const creditors = groupDetail.balances
      .filter(b => b && b.amount > 0.01)
      .sort((a, b) => b.amount - a.amount);
    if (debtors.length === 0 || creditors.length === 0) return [];
    const suggestions = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);
      if (amount > 0.01) {
        suggestions.push({ from: debtor.name, to: creditor.name, amount });
      }
      debtor.amount -= amount;
      creditor.amount -= amount;
      if (Math.abs(debtor.amount) < 0.01) i++;
      if (Math.abs(creditor.amount) < 0.01) j++;
    }
    return suggestions;
  };

  const getWhoNeedsToPay = () => {
    if (!groupDetail || !expenseAmount) return [];
    const total = parseFloat(expenseAmount);
    if (isNaN(total) || total <= 0) return [];
    const memberCount = groupDetail.group.members.length;
    const equalShare = total / memberCount;
    return groupDetail.group.members
      .map(name => {
        const paid = payments.find(p => p.name === name)?.amount || 0;
        const amountToPay = Math.max(0, equalShare - paid);
        return { name, amountToPay };
      })
      .filter(p => p.amountToPay > 0.01);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading group...</p>
      </div>
    );
  }

  if (error || !groupDetail) {
    return (
      <div style={styles.errorContainer}>
        <p style={{ color: "#ef4444" }}>{error || "Group not found"}</p>
        <button onClick={() => router.back()} style={styles.backButton}>Go Back</button>
        <button onClick={manualRefresh} style={styles.retryButton}>Retry</button>
      </div>
    );
  }

  const { group, expenses, settlements, balances } = groupDetail;
  const suggestedSettlements = getSuggestedSettlements();
  const whoNeedsToPay = getWhoNeedsToPay();
  const total = expenseAmount ? parseFloat(expenseAmount) : 0;
  const equalShare = total && group ? total / group.members.length : 0;

  // Data for mini charts
  const paymentChartData = group.members.map(name => {
    const paid = expenses.reduce((sum, exp) => {
      const payment = exp.payments?.find((p: any) => p.name === name)?.amount || 0;
      return sum + payment;
    }, 0);
    return { name, value: paid };
  }).filter(d => d.value > 0);

  const balanceChartData = balances.map(b => ({ name: b.name, amount: b.amount }));
  const unsettledCount = balances.filter(b => Math.abs(b.amount) > 0.01).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          <FiArrowLeft style={{ marginRight: "0.5rem" }} /> Back to Dashboard
        </button>
        <div style={styles.headerRight}>
          <button onClick={manualRefresh} style={styles.refreshButton} title="Refresh">
            <FiRefreshCw />
          </button>
          <button onClick={openExpenseModal} style={styles.primaryButton}>
            <FiDollarSign /> Add Expense
          </button>
          <button onClick={() => setShowSettleModal(true)} style={styles.secondaryButton}>
            <FiCheckCircle /> Settle Up
          </button>
        </div>
      </div>

      {/* Group Title */}
      <div style={styles.titleSection}>
        <h1 style={styles.title}>{group.name}</h1>
        <p style={styles.subtitle}>
          <FiUsers style={{ marginRight: "0.5rem" }} /> {group.members.length} members
        </p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Expenses</p>
          <p style={styles.statValue}>
            Rs {expenses.reduce((sum, e) => sum + e.totalAmount, 0).toFixed(2)}
          </p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Settlements</p>
          <p style={styles.statValue}>{settlements.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Unsettled Balances</p>
          <p style={styles.statValue}>{unsettledCount}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {paymentChartData.length > 0 && (
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Payments by Member</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {balanceChartData.length > 0 && (
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Balances</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={balanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `Rs ${value}`} />
                <Bar dataKey="amount" fill="#10b981">
                  {balanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount > 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Two columns */}
      <div style={styles.twoColumn}>
        {/* Left column */}
        <div style={styles.leftColumn}>
          {/* Balances */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Balances</h3>
            </div>
            <div style={styles.balanceList}>
              {balances.length === 0 ? (
                <p style={styles.emptyText}>All settled up!</p>
              ) : (
                balances.map((b) => (
                  <div key={b.name} style={styles.balanceItem}>
                    <span style={styles.balanceName}>{b.name}</span>
                    <span style={{
                      ...styles.balanceAmount,
                      color: b.amount > 0 ? "#10b981" : b.amount < 0 ? "#ef4444" : "#6b7280"
                    }}>
                      {b.amount > 0 ? `+Rs ${b.amount.toFixed(2)}` :
                       b.amount < 0 ? `-Rs ${Math.abs(b.amount).toFixed(2)}` :
                       "Settled"}
                    </span>
                  </div>
                ))
              )}
            </div>
            {suggestedSettlements.length > 0 && (
              <div style={styles.suggestionBox}>
                <p style={styles.suggestionTitle}>💡 Suggested settlements</p>
                {suggestedSettlements.map((s, idx) => (
                  <div key={idx} style={styles.suggestionItem}>
                    <span><strong>{s.from}</strong> owes <strong>{s.to}</strong></span>
                    <span style={styles.suggestionAmount}>Rs {s.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Members</h3>
            </div>
            <div style={styles.memberList}>
              {group.members.map((name, i) => (
                <div key={i} style={styles.memberItem}>
                  <div style={styles.memberAvatar}>{name.charAt(0).toUpperCase()}</div>
                  <span style={styles.memberName}>{name}</span>
                </div>
              ))}
            </div>
            <div style={styles.addMemberRow}>
              <input
                type="text"
                placeholder="Add member"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                style={styles.memberInput}
              />
              <button onClick={addMember} style={styles.addButton}>
                <FiUserPlus /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={styles.rightColumn}>
          {/* Expenses */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Expenses</h3>
            </div>
            {expenses.length === 0 ? (
              <p style={styles.emptyText}>No expenses yet.</p>
            ) : (
              <div style={styles.expenseList}>
                {expenses.map((exp) => {
                  const memberCount = group.members.length;
                  const equalShare = exp.totalAmount / memberCount;
                  const netPositions = group.members
                    .map(name => {
                      const paid = exp.payments?.find((p: any) => p.name === name)?.amount || 0;
                      const net = paid - equalShare;
                      return { name, net };
                    })
                    .filter(n => Math.abs(n.net) > 0.01);
                  const overpayers = netPositions.filter(n => n.net > 0);
                  const underpayers = netPositions.filter(n => n.net < 0);

                  return (
                    <div key={exp._id} style={styles.expenseItem}>
                      <div style={styles.expenseHeader}>
                        <div>
                          <p style={styles.expenseDesc}>{exp.description}</p>
                          <p style={styles.expenseDate}>
                            {new Date(exp.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <p style={styles.expenseTotal}>Rs {exp.totalAmount.toFixed(2)}</p>
                      </div>

                      {/* Who paid */}
                      <div style={styles.expenseDetail}>
                        <p style={styles.detailLabel}>Paid by</p>
                        <div style={styles.paymentTags}>
                          {exp.payments?.map((payment: any, idx: number) => (
                            <span key={idx} style={styles.paymentTag}>
                              {payment.name}: Rs {payment.amount}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Who owes whom - Settlement preview for this expense */}
                      {overpayers.length > 0 && underpayers.length > 0 && (
                        <div style={styles.settlementPreview}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: '#856404' }}>
                            Net result:
                          </p>
                          {overpayers.map(over =>
                            underpayers.map(under => {
                              const amount = Math.min(over.net, Math.abs(under.net));
                              if (amount > 0.01) {
                                return (
                                  <div key={`${under.name}-${over.name}`} style={styles.previewRow}>
                                    <span><strong>{under.name}</strong> owes <strong>{over.name}</strong></span>
                                    <span style={styles.previewAmount}>Rs {amount.toFixed(2)}</span>
                                  </div>
                                );
                              }
                              return null;
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settlements history */}
          {settlements.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Settlement History</h3>
              </div>
              <div style={styles.settlementList}>
                {settlements.map((s) => (
                  <div key={s._id} style={styles.settlementItem}>
                    <FiCheckCircle style={{ color: "#10b981", marginRight: "0.75rem" }} />
                    <span style={styles.settlementText}>
                      <strong>{s.from}</strong> paid <strong>{s.to}</strong>
                    </span>
                    <span style={styles.settlementAmount}>Rs {s.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div style={styles.modalOverlay} onClick={() => setShowAddExpense(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add Expense</h3>
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
            <p style={styles.modalLabel}>💰 Who paid how much?</p>
            {payments.map((p) => (
              <div key={p.name} style={styles.participantRow}>
                <span style={styles.participantName}>{p.name}</span>
                <input
                  type="number"
                  value={p.amount}
                  onChange={(e) => updatePaymentAmount(p.name, parseFloat(e.target.value) || 0)}
                  style={styles.participantInput}
                  placeholder="Amount"
                />
              </div>
            ))}
            {expenseAmount && (
              <div style={{
                ...styles.paymentTotal,
                color: Math.abs(payments.reduce((s, p) => s + p.amount, 0) - parseFloat(expenseAmount)) < 0.01
                  ? "#10b981" : "#ef4444"
              }}>
                Total: Rs {payments.reduce((s, p) => s + p.amount, 0).toFixed(2)} / Rs {parseFloat(expenseAmount).toFixed(2)}
              </div>
            )}
            <div style={styles.modalActions}>
              <button onClick={() => setShowAddExpense(false)} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleAddExpense} disabled={Math.abs(payments.reduce((s, p) => s + p.amount, 0) - parseFloat(expenseAmount || '0')) >= 0.01} style={styles.submitButton}>Add Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* Settle Up Modal */}
      {showSettleModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSettleModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Record Settlement</h3>
            <select
              value={settlementFrom}
              onChange={(e) => setSettlementFrom(e.target.value)}
              style={styles.input}
            >
              <option value="">Who is paying?</option>
              {group.members.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={settlementTo}
              onChange={(e) => setSettlementTo(e.target.value)}
              style={styles.input}
            >
              <option value="">Who is receiving?</option>
              {group.members.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setShowSettleModal(false)} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleSettleUp} style={styles.submitButton}>Record</button>
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
  },
  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  errorBox: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  retryButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    marginRight: "1rem",
    cursor: "pointer",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "0.875rem",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    transition: "background 0.2s",
  },
  headerRight: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    cursor: "pointer",
    color: "#6b7280",
    marginRight: "0.5rem",
  },
  titleSection: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  subtitle: {
    display: "flex",
    alignItems: "center",
    color: "#6b7280",
    fontSize: "0.875rem",
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
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  chartCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "1rem",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "1.5rem",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#111827",
  },
  balanceList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  balanceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  balanceName: {
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  balanceAmount: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  suggestionBox: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#e0f2fe",
    borderRadius: "0.5rem",
  },
  suggestionTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: "0.5rem",
  },
  suggestionItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    color: "#0369a1",
    marginBottom: "0.25rem",
  },
  suggestionAmount: {
    fontWeight: 600,
  },
  memberList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  memberItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  memberAvatar: {
    width: "2rem",
    height: "2rem",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  memberName: {
    fontSize: "0.875rem",
    color: "#111827",
  },
  addMemberRow: {
    display: "flex",
    gap: "0.5rem",
  },
  memberInput: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    padding: "2rem",
  },
  expenseList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  expenseItem: {
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "1rem",
  },
  expenseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
  },
  expenseDesc: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
  },
  expenseDate: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  expenseTotal: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
  },
  expenseDetail: {
    marginBottom: "0.5rem",
  },
  detailLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
  },
  paymentTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  paymentTag: {
    fontSize: "0.75rem",
    backgroundColor: "#d1fae5",
    color: "#047857",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
  },
  settlementPreview: {
    marginTop: "0.5rem",
    padding: "0.5rem",
    backgroundColor: "#fff3cd",
    borderRadius: "0.375rem",
  },
  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    color: "#856404",
    marginBottom: "0.25rem",
  },
  previewAmount: {
    fontWeight: 600,
  },
  settlementList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  settlementItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  settlementText: {
    flex: 1,
    fontSize: "0.875rem",
    color: "#111827",
  },
  settlementAmount: {
    fontSize: "0.875rem",
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
    width: "500px",
    maxWidth: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
  },
  modalLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#047857",
    marginBottom: "0.5rem",
  },
  participantRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  participantName: {
    width: "100px",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#111827",
  },
  participantInput: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  },
  paymentTotal: {
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },
  previewBox: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
  },
  previewBoxTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#92400e",
    marginBottom: "0.5rem",
  },
  previewBoxRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    color: "#92400e",
    marginBottom: "0.25rem",
  },
  equalShareNote: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: "0.5rem",
  },
  modalActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
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
    opacity: 1,
  },
};