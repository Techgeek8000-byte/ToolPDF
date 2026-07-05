'use client';

import { motion } from 'framer-motion';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #10b981, transparent 70%)',
          top: '-10%',
          left: '-5%',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #06b6d4, transparent 70%)',
          top: '40%',
          right: '-10%',
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full opacity-15 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
          bottom: '-5%',
          left: '30%',
        }}
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />
    </div>
  );
}