import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'logo.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

// Maskable icon needs 20% safe zone padding (icon fills ~60% of canvas)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
  <rect width="640" height="640" fill="#080202"/>
  <image href="data:image/svg+xml;base64,${Buffer.from(readFileSync(svgPath)).toString('base64')}" x="64" y="64" width="512" height="512"/>
</svg>`;

async function generate() {
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Maskable icon (512x512 with padding)
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'icon-512-maskable.png'));
  console.log('Generated icon-512-maskable.png (512x512 with safe zone)');
}

generate().catch(console.error);
