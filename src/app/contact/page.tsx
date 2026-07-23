'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  User,
  Send,
  HelpCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import Footer from '@/components/toolpdf/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API endpoint
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8"
          >
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] px-4 py-1.5 mb-6"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">Contact Support</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Get in <span className="text-gradient-emerald-cyan">touch</span>
              </h1>

              <p className="mt-4 text-lg text-slate-400 max-w-xl">
                Have a question, issue, or suggestion? We&apos;re here to help.
                Our support team typically responds within 24 hours.
              </p>
            </div>
          </motion.section>

          {/* Contact content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-slate-400 mb-6">
                        Thank you for reaching out. We&apos;ll get back to you at
                        <span className="text-emerald-400"> {formData.email}</span> within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', message: '' });
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/[0.08] border border-white/[0.08] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.12] transition-colors"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your question, issue, or feedback..."
                          className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 w-full justify-center"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar info */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                {/* Email direct */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6"
                >
                  <Mail className="h-5 w-5 text-emerald-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2">Email Us Directly</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    For urgent issues or detailed inquiries, email us directly.
                  </p>
                  <a
                    href="mailto:support@toolpdf.com"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@toolpdf.com
                    <ArrowLeft className="h-3 w-3 rotate-180" />
                  </a>
                </motion.div>

                {/* Response time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6"
                >
                  <Clock className="h-5 w-5 text-cyan-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2">Response Time</h3>
                  <p className="text-sm text-slate-400">
                    We typically respond within <span className="text-cyan-400 font-semibold">24 hours</span>.
                    Premium users get priority support with faster response times.
                  </p>
                </motion.div>

                {/* FAQ redirect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6"
                >
                  <HelpCircle className="h-5 w-5 text-purple-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2">Check Our FAQ</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Many common questions about privacy, pricing, formats, and browser
                    support are already answered in our FAQ.
                  </p>
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/[0.08] border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.12] transition-colors"
                  >
                    Browse FAQ
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </a>
                </motion.div>

                {/* Privacy note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2">Privacy Guaranteed</h3>
                  <p className="text-sm text-slate-400">
                    Your contact information is used only to respond to your inquiry.
                    We never share, sell, or misuse your personal data.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
