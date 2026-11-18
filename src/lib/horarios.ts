// Motor do buscador "Academias abertas aos domingos e 24h em Alphaville".
// Lógica pura (sem Astro): a página, as fichas e os testes usam as mesmas funções.
// Convenções dos dados (src/data/academias/<id>.yaml):
// - horario.<dia>: faixas "HH:MM-HH:MM". "23:59" no fim = fecha à meia-noite. Fim menor que o início = atravessa a meia-noite.
// - horario.<dia> vazio: "sem horário listado". Só vale como fechado com horario_status.<dia> = 'fechado'.
// - horario_status.<dia> = 'a-confirmar': dia sem informação confiável, mesmo que haja faixas.
// - ultima_entrada.<dia>: limite de entrada publicado, separado do fechamento.
// - horario_feriados: grade oficial genérica de feriados ("horário padrão de feriados"), nunca resultado confirmado.
// - horario_excecoes: horário oficial de uma data (feriado, fechamento temporário); prevalece sobre tudo.
// Datas em "YYYY-MM-DD", interpretadas no fuso America/Sao_Paulo (a página calcula "hoje" nesse fuso).

export const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const;
export type Dia = (typeof DIAS)[number];

export interface Excecao { data: string; faixas: string[]; situacao: 'confirmada' | 'a-confirmar'; motivo: string; fonte?: string; url?: string; conferido_em?: string }
export interface UnidadeHorario {
  horario: Record<Dia, string[]>;
  horario_status?: Partial<Record<Dia, 'fechado' | 'a-confirmar'>>;
  ultima_entrada?: Partial<Record<Dia, string>>;
  horario_feriados?: { faixas: string[] } | null;
  horario_excecoes?: Excecao[];
  municipio: string;
}
export interface Feriado { data: string; nome: string; abrangencia: 'nacional' | 'estadual' | 'municipal'; municipio?: string }

export type SituacaoDia =
  | { tipo: 'aberta'; faixas: [number, number][]; origem: 'semana' | 'excecao'; entrada?: number; feriado?: string }
  | { tipo: 'fechada'; origem: 'semana' | 'excecao'; feriado?: string }
  | { tipo: 'a-confirmar'; motivo: 'sem-horario' | 'feriado-padrao' | 'feriado-sem-horario' | 'excecao-a-confirmar'; faixas?: [number, number][]; feriado?: string };

export const min = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
/** Faixa em minutos do dia; fim "23:59" vira 1440; fim antes do início atravessa a meia-noite (fim + 1440). */
export function faixaMin(f: string): [number, number] {
  const [a, b] = f.split('-');
  const ini = min(a); let fim = b === '23:59' ? 1440 : min(b);
  if (fim <= ini) fim += 1440;
  return [ini, fim];
}
/** 0..6 = seg..dom, sem depender do fuso de quem roda (a data já é a data local da região). */
export function diaDaSemana(data: string): Dia {
  const [y, m, d] = data.split('-').map(Number);
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = domingo
  return DIAS[(w + 6) % 7];
}
export function somaDias(data: string, n: number): string {
  const [y, m, d] = data.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}
export const feriadoDe = (data: string, municipio: string, feriados: Feriado[]) =>
  feriados.find((f) => f.data === data && (f.abrangencia !== 'municipal' || f.municipio === municipio));

/** Como a unidade funciona numa data: exceção da data > feriado (padrão ou a confirmar) > grade semanal. */
export function situacaoNoDia(u: UnidadeHorario, data: string, feriados: Feriado[]): SituacaoDia {
  const dia = diaDaSemana(data);
  const fer = feriadoDe(data, u.municipio, feriados)?.nome;
  const ex = (u.horario_excecoes ?? []).find((e) => e.data === data);
  if (ex) {
    if (ex.situacao !== 'confirmada') return { tipo: 'a-confirmar', motivo: 'excecao-a-confirmar', faixas: ex.faixas.map(faixaMin), feriado: fer };
    return ex.faixas.length ? { tipo: 'aberta', faixas: ex.faixas.map(faixaMin), origem: 'excecao', feriado: fer } : { tipo: 'fechada', origem: 'excecao', feriado: fer };
  }
  if (fer) {
    return u.horario_feriados
      ? { tipo: 'a-confirmar', motivo: 'feriado-padrao', faixas: u.horario_feriados.faixas.map(faixaMin), feriado: fer }
      : { tipo: 'a-confirmar', motivo: 'feriado-sem-horario', feriado: fer };
  }
  const st = u.horario_status?.[dia];
  const fx = u.horario[dia] ?? [];
  if (st === 'a-confirmar') return { tipo: 'a-confirmar', motivo: 'sem-horario' };
  if (!fx.length) return st === 'fechado' ? { tipo: 'fechada', origem: 'semana' } : { tipo: 'a-confirmar', motivo: 'sem-horario' };
  const ue = u.ultima_entrada?.[dia];
  return { tipo: 'aberta', faixas: fx.map(faixaMin), origem: 'semana', entrada: ue ? min(ue) : undefined };
}

export type Resultado =
  | { tipo: 'compativel'; fecha: number; termina: number; entrada?: number; horarioDia: [number, number][]; feriado?: string }
  | { tipo: 'incompativel'; motivo: 'fechada' | 'fecha-antes' | 'ainda-fechada' | 'intervalo' | 'entrada'; fecha?: number; abre?: number; entrada?: number; horarioDia: [number, number][]; feriado?: string }
  | { tipo: 'a-confirmar'; motivo: string; faixas?: [number, number][]; feriado?: string };

const MOTIVO_TXT: Record<string, string> = {
  'sem-horario': 'Horário deste dia a confirmar',
  'feriado-padrao': 'Horário padrão de feriados; a data precisa de confirmação',
  'feriado-sem-horario': 'Horário do feriado a confirmar',
  'excecao-a-confirmar': 'Horário especial da data a confirmar',
};
export const textoMotivo = (m: string) => MOTIVO_TXT[m] ?? 'Horário a confirmar';

/**
 * A janela [inicio, inicio + duracao) cabe num período contínuo de funcionamento confirmado?
 * inicio em minutos desde 00:00 da data. Considera faixas da véspera que atravessam a meia-noite,
 * a continuidade com o dia seguinte e a última entrada publicada.
 */
export function avaliar(u: UnidadeHorario, data: string, inicio: number, duracao: number, feriados: Feriado[]): Resultado {
  const fim = inicio + duracao;
  const hoje = situacaoNoDia(u, data, feriados);
  const ontem = situacaoNoDia(u, somaDias(data, -1), feriados);
  const amanha = situacaoNoDia(u, somaDias(data, 1), feriados);
  const fer = 'feriado' in hoje ? hoje.feriado : undefined;
  // Linha do tempo em minutos a partir de 00:00 da data: véspera (-1440), hoje (0), amanhã (+1440).
  const iv: [number, number, 'ontem' | 'hoje' | 'amanha'][] = [];
  if (ontem.tipo === 'aberta') ontem.faixas.forEach(([a, b]) => iv.push([a - 1440, b - 1440, 'ontem']));
  if (hoje.tipo === 'aberta') hoje.faixas.forEach(([a, b]) => iv.push([a, b, 'hoje']));
  if (amanha.tipo === 'aberta') amanha.faixas.forEach(([a, b]) => iv.push([a + 1440, b + 1440, 'amanha']));
  const horarioDia = hoje.tipo === 'aberta' ? hoje.faixas : [];
  // O início cai num trecho coberto pela véspera (faixa que atravessou a meia-noite)?
  const cobreInicioPelaVespera = iv.some(([a, b, o]) => o === 'ontem' && a <= inicio && inicio < b);
  if (hoje.tipo === 'a-confirmar' && !cobreInicioPelaVespera) return { tipo: 'a-confirmar', motivo: hoje.motivo, faixas: hoje.faixas, feriado: fer };
  if (hoje.tipo === 'fechada' && !cobreInicioPelaVespera) return { tipo: 'incompativel', motivo: 'fechada', horarioDia, feriado: fer };
  // Junta faixas contíguas (fim de uma = início da outra) num período contínuo.
  const ord = iv.map(([a, b]) => [a, b] as [number, number]).sort((x, y) => x[0] - y[0]);
  const blocos: [number, number][] = [];
  for (const [a, b] of ord) { const u0 = blocos[blocos.length - 1]; if (u0 && a <= u0[1]) u0[1] = Math.max(u0[1], b); else blocos.push([a, b]); }
  const bloco = blocos.find(([a, b]) => a <= inicio && inicio < b);
  if (!bloco) {
    const prox = blocos.find(([a]) => a > inicio && a < 1440);
    const ant = blocos.filter(([, b]) => b <= inicio && b > 0).pop();
    return prox && ant ? { tipo: 'incompativel', motivo: 'intervalo', abre: prox[0], fecha: ant[1], horarioDia, feriado: fer }
      : prox ? { tipo: 'incompativel', motivo: 'ainda-fechada', abre: prox[0], horarioDia, feriado: fer }
      : { tipo: 'incompativel', motivo: ant ? 'fecha-antes' : 'fechada', fecha: ant?.[1], horarioDia, feriado: fer };
  }
  // A janela passa da meia-noite e o dia seguinte não está confirmado: não dá para afirmar.
  if (fim > 1440 && bloco[1] >= 1440 && amanha.tipo === 'a-confirmar' && bloco[1] === 1440) return { tipo: 'a-confirmar', motivo: amanha.motivo, feriado: amanha.feriado };
  const entrada = hoje.tipo === 'aberta' ? hoje.entrada : undefined;
  if (entrada !== undefined && inicio > entrada) return { tipo: 'incompativel', motivo: 'entrada', entrada, fecha: bloco[1], horarioDia, feriado: fer };
  if (fim > bloco[1]) return { tipo: 'incompativel', motivo: 'fecha-antes', fecha: bloco[1], horarioDia, feriado: fer };
  return { tipo: 'compativel', fecha: bloco[1], termina: fim, entrada, horarioDia, feriado: fer };
}

/** 24h todos os dias: as sete grades com 00:00-23:59, sem dia a confirmar. */
export function e24hTodos(u: Pick<UnidadeHorario, 'horario' | 'horario_status'>): boolean {
  return DIAS.every((d) => u.horario_status?.[d] !== 'a-confirmar' && u.horario[d]?.length === 1 && u.horario[d][0] === '00:00-23:59');
}
/** Dias com 24h, para quando não são os sete ("24h de seg a sex"). */
export const dias24h = (u: Pick<UnidadeHorario, 'horario' | 'horario_status'>) =>
  DIAS.filter((d) => u.horario_status?.[d] !== 'a-confirmar' && u.horario[d]?.some((f) => f === '00:00-23:59'));

/** "6h", "13h30", "meia-noite"; minutos além de 1440 voltam ao relógio ("1h" do dia seguinte). */
export function hora(m: number): string {
  if (m === 1440) return 'meia-noite';
  const t = ((m % 1440) + 1440) % 1440, h = Math.floor(t / 60), mm = t % 60;
  return mm ? `${h}h${String(mm).padStart(2, '0')}` : `${h}h`;
}
export const faixasTexto = (fx: [number, number][]) => fx.map(([a, b]) => (a <= 0 && b >= 1440 ? '24 horas' : `${hora(a)} às ${hora(b)}`)).join(' e ');
