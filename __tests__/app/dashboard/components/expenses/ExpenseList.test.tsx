import { render, screen } from '@testing-library/react';
import { ExpenseList } from '@/app/dashboard/components/expenses/ExpenseList';

const mockExpenses = [
  { _id: '1', description: 'Dinner', amount: 50, paidBy: 'user1' },
];

describe('ExpenseList', () => {
  it('renders expenses', () => {
    render(
      <ExpenseList 
        expenses={mockExpenses} 
        onExpenseUpdated={jest.fn()} 
        currentUserId="user1" 
      />
    );
    expect(screen.getByText('Dinner')).toBeInTheDocument();
  });
});