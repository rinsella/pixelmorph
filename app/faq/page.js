import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'FAQ, Image Converter Help',
  description:
    'Answers to common questions about converting HEIC, JPG, PNG and WEBP with PixelMorph: batch conversion, mobile use, quality, privacy, and more.',
  path: '/faq',
  keywords: [
    'heic to jpg help',
    'how to convert heic',
    'image converter faq',
    'batch image converter'
  ]
});

const FAQ = [
  {
    q: 'How do I convert HEIC to JPG online?',
    a: 'Open the converter, drop your HEIC files in (or browse from your device), choose JPG as the output format, then click Convert. You can download files individually or grab a single ZIP of everything.'
  },
  {
    q: 'Does PixelMorph support HEIC files?',
    a: 'Yes, HEIC and HEIF support is one of our core features. Files are decoded server-side using a Linux-friendly pipeline, so the converter works just as well on Android and Windows as it does on a Mac.'
  },
  {
    q: 'Can I convert multiple images at once?',
    a: 'Absolutely. PixelMorph supports up to 1000 files per batch (25MB each, 20GB total) with per-file progress and a one-click ZIP download.'
  },
  {
    q: 'Is image quality preserved?',
    a: 'Yes. We use the high-fidelity sharp library with mozjpeg encoding for JPG, lossless PNG output, and tuned WEBP. EXIF orientation is honored so portrait photos stay upright.'
  },
  {
    q: 'Can I use PixelMorph on mobile?',
    a: 'Yes, PixelMorph is mobile-first. Convert photos straight from your iPhone or Android camera roll without installing an app.'
  },
  {
    q: 'Is PixelMorph free?',
    a: 'Yes. The core converter is free to use with reasonable per-batch limits. No sign-up, no credit card.'
  },
  {
    q: 'Are uploaded files stored permanently?',
    a: 'No. Files are processed in memory and the converted results are auto-deleted within 15 minutes. We never resell or repurpose your images.'
  },
  {
    q: 'Does WEBP support transparency?',
    a: 'Yes. PNG → WEBP and WEBP → PNG conversions preserve the alpha channel. Converting to JPG flattens transparency over white because JPG has no alpha.'
  },
  {
    q: 'Why convert HEIC to JPG?',
    a: 'HEIC is an efficient Apple format, but it isn’t natively supported on many Windows machines, older browsers, content management systems, or photo printing services. Converting to JPG (or PNG) makes your photos universally compatible.'
  }
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

export default function FAQPage() {
  return (
    <section className="container-tight py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="max-w-2xl">
        <p className="badge">FAQ</p>
        <h1 className="mt-3 h-display text-4xl">Frequently asked questions</h1>
        <p className="mt-4 prose-body">
          Quick answers about converting images with PixelMorph. Can’t find what
          you’re looking for?{' '}
          <Link href="/contact" className="text-brand-700 underline">
            Get in touch
          </Link>
          .
        </p>
      </header>

      <dl className="mt-10 space-y-4 max-w-3xl">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="card p-5 group open:shadow-soft"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
              <dt className="font-semibold text-ink-900">{item.q}</dt>
              <span
                aria-hidden="true"
                className="text-ink-500 group-open:rotate-180 transition-transform"
              >
                ⌃
              </span>
            </summary>
            <dd className="mt-3 text-sm text-ink-700">{item.a}</dd>
          </details>
        ))}
      </dl>
    </section>
  );
}
