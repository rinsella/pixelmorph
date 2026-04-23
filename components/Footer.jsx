import Link from 'next/link';

const COLS = [
  {
    title: 'Product',
    links: [
      { href: '/converter', label: 'Image Converter' },
      { href: '/features', label: 'Features' },
      { href: '/supported-formats', label: 'Supported Formats' },
      { href: '/faq', label: 'FAQ' }
    ]
  },
  {
    title: 'Popular Conversions',
    links: [
      { href: '/supported-formats#heic-to-jpg', label: 'HEIC to JPG' },
      { href: '/supported-formats#heic-to-png', label: 'HEIC to PNG' },
      { href: '/supported-formats#jpg-to-png', label: 'JPG to PNG' },
      { href: '/supported-formats#png-to-webp', label: 'PNG to WEBP' },
      { href: '/supported-formats#webp-to-jpg', label: 'WEBP to JPG' }
    ]
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/60 mt-16">
      <div className="container-tight py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-ink-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7l4-3 4 3 4-3 4 3v10l-4 3-4-3-4 3-4-3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            PixelMorph
          </Link>
          <p className="mt-3 text-sm text-ink-500 max-w-xs">
            The fast, secure online image converter. HEIC, JPG, PNG, and WEBP, in your browser.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink-900">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-500 hover:text-ink-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100">
        <div className="container-tight py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-500">
          <p>© {new Date().getFullYear()} PixelMorph. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Fast</span>
            <span aria-hidden>•</span>
            <span>Secure</span>
            <span aria-hidden>•</span>
            <span>Mobile-friendly</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
