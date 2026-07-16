import type { Metadata } from 'next';
import { getLegal } from '@/content/legal';
import styles from '../legal.module.css';

const page = getLegal('ochrana-osobnich-udaju')!;
export const metadata: Metadata = { title: page.title, robots: { index: false } };

export default function Page() {
  return (
    <main className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>{page.title}</h1>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}
