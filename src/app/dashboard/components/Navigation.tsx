"use client";

import React from 'react';
import Link from 'next/link';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';

interface NavigationProps {
  username: string;
  onLogout: () => void;
}

export const Navigation = ({ username, onLogout }: NavigationProps) => {
  return (
    <nav style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '0.75rem 1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>$</span>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #111827 0%, #374151 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Splito</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button style={{
          position: 'relative',
          padding: '0.5rem',
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          color: '#4b5563',
        }}>
          <FaBell />
          <span style={{
            position: 'absolute',
            top: '0.25rem',
            right: '0.25rem',
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
          }} />
        </button>

        <Link href="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: '#111827',
          fontWeight: 500,
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}>
          <FaUserCircle style={{ color: '#10b981' }} />
          <span>{username}</span>
        </Link>

        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};