import { render, screen } from '@testing-library/react';
import { ExpenseForm } from '@/app/dashboard/components/expenses/ExpenseForm';

const mockMembers = [
  { _id: '1', username: 'Alice' },
  { _id: '2', username: 'Bob' },
];
const mockGroupId = 'group1';
const mockUserId = '1';
const onClose = jest.fn();
const onSuccess = jest.fn();

describe('ExpenseForm', () => {
  it('renders form without crashing', () => {
    render(
      <ExpenseForm
        groupId={mockGroupId}
        members={mockMembers}
        currentUserId={mockUserId}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Expense')).toBeInTheDocument();
  });
});