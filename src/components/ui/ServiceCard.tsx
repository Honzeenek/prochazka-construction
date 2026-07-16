import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import styles from './ServiceCard.module.css';

export function ServiceCard({ icon, title, href, children }: { icon: string; title: string; href?: string; children: ReactNode }) {
  const inner = (
    <Card hoverable className={styles.card}>
      <div className={styles.iconTile}><Icon name={icon} size={26} className={styles.icon} /></div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
      {href && <span className={styles.more}><Icon name="arrow_forward" size={18} /></span>}
    </Card>
  );
  return href ? <Link href={href} className={styles.link}>{inner}</Link> : inner;
}
