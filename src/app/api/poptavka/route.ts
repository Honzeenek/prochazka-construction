import { NextResponse } from 'next/server';
import { validatePoptavka, type PoptavkaInput } from '@/lib/validatePoptavka';

export async function POST(req: Request) {
  let data: PoptavkaInput;
  try {
    data = (await req.json()) as PoptavkaInput;
  } catch {
    return NextResponse.json({ ok: false, errors: { message: 'Neplatná data.' } }, { status: 400 });
  }
  const { ok, errors } = validatePoptavka(data);
  if (!ok) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // --- EMAIL INTEGRATION POINT ---------------------------------------------
  // Wire an email provider here (e.g. Resend) when a key is available:
  //   await resend.emails.send({ to: 'info@stavbyprochazka.cz', subject: `Nová poptávka: ${data.type}`, text: ... });
  // For now we log and acknowledge — no keys required.
  console.log('[poptávka]', { name: data.name, phone: data.phone, type: data.type });
  // -------------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
