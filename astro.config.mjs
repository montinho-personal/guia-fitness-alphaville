import { defineConfig } from 'astro/config';

// URL canônica do portal. Domínio registrado na HostGator; site hospedado na Vercel.
export default defineConfig({
  site: 'https://guiafitnessalphaville.com.br',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
});
