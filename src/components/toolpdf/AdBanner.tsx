'use client';

import { useAppStore } from '@/lib/store';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  label?: string;
}

export default function AdBanner({
  slot = 'home-banner',
  format = 'auto',
  className = '',
  label,
}: AdBannerProps) {
  const { isPremium } = useAppStore();

  // Don't show ads for premium users
  if (isPremium) return null;

  const heightClass = format === 'horizontal' ? 'h-[90px] sm:h-[100px]' 
    : format === 'rectangle' ? 'h-[250px] sm:h-[280px]'
    : format === 'vertical' ? 'h-[600px]'
    : 'h-[100px] sm:h-[120px]';

  return (
    <div className={`w-full mx-auto max-w-4xl ${className}`}>
      <div className={`relative w-full ${heightClass} rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] overflow-hidden flex flex-col items-center justify-center gap-1.5`}>
        {/* Ad Label */}
        <div className="absolute top-1.5 left-3 flex items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-medium">Ad</span>
        </div>

        {/* Placeholder visual */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <svg className="h-3 w-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06]" />
            <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06]" />
          </div>
          <p className="text-[10px] text-slate-700">{label || `Ad Slot: ${slot}`}</p>
        </div>

        {/* 
          Replace the placeholder above with your actual Google AdSense code:
          
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true">
          </ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        */}
      </div>
    </div>
  );
}