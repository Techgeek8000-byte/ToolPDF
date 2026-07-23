'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import HeroSection from '@/components/toolpdf/HeroSection';
import PrivacyBadge from '@/components/toolpdf/PrivacyBadge';
import ToolGrid from '@/components/toolpdf/ToolGrid';
import HowItWorks from '@/components/toolpdf/HowItWorks';
import PricingSection from '@/components/toolpdf/PricingSection';
import TestimonialsSection from '@/components/toolpdf/TestimonialsSection';
import Footer from '@/components/toolpdf/Footer';
import ToolWorkspace from '@/components/toolpdf/ToolWorkspace';
import CheckoutModal from '@/components/toolpdf/CheckoutModal';
import { useAppStore } from '@/lib/store';
import { getRecentToolsList } from '@/lib/usage-counter';
import { tools } from '@/lib/tool-definitions';

export default function ToolPDFApp() {
  const { currentView, isPremium } = useAppStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [recentTools, setRecentTools] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const recent = getRecentToolsList();
    const filtered = recent
      .filter((r) => tools.some((t) => t.id === r.id))
      .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
      .slice(0, 4);
    setRecentTools(filtered);
  }, [currentView]);

  const handleRecentToolClick = (toolId: string) => {
    const store = useAppStore.getState();
    store.resetTool();
    store.setActiveTool(toolId);
    store.setView('tool');
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onUpgradeClick={() => setShowCheckout(true)} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {currentView === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HeroSection />

                {/* Recently Used Tools */}
                {recentTools.length > 0 && (
                  <section className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Recently Used
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {recentTools.map((rt, i) => {
                            const toolDef = tools.find((t) => t.id === rt.id);
                            if (!toolDef) return null;
                            const RIcon = toolDef.icon;
                            return (
                              <motion.button
                                key={rt.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleRecentToolClick(rt.id)}
                                className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-left hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
                              >
                                <div
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                  style={{ background: toolDef.iconBg }}
                                >
                                  <RIcon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {toolDef.name}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    {toolDef.description}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </div>
                  </section>
                )}

                <PrivacyBadge />
                <ToolGrid />
                <HowItWorks />
                <TestimonialsSection />
                <PricingSection onUpgradeClick={() => setShowCheckout(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="tool"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ToolWorkspace />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      </div>
    </div>
  );
}
