import type { MetadataRoute } from 'next';
import { nav } from '@/content/site';
import { legalPages } from '@/content/legal';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...nav.map((n) => n.href), ...legalPages.map((p) => `/${p.slug}`)];
  return routes.map((path) => ({ url: `${site.domain}${path === '/' ? '' : path}`, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}
