// src/app/dashboard/hooks/useDashboard.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardData } from '../types/dashboard.type';
import { api, clearToken } from '@/lib/api';

export const useDashboard = () => {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('');
  const [activeGroupId, setActiveGroupId] = useState<string>('');

  const logout = useCallback(() => {
    clearToken();
    router.push('/authentication/login');
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [user, dashboardData] = await Promise.all([
        api.getMe(),
        api.getDashboard(),
      ]);

      const fullData: DashboardData = {
        user,
        groups: dashboardData.groups || [],
        recentExpenses: dashboardData.recentExpenses || [],
        balances: dashboardData.balances || [],
        summary: dashboardData.summary || {
          totalOwedToYou: 0,
          totalYouOwe: 0,
          pendingCount: 0,
        },
      };

      setData(fullData);

      if (fullData.groups?.length > 0) {
        setActiveGroup(fullData.groups[0].name);
        setActiveGroupId(fullData.groups[0].id);
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);

      if (err.message === 'TOKEN_EXPIRED' || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
        logout();
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const handleSetActiveGroup = useCallback((groupName: string) => {
    setActiveGroup(groupName);
    if (data?.groups) {
      const selectedGroup = data.groups.find(g => g.name === groupName);
      if (selectedGroup) {
        setActiveGroupId(selectedGroup.id);
      }
    }
  }, [data?.groups]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    activeGroup,
    activeGroupId,
    setActiveGroup: handleSetActiveGroup,
    logout,
    refetch: fetchData,
  };
};