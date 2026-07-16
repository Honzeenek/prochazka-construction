import Image from 'next/image';
import styles from './Photo.module.css';

// next/image does not prepend basePath to image src under static export, so we
// add it explicitly (empty for local dev / root deploys, set for GitHub Pages).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type Props = { src?: string; alt: string; className?: string; priority?: boolean; rounded?: boolean; sizes?: string };

export function Photo({ src, alt, className, priority, rounded = true, sizes = '100vw' }: Props) {
  return (
    <div className={`${styles.frame}${rounded ? ` ${styles.rounded}` : ''}${className ? ` ${className}` : ''}`}>
      {src ? (
        <Image src={`${BASE}/images/${src}`} alt={alt} fill sizes={sizes} priority={priority} className={styles.img} />
      ) : (
        <span className={styles.placeholder} aria-label={alt}>
          {alt}
        </span>
      )}
    </div>
  );
}
