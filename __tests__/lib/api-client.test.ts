import { api, setToken, getToken, removeToken } from '@/lib/api-client';

// Proper localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  it('sets and gets token', () => {
    setToken('abc123');
    expect(getToken()).toBe('abc123');
    expect(localStorage.getItem('token')).toBe('abc123');
  });

  it('removes token', () => {
    setToken('abc123');
    removeToken();
    expect(getToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('login calls fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { token: 't', user: {} } }),
    });
    await api.login('test@test.com', 'pass');
    expect(fetch).toHaveBeenCalled();
  });
});