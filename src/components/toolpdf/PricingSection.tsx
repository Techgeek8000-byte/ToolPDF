'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface PricingSectionProps {
  onUpgradeClick?: () => void;
}

export default function PricingSection({ onUpgradeClick }: PricingSectionProps) {
  const { isPremium, setPremium } = useAppStore();

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      setPremium(true);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Simple Pricing</h2>
        <p className="mt-2 text-slate-400">Start free. Upgrade when you need more.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          {!isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-1">
              <span className="text-xs font-semibold text-emerald-400">Current Plan</span>
            </div>
          )}
          <h3 className="text-xl font-bold text-white">Free</h3>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-slate-400">/forever</span>
          </div>
          <ul className="mt-6 space-y-3">
            {[
              '10 files per day',
              '100MB max file size',
              'All 10 tools',
              'Standard processing speed',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {!isPremium && (
            <div className="mt-8 text-center">
              <span className="inline-block rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-slate-400 cursor-default">
                Current Plan
              </span>
            </div>
          )}
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: isPremium ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500/20 border border-violet-500/30 px-4 py-1">
              <span className="text-xs font-semibold text-violet-400">Active Plan</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Pro</h3>
            <Crown className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gradient-violet">$5</span>
            <span className="text-slate-400">/month</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">or $120/lifetime — save 60%</p>
          <ul className="mt-6 space-y-3">
            {[
              { text: 'Unlimited files per day', icon: Zap },
              { text: '500MB max file size', icon: Shield },
              { text: 'Batch processing', icon: Sparkles },
              { text: 'Priority speed', icon: Zap },
              { text: 'All 10 tools unlocked', icon: Crown },
              { text: 'No advertisements', icon: Shield },
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3 text-sm text-slate-300">
                <feature.icon className="h-4 w-4 text-violet-400 shrink-0" />
                {feature.text}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <button
              onClick={handleUpgrade}
              className={`inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                isPremium
                  ? 'bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {isPremium ? 'Manage Subscription' : 'Upgrade to Pro'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}