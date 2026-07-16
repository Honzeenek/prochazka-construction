import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export function SectionHeader({ overline, title, lead, align = 'left' }: { overline?: string; title: ReactNode; lead?: string; align?: 'left' | 'center' }) {
  return (
    <div className={styles.wrap} data-align={align}>
      {overline && <div className={styles.overline}><span className={styles.marker} />{overline}</div>}
      <h2 className={styles.title}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
