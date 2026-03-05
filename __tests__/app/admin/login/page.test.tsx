import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '@/app/(auth)/admin/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage properly
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.Mock;

describe('Admin Login Page', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    localStorage.clear();
    document.cookie = '';
  });

  it('successful admin login redirects to /admin', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          token: 'admin-token',
          user: { 
            id: '2', 
            username: 'admin', 
            email: 'admin@example.com', 
            role: 'admin' 
          },
        },
      }),
    });

    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/Admin Email/i), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/Security Token/i), { 
      target: { value: 'adminpass' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Authorize Access/i }));

    await waitFor(() => {
      // Check that localStorage.setItem was called with the right values
      expect(localStorage.getItem('user')).toContain('admin');
      expect(document.cookie).toContain('token=admin-token');
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  // ... other tests
});