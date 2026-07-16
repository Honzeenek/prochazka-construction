'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { validatePoptavka, type PoptavkaErrors } from '@/lib/validatePoptavka';
import styles from './ContactForm.module.css';

const TYPES = ['Zemní práce', 'Stavební práce', 'Pronájem kontejneru', 'Jiné'];

export function ContactForm() {
  const [errors, setErrors] = useState<PoptavkaErrors>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get('name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
      type: String(fd.get('type') ?? TYPES[0]),
      message: String(fd.get('message') ?? ''),
      gdpr: fd.get('gdpr') === 'on',
    };
    const { ok, errors } = validatePoptavka(data);
    setErrors(errors);
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch('/api/poptavka', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) setSent(true);
      else setErrors({ message: 'Něco se nepovedlo. Zkuste to prosím znovu, nebo nám zavolejte.' });
    } catch {
      setErrors({ message: 'Odeslání selhalo. Zavolejte nám prosím na uvedené číslo.' });
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <h3 className={styles.successTitle}>Děkujeme!</h3>
        <p className={styles.successText}>Poptávku máme. Ozveme se vám nejpozději druhý pracovní den.</p>
        <Button variant="secondary" onClick={() => setSent(false)}>Poslat další poptávku</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form}>
      <Input label="Jméno a příjmení" name="name" placeholder="Jan Novák" error={errors.name} />
      <Input label="Telefon" name="phone" placeholder="+420 …" error={errors.phone} />
      <div className={styles.full}><Input label="E-mail (nepovinné)" name="email" type="email" placeholder="vas@email.cz" error={errors.email} /></div>
      <div className={styles.full}><Select label="Typ práce" name="type" options={TYPES} /></div>
      <div className={styles.full}><Textarea label="Popis zakázky" name="message" rows={4} placeholder="Co potřebujete postavit nebo vykopat?" error={errors.message} /></div>
      <div className={styles.full}><Checkbox label={<>Souhlasím se zpracováním <Link href="/ochrana-osobnich-udaju">osobních údajů</Link></>} name="gdpr" />{errors.gdpr && <span className={styles.err}>{errors.gdpr}</span>}</div>
      <div className={styles.full}><Button size="lg" type="submit" disabled={busy} className={styles.submit}>{busy ? 'Odesílám…' : 'Odeslat poptávku'}</Button></div>
    </form>
  );
}
