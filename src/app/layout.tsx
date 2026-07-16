import './globals.css';
import type { Metadata } from 'next';
import { Anton, Hanken_Grotesk } from 'next/font/google';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/content/site';

const anton = Anton({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-anton', display: 'swap' });
const hanken = Hanken_Grotesk({ weight: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' });

const description = 'Stavební a zemní práce, na které se můžete spolehnout. Od roku 1988, přes 1 800 realizací.';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: 'Procházka — stavební a zemní práce', template: '%s · Procházka' },
  description,
  openGraph: {
    title: 'Procházka — stavební a zemní práce',
    description,
    type: 'website',
    locale: 'cs_CZ',
    images: ['/images/stavebni-hero.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${anton.variable} ${hanken.variable}`}>
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-rounded.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
