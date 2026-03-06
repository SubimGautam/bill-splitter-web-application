import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home Page', () => {
  it('renders hero section and navigation', () => {
    render(<HomePage />);
    expect(screen.getByText('Split expenses.')).toBeInTheDocument();
    expect(screen.getByText('Not friendships.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start for free/i })).toBeInTheDocument();
    
    // Multiple login links – use getAllByRole
    const loginLinks = screen.getAllByRole('link', { name: /Log in/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    
    // Multiple admin links – use getAllByRole
    const adminLinks = screen.getAllByRole('link', { name: /Admin/i });
    expect(adminLinks.length).toBeGreaterThan(0);
  });

  it('renders features section', () => {
    render(<HomePage />);
    expect(screen.getByText('Lightning fast splits')).toBeInTheDocument();
    expect(screen.getByText('Multi-currency support')).toBeInTheDocument();
    expect(screen.getByText('Smart reports')).toBeInTheDocument();
    expect(screen.getByText('Smart reminders')).toBeInTheDocument();
    expect(screen.getByText('Bank-level security')).toBeInTheDocument();
    expect(screen.getByText('Works everywhere')).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    render(<HomePage />);
    expect(screen.getByText('HOW IT WORKS')).toBeInTheDocument();
    expect(screen.getByText('Create a group')).toBeInTheDocument();
    expect(screen.getByText('Add expenses')).toBeInTheDocument();
    expect(screen.getByText('Settle up')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(<HomePage />);
    expect(screen.getByText('WHAT PEOPLE SAY')).toBeInTheDocument();
    expect(screen.getByText(/Finally an app that makes splitting costs stress-free/i)).toBeInTheDocument();
    expect(screen.getByText(/We use Splito for our 4-person apartment/i)).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<HomePage />);
    expect(screen.getByText(/Making shared expenses painless since 2024/i)).toBeInTheDocument();
    const privacyLinks = screen.getAllByText('Privacy');
    expect(privacyLinks.length).toBeGreaterThan(0);
    const termsLinks = screen.getAllByText('Terms');
    expect(termsLinks.length).toBeGreaterThan(0);
  });
});