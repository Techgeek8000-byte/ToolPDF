'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Zap,
  Crown,
  Shield,
  Sparkles,
  CreditCard,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$5',
    period: '/month',
    priceId: 'price_monthly_stripe_placeholder',
    badge: null,
    features: [
      'Billed monthly',
      'Cancel anytime',
      'Full access to all tools',
      'Unlimited daily processing',
      '500MB max file size',
      'Priority processing speed',
      'Ad-free experience',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$120',
    period: 'one-time',
    priceId: 'price_lifetime_stripe_placeholder',
    badge: 'BEST VALUE',
    features: [
      'Pay once, use forever',
      'Save 60% vs monthly',
      'Full access to all tools',
      'Unlimited daily processing',
      '500MB max file size',
      'Priority processing speed',
      'Ad-free experience',
      'Early access to new tools',
    ],
  },
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { setPremium, isPremium } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);

  const handleClose = () => {
    setStep('plans');
    setSelectedPlan(null);
    setEmail('');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setCardError(null);
    onClose();
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setStep('checkout');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const handlePayment = async () => {
    // Basic validation
    const cleanedCard = cardNumber.replace(/\s/g, '');
    if (!email || !email.includes('@')) {
      setCardError('Please enter a valid email address');
      return;
    }
    if (cleanedCard.length < 16) {
      setCardError('Please enter a valid card number');
      return;
    }
    if (expiry.length < 5) {
      setCardError('Please enter a valid expiry date');
      return;
    }
    if (cvc.length < 3) {
      setCardError('Please enter a valid CVC');
      return;
    }

    setCardError(null);
    setIsProcessing(true);

    // Simulate payment processing (replace with actual Stripe integration)
    // In production, you would call your API route which creates a Stripe Checkout Session
    /*
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: plans.find(p => p.id === selectedPlan)?.priceId,
          email 
        }),
      });
      const session = await response.json();
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    */

    // Demo: simulate success after delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPremium(true);
    setStep('success');
  };

  const currentPlan = plans.find((p) => p.id === selectedPlan);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border border-white/10 bg-[#0f0f16] shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0f0f16] px-6 py-4">
              <div className="flex items-center gap-3">
                {step !== 'plans' && (
                  <button
                    onClick={() => setStep('plans')}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {step === 'plans'
                      ? 'Choose Your Plan'
                      : step === 'checkout'
                        ? 'Checkout'
                        : 'Welcome to Pro!'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {step === 'plans'
                      ? isPremium
                        ? 'You already have an active subscription'
                        : 'Unlock unlimited access to all tools'
                      : step === 'checkout'
                        ? `Selected: ${currentPlan?.name} — ${currentPlan?.price}${currentPlan?.period}`
                        : 'Your account has been upgraded'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* PLANS STEP */}
              {step === 'plans' && (
                <div className="space-y-4">
                  {isPremium && (
                    <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 flex items-center gap-3">
                      <Crown className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-emerald-300">You have an active Pro subscription</p>
                        <p className="text-xs text-slate-400 mt-0.5">Enjoy unlimited access to all features!</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <motion.button
                        key={plan.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !isPremium && handleSelectPlan(plan.id)}
                        disabled={isPremium}
                        className={`relative text-left rounded-xl p-6 border transition-all ${
                          isPremium
                            ? 'border-white/5 bg-white/[0.02] opacity-60 cursor-default'
                            : 'border-white/10 bg-white/[0.03] hover:border-violet-500/30 hover:bg-violet-500/5 cursor-pointer'
                        }`}
                      >
                        {plan.badge && (
                          <div className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5">
                            <span className="text-[10px] font-bold text-white tracking-wider">{plan.badge}</span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-gradient-violet">{plan.price}</span>
                          <span className="text-sm text-slate-400">{plan.period}</span>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs text-slate-300">
                              <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.button>
                    ))}
                  </div>

                  {/* Guarantee */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment via Stripe · 30-day money-back guarantee</span>
                  </div>
                </div>
              )}

              {/* CHECKOUT STEP */}
              {step === 'checkout' && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Order Summary</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">ToolPDF Pro — {currentPlan?.name}</p>
                          <p className="text-xs text-slate-500">Unlimited access to all 10 tools</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">{currentPlan?.price}</span>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-violet-400" />
                      Payment Details
                    </h3>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-all font-mono tracking-wider"
                      />
                    </div>

                    {/* Expiry + CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">CVC</label>
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {cardError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-rose-400 text-center"
                    >
                      {cardError}
                    </motion.p>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold transition-all ${
                      isProcessing
                        ? 'bg-violet-500/20 text-violet-300 cursor-wait'
                        : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Pay {currentPlan?.price}
                      </>
                    )}
                  </button>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>SSL Encrypted</span>
                    </div>
                    <span>·</span>
                    <span>Powered by Stripe</span>
                  </div>
                </div>
              )}

              {/* SUCCESS STEP */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                  >
                    <Sparkles className="h-10 w-10 text-violet-400" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white">Welcome to Pro!</h3>
                  <p className="mt-2 text-slate-400 max-w-sm mx-auto">
                    Your account has been upgraded. Enjoy unlimited access to all 10 PDF tools with no daily limits.
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
                    {[
                      { icon: Zap, text: 'Unlimited' },
                      { icon: Shield, text: '500MB files' },
                      { icon: Crown, text: 'All tools' },
                    ].map((item) => (
                      <div key={item.text} className="text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                          <item.icon className="h-5 w-5 text-violet-400" />
                        </div>
                        <p className="text-xs text-slate-400">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleClose}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-transform"
                  >
                    Start Using Pro Tools
                    <Sparkles className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}