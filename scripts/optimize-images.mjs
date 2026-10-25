/**
 * 图片整理脚本（一次性/按需运行）：npm run optimize:images
 * 1. 产品图：从本地素材文件夹复制 → 压缩为 WebP → public/assets/products/{slug}/main.webp
 * 2. 规格信息图（Info jpg）→ public/assets/datasheets/{slug}.webp
 * 3. 博客配图：从原站外链下载 → WebP
 * 4. Logo / favicon / 品类横幅 / 占位图
 * 以后新增产品图片，直接丢图片到对应目录后重跑本脚本即可。
 */
import sharp from 'sharp';
import { mkdir, copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = (p) => path.join(ROOT, 'public', p);
const SRC = (p) => path.resolve('G:/welding/GOWELLDE', p);

const products = [
  { slug: 'arc-315e', file: '产品信息配件/产品图片/ARC-315E.png' },
  { slug: 'arc-315a', file: '产品信息配件/产品图片/ARC-315A.png' },
  { slug: 'arc-400b', file: '产品信息配件/产品图片/ARC-400B.png' },
  { slug: 'arc-400a', file: '产品信息配件/产品图片/ARC-400A.png' },
  { slug: 'arc-400', file: '产品信息配件/产品图片/ARC-400.png' },
  { slug: 'arc-500b', file: '产品信息配件/产品图片/ARC-500B.png' },
  { slug: 'arc-500', file: '产品信息配件/产品图片/ARC-500.png' },
  { slug: 'arc-630', file: '产品信息配件/产品图片/ARC-630.png' },
  { slug: 'mig-mma-315y', file: '产品信息配件/产品图片/MIG MMA-315y.png' },
  { slug: 'mig-mma-400ci', file: '产品信息配件/产品图片/MIG MMA-400CI.png' },
  { slug: 'mig-mma-400', file: '产品信息配件/产品图片/MIG MMA-400.png' },
  { slug: 'mig-mma-500', file: '产品信息配件/产品图片/MIG MMA-500.png' },
  { slug: 'mig-mma-500ci', file: '产品信息配件/产品图片/MIG MMA-500CI.png' },
  { slug: 'mig-mma-630b', file: '产品信息配件/产品图片/MIG MMA-630B.png' },
  { slug: 'mig-mma-630', file: '产品信息配件/产品图片/MIG MMA-630.png' },
];

const datasheets = [
  { slug: 'arc-315e', file: '产品信息配件/产品图片/pdf/ARC-315E Welding Equipment Info.jpg' },
  { slug: 'arc-315a', file: '产品信息配件/产品图片/pdf/ARC-315A Welding Equipment Info.jpg' },
  { slug: 'arc-400', file: '产品信息配件/产品图片/pdf/ARC-400 Welding Equipment Info.jpg' },
  { slug: 'arc-400a', file: '产品信息配件/产品图片/pdf/ARC-400A Welding Equipment Info.jpg' },
  { slug: 'arc-400b', file: '产品信息配件/产品图片/pdf/ARC-400B Welding Equipment Info.jpg' },
  { slug: 'arc-500', file: '产品信息配件/产品图片/pdf/ARC-500 Welding Equipment Info.jpg' },
  { slug: 'arc-630', file: '产品信息配件/产品图片/pdf/ARC-630 Welding Equipment Info.jpg' },
  { slug: 'mig-mma-400', file: '产品信息配件/产品图片/pdf/MIG-400 Welding Equipment Info.jpg' },
  { slug: 'mig-mma-500', file: '产品信息配件/产品图片/pdf/MIG-500 Welding Equipment Info.jpg' },
  { slug: 'mig-mma-630', file: '产品信息配件/产品图片/pdf/MIG-630 Welding Equipment Info.jpg' },
];

const blogImages = [
  { name: 'choose-inverter', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1200&auto=format&fit=crop' },
  { name: 'igbt-benefits', url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'mig-vs-tig-vs-stick', url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop' },
  { name: 'maintenance-tips', url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1200&auto=format&fit=crop' },
  { name: 'import-guide', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop' },
  { name: 'aluminum-welding', url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop' },
  { name: 'welding-defects', url: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'safety-gear', url: 'https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?q=80&w=1200&auto=format&fit=crop' },
  { name: 'upgrade-welder', url: 'https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

async function toWebP(src, dest, { width = 1000, quality = 82 } = {}) {
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(dest);
  const kb = Math.round((await sharp(dest).metadata().size || 0) / 1024);
  console.log(`✓ ${path.relative(PUB('.'), dest)} (${kb}KB)`);
}

async function main() {
  // 1. 产品图
  for (const p of products) {
    const src = SRC(p.file);
    if (await exists(src)) {
      await toWebP(src, PUB(`assets/products/${p.slug}/main.webp`), { width: 1000 });
    } else {
      console.warn(`✗ 缺少产品图: ${p.file}`);
    }
  }

  // 2. 规格信息图
  for (const d of datasheets) {
    const src = SRC(d.file);
    if (await exists(src)) {
      await toWebP(src, PUB(`assets/datasheets/${d.slug}.webp`), { width: 1400, quality: 85 });
    } else {
      console.warn(`✗ 缺少信息图: ${d.file}`);
    }
  }

  // 3. 博客配图（下载，失败则跳过——模板会显示无图卡片样式）
  for (const b of blogImages) {
    const dest = PUB(`assets/blog/${b.name}.webp`);
    if (await exists(dest)) { console.log(`= 已存在 ${b.name}.webp`); continue; }
    try {
      const res = await fetch(b.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await toWebP(buf, dest, { width: 1200 });
    } catch (e) {
      console.warn(`✗ 博客配图下载失败 ${b.name}: ${e.message}`);
    }
  }

  // 4. Logo / favicon / 品类横幅
  const logoSrc = SRC('Image logo 4mb.png');
  if (await exists(logoSrc)) {
    await toWebP(logoSrc, PUB('assets/brand/logo.webp'), { width: 400, quality: 90 });
  }
  const faviconSrc = SRC('favicon.png');
  if (await exists(faviconSrc)) {
    await copyFile(faviconSrc, PUB('favicon.png'));
    await toWebP(faviconSrc, PUB('assets/brand/favicon-32.webp'), { width: 32 });
  }
  const banners = [
    { dest: 'assets/categories/welding-hero.webp', src: products.find((p) => p.slug === 'arc-630').file },
    { dest: 'assets/categories/mma-hero.webp', src: products.find((p) => p.slug === 'arc-500').file },
    { dest: 'assets/categories/mig-hero.webp', src: products.find((p) => p.slug === 'mig-mma-630').file },
  ];
  for (const b of banners) {
    const src = SRC(b.src);
    if (await exists(src)) await toWebP(src, PUB(b.dest), { width: 1200 });
  }

  // 5. 无图产品占位图（ARC-630B）
  const placeholderSvg = `<svg width="1000" height="750" xmlns="http://www.w3.org/2000/svg">
    <rect width="1000" height="750" fill="#F8F9FA"/>
    <rect x="1" y="1" width="998" height="748" fill="none" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="12 8"/>
    <text x="500" y="360" font-family="Arial" font-size="56" font-weight="900" fill="#1A1A1A" text-anchor="middle">ARC-630B</text>
    <text x="500" y="420" font-family="Arial" font-size="28" fill="#6B7280" text-anchor="middle">Photo available on request</text>
  </svg>`;
  await toWebP(Buffer.from(placeholderSvg), PUB('assets/products/_placeholder/main.webp'), { width: 1000 });

  // 6. 品牌实拍图（产品阵容 + 机器内部构造）
  const factoryShots = [
    { dest: 'assets/factory/lineup.webp', src: 'photo/微信图片_20251211110937_34_142.jpg' },
    { dest: 'assets/factory/lineup-white.webp', src: 'photo/微信图片_20251212144732_51_142.jpg' },
    { dest: 'assets/factory/inside.webp', src: 'photo/微信图片_20251202141850_7_23.jpg' },
  ];
  for (const f of factoryShots) {
    const src = SRC(f.src);
    if (await exists(src)) await toWebP(src, PUB(f.dest), { width: 1200 });
  }

  // 7. 首页 Hero 静态背景 + Why Choose 配图（旧版网页使用的 Unsplash 工业图，远程下载 → 本地 WebP）
  const remoteShots = [
    {
      dest: 'assets/hero/hero-bg.webp',
      url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1920&auto=format&fit=crop',
      width: 1600, height: 900, quality: 78,
    },
    {
      dest: 'assets/factory/why-choose.webp',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1400&auto=format&fit=crop',
      width: 1200, height: 900, quality: 80,
    },
  ];
  for (const shot of remoteShots) {
    const dest = PUB(shot.dest);
    if (await exists(dest)) { console.log(`= 已存在 ${shot.dest}`); continue; }
    try {
      const res = await fetch(shot.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(dest), { recursive: true });
      await sharp(buf).resize(shot.width, shot.height, { fit: 'cover' }).webp({ quality: shot.quality }).toFile(dest);
      console.log(`✓ ${shot.dest} (${shot.width}x${shot.height})`);
    } catch (e) {
      console.warn(`✗ 远程图下载失败 ${shot.dest}: ${e.message}`);
    }
  }

  console.log('\n全部完成。');
}

main().catch((e) => { console.error(e); process.exit(1); });
