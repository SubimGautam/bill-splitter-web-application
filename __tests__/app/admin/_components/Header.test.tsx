import { render, screen } from '@testing-library/react';
import Header from '@/app/admin/_components/Header';

jest.mock('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({ user: { username: 'admin' }, logout: jest.fn() })
}));

describe('Header', () => {
  it('renders user name', () => {
    render(<Header />);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });
});