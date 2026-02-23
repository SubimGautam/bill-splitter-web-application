export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];       
  totalBalance?: number;     
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;            
  date: string;              
  groupId: string;
  groupName?: string;
}

export interface Balance {
  name: string;              
  amount: number;          
}

export interface DashboardData {
  user: User;
  groups: Group[];
  recentExpenses: Expense[];
  balances: Balance[];       // overall balances across all groups
  summary: {
    totalOwedToYou: number;
    totalYouOwe: number;
  };
}