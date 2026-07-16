import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Stat } from '@/components/ui/Stat';
import { Photo } from '@/components/layout/Photo';
import { site } from '@/content/site';
import { services } from '@/content/services';
import styles from './home.module.css';

export default function Home() {
  return (
    <main>
      <section className={`container ${styles.heroWrap}`}>
        <div className={styles.heroSheet}>
          <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
          <p className={styles.heroLead}>{site.heroLead}</p>
          <div className={styles.heroActions}>
            <Button href="/kontakt" size="lg">Nezávazná poptávka</Button>
            <Button href="/stavebni-prace" size="lg" variant="secondary">Naše služby</Button>
          </div>
        </div>
        <div className={styles.heroPhoto}>
          <Photo src="stavebni-hero.jpg" alt="Tým Procházka při stavebních pracích" priority rounded={false} sizes="(max-width: 1200px) 100vw, 1200px" />
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
