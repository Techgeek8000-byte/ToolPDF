export interface ToolMeta {
  title: string;
  description: string;
  keywords: string[];
}

export const toolMetaMap: Record<string, ToolMeta> = {
  'merge-pdf': {
    title: 'Merge PDF — Combine PDF Files Free Online | ToolPDF',
    description: 'Combine multiple PDF files into a single document. Fast, free, and private — all processing happens in your browser. No uploads, no signup.',
    keywords: ['merge PDF', 'combine PDF', 'PDF merger', 'join PDF', 'merge PDF online'],
  },
  'split-pdf': {
    title: 'Split PDF — Extract Pages from PDF Free Online | ToolPDF',
    description: 'Split a PDF by pages — extract, remove, or reorder pages. Free online tool with browser-based privacy. No files leave your device.',
    keywords: ['split PDF', 'extract PDF pages', 'remove PDF pages', 'reorder PDF', 'split PDF online'],
  },
  'compress-pdf': {
    title: 'Compress PDF — Reduce PDF File Size Free Online | ToolPDF',
    description: 'Reduce PDF file size without losing quality. Free, fast compression processed locally in your browser. No signup needed.',
    keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor', 'shrink PDF', 'optimize PDF'],
  },
  'pdf-to-word': {
    title: 'PDF to Word — Convert PDF to DOCX Free Online | ToolPDF',
    description: 'Convert PDF documents to editable Word (DOCX) files. Free, accurate conversion done entirely in your browser for privacy.',
    keywords: ['PDF to Word', 'PDF to DOCX', 'convert PDF to Word', 'PDF converter'],
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX to PDF Free Online | ToolPDF',
    description: 'Convert Word documents (DOCX) to PDF format. Free, fast, and private conversion in your browser. No uploads needed.',
    keywords: ['Word to PDF', 'DOCX to PDF', 'convert Word to PDF', 'Word converter'],
  },
  'pdf-to-image': {
    title: 'PDF to Image — Convert PDF Pages to JPG/PNG Free | ToolPDF',
    description: 'Convert PDF pages to high-quality images (JPG, PNG). Free browser-based tool with no file uploads. Private and secure.',
    keywords: ['PDF to image', 'PDF to JPG', 'PDF to PNG', 'convert PDF to image'],
  },
  'image-to-pdf': {
    title: 'Image to PDF — Convert JPG/PNG to PDF Free Online | ToolPDF',
    description: 'Convert images (JPG, PNG, WebP) to PDF. Combine multiple images into one PDF document. Free tool with browser processing.',
    keywords: ['image to PDF', 'JPG to PDF', 'PNG to PDF', 'photos to PDF'],
  },
  'rotate-pdf': {
    title: 'Rotate PDF — Flip PDF Pages Free Online | ToolPDF',
    description: 'Rotate PDF pages 90°, 180°, or 270°. Free online tool — all processing happens in your browser for maximum privacy.',
    keywords: ['rotate PDF', 'flip PDF', 'turn PDF pages', 'rotate PDF online'],
  },
  'protect-pdf': {
    title: 'Protect PDF — Add Password to PDF Free Online | ToolPDF',
    description: 'Password-protect your PDF files with encryption. Free, secure tool that processes files locally in your browser.',
    keywords: ['protect PDF', 'password PDF', 'encrypt PDF', 'secure PDF', 'lock PDF'],
  },
  'watermark-pdf': {
    title: 'Watermark PDF — Add Text/Image Watermark Free | ToolPDF',
    description: 'Add text or image watermarks to your PDF documents. Free, private tool — files are processed entirely in your browser.',
    keywords: ['watermark PDF', 'add watermark to PDF', 'PDF stamp', 'brand PDF'],
  },
};
