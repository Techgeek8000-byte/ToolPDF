'use client';

import { FileText, Search, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface HeaderProps {
  onUpgradeClick?: () => void;
}

export default function Header({ onUpgradeClick }: HeaderProps) {
  const { searchQuery, setSearchQuery, setPremium, isPremium, currentView, setView, resetTool } = useAppStore();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // If user is on a tool page and starts searching, go back to home to show results
    if (currentView === 'tool' && value.trim().length > 0) {
      resetTool();
      setView('home');
    }
  };

  const handlePremiumClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      setPremium(true);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-strong"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => {
              const { setView, resetTool } = useAppStore.getState();
              resetTool();
              setView('home');
            }}
            className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-md -z-10 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient-emerald-cyan leading-tight">
                ToolPDF
              </span>
              <span className="brand-osama leading-none mt-0.5">
                a project by Osama
              </span>
            </div>
          </button>

          {/* Search */}
          <div className="relative hidden sm:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {!isPremium ? (
              <button
                onClick={handlePremiumClick}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Go Premium</span>
              </button>
            ) : (
              <button
                onClick={() => setPremium(false)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 px-4 py-2 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
              >
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Pro Active</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}