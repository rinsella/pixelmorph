import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

export const metadata = buildMetadata({
  title: SITE_TAGLINE,
  path: '/',
  keywords: [
    'heic to jpg',
    'heic to png',
    'image converter',
    'jpg to png',
    'png to webp',
    'webp to jpg',
    'batch image converter',
    'online image converter'
  ]
});

export const viewport = {
  themeColor: '#1f43f0',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Convert HEIC, JPG, PNG and WEBP images online. Fast, secure, batch-ready, mobile-friendly.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="preconnect"
          href="https://rsms.me/"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-ink-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
