// Auditoria de qualidade do build. Uso: npm run auditoria  (depois de npm run build)
// Sai com código 1 se houver problema bloqueante. Gera relatorios/auditoria.{json,md}.
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

const DIST = 'dist', SITE = 'https://ondetreinaralphaville.com.br';
const LIMITE_SIM_INTERNA = 0.30, AVISO_SIM_INTERNA = 0.15; // Jaccard sobre sequências de 5 palavras
const LIMITE_SIM_EXTERNA = 0.12, AVISO_SIM_EXTERNA = 0.05; // fração das sequências da página que existem em um texto do corpus externo
const DIAS_VALIDADE = 90;
const erros = [], avisos = [], ok = [];
const erro = (t, d) => erros.push({ teste: t, detalhe: d });
const aviso = (t, d) => avisos.push({ teste: t, detalhe: d });

if (!existsSync(DIST)) { console.error('Rode "npm run build" antes.'); process.exit(1); }
const andar = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? andar(p) : [p]; });
const arquivos = andar(DIST);
const htmls = arquivos.filter((f) => f.endsWith('.html'));
const urlDe = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const tirar = (s) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
const um = (h, re) => (h.match(re) || [])[1];

const paginas = htmls.map((f) => {
  const h = readFileSync(f, 'utf8'), url = urlDe(f);
  const main = um(h, /<main[^>]*>([\s\S]*?)<\/main>/) || '';
  // texto principal sem os blocos repetidos de propósito (cartões, chamada da casa, tabelas de dados)
  // e sem os blocos de dados estruturados das fichas, delimitados por marcadores data-dado
  const corpo = main.replace(/<i data-dado="i"[^>]*><\/i>[\s\S]*?<i data-dado="f"[^>]*><\/i>/g, ' ').replace(/<article class="cartao[\s\S]*?<\/article>/g, ' ').replace(/<aside class="mantem[\s\S]*?<\/aside>/g, ' ').replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<form[\s\S]*?<\/form>/g, ' ');
  return {
    f, url, h,
    titulo: um(h, /<title>([\s\S]*?)<\/title>/), nTitulos: (h.match(/<title>/g) || []).length,
    desc: um(h, /<meta name="description" content="([^"]*)"/),
    canonical: um(h, /<link rel="canonical" href="([^"]*)"/),
    h1s: [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => tirar(m[1])),
    noindexProprio: url === '/404.html',
    links: [...h.replace(/<script[\s\S]*?<\/script>/g, '').matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]),
    jsonld: [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]),
    texto: tirar(corpo), imgsSemAlt: (h.match(/<img(?![^>]*\salt=)[^>]*>/g) || []).length,
    niveis: [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1])),
  };
});
const conteudo = paginas.filter((p) => !p.noindexProprio);
const existe = new Set(paginas.map((p) => p.url));

// 1. Metadados
for (const p of paginas) {
  if (p.nTitulos !== 1 || !p.titulo) erro('title', `${p.url}: precisa de exatamente um <title>`);
  else if (p.titulo.length > 65) aviso('title', `${p.url}: title com ${p.titulo.length} caracteres`);
  if (!p.desc) erro('description', `${p.url}: sem meta description`);
  else if (p.desc.length < 70 || p.desc.length > 165) aviso('description', `${p.url}: description com ${p.desc.length} caracteres`);
  if (p.h1s.length !== 1) erro('h1', `${p.url}: ${p.h1s.length} elementos h1`);
  if (!p.noindexProprio && p.canonical !== SITE + p.url) erro('canonical', `${p.url}: canonical "${p.canonical}"`);
  if (p.imgsSemAlt) erro('alt', `${p.url}: ${p.imgsSemAlt} imagem(ns) sem alt`);
  for (let i = 1; i < p.niveis.length; i++) if (p.niveis[i] - p.niveis[i - 1] > 1) { aviso('hierarquia', `${p.url}: salto de h${p.niveis[i - 1]} para h${p.niveis[i]}`); break; }
}
for (const [campo, nome] of [['titulo', 'title'], ['desc', 'description'], ['h1s', 'h1']]) {
  const visto = new Map();
  for (const p of conteudo) { const v = String(campo === 'h1s' ? p.h1s[0] : p[campo]); if (visto.has(v)) erro(`${nome} duplicado`, `${p.url} e ${visto.get(v)}: "${v.slice(0, 70)}"`); else visto.set(v, p.url); }
}
ok.push(`${paginas.length} páginas HTML analisadas`);

// 2. Links internos, órfãs, poucas entradas
const entradas = new Map(conteudo.map((p) => [p.url, new Set()]));
let nInternos = 0; const externos = new Set();
for (const p of paginas) for (const href of p.links) {
  if (/^(mailto:|tel:|#)/.test(href)) continue;
  if (/^https?:/.test(href)) { if (!href.startsWith(SITE)) externos.add(href.split('?')[0]); continue; }
  nInternos++;
  const alvo = href.split('#')[0].split('?')[0];
  if (!alvo.endsWith('/') && !/\.[a-z0-9]+$/.test(alvo)) erro('link sem barra final', `${p.url} → ${href}`);
  else if (!existe.has(alvo) && !existsSync(join(DIST, alvo))) erro('link quebrado', `${p.url} → ${href}`);
  else if (entradas.has(alvo) && alvo !== p.url) entradas.get(alvo).add(p.url);
}
// links do cabeçalho e do rodapé contam como entrada, mas uma página só com eles está mal conectada
const navegacao = new Set(['/', '/academias/', '/regioes/', '/modalidades/', '/guias/', '/ferramentas/', '/mapa/', '/sobre/', '/metodologia/', '/politica-editorial/', '/correcoes/', '/privacidade/']);
for (const [url, de] of entradas) {
  if (url === '/') continue;
  if (de.size === 0) erro('página órfã', url);
  else if (!navegacao.has(url) && de.size < 3) aviso('poucos links internos', `${url}: ${de.size} página(s) apontam para ela`);
}
ok.push(`${nInternos} links internos verificados; ${externos.size} destinos externos distintos`);

// 3. Sitemap e robots
const sm = existsSync(join(DIST, 'sitemap.xml')) ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8') : '';
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
if (!sm) erro('sitemap', 'dist/sitemap.xml não existe');
for (const l of locs) if (!existe.has(l)) erro('sitemap', `URL sem página: ${l}`);
for (const p of conteudo) if (!locs.includes(p.url)) erro('sitemap', `página fora do sitemap: ${p.url}`);
if (new Set(locs).size !== locs.length) erro('sitemap', 'URLs repetidas');
for (const m of sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) if (!/^\d{4}-\d\d-\d\d$/.test(m[1]) || new Date(m[1]) > new Date()) erro('sitemap', `lastmod inválido ou no futuro: ${m[1]}`);
ok.push(`sitemap com ${locs.length} URLs`);
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
const indexavel = !/Disallow: \/\s*$/m.test(robots);
const temNoindex = paginas.filter((p) => /<meta name="robots" content="noindex/.test(p.h)).length;
if (indexavel && temNoindex > 1) erro('indexação', `robots libera o site mas ${temNoindex} páginas têm noindex`);
if (indexavel && paginas.some((p) => p.h.includes('class="previa"'))) erro('indexação', 'site indexável com conteúdo em revisão no build');
ok.push(indexavel ? 'site INDEXÁVEL' : `site em pré-lançamento: robots bloqueia e ${temNoindex} páginas têm noindex`);

// 4. Dados estruturados
for (const p of paginas) for (const j of p.jsonld) {
  let d; try { d = JSON.parse(j); } catch { erro('schema', `${p.url}: JSON-LD inválido`); continue; }
  for (const n of d['@graph'] || [d]) {
    if (!n['@type']) erro('schema', `${p.url}: nó sem @type`);
    if (n['@type'] === 'Article') {
      for (const k of ['headline', 'datePublished', 'dateModified', 'author']) if (!n[k]) erro('schema', `${p.url}: Article sem ${k}`);
      if (n.headline && !p.h.includes(n.headline.replace(/&/g, '&amp;')) && !tirar(p.h).includes(n.headline)) erro('schema', `${p.url}: headline do Article não aparece na página`);
    }
    if (['Review', 'AggregateRating', 'LocalBusiness'].includes(n['@type'])) erro('schema', `${p.url}: tipo ${n['@type']} não é permitido neste portal`);
    if (n['@type'] === 'BreadcrumbList') for (const it of n.itemListElement) if (!existe.has(it.item.replace(SITE, ''))) erro('schema', `${p.url}: breadcrumb aponta para URL inexistente ${it.item}`);
    if (n['@type'] === 'ItemList') for (const it of n.itemListElement) if (!existe.has(it.url.replace(SITE, ''))) erro('schema', `${p.url}: ItemList aponta para URL inexistente ${it.url}`);
  }
}
ok.push('JSON-LD de todas as páginas é válido e aponta para URLs existentes');

// 5. Proveniência e validade dos dados locais
const dirA = 'src/data/academias', hoje = new Date(); let nFichas = 0; const pendencias = [];
for (const f of readdirSync(dirA).filter((x) => x.endsWith('.yaml'))) {
  const d = parse(readFileSync(join(dirA, f), 'utf8')); nFichas++;
  const cobertos = new Set((d.proveniencia || []).flatMap((p) => p.campos));
  for (const c of ['endereco', 'horario', 'modalidades']) if (!cobertos.has(c)) erro('proveniência', `${f}: campo "${c}" sem fonte`);
  if (d.agregadores?.length && !cobertos.has('agregadores')) erro('proveniência', `${f}: agregadores sem fonte`);
  if (d.mensalidade && (!d.mensalidade.fonte || !d.mensalidade.conferido_em)) erro('proveniência', `${f}: mensalidade sem fonte ou data`);
  for (const p of d.proveniencia || []) { const dias = Math.floor((hoje - new Date(p.conferido_em)) / 864e5); if (dias > DIAS_VALIDADE) aviso('dado antigo', `${f}: ${p.campos.join(', ')} conferido há ${dias} dias`); }
  if (!d.revisor) pendencias.push(`${d.nome}: revisão humana pendente`);
  if (!['aprovado', 'publicado'].includes(d.status)) pendencias.push(`${d.nome}: status "${d.status}"`);
}
ok.push(`${nFichas} fichas com fonte e data para endereço, horário e modalidades`);

// 6. Similaridade
const seqs = (t) => { const w = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean); const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(' ')); return s; };
const comSeq = conteudo.filter((p) => p.texto.split(' ').length > 120).map((p) => ({ url: p.url, s: seqs(p.texto) }));
const pares = [];
for (let i = 0; i < comSeq.length; i++) for (let j = i + 1; j < comSeq.length; j++) {
  const a = comSeq[i].s, b = comSeq[j].s; let inter = 0; for (const x of a) if (b.has(x)) inter++;
  const jac = inter / (a.size + b.size - inter); if (jac >= AVISO_SIM_INTERNA) pares.push({ a: comSeq[i].url, b: comSeq[j].url, sim: +jac.toFixed(3) });
}
pares.sort((x, y) => y.sim - x.sim);
for (const p of pares) (p.sim >= LIMITE_SIM_INTERNA ? erro : aviso)('similaridade interna', `${p.a} × ${p.b}: ${(p.sim * 100).toFixed(0)}%`);
ok.push(`similaridade interna calculada para ${comSeq.length} páginas (${(comSeq.length * (comSeq.length - 1)) / 2} pares)`);

const DIR_CORPUS = 'relatorios/corpus'; const extern = [];
if (existsSync(DIR_CORPUS) && readdirSync(DIR_CORPUS).length) {
  const corpus = readdirSync(DIR_CORPUS).filter((f) => f.endsWith('.txt')).map((f) => ({ f, s: seqs(readFileSync(join(DIR_CORPUS, f), 'utf8')) }));
  for (const p of comSeq) for (const c of corpus) { let inter = 0; for (const x of p.s) if (c.s.has(x)) inter++; const fr = inter / p.s.size; if (fr >= AVISO_SIM_EXTERNA) extern.push({ pagina: p.url, corpus: c.f, sim: +fr.toFixed(3) }); }
  extern.sort((x, y) => y.sim - x.sim);
  for (const e of extern) (e.sim >= LIMITE_SIM_EXTERNA ? erro : aviso)('similaridade com o ecossistema', `${e.pagina} × ${e.corpus}: ${(e.sim * 100).toFixed(0)}% das sequências`);
  ok.push(`similaridade com o ecossistema calculada contra ${corpus.length} textos do corpus`);
} else aviso('similaridade com o ecossistema', 'corpus ausente: rode "node scripts/corpus.mjs" para baixar as páginas do Montinho e do Personal por Perto');

// Relatório
mkdirSync('relatorios', { recursive: true });
const rel = { gerado_em: new Date().toISOString(), aprovado: erros.length === 0, verificacoes: ok, erros, avisos, pendencias_editoriais: pendencias, similaridade_interna: pares, similaridade_externa: extern, links_externos: [...externos].sort() };
writeFileSync('relatorios/auditoria.json', JSON.stringify(rel, null, 2));
const agrupa = (xs) => Object.entries(xs.reduce((m, x) => ((m[x.teste] ||= []).push(x.detalhe), m), {}));
writeFileSync('relatorios/auditoria.md', `# Auditoria do build\n\nGerada em ${rel.gerado_em}\n\n**Resultado:** ${rel.aprovado ? 'sem erros bloqueantes' : `${erros.length} erro(s) bloqueante(s)`} · ${avisos.length} aviso(s)\n\n## Verificações executadas\n${ok.map((x) => `- ${x}`).join('\n')}\n\n## Erros\n${agrupa(erros).map(([t, ds]) => `### ${t}\n${ds.map((d) => `- ${d}`).join('\n')}`).join('\n\n') || 'Nenhum.'}\n\n## Avisos\n${agrupa(avisos).map(([t, ds]) => `### ${t}\n${ds.map((d) => `- ${d}`).join('\n')}`).join('\n\n') || 'Nenhum.'}\n\n## Pendências editoriais (não bloqueiam o build)\n${pendencias.length} item(ns). Ver auditoria.json.\n\n## Links externos\n${[...externos].sort().map((x) => `- ${x}`).join('\n')}\n`);
console.log(ok.map((x) => '✓ ' + x).join('\n'));
for (const [t, ds] of agrupa(avisos)) console.log(`\n⚠ ${t} (${ds.length})\n` + ds.slice(0, 12).map((d) => '   ' + d).join('\n'));
for (const [t, ds] of agrupa(erros)) console.log(`\n✗ ${t} (${ds.length})\n` + ds.map((d) => '   ' + d).join('\n'));
console.log(`\n${erros.length} erro(s), ${avisos.length} aviso(s), ${pendencias.length} pendência(s) editorial(is). Relatório em relatorios/auditoria.md`);
process.exit(erros.length ? 1 : 0);
