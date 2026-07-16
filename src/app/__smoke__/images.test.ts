import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';

describe('images', () => {
  const required = ['logo.png', 'zemni-01.jpg', 'zemni-hero-a.jpg', 'stavebni-01.jpg', 'stavebni-hero.jpg', 'kontejner-01.jpg'];
  it.each(required)('has public/images/%s', (f) => {
    expect(existsSync(`public/images/${f}`)).toBe(true);
  });
});
