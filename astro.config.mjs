import { defineConfig } from 'astro/config';

// URL canônica do portal. O domínio ainda precisa ser registrado e apontado.
export default defineConfig({
  site: 'https://ondetreinaralphaville.com.br',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
});
