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
