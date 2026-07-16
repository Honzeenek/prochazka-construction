'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { validatePoptavka, type PoptavkaErrors } from '@/lib/validatePoptavka';
import { site } from '@/content/site';
import styles from './ContactForm.module.css';

const TYPES = ['Zemní práce', 'Stavební práce', 'Pronájem kontejneru', 'Jiné'];

export function ContactForm() {
  const [errors, setErrors] = useState<PoptavkaErrors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    // Static site (no backend): hand the poptávka to the visitor's mail client,
    // pre-filled and addressed to the company. tel:/mailto: remain the fallback.
    const subject = `Nezávazná poptávka: ${data.type}`;
    const body = [
      `Jméno: ${data.name}`,
      `Telefon: ${data.phone}`,
      data.email ? `E-mail: ${data.email}` : null,
      `Typ práce: ${data.type}`,
      '',
      data.message,
    ].filter((line) => line !== null).join('\n');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <h3 className={styles.successTitle}>Děkujeme!</h3>
        <p className={styles.successText}>Otevřeli jsme vám e-mail s poptávkou — stačí ho odeslat. Ozveme se vám nejpozději druhý pracovní den.</p>
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
      <div className={styles.full}><Button size="lg" type="submit" className={styles.submit}>Odeslat poptávku</Button></div>
    </form>
  );
}
