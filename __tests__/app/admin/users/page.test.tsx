import { render, screen } from '@testing-library/react';
import UsersPage from '@/app/admin/users/page';
import * as adminActions from '@/lib/actions/admin-actions';

// Mock the server action
jest.mock('@/lib/actions/admin-actions', () => ({
  getUsers: jest.fn(),
}));

const mockUsers = [
  { _id: '1', username: 'alice', email: 'alice@example.com', role: 'user' },
  { _id: '2', username: 'bob', email: 'bob@example.com', role: 'admin' },
  { _id: '3', username: 'charlie', email: 'charlie@example.com', role: 'user' },
];

describe('Admin Users Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user table with fetched users', async () => {
    (adminActions.getUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    const component = await UsersPage();
    render(component);
    
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('charlie')).toBeInTheDocument();
    expect(screen.getByText('3 Users')).toBeInTheDocument();
  });

  it('shows correct role badges', async () => {
    (adminActions.getUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    const component = await UsersPage();
    render(component);
    
    const userRoles = screen.getAllByText('user');
    const adminRoles = screen.getAllByText('admin');
    
    expect(userRoles).toHaveLength(2);
    expect(adminRoles).toHaveLength(1);
  });

  it('handles empty users list', async () => {
    (adminActions.getUsers as jest.Mock).mockResolvedValue([]);
    
    const component = await UsersPage();
    render(component);
    
    expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  });

  it('displays user emails correctly', async () => {
    (adminActions.getUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    const component = await UsersPage();
    render(component);
    
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
  });
});