'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import HeroSection from '@/components/toolpdf/HeroSection';
import PrivacyBadge from '@/components/toolpdf/PrivacyBadge';
import ToolGrid from '@/components/toolpdf/ToolGrid';
import HowItWorks from '@/components/toolpdf/HowItWorks';
import PricingSection from '@/components/toolpdf/PricingSection';
import Footer from '@/components/toolpdf/Footer';
import ToolWorkspace from '@/components/toolpdf/ToolWorkspace';
import AdBanner from '@/components/toolpdf/AdBanner';
import CheckoutModal from '@/components/toolpdf/CheckoutModal';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const { currentView, isPremium } = useAppStore();
  const [showCheckout, setShowCheckout] = useState(false);

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

                {/* Ad Banner 1: Below Hero */}
                {!isPremium && (
                  <div className="px-4 sm:px-6 py-4">
                    <AdBanner slot="hero-bottom-728x90" format="horizontal" label="Advertisement · 728x90" />
                  </div>
                )}

                <PrivacyBadge />
                <ToolGrid />

                {/* Ad Banner 2: Between Tools and How It Works */}
                {!isPremium && (
                  <div className="px-4 sm:px-6 py-4">
                    <AdBanner slot="mid-content-728x90" format="horizontal" label="Advertisement · 728x90" />
                  </div>
                )}

                <HowItWorks />
                <PricingSection onUpgradeClick={() => setShowCheckout(true)} />

                {/* Ad Banner 3: Above Footer */}
                {!isPremium && (
                  <div className="px-4 sm:px-6 py-4">
                    <AdBanner slot="pre-footer-728x90" format="horizontal" label="Advertisement · 728x90" />
                  </div>
                )}
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

        {/* Ad Banner 4: Sticky Bottom (mobile only, non-premium) */}
        {!isPremium && currentView === 'home' && (
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            <AdBanner slot="mobile-sticky-320x50" format="horizontal" className="!max-w-none !rounded-none" label="Ad · 320x50" />
          </div>
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      </div>
    </div>
  );
}