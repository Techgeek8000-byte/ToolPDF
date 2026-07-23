// ============================================================
// file-reader.ts – Universal file reading capability (FREE tier)
// Reads text, code, CSV, spreadsheets, presentations, images,
// PDFs, audio, video, fonts, eBooks, databases, CAD/3D, archives
// All processing happens in-browser for privacy
// ============================================================

import * as pdfjsLib from 'pdfjs-dist';

function ensurePdfJsWorker() {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface FileReadResult {
  content: string;
  type: 'text' | 'html' | 'table' | 'image' | 'pdf-text' | 'audio' | 'video';
  metadata?: {
    pages?: number;
    title?: string;
    author?: string;
    rows?: number;
    cols?: number;
    sheets?: string[];
    // Audio metadata
    duration?: number;
    channels?: number;
    sampleRate?: number;
    bitrate?: number;
    // Video metadata
    width?: number;
    height?: number;
    fps?: number;
    // Common metadata
    format?: string;
    encoding?: string;
  };
  previewData?: string[][]; // For spreadsheet data
  imageData?: string; // For image preview (data URL)
}

// Supported file extensions grouped by type
const textExtensions = [
  'txt', 'md', 'markdown', 'log', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml',
  'html', 'htm', 'css', 'scss', 'less', 'js', 'jsx', 'ts', 'tsx', 'mjs',
  'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'rs',
  'swift', 'kt', 'scala', 'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd',
  'sql', 'r', 'tex', 'ini', 'cfg', 'conf', 'env', 'properties',
  'toml', 'plist', 'svg', 'rtf', 'vtt', 'srt',
  // Added text/code file extensions
  'adoc', 'asciidoc', 'diff', 'patch', 'dockerfile', 'makefile', 'gradle',
  'cmake', 'ninja', 'meson', 'proto', 'graphql', 'gql',
  'dart', 'lua', 'vim', 'fish', 'elv', 'nushell', 'zig',
  'asm', 's', 'solidity', 'sol', 'vy', 'vyper',
];

const spreadsheetExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb', 'ods', 'csv', 'tsv'];
const presentationExtensions = ['pptx', 'ppt', 'odp'];
const documentExtensions = ['docx', 'doc', 'odt', 'rtf'];
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'];
const pdfExtensions = ['pdf'];
const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a'];
const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
const fontExtensions = ['ttf', 'otf', 'woff', 'woff2'];
const ebookExtensions = ['epub', 'mobi', 'azw3'];
const databaseExtensions = ['db', 'sqlite', 'sqlite3'];
const cadExtensions = ['stl', 'obj', '3ds', 'step', 'stp'];

export function getSupportedFileTypes(): { category: string; extensions: string[] }[] {
  return [
    { category: 'Text & Code', extensions: textExtensions },
    { category: 'Spreadsheets', extensions: spreadsheetExtensions },
    { category: 'Presentations', extensions: presentationExtensions },
    { category: 'Documents', extensions: documentExtensions },
    { category: 'Images', extensions: imageExtensions },
    { category: 'PDFs', extensions: pdfExtensions },
    { category: 'Audio', extensions: audioExtensions },
    { category: 'Video', extensions: videoExtensions },
    { category: 'Fonts', extensions: fontExtensions },
    { category: 'eBooks', extensions: ebookExtensions },
    { category: 'Databases', extensions: databaseExtensions },
    { category: 'CAD / 3D', extensions: cadExtensions },
    { category: 'Archives', extensions: archiveExtensions },
  ];
}

export function getFileCategory(ext: string): string {
  if (textExtensions.includes(ext)) return 'text';
  if (spreadsheetExtensions.includes(ext)) return 'spreadsheet';
  if (presentationExtensions.includes(ext)) return 'presentation';
  if (documentExtensions.includes(ext)) return 'document';
  if (imageExtensions.includes(ext)) return 'image';
  if (pdfExtensions.includes(ext)) return 'pdf';
  if (audioExtensions.includes(ext)) return 'audio';
  if (videoExtensions.includes(ext)) return 'video';
  if (fontExtensions.includes(ext)) return 'font';
  if (ebookExtensions.includes(ext)) return 'ebook';
  if (databaseExtensions.includes(ext)) return 'database';
  if (cadExtensions.includes(ext)) return 'cad';
  if (archiveExtensions.includes(ext)) return 'archive';
  return 'unknown';
}

export function getAcceptString(): string {
  const allExts = [
    ...textExtensions, ...spreadsheetExtensions, ...presentationExtensions,
    ...documentExtensions, ...imageExtensions, ...pdfExtensions,
    ...audioExtensions, ...videoExtensions, ...fontExtensions,
    ...ebookExtensions, ...databaseExtensions, ...cadExtensions,
    ...archiveExtensions,
  ];
  return allExts.map(e => `.${e}`).join(',');
}

/**
 * Read any supported file type and return structured content
 */
export async function readFileContent(
  file: File,
  onProgress?: (p: number) => void
): Promise<FileReadResult> {
  const progressFn = onProgress || (() => {});
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  progressFn(5);

  try {
    // === Text & Code files ===
    if (textExtensions.includes(ext)) {
      progressFn(20);
      const text = await readFileAsText(file);
      progressFn(80);

      // Special handling for CSV/TSV
      if (ext === 'csv' || ext === 'tsv') {
        const delimiter = ext === 'tsv' ? '\t' : ',';
        const rows = text.split('\n').filter(r => r.trim()).map(r => r.split(delimiter));
        progressFn(100);
        return {
          content: text,
          type: 'table',
          metadata: { rows: rows.length, cols: rows[0]?.length || 0 },
          previewData: rows.slice(0, 100),
        };
      }

      // Special handling for JSON
      if (ext === 'json') {
        try {
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          progressFn(100);
          return {
            content: formatted,
            type: 'text',
            metadata: { title: file.name },
          };
        } catch {
          progressFn(100);
          return { content: text, type: 'text' };
        }
      }

      // Special handling for HTML
      if (ext === 'html' || ext === 'htm') {
        progressFn(100);
        return { content: text, type: 'html' };
      }

      progressFn(100);
      return { content: text, type: 'text' };
    }

    // === PDF files ===
    if (pdfExtensions.includes(ext)) {
      ensurePdfJsWorker();
      progressFn(15);
      const arrayBuffer = await readFileAsArrayBuffer(file);
      progressFn(30);
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      progressFn(40);

      let fullText = '';
      const totalPages = pdfDoc.numPages;
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ');
        fullText += `\n--- Page ${i} ---\n${pageText}`;
        progressFn(40 + Math.round((i / totalPages) * 50));
      }

      const metadata = await pdfDoc.getMetadata();
      pdfDoc.destroy();
      progressFn(100);

      return {
        content: fullText,
        type: 'pdf-text',
        metadata: {
          pages: totalPages,
          title: metadata.info?.Title || '',
          author: metadata.info?.Author || '',
        },
      };
    }

    // === Image files ===
    if (imageExtensions.includes(ext)) {
      progressFn(30);
      const dataUrl = await readFileAsDataURL(file);
      progressFn(100);
      return {
        content: `[Image file: ${file.name}]`,
        type: 'image',
        imageData: dataUrl,
      };
    }

    // === Audio files ===
    if (audioExtensions.includes(ext)) {
      progressFn(30);
      const formatInfo = getAudioFormatInfo(ext);
      progressFn(70);
      const content = [
        `Audio file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is an audio file. Audio content cannot be displayed as text,`,
        `but you can play it using an audio player or process it with`,
        `speech-to-text tools for transcription.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'audio',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === Video files ===
    if (videoExtensions.includes(ext)) {
      progressFn(30);
      const formatInfo = getVideoFormatInfo(ext);
      progressFn(70);
      const content = [
        `Video file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is a video file. Video content cannot be displayed as text,`,
        `but you can extract frames or use video analysis tools to`,
        `process the visual and audio content.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'video',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === Font files ===
    if (fontExtensions.includes(ext)) {
      progressFn(30);
      const formatInfo = getFontFormatInfo(ext);
      progressFn(70);
      const content = [
        `Font file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is a font file. It contains typographic data that defines`,
        `the appearance of text characters. Font files cannot be displayed`,
        `as text content directly.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'text',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === eBook files ===
    if (ebookExtensions.includes(ext)) {
      progressFn(15);
      const formatInfo = getEbookFormatInfo(ext);
      // Try to read epub as a ZIP (epub is a ZIP of XHTML files)
      if (ext === 'epub') {
        try {
          const JSZip = await tryLoadJSZip();
          if (JSZip) {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            progressFn(30);
            const zip = await JSZip.loadAsync(arrayBuffer);
            progressFn(50);
            const text = await readEpubText(zip);
            progressFn(100);
            return {
              content: text,
              type: 'text',
              metadata: {
                title: file.name,
                format: 'EPUB',
              },
            };
          }
        } catch {
          // JSZip not available or parsing failed – fall through to info message
        }
      }
      progressFn(70);
      const content = [
        `eBook file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is an eBook file. Full text extraction may require`,
        `specialized eBook parsing tools.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'text',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === Database files ===
    if (databaseExtensions.includes(ext)) {
      progressFn(30);
      const formatInfo = getDatabaseFormatInfo(ext);
      progressFn(70);
      const content = [
        `Database file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is a database file. It contains structured data stored in`,
        `tables with rows and columns. Database files require specialized`,
        `tools (e.g., SQLite browser) to explore their contents.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'text',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === CAD / 3D files ===
    if (cadExtensions.includes(ext)) {
      progressFn(30);
      const formatInfo = getCadFormatInfo(ext);
      // STL and OBJ can sometimes be read as text (ASCII STL, OBJ)
      if (ext === 'obj' || (ext === 'stl')) {
        try {
          const text = await readFileAsText(file);
          // Check if it's ASCII STL (starts with "solid") or OBJ (contains typical keywords)
          if (ext === 'stl' && text.trimStart().startsWith('solid')) {
            progressFn(80);
            // Parse basic info from ASCII STL
            const facetCount = (text.match(/facet normal/g) || []).length;
            const content = [
              `CAD file: ${file.name}`,
              `Size: ${formatFileSize(file.size)}`,
              `Format: ASCII STL`,
              `Facets (triangles): ${facetCount}`,
              ``,
              `--- Raw Content (first 500 lines) ---`,
              text.split('\n').slice(0, 500).join('\n'),
            ].join('\n');
            progressFn(100);
            return {
              content,
              type: 'text',
              metadata: {
                format: 'ASCII STL',
                title: file.name,
              },
            };
          }
          if (ext === 'obj') {
            progressFn(80);
            const vertexCount = (text.match(/^v\s/gm) || []).length;
            const faceCount = (text.match(/^f\s/gm) || []).length;
            const content = [
              `CAD file: ${file.name}`,
              `Size: ${formatFileSize(file.size)}`,
              `Format: Wavefront OBJ`,
              `Vertices: ${vertexCount}`,
              `Faces: ${faceCount}`,
              ``,
              `--- Raw Content (first 500 lines) ---`,
              text.split('\n').slice(0, 500).join('\n'),
            ].join('\n');
            progressFn(100);
            return {
              content,
              type: 'text',
              metadata: {
                format: 'Wavefront OBJ',
                title: file.name,
              },
            };
          }
        } catch {
          // Binary STL or unreadable – fall through to info message
        }
      }
      const content = [
        `CAD/3D file: ${file.name}`,
        `Size: ${formatFileSize(file.size)}`,
        `Format: ${formatInfo.format}`,
        `Description: ${formatInfo.description}`,
        ``,
        `This is a CAD/3D model file. It contains geometric data for`,
        `3D objects. Binary format files cannot be read as text directly.`,
      ].join('\n');
      progressFn(100);
      return {
        content,
        type: 'text',
        metadata: {
          format: formatInfo.format,
          title: file.name,
        },
      };
    }

    // === Spreadsheet files ===
    if (spreadsheetExtensions.includes(ext)) {
      progressFn(15);
      if (ext === 'csv' || ext === 'tsv') {
        // Already handled above, but just in case
        const text = await readFileAsText(file);
        const delimiter = ext === 'tsv' ? '\t' : ',';
        const rows = text.split('\n').filter(r => r.trim()).map(r => r.split(delimiter));
        progressFn(100);
        return {
          content: text,
          type: 'table',
          metadata: { rows: rows.length, cols: rows[0]?.length || 0 },
          previewData: rows.slice(0, 100),
        };
      }

      // XLSX / XLS / ODS
      const XLSX = await import('xlsx');
      const arrayBuffer = await readFileAsArrayBuffer(file);
      progressFn(40);
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      progressFn(60);

      const sheetNames = workbook.SheetNames;
      const firstSheet = workbook.Sheets[sheetNames[0]];
      const jsonData: string[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Convert all sheets to text
      let allText = '';
      for (const name of sheetNames) {
        const sheet = workbook.Sheets[name];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        allText += `\n=== Sheet: ${name} ===\n`;
        allText += sheetData.map((row: any) => row.join(' | ')).join('\n');
      }

      progressFn(100);
      return {
        content: allText,
        type: 'table',
        metadata: {
          rows: jsonData.length,
          cols: jsonData[0]?.length || 0,
          sheets: sheetNames,
        },
        previewData: jsonData.slice(0, 100).map((row: any) =>
          Array.isArray(row) ? row.map((cell: any) => String(cell ?? '')) : [String(row)]
        ),
      };
    }

    // === Document files (Word, etc.) ===
    if (documentExtensions.includes(ext)) {
      progressFn(15);
      if (ext === 'docx' || ext === 'doc') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await readFileAsArrayBuffer(file);
        progressFn(30);
        const result = await mammoth.extractRawText({ arrayBuffer });
        progressFn(70);
        // Also try to get HTML for richer preview
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        progressFn(100);
        return {
          content: result.value,
          type: 'html',
          metadata: { title: file.name },
        };
      }
      // RTF - read as text (basic)
      if (ext === 'rtf') {
        const text = await readFileAsText(file);
        progressFn(100);
        return { content: text, type: 'text' };
      }
      // ODT - read as text (basic)
      const text = await readFileAsText(file);
      progressFn(100);
      return { content: text, type: 'text' };
    }

    // === Presentation files ===
    if (presentationExtensions.includes(ext)) {
      progressFn(15);
      // PPTX is a ZIP containing XML files - we'll extract slide text
      if (ext === 'pptx') {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        progressFn(30);

        // Try JSZip first for proper PPTX text extraction
        try {
          const JSZip = await tryLoadJSZip();
          if (JSZip) {
            progressFn(40);
            const text = await readPptxTextWithJSZip(arrayBuffer, JSZip);
            progressFn(100);
            return {
              content: text,
              type: 'text',
              metadata: { title: file.name },
            };
          }
        } catch {
          // JSZip not available or parsing failed – fall through to fallback
        }

        // Fallback: try the old xlsx-based approach
        try {
          const XLSX = await import('xlsx');
          const text = await readPptxText(arrayBuffer);
          progressFn(100);
          return {
            content: text,
            type: 'text',
            metadata: { title: file.name },
          };
        } catch {
          // Final fallback: just read as binary info
          progressFn(100);
          return {
            content: `Presentation file: ${file.name}\nSize: ${formatFileSize(file.size)}\nNote: Full PPTX text extraction requires server-side processing.`,
            type: 'text',
            metadata: { title: file.name },
          };
        }
      }
      // PPT, ODP - limited support
      progressFn(100);
      return {
        content: `Presentation file: ${file.name}\nSize: ${formatFileSize(file.size)}\nFormat: ${ext.toUpperCase()}`,
        type: 'text',
      };
    }

    // === Archive files ===
    if (archiveExtensions.includes(ext)) {
      // For ZIP files, try to list contents using JSZip
      if (ext === 'zip') {
        try {
          const JSZip = await tryLoadJSZip();
          if (JSZip) {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            progressFn(30);
            const zip = await JSZip.loadAsync(arrayBuffer);
            progressFn(60);
            const fileList: string[] = [];
            zip.forEach((relativePath: string, file: any) => {
              const isDir = file.dir;
              const size = file._data ? (file._data.uncompressedSize ?? 0) : 0;
              fileList.push(`${isDir ? '📁' : '📄'} ${relativePath}${isDir ? '/' : ''} ${!isDir && size ? `(${formatFileSize(size)})` : ''}`);
            });
            const content = [
              `Archive file: ${file.name}`,
              `Size: ${formatFileSize(file.size)}`,
              `Format: ZIP`,
              `Entries: ${fileList.length}`,
              ``,
              `--- Archive Contents ---`,
              fileList.join('\n'),
            ].join('\n');
            progressFn(100);
            return {
              content,
              type: 'text',
              metadata: {
                format: 'ZIP',
                title: file.name,
              },
            };
          }
        } catch {
          // JSZip not available or parsing failed – fall through to info message
        }
      }

      progressFn(100);
      return {
        content: `Archive file: ${file.name}\nSize: ${formatFileSize(file.size)}\nFormat: ${ext.toUpperCase()}\n\nArchive contents cannot be read directly in-browser for privacy. Use a desktop tool to extract.`,
        type: 'text',
      };
    }

    // === Unknown / unsupported ===
    progressFn(100);
    return {
      content: `File: ${file.name}\nSize: ${formatFileSize(file.size)}\n\nThis file type (${ext}) is not fully supported for content reading. You can still try to view it as raw text.`,
      type: 'text',
    };

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to read file';
    throw new Error(`Could not read "${file.name}": ${errorMsg}`);
  }
}

/**
 * Read PDF and return page-by-page content for viewing
 */
export async function readPdfContent(
  file: File,
  onProgress?: (p: number) => void
): Promise<FileReadResult> {
  ensurePdfJsWorker();
  const progressFn = onProgress || (() => {});
  progressFn(10);

  const arrayBuffer = await readFileAsArrayBuffer(file);
  progressFn(30);

  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  progressFn(40);

  let fullText = '';
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item: any) => 'str' in item)
      .map((item: any) => item.str)
      .join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}\n`;
    progressFn(40 + Math.round((i / totalPages) * 50));
  }

  const metadata = await pdfDoc.getMetadata();
  pdfDoc.destroy();
  progressFn(100);

  return {
    content: fullText,
    type: 'pdf-text',
    metadata: {
      pages: totalPages,
      title: metadata.info?.Title || file.name,
      author: metadata.info?.Author || '',
    },
  };
}

/**
 * Extract text from PPTX using JSZip for proper ZIP/XML parsing
 */
async function readPptxTextWithJSZip(arrayBuffer: ArrayBuffer, JSZip: any): Promise<string> {
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find all slide XML files (ppt/slides/slide1.xml, slide2.xml, etc.)
  const slideFiles: string[] = [];
  zip.forEach((path: string) => {
    const match = path.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) {
      slideFiles.push(path);
    }
  });

  // Sort slides by number
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
    return numA - numB;
  });

  let fullText = '';

  for (const slidePath of slideFiles) {
    const slideXml = await zip.file(slidePath)?.async('text');
    if (!slideXml) continue;

    // Parse XML to extract text content from <a:t> tags (PowerPoint text runs)
    const textMatches = slideXml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
    const slideText = textMatches
      .map((m: string) => m.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, ''))
      .filter((t: string) => t.trim())
      .join(' ');

    const slideNum = slidePath.match(/slide(\d+)/)?.[1] || '?';
    fullText += `\n--- Slide ${slideNum} ---\n${slideText}\n`;
  }

  // Also try to extract notes from slides
  const noteFiles: string[] = [];
  zip.forEach((path: string) => {
    const match = path.match(/^ppt\/notesSlides\/notesSlide(\d+)\.xml$/);
    if (match) {
      noteFiles.push(path);
    }
  });

  if (noteFiles.length > 0) {
    fullText += '\n--- Speaker Notes ---\n';
    for (const notePath of noteFiles) {
      const noteXml = await zip.file(notePath)?.async('text');
      if (!noteXml) continue;
      const textMatches = noteXml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
      const noteText = textMatches
        .map((m: string) => m.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, ''))
        .filter((t: string) => t.trim())
        .join(' ');
      if (noteText) {
        const noteNum = notePath.match(/notesSlide(\d+)/)?.[1] || '?';
        fullText += `Slide ${noteNum} Notes: ${noteText}\n`;
      }
    }
  }

  if (!fullText.trim()) {
    fullText = '[PowerPoint Presentation - no readable text content found in slides]';
  }

  return fullText;
}

/**
 * Extract text from EPUB using JSZip (EPUB is a ZIP of XHTML files)
 */
async function readEpubText(zip: any): Promise<string> {
  let fullText = '';

  // Read the OPF manifest to find content documents
  const opfPath = await findEpubOpfPath(zip);
  if (opfPath) {
    const opfXml = await zip.file(opfPath)?.async('text');
    if (opfXml) {
      // Find all item references to XHTML/HTML content
      const itemRegex = new RegExp('<item[^>]*href="([^"]*)"[^>]*media-type="application/xhtml[^"]*"[^>]*/>', 'g');
      const itemMatches = opfXml.match(itemRegex) || [];
      const contentPaths = itemMatches.map((m: string) => {
        const href = m.match(/href="([^"]*)"/)?.[1] || '';
        // Resolve relative paths against OPF directory
        const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';
        return opfDir + href;
      });

      for (const contentPath of contentPaths) {
        const contentXml = await zip.file(contentPath)?.async('text');
        if (!contentXml) continue;

        // Strip HTML tags to get plain text
        const text = contentXml
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (text) {
          fullText += text + '\n\n';
        }
      }
    }
  }

  // Fallback: if OPF parsing failed, try to find HTML/XHTML files directly
  if (!fullText.trim()) {
    const htmlFiles: string[] = [];
    zip.forEach((path: string) => {
      if (path.match(/\.(html|xhtml|htm)$/i) && !path.includes('toc')) {
        htmlFiles.push(path);
      }
    });

    for (const htmlPath of htmlFiles) {
      const content = await zip.file(htmlPath)?.async('text');
      if (!content) continue;
      const text = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) {
        fullText += text + '\n\n';
      }
    }
  }

  if (!fullText.trim()) {
    fullText = '[EPUB eBook - no readable text content could be extracted]';
  }

  return fullText;
}

/**
 * Find the path to the OPF file in an EPUB archive
 */
async function findEpubOpfPath(zip: any): Promise<string | null> {
  // Read container.xml to find the OPF path
  const containerXml = await zip.file('META-INF/container.xml')?.async('text');
  if (containerXml) {
    const match = containerXml.match(/full-path="([^"]*)"/);
    if (match) return match[1];
  }

  // Fallback: search for .opf files
  let opfPath: string | null = null;
  zip.forEach((path: string) => {
    if (path.endsWith('.opf')) {
      opfPath = path;
    }
  });
  return opfPath;
}

/**
 * Original PPTX text extraction fallback (simplified)
 */
async function readPptxText(arrayBuffer: ArrayBuffer): Promise<string> {
  // PPTX files are ZIP archives. This is a simplified fallback approach.
  try {
    // Simple fallback: describe the file
    return `[PowerPoint Presentation]\nThis file contains slide content that can be viewed in PowerPoint.\nFull text extraction from PPTX requires decompressing the ZIP structure, which has limited browser support for privacy reasons.\n\nTip: Use "Convert to PDF" first, then read the PDF content.`;
  } catch {
    return '[PowerPoint file - content extraction limited]';
  }
}

/**
 * Try to dynamically import JSZip; returns null if not available
 */
async function tryLoadJSZip(): Promise<any | null> {
  try {
    const JSZipModule = await import('jszip');
    const JSZip = (JSZipModule as any).default || JSZipModule;
    return JSZip;
  } catch {
    // JSZip is not installed – return null so callers can fall back
    return null;
  }
}

// === Format info helpers for new file types ===

function getAudioFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    mp3: { format: 'MP3 (MPEG-1 Audio Layer III)', description: 'Compressed audio format, widely supported, good quality-to-size ratio.' },
    wav: { format: 'WAV (Waveform Audio)', description: 'Uncompressed audio format, high quality, large file size.' },
    ogg: { format: 'OGG (Ogg Vorbis)', description: 'Open-source compressed audio format, good quality.' },
    flac: { format: 'FLAC (Free Lossless Audio Codec)', description: 'Lossless compressed audio, preserves original quality with smaller size.' },
    aac: { format: 'AAC (Advanced Audio Coding)', description: 'Compressed audio format, better quality than MP3 at same bitrate.' },
    wma: { format: 'WMA (Windows Media Audio)', description: 'Microsoft compressed audio format.' },
    m4a: { format: 'M4A (MPEG-4 Audio)', description: 'AAC audio in an MPEG-4 container, commonly used by Apple.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'Audio file.' };
}

function getVideoFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    mp4: { format: 'MP4 (MPEG-4)', description: 'Most common video format, widely supported across all platforms.' },
    avi: { format: 'AVI (Audio Video Interleave)', description: 'Legacy Microsoft video format, large file sizes.' },
    mov: { format: 'MOV (QuickTime)', description: 'Apple QuickTime video format, commonly used in filmmaking.' },
    mkv: { format: 'MKV (Matroska)', description: 'Open-source flexible video container, supports many codecs.' },
    webm: { format: 'WebM', description: 'Open web video format, designed for HTML5 video playback.' },
    flv: { format: 'FLV (Flash Video)', description: 'Legacy Adobe Flash video format.' },
    wmv: { format: 'WMV (Windows Media Video)', description: 'Microsoft compressed video format.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'Video file.' };
}

function getFontFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    ttf: { format: 'TTF (TrueType Font)', description: 'Standard outline font format, widely supported across all OS.' },
    otf: { format: 'OTF (OpenType Font)', description: 'Advanced font format based on TrueType with extended typographic features.' },
    woff: { format: 'WOFF (Web Open Font Format)', description: 'Compressed font format optimized for web use.' },
    woff2: { format: 'WOFF2 (Web Open Font Format 2)', description: 'Improved compressed web font format with better compression than WOFF.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'Font file.' };
}

function getEbookFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    epub: { format: 'EPUB (Electronic Publication)', description: 'Open standard eBook format, reflowable text, widely supported.' },
    mobi: { format: 'MOBI (Mobipocket)', description: 'Amazon Kindle legacy eBook format.' },
    azw3: { format: 'AZW3 (Kindle Format 8)', description: 'Amazon Kindle modern eBook format with enhanced formatting.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'eBook file.' };
}

function getDatabaseFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    db: { format: 'DB (Generic Database)', description: 'Generic database file, may contain various database formats.' },
    sqlite: { format: 'SQLite', description: 'Lightweight embedded relational database, widely used in apps.' },
    sqlite3: { format: 'SQLite3', description: 'SQLite version 3 database file.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'Database file.' };
}

function getCadFormatInfo(ext: string): { format: string; description: string } {
  const formats: Record<string, { format: string; description: string }> = {
    stl: { format: 'STL (Steriolithography)', description: '3D surface geometry format, widely used for 3D printing.' },
    obj: { format: 'OBJ (Wavefront)', description: '3D geometry format with vertices, faces, and material references.' },
    '3ds': { format: '3DS (3D Studio)', description: 'Legacy Autodesk 3D model format.' },
    step: { format: 'STEP (Standard for Exchange of Product Data)', description: 'ISO standard 3D CAD data exchange format.' },
    stp: { format: 'STP (STEP)', description: 'Same as STEP, alternate file extension.' },
  };
  return formats[ext] || { format: ext.toUpperCase(), description: 'CAD/3D model file.' };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
