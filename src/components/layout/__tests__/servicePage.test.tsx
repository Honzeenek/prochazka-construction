import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServicePage } from '../ServicePage';
import { getService } from '@/content/services';

describe('ServicePage', () => {
  it('renders the service title, intro, and every bullet', () => {
    const s = getService('zemni-prace')!;
    render(<ServicePage service={s} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Zemní práce' })).toBeInTheDocument();
    for (const b of s.bullets) expect(screen.getByText(b)).toBeInTheDocument();
  });
});
