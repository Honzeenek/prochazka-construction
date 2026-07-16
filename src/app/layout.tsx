import './globals.css';
import type { Metadata } from 'next';
import { Anton, Hanken_Grotesk } from 'next/font/google';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

const anton = Anton({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-anton', display: 'swap' });
const hanken = Hanken_Grotesk({ weight: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Procházka — stavební a zemní práce', template: '%s · Procházka' },
  description: 'Stavební a zemní práce, na které se můžete spolehnout. Od roku 1988, přes 1 800 realizací.',
};

const ICONS = 'construction,front_loader,local_shipping,call,mail,place,check,arrow_forward,menu,close,schedule';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${anton.variable} ${hanken.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&icon_names=${ICONS}&display=block`}
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
