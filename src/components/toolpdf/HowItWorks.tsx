'use client';

import { motion } from 'framer-motion';
import { Upload, Cog, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Drag & drop your PDF files',
  },
  {
    icon: Cog,
    title: 'Process',
    description: 'Choose your tool and settings',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Get your processed files instantly',
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">How It Works</h2>
        <p className="mt-2 text-slate-400">Three simple steps to transform your PDFs</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-violet-500/50" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
            className="relative text-center"
          >
            <div className="mx-auto mb-4 relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <step.icon className="h-7 w-7 text-emerald-400" />
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-xs font-bold text-white">
                {i + 1}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}