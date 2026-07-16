import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/zasady-cookies', '/ochrana-osobnich-udaju'] }, sitemap: `${site.domain}/sitemap.xml` };
}
