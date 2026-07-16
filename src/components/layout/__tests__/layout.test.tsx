import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Nav } from '../Nav';
import { Footer } from '../Footer';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('Nav', () => {
  it('renders the primary links and phone', () => {
    render(<Nav />);
    expect(screen.getAllByRole('link', { name: 'Úvod' }).length).toBeGreaterThan(0);
    expect(screen.getByText('+420 777 119 179')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('shows contact email', () => {
    render(<Footer />);
    expect(screen.getByText('info@stavbyprochazka.cz')).toBeInTheDocument();
  });
});
