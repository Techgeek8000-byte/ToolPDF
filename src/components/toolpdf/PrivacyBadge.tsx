'use client';

import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mx-auto max-w-3xl px-4"
    >
      <div className="flex items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300 text-center">
          <span className="font-semibold">Your files are processed entirely in your browser.</span>{' '}
          Nothing is uploaded to any server. Ever.
        </p>
      </div>
    </motion.div>
  );
}