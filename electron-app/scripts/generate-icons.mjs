/**
 * Gjeneron ikonat e Electron app-it nga SVG-ja e VizualX.
 * Kërkon: sharp  (`npm install` brenda electron-app/)
 * Ekzekuto:  node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir  = join(__dirname, '..', 'build');
const svgPath   = join(buildDir, 'icon.svg');

mkdirSync(buildDir, { recursive: true });

if (!existsSync(svgPath)) {
  console.error('❌  build/icon.svg nuk u gjet. Vendose icon.svg te build/ dhe provo perseri.');
  process.exit(1);
}

const svg = readFileSync(svgPath);

console.log('Generating icons from build/icon.svg …\n');

// ── PNG sizes ────────────────────────────────────────────────────────────────
const pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
for (const s of pngSizes) {
  const out = join(buildDir, `icon-${s}.png`);
  await sharp(svg).resize(s, s).png().toFile(out);
  console.log(`  ✓ ${s}x${s}  →  icon-${s}.png`);
}

// Main icon.png (256) — used by Linux + electron-builder
await sharp(svg).resize(256, 256).png().toFile(join(buildDir, 'icon.png'));
console.log('  ✓ icon.png (256×256)');

// Tray icon  (22×22 on Windows,  18×18 on macOS — provide 22)
await sharp(svg).resize(22, 22).png().toFile(join(buildDir, 'tray.png'));
console.log('  ✓ tray.png (22×22)');

// ── ICO (Windows) ───────────────────────────────────────────────────────────
// Build a multi-resolution .ico from 16/32/48/64/128/256 PNGs
// Spec: ICO header + ICONDIRENTRY per image + raw PNG data for Vista+ ICO
const icoPngSizes = [16, 32, 48, 64, 128, 256];
const pngBuffers = await Promise.all(
  icoPngSizes.map(s => sharp(svg).resize(s, s).png().toBuffer())
);

const ico = buildIco(icoPngSizes, pngBuffers);
writeFileSync(join(buildDir, 'icon.ico'), ico);
console.log('  ✓ icon.ico (16/32/48/64/128/256)');

// Copy the 22px PNG as tray.ico too (for windows tray fallback)
await sharp(svg).resize(22, 22).png().toFile(join(buildDir, 'tray.ico'));
console.log('  ✓ tray.ico (22×22)');

// ── Installer sidebar BMP (164×314, Windows NSIS) ───────────────────────────
{
  // Create a dark sidebar (164×314) with the logo centered
  const logoSize = 80;
  const logoBuffer = await sharp(svg).resize(logoSize, logoSize).png().toBuffer();

  // Composite logo on dark background
  const sidebar = await sharp({
    create: {
      width: 164,
      height: 314,
      channels: 3,
      background: { r: 15, g: 17, b: 21 },
    },
  })
    .composite([{ input: logoBuffer, gravity: 'north', top: 60, left: Math.floor((164 - logoSize) / 2) }])
    .flatten({ background: { r: 15, g: 17, b: 21 } })
    .toBuffer();

  writeFileSync(join(buildDir, 'installer-sidebar.bmp'), sidebar);
  console.log('  ✓ installer-sidebar.bmp (164×314  NSIS sidebar)');
}

console.log('\n✅  Të gjitha ikonat u gjeneruan te build/');
console.log('   Tani mund të ekzekutosh: npm run build\n');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a Windows .ico file containing multiple PNG images.
 * Modern ICO format stores raw PNG bytes for sizes ≥ 256 and can also
 * store raw PNG for smaller sizes (Vista+).
 */
function buildIco(sizes, buffers) {
  const count = sizes.length;
  // ICONDIR: 6 bytes
  // ICONDIRENTRY: 16 bytes × count
  const headerSize = 6 + 16 * count;
  const dataOffset = headerSize;

  // Calculate total offsets
  const offsets = [];
  let offset = dataOffset;
  for (const buf of buffers) {
    offsets.push(offset);
    offset += buf.length;
  }

  const total = offset;
  const out = Buffer.alloc(total);

  // ICONDIR header
  out.writeUInt16LE(0, 0);       // reserved
  out.writeUInt16LE(1, 2);       // type: 1 = ICO
  out.writeUInt16LE(count, 4);   // image count

  // ICONDIRENTRY for each image
  for (let i = 0; i < count; i++) {
    const s   = sizes[i];
    const buf = buffers[i];
    const e   = 6 + i * 16;

    out.writeUInt8 (s >= 256 ? 0 : s,  e + 0);  // width  (0 = 256)
    out.writeUInt8 (s >= 256 ? 0 : s,  e + 1);  // height (0 = 256)
    out.writeUInt8 (0,                  e + 2);  // color count (0 = >8bpp)
    out.writeUInt8 (0,                  e + 3);  // reserved
    out.writeUInt16LE(1,                e + 4);  // color planes
    out.writeUInt16LE(32,               e + 6);  // bits per pixel
    out.writeUInt32LE(buf.length,       e + 8);  // image data size
    out.writeUInt32LE(offsets[i],       e + 12); // offset
  }

  // Copy PNG data
  for (let i = 0; i < count; i++) {
    buffers[i].copy(out, offsets[i]);
  }

  return out;
}
