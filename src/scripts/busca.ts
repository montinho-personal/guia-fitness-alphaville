// Motor de busca do site: carrega o índice uma vez e ordena por relevância.
export interface Item { t: string; u: string; c: string; d: string; k: string }
interface Pronto extends Item { nt: string; nk: string; nd: string }

export const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const SINONIMOS: Record<string, string> = { '24h': '24 horas', 'pt': 'personal trainer', 'personal': 'personal', 'crossfit': 'crossfit', 'bt': 'beach tennis', 'smartfit': 'smart fit', 'bluefit': 'bluefit', 'gavioes': 'gavioes', 'precos': 'preco', 'preco': 'preco', 'valor': 'preco', 'mensalidade': 'preco', 'gympass': 'wellhub' };

let cache: Promise<Pronto[]> | undefined;
export function carregar(): Promise<Pronto[]> {
  cache ??= fetch('/busca.json').then((r) => r.json()).then((xs: Item[]) => xs.map((x) => ({ ...x, nt: normalizar(x.t), nk: normalizar(x.k), nd: normalizar(x.d) })));
  return cache;
}

export function buscar(itens: Pronto[], consulta: string, limite = 12): Item[] {
  const termos = normalizar(consulta).split(' ').filter((t) => t.length > 0).map((t) => normalizar(SINONIMOS[t] ?? t)).join(' ').split(' ').filter((t) => t.length > 1 || /\d/.test(t));
  if (!termos.length) return [];
  const pontos = (x: Pronto) => {
    let total = 0;
    for (const t of termos) {
      const re = new RegExp(`(^| )${t}`);
      let s = 0;
      if (re.test(x.nt)) s = 10; else if (x.nt.includes(t)) s = 6;
      else if (re.test(x.nk)) s = 4; else if (re.test(x.nd)) s = 2; else if (x.nk.includes(t) || x.nd.includes(t)) s = 1;
      if (!s) return 0; // todos os termos precisam aparecer
      total += s;
    }
    const semPrefixo = x.nt.replace(/^(academia|personal trainer (na|no|em)) /, '');
    if (x.nt.startsWith(termos.join(' ')) || semPrefixo.startsWith(termos.join(' '))) total += 8;
    if (['Academia', 'Box', 'Estúdio'].includes(x.c) && termos.some((t) => new RegExp(`(^| )${t}`).test(x.nt))) total += 4;
    return total;
  };
  return itens.map((x) => [x, pontos(x)] as const).filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1] || a[0].t.length - b[0].t.length).slice(0, limite).map(([x]) => x);
}

export const SUGESTOES = ['Academia 24 horas', 'Personal trainer em Alphaville', 'Preços', 'Hyrox', 'Gaviões', 'Abertas no domingo', 'Beach tennis', 'Wellhub'];

export function registrar(evento: string, dados: Record<string, string>) {
  const w = window as any;
  if (typeof w.otaEvento === 'function') w.otaEvento(evento, dados);
  else (w.dataLayer = w.dataLayer || []).push({ event: evento, pagina: location.pathname, ...dados });
}

export const escapar = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export function destacar(texto: string, consulta: string) {
  const seguro = escapar(texto);
  const termos = normalizar(consulta).split(' ').filter((t) => t.length > 1);
  if (!termos.length) return seguro;
  // destaca ignorando acentos: mapeia posições do texto normalizado
  const base = seguro.normalize('NFD');
  let out = '', i = 0;
  const plano = base.replace(/[̀-ͯ]/g, '').toLowerCase();
  const marcas = new Array(plano.length).fill(false);
  for (const t of termos) { let p = plano.indexOf(t); while (p !== -1) { for (let j = p; j < p + t.length; j++) marcas[j] = true; p = plano.indexOf(t, p + t.length); } }
  // reconstrói usando o texto com acentos (NFD), pulando diacríticos ao contar
  let k = 0, aberto = false;
  for (const ch of base) {
    if (/[̀-ͯ]/.test(ch)) { out += ch; continue; }
    const m = marcas[k++];
    if (m && !aberto) { out += '<mark>'; aberto = true; } else if (!m && aberto) { out += '</mark>'; aberto = false; }
    out += ch; i++;
  }
  if (aberto) out += '</mark>';
  return out.normalize('NFC');
}
