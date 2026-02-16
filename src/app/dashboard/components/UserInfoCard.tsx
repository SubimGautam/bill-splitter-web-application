"use client";

import React from 'react';
import Link from 'next/link';
import { FaUserCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface UserInfoCardProps {
  user: User;
  onLogout: () => void;
}

export const UserInfoCard = ({ user, onLogout }: UserInfoCardProps) => {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
      border: "1px solid #bbf7d0",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
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
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
            transition: 'background-color 0.2s, color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#10b981';
          }}
        >
          <FaUser /> Edit Profile
        </Link>
        <button 
          onClick={onLogout} 
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
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
};