'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image as ImageIcon, FileType, ArrowDownToLine } from 'lucide-react';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  files: File[];
  onFilesChange: (files: File[]) => void;
  hint?: string;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return ImageIcon;
  if (ext === 'docx' || ext === 'doc') return FileType;
  return FileText;
}

export default function FileUploader({
  accept = '.pdf',
  multiple = true,
  maxFiles = 20,
  maxSize = 100 * 1024 * 1024, // 100MB
  files,
  onFilesChange,
  hint,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getAcceptLabel = () => {
    if (accept.includes('.docx')) return 'Word documents';
    if (accept.includes('.png')) return 'PNG/JPEG images';
    return 'PDF files';
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      const oversized = fileArray.find((f) => f.size > maxSize);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds maximum size (100MB)`);
        return;
      }

      const total = files.length + fileArray.length;
      if (total > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const acceptExts = accept.split(',').map((s) => s.trim().toLowerCase());
      const filtered = fileArray.filter((f) => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        return acceptExts.some((a) => a === ext) || accept === '*';
      });

      if (filtered.length === 0) {
        setError(`No valid files selected. Please select ${getAcceptLabel()}.`);
        return;
      }

      onFilesChange([...files, ...filtered]);
    },
    [files, accept, maxFiles, maxSize, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-[1.02]'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
        }`}
        animate={
          isDragOver
            ? { scale: 1.02, borderColor: 'rgba(16,185,129,0.8)' }
            : { scale: 1, borderColor: 'rgba(255,255,255,0.1)' }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Glow effect during drag */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <motion.div
          animate={isDragOver ? { y: -8 } : { y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
              isDragOver
                ? 'bg-emerald-500/20 scale-110'
                : 'bg-white/5'
            }`}
          >
            {isDragOver ? (
              <ArrowDownToLine className="h-8 w-8 text-emerald-400 animate-bounce" />
            ) : (
              <Upload className="h-8 w-8 text-white/40" />
            )}
          </div>

          <p className="text-lg font-semibold text-white">
            {isDragOver
              ? `Drop ${getAcceptLabel().toLowerCase()} here`
              : `Drag & drop your ${getAcceptLabel().toLowerCase()} here`}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            or{' '}
            <span className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              browse files
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {hint || `${getAcceptLabel()} up to 100MB each${multiple ? ` · Max ${maxFiles} files` : ''}`}
          </p>
        </motion.div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-sm text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 max-h-60 overflow-y-auto no-scrollbar"
          >
            {files.map((file, i) => {
              const FIcon = getFileIcon(file.name);
              return (
                <motion.div
                  key={`${file.name}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3"
                >
                  <FIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
