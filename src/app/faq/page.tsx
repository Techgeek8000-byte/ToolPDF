'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Lock,
  CreditCard,
  Globe,
  HardDrive,
  Monitor,
  Zap,
  HelpCircle,
  ChevronDown,
  Mail,
  RefreshCw,
  Scissors,
  Image,
  Languages,
  Smartphone,
  BookOpen,
  Users,
  Settings,
  CloudOff,
} from 'lucide-react';
import BackgroundEffects from '@/components/toolpdf/BackgroundEffects';
import Header from '@/components/toolpdf/Header';
import Footer from '@/components/toolpdf/Footer';

const faqCategories = [
  {
    title: 'Privacy & Security',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    items: [
      {
        question: 'Are my files uploaded to any server?',
        answer: 'No. All file processing happens entirely in your browser using client-side JavaScript and WebAssembly. Your files never leave your device — we literally cannot access them even if we wanted to. This is the core principle behind ToolPDF.',
      },
      {
        question: 'Is my data stored or collected?',
        answer: 'We collect only anonymous usage analytics (page views, tool usage frequency) to improve the service. We never collect, store, or have access to any files you process. No personal data, no file contents, no metadata from your documents.',
      },
      {
        question: 'How does ToolPDF protect my privacy?',
        answer: 'ToolPDF uses a privacy-first architecture: (1) All processing runs in your browser via WebAssembly, (2) No files are ever transmitted to any server, (3) We use HTTPS encryption for all connections, (4) We follow GDPR guidelines, (5) We don\'t require account creation or personal information to use free tools.',
      },
      {
        question: 'Can I use ToolPDF for confidential documents?',
        answer: 'Absolutely. Since files never leave your device, ToolPDF is ideal for processing confidential documents like contracts, legal filings, medical records, and tax forms. Many legal and financial professionals use ToolPDF specifically because of its privacy guarantees.',
      },
      {
        question: 'Is ToolPDF GDPR compliant?',
        answer: 'Yes. Since we don\'t collect personal files or require account creation for free usage, there is minimal personal data to manage. Our anonymous analytics comply with GDPR requirements. You can contact us at support@toolpdf.com to exercise your GDPR rights.',
      },
    ],
  },
  {
    title: 'Pricing & Plans',
    icon: CreditCard,
    color: 'text-purple-400',
    items: [
      {
        question: 'Is ToolPDF really free?',
        answer: 'Yes! 15 core PDF tools are completely free with generous daily limits (10 files per day, 100MB max file size). No sign-up required, no watermarks on outputs, no hidden fees. Premium plans unlock all 27+ tools, higher limits, and advanced features.',
      },
      {
        question: 'What are the premium plans?',
        answer: 'We offer flexible plans: Weekly ($1/week), Monthly ($2/month, 50% off original price), Yearly ($12/year, 50% off), and Lifetime ($25 one-time). Premium includes unlimited files, all 27+ tools, 500MB max file size, batch processing, no watermarks, and priority speed.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime through your LemonSqueezy dashboard or by emailing support@toolpdf.com. Monthly plans have no refunds after 48 hours. Lifetime plans include a 30-day money-back guarantee.',
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'Absolutely none. Our pricing is transparent — you pay exactly what\'s listed. No surprise charges, no auto-renewal traps (you control renewals), no premium-only "features" that should be basic.',
      },
    ],
  },
  {
    title: 'Supported Formats & Limits',
    icon: FileText,
    color: 'text-cyan-400',
    items: [
      {
        question: 'What file formats does ToolPDF support?',
        answer: 'ToolPDF supports: PDF (all operations), Word (.docx → PDF, PDF → Word), Images (JPG, PNG, WebP, BMP → PDF, PDF → Images), Excel (.xlsx → PDF), PowerPoint (.pptx → PDF), and HTML (PDF → HTML). More formats are being added regularly.',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'Free users can process files up to 100MB each. Premium users can process files up to 500MB each. These limits exist because processing happens in your browser — very large files need more device memory.',
      },
      {
        question: 'How many files can I process per day?',
        answer: 'Free users can process up to 10 files per day. Premium users have unlimited daily processing. The daily counter resets at midnight UTC.',
      },
      {
        question: 'Can I process multiple files at once?',
        answer: 'Yes! The Merge PDF tool lets you combine multiple files. Premium users also get batch processing — process multiple files through the same tool in one session.',
      },
    ],
  },
  {
    title: 'Browser & Device Support',
    icon: Monitor,
    color: 'text-amber-400',
    items: [
      {
        question: 'Which browsers are supported?',
        answer: 'ToolPDF works on all modern browsers: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+, and Opera 76+. We recommend Chrome or Edge for the best performance with WebAssembly-powered tools.',
      },
      {
        question: 'Does ToolPDF work on mobile devices?',
        answer: 'Yes! ToolPDF is fully responsive and works on smartphones and tablets. However, for very large files (>50MB), we recommend using a desktop browser for better performance and memory availability.',
      },
      {
        question: 'Do I need to install any software?',
        answer: 'No installation required. ToolPDF runs entirely in your web browser — no plugins, no extensions, no desktop apps. Just visit the website and start processing files immediately.',
      },
      {
        question: 'Why is a tool running slowly?',
        answer: 'Processing speed depends on your device\'s CPU and available memory. Very large PDFs or complex operations (like OCR or high-quality compression) may take longer. Closing other browser tabs can free up memory and improve speed.',
      },
    ],
  },
  {
    title: 'Tools & Features',
    icon: Settings,
    color: 'text-cyan-400',
    items: [
      {
        question: 'How many PDF tools are available?',
        answer: 'ToolPDF offers 27+ tools including: Merge PDF, Split PDF, Compress PDF, Rotate PDF, Encrypt PDF (password protect), Unlock PDF (remove password), Watermark PDF, PDF to Word, Word to PDF, PDF to Image, Image to PDF, PDF to HTML, HTML to PDF, PDF to Excel, Excel to PDF, PDF to PowerPoint, PowerPoint to PDF, Page Numbers, Organize Pages, Repair PDF, Flatten PDF, Crop PDF, Redact PDF, Sign PDF, Annotate PDF, and File Reader.',
      },
      {
        question: 'What\'s the difference between free and premium tools?',
        answer: '15 core tools are free: Merge, Split, Compress, Rotate, Encrypt, PDF to Image, Image to PDF, Word to PDF, PDF to Word, and more. Premium unlocks advanced tools like Unlock PDF, PDF to HTML, Batch Processing, Remove Watermark, and higher file size limits.',
      },
      {
        question: 'Does compressing PDFs reduce quality?',
        answer: 'Our compression tool offers multiple quality levels. "Light compression" preserves near-original quality with modest size reduction. "Maximum compression" aggressively reduces file size with some quality trade-off. You can preview results before downloading.',
      },
      {
        question: 'Can I password-protect a PDF?',
        answer: 'Yes, our Encrypt PDF tool lets you add a password to any PDF. You can choose 128-bit or 256-bit AES encryption. The encrypted PDF will require the password to open — and since processing happens locally, your password never travels across the internet.',
      },
    ],
  },
];

export default function FAQPage() {
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
                <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">Frequently Asked Questions</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Got <span className="text-gradient-emerald-cyan">questions</span>?
                <br />
                We&apos;ve got answers.
              </h1>

              <p className="mt-4 text-lg text-slate-400 max-w-xl">
                Everything you need to know about ToolPDF — privacy, pricing,
                formats, browsers, and more.
              </p>
            </div>
          </motion.section>

          {/* FAQ sections */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
            {faqCategories.map((category, catIndex) => (
              <motion.section
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.5 }}
                className="mb-10 sm:mb-12"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {category.title}
                  </h2>
                </div>

                {/* FAQ items - accordion using details/summary */}
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <motion.details
                      key={item.question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + catIndex * 0.1 + itemIndex * 0.04, duration: 0.3 }}
                      className="group rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] transition-colors"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 text-sm sm:text-[15px] font-medium text-slate-200 hover:text-white transition-colors list-none select-none">
                        <span className="flex-1">{item.question}</span>
                        <ChevronDown className="h-4 w-4 text-slate-500 group-open:rotate-180 transition-transform duration-200 shrink-0" />
                      </summary>
                      <div className="px-5 pb-4 pt-1 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05] mt-1">
                        {item.answer}
                      </div>
                    </motion.details>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Still have questions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10 text-center">
              <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Still have questions?
              </h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Can&apos;t find what you&apos;re looking for? Reach out to our support team —
                we typically respond within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
              >
                Contact Us
              </a>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
