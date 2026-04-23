import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Features, PixelMorph Image Converter',
  description:
    'Discover what makes PixelMorph a premium online image converter: real HEIC support, batch conversion, WEBP, quality control, metadata stripping, and more.',
  path: '/features'
});

const SECTIONS = [
  {
    title: 'Reliable HEIC support',
    body:
      'PixelMorph decodes Apple HEIC and HEIF files server-side using a Linux-friendly pipeline (heic-convert + sharp). It works in containers, on Railway, and on any platform, not just macOS.'
  },
  {
    title: 'Batch conversion with ZIP download',
    body:
      'Drop up to 25 files at once. Each file shows its own status, and a single ZIP download bundles everything when you’re done.'
  },
  {
    title: 'Quality retention',
    body:
      'We use sharp with mozjpeg encoding for JPG, max compression for PNG, and tuned WEBP. EXIF orientation is honored so portraits stay upright.'
  },
  {
    title: 'Modern WEBP support',
    body:
      'Convert PNG and JPG to WEBP for faster page loads, or convert WEBP back to JPG/PNG for tools that don’t yet support it.'
  },
  {
    title: 'Privacy & metadata control',
    body:
      'By default we strip EXIF and GPS metadata so your photos don’t leak location data. You can opt out per request.'
  },
  {
    title: 'Secure processing',
    body:
      'Files stay in memory, never written to long-term disk. Jobs auto-expire within 15 minutes. There are no accounts, ads, or tracking pixels in the converter.'
  },
  {
    title: 'Responsive everywhere',
    body:
      'Built mobile-first. The converter is just as comfortable on an iPhone as it is on a 32-inch monitor.'
  }
];

export default function FeaturesPage() {
  return (
    <section className="container-tight py-14">
      <header className="max-w-2xl">
        <p className="badge">Features</p>
        <h1 className="mt-3 h-display text-4xl">
          A premium image converter, minus the bloat.
        </h1>
        <p className="mt-4 prose-body">
          PixelMorph focuses on the things that actually matter when you convert
          images: speed, quality, privacy, and a tool that just works on every
          device.
        </p>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <article key={s.title} className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">{s.title}</h2>
            <p className="mt-2 text-sm text-ink-700">{s.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/converter" className="btn-primary text-base px-6 py-3.5">
          Try PixelMorph now
        </Link>
      </div>
    </section>
  );
}
