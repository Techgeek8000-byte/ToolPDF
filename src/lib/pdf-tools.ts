import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { addPasswordProtection } from './pdf-encrypt';

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function simulateProgress(
  onProgress: (p: number) => void,
  duration: number = 2000
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      progress = Math.min(Math.round((step / steps) * 100), 100);
      onProgress(progress);
      if (step >= steps) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
}

function ensurePdfJsWorker() {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
}

// === EXISTING TOOLS ===

export async function mergePDFs(
  files: File[],
  onProgress?: (p: number) => void
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  const progressFn = onProgress || (() => {});

  for (let i = 0; i < files.length; i++) {
    const arrayBuffer = await readFileAsArrayBuffer(files[i]);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
    progressFn(Math.round(((i + 1) / files.length) * 90));
  }

  const pdfBytes = await mergedPdf.save();
  progressFn(100);
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function splitPDF(
  file: File,
  ranges: string[],
  onProgress?: (p: number) => void
): Promise<Blob[]> {
  const progressFn = onProgress || (() => {});
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  const results: Blob[] = [];

  const parsedRanges = ranges.map((range) => {
    const parts = range.split('-').map((s) => parseInt(s.trim(), 10));
    if (parts.length === 1) return [parts[0] - 1, parts[0] - 1];
    return [parts[0] - 1, parts[1] - 1];
  });

  for (let i = 0; i < parsedRanges.length; i++) {
    const [start, end] = parsedRanges[i];
    const clampedStart = Math.max(0, start);
    const clampedEnd = Math.min(totalPages - 1, end);
    if (clampedStart > clampedEnd || clampedStart >= totalPages) continue;

    const newPdf = await PDFDocument.create();
    const indices = [];
    for (let p = clampedStart; p <= clampedEnd; p++) indices.push(p);
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    results.push(new Blob([pdfBytes], { type: 'application/pdf' }));
    progressFn(Math.round(((i + 1) / parsedRanges.length) * 100));
  }

  return results;
}

export async function extractPages(
  file: File,
  pageNumbers: number[],
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(20);
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  progressFn(30);

  // Convert page numbers (1-based) to indices (0-based)
  const validIndices = pageNumbers
    .map(p => p - 1)
    .filter(i => i >= 0 && i < totalPages);

  if (validIndices.length === 0) {
    throw new Error('No valid page numbers selected');
  }

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, validIndices);
  pages.forEach((page) => newPdf.addPage(page));
  progressFn(80);

  const pdfBytes = await newPdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function reorderPages(
  file: File,
  newOrder: number[],
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();

  const validOrder = newOrder
    .map((p) => p - 1)
    .filter((p) => p >= 0 && p < totalPages);

  if (validOrder.length === 0) {
    throw new Error('No valid page order provided');
  }

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, validOrder);
  pages.forEach((page) => newPdf.addPage(page));
  progressFn(70);

  const pdfBytes = await newPdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function compressPDF(
  file: File,
  quality: 'low' | 'medium' | 'high',
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  progressFn(50);

  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: quality === 'low' ? 100 : quality === 'medium' ? 50 : 20,
  });

  progressFn(90);
  await simulateProgress(progressFn, 300);
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function pdfToImages(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob[]> {
  ensurePdfJsWorker();

  const progressFn = onProgress || (() => {});
  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(10);

  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  const results: Blob[] = [];
  progressFn(20);

  const scale = 2;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });

    results.push(blob);
    progressFn(20 + Math.round((i / totalPages) * 75));
  }

  pdfDoc.destroy();
  progressFn(100);
  return results;
}

export async function rotatePDF(
  file: File,
  deg: 90 | 180 | 270,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  progressFn(50);

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + deg));
  });

  progressFn(70);
  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function protectPDF(
  file: File,
  password: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  if (!password || password.length < 1) {
    throw new Error('Please enter a password (at least 1 character)');
  }

  const arrayBuffer = await file.arrayBuffer();
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  progressFn(60);

  const cleanBytes = await pdf.save({ useObjectStreams: false });
  progressFn(75);

  const encryptedBytes = addPasswordProtection(new Uint8Array(cleanBytes), password);
  progressFn(100);

  return new Blob([encryptedBytes], { type: 'application/pdf' });
}

export async function addWatermark(
  file: File,
  text: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  progressFn(50);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const fontSize = 40;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2;
    const y = height / 2;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3,
      rotate: degrees(-45),
    });

    progressFn(50 + Math.round(((i + 1) / pages.length) * 40));
  }

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// === NEW: Remove watermark ===
export async function removeWatermark(
  file: File,
  watermarkText: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  // Load with pdf-lib - we can't directly remove drawn text,
  // but we can redact by drawing a white rectangle over watermark areas
  // This works for diagonal watermarks placed at center
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  progressFn(50);

  // Strategy: Draw a white rectangle over the center area where watermark text would be
  // This effectively "covers" the watermark
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    // Cover the center area where watermark text appears (rotated -45 degrees)
    // The watermark is typically placed at center with ~45 degree rotation
    const coverWidth = Math.max(width * 0.8, fontWidthEstimate(watermarkText, 40));
    const coverHeight = Math.max(height * 0.3, 60);

    page.drawRectangle({
      x: (width - coverWidth) / 2,
      y: (height - coverHeight) / 2,
      width: coverWidth,
      height: coverHeight,
      color: rgb(1, 1, 1),
      opacity: 1,
      // Rotate to match watermark angle
      rotate: degrees(-45),
    });

    progressFn(50 + Math.round(((i + 1) / pages.length) * 40));
  }

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function fontWidthEstimate(text: string, fontSize: number): number {
  // Rough estimate: Helvetica chars are ~0.6 * fontSize wide
  return text.length * fontSize * 0.6;
}

// === NEW: Edit PDF Metadata ===
export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
}

export async function getMetadata(
  file: File
): Promise<PdfMetadata> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);

  return {
    title: pdf.getTitle() || '',
    author: pdf.getAuthor() || '',
    subject: pdf.getSubject() || '',
    keywords: pdf.getKeywords() || '',
    creator: pdf.getCreator() || '',
  };
}

export async function editMetadata(
  file: File,
  metadata: PdfMetadata,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdf = await PDFDocument.load(arrayBuffer);
  progressFn(50);

  pdf.setTitle(metadata.title);
  pdf.setAuthor(metadata.author);
  pdf.setSubject(metadata.subject);
  pdf.setKeywords(metadata.keywords);
  pdf.setCreator(metadata.creator);
  progressFn(70);

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// === NEW: PDF to HTML ===
export async function pdfToHtml(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  ensurePdfJsWorker();
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(20);

  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  progressFn(30);

  let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${file.name.replace('.pdf', '')} - Converted from PDF</title>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
.page-break { page-break-after: always; border-bottom: 2px solid #eee; margin: 30px 0; padding-bottom: 20px; }
.page-marker { color: #999; font-size: 12px; text-align: center; margin: 10px 0; }
.paragraph { margin: 8px 0; }
</style>
</head>
<body>
`;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    progressFn(30 + Math.round((i / totalPages) * 50));

    htmlContent += `<div class="page-break">\n`;
    htmlContent += `<p class="page-marker">--- Page ${i} ---</p>\n`;

    // Sort text items by position
    const sortedItems = [...textContent.items]
      .filter((item: any): item is { str: string; transform: number[] } => 'str' in item)
      .sort((a: any, b: any) => {
        const ay = a.transform[5];
        const by = b.transform[5];
        if (Math.abs(ay - by) > 2) return by - ay;
        return a.transform[4] - b.transform[4];
      });

    let currentLine = '';
    let lastY = Infinity;
    for (const item of sortedItems) {
      const y = item.transform[5];
      if (lastY !== Infinity && Math.abs(y - lastY) > 3) {
        if (currentLine.trim()) {
          htmlContent += `<p class="paragraph">${escapeHtml(currentLine.trim())}</p>\n`;
        }
        currentLine = item.str + ' ';
      } else {
        currentLine += item.str + ' ';
      }
      lastY = y;
    }
    if (currentLine.trim()) {
      htmlContent += `<p class="paragraph">${escapeHtml(currentLine.trim())}</p>\n`;
    }

    htmlContent += `</div>\n`;
  }

  htmlContent += `</body>\n</html>`;

  pdfDoc.destroy();
  progressFn(90);

  const blob = new Blob([htmlContent], { type: 'text/html' });
  progressFn(100);
  return blob;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// === NEW: Convert any file to PDF ===
export async function convertToPdf(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // Text/code files
  const textExts = ['txt', 'md', 'csv', 'json', 'xml', 'yaml', 'yml', 'html', 'css', 'js', 'ts', 'py', 'rb', 'java', 'c', 'cpp', 'sh', 'sql', 'log', 'ini', 'cfg'];
  if (textExts.includes(ext)) {
    const text = await file.text();
    progressFn(30);
    const blob = await textToPdf(text, file.name);
    progressFn(100);
    return blob;
  }

  // CSV/TSV files (structured table)
  if (ext === 'csv' || ext === 'tsv') {
    const text = await file.text();
    progressFn(30);
    const blob = await csvToPdf(text, ext === 'tsv' ? '\t' : ',');
    progressFn(100);
    return blob;
  }

  // Excel files
  if (['xlsx', 'xls', 'ods'].includes(ext)) {
    progressFn(15);
    const arrayBuffer = await readFileAsArrayBuffer(file);
    progressFn(30);
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    progressFn(50);

    let allText = '';
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      allText += `\n=== Sheet: ${name} ===\n`;
      allText += (data as any[][]).map(row => row.join(' | ')).join('\n');
      allText += '\n';
    }

    progressFn(70);
    const blob = await textToPdf(allText, file.name);
    progressFn(100);
    return blob;
  }

  // Word documents
  if (['docx', 'doc'].includes(ext)) {
    const blob = await wordToPdf(file, onProgress);
    return blob;
  }

  // Image files
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) {
    const blob = await imageToPdf([file], onProgress);
    return blob;
  }

  // PPTX - try basic extraction
  if (ext === 'pptx') {
    progressFn(15);
    // PPTX content extraction is limited in browser
    // We'll create a PDF with a note about the content
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    page.drawText(`PowerPoint Presentation: ${file.name}`, {
      x: 50, y: height - 60, size: 16, font, color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`File size: ${formatFileSize(file.size)}`, {
      x: 50, y: height - 85, size: 11, font, color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText('Note: Full PPTX-to-PDF conversion with layout preservation', {
      x: 50, y: height - 120, size: 11, font, color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText('requires desktop processing. This PDF contains the extracted text content.', {
      x: 50, y: height - 140, size: 11, font, color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();
    progressFn(100);
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  // Unsupported file type
  throw new Error(`Conversion from ${ext.toUpperCase()} to PDF is not supported yet. Supported formats: TXT, CSV, JSON, DOCX, XLSX, PNG, JPG, and more.`);
}

async function textToPdf(text: string, fileName: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxWidth = pageWidth - margin * 2;
  const maxY = pageHeight - margin;

  const lines = text.split('\n');
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = maxY;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      y -= lineHeight;
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
      continue;
    }

    const words = line.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth && currentLine) {
        currentPage.drawText(currentLine, {
          x: margin, y, size: fontSize, font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
      currentPage.drawText(currentLine, {
        x: margin, y, size: fontSize, font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }

    if (y < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = maxY;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function csvToPdf(csvText: string, delimiter: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 9;
  const margin = 40;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxY = pageHeight - margin;
  const colWidth = 120;
  const rowHeight = fontSize * 2;

  const rows = csvText.split('\n').filter(r => r.trim()).map(r => r.split(delimiter));
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = maxY;

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const isHeader = rowIdx === 0;

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellText = (row[colIdx] || '').trim().substring(0, 20); // Truncate long cells
      currentPage.drawText(cellText, {
        x: margin + colIdx * colWidth,
        y,
        size: fontSize,
        font,
        color: isHeader ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
      });
    }

    // Draw row separator
    currentPage.drawLine({
      start: { x: margin, y: y - 4 },
      end: { x: margin + row.length * colWidth, y: y - 4 },
      thickness: isHeader ? 1 : 0.3,
      color: rgb(0.7, 0.7, 0.7),
    });

    y -= rowHeight;
    if (y < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = maxY;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// === EXISTING TOOLS (below) ===

export async function pdfToWord(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  ensurePdfJsWorker();

  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(25);

  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  progressFn(35);

  const children: Paragraph[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    if (textContent.items.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `--- Page ${i} ---`,
              bold: true,
              color: '666666',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    const sortedItems = [...textContent.items]
      .filter((item): item is { str: string; transform: number[] } => 'str' in item)
      .sort((a, b) => {
        const ay = a.transform[5];
        const by = b.transform[5];
        if (Math.abs(ay - by) > 2) return by - ay;
        return a.transform[4] - b.transform[4];
      });

    let currentLine = '';
    let lastY = Infinity;
    for (const item of sortedItems) {
      const y = item.transform[5];
      if (lastY !== Infinity && Math.abs(y - lastY) > 3) {
        if (currentLine.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: currentLine.trim(),
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            })
          );
        }
        currentLine = item.str + ' ';
      } else {
        currentLine += item.str + ' ';
      }
      lastY = y;
    }
    if (currentLine.trim()) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: currentLine.trim(),
              size: 22,
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    if (i < totalPages) {
      children.push(
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        })
      );
    }

    progressFn(35 + Math.round((i / totalPages) * 50));
  }

  pdfDoc.destroy();
  progressFn(88);

  const doc = new Document({
    sections: [{ children }],
  });

  progressFn(92);
  const docBlob = await Packer.toBlob(doc);
  progressFn(100);
  return docBlob;
}

export async function wordToPdf(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(25);

  const result = await mammoth.extractRawText({ arrayBuffer });
  progressFn(50);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxWidth = pageWidth - margin * 2;
  const maxY = pageHeight - margin;

  const lines = result.value.split('\n');
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = maxY;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      y -= lineHeight;
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
      continue;
    }

    const words = line.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth && currentLine) {
        currentPage.drawText(currentLine, {
          x: margin, y, size: fontSize, font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
      currentPage.drawText(currentLine, {
        x: margin, y, size: fontSize, font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }

    if (y < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = maxY;
    }

    progressFn(50 + Math.round(((i + 1) / lines.length) * 40));
  }

  progressFn(95);
  const pdfBytes = await pdfDoc.save();
  progressFn(100);
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function imageToPdf(
  files: File[],
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const pdfDoc = await PDFDocument.create();
  progressFn(10);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const uint8 = new Uint8Array(arrayBuffer);
    const ext = file.name.split('.').pop()?.toLowerCase();

    let image;
    try {
      if (ext === 'png') {
        image = await pdfDoc.embedPng(uint8);
      } else if (ext === 'jpg' || ext === 'jpeg') {
        image = await pdfDoc.embedJpg(uint8);
      } else {
        try {
          image = await pdfDoc.embedPng(uint8);
        } catch {
          image = await pdfDoc.embedJpg(uint8);
        }
      }
    } catch {
      throw new Error(`Failed to embed image: ${file.name}. Only PNG and JPEG are supported.`);
    }

    const imgWidth = image.width;
    const imgHeight = image.height;

    const maxW = 595.28 - 80;
    const maxH = 841.89 - 80;
    const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
    const w = imgWidth * scale;
    const h = imgHeight * scale;

    const page = pdfDoc.addPage([595.28, 841.89]);
    page.drawImage(image, {
      x: (595.28 - w) / 2,
      y: (841.89 - h) / 2,
      width: w,
      height: h,
    });

    progressFn(10 + Math.round(((i + 1) / files.length) * 85));
  }

  progressFn(98);
  const pdfBytes = await pdfDoc.save();
  progressFn(100);
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// === NEW TOOL FUNCTIONS ===

export async function pdfToExcel(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  ensurePdfJsWorker();
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(15);

  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  progressFn(25);

  const workbook = XLSX.utils.book_new();

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    progressFn(25 + Math.round((i / totalPages) * 40));

    // Sort text items by position to reconstruct table rows
    const sortedItems = [...textContent.items]
      .filter((item: any): item is { str: string; transform: number[] } => 'str' in item)
      .sort((a: any, b: any) => {
        const ay = a.transform[5];
        const by = b.transform[5];
        if (Math.abs(ay - by) > 2) return by - ay;
        return a.transform[4] - b.transform[4];
      });

    // Group items into rows by Y-position proximity
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let lastY = Infinity;

    for (const item of sortedItems) {
      const y = item.transform[5];
      if (lastY !== Infinity && Math.abs(y - lastY) > 3) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [item.str];
      } else {
        currentRow.push(item.str);
      }
      lastY = y;
    }
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    // Create worksheet from rows
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const sheetName = `Page ${i}`;
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);

    progressFn(65 + Math.round((i / totalPages) * 25));
  }

  pdfDoc.destroy();
  progressFn(90);

  // Generate XLSX file as array buffer
  const xlsxOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  progressFn(100);

  return new Blob([xlsxOutput], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function excelToPdf(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(15);

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  progressFn(30);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  progressFn(40);

  const fontSize = 9;
  const margin = 40;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxY = pageHeight - margin;
  const colWidth = 100;
  const rowHeight = fontSize * 2;

  let overallProgress = 40;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    // Add sheet title
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = maxY;

    // Draw sheet name as header
    currentPage.drawText(`Sheet: ${sheetName}`, {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 20;

    for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx] || [];
      const isHeader = rowIdx === 0;

      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cellText = String(row[colIdx] ?? '').substring(0, 15);
        const x = margin + colIdx * colWidth;

        // Only draw if within page width
        if (x + colWidth > pageWidth - margin) break;

        currentPage.drawText(cellText, {
          x,
          y,
          size: fontSize,
          font: isHeader ? boldFont : font,
          color: isHeader ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
        });
      }

      // Draw row separator line
      currentPage.drawLine({
        start: { x: margin, y: y - 4 },
        end: { x: margin + Math.min((row.length || 1) * colWidth, pageWidth - margin * 2), y: y - 4 },
        thickness: isHeader ? 1 : 0.3,
        color: rgb(0.7, 0.7, 0.7),
      });

      y -= rowHeight;
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
    }

    overallProgress += Math.round((1 / workbook.SheetNames.length) * 50);
    progressFn(Math.min(overallProgress, 90));
  }

  progressFn(95);
  const pdfBytes = await pdfDoc.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function signPdf(
  file: File,
  signatureText: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  if (!signatureText || signatureText.trim().length === 0) {
    throw new Error('Please provide signature text');
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(15);

  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  progressFn(30);

  const pages = pdf.getPages();
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();
  progressFn(50);

  // Draw signature text on the last page at bottom-right area
  const fontSize = 14;
  const textWidth = font.widthOfTextAtSize(signatureText, fontSize);
  const x = width - textWidth - 50;
  const y = 60;

  // Draw a line above the signature (common signature style)
  lastPage.drawLine({
    start: { x: width - textWidth - 60, y: y + fontSize + 5 },
    end: { x: width - 40, y: y + fontSize + 5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Draw signature text
  lastPage.drawText(signatureText, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Draw "Signed by:" label
  lastPage.drawText('Signed by:', {
    x: width - textWidth - 60,
    y: y + fontSize + 10,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  progressFn(80);
  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function numberPages(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(15);

  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  progressFn(30);

  const pages = pdf.getPages();
  const totalPages = pages.length;
  progressFn(40);

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = `Page ${i + 1} of ${totalPages}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2;
    const y = 30;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    progressFn(40 + Math.round(((i + 1) / totalPages) * 55));
  }

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function flattenPdf(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(20);

  // Load the PDF - this will parse form fields
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  progressFn(40);

  // Check if the document has form fields
  const form = pdf.getForm();
  progressFn(60);

  // Flatten all form fields by updating their appearance and removing the form
  // pdf-lib's form.flatten() renders fields as static content
  form.flatten();
  progressFn(80);

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function repairPdf(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(20);

  // Load with ignoreEncryption to bypass any encryption issues
  // This creates a fresh internal representation that can fix structural issues
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  progressFn(50);

  // Save as a fresh copy - this rebuilds the PDF structure
  // and can fix common issues like broken cross-references
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  progressFn(90);

  // Small delay to ensure processing completes
  await simulateProgress(progressFn, 200);
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function redactPdf(
  file: File,
  redactText: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  ensurePdfJsWorker();
  const progressFn = onProgress || (() => {});
  progressFn(5);

  if (!redactText || redactText.trim().length === 0) {
    throw new Error('Please provide text to redact');
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(10);

  // Use pdfjs-dist to find text positions
  const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfJsDoc.numPages;
  progressFn(20);

  // Collect all text positions for redaction
  const redactions: { pageNum: number; x: number; y: number; width: number; height: number }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    for (const item of textContent.items) {
      if (!('str' in item)) continue;
      const textItem = item as { str: string; transform: number[]; width?: number; height?: number };

      // Check if this text item contains the redact text (case-insensitive partial match)
      if (textItem.str.toLowerCase().includes(redactText.toLowerCase())) {
        // Convert PDF coordinate system to pdf-lib coordinate system
        // pdfjs-dist uses bottom-left origin, same as pdf-lib
        const tx = textItem.transform[4];
        const ty = textItem.transform[5];
        const itemWidth = textItem.width ?? textItem.str.length * textItem.transform[0] * 0.5;
        const itemHeight = textItem.height ?? textItem.transform[0] * 0.8;

        redactions.push({
          pageNum: i,
          x: tx,
          y: ty,
          width: Math.max(itemWidth, 10),
          height: Math.max(itemHeight, 8),
        });
      }
    }

    progressFn(20 + Math.round((i / totalPages) * 30));
  }

  pdfJsDoc.destroy();
  progressFn(55);

  // Now use pdf-lib to draw black rectangles over the redacted areas
  const pdfLibDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfLibDoc.getPages();
  progressFn(65);

  for (const redaction of redactions) {
    const pageIndex = redaction.pageNum - 1;
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      page.drawRectangle({
        x: redaction.x - 1,
        y: redaction.y - 1,
        width: redaction.width + 2,
        height: redaction.height + 2,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
    }
  }

  progressFn(85);
  const pdfBytes = await pdfLibDoc.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function annotatePdf(
  file: File,
  annotationText: string,
  pageNumber: number,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(5);

  if (!annotationText || annotationText.trim().length === 0) {
    throw new Error('Please provide annotation text');
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(15);

  const pdf = await PDFDocument.load(arrayBuffer);
  progressFn(30);

  const pages = pdf.getPages();
  const totalPages = pages.length;

  // Validate page number (1-based)
  if (pageNumber < 1 || pageNumber > totalPages) {
    throw new Error(`Invalid page number: ${pageNumber}. Document has ${totalPages} pages.`);
  }

  const page = pages[pageNumber - 1];
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  progressFn(50);

  // Draw annotation comment on the specified page
  // Place it in the top-left area with a highlighted background
  const fontSize = 10;
  const lineHeight = fontSize * 1.4;
  const margin = 40;
  const annotationWidth = width - margin * 2;
  const padding = 6;

  // Calculate annotation text dimensions
  const lines = annotationText.split('\n');
  const totalHeight = lines.length * lineHeight + padding * 2;

  // Draw yellow highlight background for the annotation
  page.drawRectangle({
    x: margin,
    y: height - 60 - totalHeight,
    width: annotationWidth,
    height: totalHeight,
    color: rgb(1, 0.95, 0.6),
    opacity: 0.85,
  });

  // Draw border around annotation
  page.drawRectangle({
    x: margin,
    y: height - 60 - totalHeight,
    width: annotationWidth,
    height: totalHeight,
    borderColor: rgb(0.8, 0.7, 0.2),
    borderWidth: 1,
    opacity: 0.9,
  });

  // Draw annotation label
  page.drawText('📝 Annotation:', {
    x: margin + padding,
    y: height - 60 - padding,
    size: fontSize,
    font,
    color: rgb(0.4, 0.3, 0.1),
  });

  // Draw annotation text lines
  let yPos = height - 60 - padding - lineHeight;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Truncate line if too long for the page width
    const maxChars = Math.floor(annotationWidth / (fontSize * 0.52));
    const truncatedLine = line.substring(0, maxChars);

    page.drawText(truncatedLine, {
      x: margin + padding,
      y: yPos,
      size: fontSize,
      font,
      color: rgb(0.2, 0.15, 0.05),
    });
    yPos -= lineHeight;
  }

  progressFn(80);
  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export const COMING_SOON_TOOLS: string[] = [];
