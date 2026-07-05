// ============================================================
// pdf-encrypt.ts – Client-side PDF password protection
// Implements PDF Standard Security Handler (R=2, V=1, 40-bit RC4)
// Properly handles pdf-lib's cross-reference streams
// ============================================================

function md5(data: Uint8Array): Uint8Array {
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  const padLen = ((56 - (msgLen + 1) % 64) + 64) % 64;
  const padded = new Uint8Array(msgLen + 1 + padLen + 8);
  padded.set(data);
  padded[msgLen] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, bitLen >>> 0, true);
  dv.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const S = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5, 9,14,20,5, 9,14,20,5, 9,14,20,5, 9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;

  const chunk = new DataView(padded.buffer);
  for (let off = 0; off < padded.length; off += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) M[j] = chunk.getUint32(off + j * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const hash = new Uint8Array(16);
  const hv = new DataView(hash.buffer);
  hv.setUint32(0, a0, true); hv.setUint32(4, b0, true);
  hv.setUint32(8, c0, true); hv.setUint32(12, d0, true);
  return hash;
}

function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 255;
    [S[i], S[j]] = [S[j], S[i]];
  }
  const result = new Uint8Array(data.length);
  let i2 = 0, j2 = 0;
  for (let k = 0; k < data.length; k++) {
    i2 = (i2 + 1) & 255;
    j2 = (j2 + S[i2]) & 255;
    [S[i2], S[j2]] = [S[j2], S[i2]];
    result[k] = data[k] ^ S[(S[i2] + S[j2]) & 255];
  }
  return result;
}

const STD_PAD = new Uint8Array([
  0x28,0xBF,0x4E,0x5E,0x4E,0x75,0x8A,0x41,
  0x64,0x00,0x4B,0x49,0x43,0x55,0x46,0x59,
  0x77,0x97,0x2A,0x73,0x21,0x7E,0xD6,0x7F,
  0xE3,0x7B,0x9F,0xD4,0x3C,0x38,0x91,0x2B,
]);

function padPassword(pass: string): Uint8Array {
  const result = new Uint8Array(32);
  const bytes = new TextEncoder().encode(pass);
  const len = Math.min(bytes.length, 32);
  for (let i = 0; i < 32; i++) result[i] = i < len ? bytes[i] : STD_PAD[i - len];
  return result;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Main: Add password protection to PDF bytes ---
export function addPasswordProtection(pdfBytes: Uint8Array, password: string): Uint8Array {
  const paddedUser = padPassword(password);
  const paddedOwner = padPassword(password);
  const str = new TextDecoder('latin1').decode(pdfBytes);

  // Get or generate file ID
  let fileId: Uint8Array;
  const idMatch = str.match(/\/ID\s*\[\s*<([0-9a-fA-F]+)>/);
  if (idMatch) {
    const hex = idMatch[1];
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    fileId = bytes;
  } else {
    fileId = new Uint8Array(16);
    crypto.getRandomValues(fileId);
  }
  const fileIdHex = toHex(fileId);

  // Algorithm 4 (R=2): Compute O value
  const md5Owner = md5(paddedOwner);
  let oVal = rc4(md5Owner, new Uint8Array(STD_PAD));
  for (let i = 1; i <= 19; i++) {
    const xoredKey = new Uint8Array(md5Owner.length);
    for (let j = 0; j < md5Owner.length; j++) xoredKey[j] = md5Owner[j] ^ i;
    oVal = rc4(xoredKey, oVal);
  }
  const oHex = toHex(oVal);

  // Algorithm 3 (R=2): Compute encryption key (40-bit)
  const pBytes = new Uint8Array(4);
  new DataView(pBytes.buffer).setInt32(0, -3904, true);
  const keyInput = new Uint8Array(32 + 32 + 4 + 16);
  keyInput.set(paddedUser, 0);
  keyInput.set(oVal, 32);
  keyInput.set(pBytes, 64);
  keyInput.set(fileId, 68);
  const encKey = md5(keyInput).slice(0, 5);

  // Algorithm 5 (R=2): Compute U value
  const uVal = rc4(encKey, new Uint8Array(STD_PAD));
  const uHex = toHex(uVal);

  // Find where the old xref/cross-ref-stream section starts
  const startxrefMatch = str.match(/startxref\s+(\d+)/);
  if (!startxrefMatch) throw new Error('Invalid PDF: no startxref found');
  const xrefStartOffset = parseInt(startxrefMatch[1], 10);

  // Everything before the xref section = header + body objects
  const beforeXref = pdfBytes.slice(0, xrefStartOffset);
  const beforeXrefStr = str.substring(0, xrefStartOffset);

  // Find all top-level objects in the body
  const objPattern = /^(\d+)\s+0\s+obj/gm;
  const objects: { num: number; offset: number } = [];
  let m;
  while ((m = objPattern.exec(beforeXrefStr)) !== null) {
    const num = parseInt(m[1], 10);
    if (!objects.find(o => o.num === num)) {
      objects.push({ num, offset: m.index });
    }
  }
  if (objects.length === 0) throw new Error('No PDF objects found');
  objects.sort((a, b) => a.num - b.num);

  const maxObjNum = objects[objects.length - 1].num;
  const newObjNum = maxObjNum + 1;
  const totalObjs = newObjNum + 1;

  // Build the /Encrypt object
  const encryptObjStr =
    `${newObjNum} 0 obj\n` +
    `<< /Filter /Standard /V 1 /R 2 /Length 40 /P -3904 ` +
    `/O <${oHex}> /U <${uHex}> >>\n` +
    `endobj\n`;
  const encryptObjBytes = new TextEncoder().encode(encryptObjStr);

  // The encrypt object will be placed at the old xref position
  const newObjOffset = xrefStartOffset;

  // Add new object to list
  objects.push({ num: newObjNum, offset: newObjOffset });
  objects.sort((a, b) => a.num - b.num);

  // Build text-based xref table (replaces any cross-ref stream)
  let xrefTable = `xref\n0 ${totalObjs}\n`;
  xrefTable += `0000000000 65535 f \n`;
  for (let i = 1; i < totalObjs; i++) {
    const obj = objects.find(o => o.num === i);
    if (obj) {
      xrefTable += `${String(obj.offset).padStart(10, '0')} 00000 n \n`;
    } else {
      xrefTable += `0000000000 00000 f \n`;
    }
  }

  // Find /Root reference
  const rootMatch = str.match(/\/Root\s+(\d+)\s+\d+\s+R/);
  if (!rootMatch) throw new Error('Cannot find /Root in PDF');
  const rootRef = `${rootMatch[1]} 0 R`;

  // Find /Info reference if present
  const infoMatch = str.match(/\/Info\s+(\d+)\s+\d+\s+R/);
  const infoStr = infoMatch ? `/Info ${infoMatch[1]} 0 R` : '';

  // Use existing ID or generate new one
  const fullIdMatch = str.match(/\/ID\s*\[\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*\]/);
  const idStr = fullIdMatch
    ? `/ID [<${fullIdMatch[1]}> <${fullIdMatch[2]}>]`
    : `/ID [<${fileIdHex}> <${fileIdHex}>]`;

  // Build trailer
  const trailer =
    `trailer\n` +
    `<< /Size ${totalObjs} /Root ${rootRef} ${idStr} ${infoStr} /Encrypt ${newObjNum} 0 R >>\n` +
    `startxref\n${newObjOffset + encryptObjBytes.length}\n` +
    `%%EOF\n`;

  // Combine: [before-xref] + [encrypt-obj] + [xref-table] + [trailer]
  const xrefBytes = new TextEncoder().encode(xrefTable);
  const trailerBytes = new TextEncoder().encode(trailer);

  const result = new Uint8Array(
    beforeXref.length + encryptObjBytes.length + xrefBytes.length + trailerBytes.length
  );
  let off = 0;
  result.set(beforeXref, off); off += beforeXref.length;
  result.set(encryptObjBytes, off); off += encryptObjBytes.length;
  result.set(xrefBytes, off); off += xrefBytes.length;
  result.set(trailerBytes, off);

  return result;
}