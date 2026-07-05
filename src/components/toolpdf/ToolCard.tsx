'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { COMING_SOON_TOOLS } from '@/lib/pdf-tools';

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  category: string;
}

interface ToolCardProps {
  tool: ToolDef;
  index: number;
}

export default function ToolCard({ tool, index }: ToolCardProps) {
  const { setView, setActiveTool, resetTool } = useAppStore();
  const isComingSoon = COMING_SOON_TOOLS.includes(tool.id);
  const Icon = tool.icon;

  const handleClick = () => {
    resetTool();
    setActiveTool(tool.id);
    setView('tool');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={handleClick}
        className="group relative w-full rounded-2xl p-6 text-left transition-all duration-300 gradient-border cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04), transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: tool.iconBg,
            }}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
            {tool.description}
          </p>

          {/* Coming Soon badge (if any future tools) */}
          {isComingSoon && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1">
              <span className="text-xs font-medium text-violet-300">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </button>
    </motion.div>
  );
}