// Baixa o texto das páginas do ecossistema Montinho que tratam dos mesmos temas do portal,
// para a verificação de similaridade. Uso: node scripts/corpus.mjs
// O corpus fica em relatorios/corpus (fora do Git). Só lê páginas públicas listadas nos sitemaps.
import { mkdirSync, writeFileSync } from 'node:fs';
const FONTES = [
  { sitemap: 'https://www.montinhopersonal.com.br/sitemap.xml', filtro: /academia|smart-fit|bluefit|bodytech|gavioes|skyfit|voi-fit|scelta|panobianco|crossfit|personal-trainer|treinador-particular|professor-de-musculacao|condominios-aldeia-da-serra|academia-ou-personal/ },
  { sitemap: 'https://www.personalporperto.com.br/sitemap-0.xml', filtro: /alphaville|barueri-sp|tambore-sp|santana-de-parnaiba-sp|personal-trainer-em-academia|personal-trainer-em-condominio|como-escolher-personal|coach-de-academia|hyrox-vs-crossfit/ },
];
const texto = (h) => (h.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? h).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
mkdirSync('relatorios/corpus', { recursive: true });
let n = 0, falhas = 0;
for (const { sitemap, filtro } of FONTES) {
  const xml = await (await fetch(sitemap)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => filtro.test(u));
  console.log(`${sitemap}: ${urls.length} páginas selecionadas`);
  for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(async (u) => {
    try { const r = await fetch(u); if (!r.ok) throw new Error(String(r.status)); const t = texto(await r.text()); writeFileSync(`relatorios/corpus/${u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 150)}.txt`, t); n++; }
    catch (e) { falhas++; console.error('falhou', u, e.message); }
  }));
}
console.log(`${n} textos gravados em relatorios/corpus; ${falhas} falha(s)`);
