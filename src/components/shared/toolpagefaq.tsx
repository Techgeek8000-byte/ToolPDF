// Reusable FAQ JSON-LD component for tool pages (ToolPDF dark variant)

interface FAQItem {
  question: string;
  answer: string;
}

export function ToolPageFAQ({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="mt-8 mb-4 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.12] transition-colors">
              <summary className="text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
