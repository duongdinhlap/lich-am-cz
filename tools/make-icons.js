// Tạo biểu tượng app (SVG + PNG). Chạy: node tools/make-icons.js
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, '..', 'icons');

function svg({ scale = 1, rounded = 0 } = {}) {
  const tf = scale === 1 ? '' : ` transform="translate(256 253) scale(${scale}) translate(-256 -253)"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#CF3A2E"/><stop offset=".5" stop-color="#A11D1D"/><stop offset="1" stop-color="#6B0F0F"/>
  </linearGradient>
  <radialGradient id="glow" cx=".28" cy=".18" r=".85">
    <stop offset="0" stop-color="#FFE9C2" stop-opacity=".28"/><stop offset=".6" stop-color="#FFE9C2" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FBE7A1"/><stop offset=".45" stop-color="#E6BE55"/><stop offset="1" stop-color="#B98A26"/>
  </linearGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#9C7020"/><stop offset=".45" stop-color="#FCEBB0"/><stop offset="1" stop-color="#A97B22"/>
  </linearGradient>
  <linearGradient id="page" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#F5E8CC"/>
  </linearGradient>
  <linearGradient id="box" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#D23A2F"/><stop offset="1" stop-color="#8E1414"/>
  </linearGradient>
  <clipPath id="body"><rect x="116" y="136" width="280" height="264" rx="36"/></clipPath>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="150%">
    <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#3A0505" flood-opacity=".45"/>
  </filter>
</defs>
<rect width="512" height="512" rx="${rounded}" fill="url(#bg)"/>
<rect width="512" height="512" rx="${rounded}" fill="url(#glow)"/>
<g${tf}>
  <rect x="116" y="136" width="280" height="264" rx="36" fill="url(#page)" filter="url(#sh)"/>
  <g clip-path="url(#body)">
    <rect x="116" y="136" width="280" height="74" fill="url(#gold)"/>
    <rect x="116" y="208" width="280" height="4" fill="#8A5F14" opacity=".35"/>
  </g>
  <circle cx="186" cy="170" r="12" fill="#6E4A0E" opacity=".55"/>
  <circle cx="326" cy="170" r="12" fill="#6E4A0E" opacity=".55"/>
  <rect x="173" y="98" width="26" height="80" rx="13" fill="url(#ring)" stroke="#7E5812" stroke-width="3"/>
  <rect x="313" y="98" width="26" height="80" rx="13" fill="url(#ring)" stroke="#7E5812" stroke-width="3"/>
  <rect x="176" y="232" width="160" height="148" rx="24" fill="url(#box)"/>
  <rect x="176" y="232" width="160" height="148" rx="24" fill="none" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="2"/>
  <path d="M258 254 H284 V336 H306 V360 H206 V336 H232 V290 L208 302 L200 279 Z" fill="#FFF6E2"/>
</g>
</svg>`;
}

fs.writeFileSync(path.join(out, 'icon.svg'), svg({ scale: 1.12 }));
fs.writeFileSync(path.join(out, 'icon-maskable.svg'), svg({ scale: 1 }));
fs.writeFileSync(path.join(out, 'favicon.svg'), svg({ scale: 1.22, rounded: 110 }));

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [
    ['icon.svg', 'apple-touch-icon.png', 180],
    ['icon.svg', 'icon-192.png', 192],
    ['icon.svg', 'icon-512.png', 512],
    ['icon-maskable.svg', 'icon-maskable-192.png', 192],
    ['icon-maskable.svg', 'icon-maskable-512.png', 512],
    ['favicon.svg', 'favicon-32.png', 32],
  ];
  for (const [src, dst, size] of jobs) {
    const data = fs.readFileSync(path.join(out, src)).toString('base64');
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${data}" width="${size}" height="${size}" style="display:block"></body></html>`);
    await page.waitForTimeout(50);
    await page.screenshot({ path: path.join(out, dst), omitBackground: true });
  }
  await browser.close();
  console.log('Đã tạo biểu tượng trong', out);
})();
