import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Field.module.css';

export function Field({ label, error, hint, htmlFor, children }: { label?: string; error?: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

type InputProps = { label?: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;
export function Input({ label, error, hint, id, ...rest }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <input id={fieldId} className={styles.box} data-error={error ? 'true' : undefined} {...rest} />
    </Field>
  );
}
