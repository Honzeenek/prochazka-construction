import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';
import styles from './IconButton.module.css';

type Props = { icon: string; variant?: 'primary' | 'soft' | 'outline'; size?: number; label: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function IconButton({ icon, variant = 'primary', size = 44, label, className, ...rest }: Props) {
  return (
    <button
      aria-label={label} title={label} data-variant={variant}
      className={`${styles.ib} ${styles[variant]}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }} {...rest}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}
