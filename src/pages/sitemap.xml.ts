import type { APIRoute } from 'astro';
import { academias, guias, REGIOES, dataIso } from '../lib/dados';

// Só URLs canônicas e indexáveis. O lastmod vem da data real de atualização de cada conteúdo;
// páginas de listagem herdam a data mais recente do que listam.
const FIXAS = '2026-11-13';
export const GET: APIRoute = async ({ site }) => {
  const as = await academias();
  const gs = await guias();
  const maisRecente = (ds: Date[]) => dataIso(new Date(Math.max(...ds.map((d) => d.getTime()))));
  const ultAcad = maisRecente(as.map((a) => a.data.atualizado_em));
  const ultGuia = gs.length ? maisRecente(gs.map((g) => g.data.atualizado_em)) : FIXAS;
  const urls: [string, string][] = [
    ['/', ultAcad], ['/academias/', ultAcad], ['/academias/24-horas/', ultAcad], ['/academias/precos/', ultAcad], ['/academias/wellhub-totalpass/', ultAcad],
    ...as.map((a) => [`/academias/${a.id}/`, dataIso(a.data.atualizado_em)] as [string, string]),
    ['/regioes/', ultAcad],
    ...Object.keys(REGIOES).filter((r) => as.filter((a) => a.data.regiao === r).length >= 3).map((r) => [`/regioes/${r}/`, maisRecente(as.filter((a) => a.data.regiao === r).map((a) => a.data.atualizado_em))] as [string, string]),
    ['/modalidades/', ultAcad], ['/guias/', ultGuia],
    ...gs.map((g) => [`/${g.data.secao}/${g.id}/`, dataIso(g.data.atualizado_em)] as [string, string]),
    ['/guias/smart-fit-ou-gavioes/', ultAcad],
    ['/guias/ironberg-ou-nitrogym/', ultAcad],
    ['/ferramentas/', FIXAS], ['/ferramentas/comparador/', ultAcad], ['/ferramentas/qual-academia/', ultAcad], ['/ferramentas/checklist/', FIXAS], ['/mapa/', ultAcad],
    ['/sobre/', FIXAS], ['/metodologia/', FIXAS], ['/politica-editorial/', FIXAS], ['/correcoes/', FIXAS], ['/privacidade/', FIXAS],
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `<url><loc>${new URL(u, site).href}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
