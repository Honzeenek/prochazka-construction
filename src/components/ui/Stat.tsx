import styles from './Stat.module.css';
export function Stat({ value, label, onInk }: { value: string; label: string; onInk?: boolean }) {
  return (
    <div className={styles.stat} data-ink={onInk ? 'true' : undefined}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
