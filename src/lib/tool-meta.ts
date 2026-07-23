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
  // === NEW TOOLS ===
  'extract-pages': {
    title: 'Extract Pages from PDF — Free Online | ToolPDF',
    description: 'Extract specific pages from a PDF into a new document. Select pages by number or range. Free, private, browser-based.',
    keywords: ['extract PDF pages', 'pull pages from PDF', 'PDF page extractor', 'select PDF pages'],
  },
  'reorder-pages': {
    title: 'Reorder PDF Pages — Rearrange Page Order Free | ToolPDF',
    description: 'Drag and drop to rearrange PDF page order. Free online tool that processes files in your browser for privacy.',
    keywords: ['reorder PDF pages', 'arrange PDF', 'PDF page order', 'reorganize PDF'],
  },
  'pdf-to-html': {
    title: 'PDF to HTML — Convert PDF to Web Format | ToolPDF Pro',
    description: 'Convert PDF content to clean HTML for web publishing. Pro feature — extract text into structured HTML paragraphs.',
    keywords: ['PDF to HTML', 'convert PDF to HTML', 'PDF to web', 'PDF content extraction'],
  },
  'convert-to-pdf': {
    title: 'Convert Any File to PDF — XLSX, CSV, TXT, DOCX to PDF | ToolPDF Pro',
    description: 'Convert any file type to PDF — spreadsheets, text, code, documents, and images. Pro feature with 30+ format support.',
    keywords: ['convert to PDF', 'XLSX to PDF', 'CSV to PDF', 'TXT to PDF', 'any file to PDF'],
  },
  'unlock-pdf': {
    title: 'Unlock PDF — Remove Password from PDF | ToolPDF Pro',
    description: 'Remove password protection from encrypted PDFs when you have the correct password. Pro feature for decrypting your own PDFs.',
    keywords: ['unlock PDF', 'remove PDF password', 'decrypt PDF', 'PDF password remover', 'unprotect PDF'],
  },
  'remove-watermark': {
    title: 'Remove Watermark from PDF — Clean Up Documents | ToolPDF Pro',
    description: 'Remove text watermarks from PDF documents. Pro feature for cleaning up watermarked files.',
    keywords: ['remove watermark PDF', 'delete watermark', 'clean PDF', 'unwatermark PDF'],
  },
  'edit-metadata': {
    title: 'Edit PDF Metadata — Title, Author, Keywords Free | ToolPDF',
    description: 'View and edit PDF metadata — title, author, subject, and keywords. Free tool for properly labeling your PDF documents.',
    keywords: ['edit PDF metadata', 'PDF properties', 'PDF title', 'PDF author', 'PDF keywords'],
  },
  'file-reader': {
    title: 'File Reader — Read Any File Type Free Online | ToolPDF',
    description: 'Read and preview any file in your browser — text, code, CSV, JSON, PDF, DOCX, images & 50+ formats. Free, instant, private.',
    keywords: ['read file online', 'file viewer', 'preview file', 'text reader', 'code viewer', 'CSV reader'],
  },
  'view-pdf': {
    title: 'View PDF — Read PDF Documents Free Online | ToolPDF',
    description: 'Read and preview PDF documents in your browser. Extract text content page by page. Free, instant, no software needed.',
    keywords: ['view PDF', 'read PDF online', 'PDF viewer', 'PDF reader', 'open PDF online'],
  },
  // === SECOND BATCH ===
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF Tables to XLSX | ToolPDF Pro',
    description: 'Convert PDF tables and data into editable Excel (XLSX) spreadsheets. Pro feature — accurately extract tables, rows, and columns from PDF for data analysis and reporting.',
    keywords: ['PDF to Excel', 'PDF to XLSX', 'convert PDF table', 'extract PDF data', 'PDF spreadsheet converter'],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX/XLS to PDF Free | ToolPDF',
    description: 'Convert Excel spreadsheets (XLSX, XLS) to PDF documents for easy sharing and printing. Free, fast conversion processed entirely in your browser — no uploads, no signup required.',
    keywords: ['Excel to PDF', 'XLSX to PDF', 'XLS to PDF', 'spreadsheet to PDF', 'convert Excel to PDF'],
  },
  'sign-pdf': {
    title: 'Sign PDF — Add Digital Signature to PDF | ToolPDF Pro',
    description: 'Add your digital signature to PDF documents for official approval and authentication. Pro feature — draw, type, or upload your signature directly onto any PDF page securely in your browser.',
    keywords: ['sign PDF', 'digital signature PDF', 'add signature to PDF', 'PDF signature', 'e-sign PDF'],
  },
  'number-pages': {
    title: 'Number Pages — Add Page Numbers to PDF Free | ToolPDF',
    description: 'Add page numbers to your PDF documents with customizable position, font, and format. Free tool — number pages at top or bottom, choose numbering style, all processed privately in your browser.',
    keywords: ['number PDF pages', 'add page numbers', 'PDF pagination', 'page numbering', 'number pages in PDF'],
  },
  'flatten-pdf': {
    title: 'Flatten PDF — Flatten Forms & Annotations | ToolPDF Pro',
    description: 'Flatten PDF forms and interactive annotations into static content. Pro feature — convert fillable fields, comments, and layered elements into a single non-editable layer for final distribution.',
    keywords: ['flatten PDF', 'PDF flattening', 'flatten form fields', 'remove annotations', 'static PDF'],
  },
  'repair-pdf': {
    title: 'Repair PDF — Fix Corrupted PDF Files Free | ToolPDF',
    description: 'Repair and recover corrupted or damaged PDF files. Free tool — fix broken PDF structures, restore unreadable content, and rebuild file integrity entirely in your browser with no uploads.',
    keywords: ['repair PDF', 'fix corrupted PDF', 'recover PDF', 'restore PDF', 'PDF repair tool'],
  },
  'redact-pdf': {
    title: 'Redact PDF — Remove Sensitive Text from PDF | ToolPDF Pro',
    description: 'Permanently redact and remove sensitive text, data, and information from PDF documents. Pro feature — securely black out or erase confidential content so it cannot be recovered or searched.',
    keywords: ['redact PDF', 'PDF redaction', 'remove sensitive text', 'black out PDF', 'secure PDF redaction'],
  },
  'annotate-pdf': {
    title: 'Annotate PDF — Add Comments & Notes Free | ToolPDF',
    description: 'Add comments, notes, highlights, and annotations to your PDF documents. Free tool — mark up text, leave feedback, and collaborate on PDFs with sticky notes and drawing tools, all in your browser.',
    keywords: ['annotate PDF', 'add comments to PDF', 'PDF notes', 'highlight PDF', 'PDF markup'],
  },
};
