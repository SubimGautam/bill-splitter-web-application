"use client";

import { useEffect, useState } from 'react';
import { 
  FaUsers, 
  FaReceipt, 
  FaMoneyBillWave, 
  FaChartPie,
  FaSignOutAlt,
  FaUserCircle,
  FaUser,
  FaPlus
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
  members: number;
  total: number;
  color: string;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  person: string;
  date: string;
  group: string;
}

interface Balance {
  person: string;
  amount: number;
  type: 'owes you' | 'you owe' | 'settled';
  avatar: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('Roommates');

  // Sample data
  const groups: Group[] = [
    { id: 1, name: 'Roommates', members: 3, total: 1200, color: '#10b981' },
    { id: 2, name: 'Weekend Trip', members: 5, total: 850, color: '#3b82f6' },
    { id: 3, name: 'Office Lunch', members: 8, total: 320, color: '#8b5cf6' },
    { id: 4, name: 'Family', members: 4, total: 2100, color: '#f59e0b' },
  ];

  const recentExpenses: Expense[] = [
    { id: 1, description: 'Grocery shopping', amount: 85.50, person: 'You', date: 'Today', group: 'Roommates' },
    { id: 2, description: 'Dinner at Restaurant', amount: 120.00, person: 'Alex', date: 'Yesterday', group: 'Weekend Trip' },
    { id: 3, description: 'Uber ride', amount: 24.75, person: 'Sam', date: '2 days ago', group: 'Roommates' },
    { id: 4, description: 'Movie tickets', amount: 60.00, person: 'You', date: '3 days ago', group: 'Office Lunch' },
  ];

  const balances: Balance[] = [
    { person: 'Alex', amount: 42.50, type: 'owes you', avatar: 'A' },
    { person: 'Sam', amount: 21.25, type: 'you owe', avatar: 'S' },
    { person: 'Jordan', amount: 15.00, type: 'settled', avatar: 'J' },
  ];

  // Authentication check - FIXED
  useEffect(() => {
    const checkAuth = () => {
      // Check both localStorage AND cookie
      const userStr = localStorage.getItem("user");
      const hasToken = document.cookie.includes('token=');

      if (!userStr || !hasToken) {
        console.log("No auth found, redirecting to login");
        // Clear any stale data
        localStorage.removeItem("user");
        document.cookie = 'token=; path=/; max-age=0';
        router.push("/authentication/login");
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.log("Error parsing user data, redirecting to login");
        localStorage.removeItem("user");
        document.cookie = 'token=; path=/; max-age=0';
        router.push("/authentication/login");
      }
    };

    // Add a small delay to ensure localStorage is updated
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    // Clear all auth data
    document.cookie = 'token=; path=/; max-age=0';
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    
    // Redirect to login
    router.push("/authentication/login");
    
    // Force a refresh to clear state
    setTimeout(() => {
      router.refresh();
    }, 50);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "4rem",
            height: "4rem",
            border: "4px solid #10b981",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f9fafb",
      padding: "1rem"
    }}>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .nav-links {
            display: flex !important;
          }
        }
        
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .content-grid {
            grid-template-columns: 2fr 1fr !important;
          }
          .groups-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
      
      {/* Navigation */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "0.75rem",
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            backgroundColor: "#10b981",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "1.25rem" }}>$</span>
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Splito</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem"
          }}>
            <FaUserCircle style={{ color: "#10b981" }} />
            <span style={{ fontWeight: 500 }}>{user.username}</span>
          </div>
          
          {/* Profile Link */}
          <Link 
            href="/profile"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
          >
            <FaUser /> Profile
          </Link>
          
          <button 
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            Welcome back, {user.username}! 👋
          </h1>
          <p style={{ color: "#6b7280" }}>
            Here's your expense overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginBottom: "2rem"
        }} className="stats-grid">
          {[
            { title: "Total Balance", value: "$+63.75", subtitle: "You are owed", icon: FaMoneyBillWave, color: "#10b981" },
            { title: "Active Groups", value: "4", subtitle: "Across all groups", icon: FaUsers, color: "#3b82f6" },
            { title: "This Month", value: "$485.25", subtitle: "Total spent", icon: FaChartPie, color: "#8b5cf6" },
            { title: "Pending", value: "2", subtitle: "Awaiting payment", icon: FaReceipt, color: "#f59e0b" },
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                    {stat.title}
                  </p>
                  <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#111827", marginBottom: "0.25rem" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: stat.color }}>
                    {stat.subtitle}
                  </p>
                </div>
                <div style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: `${stat.color}15`,
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <stat.icon style={{ color: stat.color, fontSize: "1.5rem" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem"
        }} className="content-grid">
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Groups Section */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Your Groups</h2>
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
                >
                  <FaPlus /> New Group
                </button>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem"
              }} className="groups-grid">
                {groups.map((group) => (
                  <div 
                    key={group.id}
                    style={{
                      border: activeGroup === group.name ? `2px solid ${group.color}` : "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      cursor: "pointer",
                      backgroundColor: activeGroup === group.name ? `${group.color}10` : "white",
                      transition: "all 0.2s"
                    }}
                    onClick={() => setActiveGroup(group.name)}
                    onMouseOver={(e) => {
                      if (activeGroup !== group.name) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                        e.currentTarget.style.borderColor = `${group.color}80`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeGroup !== group.name) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          backgroundColor: group.color,
                          borderRadius: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <FaUsers style={{ color: "white" }} />
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 600, color: "#111827" }}>{group.name}</h3>
                          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{group.members} members</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827" }}>
                        ${group.total.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#6b7280" }}>Last activity: Today</span>
                      <span style={{ color: "#10b981", fontWeight: 500 }}>View →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Expenses */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Recent Expenses</h2>
                <button style={{ 
                  color: "#10b981", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#059669"}
                onMouseOut={(e) => e.currentTarget.style.color = "#10b981"}
                >
                  View all →
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recentExpenses.map((expense) => (
                  <div 
                    key={expense.id} 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      border: "1px solid #f3f4f6",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      e.currentTarget.style.borderColor = "#f3f4f6";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FaReceipt style={{ color: "#6b7280" }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 500, color: "#111827" }}>{expense.description}</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                          <span style={{ 
                            padding: "0.125rem 0.5rem", 
                            backgroundColor: "#f3f4f6", 
                            borderRadius: "0.25rem" 
                          }}>
                            {expense.group}
                          </span>
                          <span>•</span>
                          <span style={expense.person === 'You' ? { color: "#10b981", fontWeight: 500 } : {}}>
                            {expense.person}
                          </span>
                          <span>•</span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "bold", color: "#111827" }}>${expense.amount.toFixed(2)}</p>
                      <p style={{ 
                        fontSize: "0.875rem", 
                        color: expense.person === 'You' ? "#10b981" : "#6b7280" 
                      }}>
                        {expense.person === 'You' ? 'You paid' : 'You owe'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px dashed #d1d5db",
                borderRadius: "0.5rem",
                backgroundColor: "transparent",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.borderColor = "#10b981";
                e.currentTarget.style.color = "#10b981";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.color = "#6b7280";
              }}
              >
                <FaPlus /> Add new expense
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Balances */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "1.5rem" }}>
                Balances
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {balances.map((balance, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                      transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: balance.type === 'owes you' ? "#d1fae5" : 
                                       balance.type === 'you owe' ? "#fee2e2" : "#f3f4f6",
                      }}>
                        <span style={{
                          fontWeight: "bold",
                          color: balance.type === 'owes you' ? "#10b981" : 
                                 balance.type === 'you owe' ? "#dc2626" : "#6b7280",
                        }}>
                          {balance.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 500, color: "#111827" }}>{balance.person}</h4>
                        <p style={{
                          fontSize: "0.875rem",
                          color: balance.type === 'owes you' ? "#10b981" : 
                                 balance.type === 'you owe' ? "#dc2626" : "#6b7280",
                        }}>
                          {balance.type === 'settled' ? 'All settled up' : balance.type}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      color: balance.type === 'owes you' ? "#10b981" : 
                             balance.type === 'you owe' ? "#dc2626" : "#111827",
                    }}>
                      {balance.type === 'owes you' ? '+' : balance.type === 'you owe' ? '-' : ''}
                      ${balance.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <button style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
              >
                Settle Up
              </button>
            </div>

            {/* User Info Card */}
            <div style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1px solid #bbf7d0",
              borderRadius: "0.75rem",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ 
                  width: "3rem", 
                  height: "3rem", 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  <FaUserCircle style={{ color: "#10b981", fontSize: "2rem" }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: "bold", color: "#111827" }}>{user.username}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user.email}</p>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Status</span>
                  <span style={{ 
                    padding: "0.125rem 0.5rem", 
                    backgroundColor: "#d1fae5", 
                    color: "#047857", 
                    borderRadius: "9999px", 
                    fontSize: "0.75rem", 
                    fontWeight: 500 
                  }}>
                    Active
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Role</span>
                  <span style={{ fontWeight: 500 }}>{user.role}</span>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link 
                  href="/profile"
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #10b981",
                    color: "#10b981",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#10b981";
                  }}
                >
                  <FaUser /> Edit Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #fee2e2",
                    color: "#dc2626",
                    borderRadius: "0.5rem",
                    backgroundColor: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fecaca";
                    e.currentTarget.style.borderColor = "#fecaca";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee2e2";
                    e.currentTarget.style.borderColor = "#fee2e2";
                  }}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}