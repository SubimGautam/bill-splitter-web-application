import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/authentication/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Proper localStorage mock that actually stores values
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

describe('Login Page', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    localStorage.clear();
    document.cookie = '';
    jest.clearAllMocks();
  });

  it('handles successful login', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'fake-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.any(Object)
      );
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
      expect(document.cookie).toContain('token=fake-token');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error on login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: 'Invalid credentials' }),
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});