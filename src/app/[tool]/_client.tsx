'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import ToolWorkspace from '@/components/toolpdf/ToolWorkspace';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import Footer from '@/components/toolpdf/Footer';
import CrossPromo from '@/components/CrossPromo';
import CheckoutModal from '@/components/toolpdf/CheckoutModal';

interface ToolMeta { title: string; description: string; keywords?: string[]; intro?: string; faqs?: { question: string; answer: string }[]; }

export default function ToolPageClient({ toolSlug, toolMeta }: { toolSlug: string; toolMeta?: ToolMeta }) {
  const { setView, setActiveTool } = useAppStore();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => { if (toolMeta) { setActiveTool(toolSlug); setView('tool'); } }, [toolSlug, toolMeta, setActiveTool, setView]);

  if (!toolMeta) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <BackgroundEffects />
        <Header onUpgradeClick={() => setShowCheckout(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center"><h1 className="text-2xl font-bold text-slate-300">Tool not found</h1><p className="text-slate-500 mt-2">The requested PDF tool does not exist.</p></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects />
      <Header onUpgradeClick={() => setShowCheckout(true)} />
      <main className="flex-1">
        {toolMeta.intro && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
            <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06]">
              <h1 className="text-xl font-bold text-slate-200 mb-2">{toolMeta.title ? (toolMeta.title.split(' — ')[0] || toolMeta.title) : ''}</h1>
              <p className="text-sm text-slate-400 leading-relaxed">{toolMeta.intro}</p>
            </div>
          </div>
        )}
        <ToolWorkspace />
        {toolMeta.faqs && toolMeta.faqs.length > 0 && (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity: toolMeta.faqs.map(f => ({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))})}} />
            <section className="mt-8 mb-4 max-w-4xl mx-auto px-4 sm:px-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {toolMeta.faqs.map((faq, i) => (
                  <details key={i} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.12] transition-colors">
                    <summary className="text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">{faq.question}</summary>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <CrossPromo exclude="ToolPDF" />
      <Footer />
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  );
}
