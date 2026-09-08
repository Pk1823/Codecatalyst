const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPng(width, height, pixelFn) {
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = Math.min(255, Math.max(0, Math.round(r)));
      raw[pxOffset + 1] = Math.min(255, Math.max(0, Math.round(g)));
      raw[pxOffset + 2] = Math.min(255, Math.max(0, Math.round(b)));
      raw[pxOffset + 3] = Math.min(255, Math.max(0, Math.round(a)));
    }
  }

  const deflated = zlib.deflateSync(raw);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    header,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, pngBuffer }
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const entries = [];
  const datas = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.pngBuffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset

    entries.push(entry);
    datas.push(img.pngBuffer);
    offset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

// Distance from point (px, py) to line segment (x1, y1) - (x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Shield pixel renderer
function shieldPixel(x, y, w, h) {
  // Normalize coordinates to [0, 1]
  const nx = x / (w - 1);
  const ny = y / (h - 1);

  // Rounded squircle / defense shield shape
  // Top: rounded rectangle from y=0.08 to y=0.52
  // Bottom: tapers to bottom center (0.5, 0.94)
  const cx = nx - 0.5;
  const absCx = Math.abs(cx);

  // Half-width at normalized y
  let maxW;
  if (ny < 0.08) {
    // Top border radius
    const dy = 0.08 - ny;
    maxW = 0.38 - (dy * dy * 10);
  } else if (ny <= 0.52) {
    maxW = 0.40;
  } else if (ny <= 0.94) {
    // Tapering to shield point
    const t = (ny - 0.52) / (0.94 - 0.52);
    // Smooth quadratic curve to bottom tip
    maxW = 0.40 * (1 - Math.pow(t, 1.4));
  } else {
    maxW = -1;
  }

  if (absCx > maxW || maxW <= 0) {
    // Outside shield
    return [0, 0, 0, 0];
  }

  // Smooth anti-aliased edge
  const edgeDist = maxW - absCx;
  const edgeAlpha = Math.min(1, Math.max(0, edgeDist * w * 1.2));

  // Shield Base Gradient: Deep Emerald (#047857 -> [4, 120, 87]) to Bright Mint (#10B981 -> [16, 185, 129])
  const gradT = ny;
  let r = 4 + (16 - 4) * gradT;
  let g = 120 + (185 - 120) * gradT;
  let b = 87 + (129 - 87) * gradT;
  let a = 255 * edgeAlpha;

  // Subtle dark border near the very edge
  if (edgeDist < 0.04) {
    r *= 0.8;
    g *= 0.8;
    b *= 0.8;
  }

  // ECG Heartbeat line coordinates normalized:
  // Baseline is at ny = 0.50
  const ecgPoints = [
    [0.18, 0.50],
    [0.34, 0.50],
    [0.40, 0.32], // peak up
    [0.47, 0.68], // valley down
    [0.54, 0.42], // rebound up
    [0.60, 0.50], // back to baseline
    [0.82, 0.50]
  ];

  // Check distance to ECG path
  let minD = 999;
  for (let i = 0; i < ecgPoints.length - 1; i++) {
    const d = distToSegment(
      nx, ny,
      ecgPoints[i][0], ecgPoints[i][1],
      ecgPoints[i + 1][0], ecgPoints[i + 1][1]
    );
    if (d < minD) minD = d;
  }

  // Stroke width ~ 0.05 normalized
  const strokeRadius = 0.038;
  if (minD < strokeRadius * 1.5) {
    const strokeAlpha = Math.min(1, Math.max(0, (strokeRadius * 1.5 - minD) / (strokeRadius * 0.7)));
    // Blend with crisp white ECG line (#FFFFFF)
    r = r * (1 - strokeAlpha) + 255 * strokeAlpha;
    g = g * (1 - strokeAlpha) + 255 * strokeAlpha;
    b = b * (1 - strokeAlpha) + 255 * strokeAlpha;
  }

  return [r, g, b, a];
}

console.log('Generating favicons...');

const png16 = createPng(16, 16, shieldPixel);
const png32 = createPng(32, 32, shieldPixel);
const png48 = createPng(48, 48, shieldPixel);
const png180 = createPng(180, 180, shieldPixel);

const icoBuffer = createIco([
  { width: 16, height: 16, pngBuffer: png16 },
  { width: 32, height: 32, pngBuffer: png32 },
  { width: 48, height: 48, pngBuffer: png48 }
]);

const publicDir = path.join(__dirname, '..', 'frontend', 'public');
const appDir = path.join(__dirname, '..', 'frontend', 'app');

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

console.log('Favicon.ico, favicon.png, and apple-touch-icon.png successfully generated!');
