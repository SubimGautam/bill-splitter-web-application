import { renderHook } from '@testing-library/react';
import { useDashboard } from '@/app/dashboard/hooks/useDashboard';

// Mock the dependencies
jest.mock('@/lib/api', () => ({
  api: {
    getMe: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    getDashboard: jest.fn().mockResolvedValue({
      groups: [],
      recentExpenses: [],
      balances: [],
      summary: { totalOwedToYou: 0, totalYouOwe: 0, pendingCount: 0 },
    }),
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('useDashboard', () => {
  it('should return a hook object', () => {
    const { result } = renderHook(() => useDashboard());
    expect(result.current).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });
});
