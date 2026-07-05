'use client';

import { useEffect, useRef } from 'react';
import { tools } from '@/lib/tool-definitions';
import ToolCard from './ToolCard';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function ToolGrid() {
  const { searchQuery } = useAppStore();
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to tools section when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery]);

  return (
    <section id="tools" ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {searchQuery.trim()
            ? <>Results for &quot;<span className="text-gradient-emerald-cyan">{searchQuery}</span>&quot;</>
            : 'All Tools'}
        </h2>
        <p className="mt-2 text-slate-400">
          {filtered.length} tool{filtered.length !== 1 ? 's' : ''} available
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center text-slate-500"
        >
          <p className="text-lg">No tools found for &quot;{searchQuery}&quot;</p>
          <p className="mt-2 text-sm text-slate-600">Try searching for &quot;merge&quot;, &quot;convert&quot;, &quot;image&quot;, or &quot;protect&quot;</p>
        </motion.div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}