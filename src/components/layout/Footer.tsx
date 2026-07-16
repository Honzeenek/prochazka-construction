import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { site, nav } from '@/content/site';
import { legalPages } from '@/content/legal';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Wordmark onInk />
          <p className={styles.blurb}>Jsme tým, který dělá svou práci srdcem. {site.values}</p>
        </div>
        <div>
          <div className={styles.head}>Rychlé odkazy</div>
          <div className={styles.col}>
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.head}>Kontakt</div>
          <div className={styles.col}>
            <a href={site.phoneHref} className={styles.link}>
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className={styles.link}>
              {site.email}
            </a>
            <span className={styles.muted}>{site.region}</span>
          </div>
        </div>
      </div>
      <div className={styles.baseline}>
        <div className={`container ${styles.baselineInner}`}>
          <span>© {site.foundedYear ? new Date().getFullYear() : ''} Procházka — stavební a zemní práce</span>
          <div className={styles.legal}>
            {legalPages.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className={styles.legalLink}>
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
