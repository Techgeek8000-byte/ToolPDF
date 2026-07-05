import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ToolPDF',
  description: 'ToolPDF terms of service. Read the terms and conditions for using our free PDF tools.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          &larr; Back to ToolPDF
        </a>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: July 2025</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ToolPDF (the &quot;Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the Service. ToolPDF
              is a project by Osama.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              ToolPDF provides free, browser-based PDF tools including but not limited to:
              merge, split, compress, convert (PDF to Word, Word to PDF, PDF to Image, Image
              to PDF), rotate, protect, and watermark PDF files. All processing occurs
              client-side in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Free Usage</h2>
            <p>
              Free users may process up to 10 files per day with a maximum file size of 100MB
              per file. We reserve the right to modify these limits at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Premium Subscription</h2>
            <p className="mb-2">Premium plans are available at two tiers:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm mb-3">
              <li><strong>Monthly:</strong> $5/month, billed monthly, cancel anytime</li>
              <li><strong>Lifetime:</strong> $120 one-time payment, permanent access</li>
            </ul>
            <p>
              Premium benefits include unlimited daily processing, 500MB max file size,
              priority processing speed, and an ad-free experience. Payments are processed
              securely through Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>You must have the legal right to process any files you upload</li>
              <li>You are responsible for the content of your files</li>
              <li>You may not use the Service for any illegal purposes</li>
              <li>You may not attempt to overload, hack, or disrupt the Service</li>
              <li>You may not reverse-engineer or resell the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p>
              The ToolPDF website, design, code, and branding are owned by Osama. You may not
              copy, modify, or redistribute any part of the Service without explicit written
              permission. Files you process remain your property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee that the Service will be error-free, uninterrupted, or meet your
              specific requirements. Conversion accuracy may vary depending on document complexity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              In no event shall ToolPDF or Osama be liable for any indirect, incidental, or
              consequential damages arising from your use of the Service, including data loss
              or file corruption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Refund Policy</h2>
            <p>
              Monthly: Cancel anytime, no refunds after 48 hours. Lifetime: 30-day
              money-back guarantee. Contact support@toolpdf.com to request a refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use after
              changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
            <p>
              For questions about these Terms, contact us at:{' '}
              <a href="mailto:support@toolpdf.com" className="text-emerald-400 hover:underline">
                support@toolpdf.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} ToolPDF. A project by Osama. All rights reserved.
        </div>
      </div>
    </div>
  );
}