import { DashboardData, StatsCardProps } from '../types/dashboard.type';
import { FaMoneyBillWave, FaUsers, FaReceipt } from 'react-icons/fa';

export const getStatsFromData = (data: DashboardData | null): StatsCardProps[] => {
  if (!data) return [];
  
  return [
    { 
      title: "Owed to you", 
      value: `$${data.summary?.totalOwedToYou?.toFixed(2) || '0.00'}`, 
      subtitle: "Total you are owed", 
      icon: FaMoneyBillWave, 
      color: "#10b981" 
    },
    { 
      title: "You owe", 
      value: `$${data.summary?.totalYouOwe?.toFixed(2) || '0.00'}`, 
      subtitle: "Total you owe", 
      icon: FaMoneyBillWave, 
      color: "#dc2626" 
    },
    { 
      title: "Active Groups", 
      value: data.groups?.length?.toString() || '0', 
      subtitle: "Groups you're in", 
      icon: FaUsers, 
      color: "#3b82f6" 
    },
    { 
      title: "Pending", 
      value: data.summary?.pendingCount?.toString() || '0', 
      subtitle: "Awaiting settlement", 
      icon: FaReceipt, 
      color: "#f59e0b" 
    },
  ];
};