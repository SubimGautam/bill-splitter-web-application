import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GroupDetailPage from '@/app/groups/[id]/page';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

jest.mock('@/lib/api');
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({ back: jest.fn(), push: jest.fn() })),
}));

const mockGroupDetail = {
  group: { _id: 'g1', name: 'Test Group', members: ['Alice', 'Bob', 'Charlie'] },
  expenses: [
    { _id: 'e1', description: 'Dinner', totalAmount: 90, date: '2025-03-01', payments: [{ name: 'Alice', amount: 90 }] },
  ],
  settlements: [],
  balances: [
    { name: 'Alice', amount: 60 },
    { name: 'Bob', amount: -30 },
    { name: 'Charlie', amount: -30 },
  ],
};

describe('Group Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: 'g1' });
    (api.getGroupWithBalances as jest.Mock).mockResolvedValue(mockGroupDetail);
    (api.createExpense as jest.Mock).mockResolvedValue({});
    (api.createSettlement as jest.Mock).mockResolvedValue({});
  });

  it('renders group details and balances', async () => {
    render(<GroupDetailPage />);
    
    await screen.findByText('Test Group');
    
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    
    // Use getAllByText for elements that appear multiple times
    const amountElements = screen.getAllByText(/Rs 90\.00/);
    expect(amountElements.length).toBeGreaterThan(0);
    
    // Use getAllByText since these names appear multiple times
    const aliceElements = screen.getAllByText('Alice');
    expect(aliceElements.length).toBeGreaterThan(0);
    
    const bobElements = screen.getAllByText('Bob');
    expect(bobElements.length).toBeGreaterThan(0);
    
    const charlieElements = screen.getAllByText('Charlie');
    expect(charlieElements.length).toBeGreaterThan(0);
  });

  it('opens add expense modal', async () => {
    render(<GroupDetailPage />);
    
    await screen.findByText('Add Expense');
    fireEvent.click(screen.getByText('Add Expense'));

    await screen.findByRole('heading', { name: 'Add Expense' });
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Total Amount')).toBeInTheDocument();
  });

  it('opens settle up modal', async () => {
    render(<GroupDetailPage />);
    
    await screen.findByText('Settle Up');
    fireEvent.click(screen.getByText('Settle Up'));

    await screen.findByRole('heading', { name: 'Record Settlement' });
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });
});