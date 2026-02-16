"use client";

import { useState } from 'react';
import { api } from '@/lib/api';

interface ExpenseFormProps {
  groupId: string;
  members: any[];
  currentUserId: string; // Add this prop
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
      value: 0,
      percentage: 0
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);
    // Reset values based on new split type
    const newParticipants = participants.map(p => ({
      ...p,
      value: 0,
      percentage: 0  // Always keep as number
    }));
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (userId: string, value: number) => {
    setParticipants(prev =>
      prev.map(p =>
        p.userId === userId
          ? { ...p, value }
          : p
      )
    );
  };

  const validateSplits = (): boolean => {
    const totalAmount = parseFloat(amount);

    switch (splitType) {
      case 'equal':
        return true; // Always valid
      
      case 'unequal':
      case 'exact': {
        const totalSplit = participants.reduce((sum, p) => sum + p.value, 0);
        if (Math.abs(totalSplit - totalAmount) > 0.01) {
          setError(`Split amounts total Rs ${totalSplit.toFixed(2)} must equal Rs ${totalAmount.toFixed(2)}`);
          return false;
        }
        break;
      }
      
      case 'percentage': {
        const totalPercentage = participants.reduce((sum, p) => sum + p.value, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          setError(`Percentages total ${totalPercentage}% must equal 100%`);
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

    if (!validateSplits()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format participants based on split type
      const participantsData = splitType === 'percentage'
        ? participants.map(p => ({
            userId: p.userId,
            percentage: p.value
          }))
        : participants.map(p => ({
            userId: p.userId,
            value: p.value
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Add New Expense
        </h2>

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#dc2626',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Amount (Rs)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Split Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {(['equal', 'unequal', 'percentage', 'exact'] as SplitType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSplitTypeChange(type)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: splitType === type ? '#10b981' : '#f3f4f6',
                    color: splitType === type ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Split Details
            </label>
            {participants.map((participant) => (
              <div
                key={participant.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem'
                }}
              >
                <span style={{ flex: 1, fontWeight: 500 }}>{participant.username}</span>
                {splitType === 'percentage' ? (
                  <input
                    type="number"
                    value={participant.value}
                    onChange={(e) => handleParticipantChange(participant.userId, parseFloat(e.target.value))}
                    style={{
                      width: '100px',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem'
                    }}
                    placeholder="%"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                ) : (
                  <input
                    type="number"
                    value={participant.value}
                    onChange={(e) => handleParticipantChange(participant.userId, parseFloat(e.target.value))}
                    style={{
                      width: '100px',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem'
                    }}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    required={splitType !== 'equal'}
                    disabled={splitType === 'equal'}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontWeight: 500
              }}
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};