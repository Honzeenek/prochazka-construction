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
