import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ContactForm } from '../ContactForm';

// The static form hands off to the visitor's mail client via window.location.href.
const originalLocation = window.location;
let href = '';
beforeEach(() => {
  href = '';
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      set href(v: string) { href = v; },
      get href() { return href; },
    },
  });
});
afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

describe('ContactForm', () => {
  it('shows validation errors on empty submit and does not navigate', async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(screen.getByText('Zadejte prosím jméno.')).toBeInTheDocument();
    expect(href).toBe('');
  });
  it('submits valid data, opens a pre-filled mailto and shows the success state', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText('Jméno a příjmení'), 'Jan Novák');
    await userEvent.type(screen.getByLabelText('Telefon'), '777119179');
    await userEvent.type(screen.getByLabelText('Popis zakázky'), 'Potřebuji výkop základů.');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(await screen.findByText(/Děkujeme/i)).toBeInTheDocument();
    expect(href).toMatch(/^mailto:info@stavbyprochazka\.cz\?subject=/);
  });
});
