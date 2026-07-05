import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolpdf.vercel.app'; // Replace with your actual domain

  const toolPages = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'pdf-to-word',
    'word-to-pdf',
    'pdf-to-image',
    'image-to-pdf',
    'rotate-pdf',
    'protect-pdf',
    'watermark-pdf',
  ];

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const toolSitemaps = toolPages.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolSitemaps];
}