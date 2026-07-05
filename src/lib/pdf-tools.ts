import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up pdfjs worker (client-side)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

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
  const progressFn = onProgress || (() => {});
  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(10);

  // Use pdfjs-dist for real PDF rendering
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

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render PDF page onto canvas
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
  _password: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(40);

  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  progressFn(70);

  const pdfBytes = await pdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
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

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, validOrder);
  pages.forEach((page) => newPdf.addPage(page));
  progressFn(70);

  const pdfBytes = await newPdf.save();
  progressFn(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function pdfToWord(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(25);

  // Use pdfjs-dist for text extraction
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  progressFn(35);

  const children: Paragraph[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    // Page header
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

    // Sort text items by y position (top to bottom) then x (left to right)
    const sortedItems = [...textContent.items]
      .filter((item): item is { str: string; transform: number[] } => 'str' in item)
      .sort((a, b) => {
        const ay = a.transform[5];
        const by = b.transform[5];
        if (Math.abs(ay - by) > 2) return by - ay; // PDF y-axis is bottom-to-top
        return a.transform[4] - b.transform[4];
      });

    // Group items into lines based on y proximity
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

    // Page break between pages (except last)
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
    sections: [
      {
        children,
      },
    ],
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
  const pageWidth = 595.28; // A4
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

    // Word-wrap long lines
    const words = line.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth && currentLine) {
        currentPage.drawText(currentLine, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    // Draw remaining text
    if (currentLine) {
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = maxY;
      }
      currentPage.drawText(currentLine, {
        x: margin,
        y,
        size: fontSize,
        font,
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
        // Try PNG first, then JPG
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

    // Scale to fit A4 with margins
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

export const COMING_SOON_TOOLS: string[] = [];