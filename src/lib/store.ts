import { create } from 'zustand';

interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
}

interface AppState {
  currentView: 'home' | 'tool';
  activeTool: string | null;
  uploadedFiles: File[];
  processedFiles: Blob[];
  isProcessing: boolean;
  progress: number;
  dailyUsageCount: number;
  isPremium: boolean;
  searchQuery: string;
  // Tool-specific settings
  splitRanges: string;
  splitCount: number;
  rotateDegrees: 90 | 180 | 270;
  protectPassword: string;
  watermarkText: string;
  compressQuality: 'low' | 'medium' | 'high';
  unlockPassword: string;
  extractPagesInput: string;
  reorderPageOrder: number[];
  removeWatermarkText: string;
  pdfMetadata: PdfMetadata;
  // New tool settings
  signText: string;
  annotationText: string;
  annotationPage: number;
  redactText: string;
  flattenIncludeAnnotations: boolean;
  // File reader result
  fileReadResult: any | null;
  // actions
  setView: (view: 'home' | 'tool') => void;
  setActiveTool: (tool: string | null) => void;
  setUploadedFiles: (files: File[]) => void;
  addUploadedFiles: (files: File[]) => void;
  removeUploadedFile: (index: number) => void;
  setProcessedFiles: (files: Blob[]) => void;
  setIsProcessing: (val: boolean) => void;
  setProgress: (val: number) => void;
  incrementUsage: () => void;
  setPremium: (val: boolean) => void;
  resetTool: () => void;
  setSearchQuery: (q: string) => void;
  setSplitRanges: (r: string) => void;
  setSplitCount: (n: number) => void;
  setRotateDegrees: (d: 90 | 180 | 270) => void;
  setProtectPassword: (p: string) => void;
  setWatermarkText: (t: string) => void;
  setCompressQuality: (q: 'low' | 'medium' | 'high') => void;
  setUnlockPassword: (p: string) => void;
  setExtractPagesInput: (p: string) => void;
  setReorderPageOrder: (o: number[]) => void;
  setRemoveWatermarkText: (t: string) => void;
  setPdfMetadata: (m: PdfMetadata) => void;
  setSignText: (t: string) => void;
  setAnnotationText: (t: string) => void;
  setAnnotationPage: (p: number) => void;
  setRedactText: (t: string) => void;
  setFlattenIncludeAnnotations: (b: boolean) => void;
  setFileReadResult: (r: any | null) => void;
}

const getDailyUsage = (): number => {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const stored = localStorage.getItem('toolpdf-usage');
  if (!stored) return 0;
  try {
    const { date, count } = JSON.parse(stored);
    if (date === today) return count;
    localStorage.setItem('toolpdf-usage', JSON.stringify({ date: today, count: 0 }));
    return 0;
  } catch {
    return 0;
  }
};

const saveDailyUsage = (count: number) => {
  if (typeof window === 'undefined') return;
  const today = new Date().toDateString();
  localStorage.setItem('toolpdf-usage', JSON.stringify({ date: today, count }));
};

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  activeTool: null,
  uploadedFiles: [],
  processedFiles: [],
  isProcessing: false,
  progress: 0,
  dailyUsageCount: getDailyUsage(),
  isPremium: false,
  searchQuery: '',
  // Tool-specific settings
  splitRanges: '',
  splitCount: 2,
  rotateDegrees: 90,
  protectPassword: '',
  watermarkText: '',
  compressQuality: 'medium',
  unlockPassword: '',
  extractPagesInput: '',
  reorderPageOrder: [],
  removeWatermarkText: '',
  pdfMetadata: { title: '', author: '', subject: '', keywords: '' },
  signText: '',
  annotationText: '',
  annotationPage: 1,
  redactText: '',
  flattenIncludeAnnotations: true,
  fileReadResult: null,

  setView: (view) => set({ currentView: view }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  addUploadedFiles: (files) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, ...files] })),
  removeUploadedFile: (index) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
    })),
  setProcessedFiles: (files) => set({ processedFiles: files }),
  setIsProcessing: (val) => set({ isProcessing: val }),
  setProgress: (val) => set({ progress: val }),
  incrementUsage: () => {
    const newCount = get().dailyUsageCount + 1;
    set({ dailyUsageCount: newCount });
    saveDailyUsage(newCount);
  },
  setPremium: (val) => set({ isPremium: val }),
  resetTool: () =>
    set({
      activeTool: null,
      uploadedFiles: [],
      processedFiles: [],
      isProcessing: false,
      progress: 0,
      splitRanges: '',
      splitCount: 2,
      rotateDegrees: 90,
      protectPassword: '',
      watermarkText: '',
      compressQuality: 'medium',
      unlockPassword: '',
      extractPagesInput: '',
      reorderPageOrder: [],
      removeWatermarkText: '',
      pdfMetadata: { title: '', author: '', subject: '', keywords: '' },
      signText: '',
      annotationText: '',
      annotationPage: 1,
      redactText: '',
      flattenIncludeAnnotations: true,
      fileReadResult: null,
    }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSplitRanges: (r) => set({ splitRanges: r }),
  setSplitCount: (n) => set({ splitCount: n }),
  setRotateDegrees: (d) => set({ rotateDegrees: d }),
  setProtectPassword: (p) => set({ protectPassword: p }),
  setWatermarkText: (t) => set({ watermarkText: t }),
  setCompressQuality: (q) => set({ compressQuality: q }),
  setUnlockPassword: (p) => set({ unlockPassword: p }),
  setExtractPagesInput: (p) => set({ extractPagesInput: p }),
  setReorderPageOrder: (o) => set({ reorderPageOrder: o }),
  setRemoveWatermarkText: (t) => set({ removeWatermarkText: t }),
  setPdfMetadata: (m) => set({ pdfMetadata: m }),
  setSignText: (t) => set({ signText: t }),
  setAnnotationText: (t) => set({ annotationText: t }),
  setAnnotationPage: (p) => set({ annotationPage: p }),
  setRedactText: (t) => set({ redactText: t }),
  setFlattenIncludeAnnotations: (b) => set({ flattenIncludeAnnotations: b }),
  setFileReadResult: (r) => set({ fileReadResult: r }),
}));
