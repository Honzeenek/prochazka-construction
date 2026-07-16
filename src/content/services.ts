export type Service = {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  intro: string;
  bulletsHeading: string;
  bullets: string[];
  images: string[];
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: 'stavebni-prace',
    icon: 'construction',
    title: 'Stavební práce',
    tagline: 'Kompletní řešení pro vaši stavbu či rekonstrukci',
    intro:
      'Plánujete stavbu domu, rekonstrukci, nebo potřebujete zhotovit základovou desku, opěrnou zeď či pergolu? Nabízíme stavební práce pro soukromé i menší firemní zakázky — s důrazem na kvalitu, férové jednání a dodržení termínu.',
    bulletsHeading: 'Jaké stavební práce realizujeme',
    bullets: [
      'Základové desky – výkopy, bednění, armování, betonáž',
      'Stavby domů – od základů po hrubou stavbu',
      'Rekonstrukce domů a bytů – bourání, příčky, omítky',
      'Práce se dřevem – pergoly, zahradní domky, krovy, obklady',
      'Demoliční práce – vybourávání a odstranění stavebních prvků',
      'Zateplení a obytné půdní vestavby',
      'Výstavba opěrných zdí – betonové, kamenné, ztracené bednění',
    ],
    images: ['stavebni-hero.jpg', 'stavebni-01.jpg', 'stavebni-02.jpg', 'stavebni-03.jpg', 'stavebni-04.jpg', 'stavebni-05.jpg', 'stavebni-06.jpg'],
    seoDescription: 'Stavební práce — stavby domů, rekonstrukce, základové desky, opěrné zdi a práce se dřevem. Soukromé i menší firemní zakázky.',
  },
  {
    slug: 'zemni-prace',
    icon: 'front_loader',
    title: 'Zemní práce',
    tagline: 'S vlastní technikou — rychle a spolehlivě',
    intro:
      'Hledáte firmu, která zajistí zemní práce rychle, bezpečně a bez zbytečných průtahů? Postaráme se o kompletní přípravu staveniště – od skrývky ornice přes výkopy základových pasů až po zásypy a odvoz přebytečné zeminy.',
    bulletsHeading: 'Co pro vás zajistíme',
    bullets: [
      'Strojní i ruční zemní práce',
      'Terénní úpravy a modelace pozemku',
      'Skrývka, přesun a odvoz zeminy',
      'Bourací práce malého rozsahu',
      'Stavební jámy pro bazény',
      'Zásypy a hutnění',
    ],
    images: ['zemni-hero-a.jpg', 'zemni-01.jpg', 'zemni-02.jpg', 'zemni-03.jpg', 'zemni-04.jpg', 'zemni-05.jpg', 'zemni-06.jpg', 'zemni-07.jpg', 'zemni-08.jpg', 'zemni-09.jpg'],
    seoDescription: 'Zemní práce s vlastní technikou — výkopy, terénní úpravy, skrývka a odvoz zeminy, stavební jámy, zásypy a hutnění.',
  },
  {
    slug: 'pronajem-kontejneru',
    icon: 'local_shipping',
    title: 'Pronájem kontejneru',
    tagline: 'Rychlý a snadný odvoz stavební suti',
    intro:
      'Rekonstruujete byt, bouráte příčky nebo řešíte jinou stavební úpravu? Suť a těžký odpad se rychle hromadí – a my vám ho pomůžeme rychle a ekologicky odvézt. Kontejnery přistavíme, necháme naplnit a postaráme se o likvidaci.',
    bulletsHeading: 'Co odvezeme',
    bullets: [
      'Cihly, beton, omítka',
      'Keramika, obklady, dlažba',
      'Stavební směsi bez nebezpečných složek',
      'Zemina, kamenivo, písek – po domluvě',
    ],
    images: ['kontejner-01.jpg', 'kontejner-02.jpg', 'kontejner-03.jpg', 'kontejner-04.jpg', 'kontejner-05.jpg', 'kontejner-06.jpg', 'kontejner-07.jpg', 'kontejner-08.jpg', 'kontejner-09.jpg'],
    seoDescription: 'Pronájem sutových kontejnerů 3–17 m³. Rychlý a ekologický odvoz stavební suti — přistavení, naplnění a likvidace.',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

// Extra structured copy for the container page (process + volumes), used only there.
export const containerExtras = {
  processHeading: 'Jak to probíhá',
  steps: ['Objednávka', 'Přistavení', 'Naplnění (3–7 dní)', 'Odvoz a likvidace'],
  volumeHeading: 'Objem kontejnerů',
  volumeNote: 'Kontejnery od 3 m³ do 17 m³ — vybereme velikost podle množství suti.',
} as const;
