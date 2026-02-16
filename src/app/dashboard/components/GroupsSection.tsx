// src/app/dashboard/components/GroupsSection.tsx
"use client";

import React, { useState } from 'react';
import { FaUsers, FaPlus } from 'react-icons/fa';
import { Group } from '../types/dashboard.type';
import { api } from '@/lib/api';

interface GroupsSectionProps {
  groups: Group[];
  activeGroup: string;
  onGroupSelect: (groupName: string) => void;
  onGroupCreated: () => void; // This will refresh the groups list
}

export const GroupsSection = ({ groups, activeGroup, onGroupSelect, onGroupCreated }: GroupsSectionProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setError('Group name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await api.createGroup({ name: newGroupName.trim() });
      setNewGroupName('');
      setShowCreateModal(false);
      onGroupCreated(); // Refresh the groups list
    } catch (err: any) {
      console.error('Failed to create group:', err);
      setError(err.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const groupColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <>
      <div style={{
        backgroundColor: "white",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem" 
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Your Groups</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
          >
            <FaPlus /> New Group
          </button>
        </div>

        {groups.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem"
          }} className="groups-grid">
            {groups.map((group, idx) => {
              const color = groupColors[idx % groupColors.length];
              return (
                <div
                  key={group.id}
                  style={{
                    border: activeGroup === group.name ? `2px solid ${color}` : "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    cursor: "pointer",
                    backgroundColor: activeGroup === group.name ? `${color}10` : "white",
                    transition: "all 0.2s"
                  }}
                  onClick={() => onGroupSelect(group.name)}
                  onMouseOver={(e) => {
                    if (activeGroup !== group.name) {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      e.currentTarget.style.borderColor = `${color}80`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeGroup !== group.name) {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: color,
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FaUsers style={{ color: "white" }} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 600, color: "#111827" }}>{group.name}</h3>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{group.members} members</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827" }}>
                      ${group.totalBalance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "#6b7280" }}>Last activity: Today</span>
                    <span style={{ color: "#10b981", fontWeight: 500 }}>View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
            <p>You're not part of any groups yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer"
              }}
            >
              Create your first group
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
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
          zIndex: 1000,
        }}
        onClick={() => setShowCreateModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Create New Group
            </h3>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#dc2626',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
              disabled={isCreating}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={isCreating}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  opacity: isCreating ? 0.6 : 1,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};