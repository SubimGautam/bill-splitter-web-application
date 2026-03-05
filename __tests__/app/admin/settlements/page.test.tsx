import { render, screen } from '@testing-library/react';
import SettlementsPage from '@/app/admin/settlements/page';
import * as adminActions from '@/lib/actions/admin-actions';

jest.mock('@/lib/actions/admin-actions', () => ({
  getAllSettlements: jest.fn(),
}));

const mockedGetAllSettlements = adminActions.getAllSettlements as jest.Mock;

const mockSettlements = [
  { 
    _id: 's1', 
    from: 'Alice', 
    to: 'Bob', 
    amount: 50, 
    date: '2025-03-01', 
    group: { name: 'Paris Trip' } 
  },
  { 
    _id: 's2', 
    from: 'Bob', 
    to: 'Charlie', 
    amount: 30, 
    date: '2025-03-02', 
    group: { name: 'Roommates' } 
  },
  { 
    _id: 's3', 
    from: 'Charlie', 
    to: 'Alice', 
    amount: 20, 
    date: '2025-03-03', 
    group: { name: 'Weekend Getaway' } 
  },
];

describe('Admin Settlements Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAllSettlements.mockResolvedValue(mockSettlements);
  });

  it('renders settlements page with title', async () => {
    const component = await SettlementsPage();
    render(component);
    
    expect(screen.getByText('All Settlements')).toBeInTheDocument();
  });

  it('renders settlements table with correct data', async () => {
    const component = await SettlementsPage();
    render(component);
    
    // Check for amounts
    expect(screen.getByText('Rs 50.00')).toBeInTheDocument();
    expect(screen.getByText('Rs 30.00')).toBeInTheDocument();
    expect(screen.getByText('Rs 20.00')).toBeInTheDocument();
    
    // Check for group names
    expect(screen.getByText('Paris Trip')).toBeInTheDocument();
    expect(screen.getByText('Roommates')).toBeInTheDocument();
    expect(screen.getByText('Weekend Getaway')).toBeInTheDocument();
    
    // Check for names - use getAllByText since each name appears multiple times
    const aliceElements = screen.getAllByText('Alice');
    expect(aliceElements.length).toBeGreaterThan(0);
    
    const bobElements = screen.getAllByText('Bob');
    expect(bobElements.length).toBeGreaterThan(0);
    
    const charlieElements = screen.getAllByText('Charlie');
    expect(charlieElements.length).toBeGreaterThan(0);
  });

  it('displays correct settlement count', async () => {
    const component = await SettlementsPage();
    render(component);
    
    expect(screen.getByText('3 Settlements')).toBeInTheDocument();
  });

  it('calculates and displays grand total correctly', async () => {
    const component = await SettlementsPage();
    render(component);
    
    expect(screen.getByText(/Grand Total: Rs 100.00/i)).toBeInTheDocument();
  });

  it('displays transfer relationships correctly', async () => {
    const component = await SettlementsPage();
    render(component);
    
    // Look for the transfer elements by their structure
    // The transfer is rendered as a div with from → to
    const transferElements = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && 
             (content === 'Alice' || content === 'Bob' || content === 'Charlie');
    });
    expect(transferElements.length).toBeGreaterThan(0);
  });

  it('shows empty state when no settlements', async () => {
    mockedGetAllSettlements.mockResolvedValue([]);
    
    const component = await SettlementsPage();
    render(component);
    
    expect(screen.getByText(/No settlements found/i)).toBeInTheDocument();
  });
});