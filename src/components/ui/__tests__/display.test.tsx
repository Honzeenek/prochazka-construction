import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServiceCard } from '../ServiceCard';
import { SectionHeader } from '../SectionHeader';
import { Stat } from '../Stat';

describe('ServiceCard', () => {
  it('renders title and body, links when href set', () => {
    render(<ServiceCard icon="construction" title="Stavební práce" href="/stavebni-prace">Hrubé stavby.</ServiceCard>);
    expect(screen.getByText('Stavební práce')).toBeInTheDocument();
    expect(screen.getByText('Hrubé stavby.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/stavebni-prace');
  });
});

describe('SectionHeader', () => {
  it('renders overline and heading', () => {
    render(<SectionHeader overline="Naše služby" title="Co pro vás uděláme" />);
    expect(screen.getByText('Naše služby')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Co pro vás uděláme' })).toBeInTheDocument();
  });
});

describe('Stat', () => {
  it('renders value and label', () => {
    render(<Stat value="1 800+" label="realizací" />);
    expect(screen.getByText('1 800+')).toBeInTheDocument();
    expect(screen.getByText('realizací')).toBeInTheDocument();
  });
});
