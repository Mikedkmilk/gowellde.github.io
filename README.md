# GOWELLDE 外贸独立站（Astro 版）

多页静态站点：产品详情页、品类页、博客、询盘表单全部独立 URL，构建后发布到 GitHub Pages。
配套方案见《[改版方案-站点梳理与升级.md](../改版方案-站点梳理与升级.md)》。

## 快速开始

```bash
npm install        # 首次
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

## 目录导读（只需要关心这几个地方）

| 想改什么 | 去哪里 |
|---|---|
| 联系方式 / 邮箱 / WhatsApp / 表单密钥 / GA4 | `src/config.ts`（全站唯一配置） |
| 新增/修改产品 | `src/content/products/` 一款一个 json，文件名 = URL（`arc-400.json` → `/products/arc-400/`） |
| 新增品类 | `src/content/categories/` 一个 json，含 specSchema（参数表定义） |
| 发博客 | `src/content/blog/` 一篇一个 md |
| 产品/博客图片 | `public/assets/` 对应子目录，重跑 `npm run optimize:images` |
| 页面模板 | `src/pages/_views/`（视图）+ `src/pages/`（路由包装）+ `src/components/`（复用组件） |
| 界面文字翻译（按钮/导航/表单等） | `src/i18n/ui.ts`（en/es/ru 三语词典，缺 key 自动回落英文） |
| 产品/品类的西语俄语内容 | 各 content JSON 的 `i18n.es` / `i18n.ru` 字段 |

## 多语言（/es/ /ru/ /vi/ /ar/）

- 英语在根路径，西语 `/es/`、俄语 `/ru/`、越南语 `/vi/`、阿拉伯语 `/ar/` 镜像整站（首页/产品/品类/详情/关于/联系/FAQ/对比），共 163 页。
- **阿语整站 RTL**：`<html dir="rtl">` 自动生效，参数表/对比表用逻辑对齐（text-start），阿语页面用 Tajawal 字体（Roboto 不含阿文字形）。新增 RTL 语言照此模式即可。
- 界面文字在 `src/i18n/ui.ts`（五语词典，缺 key 自动回落英文）；内容翻译在各 JSON 的 `i18n` 字段（无翻译时自动显示英文）。
- 页面结构：一套视图 `src/pages/_views/*.astro`，五套路由包装（`src/pages/`、`es/`、`ru/`、`vi/`、`ar/`）——**新增语言 = 复制一套包装目录 + ui.ts 加词典 + locales 加一项 + 内容 JSON 加 i18n 字段**（hreflang 会自动包含新语言）。
- 博客暂仅英文；`/compare/` 标记 noindex。
- 批量注入翻译脚本：`node scripts/inject-i18n.mjs`（es/ru）、`node scripts/inject-i18n-vi-ar.mjs`（vi/ar）——一次性，后续手改 JSON 即可。

## 品类筛选与对比页

- 品类页筛选器由品类 JSON 的 `specSchema.filterable` 驱动：参数在 ≥2 款产品上取值不同就自动出现筛选 chips（单选、可清除、显示"Showing X of Y"）。数据结构零改动。
- 对比页 `/compare/?category=mma-welders`：切品类 → 勾选最多 3 款 → 参数并排对比（对比范围限同一品类，因为各品类 specSchema 不同）。

## 演示品类：空气压缩机（Air Compressors）

第二品类已虚拟上线：4 款 `coming-soon` 机型（AC-2500/3500/5500/7500），无图无价，用于验证多品类架构与对比页。**正式上线前替换为真实产品数据与图片，或整品类下线**（删除 `src/content/categories/air-compressors.json` + 对应 4 个产品 json）。

## 部署（GitHub Pages，自动构建）

1. 在 GitHub 新建（或复用）仓库，把本项目内容推到 `main` 分支。
   如沿用旧仓库 `gowellde.github.io`：删掉旧 index.html 后整体替换成本项目内容即可（CNAME 已在 `public/CNAME`）。
2. 仓库 **Settings → Pages → Source 选 "GitHub Actions"**（只需设置一次）。
3. 之后每次 `git push`，Actions 自动构建发布，无需本地 build。

换正式域名时改三处：`astro.config.mjs` 的 `site`、`public/CNAME`、`public/robots.txt`，以及 DNS 解析。

## 上线前必办（★ 优先级从高到低）

1. **Web3Forms 密钥**（免费，5 分钟）：https://web3forms.com 用邮箱注册 → 复制 access key → 填到 `src/config.ts` 的 `FORM.web3formsKey`。没填时表单只能降级为"拉起邮件客户端"。
2. **GA4 统计**（免费）：https://analytics.google.com 建媒体资源 → 拿 G- 开头 ID → 填 `ANALYTICS.ga4Id`。上线后在 GA4 实时报告确认有数据。
3. **换正式域名**：如 gowellde.com（约 ¥70/年）。812818.xyz 对 B2B 信任不利。老域名做 301。
4. **换企业邮箱**：Zoho Mail 免费版绑域名，替换 `config.ts` 里的 Gmail。
5. **补真实素材**（放 `public/assets/` 后提交）：
   - 车间/产线实拍照（现在用的是产品图和内部构造图，已在 About/首页使用，不算造假，但有真车间图更好）
   - CE/ISO9001/CCC 证书扫描件（编号打码）→ 放 `public/assets/certs/` 后可替换 About 页的圆形徽章
   - ARC-630B 产品图（现在用占位图）→ 放 `public/assets/products/arc-630b/main.webp`
6. **Search Console**：添加新域名资源 → 提交 `https://你的域名/sitemap-index.xml`。
7. **目录 PDF**：目前外链 GitHub 上的 GOWELLDE.pdf（20MB），建议压缩后放 `public/assets/pdf/`，改 `config.ts` 的 `catalogUrl`。
8. **MIG/MMA-500 数据核对**：该型号参数来自旧站而非产品 Excel，请与 Excel 核对（JSON 里有备注）。

## 日常维护 SOP

### 新增一款产品（约 10 分钟）

1. 复制 `src/content/products/` 里任一 json，重命名为型号短名（小写、连字符，如 `arc-715gs.json`）；
2. 改内容：型号、参数（key 对齐品类 specSchema，缺的自动不显示）、价格只填掩码（"$2XX"，**真实价格绝不进仓库，仓库是公开的**）；
3. 图片放 `public/assets/products/arc-715gs/main.webp`（跑 `npm run optimize:images` 或用在线工具压成 WebP ≤150KB）；
4. `npm run dev` 本地确认 → 提交推送，自动上线。

### 新增一个品类（如空压机，约 1 小时）

1. 复制 `src/content/categories/mma-welders.json` → `air-compressors.json`，改 slug/name/intro（150 词以上）/specSchema（定义新品类的参数表）；
2. 产品 json 的 `category` 填新 slug，参数 key 对齐新 specSchema；
3. 导航/首页自动出现（模板按数据渲染，无需改模板代码）；
4. 检查：首发 ≥3 款产品；Google Rich Results Test 验一条产品页。

### 发一篇博客

`src/content/blog/` 新建 md，frontmatter：title/description/pubDate/tags/image。正文用 Markdown，文末放 `/contact/` 引导链接。

## 重要约定

- **数据口径**：产品参数以《产品信息配件/Gowellde 双语.xlsx》为唯一主数据；网页改参数改 json，Excel 变了同步 json，不允许第三处手写。
- **URL 不动**：产品 URL `/products/{型号短名}/` 一经发布不要改（外链和 Google 收录都指着它）。
- **敏感信息**：真实价格、客户信息、报价记录不进 git 仓库（仓库公开可查）。

## 技术栈备忘

- Astro 5（纯静态输出，默认零 JS；构建期生成 sitemap）
- Tailwind CSS 3（构建期编译，已不用旧站的 CDN 运行时）
- 字体自托管 @fontsource/roboto + roboto-mono
- 表单 Web3Forms（免费）；统计 GA4
