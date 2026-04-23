import { headers } from 'next/headers';
import { SITE_URL } from '@/lib/site';

/**
 * Resolve the public origin from the incoming request, falling back to
 * NEXT_PUBLIC_SITE_URL. This lets the sitemap/robots respond with the
 * correct domain on Codespaces, Railway, custom domains, etc., without
 * needing a hard-coded URL.
 */
export function getPublicOrigin() {
  try {
    const h = headers();
    const forwardedHost = h.get('x-forwarded-host') || h.get('host');
    const forwardedProto = h.get('x-forwarded-proto') || 'https';
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
    }
  } catch {
    // headers() can throw outside a request scope (e.g. at build time)
  }
  return SITE_URL.replace(/\/$/, '');
}
