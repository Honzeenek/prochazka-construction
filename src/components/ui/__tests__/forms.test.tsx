import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Field';
import { Textarea } from '../Textarea';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';

describe('form fields', () => {
  it('Input associates its label and shows error', () => {
    render(<Input label="Telefon" name="phone" error="Zadejte telefon" />);
    expect(screen.getByLabelText('Telefon')).toBeInTheDocument();
    expect(screen.getByText('Zadejte telefon')).toBeInTheDocument();
  });
  it('Textarea renders with rows', () => {
    render(<Textarea label="Zpráva" name="msg" rows={5} />);
    expect(screen.getByLabelText('Zpráva')).toHaveAttribute('rows', '5');
  });
  it('Select renders its options', () => {
    render(<Select label="Typ" name="type" options={['Zemní práce', 'Stavební práce']} />);
    expect(screen.getByRole('option', { name: 'Zemní práce' })).toBeInTheDocument();
  });
  it('Checkbox renders a labelled checkbox', () => {
    render(<Checkbox label="Souhlasím" name="gdpr" />);
    expect(screen.getByRole('checkbox', { name: 'Souhlasím' })).toBeInTheDocument();
  });
});
