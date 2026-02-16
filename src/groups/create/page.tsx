"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:5000/api";

// Define types
interface User {
  _id: string;
  username: string;
  email: string;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch all users to add to group
    fetch(`${API_BASE_URL}/groups/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setUsers(data.data);
    })
    .catch(err => console.error('Failed to load users:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: groupName,
          memberIds: selectedMembers
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push('/groups');
      } else {
        alert(data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Create group error:', error);
      alert('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create New Group</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Add Members (select multiple)
          </label>
          <div style={{ 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem',
            padding: '1rem', 
            maxHeight: '300px', 
            overflow: 'auto' 
          }}>
            {users.length > 0 ? (
              users.map(user => (
                <div key={user._id} style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    <span>{user.username}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>({user.email})</span>
                  </label>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading users...</p>
            )}
          </div>
          {selectedMembers.length > 0 && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
              {selectedMembers.length} member(s) selected
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !groupName}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading || !groupName ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            opacity: loading || !groupName ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}