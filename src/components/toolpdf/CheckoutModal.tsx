'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Shield, Sparkles, Clock, Infinity, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { LEMON_SQUEEZY } from '@/lib/lemonsqueezy';

interface CheckoutModalProps { isOpen: boolean; onClose: () => void; }

const options = [
  { name: 'Weekly', price: '$1/week', description: 'Billed weekly. Cancel anytime.', icon: <Clock className="w-5 h-5 text-purple-400" />, popular: false, features: ['Unlimited files', 'No watermark', 'Priority speed'] },
  { name: 'Monthly', price: '$2/mo', originalPrice: '$4/mo', description: 'Save 50% vs weekly. Billed monthly.', icon: <Zap className="w-5 h-5 text-purple-400" />, popular: true, features: ['Unlimited files', 'No watermark', 'Priority speed', 'Early access'] },
  { name: 'Yearly', price: '$12/yr', originalPrice: '$24/yr', description: 'Save 50% vs monthly. Best for regulars.', icon: <Infinity className="w-5 h-5 text-emerald-400" />, popular: false, features: ['Everything in Monthly', 'Priority support', 'Save $12/year'] },
  { name: 'Lifetime', price: '$25', originalPrice: '$48', description: 'Pay once. Use forever.', icon: <Crown className="w-5 h-5 text-amber-400" />, popular: false, features: ['Everything in Yearly', 'Lifetime access', 'All future updates', 'Best value'] },
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { setPremium, isPremium } = useAppStore();
  const [step, setStep] = useState<'plans' | 'success'>('plans');

  const handleClose = () => { setStep('plans'); onClose(); };

  const handleSelect = (plan: string) => {
  const urls: Record<string, string> = { weekly: LEMON_SQUEEZY.weekly, monthly: LEMON_SQUEEZY.monthly, yearly: LEMON_SQUEEZY.yearly, lifetime: LEMON_SQUEEZY.lifetime };
  window.open(urls[plan] || urls.monthly, '_blank');
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0f0f16] p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={handleClose} className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>

              {step === 'plans' ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
                    <p className="text-sm text-slate-400 mt-1">Choose the plan that works for you</p>
                  </div>
                  <div className="space-y-3">
                    {options.map((opt) => (
                      <div key={opt.name} className={`p-4 rounded-xl border ${opt.popular ? 'border-purple-500/30 bg-purple-500/[0.04]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">{opt.icon}<span className="font-semibold text-white text-sm">{opt.name}</span></div>
                          <div className="flex items-center gap-2">{opt.originalPrice && <span className="text-xs text-slate-600 line-through">{opt.originalPrice}</span>}<span className="text-lg font-bold text-white">{opt.price}</span></div>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{opt.description}</p>
                        <ul className="space-y-1 mb-4">{opt.features.map((f) => (<li key={f} className="flex items-center gap-2 text-xs text-slate-400"><Check className="w-3 h-3 text-emerald-400 shrink-0" />{f}</li>))}</ul>
                        <button onClick={() => handleSelect(opt.name.toLowerCase())} className={`w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90 ${opt.popular ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-white/[0.08] hover:bg-white/[0.12]'}`}>Get Pro — {opt.price}</button>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-600 mt-4">Secure checkout via LemonSqueezy</p>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                    <Sparkles className="h-10 w-10 text-violet-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Welcome to Pro!</h3>
                  <p className="mt-2 text-slate-400 max-w-sm mx-auto">Your account has been upgraded. Enjoy unlimited access with no limits.</p>
                  <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
                    {[{ icon: Zap, text: 'Unlimited' }, { icon: Shield, text: '500MB files' }, { icon: Crown, text: 'All tools' }].map((item) => (
                      <div key={item.text} className="text-center"><div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20"><item.icon className="h-5 w-5 text-violet-400" /></div><p className="text-xs text-slate-400">{item.text}</p></div>
                    ))}
                  </div>
                  <button onClick={handleClose} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-transform">Start Using Pro Tools <Sparkles className="h-4 w-4" /></button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
