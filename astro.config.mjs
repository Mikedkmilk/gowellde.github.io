import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// 换正式域名时只改这里 + public/CNAME + public/robots.txt 三处
export default defineConfig({
  site: 'https://www.812818.xyz',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // 对比页是 noindex 工具页，不进 sitemap
      filter: (page) => !page.includes('/compare'),
    }),
  ],
  trailingSlash: 'ignore',
});
