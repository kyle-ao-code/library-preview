import { defineConfig } from 'astro/config';
// 部署到 GitHub Pages 时按仓库名设置 SITE 和 BASE（用户主页仓库 BASE 为 /）
// PREVIEW=1 只在预览仓库构建时打开：顶部「预览版」横幅、noindex、卡片「新」角标
export default defineConfig({
  site: process.env.SITE || 'https://example.github.io',
  base: process.env.BASE || '/',
  vite: { define: { __PREVIEW__: JSON.stringify(process.env.PREVIEW === '1') } },
});
