import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const src =
  'C:/Users/jayse/.cursor/projects/d-Program-DEV-smp-studio/assets/c__Users_jayse_AppData_Roaming_Cursor_User_workspaceStorage_deef79d7391150ae3207c6f2f883bbfa_images_ChatGPT_Image_2026__7__11_____01_32_36-697df659-3ceb-4244-994a-7a0de6683d3d.png';
const out = 'd:/Program_DEV/smp-studio/public';

const meta = await sharp(src).metadata();
console.log('source', meta.width, meta.height);

await sharp(src).trim({ threshold: 12 }).png().toFile(path.join(out, 'logo.png'));
const logoMeta = await sharp(path.join(out, 'logo.png')).metadata();
console.log('logo trimmed', logoMeta.width, logoMeta.height);

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
let minx = w;
let miny = h;
let maxx = 0;
let maxy = 0;
let count = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 50) continue;
    if (r > 180 && g < 160 && b < 160 && r - g > 40 && r - b > 40) {
      count++;
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      if (x > maxx) maxx = x;
      if (y > maxy) maxy = y;
    }
  }
}

console.log('pink', count, minx, miny, maxx, maxy);
if (!count) {
  minx = Math.floor(w * 0.55);
  miny = Math.floor(h * 0.15);
  maxx = Math.floor(w * 0.85);
  maxy = Math.floor(h * 0.45);
}

// Pink-only bbox with modest padding (avoid neighboring letters)
const pad = Math.ceil(Math.max(maxx - minx, maxy - miny) * 0.2);
const side = Math.max(maxx - minx + 1 + pad * 2, maxy - miny + 1 + pad * 2);
const left = Math.max(0, Math.min(w - side, Math.floor((minx + maxx) / 2 - side / 2)));
const top = Math.max(0, Math.min(h - side, Math.floor((miny + maxy) / 2 - side / 2)));
const extractW = Math.min(side, w - left);
const extractH = Math.min(side, h - top);

const hashBuf = await sharp(src)
  .extract({ left, top, width: extractW, height: extractH })
  .png()
  .toBuffer();

console.log('hash crop', left, top, extractW, extractH);

async function makeSquare(size, file) {
  await sharp(hashBuf)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(path.join(out, file));
  console.log('saved', file);
}

await makeSquare(16, 'favicon-16.png');
await makeSquare(32, 'favicon-32.png');
await makeSquare(48, 'favicon-48.png');
await makeSquare(180, 'apple-touch-icon.png');
await makeSquare(192, 'icon-192.png');
await makeSquare(512, 'icon-512.png');
await makeSquare(128, 'logo-mark.png');

await sharp(path.join(out, 'favicon-32.png')).toFile(path.join(out, 'favicon.png'));
fs.copyFileSync(path.join(out, 'favicon-32.png'), path.join(out, 'favicon.ico'));

console.log('saved favicon.png / favicon.ico');
console.log('done');
