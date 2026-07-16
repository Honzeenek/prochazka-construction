import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Stat } from '@/components/ui/Stat';
import { Photo } from '@/components/layout/Photo';
import { site } from '@/content/site';
import { services } from '@/content/services';
import styles from './home.module.css';

function HeroBadge() {
  return (
    <div className={styles.badge} aria-hidden>
      <svg viewBox="0 0 120 120" className={styles.badgeSpin}>
        <defs>
          <path id="heroBadgeCircle" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
        </defs>
        <text className={styles.badgeText}>
          <textPath href="#heroBadgeCircle" startOffset="0">
            STAVÍME SE SRDCEM · STAVBY PROCHÁZKA ·&nbsp;
          </textPath>
        </text>
      </svg>
      <svg className={styles.badgeArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 L17 7 M9 7 h8 v8" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className={`container ${styles.heroWrap}`}>
        <div className={styles.hero}>
          <div className={styles.heroPhoto}>
            <Photo src="stavebni-hero.jpg" alt="Tým Procházka při stavebních pracích" priority rounded={false} sizes="(max-width: 1240px) 100vw, 1200px" />
          </div>
          <div className={styles.heroScrim} />
          <HeroBadge />
          <div className={styles.heroInner}>
            <div className={styles.heroOverline}><span className={styles.heroMarker} />{site.tagline}</div>
            <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
            <p className={styles.heroLead}>{site.heroLead}</p>
            <div className={styles.heroActions}>
              <Button href="/kontakt" size="lg">Nezávazná poptávka</Button>
              <Link href="/stavebni-prace" className={styles.heroGhost}>Naše služby</Link>
            </div>
          </div>
        </div>
        <div className={styles.heroCard}>
          <span className={styles.heroMarker} />
          <p className={styles.heroCardText}>„Kvalita, férovost a lidský přístup nejsou bonus, ale samozřejmost.“</p>
        </div>
      </section>

      <section className={`container ${styles.how}`}>
        <SectionHeader overline="Jak pracujeme" title={<>Dělat věci pořádně.<br />Od začátku.</>} />
        <p className={styles.howBody}>
          Od prvního telefonátu po předání hotové práce jednáme na rovinu. Řekneme vám, co je potřeba, kolik to bude stát a kdy to bude hotové. {site.values}
        </p>
      </section>

      <section className={`container ${styles.services}`}>
        <div className={styles.serviceGrid}>
          {services.map((s) => (
            <ServiceCard key={s.slug} icon={s.icon} title={s.title} href={`/${s.slug}`}>{s.tagline}</ServiceCard>
          ))}
        </div>
        <div className={styles.servicesCta}><Button href="/kontakt" variant="ghost">Nezávazná poptávka</Button></div>
      </section>

      <section className={`container ${styles.statsWrap}`}>
        <div className={styles.statsBand}>
          <div className={styles.statsLead}>
            <h2 className={styles.statsTitle}>Rádi se k nám vracíte</h2>
            <p className={styles.statsText}>Většina zakázek k nám přichází na doporučení. To je pro nás největší pochvala.</p>
          </div>
          <div className={styles.statsFigures}>
            <Stat onInk value={`od ${site.foundedYear}`} label="rok založení" />
            <Stat onInk value={site.projectsDone} label="realizací" />
          </div>
        </div>
      </section>
    </main>
  );
}
