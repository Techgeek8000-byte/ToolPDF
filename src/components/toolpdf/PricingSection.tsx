'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Star, Clock, Infinity } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface PricingSectionProps {
  onUpgradeClick?: () => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Get started with PDF tools',
    badge: null,
    features: ['10 files per day', '19 free tools', '100MB max file size', 'File reader (all types)', 'Standard encryption'],
    cta: 'Current Plan',
    highlighted: false,
    icon: <Star className="w-5 h-5 text-emerald-400" />,
  },
  {
    name: 'Weekly',
    price: '$1',
    period: '/week',
    description: 'Try Pro for a week',
    badge: null,
    features: ['Unlimited files', 'All 27 tools', '500MB max file size', 'Priority speed', 'No watermark', 'Batch processing'],
    cta: 'Get Weekly',
    highlighted: false,
    icon: <Clock className="w-5 h-5 text-purple-400" />,
  },
  {
    name: 'Monthly',
    price: '$2',
    period: '/mo',
    originalPrice: '$4',
    description: 'Most popular for regular users',
    badge: 'SAVE 50%',
    features: ['Unlimited files', 'All 27 tools', '500MB max file size', 'Priority speed', 'No watermark', 'Batch processing', 'Unlock PDF', 'Convert any file to PDF', 'PDF to HTML', 'PDF to Excel', 'Redact PDF', 'Flatten PDF', 'Sign PDF'],
    cta: 'Get Monthly',
    highlighted: true,
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    name: 'Yearly',
    price: '$12',
    period: '/year',
    originalPrice: '$24',
    description: 'Best value for regular users',
    badge: 'SAVE 50%',
    features: ['Everything in Monthly', 'Priority support', 'Early access to new tools', 'Save $12/year', 'Remove watermark tool', 'All new tools included'],
    cta: 'Get Yearly',
    highlighted: false,
    icon: <Infinity className="w-5 h-5 text-emerald-400" />,
  },
  {
    name: 'Lifetime',
    price: '$25',
    period: 'one-time',
    originalPrice: '$48',
    description: 'Pay once, use forever',
    badge: 'BEST VALUE',
    features: ['Everything in Yearly', 'Lifetime access', 'No recurring payments', 'All future tools included', 'All future upgrades', 'Priority support forever'],
    cta: 'Get Lifetime',
    highlighted: false,
    icon: <Crown className="w-5 h-5 text-amber-400" />,
  },
];

export default function PricingSection({ onUpgradeClick }: PricingSectionProps) {
  const { isPremium } = useAppStore();

  const handleUpgrade = () => {
    if (onUpgradeClick) onUpgradeClick();
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Simple, <span className="text-purple-400">Transparent</span> Pricing</h2>
        <p className="mt-2 text-slate-400">Start free with 19 tools. Upgrade when you need premium features.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400"><span className="text-emerald-400 font-semibold">19</span> free tools</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-slate-400"><span className="text-violet-400 font-semibold">8</span> pro tools</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`relative rounded-2xl p-5 flex flex-col ${
              plan.highlighted
                ? 'border border-purple-500/30 bg-purple-500/[0.04]'
                : 'border border-white/[0.06] bg-white/[0.02]'
            }`}
          >
            {plan.highlighted && (
              <>
                <div className="absolute -inset-px bg-gradient-to-b from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm -z-10" />
                <div className="absolute -inset-1 bg-gradient-to-b from-purple-500/10 to-pink-500/10 rounded-3xl blur-lg -z-20" />
              </>
            )}

            {plan.badge && (
              <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white rounded-full shadow-lg ${
                plan.badge === 'BEST VALUE' ? 'bg-amber-500 shadow-amber-500/25' : 'bg-purple-500 shadow-purple-500/25'
              }`}>
                {plan.badge}
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 relative z-10">
              {plan.icon}
              <h3 className="text-sm font-semibold text-slate-200">{plan.name}</h3>
            </div>

            <div className="mb-1 relative z-10">
              {plan.originalPrice && <span className="text-xs text-slate-600 line-through mr-1">{plan.originalPrice}</span>}
              <span className="text-2xl font-extrabold text-slate-100">{plan.price}</span>
              {plan.period && <span className="text-xs text-slate-500 ml-1">{plan.period}</span>}
            </div>
            <p className="text-[11px] text-slate-500 mb-4 relative z-10">{plan.description}</p>

            <ul className="space-y-2 mb-6 flex-1 relative z-10">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {plan.name === 'Free' ? (
              <div className="w-full py-2 text-xs text-center text-slate-500 bg-white/[0.03] rounded-xl border border-white/[0.06] relative z-10">Current Plan</div>
            ) : (
              <button onClick={handleUpgrade} className={`w-full py-2 text-xs font-semibold text-white rounded-xl relative z-10 transition-opacity hover:opacity-90 ${
                plan.highlighted ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-white/[0.08] hover:bg-white/[0.12]'
              }`}>{plan.cta}</button>
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">Secure checkout via LemonSqueezy</p>
    </section>
  );
}
