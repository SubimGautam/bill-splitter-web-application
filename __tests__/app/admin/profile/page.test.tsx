import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/admin/profile/page';
import * as adminActions from '@/lib/actions/admin-actions';

jest.mock('@/lib/actions/admin-actions', () => ({
  getCurrentUser: jest.fn(),
}));

const mockedGetCurrentUser = adminActions.getCurrentUser as jest.Mock;

const mockUser = {
  id: 'admin1',
  username: 'adminuser',
  email: 'admin@splito.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
};

describe('Admin Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetCurrentUser.mockResolvedValue(mockUser);
  });

  it('renders profile information', async () => {
    const component = await ProfilePage();
    render(component);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('adminuser')).toBeInTheDocument();
    
    // Use getAllByText when there are multiple elements with same text
    const emailElements = screen.getAllByText('admin@splito.com');
    expect(emailElements.length).toBeGreaterThan(0);
  });

  it('displays user role badge', async () => {
    const component = await ProfilePage();
    render(component);
    
    // Use getAllByText since "admin" appears multiple times
    const adminElements = screen.getAllByText('admin');
    expect(adminElements.length).toBeGreaterThan(0);
  });

  it('displays user initials in avatar', async () => {
    const component = await ProfilePage();
    render(component);
    
    // Use getAllByText since "A" might appear multiple times
    const initialElements = screen.getAllByText('A');
    expect(initialElements.length).toBeGreaterThan(0);
  });

  it('renders edit profile form', async () => {
    const component = await ProfilePage();
    render(component);
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('shows admin account badge', async () => {
    const component = await ProfilePage();
    render(component);
    
    expect(screen.getByText('Admin Account')).toBeInTheDocument();
  });
});