"use client";

import { useState } from 'react';
import { api } from '@/lib/api';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGroupModal = ({ onClose, onSuccess }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const handleAddMember = async () => {
  if (!usernameInput.trim()) return;
  setSearchLoading(true);
  setError('');
  try {
    const users = await api.searchUsers(usernameInput);
    if (users.length === 0) {
      setError('User not found');
      return;
    }
    const user = users[0];
    if (selectedMembers.some(m => m.id === user.id || m.id === user._id)) {
      setError('User already added');
      return;
    }
    setSelectedMembers([....selectedMembers, { id: user.id || user._id, username: user.username }]);
    setUsernameInput('');
  } catch (err) {
    setError('Failed to search user');
  } finally {
    setSearchLoading(false);
  }
};

  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== userId));
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
        name: groupName,
        memberIds: selectedMembers.map(m => m.id)
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
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Create New Group</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Group name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Add members by username */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Add Members (by username)</label>
            <div style={styles.addRow}>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                style={styles.input}
                placeholder="Enter username"
              />
              <button
                type="button"
                onClick={handleAddMember}
                disabled={searchLoading}
                style={styles.addButton}
              >
                {searchLoading ? '...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Selected members list */}
          {selectedMembers.length > 0 && (
            <div style={styles.selectedList}>
              <label style={styles.label}>Selected Members</label>
              <div style={styles.tags}>
                {selectedMembers.map(member => (
                  <div key={member.id} style={styles.tag}>
                    <span>{member.username}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      style={styles.removeTag}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitButton}>
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
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '20px'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    color: '#dc2626',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '16px'
  },
  addRow: {
    display: 'flex',
    gap: '8px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const
  },
  selectedList: {
    marginBottom: '20px'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#e0f2fe',
    borderRadius: '20px',
    fontSize: '14px'
  },
  removeTag: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280',
    marginLeft: '4px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};