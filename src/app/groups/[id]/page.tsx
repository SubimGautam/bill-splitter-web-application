"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FiHome, FiUsers, FiDollarSign, FiBarChart2, FiSettings,
  FiArrowLeft, FiCheckCircle, FiUserPlus, FiRefreshCw,
} from "react-icons/fi";

interface GroupDetail {
  group: { _id: string; name: string; members: string[] };
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

  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payments, setPayments] = useState<{ name: string; amount: number }[]>([]);

  const [settlementFrom, setSettlementFrom] = useState("");
  const [settlementTo, setSettlementTo] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getGroupWithBalances(id);
      setGroupDetail({
        group: data.group,
        expenses: data.expenses || [],
        settlements: data.settlements || [],
        balances: data.balances || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to load group data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) loadData(); }, [id, loadData]);

  const addMember = async () => {
    if (!newMemberName.trim() || !groupDetail) return;
    try {
      await api.updateGroup(groupDetail.group._id, { members: [...groupDetail.group.members, newMemberName.trim()] });
      setNewMemberName("");
      loadData();
    } catch (err) { console.error("Failed to add member", err); }
  };

  const openExpenseModal = () => {
    if (!groupDetail) return;
    setExpenseDescription(""); setExpenseAmount("");
    setPayments(groupDetail.group.members.map(name => ({ name, amount: 0 })));
    setShowAddExpense(true);
  };

  const updatePaymentAmount = (name: string, amount: number) =>
    setPayments(prev => prev.map(p => p.name === name ? { ...p, amount } : p));

  const handleAddExpense = async () => {
    if (!groupDetail || !expenseDescription.trim() || !expenseAmount) { alert("Please fill all fields"); return; }
    const total = parseFloat(expenseAmount);
    if (isNaN(total) || total <= 0) { alert("Invalid amount"); return; }
    const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(totalPayments - total) > 0.01) { alert(`Payments must equal total amount`); return; }
    const memberCount = groupDetail.group.members.length;
    const equalShare = total / memberCount;
    const splitsForBackend = groupDetail.group.members.map((name, i) => {
      if (i === memberCount - 1) {
        const prev = Array.from({ length: memberCount - 1 }).reduce<number>(acc => acc + Math.floor(equalShare * 100) / 100, 0);
        return { name, amount: Number((total - prev).toFixed(2)) };
      }
      return { name, amount: Math.floor(equalShare * 100) / 100 };
    });
    try {
      await api.createExpense({ description: expenseDescription, totalAmount: total, payments: payments.filter(p => p.amount > 0), splits: splitsForBackend, groupId: groupDetail.group._id });
      setShowAddExpense(false); loadData();
    } catch (err) { alert("Failed to add expense: " + (err as Error).message); }
  };

  const handleSettleUp = async () => {
    if (!settlementFrom || !settlementTo || !settlementAmount) { alert("Please fill all fields"); return; }
    if (settlementFrom === settlementTo) { alert("Cannot settle with yourself"); return; }
    const amount = parseFloat(settlementAmount);
    if (isNaN(amount) || amount <= 0) { alert("Invalid amount"); return; }
    const from = settlementFrom, to = settlementTo, amt = amount;
    setShowSettleModal(false); setSettlementFrom(""); setSettlementTo(""); setSettlementAmount("");
    try {
      await api.createSettlement({ from, to, amount: amt, groupId: id });
      await new Promise(r => setTimeout(r, 300));
      await loadData();
    } catch (err) { alert("Failed to record settlement"); await loadData(); }
  };

  const getSuggestedSettlements = () => {
    if (!groupDetail?.balances) return [];
    const debtors = groupDetail.balances.filter(b => b.amount < -0.01).map(b => ({ ...b, amount: Math.abs(b.amount) })).sort((a, b) => b.amount - a.amount);
    const creditors = [...groupDetail.balances.filter(b => b.amount > 0.01)].sort((a, b) => b.amount - a.amount);
    const suggestions: { from: string; to: string; amount: number }[] = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amt = Math.min(debtors[i].amount, creditors[j].amount);
      if (amt > 0.01) suggestions.push({ from: debtors[i].name, to: creditors[j].name, amount: amt });
      debtors[i].amount -= amt; creditors[j].amount -= amt;
      if (Math.abs(debtors[i].amount) < 0.01) i++;
      if (Math.abs(creditors[j].amount) < 0.01) j++;
    }
    return suggestions;
  };

  const navItems = [
    { label: "Dashboard", icon: FiHome },
    { label: "Groups", icon: FiUsers },
    { label: "Expenses", icon: FiDollarSign },
    { label: "Analytics", icon: FiBarChart2 },
    { label: "Settings", icon: FiSettings },
  ];

  if (loading && !groupDetail) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner} />
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading group...</p>
      </div>
    );
  }

  if (error || !groupDetail) {
    return (
      <div style={s.loadingContainer}>
        <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error || "Group not found"}</p>
        <button onClick={() => router.back()} style={s.cancelButton}>Go Back</button>
        <button onClick={loadData} style={{ ...s.submitButton, marginLeft: "0.5rem" }}>Retry</button>
      </div>
    );
  }

  const { group, expenses, settlements, balances } = groupDetail;
  const suggestedSettlements = getSuggestedSettlements();
  const unsettledCount = balances.filter(b => Math.abs(b.amount) > 0.01).length;
  const allSettled = unsettledCount === 0 && balances.length > 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
  const paymentsTotal = payments.reduce((s, p) => s + p.amount, 0);
  const expTotal = expenseAmount ? parseFloat(expenseAmount) : 0;

  const paymentChartData = group.members.map(name => ({
    name,
    value: expenses.reduce((sum, exp) => sum + (exp.payments?.find((p: any) => p.name === name)?.amount || 0), 0),
  })).filter(d => d.value > 0);

  const balanceChartData = balances.map(b => ({ name: b.name, amount: b.amount }));

  return (
    <div style={s.container}>
      {/* ── Sidebar — identical to dashboard ── */}
      <div style={s.sidebar}>
        <div style={s.logo}>💰 Splito</div>
        <nav style={s.nav}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => router.push("/dashboard")}
                style={{ ...s.navItem, backgroundColor: "transparent", color: "#4b5563" }}>
                <Icon size={20} /><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ── */}
      <div style={s.main}>
        {/* Header */}
        <header style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => router.back()} style={s.iconBtn}>
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 style={s.pageTitle}>{group.name}</h1>
              <span style={s.memberPill}><FiUsers size={11} style={{ marginRight: 4 }} />{group.members.length} members</span>
            </div>
          </div>
          <div style={s.headerRight}>
            <button onClick={loadData} style={s.iconBtn} title="Refresh" disabled={loading}>
              <FiRefreshCw size={16} />
            </button>
            <button onClick={openExpenseModal} style={s.primaryBtn}>
              <FiDollarSign size={15} /> Add Expense
            </button>
            <button
              onClick={() => setShowSettleModal(true)}
              style={{ ...s.secondaryBtn, opacity: allSettled ? 0.5 : 1, cursor: allSettled ? "not-allowed" : "pointer" }}
              disabled={allSettled}
            >
              <FiCheckCircle size={15} /> Settle Up
            </button>
          </div>
        </header>

        {/* Stats — same as dashboard statsGrid */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total Expenses</p>
            <p style={s.statValue}>Rs {totalExpenses.toFixed(2)}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Settlements</p>
            <p style={s.statValue}>{settlements.length}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Unsettled Balances</p>
            <p style={{ ...s.statValue, color: allSettled ? "#10b981" : "#111827" }}>
              {allSettled ? "✓ All clear" : unsettledCount}
            </p>
          </div>
        </div>

        {/* Charts row */}
        <div style={s.chartsRow}>
          {paymentChartData.length > 0 && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>Payments by Member</h3>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={paymentChartData} cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={3} dataKey="value">
                    {paymentChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `Rs ${v}`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
                {paymentChartData.map((d, i) => (
                  <span key={d.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: "#6b7280" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS[i % COLORS.length], display: "inline-block" }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Net Balances</h3>
            {allSettled ? (
              <div style={s.settledBox}>
                <FiCheckCircle size={36} color="#10b981" />
                <p style={{ color: "#10b981", fontWeight: 600, marginTop: "0.5rem" }}>All settled up!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={balanceChartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => `Rs ${Number(v).toFixed(2)}`} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {balanceChartData.map((e, i) => <Cell key={i} fill={e.amount >= 0 ? "#10b981" : "#ef4444"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Two-column */}
        <div style={s.twoCol}>
          {/* Left */}
          <div style={s.leftCol}>
            {/* Balances card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Balances</h3>
                {!allSettled && <span style={s.badge}>{unsettledCount} unsettled</span>}
              </div>
              {allSettled ? (
                <div style={s.settledBox}>
                  <FiCheckCircle size={22} color="#10b981" />
                  <p style={{ color: "#10b981", fontWeight: 600, fontSize: "0.875rem", marginTop: "0.35rem" }}>All settled!</p>
                </div>
              ) : (
                <div style={s.balanceList}>
                  {balances.map(b => (
                    <div key={b.name} style={s.balanceRow}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={s.memberAvatar}>{b.name.charAt(0).toUpperCase()}</div>
                        <span style={{ fontSize: "0.875rem", color: "#374151" }}>{b.name}</span>
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: Math.abs(b.amount) < 0.01 ? "#9ca3af" : b.amount > 0 ? "#10b981" : "#ef4444" }}>
                        {Math.abs(b.amount) < 0.01 ? "Settled ✓" : b.amount > 0 ? `+Rs ${b.amount.toFixed(2)}` : `-Rs ${Math.abs(b.amount).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {suggestedSettlements.length > 0 && (
                <div style={s.suggestionBox}>
                  <p style={s.suggestionTitle}>💡 Suggested settlements</p>
                  {suggestedSettlements.map((sg, idx) => (
                    <div key={idx} style={s.suggestionRow}>
                      <span><strong>{sg.from}</strong> → <strong>{sg.to}</strong></span>
                      <span style={{ fontWeight: 600 }}>Rs {sg.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Members card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Members</h3>
                <span style={s.badge}>{group.members.length}</span>
              </div>
              <div style={s.memberList}>
                {group.members.map((name, i) => (
                  <div key={i} style={s.memberRow}>
                    <div style={s.memberAvatar}>{name.charAt(0).toUpperCase()}</div>
                    <span style={{ fontSize: "0.875rem", color: "#111827" }}>{name}</span>
                  </div>
                ))}
              </div>
              <div style={s.addMemberRow}>
                <input type="text" placeholder="Add member name" value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addMember()}
                  style={s.memberInput} />
                <button onClick={addMember} style={s.addBtn}>
                  <FiUserPlus size={14} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={s.rightCol}>
            {/* Expenses card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Expenses</h3>
                <button onClick={openExpenseModal} style={s.primaryBtn}>
                  <FiDollarSign size={13} /> Add
                </button>
              </div>
              {expenses.length === 0 ? (
                <p style={s.emptyText}>No expenses yet.</p>
              ) : (
                <div style={s.expenseList}>
                  {expenses.map(exp => {
                    const equalShare = exp.totalAmount / group.members.length;
                    const nets = group.members.map(name => ({
                      name,
                      net: (exp.payments?.find((p: any) => p.name === name)?.amount || 0) - equalShare,
                    })).filter(n => Math.abs(n.net) > 0.01);
                    const over = nets.filter(n => n.net > 0);
                    const under = nets.filter(n => n.net < 0);
                    return (
                      <div key={exp._id} style={s.expenseItem}>
                        <div style={s.expenseTop}>
                          <div>
                            <p style={s.expenseDesc}>{exp.description}</p>
                            <p style={s.expenseDate}>{new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                          <span style={s.expenseAmt}>Rs {exp.totalAmount.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                          {exp.payments?.map((p: any, idx: number) => (
                            <span key={idx} style={s.paymentTag}>{p.name}: Rs {p.amount}</span>
                          ))}
                        </div>
                        {over.length > 0 && under.length > 0 && (
                          <div style={s.netResult}>
                            {over.map(o => under.map(u => {
                              const amt = Math.min(o.net, Math.abs(u.net));
                              return amt > 0.01 ? (
                                <div key={`${u.name}-${o.name}`} style={s.netRow}>
                                  <span><strong>{u.name}</strong> owes <strong>{o.name}</strong></span>
                                  <span style={{ fontWeight: 600 }}>Rs {amt.toFixed(2)}</span>
                                </div>
                              ) : null;
                            }))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settlement history */}
            {settlements.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <h3 style={s.cardTitle}>Settlement History</h3>
                  <span style={s.badge}>{settlements.length}</span>
                </div>
                <div style={s.settlementList}>
                  {settlements.map(st => (
                    <div key={st._id} style={s.settlementRow}>
                      <FiCheckCircle size={14} color="#10b981" style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: "0.875rem", color: "#111827" }}>
                        <strong>{st.from}</strong> paid <strong>{st.to}</strong>
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>Rs {st.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      {showAddExpense && (
        <div style={s.overlay} onClick={() => setShowAddExpense(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Add Expense</h3>
            <input type="text" placeholder="Description" value={expenseDescription}
              onChange={e => setExpenseDescription(e.target.value)} style={s.input} />
            <input type="number" placeholder="Total Amount" value={expenseAmount}
              onChange={e => setExpenseAmount(e.target.value)} style={s.input} />
            <p style={s.modalLabel}>💰 Who paid how much?</p>
            {payments.map(p => (
              <div key={p.name} style={s.participantRow}>
                <div style={{ ...s.memberAvatar, width: 28, height: 28, fontSize: "0.72rem", flexShrink: 0 }}>{p.name.charAt(0).toUpperCase()}</div>
                <span style={{ width: "80px", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>{p.name}</span>
                <input type="number" value={p.amount}
                  onChange={e => updatePaymentAmount(p.name, parseFloat(e.target.value) || 0)}
                  style={{ ...s.input, margin: 0, flex: 1 }} placeholder="Amount" />
              </div>
            ))}
            {expenseAmount && (
              <p style={{ fontSize: "0.8rem", margin: "0.5rem 0 1rem", color: Math.abs(paymentsTotal - expTotal) < 0.01 ? "#10b981" : "#ef4444" }}>
                Total: Rs {paymentsTotal.toFixed(2)} / Rs {expTotal.toFixed(2)}
              </p>
            )}
            <div style={s.modalActions}>
              <button onClick={() => setShowAddExpense(false)} style={s.cancelButton}>Cancel</button>
              <button onClick={handleAddExpense}
                style={{ ...s.submitButton, opacity: expenseAmount && Math.abs(paymentsTotal - expTotal) < 0.01 ? 1 : 0.5 }}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settle Up Modal ── */}
      {showSettleModal && (
        <div style={s.overlay} onClick={() => setShowSettleModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Record Settlement</h3>
            {suggestedSettlements.length > 0 && (
              <div style={s.suggestionBox}>
                <p style={s.suggestionTitle}>💡 Click to auto-fill</p>
                {suggestedSettlements.map((sg, idx) => (
                  <button key={idx} style={s.suggestionClickable} onClick={() => {
                    setSettlementFrom(sg.from); setSettlementTo(sg.to); setSettlementAmount(sg.amount.toFixed(2));
                  }}>
                    <span>{sg.from} → {sg.to}</span>
                    <span style={{ fontWeight: 600 }}>Rs {sg.amount.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
            <label style={s.fieldLabel}>Who is paying?</label>
            <select value={settlementFrom} onChange={e => setSettlementFrom(e.target.value)} style={s.input}>
              <option value="">Select member</option>
              {group.members.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <label style={s.fieldLabel}>Who is receiving?</label>
            <select value={settlementTo} onChange={e => setSettlementTo(e.target.value)} style={s.input}>
              <option value="">Select member</option>
              {group.members.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <label style={s.fieldLabel}>Amount</label>
            <input type="number" placeholder="0.00" value={settlementAmount}
              onChange={e => setSettlementAmount(e.target.value)} style={s.input} />
            <div style={s.modalActions}>
              <button onClick={() => setShowSettleModal(false)} style={s.cancelButton}>Cancel</button>
              <button onClick={handleSettleUp} style={s.submitButton}>Record Settlement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  loadingContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },
  spinner: { width: "3rem", height: "3rem", border: "4px solid #e5e7eb", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" },
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" },

  // Sidebar — pixel-for-pixel dashboard match
  sidebar: { width: "260px", backgroundColor: "white", borderRight: "1px solid #e5e7eb", padding: "2rem 1rem", flexShrink: 0 },
  logo: { fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", marginBottom: "2rem", paddingLeft: "1rem" },
  nav: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", border: "none", borderRadius: "0.5rem", fontSize: "0.95rem", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s" },

  // Main
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  pageTitle: { fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "0.25rem" },
  memberPill: { display: "inline-flex", alignItems: "center", fontSize: "0.75rem", color: "#10b981", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "999px", padding: "2px 10px", fontWeight: 500 },
  headerRight: { display: "flex", gap: "0.75rem", alignItems: "center" },
  iconBtn: { display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "0.5rem", cursor: "pointer", color: "#6b7280" },
  primaryBtn: { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  secondaryBtn: { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem", backgroundColor: "#f3f4f6", color: "#4b5563", border: "none", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  statCard: { backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  statLabel: { fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" },
  statValue: { fontSize: "1.5rem", fontWeight: "bold", color: "#111827" },

  // Cards
  chartsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  card: { backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  cardTitle: { fontSize: "1rem", fontWeight: 600, color: "#111827" },
  badge: { backgroundColor: "#f0fdf4", color: "#10b981", border: "1px solid #bbf7d0", borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 },

  // Layout
  twoCol: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" },
  leftCol: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  rightCol: { display: "flex", flexDirection: "column", gap: "1.5rem" },

  // Settled
  settledBox: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" },

  // Balances
  balanceList: { display: "flex", flexDirection: "column" },
  balanceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f3f4f6" },

  // Suggestions
  suggestionBox: { marginTop: "1rem", padding: "0.875rem", backgroundColor: "#eff6ff", borderRadius: "0.5rem", border: "1px solid #bfdbfe" },
  suggestionTitle: { fontSize: "0.78rem", fontWeight: 600, color: "#1d4ed8", marginBottom: "0.5rem" },
  suggestionRow: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#1d4ed8", padding: "0.2rem 0" },
  suggestionClickable: { display: "flex", justifyContent: "space-between", width: "100%", background: "rgba(255,255,255,0.7)", border: "1px solid #bfdbfe", borderRadius: "0.375rem", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", color: "#1d4ed8", marginBottom: "0.3rem", fontFamily: "inherit" },

  // Members
  memberList: { display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" },
  memberRow: { display: "flex", alignItems: "center", gap: "0.75rem" },
  memberAvatar: { width: "32px", height: "32px", backgroundColor: "#10b981", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600, flexShrink: 0 },
  addMemberRow: { display: "flex", gap: "0.5rem" },
  memberInput: { flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", fontSize: "0.875rem", fontFamily: "inherit" },
  addBtn: { display: "flex", alignItems: "center", gap: 4, padding: "0.5rem 0.875rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "0.375rem", fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" },

  // Expenses
  expenseList: { display: "flex", flexDirection: "column" },
  expenseItem: { borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem", marginBottom: "1rem" },
  expenseTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  expenseDesc: { fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 2 },
  expenseDate: { fontSize: "0.75rem", color: "#9ca3af" },
  expenseAmt: { fontSize: "0.9375rem", fontWeight: 700, color: "#111827", flexShrink: 0 },
  paymentTag: { fontSize: "0.72rem", backgroundColor: "#d1fae5", color: "#047857", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 },
  netResult: { marginTop: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#fffbeb", borderRadius: "0.375rem", border: "1px solid #fde68a" },
  netRow: { display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#92400e" },
  emptyText: { color: "#9ca3af", textAlign: "center", padding: "2rem 0", fontSize: "0.875rem" },

  // Settlements
  settlementList: { display: "flex", flexDirection: "column" },
  settlementRow: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0", borderBottom: "1px solid #f3f4f6" },

  // Modal
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { backgroundColor: "white", padding: "2rem", borderRadius: "1rem", width: "480px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalTitle: { fontSize: "1.125rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" },
  modalLabel: { fontSize: "0.875rem", fontWeight: 500, color: "#047857", marginBottom: "0.5rem" },
  fieldLabel: { display: "block", fontSize: "0.72rem", color: "#6b7280", fontWeight: 500, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "0.65rem 0.875rem", marginBottom: "1rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" },
  participantRow: { display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" },
  modalActions: { display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" },
  cancelButton: { padding: "0.6rem 1.1rem", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit" },
  submitButton: { padding: "0.6rem 1.25rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "inherit" },
};