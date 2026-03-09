import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/app/providers/AuthProvider';

// Test component that uses the hook
const TestComponent = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.username : 'no user'}</div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
  });

  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toBeInTheDocument();
  });

  it('logout button exists', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});