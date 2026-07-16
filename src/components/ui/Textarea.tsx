import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { Field } from './Field';
import styles from './Field.module.css';

type Props = { label?: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ label, error, hint, id, rows = 4, ...rest }: Props) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <textarea id={fieldId} rows={rows} className={styles.box} data-error={error ? 'true' : undefined} style={{ resize: 'vertical' }} {...rest} />
    </Field>
  );
}
