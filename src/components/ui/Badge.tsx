import type { ReactNode } from 'react';
import styles from './Badge.module.css';
export function Badge({ variant = 'brand', children }: { variant?: 'brand' | 'ink' | 'solid'; children: ReactNode }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
