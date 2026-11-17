// Política de personal externo: leitura única da ficha, usada pelo guia, pela ficha e pela calculadora.
// Fonte dos dados: campo personal_externo de src/data/academias/<id>.yaml (ver docs/personal-externo.md).

export type StatusPE = 'aceita' | 'aceita-com-condicoes' | 'nao-aceita' | 'a-confirmar';
export interface TaxaPE { situacao: 'confirmada' | 'sem-taxa' | 'pendente'; valor?: string; centavos?: number; quem_paga?: 'aluno' | 'profissional'; periodicidade?: 'mes' | 'aula' | 'ida'; condicoes?: string }
export interface PoliticaPE {
  status: StatusPE; condicoes: string[]; taxa: TaxaPE; abrangencia: 'unidade' | 'rede' | null;
  fonte: string | null; url: string | null; conferido: Date | null; canal: string | null; nota: string | null;
}

export const STATUS_PE: Record<StatusPE, { rotulo: string; curto: string; ordem: number }> = {
  aceita: { rotulo: 'Aceita personal externo', curto: 'Aceita', ordem: 0 },
  'aceita-com-condicoes': { rotulo: 'Aceita, com condições', curto: 'Aceita com condições', ordem: 1 },
  'nao-aceita': { rotulo: 'Não aceita personal externo', curto: 'Não aceita', ordem: 2 },
  'a-confirmar': { rotulo: 'A confirmar com a unidade', curto: 'A confirmar', ordem: 3 },
};

/** Normaliza o campo da ficha. Sem campo: a confirmar, taxa pendente. */
export function politicaPE(pe: any | undefined): PoliticaPE {
  if (!pe) return { status: 'a-confirmar', condicoes: [], taxa: { situacao: 'pendente' }, abrangencia: null, fonte: null, url: null, conferido: null, canal: null, nota: null };
  return { status: pe.status, condicoes: pe.condicoes ?? [], taxa: pe.taxa, abrangencia: pe.abrangencia ?? null, fonte: pe.fonte ?? null, url: pe.url ?? null, conferido: pe.conferido_em ?? null, canal: pe.canal ?? null, nota: pe.nota ?? null };
}

const PER: Record<string, string> = { mes: 'por mês', aula: 'por aula', ida: 'por ida' };

/** Respostas curtas às quatro perguntas do visitante. */
export function respostasPE(p: PoliticaPE) {
  const posso = p.status === 'aceita' ? 'Sim.' : p.status === 'aceita-com-condicoes' ? 'Sim, com condições.' : p.status === 'nao-aceita' ? 'Não. A unidade não permite personal de fora.' : 'Ainda não confirmado. Pergunte na unidade antes de contratar.';
  const antes = p.condicoes.length ? p.condicoes : p.status === 'a-confirmar' ? ['Confirme com a unidade se aceita personal externo e como funciona o cadastro.'] : p.status === 'nao-aceita' ? ['Não se aplica.'] : ['A fonte não cita cadastro ou outra exigência; confirme na recepção.'];
  const t = p.taxa;
  let taxa: string;
  if (p.status === 'nao-aceita') taxa = 'Não se aplica.';
  else if (t.situacao === 'sem-taxa') taxa = 'Sem taxa, segundo a fonte.';
  else if (t.situacao === 'confirmada') {
    const quem = t.quem_paga === 'profissional' ? 'Paga o profissional' : t.quem_paga === 'aluno' ? 'Paga o aluno' : 'Quem paga não é informado';
    taxa = `Tem taxa${t.valor ? ` de ${t.valor}` : ', valor não publicado'}${t.periodicidade ? ` ${PER[t.periodicidade]}` : ''}. ${quem}.${t.condicoes ? ` ${t.condicoes}` : ''}`;
  } else taxa = p.status === 'a-confirmar' ? 'A confirmar.' : 'Taxa não informada pela fonte: pergunte na unidade.';
  return { posso, antes, taxa };
}

/** Preenchimento da calculadora a partir da política. Só preenche valor confirmado e pago pelo aluno. */
export function prefillTaxa(p: PoliticaPE): { taxaExterno: 'nao' | 'valor' | 'pendente'; taxaExternoModo?: 'mes' | 'aula' | 'ida'; taxaExternoValor?: string; nota: string } {
  const t = p.taxa;
  if (p.status === 'nao-aceita') return { taxaExterno: 'pendente', nota: 'Esta unidade não aceita personal externo, segundo a fonte.' };
  if (t.situacao === 'sem-taxa') return { taxaExterno: 'nao', nota: 'Sem taxa de personal externo, segundo a fonte.' };
  if (t.situacao === 'confirmada' && t.quem_paga === 'profissional') return { taxaExterno: 'nao', nota: 'A taxa é paga pelo profissional à academia e não entra no seu custo; ela pode estar embutida no valor que ele cobra.' };
  if (t.situacao === 'confirmada' && t.quem_paga === 'aluno' && typeof t.centavos === 'number' && t.periodicidade) {
    return { taxaExterno: 'valor', taxaExternoModo: t.periodicidade, taxaExternoValor: (t.centavos / 100).toFixed(2).replace('.', ',').replace(/,00$/, ''), nota: `Taxa preenchida pela fonte: ${t.valor} ${PER[t.periodicidade]}, paga pelo aluno.${t.condicoes ? ` ${t.condicoes}` : ''}` };
  }
  return { taxaExterno: 'pendente', nota: p.status === 'a-confirmar' ? 'A política de personal externo desta unidade ainda não foi confirmada.' : `A taxa ainda não foi confirmada${t.condicoes ? ` (${t.condicoes})` : ''}. Se você souber, informe o valor.` };
}
