import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How PixelMorph handles your uploaded images, cookies, analytics, and personal data.',
  path: '/privacy-policy'
});

export default function PrivacyPage() {
  return (
    <section className="container-tight py-14 max-w-3xl prose-body">
      <h1 className="h-display text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: January 2026</p>

      <h2 className="h-section mt-10">Overview</h2>
      <p className="mt-3">
        PixelMorph (“we”, “us”) is an online image conversion tool. We designed
        the service to handle as little personal data as possible. This page
        explains what we collect, why, and how to get in touch.
      </p>

      <h2 className="h-section mt-8">Files you upload</h2>
      <p className="mt-3">
        Images you upload are processed in memory on our servers in order to
        perform the conversion you requested. Converted output is held in a
        short-lived job buffer so you can download the results, then is
        automatically discarded, typically within 15 minutes. We do not store
        your images long-term, and we do not use your images to train any models
        or share them with third parties.
      </p>
      <p className="mt-3">
        By default we strip EXIF metadata (including GPS coordinates) from your
        converted images for privacy. You can opt out of this in the converter
        options.
      </p>

      <h2 className="h-section mt-8">Logs &amp; analytics</h2>
      <p className="mt-3">
        Like most web services, our hosting provider records standard request
        logs (IP address, user agent, timestamp, request path) for security and
        reliability. These logs are retained for a limited period and are not
        joined with your uploaded files.
      </p>
      <p className="mt-3">
        We may use a privacy-respecting analytics tool to understand aggregate
        usage of the site. We do not run advertising trackers.
      </p>

      <h2 className="h-section mt-8">Cookies</h2>
      <p className="mt-3">
        PixelMorph does not require accounts and does not set any tracking
        cookies. Any cookies that exist are strictly necessary for the site to
        function (for example, remembering UI preferences in your browser).
      </p>

      <h2 className="h-section mt-8">Your rights</h2>
      <p className="mt-3">
        You can request deletion of any personal data associated with you by
        contacting us. Because we don’t require accounts, in most cases there is
        no personal data to delete beyond short-lived request logs.
      </p>

      <h2 className="h-section mt-8">Contact</h2>
      <p className="mt-3">
        For privacy questions, reach out via our{' '}
        <a href="/contact" className="text-brand-700 underline">contact page</a>.
      </p>
    </section>
  );
}
