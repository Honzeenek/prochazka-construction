import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactForm } from '../ContactForm';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) })) as unknown as typeof fetch);
});

describe('ContactForm', () => {
  it('shows validation errors on empty submit and does not call fetch', async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(screen.getByText('Zadejte prosím jméno.')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('submits valid data and shows the success state', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText('Jméno a příjmení'), 'Jan Novák');
    await userEvent.type(screen.getByLabelText('Telefon'), '777119179');
    await userEvent.type(screen.getByLabelText('Popis zakázky'), 'Potřebuji výkop základů.');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(await screen.findByText(/Děkujeme/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/poptavka', expect.objectContaining({ method: 'POST' }));
  });
});
