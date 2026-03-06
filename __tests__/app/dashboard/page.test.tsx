import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';

// Mock dependencies
jest.mock('@/lib/api', () => ({
  api: {
    getGroups: jest.fn().mockResolvedValue([]),
    getRecentExpenses: jest.fn().mockResolvedValue([]),
  }
}));

jest.mock('@/app/providers/AuthProvider', () => ({
  useAuth: jest.fn(() => ({
    user: { username: 'testuser' },
    logout: jest.fn(),
  })),
}));

describe('Dashboard Page', () => {
  it('renders without crashing', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });
});