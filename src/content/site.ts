export const site = {
  name: 'Procházka',
  tagline: 'Stavební a zemní práce',
  phone: '+420 777 119 179',
  phoneHref: 'tel:+420777119179',
  email: 'info@stavbyprochazka.cz',
  location: 'Chřibská',
  region: 'České Švýcarsko a okolí',
  foundedYear: 1988,
  projectsDone: '1 800+',
  responsePromise: 'Ozveme se vám nejpozději druhý pracovní den.',
  values: 'Věříme, že kvalita, férovost a lidský přístup nejsou bonus, ale samozřejmost.',
  heroTitle: 'Po nás zůstane jen dobře odvedená práce',
  heroLead: 'Stavební a zemní práce, na které se můžete spolehnout. Každý zákazník je pro nás jedinečný — a podle toho k němu přistupujeme.',
  domain: 'https://www.stavbyprochazka.cz',
} as const;

export const nav = [
  { href: '/', label: 'Úvod' },
  { href: '/stavebni-prace', label: 'Stavební práce' },
  { href: '/zemni-prace', label: 'Zemní práce' },
  { href: '/pronajem-kontejneru', label: 'Pronájem kontejneru' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;
