/**
 * Gera assets estáticos commitados em public/ (OG image + favicons PNG)
 * a partir de SVG, usando o sharp já presente no projeto.
 * Rodar quando a identidade mudar: `node scripts/generate-assets.mjs`
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/', import.meta.url);

// ---------- favicons a partir do favicon.svg ----------
const faviconSvg = readFileSync(new URL('../public/favicon.svg', import.meta.url));
const sizes = [
  ['favicon-96.png', 96],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
for (const [name, size] of sizes) {
  const buf = await sharp(faviconSvg, { density: 300 }).resize(size, size).png().toBuffer();
  writeFileSync(new URL(name, OUT), buf);
  console.log(`ok ${name} (${size}x${size})`);
}

// ---------- OG image 1200x630 ----------
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#30d158" stop-opacity="0.14"/>
      <stop offset="60%" stop-color="#30d158" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#f2f0ed" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0e0d0c"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="80" y="96" width="26" height="4" rx="2" fill="#30d158"/>
  <text x="122" y="106" font-family="Consolas, monospace" font-size="24" letter-spacing="4" fill="#aaa49c">SOC ANALYST @ CLAVIS</text>
  <text x="76" y="270" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="104" letter-spacing="-3" fill="#f2f0ed">Pablo de Souza</text>
  <text x="76" y="380" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="104" letter-spacing="-3" fill="#30d158">Galerani</text>
  <text x="80" y="460" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#aaa49c">Offensive Security · AppSec · SIEM · 24+ certificações</text>
  <text x="80" y="552" font-family="Consolas, monospace" font-size="26" fill="#736d64">❯ pablodlz.github.io/portfolio<tspan fill="#30d158">_</tspan></text>
</svg>`;
const ogBuf = await sharp(Buffer.from(og), { density: 150 }).png().toBuffer();
writeFileSync(new URL('og.png', OUT), ogBuf);
console.log(`ok og.png (1200x630, ${(ogBuf.length / 1024).toFixed(0)}KB)`);
