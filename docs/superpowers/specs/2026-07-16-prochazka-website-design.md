# Procházka — stavební a zemní práce · Website Design Spec

**Date:** 2026-07-16
**Status:** Approved design, pending spec review

## Goal

Rebuild www.stavbyprochazka.cz as a fast, statically-rendered Next.js marketing site. The visual language comes 1:1 from the Claude Design project **"Procházka Design System"** (`01f69960-cc6c-4ee6-bdf6-5e30286b5c88`); the content, facts, and photos come from the current live site. Hosted in a **private GitHub repo `prochazka-construction`** under the `Honzeenek` account.

Priorities, in order: **speed** (load performance), **frontend design fidelity** to the design system, content parity with the old site.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript**, fully static output (every route prerendered; no runtime server dependency except the form API route).
- **Styling:** plain CSS — design-system tokens as CSS custom properties in `src/styles/tokens.css` (ported verbatim from the design project's `tokens/*.css`), plus **CSS Modules** per component. No Tailwind, no CSS-in-JS.
- **Fonts:** `next/font/google` — **Anton** (display) and **Hanken Grotesk** 400/500/700 (body), both with `latin-ext` subset for Czech diacritics. **Material Symbols Rounded** (FILL 1) for icons, self-hosted subset or `next/font` where possible rather than a render-blocking stylesheet.
- **Images:** `next/image` with real photos downloaded from the old site into `public/images/`.
- **Language:** Czech only (`lang="cs"`), vy/vykání tone per the design system's content rules. No i18n framework.

## Routes (mirrors the old site)

| Route | Page |
|---|---|
| `/` | Úvod — hero, "jak pracujeme", 3 služby, ink stats band |
| `/stavebni-prace` | Stavební práce — service detail |
| `/zemni-prace` | Zemní práce — service detail |
| `/pronajem-kontejneru` | Pronájem kontejneru — service detail |
| `/kontakt` | Kontakt — poptávka form + contact info |
| `/zasady-cookies` | Legal — cookie policy (content from old site) |
| `/ochrana-osobnich-udaju` | Legal — privacy policy (content from old site) |

- Shared `Nav` (desktop links + mobile hamburger) and `Footer` in the root layout.
- The three service pages share **one templated layout component** fed per-service content (hero photo, copy blocks, CTA to `/kontakt`).
- 404 page styled with the design system.

## Design system port

Port the Claude Design project into the repo as real typed React components. Visual language preserved exactly:

- **Tokens** (`src/styles/tokens.css`): orange `#EE6F14` single accent (`--brand`), warm ink `#141210`, warm-paper surfaces `#FAF8F5`/`#F3F0EA`, semantic green/red for forms only. Full color/typography/spacing/effects scales copied from the design project.
- **Type:** Anton display — uppercase via CSS, leading 0.98, `clamp(56px, 7vw, 92px)` hero scale; Hanken Grotesk body 16px/1.6; overlines 12.5–14px/700/`.09em` uppercase with the 8×8px orange square marker.
- **Components** (`src/components/ui/`): `Button` (primary/secondary/ghost, sm/md/lg), `IconButton`, `Badge`, `Card`, `ServiceCard`, `SectionHeader`, `Stat`, `Input`, `Select`, `Textarea`, `Checkbox` — rewritten from the design project's `.jsx` specs (which use inline styles) into CSS Modules, preserving exact values.
- **Layout components** (`src/components/layout/`): `Nav`, `Footer`, `Wordmark` (Anton "PROCHÁZKA." + overline; real logo `Logo-PROCHAZKA.png` from the old site evaluated during implementation — use whichever reads better at nav size, wordmark is the design-system default).
- **Motifs:** white cards radius 24px / photo frames 32px / inputs & buttons 10px; hairline dividers; white content sheets over photos (text never sits directly on an image); one ink-dark section per page max; no gradients/textures/blur; 120–220ms ease-out motion only, no scroll animations.
- **Responsive:** design system is desktop-authored (1200px container); mobile layouts follow the same tokens — grids collapse to single column, hero display scales via clamp, nav collapses to hamburger. Breakpoints: ~640px and ~960px.

## Content (from the old site — real facts, not design-system placeholders)

- **Hero headline:** „Po nás zůstane jen dobře odvedená práce" (real site), rendered in Anton display style. Supporting copy adapted from the old site + design-system tone.
- **Facts:** founded **1988**, **1 800+ realizací** — these feed the ink stats band (replacing the design kit's placeholder "15+ / 120 / 9-10" stats; the third stat slot uses a real, verifiable fact from the old site or is dropped to two stats).
- **Services (3):** Zemní práce, Stavební práce, Pronájem kontejneru — replacing the design kit's placeholder "Základové desky". Detail copy pulled from each old service page during implementation.
- **Contact:** +420 777 119 179 · info@stavbyprochazka.cz · Chřibská. Response promise: „Ozveme se vám nejpozději druhý pracovní den."
- **Photos** downloaded from `stavbyprochazka.cz/wp-content/uploads/`: logo, `Zemni-prace-Prochazka-05/06.jpeg`, `Stavebni-prace-B.jpeg`, `Sutove-kontejnery-Stavby-Prochazka-19.jpg`, plus any additional images found on the service pages. Where the design calls for more imagery than exists, reuse these photos; never invent placeholder graphics in the final site.
- **Values copy:** „kvalita, férovost a lidský přístup nejsou bonus, ale samozřejmost" (appears on both old site and design system — keep).

## Contact form (poptávka)

- Fields per old site: jméno, telefon, e-mail, zpráva (+ GDPR consent checkbox using design-system `Checkbox`).
- Client-side validation with design-system error states; success state after submit.
- Submits to a Next.js route handler `POST /api/poptavka` that is **stubbed** (validates, logs, returns success) with a clearly-marked integration point for an email provider later. No API keys required now.
- Phone (`tel:`) and email (`mailto:`) links displayed prominently next to the form as the always-working fallback.

## Performance targets

- Static prerender of all routes; zero client JS on content pages except Nav's mobile toggle; form page is the only interactive island.
- Fonts preloaded via `next/font` (no FOIT/layout shift), images sized + lazy-loaded via `next/image`, hero image `priority`.
- Target: Lighthouse Performance ≥ 95 mobile on every page.

## SEO / metadata

- Per-page Czech `title` + `description` via the Metadata API; OpenGraph image from a real photo; `sitemap.xml` + `robots.txt` generated by Next; canonical URLs assume the `stavbyprochazka.cz` domain.

## Repo & delivery

- Private GitHub repo **`Honzeenek/prochazka-construction`**, created via `gh`, local project in `/Users/janpalenik/Developer/prochazka-construction`.
- Conventional project layout: `src/app/` (routes), `src/components/ui|layout/`, `src/styles/`, `src/content/` (per-page Czech copy as typed TS data modules so content edits don't touch components), `public/images/`.
- CI not required; deployment target (Vercel) prepared for but not configured in this scope.

## Out of scope (YAGNI)

No CMS, no blog, no i18n framework, no analytics, no cookie-consent manager (plain legal pages only), no live email sending, no dark mode, no admin.

## Testing

- Build-time guarantee: `next build` with all routes statically generated (build fails otherwise).
- Form: unit-level validation tests + manual verification of success/error states.
- Visual: manual side-by-side check of each page against the design project's `ui_kits/web` screens and guideline cards.
