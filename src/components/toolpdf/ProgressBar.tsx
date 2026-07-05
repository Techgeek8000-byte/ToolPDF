'use client';

import { motion } from 'framer-motion';

export default function ProgressBar() {
  // This is a standalone component; the actual progress value is passed via props in ToolWorkspace
  // But we create it here for reusability pattern
  return null;
}

// We'll use this as a named export for inline progress bars
export function AnimatedProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #10b981, #06b6d4)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 progress-shimmer" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {progress}%
        </span>
      </div>
    </div>
  );
}