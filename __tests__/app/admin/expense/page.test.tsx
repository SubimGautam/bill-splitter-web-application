import { render, screen } from '@testing-library/react';
import ExpensesPage from '@/app/admin/expenses/page';
import * as adminActions from '@/lib/actions/admin-actions';

// Mock the server action
jest.mock('@/lib/actions/admin-actions', () => ({
  getAllExpenses: jest.fn(),
}));

const mockExpenses = [
  { 
    _id: 'e1', 
    description: 'Dinner', 
    totalAmount: 120, 
    date: '2025-03-01', 
    group: { name: 'Paris Trip' }, 
    payments: [{ name: 'Alice' }] 
  },
  { 
    _id: 'e2', 
    description: 'Groceries', 
    amount: 85, 
    date: '2025-03-02', 
    group: { name: 'Roommates' }, 
    paidBy: 'Bob' 
  },
  { 
    _id: 'e3', 
    description: 'Movie Tickets', 
    totalAmount: 45, 
    date: '2025-03-03', 
    group: { name: 'Weekend Getaway' }, 
    payments: [{ name: 'Charlie' }] 
  },
];

describe('Admin Expenses Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders expenses table with correct data', async () => {
    (adminActions.getAllExpenses as jest.Mock).mockResolvedValue(mockExpenses);
    
    const component = await ExpensesPage();
    render(component);
    
    expect(screen.getByText('All Expenses')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Movie Tickets')).toBeInTheDocument();
    expect(screen.getByText('Paris Trip')).toBeInTheDocument();
    expect(screen.getByText('Roommates')).toBeInTheDocument();
    expect(screen.getByText('Weekend Getaway')).toBeInTheDocument();
    expect(screen.getByText('3 Expenses')).toBeInTheDocument();
  });

  it('calculates and displays grand total correctly', async () => {
    (adminActions.getAllExpenses as jest.Mock).mockResolvedValue(mockExpenses);
    
    const component = await ExpensesPage();
    render(component);
    
    // Total should be 120 + 85 + 45 = 250
    expect(screen.getByText(/Grand Total: Rs 250.00/i)).toBeInTheDocument();
  });

  it('shows empty state when no expenses', async () => {
    (adminActions.getAllExpenses as jest.Mock).mockResolvedValue([]);
    
    const component = await ExpensesPage();
    render(component);
    
    expect(screen.getByText(/No expenses found/i)).toBeInTheDocument();
  });

  it('formats dates correctly', async () => {
    (adminActions.getAllExpenses as jest.Mock).mockResolvedValue(mockExpenses);
    
    const component = await ExpensesPage();
    render(component);
    
    // Check for formatted dates (Mar 1, 2025 etc.)
    expect(screen.getByText(/Mar 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 2, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar 3, 2025/i)).toBeInTheDocument();
  });
});