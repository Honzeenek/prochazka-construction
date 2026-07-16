export type PoptavkaInput = { name: string; phone: string; email?: string; type: string; message: string; gdpr: boolean };
export type PoptavkaErrors = Partial<Record<keyof PoptavkaInput, string>>;

export function validatePoptavka(data: PoptavkaInput): { ok: boolean; errors: PoptavkaErrors } {
  const errors: PoptavkaErrors = {};
  if (!data.name?.trim()) errors.name = 'Zadejte prosím jméno.';
  if (!data.phone?.trim()) errors.phone = 'Zadejte prosím telefon.';
  if (!data.message?.trim()) errors.message = 'Napište prosím, co potřebujete.';
  if (!data.gdpr) errors.gdpr = 'Bez souhlasu vás bohužel nemůžeme kontaktovat.';
  if (data.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'E-mail nemá správný tvar.';
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
