'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Wordmark } from './Wordmark';
import { site, nav } from '@/content/site';
import styles from './Nav.module.css';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Procházka — domů">
          <Wordmark />
        </Link>
        <nav className={styles.links} aria-label="Hlavní navigace">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.link}
              data-active={pathname === l.href ? 'true' : undefined}
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.cta}>
          <a href={site.phoneHref} className={styles.phone}>
            {site.phone}
          </a>
          <Button href="/kontakt">Nezávazná poptávka</Button>
        </div>
        <button
          className={styles.burger}
          aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      {open && (
        <div className={styles.panel}>
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.panelLink}
              data-active={pathname === l.href ? 'true' : undefined}
              aria-current={pathname === l.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a href={site.phoneHref} className={styles.panelPhone}>
            {site.phone}
          </a>
        </div>
      )}
    </header>
  );
}
