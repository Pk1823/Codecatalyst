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

  const deflated = zlib.deflateSync(raw, { level: 9 });

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

// Distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

/**
 * Renders the MissionWell Sentinel Shield & ECG pulse
 * within a normalized sub-coordinate space [u, v] where:
 * u in [-0.5, 0.5], v in [-0.5, 0.5]
 */
function renderSentinelLogo(u, v, isAdaptive) {
  // Normalize into standard shield shape
  // y ranges from top (-0.46) to bottom (0.46)
  const ny = v + 0.5; // 0 to 1
  const nx = u + 0.5; // 0 to 1
  const absU = Math.abs(u);

  // Background color: Deep space tactical slate #090D16
  const bgR = 9, bgG = 13, bgB = 22;

  // Outer Shield geometry
  // Top: curved shoulder from ny=0.08 to ny=0.52
  // Bottom: tapers smoothly to shield tip at ny=0.92
  let maxHalfW = -1;
  if (ny >= 0.05 && ny < 0.12) {
    const dy = 0.12 - ny;
    maxHalfW = 0.38 - (dy * dy * 8);
  } else if (ny >= 0.12 && ny <= 0.50) {
    maxHalfW = 0.38;
  } else if (ny > 0.50 && ny <= 0.94) {
    const t = (ny - 0.50) / (0.94 - 0.50);
    maxHalfW = 0.38 * (1 - Math.pow(t, 1.35));
  }

  const insideShield = (maxHalfW > 0 && absU <= maxHalfW);

  // Default color outside shield
  let r = bgR, g = bgG, b = bgB, a = isAdaptive ? 0 : 255;

  if (insideShield) {
    const edgeDist = maxHalfW - absU;
    const aaShield = Math.min(1, Math.max(0, edgeDist * 45));

    // Shield gradient: Cyber Emerald to Deep Teal (#047857 -> #0f766e -> #0284c7)
    const tY = Math.min(1, Math.max(0, ny));
    let sR = 4 + (16 - 4) * tY;
    let sG = 120 + (185 - 120) * tY;
    let sB = 87 + (129 - 87) * tY;

    // Outer shield dark border
    if (edgeDist < 0.035) {
      sR = 6;
      sG = 78;
      sB = 59;
    }

    // Shield Inner Core Fill
    r = sR;
    g = sG;
    b = sB;
    a = Math.round(255 * aaShield);

    // Tricolor crest stripe at top of shield (ny between 0.07 and 0.11)
    if (ny >= 0.07 && ny <= 0.11 && absU <= 0.22) {
      const tTri = (u + 0.22) / 0.44; // 0 to 1 across notch
      let triR = 255, triG = 153, triB = 51; // Saffron #FF9933
      if (tTri > 0.33 && tTri <= 0.66) {
        triR = 255; triG = 255; triB = 255; // White
      } else if (tTri > 0.66) {
        triR = 19; triG = 136; triB = 8; // India Green #138808
      }
      r = triR;
      g = triG;
      b = triB;
    }

    // Horizontal Blade lines inside shield (military server stack)
    // Blade 1: ny ~ 0.28
    // Blade 2: ny ~ 0.40
    // Blade 3: ny ~ 0.52
    const blades = [0.28, 0.40, 0.52];
    for (const bY of blades) {
      if (Math.abs(ny - bY) < 0.016 && absU < 0.26) {
        // Subtle dark slate blade slit
        r = 15;
        g = 23;
        b = 42;
      }
    }

    // ECG Heartbeat path (normalized coordinates in shield)
    // Baseline is at ny = 0.56
    const ecgPoints = [
      [-0.34, 0.56],
      [-0.18, 0.56],
      [-0.10, 0.36], // peak up
      [-0.01, 0.74], // deep valley down
      [0.08, 0.44],  // rebound up
      [0.15, 0.56],  // back to baseline
      [0.34, 0.56],
    ];

    let minD = 999;
    for (let i = 0; i < ecgPoints.length - 1; i++) {
      const d = distToSegment(u, ny, ecgPoints[i][0], ecgPoints[i][1], ecgPoints[i + 1][0], ecgPoints[i + 1][1]);
      if (d < minD) minD = d;
    }

    const strokeRadius = 0.032;
    if (minD < strokeRadius * 1.5) {
      const pulseAlpha = Math.min(1, Math.max(0, (strokeRadius * 1.5 - minD) / (strokeRadius * 0.6)));
      // Crisp glowing white ECG line
      r = r * (1 - pulseAlpha) + 255 * pulseAlpha;
      g = g * (1 - pulseAlpha) + 255 * pulseAlpha;
      b = b * (1 - pulseAlpha) + 255 * pulseAlpha;
    }

    // Tactical defense node dot near bottom tip (ny = 0.80, u = 0)
    const dotDist = Math.hypot(u, ny - 0.80);
    if (dotDist < 0.04) {
      const dotAlpha = Math.min(1, Math.max(0, (0.04 - dotDist) / 0.015));
      r = r * (1 - dotAlpha) + 255 * dotAlpha;
      g = g * (1 - dotAlpha) + 255 * dotAlpha;
      b = b * (1 - dotAlpha) + 255 * dotAlpha;
    }
  }

  return [r, g, b, a];
}

console.log('Generating high-definition MissionWell AI mobile assets...');

// 1. App Master Icon (1024x1024)
// Standard full icon with #090D16 dark tactical background
// The shield occupies 74% of the icon canvas
const iconPng = createPng(1024, 1024, (x, y, w, h) => {
  const u = (x - w / 2) / (w * 0.74);
  const v = (y - h / 2) / (h * 0.74);
  const [r, g, b, a] = renderSentinelLogo(u, v, false);
  return [r, g, b, 255];
});

// 2. Android Adaptive Icon (1024x1024)
// ANDROID ADAPTIVE ICON SAFE ZONE:
// Android masks icons with circle/squircle cutting away 34% of canvas!
// The safe inner zone is diameter 66% (radius 0.33 of canvas).
// Here we scale the shield so it occupies 54% of the canvas.
// This guarantees that the entire shield and ECG waveform remain 100% inside
// the circular/squircle mask without any cutoff on any Android manufacturer skin!
const adaptiveIconPng = createPng(1024, 1024, (x, y, w, h) => {
  // Background matches tactical #090D16
  const u = (x - w / 2) / (w * 0.54);
  const v = (y - h / 2) / (h * 0.54);
  const [r, g, b, a] = renderSentinelLogo(u, v, true);
  if (a > 0) {
    // Shield area blended with dark tactical bg
    const alpha = a / 255;
    return [
      Math.round(9 * (1 - alpha) + r * alpha),
      Math.round(13 * (1 - alpha) + g * alpha),
      Math.round(22 * (1 - alpha) + b * alpha),
      255
    ];
  }
  return [9, 13, 22, 255];
});

// 3. Splash Screen (1024x1024)
// Features the centered Sentinel Emblem with subtle ambient glow and clean dark background
const splashPng = createPng(1024, 1024, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h * 0.44; // emblem slightly above vertical center
  const u = (x - cx) / (w * 0.36);
  const v = (y - cy) / (h * 0.36);

  // Radial glow around emblem
  const distFromCenter = Math.hypot(x - cx, y - cy);
  const glow = Math.max(0, 1 - distFromCenter / (w * 0.45));
  let bgR = 9 + Math.round(glow * 15);
  let bgG = 13 + Math.round(glow * 45);
  let bgB = 22 + Math.round(glow * 35);

  const [r, g, b, a] = renderSentinelLogo(u, v, true);
  if (a > 0) {
    const alpha = a / 255;
    return [
      Math.round(bgR * (1 - alpha) + r * alpha),
      Math.round(bgG * (1 - alpha) + g * alpha),
      Math.round(bgB * (1 - alpha) + b * alpha),
      255
    ];
  }
  return [bgR, bgG, bgB, 255];
});

// 4. Transparent Logo Asset (512x512)
// For use in Header and Branding containers with resizeMode: "contain"
const logoPng = createPng(512, 512, (x, y, w, h) => {
  const u = (x - w / 2) / (w * 0.80);
  const v = (y - h / 2) / (h * 0.80);
  return renderSentinelLogo(u, v, true);
});

const mobileAssetsDir = path.join(__dirname, '..', 'mobile', 'assets');
if (!fs.existsSync(mobileAssetsDir)) {
  fs.mkdirSync(mobileAssetsDir, { recursive: true });
}

fs.writeFileSync(path.join(mobileAssetsDir, 'icon.png'), iconPng);
console.log('✓ mobile/assets/icon.png created (1024x1024 master icon)');

fs.writeFileSync(path.join(mobileAssetsDir, 'adaptive-icon.png'), adaptiveIconPng);
console.log('✓ mobile/assets/adaptive-icon.png created (1024x1024 Android 66% safe-zone adaptive icon)');

fs.writeFileSync(path.join(mobileAssetsDir, 'splash.png'), splashPng);
console.log('✓ mobile/assets/splash.png created (1024x1024 responsive contain splash screen)');

fs.writeFileSync(path.join(mobileAssetsDir, 'logo.png'), logoPng);
console.log('✓ mobile/assets/logo.png created (512x512 transparent logo)');

console.log('All MissionWell AI branding assets successfully generated!');
