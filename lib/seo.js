const {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE
} = require('./site');

/**
 * Build a Next.js Metadata object with sane SEO defaults.
 *
 * @param {object} opts
 * @param {string} opts.title - page title (will be templated with site name)
 * @param {string} [opts.description]
 * @param {string} [opts.path] - canonical path, e.g. "/converter"
 * @param {string[]} [opts.keywords]
 * @param {boolean} [opts.noindex]
 */
function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  keywords = [],
  noindex = false
} = {}) {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: `${SITE_URL}/og.svg`,
          width: 1200,
          height: 630,
          alt: SITE_NAME
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: TWITTER_HANDLE,
      images: [`${SITE_URL}/og.svg`]
    }
  };
}

module.exports = { buildMetadata };
