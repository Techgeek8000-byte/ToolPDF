import { Metadata } from 'next';
import { toolMetaMap } from '@/lib/tool-meta';
import ToolPageClient from './_client';

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const meta = toolMetaMap[tool];
  if (!meta) {
    return {
      title: 'ToolPDF - Free PDF Tools',
      description: 'Free, fast, and private PDF tools processed entirely in your browser.',
    };
  }
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;
  const meta = toolMetaMap[tool];
  return <ToolPageClient toolSlug={tool} toolMeta={meta} />;
}
