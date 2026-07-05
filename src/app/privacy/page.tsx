import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolPDF',
  description: 'ToolPDF privacy policy. Learn how we handle your data and protect your privacy.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          &larr; Back to ToolPDF
        </a>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: July 2025</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              ToolPDF (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard information when you
              visit our website (the &quot;Service&quot;). ToolPDF is a project by Osama.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">
              <strong>Your files are never uploaded to any server.</strong> All PDF processing
              happens entirely in your web browser using client-side JavaScript. We do not
              collect, store, or have access to any files you upload or process.
            </p>
            <p>We may collect the following non-personal information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Anonymous usage analytics (page views, tool usage frequency)</li>
              <li>Device type, browser type, and screen resolution</li>
              <li>General geographic region (country/city level only)</li>
              <li>Cookies for session management and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>To improve our tools and user experience</li>
              <li>To understand which tools are most popular</li>
              <li>To serve relevant advertisements through Google AdSense</li>
              <li>To maintain and secure the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Cookies</h2>
            <p>
              We use cookies for essential functionality (such as remembering your premium
              status and daily usage count) and for analytics. You can disable cookies in your
              browser settings, though some features may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Google AdSense:</strong> May use cookies to serve personalized ads. See{' '}
                <a href="https://policies.google.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li><strong>Google Analytics:</strong> Collects anonymous usage data. See{' '}
                <a href="https://policies.google.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li><strong>Stripe:</strong> Processes payments securely. We never see your full
                card details. See{' '}
                <a href="https://stripe.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  Stripe&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              All file processing happens client-side in your browser. Your files never leave
              your device. We use HTTPS encryption for all connections. Premium payment
              processing is handled by Stripe with PCI-DSS Level 1 compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. GDPR Rights</h2>
            <p>
              Under GDPR, you have the right to access, correct, or delete any personal data
              we hold. Since we do not collect personal files or require account creation,
              there is minimal personal data to manage. To exercise these rights, contact us
              at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on
              this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>
              For any privacy-related questions, contact us at:{' '}
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