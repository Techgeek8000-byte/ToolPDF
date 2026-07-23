'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { ArrowDown, FileText } from 'lucide-react';
import { getTodayTotal } from '@/lib/usage-counter';

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const numericTarget = parseInt(target);
  const [display, setDisplay] = useState(() => {
    if (isNaN(numericTarget)) return target;
    return '0';
  });

  useEffect(() => {
    if (isNaN(numericTarget)) return;
    let current = 0;
    const increment = Math.ceil(numericTarget / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        current = numericTarget;
        clearInterval(timer);
      }
      setDisplay(current + suffix);
    }, 30);
    return () => clearInterval(timer);
  }, [numericTarget, suffix]);

  return <span>{display}</span>;
}

const floatingIcons = [
  { x: '10%', y: '20%', delay: 0, size: 40 },
  { x: '80%', y: '15%', delay: 1, size: 32 },
  { x: '70%', y: '70%', delay: 2, size: 36 },
  { x: '20%', y: '75%', delay: 0.5, size: 28 },
  { x: '50%', y: '10%', delay: 1.5, size: 24 },
];

export default function HeroSection() {
  const toolsRef = useRef<HTMLDivElement>(null);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    setTodayTotal(getTodayTotal());
  }, []);

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16">
      {/* Floating PDF icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-emerald-500/10 pointer-events-none"
          style={{ left: icon.x, top: icon.y }}
          animate={{
            y: [0, -15, 5, 0],
            rotate: [0, 5, -3, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: icon.delay,
          }}
        >
          <FileText size={icon.size} />
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="text-gradient-emerald-cyan">Every</span> PDF Tool
          <br />
          You&apos;ll Ever Need
        </motion.h1>

        {/* Futuristic brand tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
          className="mt-4 inline-flex items-center gap-2"
        >
          <div className="neon-badge relative rounded-full px-4 py-1.5 bg-white/[0.02] scanline-overlay overflow-hidden">
            <span className="brand-osama-large text-xs">
              A PROJECT BY OSAMA
            </span>
          </div>
        </motion.div>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Free, fast, and private. Your files never leave your device.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { value: '27', suffix: '+', label: 'Tools' },
            { value: '100', suffix: '%', label: 'Free' },
            { value: '100', suffix: '%', label: 'Private' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-emerald-cyan">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
          {todayTotal > 0 && (
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-emerald-cyan">
                <AnimatedCounter target={String(todayTotal)} />
              </div>
              <div className="mt-1 text-sm text-slate-500">Files Processed Today</div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={scrollToTools}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            Start for Free
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        </motion.div>
      </div>

      {/* Scroll anchor */}
      <div ref={toolsRef} className="h-1" />
    </section>
  );
}