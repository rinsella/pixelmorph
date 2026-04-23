import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About PixelMorph',
  description:
    'PixelMorph is a premium online image converter built for speed, quality and privacy.',
  path: '/about'
});

export default function AboutPage() {
  return (
    <section className="container-tight py-14 max-w-3xl prose-body">
      <p className="badge">About</p>
      <h1 className="mt-3 h-display text-4xl">A converter that respects your time.</h1>

      <p className="mt-6">
        PixelMorph started with a simple frustration: every existing online image
        converter either choked on iPhone HEIC files, drowned the page in ads,
        or required an account just to flip a JPG to PNG.
      </p>
      <p className="mt-3">
        We built PixelMorph as the converter we wanted to use, fast, clean,
        respectful of privacy, and equally good on a phone or a desktop. No
        sign-up, no upsell wall, just a tool that does its job.
      </p>

      <h2 className="h-section mt-10">Built for the modern web</h2>
      <p className="mt-3">
        PixelMorph is built on Next.js, Express and sharp, with first-class HEIC
        decoding. The whole app is open about its limits, runs in a single
        container, and ships with proper SEO, accessibility and responsive
        design.
      </p>

      <h2 className="h-section mt-10">Where to next</h2>
      <p className="mt-3">
        We have lots planned, including more formats, optional accounts for
        higher limits, and an API. If you have ideas, tell us via the{' '}
        <Link href="/contact" className="text-brand-700 underline">
          contact page
        </Link>
        .
      </p>
    </section>
  );
}
