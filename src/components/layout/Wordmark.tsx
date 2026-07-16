import { site } from '@/content/site';
import styles from './Wordmark.module.css';

export function Wordmark({ onInk }: { onInk?: boolean }) {
  return (
    <span className={styles.wrap} data-ink={onInk ? 'true' : undefined}>
      <span className={styles.name}>Procházka<span className={styles.dot}>.</span></span>
      <span className={styles.sub}>{site.tagline}</span>
    </span>
  );
}
