// ToolPDF — Tool page intro text + FAQ data
export const toolContent: Record<string, { intro: string; faqs: { question: string; answer: string }[] }> = {
  'merge-pdf': {
    intro: 'Combine multiple PDF files into a single document instantly with our free PDF Merger. Upload two or more PDFs, arrange them in your preferred order, and download the merged result — all processed securely in your browser. No uploads to any server, no file size limits, no watermarks. Used by thousands daily to combine reports, contracts, invoices, and study materials.',
    faqs: [
      { question: 'How do I merge PDF files?', answer: 'Click or drag-drop your PDF files into the upload area, arrange them in the desired order by dragging, then click Merge. Download your combined PDF in seconds. Everything happens in your browser — your files never leave your device.' },
      { question: 'Is there a file size limit for merging PDFs?', answer: 'We do not impose arbitrary file size limits, but very large PDFs (200MB+) may be slow to process in the browser. For best performance, ensure each file is under 50MB. The merged file maintains the quality of your originals.' },
      { question: 'Is PDF merging really free?', answer: 'Yes — the free plan allows 15 PDF operations per day including merging. For unlimited daily use, upgrade to Pro starting at $1/week. No hidden fees or watermarks on any plan.' },
    ],
  },
  'split-pdf': {
    intro: 'Extract specific pages or split a PDF into individual files with our free PDF Splitter. Choose to extract selected page ranges (like pages 1-3, 5, 7-10) or split every page into separate PDFs. Perfect for pulling out a single form from a large document, splitting a scanned book by chapter, or isolating pages for sharing. All processing is client-side — your documents stay private.',
    faqs: [
      { question: 'How do I split a PDF into separate pages?', answer: 'Upload your PDF, select the pages you want to extract (e.g., "1-5, 8, 12-15"), or choose "Extract All Pages" to get each page as a separate PDF. Click Split and download the resulting files.' },
      { question: 'Can I split a PDF without losing quality?', answer: 'Yes — our splitter preserves the original quality, formatting, images, and fonts of each page. The extracted pages are identical to their counterparts in the source PDF.' },
    ],
  },
  'compress-pdf': {
    intro: 'Reduce PDF file size by up to 80% while maintaining readable quality with our free PDF Compressor. See your estimated compressed size before downloading — for example, a 2.3MB PDF typically compresses to ~800KB. Ideal for email attachments, web uploads, and saving storage space. The compression runs entirely in your browser for maximum privacy.',
    faqs: [
      { question: 'Will compression reduce my PDF quality?', answer: 'Compression reduces file size by optimizing images and removing redundant data, which may slightly affect image quality at very high compression levels. Text remains crystal clear. Our tool shows the estimated compressed size before you download so you can decide if the trade-off is acceptable.' },
      { question: 'How much can I compress a PDF?', answer: 'Typical compression ratios range from 50-80% depending on the PDF content. Image-heavy PDFs compress the most. Text-only PDFs see modest reductions. Our file size indicator shows the estimate upfront before processing.' },
    ],
  },
  'pdf-to-word': {
    intro: 'Convert PDF documents to editable Microsoft Word (.docx) files for free. Extract text, tables, and formatting from any PDF into a fully editable Word document that you can open in Microsoft Word, Google Docs, or LibreOffice. Perfect for reusing content from locked PDFs, editing contracts, or extracting data from forms. No registration, no server uploads.',
    faqs: [
      { question: 'How accurate is PDF to Word conversion?', answer: 'Accuracy depends on the PDF structure. Text-based PDFs convert with near-perfect accuracy including fonts and formatting. Scanned/image-based PDFs may require OCR for best results. Complex layouts with tables and columns generally convert well but may need minor adjustments.' },
    ],
  },
  'excel-to-pdf': {
    intro: 'Convert Excel spreadsheets (XLSX, XLS) to PDF format for free. Each sheet becomes a separate page with formatted tables, headers, and cell data preserved. Supports multi-sheet workbooks, auto-fitting columns, and maintaining the visual structure of your data. Perfect for sharing reports, financial data, or any spreadsheet content as a universal PDF document.',
    faqs: [
      { question: 'Does it support multi-sheet Excel files?', answer: 'Yes — each sheet in your workbook is converted to a separate page (or multiple pages for large sheets) in the resulting PDF. Sheet names are displayed as headers.' },
      { question: 'Will my Excel formatting be preserved?', answer: 'Text content, cell values, and the table structure are preserved. Complex formatting like merged cells, conditional formatting, charts, and images may not be supported in this version.' },
    ],
  },
};
