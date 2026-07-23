// ToolPDF — Tool page intro text + FAQ data
export const toolContent: Record<string, { intro: string; faqs: { question: string; answer: string }[] }> = {
  'merge-pdf': {
    intro: 'Combine multiple PDF files into a single document instantly with our free PDF Merger. Upload two or more PDFs, arrange them in your preferred order, and download the merged result — all processed securely in your browser. No uploads to any server, no file size limits, no watermarks. Used by thousands daily to combine reports, contracts, invoices, and study materials.',
    faqs: [
      { question: 'How do I merge PDF files?', answer: 'Click or drag-drop your PDF files into the upload area, arrange them in the desired order by dragging, then click Merge. Download your combined PDF in seconds. Everything happens in your browser — your files never leave your device.' },
      { question: 'Is there a file size limit for merging PDFs?', answer: 'We do not impose arbitrary file size limits, but very large PDFs (200MB+) may be slow to process in the browser. For best performance, ensure each file is under 50MB. The merged file maintains the quality of your originals.' },
      { question: 'Is PDF merging really free?', answer: 'Yes — the free plan allows 10 PDF operations per day including merging. For unlimited daily use, upgrade to Pro starting at $1/week. No hidden fees or watermarks on any plan.' },
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
  'word-to-pdf': {
    intro: 'Convert Word documents (.docx) to professional PDF format in seconds. Your documents are transformed into universally compatible PDFs that maintain text content and basic formatting. Perfect for sharing documents that need to look consistent across all devices and platforms. All processing happens in your browser.',
    faqs: [
      { question: 'Does Word to PDF preserve my formatting?', answer: 'The converter preserves text content and basic paragraph structure. Complex formatting like custom fonts, embedded images, and advanced table layouts may vary slightly. For best results, use simple formatting in your Word document.' },
      { question: 'Can I convert DOC files (older Word format)?', answer: 'Currently we support .docx format (Word 2007+). Older .doc format files may not convert correctly. We recommend saving your document as .docx before converting.' },
    ],
  },
  'pdf-to-image': {
    intro: 'Convert each page of your PDF into high-quality PNG images at 2x resolution. Perfect for creating thumbnails, sharing individual pages as images, or inserting PDF content into presentations and documents. Every page is rendered with crisp text and clear images, all processed locally in your browser.',
    faqs: [
      { question: 'What resolution are the output images?', answer: 'Each page is rendered at 2x scale (typically 150-300 DPI equivalent), producing crisp, high-quality PNG images suitable for both web use and printing.' },
      { question: 'Can I choose JPG instead of PNG?', answer: 'Currently we output PNG format by default for maximum quality. JPG format support is planned for a future update.' },
    ],
  },
  'image-to-pdf': {
    intro: 'Convert your images (PNG, JPEG) into a professional PDF document. Each image becomes a page, automatically centered and scaled to fit A4 paper size. Perfect for creating photo portfolios, compiling scanned documents, or organizing multiple images into a single downloadable file. Free, fast, and fully private.',
    faqs: [
      { question: 'What image formats are supported?', answer: 'We support PNG and JPEG/JPG formats. WebP and GIF support is planned for the future. Each image is automatically scaled to fit A4 pages while maintaining the original aspect ratio.' },
      { question: 'Can I control the page order?', answer: 'Images are processed in the order you upload them. Drag and drop to reorder before converting to PDF.' },
    ],
  },
  'rotate-pdf': {
    intro: 'Rotate all pages in your PDF by 90, 180, or 270 degrees with a single click. Perfect for fixing upside-down scans, rotating landscape pages to portrait, or correcting pages that were scanned in the wrong orientation. Your file quality and content remain completely unchanged — only the page rotation is adjusted.',
    faqs: [
      { question: 'Does rotation affect PDF quality?', answer: 'No — rotation only changes the page orientation metadata. All text, images, and formatting remain exactly the same, just viewed from a different angle.' },
      { question: 'Can I rotate individual pages?', answer: 'Currently, the rotate tool applies the same rotation to all pages. For per-page rotation, use the Reorder Pages tool which also supports rotation settings.' },
    ],
  },
  'protect-pdf': {
    intro: 'Add password protection to your PDF files so only authorized viewers can open them. Enter a password, and your PDF will be encrypted using industry-standard PDF encryption. The encrypted file will require the password every time someone tries to open it. All processing happens in your browser — your password and file never leave your device.',
    faqs: [
      { question: 'How secure is the password protection?', answer: 'Free tier uses standard PDF encryption (40-bit RC4). Pro users get stronger encryption. The password must be entered correctly to open the file — there is no way to bypass it without the password.' },
      { question: 'Can I remove the password later?', answer: 'Yes — use our Unlock PDF tool (Pro feature) to remove password protection from PDFs you have the password for.' },
    ],
  },
  'watermark-pdf': {
    intro: 'Add professional diagonal text watermarks to every page of your PDF. Type your watermark text (e.g., "CONFIDENTIAL", "DRAFT", your company name) and it will appear as a subtle, semi-transparent overlay across all pages. Perfect for branding documents, marking drafts, or protecting sensitive content. Free and fully private.',
    faqs: [
      { question: 'Can I customize watermark position and size?', answer: 'Currently, watermarks are placed diagonally across the center of each page at 30% opacity. Custom positioning, sizing, and image watermarks are planned for Pro features.' },
      { question: 'Can I remove a watermark I added?', answer: 'Yes — use our Remove Watermark tool to cover/erase text watermarks from your PDF.' },
    ],
  },
  // === NEW TOOLS ===
  'extract-pages': {
    intro: 'Extract specific pages from a PDF and create a new document containing only those pages. Enter page numbers like "1, 3, 5-8" to pull out exactly the pages you need. Perfect for extracting a single chapter from a long document, pulling out specific forms, or creating a subset of pages for sharing. Free, fast, and completely private.',
    faqs: [
      { question: 'How do I specify which pages to extract?', answer: 'Enter page numbers separated by commas, with ranges using dashes. Examples: "1, 3, 5" extracts pages 1, 3, and 5. "1-5" extracts pages 1 through 5. "1-3, 7, 10-12" extracts pages 1, 2, 3, 7, 10, 11, and 12.' },
      { question: 'Does extracting pages reduce quality?', answer: 'No — extracted pages are exact copies from the original PDF. All content, formatting, images, and fonts are preserved perfectly.' },
    ],
  },
  'reorder-pages': {
    intro: 'Rearrange the page order in your PDF by specifying a new sequence. Enter the desired page order (e.g., "3, 1, 2, 5, 4") and your PDF will be reorganized instantly. Perfect for fixing misordered scans, rearranging report sections, or putting pages in a logical reading order. All processing happens in your browser.',
    faqs: [
      { question: 'How do I reorder pages?', answer: 'Upload your PDF, then type the new page order as numbers separated by commas. For example, "3,1,2" means page 3 comes first, then page 1, then page 2. You can also duplicate pages by listing the same number multiple times.' },
      { question: 'Can I delete pages while reordering?', answer: 'Yes — simply omit the page numbers you want to remove from the new order. Only the pages you list will appear in the output PDF.' },
    ],
  },
  'pdf-to-html': {
    intro: 'Convert your PDF content into clean, structured HTML format perfect for web publishing. Text is extracted and organized into proper HTML paragraphs with page markers, making it easy to publish PDF content on websites, blogs, or content management systems. A Pro feature for professional content conversion.',
    faqs: [
      { question: 'Does PDF to HTML preserve layout?', answer: 'The converter extracts text content and organizes it into HTML paragraphs with proper structure. Complex visual layouts, images, and multi-column designs are converted as text flow. The output is a clean, readable HTML document rather than a pixel-perfect layout replica.' },
      { question: 'What about images in the PDF?', answer: 'Currently, the HTML conversion focuses on text content. Images within the PDF are not extracted into the HTML output. Image extraction support is planned for a future update.' },
    ],
  },
  'convert-to-pdf': {
    intro: 'Convert virtually any file type to PDF format — spreadsheets (XLSX, CSV), text files (TXT, MD, JSON), code files, and more. Your file content is professionally formatted into a clean PDF document ready for sharing, archiving, or printing. A Pro feature that supports over 30 file formats, all processed privately in your browser.',
    faqs: [
      { question: 'What file formats can I convert to PDF?', answer: 'We support text files (TXT, MD, LOG), data files (CSV, JSON, XML, YAML), code files (JS, TS, PY, JAVA, C++, etc.), spreadsheets (XLSX, XLS, ODS), documents (DOCX), and images (PNG, JPG). Over 30 formats total.' },
      { question: 'How are spreadsheets converted?', answer: 'Excel and CSV files are converted with their table structure preserved — each row becomes a line in the PDF with columns separated by clear spacing. Sheet names are included as section headers for multi-sheet workbooks.' },
    ],
  },
  'unlock-pdf': {
    intro: 'Remove password protection from encrypted PDF files when you have the correct password. Enter the password that was used to protect the PDF, and we will decrypt it and save a new copy without any password requirement. The unlocked PDF can be opened, edited, and shared freely. A Pro feature for recovering access to your own protected documents.',
    faqs: [
      { question: 'Can I unlock a PDF without knowing the password?', answer: 'No — you must know the correct password. This tool is for removing encryption from PDFs you legitimately own and have the password for. It cannot crack or bypass unknown passwords.' },
      { question: 'Is the unlocked PDF identical to the original?', answer: 'The unlocked PDF contains the same content. For text-based PDFs, the output is nearly identical. For highly complex PDFs with special features, some visual elements may be rendered as images to ensure full content preservation.' },
    ],
  },
  'remove-watermark': {
    intro: 'Remove or cover text watermarks from your PDF documents. If you previously added a watermark using our tool or similar software, this feature will overlay a clean area over the watermark position, effectively removing it from view. A Pro feature for cleaning up watermarked documents.',
    faqs: [
      { question: 'How does watermark removal work?', answer: 'The tool draws a clean white overlay over the watermark area, effectively covering the watermark text. This works best for semi-transparent diagonal watermarks placed at the center of pages, which is the most common watermark format.' },
      { question: 'Can it remove any type of watermark?', answer: 'Currently, the tool works best for text watermarks placed diagonally at the center of pages (the standard format). Image watermarks and custom-positioned watermarks may require different removal approaches that are planned for future updates.' },
    ],
  },
  'edit-metadata': {
    intro: 'View and edit PDF metadata — the title, author, subject, keywords, and creator information stored inside every PDF. This metadata is what search engines and PDF readers use to identify and catalog your document. Edit it to properly label your files for organization, SEO, or professional presentation. Free and private.',
    faqs: [
      { question: 'What is PDF metadata?', answer: 'PDF metadata includes the document title, author name, subject description, keywords, and creator application. This information is embedded in the PDF file and visible in PDF readers, search engines, and file management systems.' },
      { question: 'Does editing metadata change the PDF content?', answer: 'No — metadata editing only changes the informational properties of the PDF. The actual page content, formatting, images, and text remain completely unchanged.' },
    ],
  },
  'file-reader': {
    intro: 'Read and preview any file type directly in your browser — text files, code, CSV spreadsheets, JSON data, HTML, PDFs, images, Word documents, and over 30 more formats. No desktop software needed. Just upload a file and instantly see its contents formatted for easy reading. A free feature for quick file inspection, all processed privately in your browser.',
    faqs: [
      { question: 'What file types can I read?', answer: 'We support text files (TXT, MD, LOG), code files (JS, PY, JAVA, C++, etc.), data files (CSV, JSON, XML, YAML), documents (PDF, DOCX), spreadsheets (XLSX, CSV), images (PNG, JPG, SVG), and many more — over 50 formats total.' },
      { question: 'Is the file content displayed accurately?', answer: 'Text and code files are displayed with full accuracy. PDFs show extracted text content. Spreadsheets display as formatted tables with rows and columns. Images show as previews. Some complex formats (like PPTX) may show limited content.' },
    ],
  },
  'view-pdf': {
    intro: 'Read and preview PDF documents directly in your browser without needing Adobe Reader or any desktop software. Extract all text content page by page for easy reading, searching, and copying. See document metadata like title, author, and page count. Free, instant, and completely private — your PDF never leaves your device.',
    faqs: [
      { question: 'Does this show the PDF with its original layout?', answer: 'The viewer extracts and displays the text content of each page in a clean, readable format. Complex visual layouts are converted to readable text flow. For the exact visual appearance, use our PDF-to-Image tool.' },
      { question: 'Can I copy text from the displayed content?', answer: 'Yes — all extracted text is displayed in a copyable format. You can select, copy, and paste any text from the results.' },
    ],
  },
  'pdf-to-excel': {
    intro: 'Convert PDF tables and structured data into editable Microsoft Excel (.xlsx) spreadsheets with our powerful PDF to Excel converter. Whether you are working with financial reports, invoice tables, inventory sheets, or survey results embedded in a PDF, this tool intelligently extracts tabular data and places it into properly formatted Excel cells. No more manual retyping of numbers and text from PDF tables — save hours of tedious work with accurate, automated extraction. Ideal for accountants, data analysts, researchers, and business professionals who need to manipulate and analyze PDF data in Excel. This is a premium feature designed for professional document workflows.',
    faqs: [
      { question: 'How accurate is PDF to Excel conversion for complex tables?', answer: 'Conversion accuracy depends on the structure of the PDF. Well-formatted tables with clear rows and columns convert with high accuracy, preserving cell boundaries and numeric formatting. Multi-page tables and nested or merged-cell layouts may require minor manual adjustments in Excel after conversion. Scanned PDFs with table images rely on OCR detection, which can affect precision for very complex layouts.' },
      { question: 'Can I convert a scanned PDF with tables to Excel?', answer: 'Yes — our PDF to Excel converter includes OCR (optical character recognition) technology that can detect and extract table data from scanned PDF images. However, the accuracy depends on the scan quality and table complexity. For best results, ensure the scanned PDF has a resolution of at least 300 DPI and that the table lines are clearly visible and well-aligned.' },
    ],
  },
  'excel-to-pdf': {
    intro: 'Convert your Microsoft Excel spreadsheets (.xlsx, .xls) into professional, universally compatible PDF documents with our free Excel to PDF converter. Transform financial models, data tables, charts, and reports into clean PDF files that maintain your spreadsheet layout and formatting for consistent viewing across all devices and platforms. Perfect for sharing budget summaries, quarterly reports, pricing sheets, or any spreadsheet data with colleagues, clients, or stakeholders who need a read-only version. No special software required — just upload your Excel file and download the PDF instantly. All processing is done securely in your browser, keeping your financial and business data completely private.',
    faqs: [
      { question: 'Will my Excel formatting and charts be preserved in the PDF?', answer: 'The converter preserves the core layout, text content, and table structure from your Excel spreadsheet. Basic cell formatting, borders, and alignment are maintained. Charts and complex visual elements may be rendered as static images in the PDF. For the best results, use standard Excel formatting and avoid overly complex merged cells or intricate graphic layouts before conversion.' },
      { question: 'How are multi-sheet Excel files converted to PDF?', answer: 'Each sheet in a multi-sheet workbook is converted as a separate page or section in the resulting PDF. Sheet names appear as section headers so you can easily identify which worksheet each portion corresponds to. All sheets are included in a single PDF document for convenient sharing and viewing.' },
    ],
  },
  'sign-pdf': {
    intro: 'Add secure digital signatures to your PDF documents with our professional PDF signing tool. Digitally sign contracts, agreements, legal forms, and official documents directly in your browser without needing expensive software like Adobe Acrobat. Create a custom signature by typing your name, drawing with your mouse or touchscreen, or uploading an image of your handwritten signature. Each signature is embedded directly into the PDF with metadata including the signer name, date, and timestamp, providing a verifiable record of document approval. Ideal for business contracts, HR paperwork, real estate agreements, and any document requiring formal sign-off. This is a premium feature for professional and legal document workflows.',
    faqs: [
      { question: 'Is a digital signature on a PDF legally binding?', answer: 'Digital signatures added to PDFs serve as a record of sign-off intent and include signer metadata such as name, date, and timestamp. In many jurisdictions, electronically signed documents are legally recognized under laws like the ESIGN Act (US) and eIDAS (EU). However, for highest legal enforceability, you may need certified digital IDs from authorized providers. Our tool provides a practical electronic signature suitable for most business and personal document signing needs.' },
      { question: 'Can I add multiple signatures to the same PDF?', answer: 'Yes — you can add multiple signatures to a single PDF document. Each signature is placed independently at the position you specify on the page. This is useful for contracts or agreements that require signatures from multiple parties, such as buyer and seller signatures on a real estate form or manager and employee signatures on an HR document.' },
    ],
  },
  'number-pages': {
    intro: 'Add page numbers to your PDF documents automatically with our free PDF Page Numbering tool. Whether you are preparing a research paper, a lengthy report, a legal brief, or a training manual, page numbers make navigation easy and provide essential reference points for readers. Choose from multiple numbering styles including bottom-center, bottom-right, top-center, and top-right placement. Customize the starting page number, font size, and format (numeric, roman numerals, or alphanumeric). Works seamlessly on documents of any length — from 5-page memos to 500-page manuscripts. All processing happens locally in your browser, ensuring your documents remain completely private and secure throughout the entire numbering process.',
    faqs: [
      { question: 'Can I choose which pages get numbered and skip the first page?', answer: 'Yes — you can set a custom starting page number and choose to begin numbering from any page in the document. This is especially useful for reports and academic papers where the title page or table of contents should not display a page number. Simply set the starting page offset and the numbering will begin from the page you specify with the number you choose.' },
      { question: 'What numbering formats are available?', answer: 'Our tool supports standard numeric page numbers (1, 2, 3…), lowercase Roman numerals (i, ii, iii…), uppercase Roman numerals (I, II, III…), and alphanumeric combinations. You can also customize the font size and placement position on each page, choosing from bottom-center, bottom-right, top-center, and top-right options to suit your document style.' },
    ],
  },
  'flatten-pdf': {
    intro: 'Flatten interactive PDF forms into static, non-editable documents with our professional PDF Flattening tool. When you fill out a PDF form — whether it is a tax return, job application, insurance claim, or government form — the data you enter stays in editable form fields that can be modified by anyone. Flattening merges all form field data, annotations, and interactive elements into the permanent page content, making the filled-in information part of the document itself and removing the editable fields entirely. This prevents accidental or intentional changes to your submitted data and ensures that what you entered is exactly what recipients will see. This is a premium feature essential for submitting official forms and finalized documents.',
    faqs: [
      { question: 'What exactly does flattening a PDF do?', answer: 'Flattening converts all interactive PDF elements — including fillable form fields, dropdown selections, checkbox values, annotations, and comments — into static page content. Once flattened, the entered data becomes part of the permanent document layer and the interactive fields are removed. This means no one can edit, modify, or delete the information you entered, effectively locking your form data into the document permanently for secure submission and archival.' },
      { question: 'Should I flatten my PDF before submitting a form?', answer: 'Yes, it is highly recommended to flatten filled-in PDF forms before submitting them to employers, government agencies, banks, or any institution. Without flattening, form fields remain editable and your entered data could be accidentally or deliberately altered after submission. Flattening ensures that the information you submitted is preserved exactly as you intended, providing a reliable and tamper-resistant record of your form responses.' },
    ],
  },
  'repair-pdf': {
    intro: 'Repair and recover corrupted, damaged, or unreadable PDF files with our free PDF Repair tool. If you have a PDF that will not open, displays error messages in your reader, shows blank pages, has missing content, or crashes your PDF viewer, this tool can often restore it to a fully functional state. The repair engine analyzes the internal structure of your PDF, identifies broken cross-reference tables, corrupted page trees, missing fonts, and other structural errors, then reconstructs a clean, valid PDF document from the recoverable data. Perfect for rescuing important files that have been damaged by disk errors, email transmission issues, incomplete downloads, or software crashes. Free and fully private — all recovery happens in your browser.',
    faqs: [
      { question: 'What types of PDF corruption can be repaired?', answer: 'Our tool can repair many common PDF issues including broken cross-reference tables, corrupted page trees, damaged header and trailer structures, missing or malformed font references, and invalid stream objects. It can also recover PDFs that fail to open due to incomplete downloads or transmission errors. However, PDFs with severely damaged internal streams or completely overwritten data may not be fully recoverable, though partial content extraction is often still possible.' },
      { question: 'Will the repaired PDF look exactly like the original?', answer: 'In most cases, the repaired PDF closely matches the original document. Text, images, and basic formatting are typically preserved well. However, some complex features like interactive form fields, embedded multimedia, JavaScript actions, and intricate layout elements may be simplified or removed during the repair process in order to produce a stable, readable PDF file that opens reliably in all standard PDF readers.' },
    ],
  },
  'redact-pdf': {
    intro: 'Permanently redact and remove sensitive, confidential, or classified text from your PDF documents with our professional PDF Redaction tool. True redaction goes far beyond simply highlighting or covering text with a black box — it permanently removes the underlying text data from the PDF file so that it cannot be recovered, searched, copied, or extracted by anyone using any tool or technique. This is essential for compliance with privacy regulations like GDPR, HIPAA, and FOIA, as well as for legal proceedings, government document releases, and corporate information security. Redact personal identifiable information, financial details, trade secrets, medical records, or any text that must be permanently and irrevocably removed from the document. This is a premium feature designed for security-conscious professionals.',
    faqs: [
      { question: 'Why is true redaction different from just covering text with a black box?', answer: 'Simply covering text with a colored shape does not remove the underlying text data — it only hides it visually. Anyone can still copy the hidden text, search for it, or extract it using PDF editing tools or text extraction utilities. True redaction permanently deletes the text content from the PDF data stream, making it completely unrecoverable. This is the only reliable method for protecting sensitive information in documents that will be shared publicly or with third parties.' },
      { question: 'Can I redact specific words or phrases instead of entire areas?', answer: 'Yes — our redaction tool allows you to search for and redact specific text strings throughout the entire document. You can enter a word or phrase, and every instance of that text across all pages will be found and permanently redacted. This is especially useful for removing names, email addresses, phone numbers, account numbers, or other recurring sensitive terms from a lengthy document without manually locating each occurrence one by one.' },
    ],
  },
  'annotate-pdf': {
    intro: 'Add comments, annotations, highlights, and markup to your PDF documents with our free PDF Annotation tool. Review and collaborate on documents by inserting text comments at specific locations, highlighting important passages with colored markers, underlining key text for emphasis, and adding sticky-note style notes that draw attention to specific sections. Perfect for academic peer review, legal document markup, editorial feedback, contract negotiation annotations, and team collaboration on project documents. Annotations are embedded directly into the PDF as standard comment markers, so they are visible to anyone using a regular PDF reader like Adobe Acrobat, Preview, or any modern browser. Free, fast, and completely private — all annotation happens locally in your browser without uploading your files to any external server.',
    faqs: [
      { question: 'Can others see my annotations when I share the PDF?', answer: 'Yes — annotations added with our tool are saved as standard PDF comment annotations that are fully compatible with all major PDF readers including Adobe Acrobat, Apple Preview, Foxit Reader, and browser-based PDF viewers. Anyone who opens the annotated PDF will see your comments, highlights, and notes in the familiar comment panel or annotation overlay, making it easy to collaborate and share feedback across different platforms and devices.' },
      { question: 'What types of annotations can I add to a PDF?', answer: 'Our tool supports several annotation types: text comments that appear as note icons with expandable text, highlight annotations that color-mark selected text passages for emphasis, underline annotations that draw attention to specific text, and free-text annotations that display your comment text directly on the page at the position you choose. Each annotation type can be placed at a precise location on any page of your document for targeted, contextual feedback.' },
    ],
  },
};
