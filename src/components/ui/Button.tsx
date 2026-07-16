import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ink' | 'ghost';
type Size = 'md' | 'lg';

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };
type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({ variant = 'primary', size = 'md', children, className, ...rest }: AsButton | AsLink) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]}${className ? ` ${className}` : ''}`;
  if ('href' in rest && rest.href) {
    return (
      <Link className={cls} data-variant={variant} data-size={size} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} data-variant={variant} data-size={size} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
