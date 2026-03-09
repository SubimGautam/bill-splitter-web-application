import { getUsers, deleteUser, getGroups, deleteGroup, getAllExpenses, getAllSettlements, getCurrentUser } from '@/lib/actions/admin-actions';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'fake-token' })),
  })),
}));

global.fetch = jest.fn();

describe('Admin Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers fetches users', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ id: 1 }] }),
    });
    const result = await getUsers();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('deleteUser calls DELETE', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    });
    await deleteUser('123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users/123'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('getGroups returns groups', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ name: 'Group' }] }),
    });
    const result = await getGroups();
    expect(result).toEqual([{ name: 'Group' }]);
  });

  it('deleteGroup calls DELETE', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    });
    await deleteGroup('g1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/groups/g1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('getAllExpenses returns expenses', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ amount: 100 }] }),
    });
    const result = await getAllExpenses();
    expect(result).toEqual([{ amount: 100 }]);
  });

  it('getAllSettlements returns settlements', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ amount: 50 }] }),
    });
    const result = await getAllSettlements();
    expect(result).toEqual([{ amount: 50 }]);
  });

  it('getCurrentUser returns user', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { username: 'admin' } }),
    });
    const result = await getCurrentUser();
    expect(result).toEqual({ username: 'admin' });
  });

  it('throws on failed request', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error' }),
    });
    await expect(getUsers()).rejects.toThrow('Error');
  });
});