// Calculadora do Hyrox: cargas por divisão (dados em src/data/hyrox.json, do site oficial)
// e plano de prova (aritmética pura: 8 corridas de 1 km + 8 estações + transições).
// O plano é conta, não previsão: não estima o tempo de ninguém. Doc: docs/calculadora-hyrox.md.

export interface Estacao { id: string; nome: string; medida: string }
export interface Divisao { id: string; formato: 'individual' | 'dupla' | 'revezamento'; nome: string; push: string; pull: string; farmers: string; lunges: string; wall: string }
export interface DadosHyrox { fonte: string; url: string; conferido_em: string; estacoes: Estacao[]; divisoes: Divisao[] }

export const FORMATOS: Record<Divisao['formato'], string> = { individual: 'Individual', dupla: 'Dupla', revezamento: 'Revezamento (4 pessoas)' };
export const N = 8;

/** Carga de uma estação numa divisão; null quando a estação não tem carga (SkiErg, burpee, remo). */
export const carga = (d: Divisao, estacaoId: string): string | null => (d as unknown as Record<string, string>)[estacaoId] ?? null;

/** "1:30:00", "1h30", "90" (minutos) ou "6:15" → segundos. `padrao` diz como ler um número solto ou "a:b". */
export function paraSegundos(txt: string, padrao: 'prova' | 'ritmo'): number | null {
  const t = txt.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  if (!t) return null;
  const h = t.match(/^(\d{1,2})h(\d{1,2})?(?:m(?:in)?)?$/);
  if (h) return Number(h[1]) * 3600 + Number(h[2] ?? 0) * 60;
  const p = t.replace(/["']/g, ':').replace(/min$|m$/, '').split(':');
  if (p.some((x) => x === '' || !/^\d+(\.\d+)?$/.test(x))) return null;
  const n = p.map(Number);
  let s: number;
  if (n.length === 3) s = n[0] * 3600 + n[1] * 60 + n[2];
  else if (n.length === 2) s = padrao === 'prova' ? n[0] * 3600 + n[1] * 60 : n[0] * 60 + n[1];
  else if (n.length === 1) s = n[0] * 60;
  else return null;
  if (n.length > 1 && n.slice(1).some((x) => x >= 60)) return null;
  return Math.round(s);
}

/** Segundos → "1h30min05s" (prova) ou "6:15" (curto). */
export function relogio(seg: number): string {
  const s = Math.max(0, Math.round(seg)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}
export function porExtenso(seg: number): string {
  const s = Math.max(0, Math.round(seg)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return [h ? `${h}h` : '', m || h ? `${h ? String(m).padStart(2, '0') : m}min` : '', r ? `${String(r).padStart(2, '0')}s` : ''].join('') || '0s';
}

export interface Entrada { metaSeg: number; ritmoSeg: number; transSeg?: number; estacoesSeg?: (number | null)[] }
export interface Segmento { tipo: 'corrida' | 'estacao'; n: number; nome: string; dur: number; acum: number }
export interface Plano {
  ok: boolean; erro?: string;
  corridaTotal: number; transTotal: number; estacoesTotal: number; mediaEstacao: number;
  total: number; diferenca: number; /** total − meta; negativo = sobra */
  ritmoMaximo: number; /** ritmo que, sozinho, já consumiria a meta inteira */
  personalizado: boolean; segmentos: Segmento[];
}

export const LIMITES = { metaMin: 40 * 60, metaMax: 4 * 3600, ritmoMin: 150, ritmoMax: 15 * 60 };

/**
 * Monta o plano. Sem `estacoesSeg`, o que sobra da meta depois da corrida e das transições é
 * dividido por igual entre as 8 estações. Com tempos próprios (os nulos recebem a média do que resta),
 * o total é recalculado e comparado com a meta.
 */
export function plano(e: Entrada, estacoes: Estacao[]): Plano {
  const trans = Math.max(0, e.transSeg ?? 0);
  const vazio: Plano = { ok: false, corridaTotal: 0, transTotal: trans, estacoesTotal: 0, mediaEstacao: 0, total: 0, diferenca: 0, ritmoMaximo: 0, personalizado: false, segmentos: [] };
  if (!Number.isFinite(e.metaSeg) || e.metaSeg < LIMITES.metaMin || e.metaSeg > LIMITES.metaMax) return { ...vazio, erro: 'Informe uma meta entre 40 minutos e 4 horas.' };
  if (!Number.isFinite(e.ritmoSeg) || e.ritmoSeg < LIMITES.ritmoMin || e.ritmoSeg > LIMITES.ritmoMax) return { ...vazio, erro: 'Informe um ritmo de corrida entre 2:30 e 15:00 por km.' };
  const corridaTotal = N * e.ritmoSeg;
  const ritmoMaximo = Math.floor((e.metaSeg - trans) / N);
  const proprios = (e.estacoesSeg ?? []).slice(0, N);
  const fixos = proprios.filter((x): x is number => typeof x === 'number' && x > 0);
  const personalizado = fixos.length > 0;
  const restante = e.metaSeg - corridaTotal - trans - fixos.reduce((a, b) => a + b, 0);
  const livres = N - fixos.length;
  if (livres > 0 && restante < livres * 30) {
    return { ...vazio, corridaTotal, ritmoMaximo, personalizado, erro: personalizado
      ? 'Com esses tempos, não sobra tempo para as estações que ficaram em branco. Aumente a meta ou ajuste os tempos.'
      : `Com esse ritmo, a corrida sozinha leva ${porExtenso(corridaTotal)} e não sobra tempo para as estações. Para essa meta, o ritmo teria de ficar bem abaixo de ${relogio(ritmoMaximo)} por km.` };
  }
  const media = livres > 0 ? restante / livres : 0;
  const durs = estacoes.slice(0, N).map((_, i) => { const p = proprios[i]; return typeof p === 'number' && p > 0 ? p : media; });
  const estacoesTotal = durs.reduce((a, b) => a + b, 0);
  const segmentos: Segmento[] = [];
  let acum = 0;
  estacoes.slice(0, N).forEach((est, i) => {
    acum += e.ritmoSeg; segmentos.push({ tipo: 'corrida', n: i + 1, nome: `Corrida ${i + 1} (1 km)`, dur: e.ritmoSeg, acum: Math.round(acum) });
    acum += trans / N + durs[i]; segmentos.push({ tipo: 'estacao', n: i + 1, nome: est.nome, dur: Math.round(durs[i]), acum: Math.round(acum) });
  });
  const total = Math.round(acum);
  return { ok: true, corridaTotal, transTotal: trans, estacoesTotal: Math.round(estacoesTotal), mediaEstacao: Math.round(estacoesTotal / N), total, diferenca: total - e.metaSeg, ritmoMaximo, personalizado, segmentos };
}

/** "Individual, Open masculino"; dupla e revezamento já trazem o formato no nome. */
export const rotuloDivisao = (d: Divisao) => (d.formato === 'individual' ? `Individual, ${d.nome}` : d.nome);

/** Texto do plano para copiar ou mandar a alguém. */
export function textoPlano(p: Plano, d: Divisao, ritmoSeg: number): string {
  return [`Plano de prova Hyrox · ${rotuloDivisao(d)}`, `Tempo final: ${porExtenso(p.total)} · corrida a ${relogio(ritmoSeg)}/km`,
    ...p.segmentos.map((s) => `${relogio(s.acum).padStart(7, ' ')}  ${s.nome}${s.tipo === 'estacao' ? ` (${relogio(s.dur)})` : ''}`)].join('\n');
}

/** Mensagem do WhatsApp para o Montinho: só o que a pessoa escolheu, sem dado de saúde. */
export function mensagemHyrox(d: Divisao | null, metaSeg?: number, ritmoSeg?: number): string {
  const partes = ['Olá, Montinho! Usei a calculadora do Hyrox no Guia Fitness Alphaville.'];
  if (d) partes.push(`Categoria: ${rotuloDivisao(d)}.`);
  if (metaSeg) partes.push(`Minha meta é terminar em ${porExtenso(metaSeg)}${ritmoSeg ? `, correndo a ${relogio(ritmoSeg)} por km` : ''}.`);
  partes.push('Quero ajuda para me preparar para a prova.');
  return partes.join(' ');
}
