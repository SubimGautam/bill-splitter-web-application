import { render, screen } from '@testing-library/react';
import GroupsPage from '@/app/admin/groups/page';
import * as adminActions from '@/lib/actions/admin-actions';

// Mock the server action
jest.mock('@/lib/actions/admin-actions', () => ({
  getGroups: jest.fn(),
}));

const mockedGetGroups = adminActions.getGroups as jest.Mock;

const mockGroups = [
  { 
    _id: 'g1', 
    name: 'Trip to Paris', 
    members: ['user1', 'user2'], 
    createdAt: '2025-01-01T00:00:00Z' 
  },
  { 
    _id: 'g2', 
    name: 'Roommates', 
    members: ['user1', 'user3', 'user4'], 
    createdAt: '2025-02-01T00:00:00Z' 
  },
  { 
    _id: 'g3', 
    name: 'Weekend Getaway', 
    members: ['user2', 'user5'], 
    createdAt: '2025-03-01T00:00:00Z' 
  },
];

describe('Admin Groups Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetGroups.mockResolvedValue(mockGroups);
  });

  it('renders groups page with title', async () => {
    const component = await GroupsPage();
    render(component);
    
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('renders groups table with correct data', async () => {
    const component = await GroupsPage();
    render(component);
    
    expect(screen.getByText('Trip to Paris')).toBeInTheDocument();
    expect(screen.getByText('Roommates')).toBeInTheDocument();
    expect(screen.getByText('Weekend Getaway')).toBeInTheDocument();
    expect(screen.getByText('3 Groups')).toBeInTheDocument();
  });

  it('displays correct member counts', async () => {
    const component = await GroupsPage();
    render(component);
    
    // Use getAllByText since there are multiple groups with "2 members"
    const twoMemberElements = screen.getAllByText('2 members');
    expect(twoMemberElements).toHaveLength(2); // Two groups have 2 members
    
    // For "3 members", there's only one
    expect(screen.getByText('3 members')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    mockedGetGroups.mockRejectedValue(new Error('Failed to load'));
    
    const component = await GroupsPage();
    render(component);
    
    expect(screen.getByText(/Failed to load groups/i)).toBeInTheDocument();
  });

  it('handles empty groups list', async () => {
    mockedGetGroups.mockResolvedValue([]);
    
    const component = await GroupsPage();
    render(component);
    
    expect(screen.getByText(/No groups found/i)).toBeInTheDocument();
  });
});