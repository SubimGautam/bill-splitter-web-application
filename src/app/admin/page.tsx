import { FiUsers, FiFolder, FiTrendingUp, FiDollarSign, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

async function getStats() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return { users: 0, groups: 0, settlements: 0, expenses: 0 };
    }

    // Fetch users count
    const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const usersData = await usersRes.json();
    const users = usersData.success ? usersData.data.length : 0;

    // Fetch groups
    const groupsRes = await fetch(`${API_BASE_URL}/admin/groups`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const groupsData = await groupsRes.json();
    const groups = groupsData.success ? groupsData.data : [];
    
    // Calculate total expenses and settlements from groups
    let totalExpenses = 0;
    let totalSettlements = 0;

    // Fetch details for each group to get expenses and settlements
    for (const group of groups) {
      try {
        const groupDetailRes = await fetch(`${API_BASE_URL}/groups/${group._id}/balances`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const groupDetailData = await groupDetailRes.json();
        
        if (groupDetailData.success && groupDetailData.data) {
          // Count expenses
          if (groupDetailData.data.expenses && Array.isArray(groupDetailData.data.expenses)) {
            totalExpenses += groupDetailData.data.expenses.length;
          }
          
          // Count settlements
          if (groupDetailData.data.settlements && Array.isArray(groupDetailData.data.settlements)) {
            totalSettlements += groupDetailData.data.settlements.length;
          }
        }
      } catch (error) {
        console.error(`Error fetching details for group ${group._id}:`, error);
      }
    }

    return { 
      users, 
      groups: groups.length, 
      settlements: totalSettlements, 
      expenses: totalExpenses 
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { users: 0, groups: 0, settlements: 0, expenses: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: FiUsers,
      href: "/admin/users",
      color: "#10b981",
      lightBg: "#f0fdf4",
      border: "#d1fae5",
    },
    {
      label: "Total Groups",
      value: stats.groups,
      icon: FiFolder,
      href: "/admin/groups",
      color: "#3b82f6",
      lightBg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Settlements",
      value: stats.settlements,
      icon: FiTrendingUp,
      href: "/admin",
      color: "#f59e0b",
      lightBg: "#fffbeb",
      border: "#fde68a",
    },
    {
      label: "Total Expenses",
      value: stats.expenses,
      icon: FiDollarSign,
      href: "/admin",
      color: "#8b5cf6",
      lightBg: "#f5f3ff",
      border: "#ddd6fe",
    },
  ];

  const quickLinks = [
    { label: "Manage Users", desc: "View, edit and delete users", href: "/admin/users", icon: FiUsers },
    { label: "Manage Groups", desc: "Oversee all expense groups", href: "/admin/groups", icon: FiFolder },
    { label: "Edit Profile", desc: "Update your admin account", href: "/admin/profile", icon: FiTrendingUp },
  ];

  return (
    <>
      <style>{`
        .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
        .stat-card { transition: box-shadow 0.2s, transform 0.2s; }
        .quick-link:hover { border-color: #10b981 !important; background: #f0fdf4 !important; }
        .quick-link { transition: border-color 0.15s, background 0.15s; }
      `}</style>
      <div>
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
            Welcome back — here's what's happening across your platform.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href} style={{ textDecoration: "none" }}>
                <div className="stat-card" style={{
                  backgroundColor: "white",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "0.875rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "10px",
                      backgroundColor: card.lightBg, border: `1px solid ${card.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={20} style={{ color: card.color }} />
                    </div>
                    <FiArrowUpRight size={16} style={{ color: "#d1d5db" }} />
                  </div>
                  <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", lineHeight: 1, marginBottom: "0.375rem" }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500 }}>{card.label}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>
          {/* Quick actions */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.875rem",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "1.5rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Quick Actions</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {quickLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
                    <div className="quick-link" style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.875rem 1rem",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.625rem",
                      cursor: "pointer",
                    }}>
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "9px",
                        backgroundColor: "#f0fdf4", border: "1px solid #d1fae5",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon size={17} style={{ color: "#10b981" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>{l.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{l.desc}</p>
                      </div>
                      <FiArrowRight size={16} style={{ color: "#d1d5db" }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System status */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.875rem",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "1.5rem",
          }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}>System Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "API Server", status: "Operational", uptime: "99.9%" },
                { label: "Database", status: "Operational", uptime: "100%" },
                { label: "Auth Service", status: "Operational", uptime: "99.8%" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "2px" }}>{s.label}</p>
                    <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Uptime {s.uptime}</p>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    fontSize: "0.7rem", color: "#10b981", fontWeight: 600,
                    backgroundColor: "#f0fdf4", border: "1px solid #d1fae5",
                    borderRadius: "999px", padding: "3px 10px",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
                    OK
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "1.25rem", padding: "0.75rem",
              backgroundColor: "#f0fdf4", borderRadius: "0.5rem",
              border: "1px solid #d1fae5", textAlign: "center",
            }}>
              <p style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>✓ All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}