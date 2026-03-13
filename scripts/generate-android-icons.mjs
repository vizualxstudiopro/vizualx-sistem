import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const svgPath = path.join(root, 'scripts', 'vizualx-app-icon.svg');
const svgBuffer = await fs.readFile(svgPath);

const mipmapSizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const foregroundSizes = {
  mdpi: 108,
  hdpi: 162,
  xhdpi: 216,
  xxhdpi: 324,
  xxxhdpi: 432,
};

for (const [density, size] of Object.entries(mipmapSizes)) {
  const dir = path.join(root, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
  await sharp(svgBuffer).resize(size, size, { fit: 'cover' }).png().toFile(path.join(dir, 'ic_launcher.png'));
  await sharp(svgBuffer).resize(size, size, { fit: 'cover' }).png().toFile(path.join(dir, 'ic_launcher_round.png'));
}

for (const [density, size] of Object.entries(foregroundSizes)) {
  const dir = path.join(root, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
  await sharp(svgBuffer).resize(size, size, { fit: 'cover' }).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
}

console.log('Android launcher icons generated from scripts/vizualx-app-icon.svg');
