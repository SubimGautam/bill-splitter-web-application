"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FaTimes, FaUserPlus, FaUsers } from 'react-icons/fa';

// Assuming User from api has { id, username, email, ... }
import type { User } from '@/lib/api';   // ← make sure this import exists

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// We now use the same shape as User (with id instead of userId)
type Friend = Pick<User, 'id' | 'username' | 'email'>;

export const CreateGroupModal = ({ onClose, onSuccess }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]); // array of user IDs
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const friendsData = await api.getFriends();           // hopefully returns { id, username, email }[]
      setFriends(friendsData);
    } catch (err) {
      console.error('Failed to load friends:', err);
      setError('Failed to load friends. Please try again.');
    } finally {
      setLoadingFriends(false);
    }
  };

  const toggleFriend = (userId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createGroup({
        name: groupName.trim(),
        memberIds: selectedFriends,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create New Group</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.input}
              placeholder="e.g., Family Trip 2025"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaUsers style={{ marginRight: '0.5rem' }} />
              Add Friends ({selectedFriends.length} selected)
            </label>

            {loadingFriends ? (
              <div style={styles.loadingBox}>Loading friends...</div>
            ) : friends.length === 0 ? (
              <div style={styles.emptyBox}>
                <p>No friends found yet.</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Add some friends first from the friends page.
                </p>
              </div>
            ) : (
              <div style={styles.friendsList}>
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    style={{
                      ...styles.friendItem,
                      backgroundColor: selectedFriends.includes(friend.id) ? '#d1fae5' : '#f9fafb',
                      borderColor: selectedFriends.includes(friend.id) ? '#10b981' : '#e5e7eb',
                    }}
                  >
                    <div style={styles.friendInfo}>
                      <div
                        style={{
                          ...styles.avatar,
                          backgroundColor: selectedFriends.includes(friend.id) ? '#10b981' : '#6b7280',
                        }}
                      >
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.friendName}>{friend.username}</div>
                        <div style={styles.friendEmail}>{friend.email}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        ...styles.checkbox,
                        backgroundColor: selectedFriends.includes(friend.id) ? '#10b981' : 'white',
                      }}
                    >
                      {selectedFriends.includes(friend.id) && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              style={{
                ...styles.submitButton,
                opacity: loading || !groupName.trim() ? 0.6 : 1,
                cursor: loading || !groupName.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
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
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '0',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold' as const,
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    color: '#6b7280',
    padding: '0.25rem'
  },
  error: {
    margin: '1.5rem 1.5rem 0',
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#dc2626',
    fontSize: '0.875rem'
  },
  inputGroup: {
    padding: '0 1.5rem',
    marginTop: '1.5rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontWeight: 500,
    fontSize: '0.875rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    boxSizing: 'border-box' as const
  },
  friendsList: {
    maxHeight: '300px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  friendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid'
  },
  friendInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  avatar: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold' as const,
    fontSize: '1rem'
  },
  friendName: {
    fontWeight: 500,
    color: '#111827'
  },
  friendEmail: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  checkbox: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.25rem',
    border: '2px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold' as const,
    fontSize: '1rem'
  },
  loadingBox: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem'
  },
  emptyBox: {
    padding: '2rem',
    textAlign: 'center' as const,
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    marginTop: '1.5rem'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 500,
    fontSize: '0.875rem'
  }
};