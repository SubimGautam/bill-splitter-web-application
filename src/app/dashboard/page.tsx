// src/app/dashboard/page.tsx
"use client";

import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import { getStatsFromData } from './utils/dashboard.utils';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Navigation } from './components/Navigation';
import { StatsGrid } from './components/StatsGrid';
import { GroupsSection } from './components/GroupsSection';
import { ExpensesSection } from './components/ExpenseSection';
import { BalancesSection } from './components/BalancesSection';
import { UserInfoCard } from './components/UserInfoCard';

export default function DashboardPage() {
  const { 
    data, 
    loading, 
    error, 
    activeGroup, 
    activeGroupId,
    setActiveGroup, 
    logout,
    refetch 
  } = useDashboard();

  if (loading) return <LoadingSpinner />;
  
  if (error) return <ErrorDisplay error={error} onRetry={refetch} onLogout={logout} />;
  
  if (!data) return null;

  const stats = getStatsFromData(data);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "1rem" }}>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .content-grid { grid-template-columns: 2fr 1fr !important; }
          .groups-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Navigation username={data.user.username} onLogout={logout} />
        
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            Welcome back, {data.user.username}! 👋
          </h1>
          <p style={{ color: "#6b7280" }}>
            Here's your expense overview for today
          </p>
        </div>

        <StatsGrid stats={stats} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="content-grid">
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <GroupsSection 
              groups={data.groups} 
              activeGroup={activeGroup} 
              onGroupSelect={setActiveGroup}
              onGroupCreated={refetch}
            />
            <ExpensesSection 
              expenses={data.recentExpenses} 
              onExpenseAdded={refetch}
              groupId={activeGroupId} 
              userId={data.user.id}  
            />
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <BalancesSection 
              balances={data.balances} 
              currentUserId={data.user.id}
              groupId={activeGroupId}
              onSettleUp={refetch} 
            />
            <UserInfoCard user={data.user} onLogout={logout} />
          </div>
        </div>
      </div>
    </div>
  );
}