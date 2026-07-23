'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Download,
  RotateCcw,
  Crown,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Copy,
  Eye,
  BookOpen,
  Lock,
  Tags,
  Unlock,
  GripVertical,
  FileSearch,
  FileOutput,
  FileCode,
  Eraser,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { useAppStore } from '@/lib/store';
import { tools } from '@/lib/tool-definitions';
import FileUploader from './FileUploader';
import SocialShare from './SocialShare';
import { AnimatedProgressBar } from './ProgressBar';
import { toast } from '@/hooks/use-toast';
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  pdfToImages,
  rotatePDF,
  protectPDF,
  addWatermark,
  pdfToWord,
  wordToPdf,
  imageToPdf,
  formatFileSize,
  COMING_SOON_TOOLS,
  extractPages,
  reorderPages,
  removeWatermark,
  editMetadata,
  getMetadata,
  pdfToHtml,
  convertToPdf,
  pdfToExcel,
  excelToPdf,
  signPdf,
  numberPages,
  flattenPdf,
  repairPdf,
  redactPdf,
  annotatePdf,
} from '@/lib/pdf-tools';
import { unlockPDF, checkPdfEncryption } from '@/lib/unlock-pdf';
import { readFileContent, readPdfContent, getAcceptString, getFileCategory, formatFileSize as formatFileSizeReader } from '@/lib/file-reader';
import { PDFDocument } from 'pdf-lib';
import { incrementUsage as incUsage, getTodayTotal } from '@/lib/usage-counter';

// --- Skeleton Components ---
function FileListSkeleton() {
  return (
    <div className="mt-4 space-y-2">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3"
        >
          <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-48 rounded bg-white/10 animate-pulse" />
            <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-4"
    >
      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-4">
        <Loader2 className="h-5 w-5 text-emerald-400 animate-spin shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              animate={{ width: ['0%', '30%', '55%', '70%', '85%', '92%', '96%'] }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </div>
          <div className="h-2 w-32 rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        {[1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3"
          >
            <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-2.5 w-16 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Compression size bar ---
function CompressionBar({
  originalSize,
  estimatedSize,
}: {
  originalSize: number;
  estimatedSize: number;
}) {
  const ratio = Math.max(0.1, Math.min(1, estimatedSize / originalSize));
  const savedPercent = Math.max(0, Math.round((1 - estimatedSize / originalSize) * 100));

  return (
    <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">Compression Estimate</span>
        <span className="text-xs font-medium text-emerald-400">
          ~{savedPercent}% smaller
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white">
          {formatFileSize(originalSize)}
        </span>
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
          />
        </div>
        <span className="text-sm font-medium text-emerald-400">
          ~{formatFileSize(estimatedSize)}
        </span>
      </div>
    </div>
  );
}

// --- Premium wall ---
function PremiumWall({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-8 text-center"
    >
      <Crown className="mx-auto h-10 w-10 text-violet-400" />
      <h3 className="mt-4 text-xl font-bold text-white">Pro Feature</h3>
      <p className="mt-2 text-sm text-slate-400">
        This tool requires a Pro subscription. Upgrade now for unlimited access to all premium features.
      </p>
      <button
        onClick={onUpgradeClick}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-transform"
      >
        <Sparkles className="h-4 w-4" />
        Upgrade to Pro
      </button>
    </motion.div>
  );
}

// --- File content viewer ---
function FileContentViewer({ result }: { result: any }) {
  if (!result) return null;

  if (result.type === 'image' && result.imageData) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <img
          src={result.imageData}
          alt="File preview"
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      </div>
    );
  }

  if (result.type === 'table' && result.previewData) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                {result.previewData[0]?.map((_: any, i: number) => (
                  <th key={i} className="px-3 py-2 text-left text-xs font-medium text-slate-400 border-b border-white/10">
                    Col {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.previewData.slice(0, 50).map((row: string[], i: number) => (
                <tr key={i} className="hover:bg-white/[0.03]">
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="px-3 py-1.5 text-xs text-slate-300 border-b border-white/[0.05] truncate max-w-[200px]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.metadata && (
          <div className="px-4 py-2 bg-white/[0.03] border-t border-white/10 text-xs text-slate-500">
            {result.metadata.rows} rows × {result.metadata.cols} columns
            {result.metadata.sheets && ` · Sheets: ${result.metadata.sheets.join(', ')}`}
          </div>
        )}
      </div>
    );
  }

  // Text / HTML / PDF-text content
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="max-h-96 overflow-y-auto p-4">
        <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed break-words">
          {result.content}
        </pre>
      </div>
      {result.metadata && (
        <div className="px-4 py-2 bg-white/[0.03] border-t border-white/10 text-xs text-slate-500 flex flex-wrap gap-3">
          {result.metadata.pages && <span>{result.metadata.pages} pages</span>}
          {result.metadata.title && <span>Title: {result.metadata.title}</span>}
          {result.metadata.author && <span>Author: {result.metadata.author}</span>}
          {result.metadata.rows && <span>{result.metadata.rows} rows</span>}
        </div>
      )}
    </div>
  );
}

export default function ToolWorkspace() {
  const {
    activeTool,
    uploadedFiles,
    setUploadedFiles,
    processedFiles,
    setProcessedFiles,
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    setView,
    resetTool,
    isPremium,
    dailyUsageCount,
    incrementUsage,
    splitRanges,
    setSplitRanges,
    splitCount,
    setSplitCount,
    rotateDegrees,
    setRotateDegrees,
    protectPassword,
    setProtectPassword,
    watermarkText,
    setWatermarkText,
    compressQuality,
    setCompressQuality,
    unlockPassword,
    setUnlockPassword,
    extractPagesInput,
    setExtractPagesInput,
    reorderPageOrder,
    setReorderPageOrder,
    removeWatermarkText,
    setRemoveWatermarkText,
    pdfMetadata,
    setPdfMetadata,
    fileReadResult,
    setFileReadResult,
    signText,
    setSignText,
    annotationText,
    setAnnotationText,
    annotationPage,
    setAnnotationPage,
    redactText,
    setRedactText,
    flattenIncludeAnnotations,
    setFlattenIncludeAnnotations,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [showPremiumWall, setShowPremiumWall] = useState(false);

  // Load metadata when file uploaded for edit-metadata tool
  useEffect(() => {
    if (activeTool === 'edit-metadata' && uploadedFiles.length > 0) {
      getMetadata(uploadedFiles[0]).then(meta => {
        setPdfMetadata(meta);
      }).catch(() => {});
    }
  }, [activeTool, uploadedFiles, setPdfMetadata]);

  // Check encryption for unlock-pdf
  useEffect(() => {
    if (activeTool === 'unlock-pdf' && uploadedFiles.length > 0) {
      checkPdfEncryption(uploadedFiles[0]).then(result => {
        setIsEncrypted(result.isEncrypted);
      }).catch(() => {});
    }
  }, [activeTool, uploadedFiles]);

  // Get total pages for split/extract/reorder tools
  useEffect(() => {
    if (['split-pdf', 'extract-pages', 'reorder-pages'].includes(activeTool || '') && uploadedFiles.length > 0) {
      uploadedFiles[0].arrayBuffer().then(ab => {
        PDFDocument.load(ab).then(pdf => {
          setTotalPages(pdf.getPageCount());
          // For reorder, set default order
          if (activeTool === 'reorder-pages' && reorderPageOrder.length === 0) {
            setReorderPageOrder(Array.from({ length: pdf.getPageCount() }, (_, i) => i + 1));
          }
        }).catch(() => {});
      });
    }
  }, [activeTool, uploadedFiles, reorderPageOrder.length, setReorderPageOrder]);

  // Determine accept types and multiple based on tool
  const getUploaderProps = () => {
    switch (activeTool) {
      case 'pdf-to-word':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'word-to-pdf':
        return { accept: '.docx,.doc', multiple: false, maxFiles: 1 };
      case 'image-to-pdf':
        return { accept: '.png,.jpg,.jpeg,.webp', multiple: true, maxFiles: 20 };
      case 'merge-pdf':
        return { accept: '.pdf', multiple: true, maxFiles: 20 };
      case 'file-reader':
        return { accept: getAcceptString(), multiple: false, maxFiles: 1 };
      case 'convert-to-pdf':
        return { accept: '.txt,.md,.csv,.json,.xml,.yaml,.yml,.html,.css,.js,.ts,.py,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.pptx', multiple: false, maxFiles: 1 };
      case 'pdf-to-html':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'unlock-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'pdf-to-excel':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'excel-to-pdf':
        return { accept: '.xlsx,.xls,.csv,.ods', multiple: false, maxFiles: 1 };
      case 'sign-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'number-pages':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'flatten-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'repair-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'redact-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'annotate-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'view-pdf':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      default:
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
    }
  };

  const uploaderProps = getUploaderProps();

  // Check if this is a premium tool
  const toolDef = tools.find((t) => t.id === activeTool);
  const isPremiumTool = toolDef?.tier === 'premium';

  const handleProcess = useCallback(async () => {
    if (!isPremium && dailyUsageCount >= 10) {
      setShowLimitModal(true);
      return;
    }

    // Check premium wall for premium tools
    if (isPremiumTool && !isPremium) {
      setShowPremiumWall(true);
      return;
    }

    setError(null);
    setShowPremiumWall(false);
    setIsProcessing(true);
    setProgress(0);
    setProcessedFiles([]);
    setFileReadResult(null);

    try {
      const onProgress = (p: number) => setProgress(p);

      switch (activeTool) {
        case 'merge-pdf': {
          if (uploadedFiles.length < 2) {
            throw new Error('Please select at least 2 files to merge');
          }
          const blob = await mergePDFs(uploadedFiles, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'split-pdf': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select exactly 1 file to split');
          }
          const arrayBuffer = await uploadedFiles[0].arrayBuffer();
          const tempPdf = await PDFDocument.load(arrayBuffer);
          const totalPgs = tempPdf.getPageCount();
          if (totalPgs < splitCount) {
            throw new Error(`PDF has only ${totalPgs} pages, cannot split into ${splitCount} parts`);
          }
          const pagesPerPart = Math.floor(totalPgs / splitCount);
          const remainder = totalPgs % splitCount;
          const ranges: string[] = [];
          let currentPage = 1;
          for (let i = 0; i < splitCount; i++) {
            const extra = i < remainder ? 1 : 0;
            const end = currentPage + pagesPerPart + extra - 1;
            ranges.push(currentPage === end ? `${currentPage}` : `${currentPage}-${end}`);
            currentPage = end + 1;
          }
          const blobs = await splitPDF(uploadedFiles[0], ranges, onProgress);
          if (blobs.length === 0) throw new Error('Split failed');
          setProcessedFiles(blobs);
          break;
        }
        case 'extract-pages': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select exactly 1 PDF file');
          }
          if (!extractPagesInput.trim()) {
            throw new Error('Please enter page numbers to extract');
          }
          // Parse page input: "1, 3, 5-8"
          const pageNumbers = parsePageInput(extractPagesInput);
          if (pageNumbers.length === 0) {
            throw new Error('Invalid page numbers. Use format: 1, 3, 5-8');
          }
          const blob = await extractPages(uploadedFiles[0], pageNumbers, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'reorder-pages': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select exactly 1 PDF file');
          }
          if (reorderPageOrder.length === 0) {
            throw new Error('Please specify the new page order');
          }
          const blob = await reorderPages(uploadedFiles[0], reorderPageOrder, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'compress-pdf': {
          const blob = await compressPDF(uploadedFiles[0], compressQuality, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'pdf-to-word': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select a PDF file');
          }
          const blob = await pdfToWord(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'word-to-pdf': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select a Word document');
          }
          const blob = await wordToPdf(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'pdf-to-image': {
          const blobs = await pdfToImages(uploadedFiles[0], onProgress);
          setProcessedFiles(blobs);
          break;
        }
        case 'image-to-pdf': {
          if (uploadedFiles.length < 1) {
            throw new Error('Please select at least 1 image');
          }
          const blob = await imageToPdf(uploadedFiles, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'rotate-pdf': {
          const blob = await rotatePDF(uploadedFiles[0], rotateDegrees, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'protect-pdf': {
          if (!protectPassword) {
            throw new Error('Please enter a password');
          }
          const blob = await protectPDF(uploadedFiles[0], protectPassword, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'watermark-pdf': {
          if (!watermarkText) {
            throw new Error('Please enter watermark text');
          }
          const blob = await addWatermark(uploadedFiles[0], watermarkText, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'remove-watermark': {
          if (!removeWatermarkText) {
            throw new Error('Please enter the watermark text to remove');
          }
          const blob = await removeWatermark(uploadedFiles[0], removeWatermarkText, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'edit-metadata': {
          const blob = await editMetadata(uploadedFiles[0], pdfMetadata, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'unlock-pdf': {
          if (!unlockPassword) {
            throw new Error('Please enter the PDF password to unlock');
          }
          const blob = await unlockPDF(uploadedFiles[0], unlockPassword, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'pdf-to-html': {
          const blob = await pdfToHtml(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'convert-to-pdf': {
          const blob = await convertToPdf(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'file-reader': {
          const result = await readFileContent(uploadedFiles[0], onProgress);
          setFileReadResult(result);
          setIsProcessing(false);
          incrementUsage();
          const toolDef = tools.find((t) => t.id === activeTool);
          if (toolDef) incUsage(activeTool!, toolDef.name);
          toast({ title: 'File Read Successfully', description: 'Content displayed below' });
          return; // Don't go through the normal download flow
        }
        case 'view-pdf': {
          const result = await readPdfContent(uploadedFiles[0], onProgress);
          setFileReadResult(result);
          setIsProcessing(false);
          incrementUsage();
          const toolDef = tools.find((t) => t.id === activeTool);
          if (toolDef) incUsage(activeTool!, toolDef.name);
          toast({ title: 'PDF Read Successfully', description: `${result.metadata?.pages || 0} pages extracted` });
          return;
        }
        case 'pdf-to-excel': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select a PDF file');
          }
          const blob = await pdfToExcel(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'excel-to-pdf': {
          if (uploadedFiles.length !== 1) {
            throw new Error('Please select an Excel/CSV file');
          }
          const blob = await excelToPdf(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'sign-pdf': {
          if (!signText) {
            throw new Error('Please enter signature text');
          }
          const blob = await signPdf(uploadedFiles[0], signText, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'number-pages': {
          const blob = await numberPages(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'flatten-pdf': {
          const blob = await flattenPdf(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'repair-pdf': {
          const blob = await repairPdf(uploadedFiles[0], onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'redact-pdf': {
          if (!redactText) {
            throw new Error('Please enter text to redact');
          }
          const blob = await redactPdf(uploadedFiles[0], redactText, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        case 'annotate-pdf': {
          if (!annotationText) {
            throw new Error('Please enter annotation text');
          }
          const blob = await annotatePdf(uploadedFiles[0], annotationText, annotationPage, onProgress);
          setProcessedFiles([blob]);
          break;
        }
        default:
          throw new Error('Unknown tool');
      }

      incrementUsage();
      const toolDef = tools.find((t) => t.id === activeTool);
      if (toolDef) {
        incUsage(activeTool!, toolDef.name);
      }

      toast({
        title: 'Processing Complete',
        description: uploadedFiles.length > 1
          ? `${uploadedFiles.length} files processed successfully`
          : 'File processed successfully',
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Processing failed';
      setError(errMsg);
      toast({
        title: 'Processing Failed',
        description: errMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    activeTool, uploadedFiles, splitRanges, splitCount, compressQuality,
    rotateDegrees, protectPassword, watermarkText, removeWatermarkText,
    unlockPassword, extractPagesInput, reorderPageOrder, pdfMetadata,
    signText, annotationText, annotationPage, redactText, flattenIncludeAnnotations,
    isPremium, isPremiumTool, dailyUsageCount,
    setIsProcessing, setProgress, setProcessedFiles, setFileReadResult,
    incrementUsage,
  ]);

  const handleBack = useCallback(() => {
    resetTool();
    setView('home');
  }, [resetTool, setView]);

  // Parse page input like "1, 3, 5-8"
  function parsePageInput(input: string): number[] {
    const pages: number[] = [];
    const parts = input.split(',').map(s => s.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        if (start && end && start <= end) {
          for (let i = start; i <= end; i++) pages.push(i);
        }
      } else {
        const num = parseInt(part);
        if (num > 0) pages.push(num);
      }
    }
    return pages;
  }

  const tool = tools.find((t) => t.id === activeTool);
  if (!tool) return null;

  const isComingSoon = COMING_SOON_TOOLS.includes(tool.id);
  const Icon = tool.icon;
  const canProcess = uploadedFiles.length > 0 && !isProcessing;
  const remainingUses = Math.max(0, 10 - dailyUsageCount);

  // File reader / PDF viewer: show read result instead of download
  const isReaderTool = activeTool === 'file-reader' || activeTool === 'view-pdf';

  const handleDownload = () => {
    if (processedFiles.length === 0) return;

    if (activeTool === 'split-pdf') {
      const baseName = uploadedFiles[0]?.name.replace('.pdf', '') || 'document';
      processedFiles.forEach((blob, i) => {
        saveAs(blob, `${baseName}_part${i + 1}_of_${processedFiles.length}.pdf`);
      });
    } else if (activeTool === 'pdf-to-image') {
      processedFiles.forEach((blob, i) => {
        saveAs(blob, `page_${i + 1}.png`);
      });
    } else if (activeTool === 'pdf-to-word') {
      const baseName = uploadedFiles[0]?.name.replace('.pdf', '') || 'output';
      saveAs(processedFiles[0], `${baseName}.docx`);
    } else if (activeTool === 'pdf-to-html') {
      const baseName = uploadedFiles[0]?.name.replace('.pdf', '') || 'output';
      saveAs(processedFiles[0], `${baseName}.html`);
    } else if (activeTool === 'pdf-to-excel') {
      const baseName = uploadedFiles[0]?.name.replace('.pdf', '') || 'output';
      saveAs(processedFiles[0], `${baseName}.xlsx`);
    } else {
      const baseName = uploadedFiles[0]?.name.replace(/\.[^.]+$/, '') || 'output';
      const suffix =
        activeTool === 'merge-pdf' ? '_merged'
        : activeTool === 'compress-pdf' ? '_compressed'
        : activeTool === 'rotate-pdf' ? '_rotated'
        : activeTool === 'protect-pdf' ? '_protected'
        : activeTool === 'watermark-pdf' ? '_watermarked'
        : activeTool === 'remove-watermark' ? '_cleaned'
        : activeTool === 'unlock-pdf' ? '_unlocked'
        : activeTool === 'edit-metadata' ? '_metadata'
        : activeTool === 'extract-pages' ? '_extracted'
        : activeTool === 'reorder-pages' ? '_reordered'
        : activeTool === 'convert-to-pdf' ? ''
        : activeTool === 'word-to-pdf' ? ''
        : activeTool === 'image-to-pdf' ? ''
        : activeTool === 'pdf-to-excel' ? ''
        : activeTool === 'excel-to-pdf' ? ''
        : activeTool === 'sign-pdf' ? '_signed'
        : activeTool === 'number-pages' ? '_numbered'
        : activeTool === 'flatten-pdf' ? '_flattened'
        : activeTool === 'repair-pdf' ? '_repaired'
        : activeTool === 'redact-pdf' ? '_redacted'
        : activeTool === 'annotate-pdf' ? '_annotated'
        : '_processed';
      const ext = '.pdf';
      saveAs(processedFiles[0], `${baseName}${suffix}${ext}`);
    }

    toast({
      title: 'Downloaded',
      description: processedFiles.length > 1
        ? `${processedFiles.length} files downloaded`
        : 'File downloaded successfully',
    });
  };

  // Copy text content to clipboard (for file-reader / view-pdf)
  const handleCopyContent = () => {
    if (fileReadResult?.content) {
      navigator.clipboard.writeText(fileReadResult.content).then(() => {
        toast({ title: 'Copied', description: 'Content copied to clipboard' });
      });
    }
  };

  const getToolOptions = () => {
    switch (activeTool) {
      case 'split-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Split Into <span className="text-slate-500">(equal parts)</span>
            </label>
            <div className="flex gap-3">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setSplitCount(n)}
                  className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                    splitCount === n
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {totalPages > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                PDF has <span className="text-cyan-400 font-medium">{totalPages} pages</span> — will be divided into <span className="text-cyan-400 font-medium">{splitCount} equal parts</span>
              </p>
            )}
          </div>
        );
      case 'extract-pages':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pages to Extract
            </label>
            <input
              type="text"
              value={extractPagesInput}
              onChange={(e) => setExtractPagesInput(e.target.value)}
              placeholder="e.g., 1, 3, 5-8, 12"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            {totalPages > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                PDF has <span className="text-emerald-400 font-medium">{totalPages} pages</span>. Enter page numbers (1-based).
              </p>
            )}
          </div>
        );
      case 'reorder-pages':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Page Order
            </label>
            <input
              type="text"
              value={reorderPageOrder.join(', ')}
              onChange={(e) => {
                const nums = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => n > 0);
                setReorderPageOrder(nums);
              }}
              placeholder="e.g., 3, 1, 2, 5, 4"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            {totalPages > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                PDF has <span className="text-emerald-400 font-medium">{totalPages} pages</span>. Enter the new order as comma-separated page numbers. Omit pages to delete them.
              </p>
            )}
          </div>
        );
      case 'rotate-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rotation Angle
            </label>
            <div className="flex gap-3">
              {([90, 180, 270] as const).map((deg) => (
                <button
                  key={deg}
                  onClick={() => setRotateDegrees(deg)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    rotateDegrees === deg
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        );
      case 'protect-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={protectPassword}
              onChange={(e) => setProtectPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <p className="mt-2 text-xs text-emerald-400/70">
              Your PDF will be password-protected. The file will require this password to open.
            </p>
          </div>
        );
      case 'unlock-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              PDF Password
            </label>
            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Enter the password to unlock"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            {isEncrypted && (
              <p className="mt-2 text-xs text-violet-400/80">
                This PDF is password-protected. Enter the correct password to remove encryption.
              </p>
            )}
            {!isEncrypted && uploadedFiles.length > 0 && (
              <p className="mt-2 text-xs text-emerald-400/80">
                This PDF does not require a password to open. It may still have permission restrictions.
              </p>
            )}
            <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300 uppercase">Pro Feature</span>
              </div>
              <p className="text-xs text-slate-400">
                PDF password removal is a premium feature. You must know the correct password — this tool cannot crack unknown passwords.
              </p>
            </div>
          </div>
        );
      case 'watermark-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g., CONFIDENTIAL, DRAFT, your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        );
      case 'remove-watermark':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Watermark Text to Remove
            </label>
            <input
              type="text"
              value={removeWatermarkText}
              onChange={(e) => setRemoveWatermarkText(e.target.value)}
              placeholder="Enter the watermark text that was added"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              Enter the exact watermark text. The tool will cover the watermark area with a clean overlay.
            </p>
            <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300 uppercase">Pro Feature</span>
              </div>
              <p className="text-xs text-slate-400">
                Watermark removal is a premium feature for professional document cleanup.
              </p>
            </div>
          </div>
        );
      case 'compress-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Compression Quality
            </label>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setCompressQuality(q)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all capitalize ${
                    compressQuality === q
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        );
      case 'edit-metadata':
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
              <input
                type="text"
                value={pdfMetadata.title}
                onChange={(e) => setPdfMetadata({ ...pdfMetadata, title: e.target.value })}
                placeholder="Document title"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
              <input
                type="text"
                value={pdfMetadata.author}
                onChange={(e) => setPdfMetadata({ ...pdfMetadata, author: e.target.value })}
                placeholder="Author name"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
              <input
                type="text"
                value={pdfMetadata.subject}
                onChange={(e) => setPdfMetadata({ ...pdfMetadata, subject: e.target.value })}
                placeholder="Subject description"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Keywords</label>
              <input
                type="text"
                value={pdfMetadata.keywords}
                onChange={(e) => setPdfMetadata({ ...pdfMetadata, keywords: e.target.value })}
                placeholder="Keywords (comma-separated)"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        );
      case 'image-to-pdf':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              <span className="text-emerald-400 font-medium">{uploadedFiles.length}</span> image{uploadedFiles.length !== 1 ? 's' : ''} selected
              {uploadedFiles.length > 1 && <span className="text-slate-500"> — Each image will become a page</span>}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports PNG and JPEG. Images will be centered and scaled to fit A4 pages.
            </p>
          </div>
        );
      case 'pdf-to-word':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Text content will be extracted from your PDF and converted to a Word document.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Complex layouts, images, and formatting may not be preserved perfectly.
            </p>
          </div>
        );
      case 'word-to-pdf':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Your Word document will be converted to a standard PDF format.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Text content will be extracted and formatted. Complex formatting may vary.
            </p>
          </div>
        );
      case 'pdf-to-html':
        return (
          <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300 uppercase">Pro Feature</span>
            </div>
            <p className="text-sm text-slate-300">
              PDF content will be extracted into clean HTML format for web publishing.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Output: .html file with structured paragraphs and page markers.
            </p>
          </div>
        );
      case 'convert-to-pdf':
        return (
          <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300 uppercase">Pro Feature</span>
            </div>
            <p className="text-sm text-slate-300">
              Your file will be converted to PDF format. Supports text, code, CSV, JSON, DOCX, XLSX, images, and 30+ more formats.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {uploadedFiles.length > 0 && `Detected format: ${getFileCategory(uploadedFiles[0].name.split('.').pop()?.toLowerCase() || '')}`}
            </p>
          </div>
        );
      case 'file-reader':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Read and preview any file type directly in your browser.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports 50+ formats including text, code, CSV, JSON, PDF, DOCX, XLSX, images, and more.
            </p>
          </div>
        );
      case 'view-pdf':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Read your PDF content page by page in a clean, copyable format.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Text content will be extracted for easy reading, searching, and copying.
            </p>
          </div>
        );
      case 'sign-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Signature Text
            </label>
            <input
              type="text"
              value={signText}
              onChange={(e) => setSignText(e.target.value)}
              placeholder="e.g., John Doe, Approved, Signed"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              The signature text will be placed on the bottom-right of each page.
            </p>
          </div>
        );
      case 'annotate-pdf':
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Annotation Text
              </label>
              <input
                type="text"
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="e.g., Note: Review this section"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Page Number
              </label>
              <input
                type="number"
                min={1}
                value={annotationPage}
                onChange={(e) => setAnnotationPage(parseInt(e.target.value) || 1)}
                placeholder="1"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">
                The annotation will be placed on the specified page number (1-based).
              </p>
            </div>
          </div>
        );
      case 'redact-pdf':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text to Redact
            </label>
            <input
              type="text"
              value={redactText}
              onChange={(e) => setRedactText(e.target.value)}
              placeholder="Enter the text you want to redact/cover"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              All instances of this text will be covered with a black rectangle throughout the document.
            </p>
          </div>
        );
      case 'number-pages':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Page numbers will be automatically added to the bottom-center of each page.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              No additional settings needed — just upload and process.
            </p>
          </div>
        );
      case 'flatten-pdf':
        return (
          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <input
                type="checkbox"
                checked={flattenIncludeAnnotations}
                onChange={(e) => setFlattenIncludeAnnotations(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50"
              />
              <label className="text-sm text-slate-300">
                Include annotations when flattening
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Flattening converts interactive form fields and annotations into static content that cannot be edited.
            </p>
          </div>
        );
      case 'repair-pdf':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Your PDF will be re-processed to fix structural issues, remove corruption, and rebuild the internal structure.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              No additional settings needed — just upload and process.
            </p>
          </div>
        );
      case 'pdf-to-excel':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Tables and data from your PDF will be extracted and converted to Excel format.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Best results with PDFs containing structured tables and data.
            </p>
          </div>
        );
      case 'excel-to-pdf':
        return (
          <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3">
            <p className="text-sm text-slate-300">
              Your spreadsheet will be converted to a standard PDF format.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports XLSX, XLS, CSV, and ODS formats.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const processLabel = () => {
    if (!activeTool) return 'Process';
    const count = uploadedFiles.length;
    switch (activeTool) {
      case 'merge-pdf': return `Merge ${count} Files`;
      case 'split-pdf': return 'Split PDF';
      case 'extract-pages': return 'Extract Pages';
      case 'reorder-pages': return 'Reorder Pages';
      case 'compress-pdf': return `Compress File`;
      case 'pdf-to-word': return 'Convert to Word';
      case 'word-to-pdf': return 'Convert to PDF';
      case 'pdf-to-image': return 'Convert to Images';
      case 'image-to-pdf': return `Convert ${count} Image${count !== 1 ? 's' : ''} to PDF`;
      case 'rotate-pdf': return `Rotate File`;
      case 'protect-pdf': return 'Protect PDF';
      case 'unlock-pdf': return 'Unlock PDF';
      case 'watermark-pdf': return 'Add Watermark';
      case 'remove-watermark': return 'Remove Watermark';
      case 'edit-metadata': return 'Save Metadata';
      case 'pdf-to-html': return 'Convert to HTML';
      case 'convert-to-pdf': return 'Convert to PDF';
      case 'file-reader': return 'Read File';
      case 'view-pdf': return 'Read PDF';
      case 'pdf-to-excel': return 'Convert to Excel';
      case 'excel-to-pdf': return 'Convert to PDF';
      case 'sign-pdf': return 'Sign PDF';
      case 'number-pages': return 'Add Page Numbers';
      case 'flatten-pdf': return 'Flatten PDF';
      case 'repair-pdf': return 'Repair PDF';
      case 'redact-pdf': return 'Redact PDF';
      case 'annotate-pdf': return 'Annotate PDF';
      default: return 'Process';
    }
  };

  const getUploadHint = () => {
    switch (activeTool) {
      case 'pdf-to-word': return 'PDF files up to 100MB';
      case 'word-to-pdf': return 'DOCX files up to 100MB';
      case 'image-to-pdf': return 'PNG/JPEG images up to 100MB each';
      case 'file-reader': return 'Any file type — text, code, CSV, PDF, DOCX, images & more';
      case 'convert-to-pdf': return 'TXT, CSV, JSON, DOCX, XLSX, PNG, JPG & 30+ more formats';
      case 'pdf-to-html': return 'PDF files up to 100MB';
      case 'unlock-pdf': return 'Password-protected PDF files';
      case 'pdf-to-excel': return 'PDF files with tables and data';
      case 'excel-to-pdf': return 'XLSX, XLS, CSV, or ODS spreadsheet files';
      case 'sign-pdf': return 'PDF files up to 100MB';
      case 'number-pages': return 'PDF files up to 100MB';
      case 'flatten-pdf': return 'PDF files with form fields';
      case 'repair-pdf': return 'Damaged or corrupted PDF files';
      case 'redact-pdf': return 'PDF files up to 100MB';
      case 'annotate-pdf': return 'PDF files up to 100MB';
      default: return 'PDF files up to 100MB each';
    }
  };

  // Compression estimate
  const getCompressionEstimate = (): number | undefined => {
    if (activeTool !== 'compress-pdf' || uploadedFiles.length === 0) return undefined;
    const ratios: Record<string, number> = { low: 0.5, medium: 0.35, high: 0.2 };
    return uploadedFiles[0].size * (ratios[compressQuality] || 0.35);
  };

  const compressionEstimate = getCompressionEstimate();

  // Coming Soon UI
  if (isComingSoon) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: tool.iconBg }}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
          <p className="mt-2 text-slate-400">{tool.description}</p>

          <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <Crown className="mx-auto h-8 w-8 text-violet-400" />
            <h3 className="mt-3 text-lg font-semibold text-violet-300">Coming Soon</h3>
            <p className="mt-2 text-sm text-slate-400">
              This tool is under development and will be available soon.
            </p>
          </div>

          <button
            onClick={handleBack}
            className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all tools
          </button>
        </motion.div>
      </div>
    );
  }

  const hasResults = processedFiles.length > 0 && !isProcessing && !error;
  const hasReadResult = fileReadResult && !isProcessing && !error && isReaderTool;
  const hasAnyResult = hasResults || hasReadResult;

  return (
    <div className="min-h-[80vh]">
      {/* Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#13131a] p-8 text-center"
            >
              <Crown className="mx-auto h-10 w-10 text-violet-400" />
              <h3 className="mt-4 text-xl font-bold text-white">Daily Limit Reached</h3>
              <p className="mt-2 text-sm text-slate-400">
                You&apos;ve used all 10 free conversions today. Upgrade to Pro for unlimited access.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Maybe Tomorrow
                </button>
                <button
                  onClick={() => { setShowCheckoutModal(true); setShowLimitModal(false); }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
                >
                  Upgrade to Pro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/5"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to all tools</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: tool.iconBg }}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">{tool.name}</h1>
          {isPremiumTool && (
            <div className="flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5">
              <Crown className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] font-medium text-violet-300">PRO</span>
            </div>
          )}
          {tool.isNew && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
              <span className="text-[10px] font-medium text-emerald-300">NEW</span>
            </div>
          )}
        </div>

        <div className="ml-auto hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-300">Files never leave your device</span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {!hasAnyResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Upload */}
              <FileUploader
                accept={uploaderProps.accept}
                multiple={uploaderProps.multiple}
                maxFiles={uploaderProps.maxFiles}
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                hint={getUploadHint()}
              />

              {/* Tool options */}
              {uploadedFiles.length > 0 && getToolOptions()}

              {/* Compression estimate bar */}
              {activeTool === 'compress-pdf' && uploadedFiles.length > 0 && !isProcessing && (
                <CompressionBar
                  originalSize={uploadedFiles[0].size}
                  estimatedSize={compressionEstimate || uploadedFiles[0].size * 0.35}
                />
              )}

              {/* Premium wall */}
              {showPremiumWall && (
                <PremiumWall onUpgradeClick={() => setShowCheckoutModal(true)} />
              )}

              {/* Usage counter */}
              {!isPremium && uploadedFiles.length > 0 && !isPremiumTool && (
                <p className="mt-4 text-xs text-center text-slate-500">
                  {remainingUses} of 10 free uses remaining today
                </p>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 text-center text-sm text-rose-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Processing skeleton */}
              {isProcessing && <ProcessingSkeleton />}

              {/* Process button */}
              {uploadedFiles.length > 0 && !isProcessing && !showPremiumWall && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleProcess}
                    disabled={!canProcess}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold transition-all ${
                      canProcess
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {processLabel()}
                  </button>
                </motion.div>
              )}

              {/* Progress bar */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <AnimatedProgressBar progress={progress} />
                  <p className="mt-2 text-center text-sm text-slate-400">
                    {progress < 100 ? 'Processing...' : 'Finalizing...'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : hasReadResult ? (
            /* File Reader / PDF Viewer Result */
            <motion.div
              key="read-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30"
              >
                {activeTool === 'view-pdf' ? <Eye className="h-10 w-10 text-emerald-400" /> : <BookOpen className="h-10 w-10 text-emerald-400" />}
              </motion.div>

              <h2 className="text-2xl font-bold text-white text-center">
                {activeTool === 'view-pdf' ? 'PDF Content' : 'File Content'}
              </h2>
              <p className="mt-2 text-slate-400 text-center">
                {fileReadResult.metadata?.pages
                  ? `${fileReadResult.metadata.pages} pages extracted`
                  : 'Content read successfully'}
              </p>

              {/* Copy button */}
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  Copy Content
                </button>
                <button
                  onClick={() => { setFileReadResult(null); setProgress(0); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Read Another
                </button>
              </div>

              {/* File content display */}
              <FileContentViewer result={fileReadResult} />
            </motion.div>
          ) : (
            /* Results (download) */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white">Done!</h2>
              <p className="mt-2 text-slate-400">
                Your file{processedFiles.length > 1 ? 's have' : ' has'} been processed successfully.
              </p>

              {/* Size comparison for compress */}
              {activeTool === 'compress-pdf' && uploadedFiles.length > 0 && (
                <div className="mt-6 inline-flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-6 py-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Original</p>
                    <p className="text-lg font-bold text-white">
                      {formatFileSize(uploadedFiles[0].size)}
                    </p>
                  </div>
                  <span className="text-slate-500">→</span>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Compressed</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {formatFileSize(processedFiles[0].size)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Saved</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {Math.max(0, Math.round((1 - processedFiles[0].size / uploadedFiles[0].size) * 100))}%
                    </p>
                  </div>
                </div>
              )}

              {/* Size comparison bar for non-compress tools */}
              {activeTool !== 'compress-pdf' && uploadedFiles.length > 0 && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-sm">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-400">{uploadedFiles[0]?.name}</span>
                  <span className="text-slate-500">{formatFileSize(uploadedFiles[0]?.size || 0)}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400 font-medium">
                    {formatFileSize(processedFiles[0]?.size || 0)}
                  </span>
                </div>
              )}

              {/* Results list for multi-output */}
              {processedFiles.length > 1 && (
                <div className="mt-6 max-h-48 overflow-y-auto no-scrollbar space-y-2 text-left">
                  {processedFiles.map((blob, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3"
                    >
                      <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-white flex-1 truncate">
                        {activeTool === 'split-pdf'
                          ? `${uploadedFiles[0]?.name.replace('.pdf', '')}_part${i + 1}.pdf`
                          : `page_${i + 1}.png`}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatFileSize(blob.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Download button */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Download className="h-5 w-5" />
                  {processedFiles.length > 1
                    ? `Download ${processedFiles.length} Files`
                    : 'Download File'}
                </button>

                <button
                  onClick={() => {
                    setProcessedFiles([]);
                    setProgress(0);
                  }}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Process Another
                </button>

                {/* Social Share */}
                <div className="mt-2">
                  <SocialShare
                    title={`I just used ${tool.name} on ToolPDF`}
                    description={tool.description}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
