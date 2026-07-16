import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { Field } from './Field';
import styles from './Field.module.css';

type Props = { label?: string; error?: string; hint?: string; options: string[] } & SelectHTMLAttributes<HTMLSelectElement>;
const CHEVRON = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23141210' stroke-width='2' fill='none'/%3E%3C/svg%3E\")";

export function Select({ label, error, hint, options, id, ...rest }: Props) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <select id={fieldId} className={styles.box} data-error={error ? 'true' : undefined}
        style={{ appearance: 'none', backgroundImage: CHEVRON, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }} {...rest}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}
