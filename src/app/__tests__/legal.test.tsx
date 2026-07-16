import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CookiesPage from '../zasady-cookies/page';
import PrivacyPage from '../ochrana-osobnich-udaju/page';

describe('legal pages', () => {
  it('renders cookie policy heading', () => {
    render(<CookiesPage />);
    expect(screen.getByRole('heading', { level: 1, name: /cookies/i })).toBeInTheDocument();
  });
  it('renders privacy heading', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { level: 1, name: /osobních údajů/i })).toBeInTheDocument();
  });
});
