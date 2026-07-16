import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Badge } from '../Badge';

describe('Button', () => {
  it('renders a button with default primary variant', () => {
    render(<Button>Odeslat</Button>);
    const b = screen.getByRole('button', { name: 'Odeslat' });
    expect(b).toHaveAttribute('data-variant', 'primary');
    expect(b).toHaveAttribute('data-size', 'md');
  });
  it('renders an anchor when href is set', () => {
    render(<Button href="/kontakt" variant="secondary" size="lg">Kontakt</Button>);
    const a = screen.getByRole('link', { name: 'Kontakt' });
    expect(a).toHaveAttribute('href', '/kontakt');
    expect(a).toHaveAttribute('data-variant', 'secondary');
  });
});

describe('IconButton', () => {
  it('is labelled for accessibility', () => {
    render(<IconButton icon="call" label="Zavolat" />);
    expect(screen.getByRole('button', { name: 'Zavolat' })).toBeInTheDocument();
  });
});

describe('Badge', () => {
  it('renders its text', () => {
    render(<Badge>Zemní práce</Badge>);
    expect(screen.getByText('Zemní práce')).toBeInTheDocument();
  });
});
