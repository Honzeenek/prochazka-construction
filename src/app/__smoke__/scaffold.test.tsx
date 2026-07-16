import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../page';

describe('scaffold', () => {
  it('renders the home placeholder', () => {
    render(<Home />);
    expect(screen.getByText('Procházka')).toBeInTheDocument();
  });
});
