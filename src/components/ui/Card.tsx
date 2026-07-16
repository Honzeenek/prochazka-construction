import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

type Props = { hoverable?: boolean; padding?: number; children: ReactNode } & HTMLAttributes<HTMLDivElement>;
export function Card({ hoverable, padding = 24, children, className, style, ...rest }: Props) {
  return (
    <div className={`${styles.card}${hoverable ? ` ${styles.hoverable}` : ''}${className ? ` ${className}` : ''}`} style={{ padding, ...style }} {...rest}>
      {children}
    </div>
  );
}
