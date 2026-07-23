'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Cpu,
  Lock,
  Eye,
  Zap,
  Globe,
  Heart,
  Sparkles,
  ArrowLeft,
  Users,
  Globe as GlobeIcon,
  Code,
  Fingerprint,
} from 'lucide-react';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import Footer from '@/components/toolpdf/Footer';

const stats = [
  { icon: FileText, value: '27+', label: 'PDF Tools', color: 'text-emerald-400' },
  { icon: Lock, value: '100%', label: 'Private', color: 'text-cyan-400' },
  { icon: Users, value: '50K+', label: 'Happy Users', color: 'text-purple-400' },
  { icon: Zap, value: '0s', label: 'Upload Time', color: 'text-amber-400' },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Privacy-First Architecture',
    description: 'Every file stays on your device. Zero server uploads, zero data collection, zero compromise. Your documents never leave your browser.',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Cpu,
    title: 'Browser-Based Processing',
    description: 'Powered by WebAssembly and modern JavaScript, all PDF operations run locally at near-native speed. No cloud dependency.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'No waiting for server queues. Process, convert, merge, and compress PDFs instantly — right in your browser tab.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'No installs, no plugins, no sign-ups. ToolPDF runs on any modern browser on desktop, tablet, or mobile.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Eye,
    title: 'Transparent & Open',
    description: 'No hidden tracking, no surprise data sharing. Our privacy policy is simple: we literally cannot see your files.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Heart,
    title: 'Free Core Tools',
    description: '15 essential PDF tools are completely free with generous daily limits. Premium unlocks advanced tools and higher limits.',
    color: 'from-pink-500 to-rose-500',
  },
];

const techStack = [
  { icon: GlobeIcon, label: 'Client-Side JS' },
  { icon: Code, label: 'WebAssembly' },
  { icon: Fingerprint, label: 'PDF-lib & pdfjs' },
  { icon: Sparkles, label: 'Next.js 16' },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0f]">
      <BackgroundEffects />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          {/* Back link */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to ToolPDF
            </a>
          </div>

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16"
          >
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] px-4 py-1.5 mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">About ToolPDF</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-gradient-emerald-cyan">Privacy-first</span> PDF tools
                <br />
                for everyone
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl">
                ToolPDF was built on a simple belief: your documents deserve the same
                privacy as your thoughts. No cloud uploads, no data harvesting, no
                compromise — just fast, free, browser-based PDF processing.
              </p>
            </div>
          </motion.section>

          {/* Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 text-center hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                >
                  <stat.icon className={`h-6 w-6 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl sm:text-3xl font-extrabold text-gradient-emerald-cyan">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Mission */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Our <span className="text-gradient-emerald-cyan">Mission</span>
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Most PDF tools ask you to upload sensitive documents to unknown servers.
                  Contracts, tax forms, medical records, legal filings — all sent across
                  the internet to servers you can&apos;t verify or trust.
                </p>
                <p>
                  ToolPDF flips that model entirely. Every operation — merge, split,
                  compress, encrypt, convert — happens <strong className="text-white">inside your browser</strong>.
                  Your files never leave your device. We literally cannot see them, even
                  if we wanted to.
                </p>
                <p>
                  Our mission is to make powerful PDF tools accessible to everyone without
                  forcing them to trade their privacy for convenience. Free core tools,
                  transparent pricing, and uncompromising data protection.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Feature highlights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Why ToolPDF is <span className="text-gradient-emerald-cyan">different</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Team */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                The <span className="text-gradient-emerald-cyan">Team</span>
              </h2>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-xl font-bold text-white">
                      O
                    </div>
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-md -z-10 animate-pulse-glow" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Osama</p>
                    <p className="text-sm text-slate-400">Founder & Solo Developer</p>
                  </div>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    ToolPDF is a one-person project built by Osama — a developer who
                    believes privacy isn&apos;t a feature, it&apos;s a right. Every line of code,
                    every design decision, and every tool was crafted with the principle
                    that users should never have to trust a server with their documents.
                  </p>
                  <p>
                    What started as a frustration with existing PDF tools demanding file
                    uploads has grown into a suite of 27+ tools serving 50,000+ users
                    worldwide — all running locally in the browser, all respecting your
                    privacy by design.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Technology */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Under the <span className="text-gradient-emerald-cyan">hood</span>
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed mb-8">
                <p>
                  ToolPDF leverages modern web technologies to deliver desktop-grade PDF
                  processing entirely in the browser:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <Code className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    <span><strong className="text-white">WebAssembly-powered engines</strong> for fast, native-quality PDF manipulation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <GlobeIcon className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                    <span><strong className="text-white">Client-side JavaScript</strong> — zero server round-trips, zero upload latency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Fingerprint className="h-4 w-4 text-purple-400 shrink-0 mt-1" />
                    <span><strong className="text-white">PDF-lib & pdfjs-dist</strong> — industry-standard open-source PDF libraries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-1" />
                    <span><strong className="text-white">Next.js 16 + React</strong> — modern, fast, and SEO-friendly framework</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech) => (
                  <div
                    key={tech.label}
                    className="flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] px-4 py-2"
                  >
                    <tech.icon className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-slate-400">{tech.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Closing */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready to process PDFs <span className="text-gradient-emerald-cyan">privately</span>?
              </h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                No sign-up, no upload, no tracking. Just open a tool and start.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
              >
                Start for Free
              </a>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
