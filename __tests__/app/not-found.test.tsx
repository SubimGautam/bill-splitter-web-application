import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('404 Not Found Page', () => {
  it('renders 404 message and link to home', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go Back Home/i })).toHaveAttribute('href', '/');
  });
});