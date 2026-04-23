import { getPublicOrigin } from '@/lib/origin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function robots() {
  const origin = getPublicOrigin();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      }
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin
  };
}
