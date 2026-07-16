import type { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/layout/ContactForm';
import { site } from '@/content/site';
import styles from './kontakt.module.css';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Napište nebo zavolejte — ozveme se vám nejpozději druhý pracovní den. Telefon +420 777 119 179.',
};

export default function Page() {
  return (
    <main className={`container ${styles.wrap}`}>
      <div className={styles.info}>
        <SectionHeader overline="Kontakt" title="Ozvěte se nám" lead={`Napište nebo zavolejte. ${site.responsePromise}`} />
        <div className={styles.details}>
          <a className={styles.row} href={site.phoneHref}><Icon name="call" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>Telefon</span><strong>{site.phone}</strong></span></a>
          <a className={styles.row} href={`mailto:${site.email}`}><Icon name="mail" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>E-mail</span><strong>{site.email}</strong></span></a>
          <div className={styles.row}><Icon name="place" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>Působíme</span><strong>{site.region}</strong></span></div>
        </div>
      </div>
      <Card padding={32}><ContactForm /></Card>
    </main>
  );
}
