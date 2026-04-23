import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ROUTES, FORMATS } from '@/lib/formats';

export const metadata = buildMetadata({
  title: 'Supported Formats, HEIC, JPG, PNG, WEBP',
  description:
    'Full list of conversion routes supported by PixelMorph: HEIC to JPG, HEIC to PNG, JPG to PNG, PNG to JPG, JPG to WEBP, WEBP to JPG, PNG to WEBP, WEBP to PNG.',
  path: '/supported-formats',
  keywords: [
    'heic to jpg',
    'heic to png',
    'jpg to png',
    'png to jpg',
    'jpg to webp',
    'webp to jpg',
    'png to webp',
    'webp to png'
  ]
});

export default function SupportedFormatsPage() {
  return (
    <section className="container-tight py-14">
      <header className="max-w-2xl">
        <p className="badge">Supported Formats</p>
        <h1 className="mt-3 h-display text-4xl">
          Every conversion PixelMorph handles
        </h1>
        <p className="mt-4 prose-body">
          PixelMorph supports the most common image formats on the modern web:
          HEIC, JPG, PNG and WEBP, with fast, reliable conversion in any
          direction.
        </p>
      </header>

      <div className="mt-10 card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-ink-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Input ↓ / Output →</th>
              {FORMATS.filter((f) => f !== 'HEIC').map((f) => (
                <th key={f} className="text-left px-4 py-3 font-semibold">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {FORMATS.map((row) => (
              <tr key={row}>
                <td className="px-4 py-3 font-semibold text-ink-900">{row}</td>
                {FORMATS.filter((f) => f !== 'HEIC').map((col) => (
                  <td key={col} className="px-4 py-3">
                    {row === col ? (
                      <span className="text-ink-300">-</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        ✓ Supported
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {ROUTES.map((r) => (
          <article
            key={r.slug}
            id={r.slug}
            className="card p-6 scroll-mt-24"
          >
            <p className="text-xs font-semibold text-brand-700">
              {r.from} → {r.to}
            </p>
            <h2 className="mt-2 text-xl font-bold text-ink-900">{r.title}</h2>
            <p className="mt-2 text-sm text-ink-700">{r.blurb}</p>
            <Link
              href="/converter"
              className="mt-4 inline-flex items-center text-sm font-semibold text-brand-700 hover:underline"
            >
              Convert {r.from} to {r.to} →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-14 prose-body max-w-3xl">
        <h2 className="h-section">Notes on each format</h2>
        <p className="mt-3">
          <strong>HEIC / HEIF</strong> is Apple’s default photo format on modern
          iPhones. It’s efficient but poorly supported on Windows and many web
          tools, converting to JPG or PNG fixes that.
        </p>
        <p className="mt-3">
          <strong>JPG / JPEG</strong> is the universal photo format. PixelMorph
          uses mozjpeg encoding for excellent quality at low file sizes.
        </p>
        <p className="mt-3">
          <strong>PNG</strong> is best for screenshots, graphics and any image
          that needs transparency.
        </p>
        <p className="mt-3">
          <strong>WEBP</strong> is the modern web image format, smaller than JPG
          and PNG at comparable quality, and supported by every major browser.
        </p>
      </div>
    </section>
  );
}
