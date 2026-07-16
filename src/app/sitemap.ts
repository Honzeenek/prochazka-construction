import type { MetadataRoute } from 'next';
import { nav, site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = nav.map((n) => n.href);
  return routes.map((path) => ({ url: `${site.domain}${path === '/' ? '' : path}`, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}
