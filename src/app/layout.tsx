import './globals.css';
import type { Metadata } from 'next';
import { Archivo, Hanken_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/content/site';

const archivo = Archivo({ weight: ['600', '700', '800'], subsets: ['latin', 'latin-ext'], variable: '--font-display-src', display: 'swap' });
const hanken = Hanken_Grotesk({ weight: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' });
// Self-hosted subset of Material Symbols Rounded — routed through next/font so
// it resolves correctly under any basePath/assetPrefix (e.g. GitHub Pages).
const symbols = localFont({
  src: './fonts/material-symbols-rounded.woff2',
  weight: '100 700',
  display: 'block',
  variable: '--font-symbols',
});

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
    <html lang="cs" className={`${archivo.variable} ${hanken.variable} ${symbols.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
