// Wellhub e TotalPass por unidade: cobertura, acesso por plano e plano comum entre duas unidades.
// Fonte única: o campo agregadores das fichas (src/data/academias/<id>.yaml) e a ordem oficial dos planos
// em src/data/planos-agregadores.json (tabela exibida nas páginas de parceiros de cada benefício).
// Lógica pura, sem dependência do Astro, para servir à página, às fichas e aos testes.

export type Beneficio = 'Wellhub' | 'TotalPass';
export const BENEFICIOS: Beneficio[] = ['Wellhub', 'TotalPass'];

export interface EntradaBen {
  nome: Beneficio; situacao?: 'confirmada' | 'nao-aceita'; plano_minimo: string; preco_plano?: string; url?: string;
  nota?: string; planos?: string[]; atividades?: string[]; musculacao?: boolean; condicoes?: string[]; conferido_em?: Date | string;
}

/** Modalidades do buscador e palavras que as identificam na lista de atividades do benefício. */
export const MODS_BEN: Record<string, { rotulo: string; re: RegExp }> = {
  musculacao: { rotulo: 'Musculação', re: /muscula/i },
  funcional: { rotulo: 'Funcional e HIIT', re: /funcional|hiit|\bhit\b|circuito|treino h[íi]brido|cross training/i },
  lutas: { rotulo: 'Lutas', re: /jiu|muay|boxe|mma|luta|fight|karat|jud[ôo]|kick/i },
  pilates: { rotulo: 'Pilates', re: /pilates/i },
  yoga: { rotulo: 'Yoga', re: /yoga|ioga/i },
  crossfit: { rotulo: 'CrossFit e cross training', re: /crossfit|cross training|cross\b|wod/i },
  danca: { rotulo: 'Dança', re: /dan[çc]a|zumba|ritmos|fitdance|fitness dance|street|bal[ée]/i },
  bike: { rotulo: 'Bike indoor', re: /bike|spinning|ciclismo|cycle/i },
  'esportes-de-areia': { rotulo: 'Beach tennis e areia', re: /beach|futev[ôo]lei|v[ôo]lei de praia|areia/i },
};

/** A unidade cobre a modalidade pelo benefício? Musculação usa o campo explícito; as demais, a lista de atividades. */
export function cobreModalidade(e: EntradaBen, mod: string): boolean | null {
  if (mod === 'musculacao' && typeof e.musculacao === 'boolean') return e.musculacao;
  if (!e.atividades || !e.atividades.length) return null;
  const m = MODS_BEN[mod]; if (!m) return null;
  return e.atividades.some((x) => m.re.test(x));
}

export type EstadoCob = 'confirmada' | 'outra-modalidade' | 'nao-aceita' | 'a-confirmar';

/** Situação da unidade no benefício e na modalidade. Sem entrada na ficha: a confirmar (não "não aceita"). */
export function cobertura(entradas: EntradaBen[], ben: Beneficio, mod: string): { estado: EstadoCob; e: EntradaBen | null } {
  const e = entradas.find((x) => x.nome === ben) ?? null;
  if (!e) return { estado: 'a-confirmar', e: null };
  if (e.situacao === 'nao-aceita') return { estado: 'nao-aceita', e };
  const c = cobreModalidade(e, mod);
  if (c === false) return { estado: 'outra-modalidade', e };
  if (c === null) return { estado: 'a-confirmar', e };
  return { estado: 'confirmada', e };
}

/**
 * O plano dá acesso à unidade?
 * TotalPass: a página da unidade lista os planos que dão acesso; vale a lista.
 * Wellhub: a página da unidade diz "a partir do plano X"; vale X e os planos acima dele, na ordem oficial.
 * Retorna null quando não dá para afirmar (plano fora da ordem conhecida, sem lista nem mínimo).
 */
export function acessa(e: EntradaBen, plano: string, ordem: string[]): boolean | null {
  if (e.situacao === 'nao-aceita') return false;
  if (e.planos && e.planos.length) return e.planos.includes(plano);
  const iMin = ordem.indexOf(e.plano_minimo), iP = ordem.indexOf(plano);
  if (iMin < 0 || iP < 0) return null;
  return iP >= iMin;
}

/** Planos da ordem oficial que dão acesso à unidade, do menor para o maior. */
export function planosQueAcessam(e: EntradaBen, ordem: string[]): string[] | null {
  if (e.situacao === 'nao-aceita') return [];
  const r = ordem.filter((p) => acessa(e, p, ordem) === true);
  if (!r.length && ordem.indexOf(e.plano_minimo) < 0) return null;
  return r;
}

export type ResultadoPar =
  | { tipo: 'comum'; plano: string; planos: string[] }
  | { tipo: 'incompativel'; motivo: string }
  | { tipo: 'pendente'; motivo: string };

/** Menor plano que cobre as duas unidades na modalidade, pela interseção dos planos que dão acesso a cada uma. */
export function planoComum(a: EntradaBen[], b: EntradaBen[], ben: Beneficio, mod: string, ordem: string[], nomes: [string, string] = ['a primeira unidade', 'a segunda unidade']): ResultadoPar {
  const ca = cobertura(a, ben, mod), cb = cobertura(b, ben, mod);
  const rot = MODS_BEN[mod]?.rotulo.toLowerCase() ?? mod;
  for (const [c, n] of [[ca, nomes[0]], [cb, nomes[1]]] as const) {
    if (c.estado === 'nao-aceita') return { tipo: 'incompativel', motivo: `${n} não aceita o ${ben}, segundo a fonte.` };
  }
  // Primeiro o que torna a dupla incompatível nas duas unidades; só depois o que deixa pendente (a ordem não muda o resultado).
  for (const [c, n] of [[ca, nomes[0]], [cb, nomes[1]]] as const) {
    if (c.estado === 'outra-modalidade') return { tipo: 'incompativel', motivo: `${n} aceita o ${ben}, mas a página do benefício não lista ${rot}.` };
  }
  for (const [c, n] of [[ca, nomes[0]], [cb, nomes[1]]] as const) {
    if (c.estado === 'a-confirmar') return { tipo: 'pendente', motivo: c.e ? `A página do ${ben} de ${n} não detalha as atividades.` : `${n} não aparece no catálogo do ${ben} conferido pelo guia; confirme no aplicativo.` };
  }
  const pa = planosQueAcessam(ca.e!, ordem), pb = planosQueAcessam(cb.e!, ordem);
  if (!pa || !pb) return { tipo: 'pendente', motivo: `Não foi possível ordenar os planos do ${ben} de uma das unidades.` };
  const comuns = ordem.filter((p) => pa.includes(p) && pb.includes(p));
  if (!comuns.length) return { tipo: 'incompativel', motivo: `As listas de planos do ${ben} das duas unidades não têm plano em comum.` };
  return { tipo: 'comum', plano: comuns[0], planos: comuns };
}
