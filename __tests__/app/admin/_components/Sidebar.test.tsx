import { render, screen } from '@testing-library/react';
import Sidebar from '@/app/admin/_components/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/admin'),
}));

describe('Sidebar', () => {
  it('renders navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});