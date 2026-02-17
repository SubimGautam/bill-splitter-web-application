"use client";

import { FaReceipt, FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useState } from 'react';

interface ExpenseListProps {
  expenses: any[];
  onExpenseUpdated: () => void;
  currentUserId: string;
}

export const ExpenseList = ({ expenses, onExpenseUpdated, currentUserId }: ExpenseListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
   
    try {
      await api.deleteExpense(expenseId);
      onExpenseUpdated();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense._id); // Changed to _id for consistency
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = async (expenseId: string) => {
    try {
      await api.updateExpense(expenseId, {
        description: editDescription,
        amount: parseFloat(editAmount)
      });
      setEditingId(null);
      onExpenseUpdated();
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
        <FaReceipt size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <p>No expenses yet. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {expenses.map((expense) => (
        <div key={expense._id} style={{  // Changed to _id
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.75rem',
          transition: 'background-color 0.2s'
        }}>
          {editingId === expense._id ? (  // Changed to _id
            // Edit mode
            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{ flex: 2, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              />
              <button
                onClick={() => handleSaveEdit(expense._id)}  // Changed to _id
                style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem' }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.25rem' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaReceipt style={{ color: '#6b7280' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{expense.description}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Paid by {expense.paidBy} • {expense.date}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontWeight: 'bold' }}>Rs {expense.amount.toFixed(2)}</div>
                {expense.paidBy === currentUserId && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(expense)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}  // Changed to _id
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};