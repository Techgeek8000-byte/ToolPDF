// ============================================================
// unlock-pdf.ts – PDF password decryption / removal (PREMIUM tier)
// Attempts to unlock password-protected PDFs by removing encryption
// Uses the provided password to decrypt, then saves without encryption
// ============================================================

import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

function ensurePdfJsWorker() {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Attempt to unlock a password-protected PDF
 * Strategy: Use pdfjs-dist to decrypt with the provided password,
 * then re-save as an unencrypted PDF using pdf-lib
 */
export async function unlockPDF(
  file: File,
  password: string,
  onProgress?: (p: number) => void
): Promise<Blob> {
  ensurePdfJsWorker();
  const progressFn = onProgress || (() => {});
  progressFn(5);

  if (!password || password.trim().length === 0) {
    throw new Error('Please enter the PDF password to unlock it');
  }

  const arrayBuffer = await file.arrayBuffer();
  progressFn(15);

  // Step 1: Try to open the PDF with pdfjs-dist using the password
  let pdfDoc;
  try {
    // pdfjs-dist handles password decryption
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password,
    });

    pdfDoc = await loadingTask.promise;
    progressFn(40);
  } catch (err: any) {
    if (err?.name === 'PasswordException') {
      throw new Error('Incorrect password. Please try again with the correct password.');
    }
    throw new Error('Failed to unlock PDF: ' + (err?.message || 'Unknown error'));
  }

  // Step 2: Extract all pages' content and create a new unencrypted PDF
  // We need to render each page and create a fresh PDF
  const totalPages = pdfDoc.numPages;
  progressFn(50);

  try {
    // Strategy: Create a new PDF from scratch by copying page content
    // Use pdf-lib to load and save without encryption
    
    // First, try the direct approach: load with pdf-lib using ignoreEncryption
    // This works for many PDFs where the encryption is just a restriction flag
    try {
      const pdfLibDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      progressFn(70);

      // Save without any encryption
      const cleanBytes = await pdfLibDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      progressFn(90);

      // Verify the output is readable without password
      try {
        const verifyDoc = await PDFDocument.load(cleanBytes);
        progressFn(100);
        return new Blob([cleanBytes], { type: 'application/pdf' });
      } catch {
        // If direct approach failed, fall through to the render approach
        progressFn(70);
      }
    } catch {
      // Direct approach failed, use render approach
      progressFn(60);
    }

    // Step 3: Render-based approach - render each page to canvas and create fresh PDF
    const newPdfDoc = await PDFDocument.create();
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

      // Convert canvas to PNG and embed in new PDF
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBase64 = pngDataUrl.split(',')[1];
      const pngUint8 = Uint8Array.from(atob(pngBase64), c => c.charCodeAt(0));

      const image = await newPdfDoc.embedPng(pngUint8);
      const pdfPage = newPdfDoc.addPage([viewport.width / scale, viewport.height / scale]);
      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: viewport.width / scale,
        height: viewport.height / scale,
      });

      progressFn(60 + Math.round((i / totalPages) * 30));
    }

    pdfDoc.destroy();
    progressFn(95);

    const pdfBytes = await newPdfDoc.save();
    progressFn(100);

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (err) {
    pdfDoc?.destroy();
    const errorMsg = err instanceof Error ? err.message : 'Unlock failed';
    throw new Error(errorMsg);
  }
}

/**
 * Check if a PDF is password-protected (requires password to open)
 */
export async function checkPdfEncryption(
  file: File
): Promise<{ isEncrypted: boolean; isOwnerProtected: boolean }> {
  ensurePdfJsWorker();

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Try opening without password
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      await loadingTask.promise;
      // Opens without password - not user-password protected
      // But could still have owner password (permissions)
      return { isEncrypted: false, isOwnerProtected: false };
    } catch (err: any) {
      if (err?.name === 'PasswordException') {
        // Requires password to open
        return { isEncrypted: true, isOwnerProtected: false };
      }
    }

    return { isEncrypted: false, isOwnerProtected: false };
  } catch {
    return { isEncrypted: false, isOwnerProtected: false };
  }
}
