// src/app/dashboard/components/BalancesSection.tsx
"use client";

import React, { useState } from 'react';
import { Balance } from '../types/dashboard.type';
import { api } from '@/lib/api';

interface BalancesSectionProps {
  balances: Balance[];
  currentUserId?: string;
  groupId: string;
  onSettleUp?: () => void;
}

export const BalancesSection = ({ balances, currentUserId, groupId, onSettleUp }: BalancesSectionProps) => {
  const [settlingUserId, setSettlingUserId] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);

  const handleSettleUp = async (balance: Balance) => {
    if (!currentUserId) {
      alert('User not authenticated');
      return;
    }

    if (!groupId) {
      alert('Group ID is required');
      return;
    }

    setIsSettling(true);
    setSettlingUserId(balance.userId);

    try {
      const amount = Math.abs(balance.amount);
      
      if (balance.amount > 0) {
        // They owe you
        await api.settleUp({
          from: balance.userId,
          to: currentUserId,
          amount: amount,
          groupId: groupId
        });
      } else {
        // You owe them
        await api.settleUp({
          from: currentUserId,
          to: balance.userId,
          amount: amount,
          groupId: groupId
        });
      }
      
      setSettlingUserId(null);
      if (onSettleUp) onSettleUp();
    } catch (error) {
      console.error('Settle up failed:', error);
      alert('Failed to settle up. Please try again.');
    } finally {
      setIsSettling(false);
      setSettlingUserId(null);
    }
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "1.5rem" }}>
        Balances
      </h2>

      {balances.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {balances.map((balance) => (
            <BalanceCard
              key={balance.userId}
              balance={balance}
              onSettleClick={() => handleSettleUp(balance)}
              isSettling={settlingUserId === balance.userId && isSettling}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280", marginBottom: "1rem" }}>
          <p>All settled up! 🎉</p>
        </div>
      )}
    </div>
  );
};

const BalanceCard = ({ balance, onSettleClick, isSettling }: { 
  balance: Balance; 
  onSettleClick: () => void; 
  isSettling: boolean 
}) => {
  const type = balance.amount > 0 ? 'owes you' : (balance.amount < 0 ? 'you owe' : 'settled');
  const amountAbs = Math.abs(balance.amount);
  
  const getBackgroundColor = () => {
    if (type === 'owes you') return "#d1fae5";
    if (type === 'you owe') return "#fee2e2";
    return "#f3f4f6";
  };

  const getTextColor = () => {
    if (type === 'owes you') return "#10b981";
    if (type === 'you owe') return "#dc2626";
    return "#6b7280";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "0.75rem",
        backgroundColor: "#f9fafb",
        transition: "background-color 0.2s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: getBackgroundColor(),
        }}>
          <span style={{ fontWeight: "bold", color: getTextColor() }}>
            {balance.name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
        <div>
          <h4 style={{ fontWeight: 500, color: "#111827" }}>{balance.name}</h4>
          <p style={{ fontSize: "0.875rem", color: getTextColor() }}>
            {type === 'settled' ? 'All settled up' : type}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: getTextColor() }}>
          {type === 'owes you' ? '+' : type === 'you owe' ? '-' : ''}
          ${amountAbs.toFixed(2)}
        </div>
        {type !== 'settled' && (
          <button
            onClick={onSettleClick}
            disabled={isSettling}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: type === 'owes you' ? '#10b981' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: isSettling ? 'not-allowed' : 'pointer',
              opacity: isSettling ? 0.6 : 1,
            }}
          >
            {isSettling ? '...' : 'Settle'}
          </button>
        )}
      </div>
    </div>
  );
};