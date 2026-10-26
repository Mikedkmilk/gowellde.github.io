/**
 * 全站静态审计脚本：node scripts/audit.mjs
 * 检查 dist 全部 HTML：内链可达性、锚点目标、图片/资源存在、SEO 必备项、
 * hreflang 目标存在、JSON-LD 可解析、h1 唯一、垃圾字符串、target=_blank 的 rel、
 * 以及 sitemap 全部 URL 有效。
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const issues = [];
const add = (sev, cat, page, msg) => issues.push({ sev, cat, page, msg });

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

const allFiles = await walk(DIST);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const urlToFile = new Set(
  allFiles.map((f) => '/' + path.relative(DIST, f).replaceAll('\\', '/'))
);

/** URL → dist 中是否存在（区分静态文件与目录式路由） */
const FILE_EXT = /\.[a-z0-9]+$/i;
function urlExists(url) {
  if (url === '/' || url === '') return urlToFile.has('/index.html');
  let u = url.split('#')[0].split('?')[0];
  if (FILE_EXT.test(u) && !u.endsWith('.html')) return urlToFile.has(u);
  if (!u.endsWith('.html')) {
    if (u.endsWith('/')) u += 'index.html';
    else u += '/index.html';
  }
  if (urlToFile.has(u)) return true;
  // /foo.html 与 /foo 两种
  const alt = u.endsWith('/index.html') ? u.replace(/\/index\.html$/, '') + '.html' : u;
  return urlToFile.has(alt);
}

const garbage = [/\[object Object\]/, /\bundefined\b/, /\{\{/, /&amp;#39;undefined/];

for (const file of htmlFiles) {
  const page = '/' + path.relative(DIST, file).replaceAll('\\', '/');
  const rawHtml = await readFile(file, 'utf8');
  // 剥离 script 块，避免误捕模板字符串里的 href
  const html = rawHtml.replace(/<script[\s\S]*?<\/script>/g, '');

  // 1. 内链可达
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|wa\.me|data:|#)/.test(url) || url === '') continue;
    if (url.startsWith('//')) continue;
    const internal = url.startsWith('/') ? url : new URL(url, 'http://x' + page).pathname;
    if (!urlExists(internal)) {
      add('HIGH', 'broken-link', page, `内链 404: ${url}`);
    }
  }

  // 2. 锚点目标（同页与跨页）
  for (const m of html.matchAll(/href="([^"]*#[^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    const [rawPath, anchor] = href.split('#');
    if (!anchor) continue;
    let targetHtml = html;
    if (rawPath) {
      const t = rawPath.startsWith('/') ? rawPath : new URL(rawPath, 'http://x' + page).pathname;
      if (!urlExists(t)) continue; // 上面已报
      let u = t.endsWith('/') || !t.endsWith('.html') ? (t.endsWith('/') ? t + 'index.html' : t + '/index.html') : t;
      if (!urlToFile.has(u)) u = u.replace(/\/index\.html$/, '.html');
      const tf = path.join(DIST, u.slice(1));
      targetHtml = await readFile(tf, 'utf8');
    }
    if (!targetHtml.includes(`id="${anchor}"`)) {
      add('HIGH', 'anchor', page, `锚点不存在: ${href}`);
    }
  }

  // 3. SEO 必备
  if (!/<title>[^<]{5,}<\/title>/.test(html)) add('MED', 'seo', page, '缺少 title');
  if (!/name="description" content="[^"]{10,}"/.test(html)) add('MED', 'seo', page, '缺少 meta description');
  if (!/rel="canonical" href="https?:/.test(html)) add('MED', 'seo', page, '缺少 canonical');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) add('MED', 'seo', page, `h1 数量 = ${h1s}（应为 1）`);
  if (!/rel="icon"/.test(html)) add('LOW', 'seo', page, '缺少 favicon');

  // 4. lang / dir 与路径前缀一致
  const lang = html.match(/<html lang="([a-z]{2})"/)?.[1];
  const expect = page.match(/^\/(es|ru|vi|ar)\//)?.[1] ?? 'en';
  if (lang !== expect) add('HIGH', 'i18n', page, `lang="${lang}" 应为 "${expect}"`);
  if (lang === 'ar' && !/dir="rtl"/.test(html)) add('HIGH', 'i18n', page, '阿语页缺少 dir="rtl"');
  if (lang !== 'ar' && /dir="rtl"/.test(html)) add('MED', 'i18n', page, '非阿语页误设 dir="rtl"');

  // 5. hreflang 目标必须真实存在
  for (const m of html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)) {
    const [, l, href] = m;
    const u = href.replace(/^https?:\/\/[^/]+/, '');
    if (!urlExists(u)) add('HIGH', 'seo', page, `hreflang ${l} 指向不存在的页面: ${u}`);
  }

  // 6. JSON-LD 可解析
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      add('HIGH', 'structured-data', page, `JSON-LD 解析失败: ${e.message}`);
    }
  }

  // 7. 垃圾字符串
  for (const g of garbage) {
    if (g.test(html)) add('HIGH', 'content', page, `输出含异常字符串 ${g}`);
  }

  // 8. target=_blank 必须带 rel noopener
  for (const m of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) add('MED', 'security', page, `外链缺 rel=noopener: ${m[0].slice(0, 80)}`);
  }

  // 9. og:image 指向本地存在的资源
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (og && og.startsWith('http')) {
    const u = og.replace(/^https?:\/\/[^/]+/, '');
    if (!urlToFile.has(u)) add('MED', 'seo', page, `og:image 不存在: ${u}`);
  }
}

// 10. sitemap URL 全部有效
const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const u = m[1].replace(/^https?:\/\/[^/]+/, '') || '/';
  if (!urlExists(u)) add('MED', 'seo', 'sitemap', `sitemap 收录 404: ${u}`);
}
// sitemap 不应收录 noindex 页
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (m[1].includes('/compare')) add('LOW', 'seo', 'sitemap', `sitemap 收录 noindex 页: ${m[1]}`);
}

// 11. 资源体积审计
const KB = (n) => Math.round(n / 1024);
let totalAssets = 0;
const bigFiles = [];
for (const f of allFiles) {
  if (f.includes(path.join('_astro'))) continue;
  const s = (await stat(f)).size;
  totalAssets += s;
  if (/\.webp$/.test(f) && s > 250 * 1024) bigFiles.push(`${KB(s)}KB ${path.relative(DIST, f)}`);
}
for (const b of bigFiles) add('LOW', 'performance', 'assets', `图片超 250KB: ${b}`);

// 汇总
const bySev = { HIGH: 0, MED: 0, LOW: 0 };
for (const i of issues) bySev[i.sev]++;
console.log(`\n===== 审计完成：${htmlFiles.length} 个 HTML，问题 ${issues.length} 个（HIGH ${bySev.HIGH} / MED ${bySev.MED} / LOW ${bySev.LOW}）=====`);
for (const i of issues) console.log(`[${i.sev}][${i.cat}] ${i.page} :: ${i.msg}`);
// 非 _astro 静态资源总体积
console.log(`\n静态资源总体积（不含 _astro）: ${KB(totalAssets)}KB`);
