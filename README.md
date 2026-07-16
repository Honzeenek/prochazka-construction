# Procházka — stavební a zemní práce

Marketing web pro stavební firmu **Procházka** (Chřibská, od roku 1988). Next.js 15 (App Router), plně statický render, vlastní design systém „Procházka" postavený na návrhu z Claude Design.

## Vývoj

```bash
npm install
./scripts/fetch-images.sh   # stáhne fotky z původního webu do public/images
npm run dev                 # http://localhost:3000
```

> Fotografie nejsou verzované jinak než přímo v repu (`public/images`). Skript `fetch-images.sh` je slouží jen k jejich případnému opětovnému stažení z původního webu.

## Skripty

- `npm run dev` — vývojový server
- `npm run build` / `npm start` — produkční build a spuštění
- `npm test` — testy (Vitest + React Testing Library)
- `npm run lint` — ESLint

## Struktura

```
src/
  app/            route segmenty (App Router) — /, služby, /kontakt, právní stránky, sitemap, robots, /api/poptavka
  components/
    ui/           design-system komponenty (Button, Card, ServiceCard, formulářová pole, …)
    layout/       Nav, Footer, Wordmark, Photo, ServicePage, ContactForm
  content/        veškerý český obsah a fakta (site.ts, services.ts, legal.ts)
  lib/            čistá logika (validace poptávky)
  styles/         design tokeny (CSS custom properties)
public/images/    reálné fotografie a logo z původního webu
```

Obsah je oddělený od prezentace v `src/content/` — texty se upravují bez zásahu do komponent.

## Kontaktní formulář

`POST /api/poptavka` validuje data na serveru a je připraven na napojení e-mailu.
Integrační bod je označen komentářem **„EMAIL INTEGRATION POINT"** v `src/app/api/poptavka/route.ts`
(např. Resend). Do té doby se poptávka pouze zaloguje; telefon a e-mail jsou na stránce
`/kontakt` uvedené jako vždy funkční alternativa.

## Design systém

Zdroj: Claude Design projekt „Procházka Design System". Jediný akcent — oranžová `#EE6F14`,
teplá inkoustová `#141210`, písma Anton (display) + Hanken Grotesk (text), velké přátelské
rohy (karty 24px, foto rámy 32px). Tokeny jsou v `src/styles/tokens.css`.
