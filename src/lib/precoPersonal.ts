// Calculadora de preço de personal trainer em Alphaville e região.
// Preço é conta, não texto gerado: tudo roda no navegador, sem servidor.
// As faixas (src/data/preco-personal.json) são REFERÊNCIA EDITORIAL, não pesquisa de preços. Ver docs/calculadora-preco-personal.md.

export type Faixa = [number, number];
export interface Base { nome: string; avulsa: Faixa; mensal: Faixa; online: Faixa }
export interface Local { id: string; nome: string; base: string; motivo?: string }
export interface Dados { bases: Record<string, Base>; locais: Local[]; pacote_frequencias: number[]; sessoes_base_pacote: number }
export type Formato = 'condominio' | 'academia' | 'domicilio' | 'online';
export const FORMATOS: Record<Formato, string> = { condominio: 'No condomínio', academia: 'Na academia', domicilio: 'A domicílio', online: 'Online' };

/** Sessões por mês = vezes por semana × 52 ÷ 12, arredondado (2× ≈ 9, 3× ≈ 13). */
export const sessoesMes = (freq: number) => Math.round((freq * 52) / 12);
/** Arredondamento único: até R$ 1.000, para a dezena; acima, para a cinquentena. */
export const arredonda = (v: number) => (v <= 1000 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50);
export const brl = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
export const faixaTxt = (f: Faixa) => `${brl(f[0])} a ${brl(f[1])}`;

export interface Resultado {
  local: Local; base: Base; fallback: boolean; formato: Formato; freq: number; sessoes: number;
  /** Aula avulsa (dado da referência) e aula dentro do pacote (mensal ÷ sessões-base). Vazios no online. */
  avulsa: Faixa | null; aulaPacote: Faixa | null;
  /** Total por mês. No online, é a mensalidade do acompanhamento, sem multiplicar por sessão. */
  mes: Faixa; extrapolado: boolean;
  memoria: string[];
}

export function calcular(d: Dados, localId: string, formato: Formato, freq: number): Resultado {
  const local = d.locais.find((l) => l.id === localId) ?? d.locais[0];
  const base = d.bases[local.base];
  const fallback = local.base !== local.id && !!local.motivo;
  const f = Math.min(5, Math.max(1, Math.round(freq)));
  const sessoes = sessoesMes(f);
  const origem = fallback ? `referência de ${base.nome} (${local.motivo})` : `referência editorial de ${base.nome}`;
  const memoria: string[] = [`Local: ${local.nome}. Faixa usada: ${origem}.`];
  if (formato === 'online') {
    memoria.push(`Online é mensal, não por sessão: ${faixaTxt(base.online)} por mês, qualquer que seja a frequência.`);
    memoria.push('Arredondamento: a faixa já vem em dezenas; nada a arredondar.');
    return { local, base, fallback, formato, freq: f, sessoes, avulsa: null, aulaPacote: null, mes: base.online, extrapolado: false, memoria };
  }
  const n = d.sessoes_base_pacote;
  const porSessao: Faixa = [base.mensal[0] / n, base.mensal[1] / n];
  const aulaPacote: Faixa = [arredonda(porSessao[0]), arredonda(porSessao[1])];
  const direto = d.pacote_frequencias.includes(f);
  const mes: Faixa = direto ? base.mensal : [arredonda(porSessao[0] * sessoes), arredonda(porSessao[1] * sessoes)];
  memoria.push(`Sessões por mês: ${f} × 52 ÷ 12 = ${((f * 52) / 12).toFixed(1).replace('.', ',')}, arredondado para ${sessoes}.`);
  memoria.push(`Aula avulsa: ${faixaTxt(base.avulsa)} (dado da referência).`);
  memoria.push(`Pacote mensal de referência (2 a 3 vezes por semana): ${faixaTxt(base.mensal)}.`);
  memoria.push(`Aula dentro do pacote: ${brl(base.mensal[0])} ÷ ${n} e ${brl(base.mensal[1])} ÷ ${n} = ${faixaTxt(aulaPacote)} (arredondado).`);
  if (direto) memoria.push(`Total do mês para ${f} vezes por semana: é a própria faixa do pacote, ${faixaTxt(mes)}.`);
  else memoria.push(`Total do mês para ${f} ${f === 1 ? 'vez' : 'vezes'} por semana (extrapolação): aula no pacote sem arredondar × ${sessoes} sessões = ${faixaTxt(mes)}.`);
  memoria.push('Arredondamento: até R$ 1.000, para a dezena; acima, para a cinquentena.');
  memoria.push('A referência não distingue condomínio, academia e domicílio: o formato muda os custos em volta (taxa da academia, deslocamento), listados abaixo do resultado.');
  return { local, base, fallback, formato, freq: f, sessoes, avulsa: base.avulsa, aulaPacote, mes, extrapolado: !direto, memoria };
}
