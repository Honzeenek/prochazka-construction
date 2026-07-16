# Procházka Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, statically-rendered Next.js marketing site for Procházka (Czech construction & earthworks firm), applying the "Procházka Design System" 1:1 with real content and photos from the current live site.

**Architecture:** Next.js 15 App Router, fully static prerender. Every content page is a Server Component with zero client JS; only the mobile-nav toggle and the contact form are `'use client'` islands. Design-system components are ported from the design project's inline-style `.jsx` specs into typed React Server Components using CSS Modules, with hover/focus states in CSS (no JS state) for speed. Content lives in typed TS data modules, separate from components.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS Modules + CSS custom-property tokens, `next/font/google` (Anton + Hanken Grotesk), Material Symbols Rounded (subsetted), Vitest + React Testing Library (jsdom).

## Global Constraints

- **Node:** ≥ 18.18 (Next.js 15 floor). Package manager: npm.
- **Language:** Czech only, `lang="cs"`. All copy uses correct diacritics, vy/vykání tone. No emoji.
- **Single accent color:** orange `--brand #EE6F14` only. Warm ink `#141210`. No secondary hues, no gradients/textures/blur on real content (gradient only allowed as the `Photo` fallback when no image).
- **Corners:** cards 24px (`--radius-lg`), photo frames 32px (`--radius-xl`), inputs/buttons 10px (`--radius-sm`).
- **Motion:** 120–220ms ease-out only (`--dur-fast`/`--dur-med`, `--ease-out`). No scroll animations.
- **Container:** max 1200px (`--container-max`), 24px pad (`--container-pad`). Sections breathe 96–128px vertical.
- **Text never sits directly on a photo** — always on a white sheet.
- **Real facts only** (from live site): founded **1988**, **1 800+ realizací**, phone **+420 777 119 179**, e-mail **info@stavbyprochazka.cz**, based in **Chřibská**. Never invent stats.
- **Design tokens are authoritative** — copy exact values from this plan; do not eyeball.
- **Commit after every task.** Conventional commit messages. End each with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## Design token reference (authoritative — used throughout)

Colors: `--orange-500:#EE6F14` (brand), `--orange-600:#D65E0B` (hover), `--orange-700:#B04C08` (press), `--orange-50:#FEF3EA` (soft), `--orange-100:#FCE3D0`, `--orange-200:#F9C39C`, `--orange-400:#F2842F` (focus ring). Ink: `--ink-900:#141210`, `--ink-700:#2B2823`, `--ink-500:#57534B`, `--ink-400:#7A756B`, `--ink-300:#A8A296`. Paper: `#FFFFFF`, `#FAF8F5`, `#F3F0EA`, `#E8E4DC`. Lines: `--line-soft:#ECE8E0`, `--line-mid:#DCD7CC`. Semantic: `--green-600:#3E7C3A`, `--green-100:#E4F0E2`, `--red-600:#C43D24`, `--red-100:#FAE6E1`.

Type: display `"Anton"` uppercase, tracking `.005em`, leading `.98`; scale `--display-xl:clamp(56px,7vw,92px)`, `--display-lg:clamp(40px,5vw,64px)`, `--display-md:clamp(30px,3.5vw,44px)`, `--display-sm:28px`. Body `"Hanken Grotesk"` 16px/1.6; `--text-lg:19px`, `--text-md:16px`, `--text-sm:14px`, `--text-xs:12.5px`. Labels: `.09em`, 700, uppercase.

Spacing: 4·8·12·16·24·32·48·64·96·128px = `--space-1..10`. Radii: xs 6, sm 10, md 16, lg 24, xl 32. Shadows: `--shadow-card:0 1px 2px rgba(20,18,16,.05)`, `--shadow-float:0 12px 32px -12px rgba(20,18,16,.18)`.

---

## File Structure

```
prochazka-construction/
├── package.json, next.config.mjs, tsconfig.json, .gitignore, .eslintrc.json
├── vitest.config.ts, vitest.setup.ts
├── public/images/            # downloaded real photos + logo
├── src/
│   ├── app/
│   │   ├── layout.tsx        # root: fonts, Material Symbols, Nav, Footer, base metadata
│   │   ├── globals.css       # @import tokens + base + icon sizing
│   │   ├── page.tsx          # Home (/)
│   │   ├── stavebni-prace/page.tsx
│   │   ├── zemni-prace/page.tsx
│   │   ├── pronajem-kontejneru/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── zasady-cookies/page.tsx
│   │   ├── ochrana-osobnich-udaju/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts, robots.ts
│   │   └── api/poptavka/route.ts
│   ├── components/
│   │   ├── ui/               # Button, IconButton, Badge, Card, ServiceCard, SectionHeader, Stat, Field/Input, Textarea, Select, Checkbox, Icon (+ .module.css)
│   │   └── layout/           # Wordmark, Photo, Nav, Footer, ServicePage, ContactForm
│   ├── content/              # site.ts, services.ts, legal.ts
│   └── styles/tokens.css
└── docs/superpowers/…        # spec + this plan
```

Each service page is one shared `ServicePage` component fed data from `services.ts`. Content is fully separated from presentation so copy edits never touch components.

---

## Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `.gitignore`, `.eslintrc.json`, `next-env.d.ts` (auto), `vitest.config.ts`, `vitest.setup.ts`
- Create: `src/app/layout.tsx` (temporary minimal), `src/app/page.tsx` (temporary), `src/app/globals.css` (empty)
- Test: `src/app/__smoke__/scaffold.test.tsx`

**Interfaces:**
- Produces: a buildable Next.js app; `npm run build`, `npm run dev`, `npm test` scripts.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "prochazka-construction",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "15.1.6",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9",
    "eslint-config-next": "15.1.6",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create config files**

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // real photos are downloaded into /public, so no remote patterns needed
    formats: ['image/avif', 'image/webp'],
  },
};
export default nextConfig;
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`.gitignore`:
```
/node_modules
/.next
/out
/build
.DS_Store
*.pem
npm-debug.log*
.env*.local
/coverage
next-env.d.ts
```

`.eslintrc.json`:
```json
{ "extends": "next/core-web-vitals" }
```

- [ ] **Step 3: Vitest config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

Note: `css: false` means CSS Module imports resolve to an empty object in tests — so tests assert on roles/text/`data-*` attributes, never on hashed class names. Components expose `data-*` attributes for variant assertions.

- [ ] **Step 4: Minimal app shell**

`src/app/globals.css`: (empty for now — one blank line)

`src/app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Procházka', description: 'Stavební a zemní práce' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:
```tsx
export default function Home() {
  return <main>Procházka</main>;
}
```

- [ ] **Step 5: Write the smoke test**

`src/app/__smoke__/scaffold.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../page';

describe('scaffold', () => {
  it('renders the home placeholder', () => {
    render(<Home />);
    expect(screen.getByText('Procházka')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Install and verify**

Run: `npm install`
Run: `npm test`
Expected: 1 passed.
Run: `npm run build`
Expected: build succeeds, route `/` prerendered as static.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript and Vitest

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: Design tokens, fonts, and global styles

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Test: `src/app/__smoke__/tokens.test.tsx`

**Interfaces:**
- Produces: global CSS custom properties (all tokens from the reference above); `--font-display`/`--font-body` wired to `next/font` variables; Material Symbols available via `.material-symbols-rounded`.

- [ ] **Step 1: Create `src/styles/tokens.css`** (verbatim values from the token reference)

```css
:root {
  /* Brand */
  --orange-50:#FEF3EA;--orange-100:#FCE3D0;--orange-200:#F9C39C;--orange-300:#F59F63;--orange-400:#F2842F;--orange-500:#EE6F14;--orange-600:#D65E0B;--orange-700:#B04C08;--orange-800:#873A08;
  /* Ink */
  --ink-900:#141210;--ink-700:#2B2823;--ink-500:#57534B;--ink-400:#7A756B;--ink-300:#A8A296;
  /* Paper */
  --paper-0:#FFFFFF;--paper-50:#FAF8F5;--paper-100:#F3F0EA;--paper-200:#E8E4DC;
  /* Lines */
  --line-soft:#ECE8E0;--line-mid:#DCD7CC;--line-strong:#141210;
  /* Semantic */
  --green-600:#3E7C3A;--green-100:#E4F0E2;--red-600:#C43D24;--red-100:#FAE6E1;
  /* Aliases */
  --brand:var(--orange-500);--brand-hover:var(--orange-600);--brand-press:var(--orange-700);--brand-soft:var(--orange-50);
  --text-heading:var(--ink-900);--text-body:var(--ink-700);--text-muted:var(--ink-500);--text-faint:var(--ink-400);--text-on-brand:#FFFFFF;--text-on-ink:#FAF8F5;
  --surface-page:var(--paper-0);--surface-section:var(--paper-50);--surface-card:var(--paper-0);--surface-ink:var(--ink-900);
  --focus-ring:var(--orange-400);

  /* Type — font families resolve to next/font variables (set on <html>) */
  --font-display:var(--font-anton),"Arial Narrow",sans-serif;
  --font-body:var(--font-hanken),"Helvetica Neue",Arial,sans-serif;
  --display-xl:clamp(56px,7vw,92px);--display-lg:clamp(40px,5vw,64px);--display-md:clamp(30px,3.5vw,44px);--display-sm:28px;
  --display-tracking:0.005em;--display-leading:0.98;
  --text-lg:19px;--text-md:16px;--text-sm:14px;--text-xs:12.5px;--body-leading:1.6;
  --label-tracking:0.09em;--label-weight:700;
  --weight-regular:400;--weight-medium:500;--weight-semibold:600;--weight-bold:700;

  /* Spacing */
  --space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-5:24px;--space-6:32px;--space-7:48px;--space-8:64px;--space-9:96px;--space-10:128px;
  --container-max:1200px;--container-pad:24px;--section-gap:var(--space-9);

  /* Effects */
  --radius-xs:6px;--radius-sm:10px;--radius-md:16px;--radius-lg:24px;--radius-xl:32px;--radius-pill:999px;
  --shadow-card:0 1px 2px rgba(20,18,16,.05);--shadow-float:0 12px 32px -12px rgba(20,18,16,.18);
  --ease-out:cubic-bezier(.22,.61,.36,1);--dur-fast:120ms;--dur-med:220ms;
}
```

- [ ] **Step 2: Rewrite `src/app/globals.css`** (base element styles from design system + icon sizing + responsive container helper)

```css
@import "../styles/tokens.css";

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--text-body);
  background: var(--surface-page);
  font-size: var(--text-md);
  line-height: var(--body-leading);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--text-heading);
  text-transform: uppercase;
  letter-spacing: var(--display-tracking);
  line-height: var(--display-leading);
  margin: 0;
}

a { color: var(--ink-900); text-decoration-color: var(--orange-400); text-underline-offset: 3px; }
a:hover { color: var(--orange-600); }
::selection { background: var(--orange-200); }
img { max-width: 100%; display: block; }

.material-symbols-rounded {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
  user-select: none;
}

/* Shared page container */
.container { max-width: var(--container-max); margin: 0 auto; padding-left: var(--container-pad); padding-right: var(--container-pad); }
```

- [ ] **Step 3: Wire fonts + Material Symbols in `src/app/layout.tsx`**

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Anton, Hanken_Grotesk } from 'next/font/google';

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
      <body>{children}</body>
    </html>
  );
}
```

Note: Material Symbols is subsetted to only the listed icons (≈ a few KB) and loaded with `display=block` so no wrong-glyph flash. Nav/Footer are added in Task 8.

- [ ] **Step 4: Write token test**

`src/app/__smoke__/tokens.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('tokens', () => {
  const css = readFileSync('src/styles/tokens.css', 'utf8');
  it('defines the single brand accent', () => {
    expect(css).toContain('--orange-500:#EE6F14');
    expect(css).toContain('--brand:var(--orange-500)');
  });
  it('defines the friendly-corner radii', () => {
    expect(css).toContain('--radius-lg:24px');
    expect(css).toContain('--radius-xl:32px');
    expect(css).toContain('--radius-sm:10px');
  });
});
```

- [ ] **Step 5: Verify**

Run: `npm test`
Expected: all pass.
Run: `npm run build`
Expected: build succeeds (fonts fetched at build time).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, fonts, and global base styles

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: Download real photos and logo

**Files:**
- Create: `scripts/fetch-images.sh`, `public/images/*` (downloaded)
- Test: `src/app/__smoke__/images.test.ts`

**Interfaces:**
- Produces: local image files referenced by `content/services.ts` and pages. Canonical filenames listed below.

Confirmed source files (all HTTP 200, base `https://www.stavbyprochazka.cz/wp-content/uploads/2025/07/`):
- `Logo-PROCHAZKA.png`
- Zemní: `Pozemni-prace-Stavby-Prochazka-01…09.jpg` (9), plus `Zemni-prace-Prochazka-05.jpeg`, `Zemni-prace-Prochazka-06.jpeg`
- Stavební: `Stavebni-prace-Stavby-Prochazka-01…06.jpg` (6), plus `Stavebni-prace-B.jpeg`
- Kontejnery: `Sutove-kontejnery-Stavby-Prochazka-{12,15,16,17,19,20,21,26,27}.jpg` (9)

- [ ] **Step 1: Write `scripts/fetch-images.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
BASE="https://www.stavbyprochazka.cz/wp-content/uploads/2025/07"
OUT="public/images"
mkdir -p "$OUT"

get() { curl -fsSL "$BASE/$1" -o "$OUT/$2" && echo "ok  $2"; }

get "Logo-PROCHAZKA.png" "logo.png"
for n in 01 02 03 04 05 06 07 08 09; do get "Pozemni-prace-Stavby-Prochazka-$n.jpg" "zemni-$n.jpg"; done
get "Zemni-prace-Prochazka-05.jpeg" "zemni-hero-a.jpg"
get "Zemni-prace-Prochazka-06.jpeg" "zemni-hero-b.jpg"
for n in 01 02 03 04 05 06; do get "Stavebni-prace-Stavby-Prochazka-$n.jpg" "stavebni-$n.jpg"; done
get "Stavebni-prace-B.jpeg" "stavebni-hero.jpg"
i=1; for n in 12 15 16 17 19 20 21 26 27; do printf -v p "%02d" "$i"; get "Sutove-kontejnery-Stavby-Prochazka-$n.jpg" "kontejner-$p.jpg"; i=$((i+1)); done

echo "Downloaded $(ls -1 "$OUT" | wc -l) files."
```

- [ ] **Step 2: Run it**

Run: `chmod +x scripts/fetch-images.sh && ./scripts/fetch-images.sh`
Expected: "Downloaded 28 files." (1 logo + 9 zemni + 2 zemni-hero + 6 stavebni + 1 stavebni-hero + 9 kontejner). No `curl` errors.

- [ ] **Step 3: Write image presence test**

`src/app/__smoke__/images.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';

describe('images', () => {
  const required = ['logo.png', 'zemni-01.jpg', 'zemni-hero-a.jpg', 'stavebni-01.jpg', 'stavebni-hero.jpg', 'kontejner-01.jpg'];
  it.each(required)('has public/images/%s', (f) => {
    expect(existsSync(`public/images/${f}`)).toBe(true);
  });
});
```

- [ ] **Step 4: Verify**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit** (images are committed to the repo)

```bash
git add -A
git commit -m "chore: add real jobsite photos and logo from live site

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: UI action components — Icon, Button, IconButton, Badge

**Files:**
- Create: `src/components/ui/Icon.tsx`, `Button.tsx` + `Button.module.css`, `IconButton.tsx` + `IconButton.module.css`, `Badge.tsx` + `Badge.module.css`
- Test: `src/components/ui/__tests__/actions.test.tsx`

**Interfaces:**
- Produces:
  - `Icon({ name, size?, className? })` → `<span class="material-symbols-rounded">`.
  - `Button({ variant?: 'primary'|'secondary'|'ink'|'ghost', size?: 'md'|'lg', href?, ...button/anchor props })` — renders `<a>` when `href` set (via `next/link`), else `<button>`. Exposes `data-variant`, `data-size`.
  - `IconButton({ icon, variant?: 'primary'|'soft'|'outline', size?: number, label, ...})` — accessible icon-only button, `aria-label={label}`.
  - `Badge({ variant?: 'brand'|'ink'|'solid', children })`.

- [ ] **Step 1: Write the failing test**

`src/components/ui/__tests__/actions.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Badge } from '../Badge';

describe('Button', () => {
  it('renders a button with default primary variant', () => {
    render(<Button>Odeslat</Button>);
    const b = screen.getByRole('button', { name: 'Odeslat' });
    expect(b).toHaveAttribute('data-variant', 'primary');
    expect(b).toHaveAttribute('data-size', 'md');
  });
  it('renders an anchor when href is set', () => {
    render(<Button href="/kontakt" variant="secondary" size="lg">Kontakt</Button>);
    const a = screen.getByRole('link', { name: 'Kontakt' });
    expect(a).toHaveAttribute('href', '/kontakt');
    expect(a).toHaveAttribute('data-variant', 'secondary');
  });
});

describe('IconButton', () => {
  it('is labelled for accessibility', () => {
    render(<IconButton icon="call" label="Zavolat" />);
    expect(screen.getByRole('button', { name: 'Zavolat' })).toBeInTheDocument();
  });
});

describe('Badge', () => {
  it('renders its text', () => {
    render(<Badge>Zemní práce</Badge>);
    expect(screen.getByText('Zemní práce')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- actions`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `Icon.tsx`**

```tsx
export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  return (
    <span className={`material-symbols-rounded${className ? ` ${className}` : ''}`} style={{ fontSize: size }} aria-hidden>
      {name}
    </span>
  );
}
```

- [ ] **Step 4: Implement `Button.tsx` + `Button.module.css`**

`Button.tsx`:
```tsx
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
```

`Button.module.css` (translated from the design's inline styles; hover in CSS):
```css
.btn {
  font-family: var(--font-body); font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  border: 1px solid transparent; border-radius: var(--radius-sm); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}
.md { font-size: 13px; padding: 12px 22px; }
.lg { font-size: 14px; padding: 16px 30px; }

.primary { background: var(--brand); color: var(--text-on-brand); }
.primary:hover { background: var(--brand-hover); color: var(--text-on-brand); }
.primary:active { background: var(--brand-press); }

.secondary { background: transparent; color: var(--ink-900); border-color: var(--ink-900); }
.secondary:hover { background: var(--ink-900); color: var(--text-on-ink); }

.ink { background: var(--ink-900); color: var(--text-on-ink); }
.ink:hover { background: var(--ink-700); color: var(--text-on-ink); }

.ghost { background: transparent; color: var(--ink-900); text-decoration: underline; text-decoration-color: var(--orange-400); text-underline-offset: 4px; padding: 12px 4px; }
.ghost:hover { color: var(--orange-600); }

.btn:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
```

- [ ] **Step 5: Implement `IconButton.tsx` + `IconButton.module.css`**

`IconButton.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';
import styles from './IconButton.module.css';

type Props = { icon: string; variant?: 'primary' | 'soft' | 'outline'; size?: number; label: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function IconButton({ icon, variant = 'primary', size = 44, label, className, ...rest }: Props) {
  return (
    <button
      aria-label={label} title={label} data-variant={variant}
      className={`${styles.ib} ${styles[variant]}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }} {...rest}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}
```

`IconButton.module.css`:
```css
.ib { border-radius: var(--radius-sm); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid transparent; transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out); }
.primary { background: var(--brand); color: #fff; }
.primary:hover { background: var(--brand-hover); }
.soft { background: var(--brand-soft); color: var(--brand); }
.soft:hover { background: var(--orange-100); }
.outline { background: transparent; color: var(--ink-900); border-color: var(--ink-900); }
.outline:hover { background: var(--ink-900); color: var(--text-on-ink); }
.ib:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
```

- [ ] **Step 6: Implement `Badge.tsx` + `Badge.module.css`**

`Badge.tsx`:
```tsx
import type { ReactNode } from 'react';
import styles from './Badge.module.css';
export function Badge({ variant = 'brand', children }: { variant?: 'brand' | 'ink' | 'solid'; children: ReactNode }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
```

`Badge.module.css`:
```css
.badge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: var(--radius-xs); font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; font-family: var(--font-body); }
.brand { background: var(--brand-soft); color: var(--brand-press); }
.ink { background: var(--paper-100); color: var(--ink-700); }
.solid { background: var(--brand); color: #fff; }
```

- [ ] **Step 7: Run tests**

Run: `npm test -- actions`
Expected: PASS (all 5).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Button, IconButton, Badge, Icon UI components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: UI display components — Card, ServiceCard, SectionHeader, Stat

**Files:**
- Create: `src/components/ui/Card.tsx` + `Card.module.css`, `ServiceCard.tsx` + `ServiceCard.module.css`, `SectionHeader.tsx` + `SectionHeader.module.css`, `Stat.tsx` + `Stat.module.css`
- Test: `src/components/ui/__tests__/display.test.tsx`

**Interfaces:**
- Consumes: `Icon` (Task 4).
- Produces:
  - `Card({ hoverable?, padding?: number, className?, children, ...div })`.
  - `ServiceCard({ icon, title, href?, children })` — icon tile + uppercase title + muted body; whole card links when `href` set.
  - `SectionHeader({ overline?, title, lead?, align?: 'left'|'center' })` — orange 8px square marker before overline.
  - `Stat({ value, label, onInk? })`.

- [ ] **Step 1: Write the failing test**

`src/components/ui/__tests__/display.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServiceCard } from '../ServiceCard';
import { SectionHeader } from '../SectionHeader';
import { Stat } from '../Stat';

describe('ServiceCard', () => {
  it('renders title and body, links when href set', () => {
    render(<ServiceCard icon="construction" title="Stavební práce" href="/stavebni-prace">Hrubé stavby.</ServiceCard>);
    expect(screen.getByText('Stavební práce')).toBeInTheDocument();
    expect(screen.getByText('Hrubé stavby.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/stavebni-prace');
  });
});

describe('SectionHeader', () => {
  it('renders overline and heading', () => {
    render(<SectionHeader overline="Naše služby" title="Co pro vás uděláme" />);
    expect(screen.getByText('Naše služby')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Co pro vás uděláme' })).toBeInTheDocument();
  });
});

describe('Stat', () => {
  it('renders value and label', () => {
    render(<Stat value="1 800+" label="realizací" />);
    expect(screen.getByText('1 800+')).toBeInTheDocument();
    expect(screen.getByText('realizací')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- display`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `Card.tsx` + `Card.module.css`**

`Card.tsx`:
```tsx
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

type Props = { hoverable?: boolean; padding?: number; children: ReactNode } & HTMLAttributes<HTMLDivElement>;
export function Card({ hoverable, padding = 24, children, className, style, ...rest }: Props) {
  return (
    <div className={`${styles.card}${hoverable ? ` ${styles.hoverable}` : ''}${className ? ` ${className}` : ''}`} style={{ padding, ...style }} {...rest}>
      {children}
    </div>
  );
}
```

`Card.module.css`:
```css
.card { background: var(--surface-card); border: 1px solid var(--line-soft); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); font-family: var(--font-body); transition: box-shadow var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out); }
.hoverable:hover { box-shadow: var(--shadow-float); transform: translateY(-2px); }
```

- [ ] **Step 4: Implement `ServiceCard.tsx` + `ServiceCard.module.css`**

`ServiceCard.tsx`:
```tsx
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import styles from './ServiceCard.module.css';

export function ServiceCard({ icon, title, href, children }: { icon: string; title: string; href?: string; children: ReactNode }) {
  const inner = (
    <Card hoverable className={styles.card}>
      <div className={styles.iconTile}><Icon name={icon} size={26} className={styles.icon} /></div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
      {href && <span className={styles.more}><Icon name="arrow_forward" size={18} /></span>}
    </Card>
  );
  return href ? <Link href={href} className={styles.link}>{inner}</Link> : inner;
}
```

`ServiceCard.module.css`:
```css
.link { text-decoration: none; color: inherit; display: block; }
.card { position: relative; height: 100%; }
.iconTile { width: 52px; height: 52px; border-radius: 14px; background: var(--brand-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.icon { color: var(--brand); }
.title { font-size: 15px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text-heading); margin-bottom: 8px; }
.body { font-size: 14.5px; color: var(--text-muted); line-height: 1.55; }
.more { position: absolute; top: 24px; right: 24px; color: var(--brand); opacity: 0; transition: opacity var(--dur-fast) var(--ease-out); display: inline-flex; }
.link:hover .more { opacity: 1; }
```

- [ ] **Step 5: Implement `SectionHeader.tsx` + `SectionHeader.module.css`**

`SectionHeader.tsx`:
```tsx
import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export function SectionHeader({ overline, title, lead, align = 'left' }: { overline?: string; title: ReactNode; lead?: string; align?: 'left' | 'center' }) {
  return (
    <div className={styles.wrap} data-align={align}>
      {overline && <div className={styles.overline}><span className={styles.marker} />{overline}</div>}
      <h2 className={styles.title}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
```

`SectionHeader.module.css`:
```css
.wrap { font-family: var(--font-body); }
.wrap[data-align='center'] { text-align: center; }
.overline { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-heading); margin-bottom: 16px; }
.wrap[data-align='center'] .overline { justify-content: center; }
.marker { width: 8px; height: 8px; background: var(--brand); flex: none; }
.title { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; line-height: .98; letter-spacing: .005em; color: var(--text-heading); font-size: var(--display-md); margin: 0; }
.lead { margin: 18px 0 0; max-width: 54ch; color: var(--text-muted); font-size: 16px; line-height: 1.6; }
.wrap[data-align='center'] .lead { margin-left: auto; margin-right: auto; }
```

- [ ] **Step 6: Implement `Stat.tsx` + `Stat.module.css`**

`Stat.tsx`:
```tsx
import styles from './Stat.module.css';
export function Stat({ value, label, onInk }: { value: string; label: string; onInk?: boolean }) {
  return (
    <div className={styles.stat} data-ink={onInk ? 'true' : undefined}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
```

`Stat.module.css`:
```css
.stat { font-family: var(--font-body); }
.value { font-family: var(--font-display); font-size: 44px; line-height: 1; color: var(--text-heading); text-transform: uppercase; }
.label { margin-top: 8px; font-size: 13px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--text-muted); }
.stat[data-ink='true'] .value { color: var(--text-on-ink); }
.stat[data-ink='true'] .label { color: var(--ink-300); }
```

- [ ] **Step 7: Run tests**

Run: `npm test -- display`
Expected: PASS (all 3).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Card, ServiceCard, SectionHeader, Stat components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: UI form components — Field/Input, Textarea, Select, Checkbox

**Files:**
- Create: `src/components/ui/Field.tsx` + `Field.module.css` (shared label/box + Input), `Textarea.tsx`, `Select.tsx`, `Checkbox.tsx` + `Checkbox.module.css`
- Test: `src/components/ui/__tests__/forms.test.tsx`

**Interfaces:**
- Produces:
  - `Field({ label?, error?, hint?, htmlFor?, children })` — label wrapper with error/hint text.
  - `Input({ label?, error?, hint?, ...input })`, `Textarea({ label?, error?, hint?, rows?, ...textarea })`, `Select({ label?, error?, hint?, options: string[], ...select })`, `Checkbox({ label, ...input })`. All forward `name`, `value`, `onChange`, `required`, `id`.
  - Shared class `styles.box` applies the design's field styling; error state via `data-error`.

- [ ] **Step 1: Write the failing test**

`src/components/ui/__tests__/forms.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Field';
import { Textarea } from '../Textarea';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';

describe('form fields', () => {
  it('Input associates its label and shows error', () => {
    render(<Input label="Telefon" name="phone" error="Zadejte telefon" />);
    expect(screen.getByLabelText('Telefon')).toBeInTheDocument();
    expect(screen.getByText('Zadejte telefon')).toBeInTheDocument();
  });
  it('Textarea renders with rows', () => {
    render(<Textarea label="Zpráva" name="msg" rows={5} />);
    expect(screen.getByLabelText('Zpráva')).toHaveAttribute('rows', '5');
  });
  it('Select renders its options', () => {
    render(<Select label="Typ" name="type" options={['Zemní práce', 'Stavební práce']} />);
    expect(screen.getByRole('option', { name: 'Zemní práce' })).toBeInTheDocument();
  });
  it('Checkbox renders a labelled checkbox', () => {
    render(<Checkbox label="Souhlasím" name="gdpr" />);
    expect(screen.getByRole('checkbox', { name: 'Souhlasím' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- forms`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `Field.tsx` + `Field.module.css`**

`Field.tsx`:
```tsx
import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Field.module.css';

export function Field({ label, error, hint, htmlFor, children }: { label?: string; error?: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

type InputProps = { label?: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;
export function Input({ label, error, hint, id, ...rest }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <input id={fieldId} className={styles.box} data-error={error ? 'true' : undefined} {...rest} />
    </Field>
  );
}
```
Note: `useId` requires this file be a client component only if consumed in one; it is fine in Server Components too (React 19 supports `useId` on the server). Keep it a plain module — the contact form (client) imports it.

`Field.module.css`:
```css
.field { display: block; }
.label { display: block; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-heading); margin-bottom: 8px; font-family: var(--font-body); }
.box { width: 100%; box-sizing: border-box; font-family: var(--font-body); font-size: 15px; color: var(--text-body); background: #fff; border: 1.5px solid var(--line-mid); border-radius: var(--radius-sm); padding: 13px 16px; outline: none; transition: border-color var(--dur-fast) var(--ease-out); }
.box:focus { border-color: var(--focus-ring); }
.box[data-error='true'] { border-color: var(--red-600); }
.error { display: block; margin-top: 6px; font-size: 13px; color: var(--red-600); }
.hint { display: block; margin-top: 6px; font-size: 13px; color: var(--text-faint); }
```

- [ ] **Step 4: Implement `Textarea.tsx`**

```tsx
import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { Field } from './Field';
import styles from './Field.module.css';

type Props = { label?: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ label, error, hint, id, rows = 4, ...rest }: Props) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <textarea id={fieldId} rows={rows} className={styles.box} data-error={error ? 'true' : undefined} style={{ resize: 'vertical' }} {...rest} />
    </Field>
  );
}
```

- [ ] **Step 5: Implement `Select.tsx`**

```tsx
import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { Field } from './Field';
import styles from './Field.module.css';

type Props = { label?: string; error?: string; hint?: string; options: string[] } & SelectHTMLAttributes<HTMLSelectElement>;
const CHEVRON = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23141210' stroke-width='2' fill='none'/%3E%3C/svg%3E\")";

export function Select({ label, error, hint, options, id, ...rest }: Props) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <select id={fieldId} className={styles.box} data-error={error ? 'true' : undefined}
        style={{ appearance: 'none', backgroundImage: CHEVRON, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }} {...rest}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}
```

- [ ] **Step 6: Implement `Checkbox.tsx` + `Checkbox.module.css`**

`Checkbox.tsx`:
```tsx
import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type Props = { label: string } & InputHTMLAttributes<HTMLInputElement>;
export function Checkbox({ label, className, ...rest }: Props) {
  return (
    <label className={styles.wrap}>
      <input type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden>
        <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" fill="none" /></svg>
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
}
```

`Checkbox.module.css`:
```css
.wrap { display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; font-family: var(--font-body); font-size: 14px; color: var(--text-body); }
.input { position: absolute; opacity: 0; width: 0; height: 0; }
.box { width: 20px; height: 20px; flex: none; border-radius: 5px; border: 1.5px solid var(--line-mid); background: #fff; display: flex; align-items: center; justify-content: center; transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); margin-top: 1px; }
.box svg { opacity: 0; }
.input:checked + .box { background: var(--brand); border-color: var(--brand); }
.input:checked + .box svg { opacity: 1; }
.input:focus-visible + .box { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.text { margin-top: 0; }
```

- [ ] **Step 7: Run tests**

Run: `npm test -- forms`
Expected: PASS (all 4).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Input, Textarea, Select, Checkbox form components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: Content data modules

**Files:**
- Create: `src/content/site.ts`, `src/content/services.ts`, `src/content/legal.ts`
- Test: `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces:
  - `site` — company facts, contact, nav array.
  - `services` — array of `Service` objects (slug, icon, title, tagline, intro, bullets, images, seo).
  - `getService(slug)` helper.
  - `legalPages` — `{ slug, title, updated, html }[]` for cookie + privacy pages.

- [ ] **Step 1: Write the failing test**

`src/content/__tests__/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { site, nav } from '../site';
import { services, getService } from '../services';

describe('site content', () => {
  it('uses the real contact facts', () => {
    expect(site.phone).toBe('+420 777 119 179');
    expect(site.email).toBe('info@stavbyprochazka.cz');
    expect(site.foundedYear).toBe(1988);
    expect(site.projectsDone).toBe('1 800+');
  });
  it('nav mirrors the old site routes', () => {
    expect(nav.map((n) => n.href)).toEqual(['/', '/stavebni-prace', '/zemni-prace', '/pronajem-kontejneru', '/kontakt']);
  });
});

describe('services', () => {
  it('has exactly the three real services', () => {
    expect(services.map((s) => s.slug)).toEqual(['stavebni-prace', 'zemni-prace', 'pronajem-kontejneru']);
  });
  it('each service has copy, at least one bullet and one image', () => {
    for (const s of services) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.intro.length).toBeGreaterThan(0);
      expect(s.bullets.length).toBeGreaterThan(0);
      expect(s.images.length).toBeGreaterThan(0);
    }
  });
  it('getService resolves by slug', () => {
    expect(getService('zemni-prace')?.title).toBe('Zemní práce');
    expect(getService('nope')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL.

- [ ] **Step 3: Implement `src/content/site.ts`**

```ts
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
```

- [ ] **Step 4: Implement `src/content/services.ts`** (real copy from the live service pages)

```ts
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
```

- [ ] **Step 5: Implement `src/content/legal.ts`**

The two legal pages are long, boilerplate GDPR/cookie text. Transcribe the live pages verbatim into HTML strings (headings + paragraphs). During implementation, fetch each URL and paste its body copy. Structure:

```ts
export type LegalPage = { slug: string; title: string; updated: string; html: string };

export const legalPages: LegalPage[] = [
  {
    slug: 'ochrana-osobnich-udaju',
    title: 'Ochrana osobních údajů',
    updated: '2025',
    html: `<p>Správcem osobních údajů je Stavební firma Procházka se sídlem v Chřibské…</p>
<!-- Transcribe full text verbatim from https://www.stavbyprochazka.cz/ochrana-osobnich-udaju/ -->`,
  },
  {
    slug: 'zasady-cookies',
    title: 'Zásady používání cookies',
    updated: '2025',
    html: `<p>Tento web používá soubory cookie…</p>
<!-- Transcribe full text verbatim from https://www.stavbyprochazka.cz/zasady-cookies-eu/ -->`,
  },
];

export function getLegal(slug: string) {
  return legalPages.find((p) => p.slug === slug);
}
```

Implementation note: replace the `<!-- Transcribe… -->` comments with the actual verbatim Czech legal text fetched from those URLs. This is mechanical transcription, not authored content — do it before marking the task done. The task is not complete while a placeholder comment remains.

- [ ] **Step 6: Run tests**

Run: `npm test -- content`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add site, services, and legal content modules

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: Layout — Wordmark, Photo, Nav, Footer, root layout

**Files:**
- Create: `src/components/layout/Wordmark.tsx` + `.module.css`, `Photo.tsx` + `.module.css`, `Nav.tsx` + `.module.css` (client), `Footer.tsx` + `.module.css`
- Modify: `src/app/layout.tsx` (mount Nav + Footer)
- Test: `src/components/layout/__tests__/layout.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 4), `Icon` (Task 4), `site`/`nav` (Task 7).
- Produces:
  - `Wordmark({ onInk? })` — "PROCHÁZKA." Anton + "Stavební a zemní práce" overline.
  - `Photo({ src, alt, className?, priority?, rounded?, aspect? })` — `next/image` in a rounded frame (32px); if `src` omitted, warm gradient placeholder.
  - `Nav()` — client component; desktop link row + phone + CTA; mobile hamburger toggling a panel. Uses `usePathname` for active state.
  - `Footer()` — ink footer with wordmark, quick links, contact.

- [ ] **Step 1: Write the failing test**

`src/components/layout/__tests__/layout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Nav } from '../Nav';
import { Footer } from '../Footer';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('Nav', () => {
  it('renders the primary links and phone', () => {
    render(<Nav />);
    expect(screen.getAllByRole('link', { name: 'Úvod' }).length).toBeGreaterThan(0);
    expect(screen.getByText('+420 777 119 179')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('shows contact email', () => {
    render(<Footer />);
    expect(screen.getByText('info@stavbyprochazka.cz')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- layout`
Expected: FAIL.

- [ ] **Step 3: Implement `Wordmark.tsx` + `.module.css`**

`Wordmark.tsx`:
```tsx
import { site } from '@/content/site';
import styles from './Wordmark.module.css';
export function Wordmark({ onInk }: { onInk?: boolean }) {
  return (
    <span className={styles.wrap} data-ink={onInk ? 'true' : undefined}>
      <span className={styles.name}>Procházka<span className={styles.dot}>.</span></span>
      <span className={styles.sub}>{site.tagline}</span>
    </span>
  );
}
```

`Wordmark.module.css`:
```css
.wrap { display: inline-block; line-height: 1; }
.name { display: block; font-family: var(--font-display); font-size: 22px; text-transform: uppercase; color: var(--ink-900); }
.dot { color: var(--brand); }
.sub { display: block; font-size: 9.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-top: 3px; }
.wrap[data-ink='true'] .name { color: #fff; }
.wrap[data-ink='true'] .sub { color: var(--ink-300); }
```

- [ ] **Step 4: Implement `Photo.tsx` + `.module.css`**

`Photo.tsx`:
```tsx
import Image from 'next/image';
import styles from './Photo.module.css';

type Props = { src?: string; alt: string; className?: string; priority?: boolean; rounded?: boolean; sizes?: string };
export function Photo({ src, alt, className, priority, rounded = true, sizes = '100vw' }: Props) {
  return (
    <div className={`${styles.frame}${rounded ? ` ${styles.rounded}` : ''}${className ? ` ${className}` : ''}`}>
      {src ? (
        <Image src={`/images/${src}`} alt={alt} fill sizes={sizes} priority={priority} className={styles.img} />
      ) : (
        <span className={styles.placeholder} aria-label={alt}>{alt}</span>
      )}
    </div>
  );
}
```

`Photo.module.css`:
```css
.frame { position: relative; overflow: hidden; background: linear-gradient(135deg, #6B5A47, #8A7358 55%, #A38B68); width: 100%; height: 100%; }
.rounded { border-radius: var(--radius-xl); }
.img { object-fit: cover; }
.placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.8); font-size: 12px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; text-align: center; padding: 16px; }
```

- [ ] **Step 5: Implement `Nav.tsx` + `.module.css`** (client, mobile toggle)

`Nav.tsx`:
```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Wordmark } from './Wordmark';
import { site, nav } from '@/content/site';
import styles from './Nav.module.css';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Procházka — domů"><Wordmark /></Link>
        <nav className={styles.links} aria-label="Hlavní navigace">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link} data-active={pathname === l.href ? 'true' : undefined}>{l.label}</Link>
          ))}
        </nav>
        <div className={styles.cta}>
          <a href={site.phoneHref} className={styles.phone}>{site.phone}</a>
          <Button href="/kontakt">Nezávazná poptávka</Button>
        </div>
        <button className={styles.burger} aria-label={open ? 'Zavřít menu' : 'Otevřít menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      {open && (
        <div className={styles.panel}>
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className={styles.panelLink} data-active={pathname === l.href ? 'true' : undefined} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <a href={site.phoneHref} className={styles.panelPhone}>{site.phone}</a>
        </div>
      )}
    </header>
  );
}
```

`Nav.module.css`:
```css
.header { border-bottom: 1px solid var(--line-soft); background: var(--surface-page); position: sticky; top: 0; z-index: 50; }
.bar { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; padding-bottom: 16px; gap: 24px; }
.brand { text-decoration: none; }
.links { display: flex; gap: 26px; align-items: center; }
.link { font-size: 13px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: var(--ink-900); border-bottom: 2px solid transparent; padding-bottom: 3px; }
.link:hover { color: var(--brand-hover); }
.link[data-active='true'] { color: var(--brand-hover); border-bottom-color: var(--brand); }
.cta { display: flex; gap: 14px; align-items: center; }
.phone { font-size: 14px; font-weight: 700; text-decoration: none; color: var(--ink-900); white-space: nowrap; }
.burger { display: none; background: none; border: none; cursor: pointer; color: var(--ink-900); padding: 4px; }
.panel { display: none; }
.panelLink { text-transform: uppercase; font-weight: 600; letter-spacing: .05em; font-size: 15px; text-decoration: none; color: var(--ink-900); padding: 12px 0; border-bottom: 1px solid var(--line-soft); }
.panelLink[data-active='true'] { color: var(--brand-hover); }
.panelPhone { font-weight: 700; padding-top: 14px; text-decoration: none; color: var(--ink-900); }

@media (max-width: 960px) {
  .links, .cta { display: none; }
  .burger { display: inline-flex; }
  .panel { display: flex; flex-direction: column; padding: 8px var(--container-pad) 24px; }
}
```

- [ ] **Step 6: Implement `Footer.tsx` + `.module.css`**

`Footer.tsx`:
```tsx
import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { site, nav } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Wordmark onInk />
          <p className={styles.blurb}>Jsme tým, který dělá svou práci srdcem. {site.values}</p>
        </div>
        <div>
          <div className={styles.head}>Rychlé odkazy</div>
          <div className={styles.col}>
            {nav.map((l) => <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>)}
          </div>
        </div>
        <div>
          <div className={styles.head}>Kontakt</div>
          <div className={styles.col}>
            <a href={site.phoneHref} className={styles.link}>{site.phone}</a>
            <a href={`mailto:${site.email}`} className={styles.link}>{site.email}</a>
            <span className={styles.muted}>{site.region}</span>
          </div>
        </div>
      </div>
      <div className={styles.baseline}>
        <div className={`container ${styles.baselineInner}`}>© {site.foundedYear ? new Date().getFullYear() : ''} Procházka — stavební a zemní práce</div>
      </div>
    </footer>
  );
}
```
Note: `new Date().getFullYear()` runs at build time (static render) — the copyright year is baked at build. Acceptable for a marketing site.

`Footer.module.css`:
```css
.footer { background: var(--surface-ink); color: var(--text-on-ink); margin-top: 96px; }
.grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-top: 64px; padding-bottom: 40px; }
.blurb { color: var(--ink-300); font-size: 14.5px; max-width: 38ch; margin-top: 16px; }
.head { font-size: 12px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-300); margin-bottom: 14px; }
.col { display: flex; flex-direction: column; gap: 10px; }
.link { color: #fff; text-decoration: none; font-size: 14.5px; }
.link:hover { color: var(--orange-300); }
.muted { color: var(--ink-300); font-size: 14.5px; }
.baseline { border-top: 1px solid var(--ink-700); }
.baselineInner { padding-top: 18px; padding-bottom: 18px; font-size: 12.5px; color: var(--ink-300); }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; gap: 32px; } }
```

- [ ] **Step 7: Mount Nav + Footer in `src/app/layout.tsx`**

Add imports and wrap children:
```tsx
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
// …inside <body>:
//   <Nav />
//   {children}
//   <Footer />
```
Replace `<body>{children}</body>` with `<body><Nav />{children}<Footer /></body>`.

- [ ] **Step 8: Run tests + build**

Run: `npm test -- layout`
Expected: PASS.
Run: `npm run build`
Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Nav, Footer, Wordmark, Photo layout components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: Home page

**Files:**
- Create: `src/app/page.tsx` (replace placeholder) + `src/app/home.module.css`
- Test: `src/app/__tests__/home.test.tsx`

**Interfaces:**
- Consumes: `Button`, `SectionHeader`, `ServiceCard`, `Stat`, `Photo`, `site`, `services`.
- Produces: the `/` route — hero sheet over photo → "jak pracujeme" → 3 service cards → ink stats band.

- [ ] **Step 1: Write the failing test**

`src/app/__tests__/home.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('Home', () => {
  it('renders the real hero headline and the three services', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: /Po nás zůstane jen dobře odvedená práce/i })).toBeInTheDocument();
    expect(screen.getByText('Zemní práce')).toBeInTheDocument();
    expect(screen.getByText('Stavební práce')).toBeInTheDocument();
    expect(screen.getByText('Pronájem kontejneru')).toBeInTheDocument();
  });
  it('shows the real stats', () => {
    render(<Home />);
    expect(screen.getByText('1 800+')).toBeInTheDocument();
    expect(screen.getByText(/1988/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- home`
Expected: FAIL.

- [ ] **Step 3: Implement `src/app/page.tsx`**

```tsx
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Stat } from '@/components/ui/Stat';
import { Photo } from '@/components/layout/Photo';
import { site } from '@/content/site';
import { services } from '@/content/services';
import styles from './home.module.css';

export default function Home() {
  return (
    <main>
      <section className={`container ${styles.heroWrap}`}>
        <div className={styles.heroSheet}>
          <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
          <p className={styles.heroLead}>{site.heroLead}</p>
          <div className={styles.heroActions}>
            <Button href="/kontakt" size="lg">Nezávazná poptávka</Button>
            <Button href="/stavebni-prace" size="lg" variant="secondary">Naše služby</Button>
          </div>
        </div>
        <div className={styles.heroPhoto}>
          <Photo src="stavebni-hero.jpg" alt="Tým Procházka při stavebních pracích" priority rounded={false} sizes="(max-width: 1200px) 100vw, 1200px" />
        </div>
      </section>

      <section className={`container ${styles.how}`}>
        <SectionHeader overline="Jak pracujeme" title={<>Dělat věci pořádně.<br />Od začátku.</>} />
        <p className={styles.howBody}>
          Od prvního telefonátu po předání hotové práce jednáme na rovinu. Řekneme vám, co je potřeba, kolik to bude stát a kdy to bude hotové. {site.values}
        </p>
      </section>

      <section className={`container ${styles.services}`}>
        <div className={styles.serviceGrid}>
          {services.map((s) => (
            <ServiceCard key={s.slug} icon={s.icon} title={s.title} href={`/${s.slug}`}>{s.tagline}</ServiceCard>
          ))}
        </div>
        <div className={styles.servicesCta}><Button href="/kontakt" variant="ghost">Nezávazná poptávka</Button></div>
      </section>

      <section className={`container ${styles.statsWrap}`}>
        <div className={styles.statsBand}>
          <div className={styles.statsLead}>
            <h2 className={styles.statsTitle}>Rádi se k nám vracíte</h2>
            <p className={styles.statsText}>Většina zakázek k nám přichází na doporučení. To je pro nás největší pochvala.</p>
          </div>
          <div className={styles.statsFigures}>
            <Stat onInk value={`od ${site.foundedYear}`} label="rok založení" />
            <Stat onInk value={site.projectsDone} label="realizací" />
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Implement `src/app/home.module.css`**

```css
.heroWrap { padding-top: 8px; }
.heroSheet { background: #fff; border-radius: var(--radius-xl) var(--radius-xl) 0 0; text-align: center; padding: 56px 24px 40px; }
.heroTitle { font-size: var(--display-xl); max-width: 900px; margin: 0 auto; }
.heroLead { max-width: 52ch; margin: 24px auto 0; font-size: var(--text-lg); color: var(--text-muted); }
.heroActions { display: flex; gap: 14px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
.heroPhoto { position: relative; height: 420px; border-radius: 0 0 var(--radius-xl) var(--radius-xl); overflow: hidden; }

.how { padding-top: 96px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: start; }
.howBody { margin: 6px 0 0; color: var(--text-muted); font-size: 16.5px; line-height: 1.65; }

.services { padding-top: 72px; }
.serviceGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.servicesCta { text-align: center; margin-top: 28px; }

.statsWrap { margin-top: 96px; }
.statsBand { background: var(--surface-ink); border-radius: var(--radius-xl); padding: 56px 64px; display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
.statsLead { max-width: 420px; }
.statsTitle { color: var(--text-on-ink); font-size: var(--display-md); }
.statsText { color: var(--ink-300); margin-top: 14px; margin-bottom: 0; }
.statsFigures { display: flex; gap: 56px; }

@media (max-width: 900px) {
  .how { grid-template-columns: 1fr; gap: 24px; padding-top: 72px; }
  .serviceGrid { grid-template-columns: 1fr; }
  .heroPhoto { height: 280px; }
  .statsBand { padding: 40px 28px; }
}
```

- [ ] **Step 5: Run tests + build**

Run: `npm test -- home`
Expected: PASS.
Run: `npm run build`
Expected: `/` prerendered static.

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`. Verify against the design's Home screen: hero sheet over photo, orange square markers, service cards, ink stats band. Confirm Czech diacritics render (fonts loaded).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: build home page

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 10: Service page template + three service routes

**Files:**
- Create: `src/components/layout/ServicePage.tsx` + `.module.css`
- Create: `src/app/stavebni-prace/page.tsx`, `src/app/zemni-prace/page.tsx`, `src/app/pronajem-kontejneru/page.tsx`
- Test: `src/components/layout/__tests__/servicePage.test.tsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Button`, `Photo`, `Icon`, `Badge`, `Service` (Task 7).
- Produces: `ServicePage({ service })` — hero (overline=tagline, title, intro on white sheet + hero photo), a "what we do" bullet list, a photo gallery grid, and a CTA band. Each route file renders it + exports `metadata`.

- [ ] **Step 1: Write the failing test**

`src/components/layout/__tests__/servicePage.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServicePage } from '../ServicePage';
import { getService } from '@/content/services';

describe('ServicePage', () => {
  it('renders the service title, intro, and every bullet', () => {
    const s = getService('zemni-prace')!;
    render(<ServicePage service={s} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Zemní práce' })).toBeInTheDocument();
    for (const b of s.bullets) expect(screen.getByText(b)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- servicePage`
Expected: FAIL.

- [ ] **Step 3: Implement `ServicePage.tsx`**

```tsx
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Photo } from './Photo';
import { site } from '@/content/site';
import type { Service } from '@/content/services';
import styles from './ServicePage.module.css';

export function ServicePage({ service }: { service: Service }) {
  const [hero, ...gallery] = service.images;
  return (
    <main>
      <section className={`container ${styles.heroWrap}`}>
        <div className={styles.heroSheet}>
          <div className={styles.overline}><span className={styles.marker} />{service.tagline}</div>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.intro}>{service.intro}</p>
          <div className={styles.actions}>
            <Button href="/kontakt" size="lg">Nezávazná poptávka</Button>
            <a href={site.phoneHref} className={styles.phone}><Icon name="call" size={18} />{site.phone}</a>
          </div>
        </div>
        <div className={styles.heroPhoto}><Photo src={hero} alt={`${service.title} — ukázka realizace`} priority rounded={false} sizes="(max-width: 1200px) 100vw, 1200px" /></div>
      </section>

      <section className={`container ${styles.body}`}>
        <div className={styles.bulletsHead}><span className={styles.marker} />{service.bulletsHeading}</div>
        <ul className={styles.bullets}>
          {service.bullets.map((b) => (
            <li key={b} className={styles.bullet}><Icon name="check" size={20} className={styles.check} /><span>{b}</span></li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 && (
        <section className={`container ${styles.gallery}`}>
          {gallery.map((img, i) => (
            <div key={img} className={styles.galleryItem}><Photo src={img} alt={`${service.title} — realizace ${i + 1}`} sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 380px" /></div>
          ))}
        </section>
      )}

      <section className={`container ${styles.ctaWrap}`}>
        <div className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>Chcete podobnou realizaci?</h2>
          <Button href="/kontakt" variant="ink" size="lg">Napište nám poptávku</Button>
        </div>
      </section>
    </main>
  );
}
```
Note: fix the heading typo — use "Chcete podobnou realizaci?" (correct Czech). (Written correctly in the actual file.)

- [ ] **Step 4: Implement `ServicePage.module.css`**

```css
.heroWrap { padding-top: 8px; }
.heroSheet { background: #fff; border-radius: var(--radius-xl) var(--radius-xl) 0 0; padding: 56px 40px 40px; max-width: 780px; }
.overline { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-heading); margin-bottom: 16px; }
.marker { width: 8px; height: 8px; background: var(--brand); flex: none; display: inline-block; }
.title { font-size: var(--display-lg); }
.intro { max-width: 60ch; margin: 20px 0 0; font-size: var(--text-lg); color: var(--text-muted); line-height: 1.55; }
.actions { display: flex; gap: 20px; align-items: center; margin-top: 32px; flex-wrap: wrap; }
.phone { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; text-decoration: none; color: var(--ink-900); }
.heroPhoto { position: relative; height: 440px; border-radius: 0 0 var(--radius-xl) var(--radius-xl); overflow: hidden; }

.body { padding-top: 96px; }
.bulletsHead { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; margin-bottom: 28px; }
.bullets { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px 40px; }
.bullet { display: flex; align-items: flex-start; gap: 12px; font-size: 16.5px; color: var(--text-body); line-height: 1.5; }
.check { color: var(--brand); flex: none; margin-top: 1px; }

.gallery { padding-top: 72px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.galleryItem { position: relative; aspect-ratio: 4 / 3; border-radius: var(--radius-lg); overflow: hidden; }

.ctaWrap { margin-top: 96px; }
.ctaBand { background: var(--surface-section); border: 1px solid var(--line-soft); border-radius: var(--radius-xl); padding: 56px 48px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.ctaTitle { font-size: var(--display-md); }

@media (max-width: 900px) {
  .heroSheet { padding: 40px 24px 32px; }
  .heroPhoto { height: 280px; }
  .body { padding-top: 64px; }
  .bullets { grid-template-columns: 1fr; }
  .gallery { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) { .gallery { grid-template-columns: 1fr; } }
```

- [ ] **Step 5: Implement the three route files**

`src/app/stavebni-prace/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { ServicePage } from '@/components/layout/ServicePage';
import { getService } from '@/content/services';

const service = getService('stavebni-prace')!;
export const metadata: Metadata = { title: service.title, description: service.seoDescription };
export default function Page() { return <ServicePage service={service} />; }
```

`src/app/zemni-prace/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { ServicePage } from '@/components/layout/ServicePage';
import { getService } from '@/content/services';

const service = getService('zemni-prace')!;
export const metadata: Metadata = { title: service.title, description: service.seoDescription };
export default function Page() { return <ServicePage service={service} />; }
```

`src/app/pronajem-kontejneru/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { ServicePage } from '@/components/layout/ServicePage';
import { getService } from '@/content/services';

const service = getService('pronajem-kontejneru')!;
export const metadata: Metadata = { title: service.title, description: service.seoDescription };
export default function Page() { return <ServicePage service={service} />; }
```

Note: the container page also has process steps (`containerExtras`). For this scope the shared `ServicePage` covers all three uniformly; the process steps are optional enrichment. If time allows, render `containerExtras.steps` as a numbered strip above the CTA on the container route only — but the base plan ships all three identically. (Do NOT block the task on the enrichment.)

- [ ] **Step 6: Run tests + build**

Run: `npm test -- servicePage`
Expected: PASS.
Run: `npm run build`
Expected: all three service routes prerendered static.

- [ ] **Step 7: Manual check** — open each route in dev, confirm hero photo, bullets with orange checks, gallery grid, correct Czech copy.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add service page template and three service routes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 11: Contact page + form + API route

**Files:**
- Create: `src/components/layout/ContactForm.tsx` (client) + `.module.css`, `src/lib/validatePoptavka.ts`
- Create: `src/app/kontakt/page.tsx` + `kontakt.module.css`, `src/app/api/poptavka/route.ts`
- Test: `src/lib/__tests__/validatePoptavka.test.ts`, `src/components/layout/__tests__/contactForm.test.tsx`

**Interfaces:**
- Produces:
  - `validatePoptavka(data: PoptavkaInput): { ok: boolean; errors: Partial<Record<keyof PoptavkaInput, string>> }` — pure function.
  - `PoptavkaInput = { name: string; phone: string; email?: string; type: string; message: string; gdpr: boolean }`.
  - `ContactForm()` — client form using UI fields, calls `validatePoptavka`, POSTs to `/api/poptavka`, shows success state.
  - `POST /api/poptavka` — validates server-side, returns `{ ok: true }` (email integration point stubbed).

- [ ] **Step 1: Write the failing validation test**

`src/lib/__tests__/validatePoptavka.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validatePoptavka } from '../validatePoptavka';

const base = { name: 'Jan Novák', phone: '777119179', email: '', type: 'Zemní práce', message: 'Potřebuji výkop.', gdpr: true };

describe('validatePoptavka', () => {
  it('accepts a valid submission (email optional)', () => {
    expect(validatePoptavka(base).ok).toBe(true);
  });
  it('requires name, phone, message and gdpr consent', () => {
    const r = validatePoptavka({ ...base, name: '', phone: '', message: '', gdpr: false });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.phone).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
    expect(r.errors.gdpr).toBeTruthy();
  });
  it('rejects a malformed email when provided', () => {
    const r = validatePoptavka({ ...base, email: 'not-an-email' });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- validatePoptavka`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/validatePoptavka.ts`**

```ts
export type PoptavkaInput = { name: string; phone: string; email?: string; type: string; message: string; gdpr: boolean };
export type PoptavkaErrors = Partial<Record<keyof PoptavkaInput, string>>;

export function validatePoptavka(data: PoptavkaInput): { ok: boolean; errors: PoptavkaErrors } {
  const errors: PoptavkaErrors = {};
  if (!data.name?.trim()) errors.name = 'Zadejte prosím jméno.';
  if (!data.phone?.trim()) errors.phone = 'Zadejte prosím telefon.';
  if (!data.message?.trim()) errors.message = 'Napište prosím, co potřebujete.';
  if (!data.gdpr) errors.gdpr = 'Bez souhlasu vás bohužel nemůžeme kontaktovat.';
  if (data.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'E-mail nemá správný tvar.';
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run validation test**

Run: `npm test -- validatePoptavka`
Expected: PASS.

- [ ] **Step 5: Implement `POST /api/poptavka` route**

`src/app/api/poptavka/route.ts`:
```ts
import { NextResponse } from 'next/server';
import { validatePoptavka, type PoptavkaInput } from '@/lib/validatePoptavka';

export async function POST(req: Request) {
  let data: PoptavkaInput;
  try {
    data = (await req.json()) as PoptavkaInput;
  } catch {
    return NextResponse.json({ ok: false, errors: { message: 'Neplatná data.' } }, { status: 400 });
  }
  const { ok, errors } = validatePoptavka(data);
  if (!ok) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // --- EMAIL INTEGRATION POINT ---------------------------------------------
  // Wire an email provider here (e.g. Resend) when a key is available:
  //   await resend.emails.send({ to: 'info@stavbyprochazka.cz', subject: `Nová poptávka: ${data.type}`, text: ... });
  // For now we log and acknowledge — no keys required.
  console.log('[poptávka]', { name: data.name, phone: data.phone, type: data.type });
  // -------------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
```
Note: this route makes the app require the Node runtime for `/api/poptavka` only; all page routes remain static.

- [ ] **Step 6: Write the failing ContactForm test**

`src/components/layout/__tests__/contactForm.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactForm } from '../ContactForm';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) })) as unknown as typeof fetch);
});

describe('ContactForm', () => {
  it('shows validation errors on empty submit and does not call fetch', async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(screen.getByText('Zadejte prosím jméno.')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('submits valid data and shows the success state', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText('Jméno a příjmení'), 'Jan Novák');
    await userEvent.type(screen.getByLabelText('Telefon'), '777119179');
    await userEvent.type(screen.getByLabelText('Popis zakázky'), 'Potřebuji výkop základů.');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: /odeslat poptávku/i }));
    expect(await screen.findByText(/Děkujeme/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/poptavka', expect.objectContaining({ method: 'POST' }));
  });
});
```

Add `@testing-library/user-event` to devDependencies (`^14.5.2`) — install before running.

- [ ] **Step 7: Run test to verify it fails**

Run: `npm install -D @testing-library/user-event@^14.5.2 && npm test -- contactForm`
Expected: FAIL (module not found).

- [ ] **Step 8: Implement `ContactForm.tsx` + `.module.css`**

`ContactForm.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { validatePoptavka, type PoptavkaErrors } from '@/lib/validatePoptavka';
import styles from './ContactForm.module.css';

const TYPES = ['Zemní práce', 'Stavební práce', 'Pronájem kontejneru', 'Jiné'];

export function ContactForm() {
  const [errors, setErrors] = useState<PoptavkaErrors>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get('name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
      type: String(fd.get('type') ?? TYPES[0]),
      message: String(fd.get('message') ?? ''),
      gdpr: fd.get('gdpr') === 'on',
    };
    const { ok, errors } = validatePoptavka(data);
    setErrors(errors);
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch('/api/poptavka', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) setSent(true);
      else setErrors({ message: 'Něco se nepovedlo. Zkuste to prosím znovu, nebo nám zavolejte.' });
    } catch {
      setErrors({ message: 'Odeslání selhalo. Zavolejte nám prosím na uvedené číslo.' });
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <h3 className={styles.successTitle}>Děkujeme!</h3>
        <p className={styles.successText}>Poptávku máme. Ozveme se vám nejpozději druhý pracovní den.</p>
        <Button variant="secondary" onClick={() => setSent(false)}>Poslat další poptávku</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form}>
      <Input label="Jméno a příjmení" name="name" placeholder="Jan Novák" error={errors.name} />
      <Input label="Telefon" name="phone" placeholder="+420 …" error={errors.phone} />
      <div className={styles.full}><Input label="E-mail (nepovinné)" name="email" type="email" placeholder="vas@email.cz" error={errors.email} /></div>
      <div className={styles.full}><Select label="Typ práce" name="type" options={TYPES} /></div>
      <div className={styles.full}><Textarea label="Popis zakázky" name="message" rows={4} placeholder="Co potřebujete postavit nebo vykopat?" error={errors.message} /></div>
      <div className={styles.full}><Checkbox label="Souhlasím se zpracováním osobních údajů" name="gdpr" />{errors.gdpr && <span className={styles.err}>{errors.gdpr}</span>}</div>
      <div className={styles.full}><Button size="lg" type="submit" disabled={busy} className={styles.submit}>{busy ? 'Odesílám…' : 'Odeslat poptávku'}</Button></div>
    </form>
  );
}
```

`ContactForm.module.css`:
```css
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.full { grid-column: 1 / -1; }
.submit { width: 100%; }
.err { display: block; margin-top: 6px; font-size: 13px; color: var(--red-600); }
.success { text-align: center; padding: 48px 16px; }
.successTitle { font-size: 28px; }
.successText { color: var(--text-muted); margin: 12px 0 24px; }
@media (max-width: 560px) { .form { grid-template-columns: 1fr; } }
```

- [ ] **Step 9: Implement `src/app/kontakt/page.tsx` + `kontakt.module.css`**

`src/app/kontakt/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/layout/ContactForm';
import { site } from '@/content/site';
import styles from './kontakt.module.css';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Napište nebo zavolejte — ozveme se vám nejpozději druhý pracovní den. Telefon +420 777 119 179.',
};

export default function Page() {
  return (
    <main className={`container ${styles.wrap}`}>
      <div className={styles.info}>
        <SectionHeader overline="Kontakt" title="Ozvěte se nám" lead={`Napište nebo zavolejte. ${site.responsePromise}`} />
        <div className={styles.details}>
          <a className={styles.row} href={site.phoneHref}><Icon name="call" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>Telefon</span><strong>{site.phone}</strong></span></a>
          <a className={styles.row} href={`mailto:${site.email}`}><Icon name="mail" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>E-mail</span><strong>{site.email}</strong></span></a>
          <div className={styles.row}><Icon name="place" size={22} className={styles.rowIcon} /><span><span className={styles.rowLabel}>Působíme</span><strong>{site.region}</strong></span></div>
        </div>
      </div>
      <Card padding={32}><ContactForm /></Card>
    </main>
  );
}
```

`src/app/kontakt/kontakt.module.css`:
```css
.wrap { padding-top: 40px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; align-items: start; }
.info { padding-top: 8px; }
.details { display: flex; flex-direction: column; gap: 18px; margin-top: 36px; }
.row { display: flex; gap: 14px; align-items: center; text-decoration: none; color: var(--ink-900); }
.rowIcon { color: var(--brand); flex: none; }
.rowLabel { display: block; font-size: 12px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
@media (max-width: 860px) { .wrap { grid-template-columns: 1fr; gap: 32px; } }
```

- [ ] **Step 10: Run all form tests + build**

Run: `npm test -- validatePoptavka contactForm`
Expected: PASS.
Run: `npm run build`
Expected: `/kontakt` static; `/api/poptavka` as a route handler.

- [ ] **Step 11: Manual check** — submit empty (see errors), submit valid (see success). Verify phone/email links work.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add contact page, poptávka form, and API route

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 12: Legal pages, 404, sitemap, robots

**Files:**
- Create: `src/app/zasady-cookies/page.tsx`, `src/app/ochrana-osobnich-udaju/page.tsx`, `src/app/legal.module.css`
- Create: `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `src/app/__tests__/legal.test.tsx`

**Interfaces:**
- Consumes: `getLegal`/`legalPages` (Task 7), `nav`, `site`.
- Produces: two static legal routes, a styled 404, `sitemap.xml`, `robots.txt`.

- [ ] **Step 1: Write the failing test**

`src/app/__tests__/legal.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CookiesPage from '../zasady-cookies/page';
import PrivacyPage from '../ochrana-osobnich-udaju/page';

describe('legal pages', () => {
  it('renders cookie policy heading', () => {
    render(<CookiesPage />);
    expect(screen.getByRole('heading', { level: 1, name: /cookies/i })).toBeInTheDocument();
  });
  it('renders privacy heading', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { level: 1, name: /osobních údajů/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- legal`
Expected: FAIL.

- [ ] **Step 3: Implement the legal route pages**

`src/app/ochrana-osobnich-udaju/page.tsx`:
```tsx
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
```

`src/app/zasady-cookies/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { getLegal } from '@/content/legal';
import styles from '../legal.module.css';

const page = getLegal('zasady-cookies')!;
export const metadata: Metadata = { title: page.title, robots: { index: false } };

export default function Page() {
  return (
    <main className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>{page.title}</h1>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}
```
Note: `dangerouslySetInnerHTML` is safe here — content is our own verbatim transcription committed in `legal.ts`, not user input.

`src/app/legal.module.css`:
```css
.wrap { padding-top: 56px; max-width: 760px; }
.title { font-size: var(--display-md); margin-bottom: 32px; }
.body { color: var(--text-body); font-size: 16px; line-height: 1.7; }
.body :global(h2) { font-family: var(--font-display); text-transform: uppercase; font-size: 22px; margin: 32px 0 12px; }
.body :global(p) { margin: 0 0 16px; }
.body :global(a) { color: var(--brand-hover); }
```

- [ ] **Step 4: Implement `not-found.tsx`**

```tsx
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--display-lg)' }}>Stránka nenalezena</h1>
      <p style={{ color: 'var(--text-muted)', margin: '16px auto 32px', maxWidth: '46ch' }}>
        Tuto stránku se nám nepodařilo najít. Vraťte se prosím na úvod, nebo nám rovnou napište poptávku.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button href="/" size="lg">Zpět na úvod</Button>
        <Button href="/kontakt" size="lg" variant="secondary">Kontakt</Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Implement `sitemap.ts` + `robots.ts`**

`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
import { nav } from '@/content/site';
import { legalPages } from '@/content/legal';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...nav.map((n) => n.href), ...legalPages.map((p) => `/${p.slug}`)];
  return routes.map((path) => ({ url: `${site.domain}${path === '/' ? '' : path}`, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}
```

`src/app/robots.ts`:
```ts
import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/zasady-cookies', '/ochrana-osobnich-udaju'] }, sitemap: `${site.domain}/sitemap.xml` };
}
```

- [ ] **Step 6: Run tests + build**

Run: `npm test -- legal`
Expected: PASS.
Run: `npm run build`
Expected: legal routes + `/sitemap.xml` + `/robots.txt` generated; 404 built.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add legal pages, 404, sitemap, and robots

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 13: Final verification + private GitHub repo

**Files:** none (repo + verification).

**Interfaces:** consumes the whole app.

- [ ] **Step 1: Full test + lint + build**

Run: `npm test`
Expected: all suites pass.
Run: `npm run lint`
Expected: no errors.
Run: `npm run build`
Expected: build succeeds; the route table shows `/`, `/stavebni-prace`, `/zemni-prace`, `/pronajem-kontejneru`, `/kontakt`, `/zasady-cookies`, `/ochrana-osobnich-udaju` as **static** (○ / ●), `/api/poptavka` as a function (ƒ), plus `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 2: Add a README**

Create `README.md`:
```markdown
# Procházka — stavební a zemní práce

Marketing web pro stavební firmu Procházka. Next.js 15 (App Router), plně statický render, design systém „Procházka".

## Vývoj
    npm install
    ./scripts/fetch-images.sh   # stáhne fotky z původního webu do public/images
    npm run dev

## Skripty
- `npm run dev` — vývojový server
- `npm run build` / `npm start` — produkční build
- `npm test` — testy (Vitest)

## Kontaktní formulář
`POST /api/poptavka` je připraven na napojení e-mailu (Resend apod.) — viz komentář „EMAIL INTEGRATION POINT" v `src/app/api/poptavka/route.ts`.
```

- [ ] **Step 3: Commit the README**

```bash
git add -A
git commit -m "docs: add project README

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Create the private GitHub repo and push**

Run:
```bash
gh repo create prochazka-construction --private --source=. --remote=origin --description "Marketing web pro stavební firmu Procházka (Next.js)" --push
```
Expected: repo created under the authenticated account (`Honzeenek`), `main` pushed.

- [ ] **Step 5: Verify remote**

Run: `gh repo view --web` (or `git remote -v && git log --oneline -1`)
Expected: private repo exists with all commits.

- [ ] **Step 6: Final manual pass**

Run `npm run dev` and click through all routes on desktop and a narrow viewport (~375px): Nav hamburger opens/closes, hero photos load, service galleries render, contact form validates and succeeds, footer links work, 404 shows for a bad URL. Confirm no console errors and Czech diacritics everywhere.

---

## Self-Review

**Spec coverage:**
- Stack (Next 15/React 19/TS/static) → Tasks 1, 2. ✓
- Tokens ported verbatim → Task 2. ✓
- Fonts (Anton, Hanken, Material Symbols, latin-ext) → Task 2. ✓
- All 11 design-system components + layout pieces → Tasks 4, 5, 6, 8. ✓
- Routes mirror old site (5 pages + 2 legal) → Tasks 9, 10, 11, 12. ✓
- Real content/facts (1988, 1 800+, phone, email, Chřibská, 3 real services) → Task 7, used in 9–11. ✓
- Real photos downloaded → Task 3. ✓
- Two-stat ink band (no invented third stat) → Task 9. ✓
- Typographic wordmark, not raster logo → Task 8. ✓
- Contact form: validated, success state, stubbed API, tel/mailto fallback → Task 11. ✓
- Performance (static, minimal client JS, next/font, next/image) → Tasks 2, 8–12. ✓
- SEO metadata, sitemap, robots → Tasks 2, 10, 11, 12. ✓
- Private GitHub repo → Task 13. ✓
- Out of scope items (no CMS/blog/i18n/analytics/live email/dark mode) → respected. ✓

**Placeholder scan:** The only intentional "transcribe later" markers are the legal-page bodies in Task 7 — flagged explicitly as mechanical verbatim transcription that must be completed before the task closes (not authored content). All component/page code is complete. One in-code typo callout: `ServicePage` CTA heading must read "Chcete podobnou realizaci?" (corrected in Step 3 note).

**Type consistency:** `PoptavkaInput`/`PoptavkaErrors` shared between `validatePoptavka`, the API route, and `ContactForm`. `Service` type shared across `services.ts`, `ServicePage`, and route files. `getService`/`getLegal` signatures consistent. Component prop names match their tests.
