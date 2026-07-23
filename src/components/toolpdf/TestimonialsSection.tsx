'use client';

import { motion } from 'framer-motion';
import { Star, ShieldCheck, Users, Award, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    company: 'BrightPath Agency',
    quote: 'ToolPDF saved us hours every week. Merging client proposals used to take forever — now it\'s three clicks and done. The fact that nothing gets uploaded to a server gives me total peace of mind.',
    avatar: 'SM',
  },
  {
    name: 'David Chen',
    role: 'Software Engineer',
    company: 'StackForge Inc.',
    quote: 'As a developer, I love that all processing stays in the browser. No API keys, no server round-trips, no privacy trade-offs. It\'s exactly how PDF tools should work in 2025.',
    avatar: 'DC',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Legal Associate',
    company: 'Harper & Cole LLP',
    quote: 'Encrypting PDFs before sharing sensitive case files is crucial for our firm. ToolPDF\'s encryption tool is fast, reliable, and completely private — which is non-negotiable for legal documents.',
    avatar: 'MR',
  },
  {
    name: 'James O\'Brien',
    role: 'Freelance Designer',
    company: 'Self-employed',
    quote: 'I convert PDFs to images daily for client presentations. ToolPDF handles it flawlessly — no blurry outputs, no watermarks on the free tier, and no annoying signup walls. Just results.',
    avatar: 'JO',
  },
  {
    name: 'Aisha Patel',
    role: 'University Researcher',
    company: 'Stanford Lab',
    quote: 'Our research team processes hundreds of PDFs weekly for data extraction. ToolPDF\'s compress and split tools keep our archive organized without sacrificing quality. Truly indispensable.',
    avatar: 'AP',
  },
  {
    name: 'Tomás Guerrero',
    role: 'Startup Founder',
    company: 'NovaBuild',
    quote: 'We tried five different PDF platforms before finding ToolPDF. The others all wanted our files on their servers. ToolPDF processes everything locally — that\'s the future, and it\'s free.',
    avatar: 'TG',
  },
];

const trustBadges = [
  { icon: Star, text: '4.9/5 from 2,000+ reviews', color: 'text-amber-400' },
  { icon: ShieldCheck, text: 'Privacy-first by design', color: 'text-emerald-400' },
  { icon: Users, text: 'Trusted by 50,000+ users', color: 'text-cyan-400' },
  { icon: Award, text: 'Best PDF Tool Suite 2025', color: 'text-purple-400' },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12"
      >
        {trustBadges.map((badge, i) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            className="flex items-center gap-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] px-5 py-2.5"
          >
            <badge.icon className={`h-4 w-4 ${badge.color}`} />
            <span className="text-sm font-medium text-slate-300">{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Loved by <span className="text-gradient-emerald-cyan">thousands</span> of users
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          See what professionals, students, and businesses say about ToolPDF&apos;s privacy-first approach.
        </p>
      </motion.div>

      {/* Testimonial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-colors group"
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 h-5 w-5 text-white/[0.06] group-hover:text-emerald-500/20 transition-colors" />

            {/* Star rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, starIndex) => (
                <Star
                  key={starIndex}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed mb-5">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/[0.08] text-xs font-bold text-gradient-emerald-cyan">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-slate-500">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-slate-500">
          Join <span className="text-emerald-400 font-semibold">50,000+</span> users who trust ToolPDF for private, browser-based PDF processing.
        </p>
      </motion.div>
    </section>
  );
}
