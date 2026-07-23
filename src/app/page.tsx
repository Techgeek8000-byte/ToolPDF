'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load ALL content with SSR disabled to avoid pdfjs-dist SSR errors
const ToolPDFApp = dynamic(() => import('@/components/toolpdf/ToolPDFApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 animate-pulse">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 animate-pulse">Loading ToolPDF...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <ToolPDFApp />;
}
