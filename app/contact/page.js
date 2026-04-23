import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with the PixelMorph team, feedback, bug reports, partnership inquiries, and press.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <section className="container-tight py-14 max-w-2xl">
      <header>
        <p className="badge">Contact</p>
        <h1 className="mt-3 h-display text-4xl">Get in touch</h1>
        <p className="mt-3 prose-body">
          Have feedback, a bug report, or a partnership idea? Send us a note,
          we read everything.
        </p>
      </header>

      <div className="mt-8 card p-6">
        <p className="text-sm text-ink-700">
          Email us at{' '}
          <a
            href="mailto:hello@pixelmorph.net"
            className="font-semibold text-brand-700 underline"
          >
            hello@pixelmorph.net
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-ink-500">
          We aim to respond to every message within two business days.
        </p>
      </div>

      <form
        action="mailto:hello@pixelmorph.net"
        method="post"
        encType="text/plain"
        className="mt-8 card p-6 space-y-4"
        aria-label="Contact form"
      >
        <label className="block">
          <span className="text-sm font-semibold text-ink-900">Your name</span>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-900">Your email</span>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-900">Message</span>
          <textarea
            name="message"
            required
            rows="5"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <button type="submit" className="btn-primary">
          Send message
        </button>
        <p className="text-xs text-ink-500">
          This form opens your default email client. You can also email us
          directly at the address above.
        </p>
      </form>
    </section>
  );
}
