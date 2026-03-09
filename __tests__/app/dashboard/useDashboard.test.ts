// __tests__/app/dashboard/hooks/useDashboard.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDashboard } from '@/app/dashboard/hooks/useDashboard';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/api');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

// Define types (or import from your app)
interface User { id: string; username: string; }
interface Group { id: string; name: string; }
interface Expense { id: string; description: string; amount: number; }
interface Balance { name: string; amount: number; }

const mockUser: User = { id: '1', username: 'test' };
const mockGroups: Group[] = [{ id: 'g1', name: 'Group' }];
const mockExpenses: Expense[] = []; // or some mock expenses
const mockBalances: Balance[] = [];

describe('useDashboard', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (api.getMe as jest.Mock).mockResolvedValue(mockUser);
    (api.getDashboard as jest.Mock).mockResolvedValue({
      groups: mockGroups,
      recentExpenses: mockExpenses,
      balances: mockBalances,
      summary: { totalOwedToYou: 0, totalYouOwe: 0, pendingCount: 0 },
    });
  });

  it('returns loading initially', () => {
    const { result } = renderHook(() => useDashboard());
    expect(result.current.loading).toBe(true);
  });

  it('fetches data and sets state', async () => {
    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeTruthy();
    expect(result.current.data?.user).toEqual(mockUser);
  });

  it('handles error and logs out on 401', async () => {
    (api.getMe as jest.Mock).mockRejectedValue(new Error('401'));
    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Session expired. Please log in again.');
    expect(mockPush).toHaveBeenCalledWith('/authentication/login');
  });

  it('sets active group', async () => {
    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setActiveGroup('Group');
    });
    expect(result.current.activeGroup).toBe('Group');
  });
});