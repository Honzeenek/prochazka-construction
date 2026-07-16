import { describe, it, expect } from 'vitest';
import { validatePoptavka } from '../validatePoptavka';

const base = { name: 'Jan Novák', phone: '777119179', email: '', type: 'Zemní práce', message: 'Potřebuji výkop.', gdpr: true };

describe('validatePoptavka', () => {
  it('accepts a valid submission (email optional)', () => {
    expect(validatePoptavka(base).ok).toBe(true);
  });
  it('requires name, phone, message and gdpr consent', () => {
    const r = validatePoptavka({ ...base, name: '', phone: '', message: '', gdpr: false });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.phone).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
    expect(r.errors.gdpr).toBeTruthy();
  });
  it('rejects a malformed email when provided', () => {
    const r = validatePoptavka({ ...base, email: 'not-an-email' });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });
});
