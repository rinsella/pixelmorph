import { getPublicOrigin } from '@/lib/origin';

// Force dynamic rendering so the sitemap reflects the actual request host
// (Codespaces preview, Railway, custom domain, etc.).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/converter', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/supported-formats', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' }
];

export default function sitemap() {
  const origin = getPublicOrigin();
  const now = new Date();
  return PAGES.map((p) => ({
    url: `${origin}${p.path === '/' ? '' : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority
  }));
}
