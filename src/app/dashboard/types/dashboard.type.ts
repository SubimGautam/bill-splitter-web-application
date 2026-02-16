import { IconType } from 'react-icons';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Group {
  id: string;
  name: string;
  members: number;
  totalBalance: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  groupName: string;
  groupId?: string;
  youPaid?: boolean;
  youOwe?: number;
}

export interface Balance {
  userId: string;
  name: string;
  amount: number;
}

export interface DashboardData {
  user: User;
  groups: Group[];
  recentExpenses: Expense[];
  balances: Balance[];
  summary: {
    totalOwedToYou: number;
    totalYouOwe: number;
    pendingCount: number;
  };
}

export interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: IconType;
  color: string;
}