"use client";

import { useState } from 'react';
import { api } from '@/lib/api';

interface ExpenseFormProps {
  groupId: string;
  members: any[];
  currentUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type SplitType = 'equal' | 'unequal' | 'percentage' | 'exact';

export const ExpenseForm = ({ groupId, members, currentUserId, onClose, onSuccess }: ExpenseFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [participants, setParticipants] = useState(
    members.map(m => ({
      userId: m._id,
      username: m.username,
      value: 0
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);
    // Reset values
    setParticipants(participants.map(p => ({ ...p, value: 0 })));
  };

  const handleParticipantChange = (userId: string, value: number) => {
    setParticipants(prev =>
      prev.map(p => (p.userId === userId ? { ...p, value } : p))
    );
  };

  const validateSplits = (): boolean => {
    const totalAmount = parseFloat(amount);

    switch (splitType) {
      case 'equal':
        return true;
      case 'unequal':
      case 'exact': {
        const totalSplit = participants.reduce((sum, p) => sum + p.value, 0);
        if (Math.abs(totalSplit - totalAmount) > 0.01) {
          setError(`Split amounts must equal Rs ${totalAmount.toFixed(2)}`);
          return false;
        }
        break;
      }
      case 'percentage': {
        const totalPercentage = participants.reduce((sum, p) => sum + p.value, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          setError(`Percentages must total 100%`);
          return false;
        }
        break;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      setError('Please fill all fields');
      return;
    }

    if (!validateSplits()) return;

    setLoading(true);
    setError(null);

    try {
      const participantsData = participants.map(p => ({
        userId: p.userId,
        ...(splitType === 'percentage' ? { percentage: p.value } : { value: p.value })
      }));

      await api.createExpense({
        description,
        amount: parseFloat(amount),
        paidBy: currentUserId,
        splitWith: participants.map(p => p.userId),
        groupId,
        splitType,
        participants: participantsData
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>Add New Expense</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
              required
            />
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
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Split Type</label>
            <div style={splitTypeGridStyle}>
              {['equal', 'unequal', 'percentage', 'exact'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSplitTypeChange(type as SplitType)}
                  style={{
                    ...splitTypeButtonStyle,
                    backgroundColor: splitType === type ? '#10b981' : '#f3f4f6',
                    color: splitType === type ? 'white' : '#374151',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Split Details</label>
            {participants.map((p) => (
              <div key={p.userId} style={participantRowStyle}>
                <span style={{ flex: 1, fontWeight: 500 }}>{p.username}</span>
                <input
                  type="number"
                  value={p.value}
                  onChange={(e) => handleParticipantChange(p.userId, parseFloat(e.target.value))}
                  style={participantInputStyle}
                  placeholder={splitType === 'percentage' ? '%' : 'Amount'}
                  min="0"
                  step="0.01"
                  disabled={splitType === 'equal'}
                  required={splitType !== 'equal'}
                />
              </div>
            ))}
          </div>

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
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
  maxWidth: '600px',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto'
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

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem'
};

const splitTypeGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.5rem'
};

const splitTypeButtonStyle = {
  padding: '0.5rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  textTransform: 'capitalize' as const
};

const participantRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '0.5rem',
  padding: '0.5rem',
  backgroundColor: '#f9fafb',
  borderRadius: '0.5rem'
};

const participantInputStyle = {
  width: '100px',
  padding: '0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.25rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  marginTop: '1rem'
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