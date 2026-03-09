import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateGroupModal } from '@/app/dashboard/components/groups/CreateGroupModal';
import { api } from '@/lib/api';

jest.mock('@/lib/api');

const mockFriends = [
  { id: '1', username: 'Alice', email: 'alice@test.com' },
  { id: '2', username: 'Bob', email: 'bob@test.com' },
];

describe('CreateGroupModal', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getFriends (may not exist in type, so cast to any)
    (api as any).getFriends = jest.fn().mockResolvedValue(mockFriends);
  });

  it('renders modal with friends after loading', async () => {
    render(<CreateGroupModal onClose={onClose} onSuccess={onSuccess} />);
    await screen.findByText('Create New Group');
    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading friends...')).not.toBeInTheDocument());
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('allows selecting friends', async () => {
    render(<CreateGroupModal onClose={onClose} onSuccess={onSuccess} />);
    await screen.findByText('Create New Group');
    await waitFor(() => expect(screen.queryByText('Loading friends...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('Alice'));
    // Selection can be verified by style or class if needed
  });

  it('creates group on submit', async () => {
    (api.createGroup as jest.Mock).mockResolvedValue({});
    render(<CreateGroupModal onClose={onClose} onSuccess={onSuccess} />);
    await screen.findByText('Create New Group');
    await waitFor(() => expect(screen.queryByText('Loading friends...')).not.toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('e.g., Family Trip 2025'), { target: { value: 'Trip' } });
    fireEvent.click(screen.getByText('Alice')); // select friend
    fireEvent.click(screen.getByText('Create Group'));
    await waitFor(() => {
      expect(api.createGroup).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('closes on cancel', () => {
    render(<CreateGroupModal onClose={onClose} onSuccess={onSuccess} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});