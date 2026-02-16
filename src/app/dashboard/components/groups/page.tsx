"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CreateGroupModal } from '../groups/CreateGroupModal';
import { FaUsers, FaPlus } from 'react-icons/fa';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await api.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Groups</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={styles.createButton}
        >
          <FaPlus /> New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div style={styles.emptyState}>
          <FaUsers size={48} color="#9ca3af" />
          <p style={styles.emptyText}>No groups yet. Create your first group!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.emptyButton}
          >
            Create Group
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {groups.map((group) => (
            <Link href={`/groups/${group.id}`} key={group.id} style={{ textDecoration: 'none' }}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>
                  <FaUsers color="#10b981" size={24} />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{group.name}</h3>
                  <p style={styles.cardSubtitle}>
                    {group.memberDetails?.length || group.members || 0} members
                  </p>
                </div>
                <div style={styles.cardBalance}>
                  <span style={styles.balanceLabel}>Total</span>
                  <span style={styles.balanceValue}>
                    Rs {group.totalBalance?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadGroups();
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    margin: 0
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    backgroundColor: '#f9fafb',
    borderRadius: '1rem'
  },
  emptyText: {
    color: '#6b7280',
    marginTop: '1rem',
    marginBottom: '1.5rem'
  },
  emptyButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  cardIcon: {
    width: '3rem',
    height: '3rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#111827',
    margin: 0
  },
  cardSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  cardBalance: {
    textAlign: 'right' as const
  },
  balanceLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    display: 'block'
  },
  balanceValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold' as const,
    color: '#111827'
  }
};