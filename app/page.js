import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/formats';

export const metadata = buildMetadata({
  title: 'Free Online Image Converter, HEIC, JPG, PNG, WEBP',
  description:
    'PixelMorph converts HEIC to JPG, HEIC to PNG, JPG to PNG, PNG to WEBP, WEBP to JPG and more. Fast, secure, batch-ready, mobile-friendly.',
  path: '/',
  keywords: [
    'heic to jpg converter',
    'image converter online',
    'jpg to png converter',
    'png to webp converter',
    'webp to jpg converter',
    'batch image converter',
    'convert images online'
  ]
});

const FEATURES = [
  {
    title: 'Real HEIC support',
    body:
      'iPhone HEIC and HEIF files convert reliably to JPG or PNG, no extra apps, no broken previews.',
    icon: '📱'
  },
  {
    title: 'Batch conversion',
    body:
      'Drop dozens of files at once and download a single ZIP, perfect for bulk photo exports.',
    icon: '⚡'
  },
  {
    title: 'Quality control',
    body:
      'Tune JPG and WEBP quality, resize on the fly, and strip EXIF/GPS metadata for privacy.',
    icon: '🎛️'
  },
  {
    title: 'Mobile friendly',
    body:
      'Works beautifully on phones and tablets, convert photos straight from your camera roll.',
    icon: '📲'
  },
  {
    title: 'Secure by design',
    body:
      'Files are processed in memory and auto-deleted within minutes. We never resell your data.',
    icon: '🔒'
  },
  {
    title: 'No sign-up',
    body:
      'Open the converter and go. No account, no email, no credit card.',
    icon: '🚀'
  }
];

const FAQ_PREVIEW = [
  {
    q: 'How do I convert HEIC to JPG online?',
    a: 'Open the converter, drag your HEIC files in, choose JPG as the output format, and click Convert. Download files individually or as a single ZIP.'
  },
  {
    q: 'Can I convert multiple images at once?',
    a: 'Yes, PixelMorph supports batch conversion of up to 1000 images per request (20GB total), with per-file status and a one-click ZIP download.'
  },
  {
    q: 'Is my image quality preserved?',
    a: 'Yes. We use the high-fidelity sharp library with mozjpeg encoding, plus orientation-correct decoding for HEIC.'
  }
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-hero-gradient">
        <div className="container-tight py-20 sm:py-28 text-center">
          <span className="badge">New · Now with batch ZIP downloads</span>
          <h1 className="mt-4 h-display">
            Convert <span className="text-brand-600">HEIC, JPG, PNG &amp; WEBP</span><br className="hidden sm:block" />
            in seconds.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            PixelMorph is a premium online image converter built for speed, quality
            and privacy. Convert iPhone photos, web images and screenshots, right
            in your browser, on any device.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/converter" className="btn-primary text-base px-6 py-3.5">
              Start converting, it’s free
            </Link>
            <Link href="/supported-formats" className="btn-secondary text-base px-6 py-3.5">
              See supported formats
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-500">
            No sign-up. Files auto-deleted. Works on phones, tablets, and desktops.
          </p>
        </div>
      </section>

      {/* Quick conversions grid */}
      <section className="container-tight py-16">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="h-section">Popular conversions</h2>
            <p className="mt-2 prose-body max-w-xl">
              Jump straight into the most-used image conversion routes.
            </p>
          </div>
          <Link href="/supported-formats" className="text-sm font-semibold text-brand-700 hover:underline">
            View all formats →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map((r) => (
            <Link
              key={r.slug}
              href={`/supported-formats#${r.slug}`}
              className="card p-5 hover:-translate-y-0.5 hover:shadow-soft transition-all"
            >
              <p className="text-xs font-semibold text-brand-700">
                {r.from} → {r.to}
              </p>
              <h3 className="mt-2 text-lg font-bold text-ink-900">{r.title}</h3>
              <p className="mt-2 text-sm text-ink-500 line-clamp-3">{r.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why PixelMorph */}
      <section className="bg-gray-50/60 border-y border-gray-100">
        <div className="container-tight py-16">
          <div className="max-w-2xl">
            <h2 className="h-section">Why choose PixelMorph</h2>
            <p className="mt-3 prose-body">
              We built PixelMorph for the moments other converters fall short:
              opening iPhone HEIC files on Windows, batch-converting WEBP back to
              JPG, or shrinking PNG screenshots without losing detail.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="text-2xl" aria-hidden="true">{f.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-700">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="container-tight py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr,2fr]">
          <div>
            <h2 className="h-section">Frequently asked</h2>
            <p className="mt-3 prose-body">
              Everything you need to know about converting images with PixelMorph.
            </p>
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
            >
              Browse all FAQs →
            </Link>
          </div>
          <dl className="space-y-4">
            {FAQ_PREVIEW.map((item) => (
              <div key={item.q} className="card p-5">
                <dt className="font-semibold text-ink-900">{item.q}</dt>
                <dd className="mt-2 text-sm text-ink-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-16">
        <div className="card overflow-hidden p-8 sm:p-12 text-center bg-gradient-to-br from-brand-600 to-purple-600 text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to convert your photos?
          </h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Drop your files in and get clean, high-quality images in seconds.
          </p>
          <Link
            href="/converter"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-brand-700 font-semibold px-6 py-3.5 shadow-soft hover:bg-brand-50"
          >
            Open the converter
          </Link>
        </div>
      </section>
    </>
  );
}
