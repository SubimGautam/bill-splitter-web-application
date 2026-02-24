"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { FiBell, FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <>
      <style>{`
        .logout-btn:hover { background: #fecaca !important; }
        .logout-btn { transition: background 0.15s; }
        .bell-btn:hover { background: #f3f4f6 !important; }
        .bell-btn { transition: background 0.15s; }
      `}</style>
      <header style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 1.5rem",
        height: "64px", // Fixed height
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "0.75rem",
        flexShrink: 0,
        width: "100%",
      }}>
        {/* Bell */}
        <button className="bell-btn" style={{
          position: "relative", 
          padding: "0.4rem",
          background: "none", 
          border: "none",
          borderRadius: "0.5rem", 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <FiBell size={18} style={{ color: "#6b7280" }} />
          <span style={{
            position: "absolute", 
            top: "6px", 
            right: "6px",
            width: "7px", 
            height: "7px", 
            borderRadius: "50%",
            backgroundColor: "#ef4444", 
            border: "2px solid white",
          }} />
        </button>

        {/* User pill */}
        <div style={{
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem",
          padding: "0.375rem 0.875rem",
          backgroundColor: "white",
          borderRadius: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          height: "38px",
        }}>
          <FiUser size={15} style={{ color: "#10b981" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#111827" }}>
            {user?.username || "Admin"}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Logout"
          className="logout-btn"
          style={{
            width: "2.25rem", 
            height: "2.25rem",
            padding: 0,
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "50%",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <FiLogOut size={16} />
        </button>
      </header>
    </>
  );
}