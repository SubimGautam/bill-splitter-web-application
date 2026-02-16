"use client";

import { useState } from 'react';
import { api } from '@/lib/api';

interface SettlementModalProps {
  groupId: string;
  members: any[];
  balances: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const SettlementModal = ({ groupId, members, balances, onClose, onSuccess }: SettlementModalProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserName = (userId: string) => {
    return members.find(m => m._id === userId)?.username || 'Unknown';
  };

  const getUserBalance = (userId: string) => {
    return balances.find(b => b.userId === userId)?.balance || 0;
  };

  const handleSubmit = async () => {
    if (!from || !to || !amount) {
      setError('Please select both users and enter amount');
      return;
    }

    if (from === to) {
      setError('Cannot settle with yourself');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.settleUp({
        from,
        to,
        amount: numAmount,
        groupId // Add groupId here
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to record settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>Settle Up</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={formGroupStyle}>
          <label style={labelStyle}>Who is paying?</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select user</option>
            {members.map(member => (
              <option key={member._id} value={member._id}>
                {member.username} (Balance: Rs {getUserBalance(member._id).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Who is receiving?</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select user</option>
            {members.map(member => (
              <option key={member._id} value={member._id}>
                {member.username} (Balance: Rs {getUserBalance(member._id).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Amount (Rs)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        {from && to && (
          <div style={suggestionStyle}>
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Suggested settlement:</p>
            <p>{getUserName(from)} should pay {getUserName(to)} Rs {Math.abs(getUserBalance(from) || 0).toFixed(2)}</p>
          </div>
        )}

        <div style={buttonGroupStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={submitButtonStyle}
          >
            {loading ? 'Processing...' : 'Settle Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '1rem',
  padding: '2rem',
  maxWidth: '500px',
  width: '90%'
};

const modalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem'
};

const errorStyle = {
  padding: '0.75rem',
  backgroundColor: '#fee2e2',
  border: '1px solid #fecaca',
  borderRadius: '0.5rem',
  color: '#dc2626',
  marginBottom: '1rem'
};

const formGroupStyle = {
  marginBottom: '1.5rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 500
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem'
};

const suggestionStyle = {
  padding: '1rem',
  backgroundColor: '#f3f4f6',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  marginBottom: '1.5rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: 500
};

const submitButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: 500,
  opacity: 1
};