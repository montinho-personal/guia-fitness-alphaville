// Calculadora de custo para treinar: lógica pura, sem DOM, usada pela página e pelos testes.
// Todos os valores em centavos (inteiros), para não acumular erro de arredondamento.

export const SEMANAS_POR_MES = 52 / 12;

/** Situação de um custo opcional: não se aplica, valor informado ou já incluído em outro item. */
export type Situacao = 'nao' | 'valor' | 'incluido';
export type Periodo = 'semana' | 'mes';

export interface Cenario {
  nome: string;
  /** Acesso: mensalidade recorrente, plano pago à vista (valor total) ou já incluído (condomínio). */
  acessoModo: 'mensal' | 'avista' | 'incluido';
  acessoValor: string;
  /** Meses cobertos pelo pagamento à vista (12 no plano anual). */
  avistaMeses: string;
  freqValor: string;
  freqPeriodo: Periodo;
  /** Matrícula, adesão ou outro custo inicial, cobrado uma vez no primeiro mês. */
  inicial: Situacao;
  inicialValor: string;
  /** Taxa anual (manutenção, anuidade): cobrada no primeiro mês e equivalente a 1/12 por mês. */
  anual: Situacao;
  anualValor: string;
  /** Estacionamento e deslocamento. No modo por ida, o valor é o total de ida e volta. */
  transporte: Situacao;
  transporteModo: 'ida' | 'mes';
  transporteValor: string;
  /** Personal: por mês ou por aula. */
  personal: Situacao;
  personalModo: 'mes' | 'aula';
  personalValor: string;
  personalAulas: string;
  personalAulasPeriodo: Periodo;
  /** Taxa da academia para personal externo. 'incluido' = já está no valor do personal; 'pendente' = o visitante não sabe (não vira zero). */
  taxaExterno: Situacao | 'pendente';
  taxaExternoModo: 'mes' | 'aula' | 'ida';
  taxaExternoValor: string;
}

export const cenarioVazio = (nome = ''): Cenario => ({
  nome, acessoModo: 'mensal', acessoValor: '', avistaMeses: '12', freqValor: '', freqPeriodo: 'semana',
  inicial: 'nao', inicialValor: '', anual: 'nao', anualValor: '',
  transporte: 'nao', transporteModo: 'ida', transporteValor: '',
  personal: 'nao', personalModo: 'mes', personalValor: '', personalAulas: '', personalAulasPeriodo: 'mes',
  taxaExterno: 'nao', taxaExternoModo: 'mes', taxaExternoValor: '',
});

export type Estado = 'ok' | 'zero' | 'incluido' | 'pendente';

export interface Componente {
  chave: string;
  rotulo: string;
  estado: Estado;
  /** Quanto entra no primeiro mês (o que sai do bolso). null = pendente. */
  primeiroMes: number | null;
  /** Equivalente mensal recorrente. null = pendente. */
  mensal: number | null;
  /** Quanto entra no primeiro ano. null = pendente. */
  ano: number | null;
  nota?: string;
}

export interface Erro { campo: string; msg: string }

export interface Resultado {
  idasMes: number | null;
  premissaIdas: string;
  componentes: Componente[];
  erros: Erro[];
  pendencias: string[];
  /** Totais: null quando algum componente necessário está pendente ou há erro. */
  primeiroMes: number | null;
  mensal: number | null;
  porIda: number | null;
  ano: number | null;
  /** Soma parcial do que já foi informado, para mostrar como subtotal identificado. */
  parcial: { primeiroMes: number; mensal: number; ano: number };
  motivoPorIda: string | null;
  temPersonal: boolean;
}

/** Converte texto em reais (aceita vírgula decimal, ponto de milhar e "R$") para centavos. */
export function paraCentavos(txt: string): number | null | 'invalido' {
  let s = String(txt ?? '').replace(/R\$/gi, '').replace(/\s/g, '');
  if (!s) return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return 'invalido';
  return Math.round(parseFloat(s) * 100);
}

/** Converte texto em número (frequência, aulas). Aceita vírgula decimal. */
export function paraNumero(txt: string): number | null | 'invalido' {
  const s = String(txt ?? '').replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  if (!/^-?\d+(\.\d+)?$/.test(s)) return 'invalido';
  return parseFloat(s);
}

const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
/** Formata em reais. O espaço depois de R$ é inseparável, para o valor não quebrar de linha. */
export const reais = (centavos: number) => fmtBRL.format(centavos / 100).replace(/\s/g, '\u00a0');
const fmtNum = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

/** Idas por mês a partir da frequência. Semanal: × 52 ÷ 12. */
export const porMes = (n: number, p: Periodo) => (p === 'semana' ? n * SEMANAS_POR_MES : n);

export function calcular(c: Cenario): Resultado {
  const erros: Erro[] = [];
  const pend: string[] = [];
  const comps: Componente[] = [];

  const dinheiro = (campo: string, txt: string, rotulo: string): number | null => {
    const v = paraCentavos(txt);
    if (v === 'invalido') { erros.push({ campo, msg: `${rotulo}: use só números, como 149,90.` }); return null; }
    if (v !== null && v < 0) { erros.push({ campo, msg: `${rotulo}: o valor não pode ser negativo.` }); return null; }
    return v;
  };
  const numero = (campo: string, txt: string, rotulo: string, max: number): number | null => {
    const v = paraNumero(txt);
    if (v === 'invalido') { erros.push({ campo, msg: `${rotulo}: use só números.` }); return null; }
    if (v !== null && v < 0) { erros.push({ campo, msg: `${rotulo}: não pode ser negativo.` }); return null; }
    if (v !== null && v > max) { erros.push({ campo, msg: `${rotulo}: confira o número (máximo ${max}).` }); return null; }
    return v;
  };

  // Frequência
  const fv = numero('freqValor', c.freqValor, 'Frequência', c.freqPeriodo === 'semana' ? 14 : 62);
  const idasMes = fv === null ? null : porMes(fv, c.freqPeriodo);
  const premissaIdas = fv === null ? 'Informe quantas vezes vai treinar.'
    : c.freqPeriodo === 'semana' ? `${fmtNum(fv)} por semana × 52 semanas ÷ 12 meses ≈ ${fmtNum(idasMes!)} idas por mês`
    : `${fmtNum(fv)} idas por mês, como informado`;
  if (fv === null) pend.push('Frequência de treino');

  // Acesso
  if (c.acessoModo === 'incluido') {
    comps.push({ chave: 'acesso', rotulo: 'Acesso (já incluído, como no condomínio)', estado: 'incluido', primeiroMes: 0, mensal: 0, ano: 0 });
  } else {
    const v = dinheiro('acessoValor', c.acessoValor, c.acessoModo === 'avista' ? 'Valor pago à vista' : 'Mensalidade');
    if (c.acessoModo === 'mensal') {
      if (v === null) { pend.push('Mensalidade'); comps.push({ chave: 'acesso', rotulo: 'Mensalidade', estado: 'pendente', primeiroMes: null, mensal: null, ano: null }); }
      else comps.push({ chave: 'acesso', rotulo: 'Mensalidade', estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: v, ano: v * 12 });
    } else {
      const meses = numero('avistaMeses', c.avistaMeses, 'Meses do plano', 36);
      if (v === null || !meses) {
        pend.push(v === null ? 'Valor do plano pago à vista' : 'Meses cobertos pelo plano');
        comps.push({ chave: 'acesso', rotulo: 'Plano pago à vista', estado: 'pendente', primeiroMes: v, mensal: null, ano: null });
      } else {
        // O valor sai inteiro no primeiro mês e entra uma vez no ano (se o plano cobre 12 meses ou mais).
        const mensal = Math.round(v / meses);
        const ano = meses >= 12 ? v : v * Math.ceil(12 / meses);
        comps.push({ chave: 'acesso', rotulo: `Plano de ${fmtNum(meses)} meses pago à vista`, estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal, ano,
          nota: `${reais(v)} no primeiro mês, equivalente a ${reais(mensal)} por mês.${meses > 12 ? ' No primeiro ano entra o valor inteiro, porque é pago de uma vez.' : meses < 12 ? ` No ano, entra ${Math.ceil(12 / meses)} vezes.` : ''}` });
      }
    }
  }

  const extra = (s: Situacao, chave: string, rotulo: string, calc: () => Componente | null) => {
    if (s === 'nao') return;
    if (s === 'incluido') { comps.push({ chave, rotulo: `${rotulo} (já incluído)`, estado: 'incluido', primeiroMes: 0, mensal: 0, ano: 0 }); return; }
    const r = calc();
    if (r) comps.push(r);
  };

  // Custo inicial (matrícula, adesão)
  extra(c.inicial, 'inicial', 'Matrícula ou adesão', () => {
    const v = dinheiro('inicialValor', c.inicialValor, 'Matrícula ou adesão');
    if (v === null) { pend.push('Matrícula ou adesão'); return { chave: 'inicial', rotulo: 'Matrícula ou adesão', estado: 'pendente', primeiroMes: null, mensal: 0, ano: null }; }
    return { chave: 'inicial', rotulo: 'Matrícula ou adesão', estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: 0, ano: v, nota: 'Cobrada uma vez: entra no primeiro mês e no ano, não no mês típico.' };
  });

  // Taxa anual
  extra(c.anual, 'anual', 'Taxa anual', () => {
    const v = dinheiro('anualValor', c.anualValor, 'Taxa anual');
    if (v === null) { pend.push('Taxa anual'); return { chave: 'anual', rotulo: 'Taxa anual', estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
    const m = Math.round(v / 12);
    return { chave: 'anual', rotulo: 'Taxa anual', estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: m, ano: v, nota: `Considerada cobrada no primeiro mês; no mês típico entra como ${reais(m)} (1/12).` };
  });

  // Estacionamento e deslocamento
  extra(c.transporte, 'transporte', 'Estacionamento e deslocamento', () => {
    const v = dinheiro('transporteValor', c.transporteValor, 'Estacionamento e deslocamento');
    const rot = c.transporteModo === 'ida' ? 'Estacionamento e deslocamento (por ida, ida e volta)' : 'Estacionamento e deslocamento (por mês)';
    if (v === null) { pend.push('Estacionamento e deslocamento'); return { chave: 'transporte', rotulo: rot, estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
    if (c.transporteModo === 'mes') return { chave: 'transporte', rotulo: rot, estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: v, ano: v * 12 };
    if (idasMes === null) { pend.push('Frequência (para calcular o estacionamento por ida)'); return { chave: 'transporte', rotulo: rot, estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
    const m = Math.round(v * idasMes);
    return { chave: 'transporte', rotulo: rot, estado: v === 0 ? 'zero' : 'ok', primeiroMes: m, mensal: m, ano: m * 12, nota: `${reais(v)} × ${fmtNum(idasMes)} idas.` };
  });

  // Personal
  let aulasMes: number | null = null;
  if (c.personal !== 'nao' && String(c.personalAulas ?? '').trim()) {
    const a = numero('personalAulas', c.personalAulas, 'Aulas com personal', c.personalAulasPeriodo === 'semana' ? 14 : 62);
    if (a !== null) aulasMes = porMes(a, c.personalAulasPeriodo);
  }
  extra(c.personal, 'personal', 'Personal', () => {
    const v = dinheiro('personalValor', c.personalValor, c.personalModo === 'aula' ? 'Valor por aula de personal' : 'Personal por mês');
    if (c.personalModo === 'mes') {
      if (v === null) { pend.push('Valor do personal'); return { chave: 'personal', rotulo: 'Personal (por mês)', estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
      return { chave: 'personal', rotulo: 'Personal (por mês)', estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: v, ano: v * 12 };
    }
    if (v === null || aulasMes === null) {
      pend.push(v === null ? 'Valor por aula de personal' : 'Quantidade de aulas com personal');
      return { chave: 'personal', rotulo: 'Personal (por aula)', estado: 'pendente', primeiroMes: null, mensal: null, ano: null };
    }
    const m = Math.round(v * aulasMes);
    return { chave: 'personal', rotulo: 'Personal (por aula)', estado: v === 0 ? 'zero' : 'ok', primeiroMes: m, mensal: m, ano: m * 12, nota: `${reais(v)} × ${fmtNum(aulasMes)} aulas por mês.` };
  });
  if (aulasMes !== null && idasMes !== null && aulasMes > idasMes + 1e-9) {
    erros.push({ campo: 'personalAulas', msg: `Aulas com personal (${fmtNum(aulasMes)} por mês) não podem passar do total de idas (${fmtNum(idasMes)} por mês).` });
  }

  // Taxa de personal externo
  if (c.personal !== 'nao' && c.taxaExterno === 'pendente') {
    pend.push('Taxa de personal externo (a confirmar com a academia)');
    comps.push({ chave: 'taxaExterno', rotulo: 'Taxa de personal externo (a confirmar)', estado: 'pendente', primeiroMes: null, mensal: null, ano: null });
  } else if (c.personal !== 'nao') {
    extra(c.taxaExterno as Situacao, 'taxaExterno', 'Taxa de personal externo', () => {
      const v = dinheiro('taxaExternoValor', c.taxaExternoValor, 'Taxa de personal externo');
      const rot = `Taxa de personal externo (${c.taxaExternoModo === 'aula' ? 'por aula' : c.taxaExternoModo === 'ida' ? 'por ida' : 'por mês'})`;
      if (v === null) { pend.push('Taxa de personal externo'); return { chave: 'taxaExterno', rotulo: rot, estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
      if (c.taxaExternoModo === 'mes') return { chave: 'taxaExterno', rotulo: rot, estado: v === 0 ? 'zero' : 'ok', primeiroMes: v, mensal: v, ano: v * 12 };
      const base = c.taxaExternoModo === 'ida' ? idasMes : aulasMes;
      if (base === null) { pend.push(c.taxaExternoModo === 'ida' ? 'Frequência (para a taxa por ida)' : 'Quantidade de aulas com personal (para a taxa por aula)'); return { chave: 'taxaExterno', rotulo: rot, estado: 'pendente', primeiroMes: null, mensal: null, ano: null }; }
      const m = Math.round(v * base);
      return { chave: 'taxaExterno', rotulo: rot, estado: v === 0 ? 'zero' : 'ok', primeiroMes: m, mensal: m, ano: m * 12, nota: `${reais(v)} × ${fmtNum(base)} ${c.taxaExternoModo === 'ida' ? 'idas' : 'aulas'} por mês.` };
    });
  }

  const soma = (k: 'primeiroMes' | 'mensal' | 'ano') => {
    const parcial = comps.reduce((t, x) => t + (x[k] ?? 0), 0);
    const completo = !erros.length && comps.every((x) => x[k] !== null);
    return { parcial, total: completo ? parcial : null };
  };
  const pm = soma('primeiroMes'), me = soma('mensal'), an = soma('ano');

  let porIda: number | null = null, motivo: string | null = null;
  if (erros.length) motivo = 'Corrija os campos indicados.';
  else if (idasMes === null) motivo = 'Falta informar a frequência de treino.';
  else if (idasMes === 0) motivo = 'Com frequência zero, não há custo por ida.';
  else if (me.total === null) motivo = 'Falta informar um custo do mês típico.';
  else porIda = Math.round(me.total / idasMes);

  return {
    idasMes, premissaIdas, componentes: comps, erros, pendencias: [...new Set(pend)],
    primeiroMes: pm.total, mensal: me.total, porIda, ano: an.total,
    parcial: { primeiroMes: pm.parcial, mensal: me.parcial, ano: an.parcial },
    motivoPorIda: motivo, temPersonal: c.personal !== 'nao',
  };
}

export type Criterio = 'primeiroMes' | 'mensal' | 'porIda' | 'ano';
export const CRITERIOS: Record<Criterio, string> = { primeiroMes: 'primeiro mês', mensal: 'mês típico', porIda: 'custo por treino', ano: 'primeiro ano' };

/** Índices dos cenários mais baratos no critério, comparando só os completos. Exige ao menos dois completos. */
export function maisBarato(rs: Resultado[], criterio: Criterio): { indices: number[]; comparados: number } {
  const validos = rs.map((r, i) => ({ i, v: r[criterio] })).filter((x): x is { i: number; v: number } => x.v !== null);
  if (validos.length < 2) return { indices: [], comparados: validos.length };
  const min = Math.min(...validos.map((x) => x.v));
  return { indices: validos.filter((x) => x.v === min).map((x) => x.i), comparados: validos.length };
}

// ---------- Planos publicados nas fichas ----------

export interface PlanoFicha { nome: string; centavos: number; inicial: number | null; condicoes: string }

/** Lê os planos mensais de uma ficha. Só entram planos cobrados por mês; diária, pacote e aula avulsa ficam de fora. */
export function planosMensais(planos: { nome: string; preco: string; condicoes: string }[]): PlanoFicha[] {
  return planos.filter((p) => /\/\s*m[eê]s/i.test(p.preco)).map((p) => {
    const v = paraCentavos(p.preco.replace(/\/.*$/, ''));
    const m = p.condicoes.match(/(?:ades[aã]o|matr[ií]cula(?: [úu]nica)?) de (R\$\s?[\d.,]+)/i);
    const gratis = /ades[aã]o gr[aá]tis|sem taxa de ades[aã]o|sem ades[aã]o/i.test(p.condicoes);
    const ini = m ? paraCentavos(m[1].replace(/[.,]$/, '')) : gratis ? 0 : null;
    return { nome: p.nome, centavos: typeof v === 'number' ? v : 0, inicial: typeof ini === 'number' ? ini : null, condicoes: p.condicoes };
  }).filter((p) => p.centavos > 0);
}
