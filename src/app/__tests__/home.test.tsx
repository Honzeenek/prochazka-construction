import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('Home', () => {
  it('renders the real hero headline and the three services', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: /Stavíme pořádně/i })).toBeInTheDocument();
    expect(screen.getByText('Zemní práce')).toBeInTheDocument();
    expect(screen.getByText('Stavební práce')).toBeInTheDocument();
    expect(screen.getByText('Pronájem kontejneru')).toBeInTheDocument();
  });
  it('shows the real stats', () => {
    render(<Home />);
    expect(screen.getByText('1 800+')).toBeInTheDocument();
    expect(screen.getByText(/1988/)).toBeInTheDocument();
  });
});
