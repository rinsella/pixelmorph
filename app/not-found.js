import Link from 'next/link';

export const metadata = {
  title: 'Page not found | PixelMorph',
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <section className="container-tight py-24 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-3 h-display text-4xl">We couldn’t find that page.</h1>
      <p className="mt-3 prose-body">
        The link may be broken, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/converter" className="btn-secondary">
          Open the converter
        </Link>
      </div>
    </section>
  );
}
