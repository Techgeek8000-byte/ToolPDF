'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  ExternalLink,
} from 'lucide-react';

// Custom SVG icons for platforms not in lucide-react
function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.566 11.894c.477 0 .864.387.864.864a.862.862 0 01-.787.856c-.12.586-.68 1.053-1.368 1.122-.638.064-1.386.108-2.256.108-.87 0-1.62-.044-2.256-.108-.688-.069-1.248-.536-1.368-1.122a.862.862 0 01.077-.856.863.863 0 00-.787-.856.862.862 0 00-.856.787c.138.807.891 1.443 1.7 1.51.787.064 1.631.106 2.49.106s1.703-.042 2.49-.106c.809-.067 1.562-.703 1.7-1.51a.862.862 0 00-.787-.856zm-8.954.864a1.22 1.22 0 112.44 0 1.22 1.22 0 01-2.44 0zm5.777 1.22c-.88 0-1.596.715-1.596 1.596 0 .88.715 1.596 1.596 1.596.88 0 1.596-.715 1.596-1.596 0-.88-.715-1.596-1.596-1.596zm-3.866.238c-.477 0-.864.387-.864.864s.387.864.864.864.864-.387.864-.864-.387-.864-.864-.864z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function SocialShare({
  url: propUrl,
  title: propTitle = 'Check out ToolPDF - Every PDF Tool You\'ll Ever Need',
  description = 'Free, fast, and private PDF tools. Process your PDFs entirely in your browser.',
  className = '',
}: SocialShareProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const url = typeof window !== 'undefined'
    ? propUrl || window.location.href
    : propUrl || 'https://toolpdf.vercel.app';

  const title = propTitle || 'ToolPDF - Every PDF Tool You\'ll Ever Need';

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500/20 hover:text-sky-400',
    },
    {
      name: 'Reddit',
      icon: <RedditIcon className="h-4 w-4" />,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-500/20 hover:text-orange-400',
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600/20 hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon className="h-4 w-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700/20 hover:text-blue-300',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPlatform('copy');
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedPlatform('copy');
      setTimeout(() => setCopiedPlatform(null), 2000);
    }
  };

  const handleShare = (link: typeof shareLinks[0]) => {
    window.open(link.url, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Label */}
      <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Share:</span>

      {/* Platform buttons */}
      <div className="flex items-center gap-1">
        {shareLinks.map((link) => (
          <motion.button
            key={link.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(link)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 transition-all ${link.color}`}
            title={`Share on ${link.name}`}
            aria-label={`Share on ${link.name}`}
          >
            {link.icon}
          </motion.button>
        ))}

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 transition-all ${
            copiedPlatform === 'copy'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400'
          }`}
          title="Copy link"
          aria-label="Copy link"
        >
          <AnimatePresence mode="wait">
            {copiedPlatform === 'copy' ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Copy className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
