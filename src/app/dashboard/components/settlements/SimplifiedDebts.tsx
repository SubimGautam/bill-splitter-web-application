"use client";

import { useState } from 'react';
import { api } from '@/lib/api';

interface SimplifiedDebtsProps {
  debts: Array<{
    from: string;
    to: string;
    amount: number;
  }>;
  balances: Array<{
    userId: string;
    balance: number;
  }>;
  members: Array<{
    _id: string;
    username: string;
  }>;
  groupId: string; // Add this prop
  onSettled?: () => void;
}

export const SimplifiedDebts = ({ debts, balances, members, groupId, onSettled }: SimplifiedDebtsProps) => {
  const [settling, setSettling] = useState<string | null>(null);

  const getUsername = (userId: string) => {
    return members.find(m => m._id === userId)?.username || 'Unknown';
  };

  const handleSettleUp = async (debt: any) => {
    if (!confirm(`Mark settlement of Rs ${debt.amount.toFixed(2)} from ${getUsername(debt.from)} to ${getUsername(debt.to)}?`)) {
      return;
    }

    setSettling(`${debt.from}-${debt.to}`);
    try {
      await api.settleUp({
        from: debt.from,
        to: debt.to,
        amount: debt.amount,
        groupId: groupId // Now using the prop
      });
      alert('Settlement recorded!');
      if (onSettled) onSettled();
    } catch (error) {
      console.error('Settlement failed:', error);
      alert('Failed to record settlement');
    } finally {
      setSettling(null);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Simplified Balances
      </h3>

      {/* Individual Balances */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#4b5563' }}>
          Individual Balances
        </h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {balances.map((balance) => {
            const user = members.find(m => m._id === balance.userId);
            return (
              <div
                key={balance.userId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem'
                }}
              >
                <span style={{ fontWeight: 500 }}>{user?.username}</span>
                <span style={{
                  color: balance.balance > 0 ? '#10b981' : balance.balance < 0 ? '#dc2626' : '#6b7280',
                  fontWeight: 600
                }}>
                  {balance.balance > 0 ? `+Rs ${balance.balance.toFixed(2)}` : 
                   balance.balance < 0 ? `-Rs ${Math.abs(balance.balance).toFixed(2)}` : 
                   'Settled'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Debts */}
      {debts.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#4b5563' }}>
            Who Owes Whom (Simplified)
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {debts.map((debt, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{getUsername(debt.from)}</span>
                    <span style={{ margin: '0 0.5rem', color: '#6b7280' }}>owes</span>
                    <span style={{ fontWeight: 500 }}>{getUsername(debt.to)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>
                      Rs {debt.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleSettleUp(debt)}
                      disabled={settling === `${debt.from}-${debt.to}`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        opacity: settling === `${debt.from}-${debt.to}` ? 0.6 : 1
                      }}
                    >
                      {settling === `${debt.from}-${debt.to}` ? 'Processing...' : 'Settle Up'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {debts.length === 0 && balances.every(b => Math.abs(b.balance) < 0.01) && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>Everyone is settled up! 🎉</p>
        </div>
      )}
    </div>
  );
};