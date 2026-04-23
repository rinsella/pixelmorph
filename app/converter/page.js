import Converter from '@/components/Converter';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Image Converter, HEIC, JPG, PNG, WEBP',
  description:
    'Convert images between HEIC, JPG, PNG and WEBP. Batch upload, resize, quality control, and ZIP download. Fast, free, and mobile-friendly.',
  path: '/converter',
  keywords: [
    'image converter',
    'heic to jpg',
    'png to webp',
    'jpg to webp',
    'webp to jpg',
    'batch image converter',
    'free image converter'
  ]
});

export default function ConverterPage() {
  return (
    <section className="container-tight py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="h-display text-3xl sm:text-4xl">Image Converter</h1>
        <p className="mt-3 prose-body">
          Convert HEIC, JPG, PNG and WEBP images. Drop your files in, choose a
          target format, and download clean output, individually or as a ZIP.
        </p>
      </header>

      <div className="mt-8">
        <Converter />
      </div>

      <section className="mt-16 grid gap-6 lg:grid-cols-3 text-sm text-ink-700">
        <div className="card p-5">
          <h2 className="font-semibold text-ink-900">Privacy first</h2>
          <p className="mt-2">
            Files are processed in memory and removed within 15 minutes. Use the
            metadata stripping option to remove EXIF and GPS info before download.
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-ink-900">Quality you can tune</h2>
          <p className="mt-2">
            JPG and WEBP support a quality slider. Resize controls let you fit
            within a maximum width and height while preserving aspect ratio.
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-ink-900">Need bulk?</h2>
          <p className="mt-2">
            Upload up to 25 files (25MB each) per batch and grab everything as a
            single ZIP. See the{' '}
            <Link href="/supported-formats" className="text-brand-700 underline">
              full format matrix
            </Link>
            .
          </p>
        </div>
      </section>
    </section>
  );
}
