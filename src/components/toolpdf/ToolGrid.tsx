'use client';

import { useEffect, useRef, useState } from 'react';
import { tools, categories } from '@/lib/tool-definitions';
import ToolCard from './ToolCard';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function ToolGrid() {
  const { searchQuery } = useAppStore();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryFiltered = activeCategory === 'all'
    ? filtered
    : filtered.filter(t => t.category === activeCategory);

  // Auto-scroll to tools section when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery]);

  const freeCount = tools.filter(t => t.tier === 'free').length;
  const proCount = tools.filter(t => t.tier === 'premium').length;

  return (
    <section id="tools" ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {searchQuery.trim()
                ? <>Results for &quot;<span className="text-gradient-emerald-cyan">{searchQuery}</span>&quot;</>
                : 'All Tools'}
            </h2>
            <p className="mt-2 text-slate-400">
              {categoryFiltered.length} tool{categoryFiltered.length !== 1 ? 's' : ''} available — <span className="text-emerald-400">{freeCount} free</span> + <span className="text-violet-400">{proCount} pro</span>
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            All ({tools.length})
          </button>
          {categories.map(cat => {
            const count = tools.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {categoryFiltered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center text-slate-500"
        >
          <p className="text-lg">No tools found for &quot;{searchQuery}&quot;</p>
          <p className="mt-2 text-sm text-slate-600">Try searching for &quot;merge&quot;, &quot;convert&quot;, &quot;unlock&quot;, or &quot;read&quot;</p>
        </motion.div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryFiltered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
