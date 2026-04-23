import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'The terms governing your use of the PixelMorph image converter.',
  path: '/terms-of-service'
});

export default function TermsPage() {
  return (
    <section className="container-tight py-14 max-w-3xl prose-body">
      <h1 className="h-display text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: January 2026</p>

      <h2 className="h-section mt-10">Acceptance</h2>
      <p className="mt-3">
        By using PixelMorph you agree to these terms. If you do not agree, please
        do not use the service.
      </p>

      <h2 className="h-section mt-8">Acceptable use</h2>
      <p className="mt-3">
        You agree to use PixelMorph only with images you own or have permission
        to convert. You must not use the service to upload illegal content, to
        infringe copyright, to attempt to overload our infrastructure, or to
        circumvent our usage limits.
      </p>

      <h2 className="h-section mt-8">No warranty</h2>
      <p className="mt-3">
        The service is provided “as is” without warranty of any kind. We do our
        best to keep PixelMorph fast, reliable and secure, but we cannot
        guarantee uninterrupted service or that conversions will always succeed
        for every file.
      </p>

      <h2 className="h-section mt-8">Limitation of liability</h2>
      <p className="mt-3">
        To the maximum extent permitted by law, PixelMorph is not liable for any
        indirect, incidental, special, or consequential damages arising from
        your use of the service, including but not limited to data loss.
      </p>

      <h2 className="h-section mt-8">Changes</h2>
      <p className="mt-3">
        We may update these terms from time to time. Continued use of the
        service after changes constitutes acceptance of the new terms.
      </p>

      <h2 className="h-section mt-8">Contact</h2>
      <p className="mt-3">
        Questions about these terms? Reach us via the{' '}
        <a href="/contact" className="text-brand-700 underline">contact page</a>.
      </p>
    </section>
  );
}
