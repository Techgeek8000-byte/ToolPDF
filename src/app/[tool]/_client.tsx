'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import ToolWorkspace from '@/components/toolpdf/ToolWorkspace';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import Footer from '@/components/toolpdf/Footer';
import CrossPromo from '@/components/CrossPromo';
import { useState } from 'react';
import CheckoutModal from '@/components/toolpdf/CheckoutModal';

interface ToolMeta {
  title: string;
  description: string;
  keywords?: string[];
}

export default function ToolPageClient({ toolSlug, toolMeta }: { toolSlug: string; toolMeta?: ToolMeta }) {
  const { setView, setActiveTool } = useAppStore();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (toolMeta) {
      setActiveTool(toolSlug);
      setView('tool');
    }
  }, [toolSlug, toolMeta, setActiveTool, setView]);

  if (!toolMeta) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <BackgroundEffects />
        <Header onUpgradeClick={() => setShowCheckout(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-300">Tool not found</h1>
            <p className="text-slate-500 mt-2">The requested PDF tool does not exist.</p>
          </div>
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
        <ToolWorkspace />
      </main>
      <CrossPromo exclude="ToolPDF" />
      <Footer />
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  );
}
