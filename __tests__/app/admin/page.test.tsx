import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/app/admin/page';
import * as adminActions from '@/lib/actions/admin-actions';

// Mock the module
jest.mock('@/lib/actions/admin-actions', () => ({
  getStats: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'fake-token' })),
  })),
}));

// Mock fetch for API calls inside the dashboard
global.fetch = jest.fn();

const mockedGetStats = adminActions.getStats as jest.Mock;

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Properly mock fetch to return successful responses
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/admin/users')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            data: Array(42).fill({}) 
          })
        });
      }
      if (url.includes('/admin/groups')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            data: Array(10).fill({ _id: 'group1' })
          })
        });
      }
      if (url.includes('/groups/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            data: { 
              expenses: Array(3).fill({}), 
              settlements: Array(2).fill({}) 
            }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      });
    });
  });

  it('renders stats cards with fetched data', async () => {
    const component = await AdminDashboard();
    render(component);

    // Wait for the component to update
    await screen.findByText('42');
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // The other stats might be calculated differently
  });

  // ... other tests
});