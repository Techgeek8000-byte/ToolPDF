'use client';

import { FileText, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-md -z-10 animate-pulse-glow" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-gradient-emerald-cyan leading-tight">
                ToolPDF
              </span>
              <span className="brand-osama leading-none mt-0.5">
                a project by Osama
              </span>
            </div>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-white/20">·</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-white/20">·</span>
            <a href="mailto:support@toolpdf.com" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-500">
            Built with care. Your privacy matters.
          </p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            {[
              { icon: Lock, text: '256-bit Encryption' },
              { icon: Shield, text: 'No Server Uploads' },
              { icon: Shield, text: 'GDPR Compliant' },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/8 px-4 py-2"
              >
                <badge.icon className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400">{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} ToolPDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}