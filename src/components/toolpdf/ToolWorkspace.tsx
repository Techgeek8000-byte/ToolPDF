'use client';

import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { useAppStore } from '@/lib/store';
import { tools } from '@/lib/tool-definitions';
import FileUploader from './FileUploader';
import { AnimatedProgressBar } from './ProgressBar';
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
} from '@/lib/pdf-tools';
import { PDFDocument } from 'pdf-lib';

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
    rotateDegrees,
    setRotateDegrees,
    protectPassword,
    setProtectPassword,
    watermarkText,
    setWatermarkText,
    compressQuality,
    setCompressQuality,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [splitCount, setSplitCount] = useState<number>(2);

  // Determine accept types and multiple based on tool
  const getUploaderProps = () => {
    switch (activeTool) {
      case 'pdf-to-word':
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
      case 'word-to-pdf':
        return { accept: '.docx,.doc', multiple: false, maxFiles: 1 };
      case 'image-to-pdf':
        return { accept: '.png,.jpg,.jpeg', multiple: true, maxFiles: 20 };
      case 'merge-pdf':
        return { accept: '.pdf', multiple: true, maxFiles: 20 };
      default:
        return { accept: '.pdf', multiple: false, maxFiles: 1 };
    }
  };

  const uploaderProps = getUploaderProps();

  // ALL hooks must be called before any conditional returns
  const handleProcess = useCallback(async () => {
    if (!isPremium && dailyUsageCount >= 10) {
      setShowLimitModal(true);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(0);
    setProcessedFiles([]);

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
          // Auto-generate equal page ranges based on split count
          const arrayBuffer = await uploadedFiles[0].arrayBuffer();
          const tempPdf = await PDFDocument.load(arrayBuffer);
          const totalPages = tempPdf.getPageCount();
          if (totalPages < splitCount) {
            throw new Error(`PDF has only ${totalPages} pages, cannot split into ${splitCount} parts`);
          }
          const pagesPerPart = Math.floor(totalPages / splitCount);
          const remainder = totalPages % splitCount;
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
        default:
          throw new Error('Unknown tool');
      }

      incrementUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [
    activeTool,
    uploadedFiles,
    splitRanges,
    compressQuality,
    rotateDegrees,
    protectPassword,
    watermarkText,
    isPremium,
    dailyUsageCount,
    setIsProcessing,
    setProgress,
    setProcessedFiles,
    incrementUsage,
  ]);

  const handleBack = useCallback(() => {
    resetTool();
    setView('home');
  }, [resetTool, setView]);

  // Now we can safely check conditions
  const tool = tools.find((t) => t.id === activeTool);
  if (!tool) return null;

  const isComingSoon = COMING_SOON_TOOLS.includes(tool.id);
  const Icon = tool.icon;
  const canProcess = uploadedFiles.length > 0 && !isProcessing;
  const remainingUses = Math.max(0, 10 - dailyUsageCount);

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
    } else {
      const baseName = uploadedFiles[0]?.name.replace(/\.[^.]+$/, '') || 'output';
      const suffix =
        activeTool === 'merge-pdf'
          ? '_merged'
          : activeTool === 'compress-pdf'
            ? '_compressed'
            : activeTool === 'rotate-pdf'
              ? '_rotated'
              : activeTool === 'protect-pdf'
                ? '_protected'
                : activeTool === 'watermark-pdf'
                  ? '_watermarked'
                  : activeTool === 'word-to-pdf'
                    ? ''
                    : activeTool === 'image-to-pdf'
                      ? ''
                      : '_processed';
      const ext = activeTool === 'word-to-pdf' || activeTool === 'image-to-pdf' ? '.pdf' : '.pdf';
      saveAs(processedFiles[0], `${baseName}${suffix}${ext}`);
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
                  }`
                }
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              PDF will be divided into <span className="text-cyan-400 font-medium">{splitCount} equal parts</span> automatically
            </p>
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
              🔒 Your PDF will be password-protected. The file will require this password to open.
            </p>
            {!isPremium && (
              <p className="mt-1.5 text-xs text-violet-400/80">
                💎 For stronger AES-256 encryption,{' '}
                <button
                  type="button"
                  onClick={() => useAppStore.getState().setPremium(true)}
                  className="underline underline-offset-2 hover:text-violet-300 transition-colors"
                >
                  upgrade to Pro
                </button>
              </p>
            )}
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
      case 'compress-pdf': return `Compress ${count} File${count !== 1 ? 's' : ''}`;
      case 'pdf-to-word': return 'Convert to Word';
      case 'word-to-pdf': return 'Convert to PDF';
      case 'pdf-to-image': return 'Convert to Images';
      case 'image-to-pdf': return `Convert ${count} Image${count !== 1 ? 's' : ''} to PDF`;
      case 'rotate-pdf': return `Rotate ${count} File${count !== 1 ? 's' : ''}`;
      case 'protect-pdf': return 'Protect PDF';
      case 'watermark-pdf': return 'Add Watermark';
      default: return 'Process';
    }
  };

  const getUploadHint = () => {
    switch (activeTool) {
      case 'pdf-to-word': return 'PDF files up to 100MB';
      case 'word-to-pdf': return 'DOCX files up to 100MB';
      case 'image-to-pdf': return 'PNG/JPEG images up to 100MB each';
      default: return 'PDF files up to 100MB each';
    }
  };

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

  const getFileIcon = () => {
    if (activeTool === 'image-to-pdf') return ImageIcon;
    return FileText;
  };
  const FileIcon = getFileIcon();

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
                  onClick={() => {
                    useAppStore.getState().setPremium(true);
                    setShowLimitModal(false);
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
                >
                  Go Pro
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
        </div>

        <div className="ml-auto hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-300">Files never leave your device</span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {!hasResults ? (
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

              {/* Usage counter */}
              {!isPremium && uploadedFiles.length > 0 && (
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

              {/* Process button */}
              {uploadedFiles.length > 0 && (
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
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      processLabel()
                    )}
                  </button>

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
              )}

              {/* Ad Placeholder - Between upload and footer */}
              {!isPremium && (
                <div className="mt-10">
                  <AdPlaceholder label="Tool Page - Below Process" />
                </div>
              )}
            </motion.div>
          ) : (
            /* Results */
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
                      {Math.max(
                        0,
                        Math.round(
                          (1 - processedFiles[0].size / uploadedFiles[0].size) * 100
                        )
                      )}
                      %
                    </p>
                  </div>
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
                      <FileIcon className="h-5 w-5 text-emerald-400 shrink-0" />
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

                {!isPremium && (
                  <p className="mt-2 text-xs text-slate-500">
                    Want batch processing?{' '}
                    <button
                      onClick={() => useAppStore.getState().setPremium(true)}
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      Upgrade to Pro
                    </button>
                  </p>
                )}
              </div>

              {/* Ad Placeholder - Results page */}
              {!isPremium && (
                <div className="mt-10">
                  <AdPlaceholder label="Tool Page - Results" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// AdSense Placeholder Component
function AdPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-8 flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 text-slate-600">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-xs font-medium">Advertisement</span>
      </div>
      <p className="text-[10px] text-slate-700">{label}</p>
      {/* Replace with actual AdSense code: */}
      {/* <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXXXXX" data-ad-slot="XXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
    </div>
  );
}