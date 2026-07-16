import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type Props = { label: string } & InputHTMLAttributes<HTMLInputElement>;
export function Checkbox({ label, className, ...rest }: Props) {
  return (
    <label className={styles.wrap}>
      <input type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden>
        <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" fill="none" /></svg>
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
}
