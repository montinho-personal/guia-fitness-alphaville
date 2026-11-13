import type { APIRoute } from 'astro';
const INDEXAVEL = import.meta.env.PUBLIC_INDEXAVEL === 'true';
// Antes do lançamento o site inteiro fica fora do rastreamento. Depois, tudo liberado:
// não há regra específica para robôs de IA, que seguem a regra geral.
export const GET: APIRoute = ({ site }) =>
  new Response(INDEXAVEL ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n` : `User-agent: *\nDisallow: /\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
