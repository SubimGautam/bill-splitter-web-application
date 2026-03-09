import { render, screen } from '@testing-library/react';
import UserTable from '@/app/admin/_components/UserTable';

const mockUsers = [
  { _id: '1', username: 'alice', email: 'alice@test.com', role: 'user' },
  { _id: '2', username: 'bob', email: 'bob@test.com', role: 'admin' },
];

describe('UserTable', () => {
  it('renders users', () => {
    render(<UserTable users={mockUsers} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});