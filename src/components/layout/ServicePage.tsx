import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Photo } from './Photo';
import { site } from '@/content/site';
import type { Service } from '@/content/services';
import styles from './ServicePage.module.css';

export function ServicePage({ service }: { service: Service }) {
  const [hero, ...gallery] = service.images;
  return (
    <main>
      <section className={`container ${styles.heroWrap}`}>
        <div className={styles.heroSheet}>
          <div className={styles.overline}><span className={styles.marker} />{service.tagline}</div>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.intro}>{service.intro}</p>
          <div className={styles.actions}>
            <Button href="/kontakt" size="lg">Nezávazná poptávka</Button>
            <a href={site.phoneHref} className={styles.phone}><Icon name="call" size={18} />{site.phone}</a>
          </div>
        </div>
        <div className={styles.heroPhoto}><Photo src={hero} alt={`${service.title} — ukázka realizace`} priority rounded={false} sizes="(max-width: 1200px) 100vw, 1200px" /></div>
      </section>

      <section className={`container ${styles.body}`}>
        <div className={styles.bulletsHead}><span className={styles.marker} />{service.bulletsHeading}</div>
        <ul className={styles.bullets}>
          {service.bullets.map((b) => (
            <li key={b} className={styles.bullet}><Icon name="check" size={20} className={styles.check} /><span>{b}</span></li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 && (
        <section className={`container ${styles.gallery}`}>
          {gallery.map((img, i) => (
            <div key={img} className={styles.galleryItem}><Photo src={img} alt={`${service.title} — realizace ${i + 1}`} sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 380px" /></div>
          ))}
        </section>
      )}

      <section className={`container ${styles.ctaWrap}`}>
        <div className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>Chcete podobnou realizaci?</h2>
          <Button href="/kontakt" variant="ink" size="lg">Napište nám poptávku</Button>
        </div>
      </section>
    </main>
  );
}
