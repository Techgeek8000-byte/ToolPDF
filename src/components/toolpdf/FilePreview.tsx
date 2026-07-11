'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, FileType, Table, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FilePreviewProps {
  files: (File | Blob)[];
  fileNames?: string[];
  label?: string;
  maxThumbnails?: number;
  toolId?: string;
}

function getIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') return ImageIcon;
  if (ext === 'docx' || ext === 'doc') return FileType;
  if (ext === 'xlsx' || ext === 'xls') return Table;
  return FileText;
}

// Single thumbnail for PDF or image
function ThumbnailFromBlob({ blob, index }: { blob: Blob; index: number }) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const type = blob.type || '';

    if (type.startsWith('image/')) {
      const url = URL.createObjectURL(blob);
      if (!cancelled) setThumbUrl(url);
      return () => { cancelled = true; URL.revokeObjectURL(url); };
    }

    if (type === 'application/pdf' || (!type && (blob instanceof File ? blob.name.endsWith('.pdf') : false))) {
      // Render first page of PDF
      let pdfJsModule: typeof import('pdfjs-dist') | null = null;

      const renderThumb = async () => {
        try {
          pdfJsModule = await import('pdfjs-dist');
          if (typeof window !== 'undefined' && !pdfJsModule.GlobalWorkerOptions.workerSrc) {
            pdfJsModule.GlobalWorkerOptions.workerSrc =
              `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfJsModule.version}/build/pdf.worker.min.mjs`;
          }
          const arrayBuffer = await blob.arrayBuffer();
          const pdfDoc = await pdfJsModule.getDocument({ data: arrayBuffer }).promise;
          const page = await pdfDoc.getPage(1);
          const scale = 0.5;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (!cancelled) {
            setThumbUrl(canvas.toDataURL('image/jpeg', 0.7));
          }
          pdfDoc.destroy();
        } catch {
          // PDF rendering failed - will show icon fallback
        }
      };
      renderThumb();
    }

    return () => { cancelled = true; };
  }, [blob]);

  if (thumbUrl) {
    return (
      <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5">
        <img src={thumbUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
    );
  }

  // Fallback icon
  const name = blob instanceof File ? blob.name : (index === 0 ? 'document.pdf' : `page_${index + 1}.pdf`);
  const FIcon = getIcon(name);
  return (
    <div className="flex items-center justify-center w-full h-full rounded-lg border border-white/10 bg-white/5">
      <FIcon className="h-8 w-8 text-slate-500" />
    </div>
  );
}

// Image preview for image files
function ImagePreview({ blob, index }: { blob: Blob; index: number }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objUrl = URL.createObjectURL(blob);
    setUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [blob]);

  if (!url) return null;

  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
      <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover" />
    </div>
  );
}

export default function FilePreview({ files, fileNames, label, maxThumbnails = 6, toolId }: FilePreviewProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const displayFiles = files.slice(0, maxThumbnails);
  const hasMore = files.length > maxThumbnails;

  const openPreview = useCallback((index: number) => {
    setModalIndex(index);
    setShowModal(true);
  }, []);

  if (files.length === 0) return null;

  const getBlobType = (blob: Blob, idx: number) => {
    if (blob.type) return blob.type;
    const name = fileNames?.[idx] || (blob instanceof File ? blob.name : '');
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'image/png';
    if (ext === 'pdf') return 'application/pdf';
    if (ext === 'docx' || ext === 'doc') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (ext === 'xlsx' || ext === 'xls') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return '';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        {label && (
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{label}</span>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {displayFiles.map((file, i) => {
            const type = getBlobType(file, i);
            const isImage = type.startsWith('image/');

            return (
              <motion.button
                key={`preview-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openPreview(i)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/8 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                {isImage ? (
                  <ImagePreview blob={file} index={i} />
                ) : (
                  <ThumbnailFromBlob blob={file} index={i} />
                )}

                {/* Page number badge */}
                <div className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white/80 font-medium">
                  {fileNames?.[i] ? (fileNames[i].length > 12 ? fileNames[i].substring(0, 12) + '...' : fileNames[i]) : `#${i + 1}`}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors opacity-0 group-hover:opacity-100">
                  <Eye className="h-5 w-5 text-white" />
                </div>
              </motion.button>
            );
          })}

          {hasMore && (
            <div className="aspect-[3/4] rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1">
              <span className="text-lg font-bold text-slate-400">+{files.length - maxThumbnails}</span>
              <span className="text-[10px] text-slate-500">more</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Full Preview Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalIndex(Math.max(0, modalIndex - 1))}
                  disabled={modalIndex === 0}
                  className="rounded-lg bg-white/10 p-2 text-white/60 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-slate-300">
                  {modalIndex + 1} / {files.length}
                </span>
                <button
                  onClick={() => setModalIndex(Math.min(files.length - 1, modalIndex + 1))}
                  disabled={modalIndex === files.length - 1}
                  className="rounded-lg bg-white/10 p-2 text-white/60 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-white/10 p-2 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/5 flex items-center justify-center min-h-0">
              <PreviewModalContent blob={files[modalIndex]} index={modalIndex} fileNames={fileNames} />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function PreviewModalContent({ blob, index, fileNames }: { blob: Blob; index: number; fileNames?: string[] }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const type = blob.type || '';
    const name = fileNames?.[index] || (blob instanceof File ? blob.name : '');

    if (type.startsWith('image/')) {
      const url = URL.createObjectURL(blob);
      if (!cancelled) { setContent(url); setLoading(false); }
      return () => { cancelled = true; URL.revokeObjectURL(url); };
    }

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      // For PDFs in modal, use object URL for iframe or render to canvas
      const url = URL.createObjectURL(blob);
      if (!cancelled) { setContent(url); setLoading(false); }
      return () => { cancelled = true; URL.revokeObjectURL(url); };
    }

    setLoading(false);
    return () => { cancelled = true; };
  }, [blob, index, fileNames]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const type = blob.type || '';
  const name = fileNames?.[index] || (blob instanceof File ? blob.name : '');

  if (content && type.startsWith('image/')) {
    return <img src={content} alt={`Preview ${index + 1}`} className="max-w-full max-h-[80vh] object-contain" />;
  }

  if (content && (type === 'application/pdf' || name.endsWith('.pdf'))) {
    return (
      <iframe
        src={content}
        className="w-full h-[80vh] border-0"
        title={`PDF Preview ${index + 1}`}
      />
    );
  }

  // Fallback for non-previewable files
  const FIcon = getIcon(name);
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12">
      <FIcon className="h-16 w-16 text-slate-500" />
      <p className="text-sm text-slate-400">{name || 'File'}</p>
      <p className="text-xs text-slate-500">Preview not available for this file type</p>
    </div>
  );
}