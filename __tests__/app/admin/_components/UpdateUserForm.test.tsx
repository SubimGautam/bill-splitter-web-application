import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateUserForm from '@/app/admin/_components/UpdateUserForm';
import { updateProfile } from '@/lib/actions/admin-actions';

jest.mock('@/lib/actions/admin-actions', () => ({ updateProfile: jest.fn() }));

const mockUser = { username: 'admin', email: 'admin@test.com', firstName: '', lastName: '' };

describe('UpdateUserForm', () => {
  beforeEach(() => {
    (updateProfile as jest.Mock).mockResolvedValue({});
  });

  it('renders form with user data', () => {
    render(<UpdateUserForm user={mockUser} />);
    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@test.com')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<UpdateUserForm user={mockUser} />);
    const username = screen.getByLabelText(/Username/i);
    fireEvent.change(username, { target: { value: 'newadmin' } });
    expect(username).toHaveValue('newadmin');
  });

  it('submits form with correct data', async () => {
    render(<UpdateUserForm user={mockUser} />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newadmin' } });
    fireEvent.click(screen.getByText('Save Changes'));
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();
    });
  });

  it('displays validation errors', async () => {
    render(<UpdateUserForm user={mockUser} />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'ab' } }); // too short
    fireEvent.click(screen.getByText('Save Changes'));
    await waitFor(() => {
      expect(screen.getByText(/Minimum 3 characters/i)).toBeInTheDocument();
    });
  });
});