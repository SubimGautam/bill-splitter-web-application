import { render, screen, fireEvent } from '@testing-library/react';
import GroupsTable from '@/app/admin/_components/GroupsTable';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({ useRouter: jest.fn(() => ({ refresh: jest.fn() })) }));

const mockGroups = [
  { _id: 'g1', name: 'Trip', members: ['a', 'b'], createdAt: '2025-01-01' },
  { _id: 'g2', name: 'House', members: ['a', 'c', 'd'], createdAt: '2025-02-01' },
];

describe('GroupsTable', () => {
  it('renders groups', () => {
    render(<GroupsTable groups={mockGroups} />);
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.getByText('House')).toBeInTheDocument();
  });

  it('displays member count', () => {
    render(<GroupsTable groups={mockGroups} />);
    expect(screen.getByText('2 members')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
  });

  it('filters groups by search', () => {
    render(<GroupsTable groups={mockGroups} />);
    fireEvent.change(screen.getByPlaceholderText('Search groups...'), { target: { value: 'Trip' } });
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.queryByText('House')).not.toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<GroupsTable groups={[]} />);
    expect(screen.getByText(/No groups found/i)).toBeInTheDocument();
  });
});