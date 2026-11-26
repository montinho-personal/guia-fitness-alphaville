// Simulador "treino na academia do condomínio": a pessoa marca o que o espaço tem e vê
// quais movimentos dá para treinar, o que falta e um esqueleto da semana.
// Regras editoriais do guia (determinísticas, no navegador). Não é prescrição: não define carga, séries nem repetições.
// Doc: docs/treino-condominio.md.

export type EquipId = 'halteres' | 'banco' | 'barra-fixa' | 'polia' | 'barra' | 'rack' | 'maquinas-perna' | 'kettlebell' | 'elasticos' | 'fita' | 'colchonete' | 'step' | 'esteira' | 'bicicleta' | 'eliptico' | 'corda';
export type PadraoId = 'empurrar' | 'puxar' | 'agachar' | 'quadril' | 'core' | 'cardio';

export const EQUIPAMENTOS: { id: EquipId; nome: string; grupo: 'Pesos livres' | 'Aparelhos' | 'Acessórios' | 'Cardio'; ajuda?: string }[] = [
  { id: 'halteres', nome: 'Halteres', grupo: 'Pesos livres', ajuda: 'um par ou vários pesos' },
  { id: 'banco', nome: 'Banco', grupo: 'Pesos livres', ajuda: 'reto ou regulável' },
  { id: 'barra', nome: 'Barra e anilhas', grupo: 'Pesos livres' },
  { id: 'rack', nome: 'Suporte ou gaiola de agachamento', grupo: 'Pesos livres' },
  { id: 'kettlebell', nome: 'Kettlebell', grupo: 'Pesos livres' },
  { id: 'polia', nome: 'Estação com polia e cabos', grupo: 'Aparelhos', ajuda: 'multiestação, crossover ou puxador' },
  { id: 'maquinas-perna', nome: 'Aparelhos de perna', grupo: 'Aparelhos', ajuda: 'leg press, cadeira extensora ou mesa flexora' },
  { id: 'barra-fixa', nome: 'Barra fixa', grupo: 'Aparelhos' },
  { id: 'elasticos', nome: 'Elásticos', grupo: 'Acessórios', ajuda: 'faixas ou tubos' },
  { id: 'fita', nome: 'Fita de suspensão', grupo: 'Acessórios', ajuda: 'tipo TRX' },
  { id: 'colchonete', nome: 'Colchonete', grupo: 'Acessórios' },
  { id: 'step', nome: 'Step ou caixote', grupo: 'Acessórios' },
  { id: 'esteira', nome: 'Esteira', grupo: 'Cardio' },
  { id: 'bicicleta', nome: 'Bicicleta ergométrica', grupo: 'Cardio' },
  { id: 'eliptico', nome: 'Elíptico', grupo: 'Cardio' },
  { id: 'corda', nome: 'Corda de pular', grupo: 'Cardio' },
];
export const NOME_EQUIP = Object.fromEntries(EQUIPAMENTOS.map((e) => [e.id, e.nome])) as Record<EquipId, string>;

export const PADROES: { id: PadraoId; nome: string; treina: string }[] = [
  { id: 'empurrar', nome: 'Empurrar', treina: 'peito, ombros e tríceps' },
  { id: 'puxar', nome: 'Puxar', treina: 'costas e bíceps' },
  { id: 'agachar', nome: 'Agachar', treina: 'coxas e glúteos' },
  { id: 'quadril', nome: 'Levantar do chão', treina: 'posterior de coxa, glúteos e lombar' },
  { id: 'core', nome: 'Abdômen e tronco', treina: 'abdômen e estabilidade' },
  { id: 'cardio', nome: 'Cardio', treina: 'fôlego e resistência' },
];
export const NOME_PADRAO = Object.fromEntries(PADROES.map((p) => [p.id, p.nome])) as Record<PadraoId, string>;

/** q: 2 = dá para aumentar a carga com o tempo; 1 = adaptação (peso do corpo, elástico), serve mas tem teto. */
export interface Exercicio { nome: string; padrao: PadraoId; requer: EquipId[]; q: 1 | 2 }
export const EXERCICIOS: Exercicio[] = [
  // Empurrar
  { nome: 'Supino com halteres no banco', padrao: 'empurrar', requer: ['halteres', 'banco'], q: 2 },
  { nome: 'Desenvolvimento de ombros com halteres', padrao: 'empurrar', requer: ['halteres'], q: 2 },
  { nome: 'Supino com barra', padrao: 'empurrar', requer: ['barra', 'banco', 'rack'], q: 2 },
  { nome: 'Peitoral na polia', padrao: 'empurrar', requer: ['polia'], q: 2 },
  { nome: 'Tríceps na polia', padrao: 'empurrar', requer: ['polia'], q: 2 },
  { nome: 'Supino com halteres deitado no chão', padrao: 'empurrar', requer: ['halteres'], q: 2 },
  { nome: 'Desenvolvimento com kettlebell', padrao: 'empurrar', requer: ['kettlebell'], q: 2 },
  { nome: 'Flexão de braços na fita', padrao: 'empurrar', requer: ['fita'], q: 1 },
  { nome: 'Flexão de braços com elástico nas costas', padrao: 'empurrar', requer: ['elasticos'], q: 1 },
  { nome: 'Mergulho no banco', padrao: 'empurrar', requer: ['banco'], q: 1 },
  { nome: 'Flexão de braços', padrao: 'empurrar', requer: [], q: 1 },
  // Puxar
  { nome: 'Remada com halter apoiado no banco', padrao: 'puxar', requer: ['halteres', 'banco'], q: 2 },
  { nome: 'Puxada alta na polia', padrao: 'puxar', requer: ['polia'], q: 2 },
  { nome: 'Barra fixa', padrao: 'puxar', requer: ['barra-fixa'], q: 2 },
  { nome: 'Remada curvada com halteres', padrao: 'puxar', requer: ['halteres'], q: 2 },
  { nome: 'Remada baixa na polia', padrao: 'puxar', requer: ['polia'], q: 2 },
  { nome: 'Remada curvada com barra', padrao: 'puxar', requer: ['barra'], q: 2 },
  { nome: 'Remada com kettlebell', padrao: 'puxar', requer: ['kettlebell'], q: 2 },
  { nome: 'Remada na fita de suspensão', padrao: 'puxar', requer: ['fita'], q: 1 },
  { nome: 'Remada com elástico', padrao: 'puxar', requer: ['elasticos'], q: 1 },
  // Agachar
  { nome: 'Agachamento com halter junto ao peito', padrao: 'agachar', requer: ['halteres'], q: 2 },
  { nome: 'Leg press ou cadeira extensora', padrao: 'agachar', requer: ['maquinas-perna'], q: 2 },
  { nome: 'Agachamento com barra', padrao: 'agachar', requer: ['barra', 'rack'], q: 2 },
  { nome: 'Agachamento búlgaro com halteres', padrao: 'agachar', requer: ['halteres', 'banco'], q: 2 },
  { nome: 'Avanço com halteres', padrao: 'agachar', requer: ['halteres'], q: 2 },
  { nome: 'Agachamento com kettlebell junto ao peito', padrao: 'agachar', requer: ['kettlebell'], q: 2 },
  { nome: 'Subida no step', padrao: 'agachar', requer: ['step'], q: 1 },
  { nome: 'Agachamento com elástico', padrao: 'agachar', requer: ['elasticos'], q: 1 },
  { nome: 'Agachamento e avanço com o peso do corpo', padrao: 'agachar', requer: [], q: 1 },
  // Levantar do chão (dobradiça de quadril)
  { nome: 'Levantamento terra romeno com halteres', padrao: 'quadril', requer: ['halteres'], q: 2 },
  { nome: 'Elevação de quadril com halter, apoiado no banco', padrao: 'quadril', requer: ['halteres', 'banco'], q: 2 },
  { nome: 'Levantamento terra com barra', padrao: 'quadril', requer: ['barra'], q: 2 },
  { nome: 'Mesa flexora', padrao: 'quadril', requer: ['maquinas-perna'], q: 2 },
  { nome: 'Balanço com kettlebell', padrao: 'quadril', requer: ['kettlebell'], q: 2 },
  { nome: 'Puxada entre as pernas na polia', padrao: 'quadril', requer: ['polia'], q: 2 },
  { nome: 'Flexão de tronco à frente com elástico', padrao: 'quadril', requer: ['elasticos'], q: 1 },
  { nome: 'Elevação de quadril no chão, uma perna de cada vez', padrao: 'quadril', requer: [], q: 1 },
  // Abdômen e tronco: o peso do corpo já resolve
  { nome: 'Prancha', padrao: 'core', requer: [], q: 2 },
  { nome: 'Abdominal no colchonete', padrao: 'core', requer: ['colchonete'], q: 2 },
  { nome: 'Rotação travada na polia', padrao: 'core', requer: ['polia'], q: 2 },
  { nome: 'Elevação de pernas na barra fixa', padrao: 'core', requer: ['barra-fixa'], q: 2 },
  { nome: 'Caminhada carregando halteres', padrao: 'core', requer: ['halteres'], q: 2 },
  { nome: 'Prancha lateral', padrao: 'core', requer: [], q: 2 },
  // Cardio
  { nome: 'Esteira', padrao: 'cardio', requer: ['esteira'], q: 2 },
  { nome: 'Bicicleta ergométrica', padrao: 'cardio', requer: ['bicicleta'], q: 2 },
  { nome: 'Elíptico', padrao: 'cardio', requer: ['eliptico'], q: 2 },
  { nome: 'Corda de pular', padrao: 'cardio', requer: ['corda'], q: 2 },
  { nome: 'Caminhada ou corrida nas ruas do condomínio', padrao: 'cardio', requer: [], q: 1 },
];

const tem = (ex: Exercicio, eq: Set<EquipId>) => ex.requer.every((r) => eq.has(r));
export const possiveis = (padrao: PadraoId, eq: Set<EquipId>) => EXERCICIOS.filter((e) => e.padrao === padrao && tem(e, eq)).sort((a, b) => b.q - a.q);

export type Nivel = 'bom' | 'adaptado' | 'falta';
export interface Cobertura { padrao: PadraoId; nivel: Nivel; exercicios: string[] }
export const NIVEL_ROTULO: Record<Nivel, string> = { bom: 'Bem coberto', adaptado: 'Dá para adaptar', falta: 'Falta equipamento' };

export function cobertura(eq: Set<EquipId>): Cobertura[] {
  return PADROES.map((p) => { const xs = possiveis(p.id, eq); return { padrao: p.id, nivel: (!xs.length ? 'falta' : xs[0].q === 2 ? 'bom' : 'adaptado') as Nivel, exercicios: xs.slice(0, 4).map((x) => x.nome) }; });
}
const pontos = (c: Cobertura[]) => c.reduce((s, x) => s + (x.nivel === 'bom' ? 2 : x.nivel === 'adaptado' ? 1 : 0), 0);

/** Os equipamentos que, sozinhos, mais melhoram a cobertura (para quem pode pedir ao condomínio ou comprar). */
export function oQueMaisAjuda(eq: Set<EquipId>, max = 2): { id: EquipId; melhora: PadraoId[] }[] {
  const base = cobertura(eq), p0 = pontos(base);
  return EQUIPAMENTOS.filter((e) => !eq.has(e.id)).map((e) => {
    const c = cobertura(new Set([...eq, e.id]));
    return { id: e.id, ganho: pontos(c) - p0, melhora: c.filter((x, i) => x.nivel !== base[i].nivel).map((x) => x.padrao) };
  }).filter((x) => x.ganho > 0).sort((a, b) => b.ganho - a.ganho).slice(0, max).map(({ id, melhora }) => ({ id, melhora }));
}

export type Veredito = 'completo' | 'adaptado' | 'incompleto';
export interface Dia { nome: string; itens: { padrao: PadraoId; exercicio: string | null }[] }
export interface Resultado {
  veredito: Veredito; titulo: string; resumo: string;
  cobertura: Cobertura[]; bons: number; faltam: PadraoId[]; adaptados: PadraoId[];
  avisos: string[]; ajuda: { id: EquipId; melhora: PadraoId[] }[]; semana: Dia[];
}

const MODELOS: Record<number, { nome: string; padroes: PadraoId[] }[]> = {
  2: [{ nome: 'Dia 1 · corpo inteiro', padroes: ['agachar', 'empurrar', 'puxar', 'core'] }, { nome: 'Dia 2 · corpo inteiro', padroes: ['quadril', 'empurrar', 'puxar', 'cardio'] }],
  3: [{ nome: 'Dia 1 · corpo inteiro', padroes: ['agachar', 'empurrar', 'puxar', 'core'] }, { nome: 'Dia 2 · corpo inteiro', padroes: ['quadril', 'empurrar', 'puxar', 'cardio'] }, { nome: 'Dia 3 · corpo inteiro', padroes: ['agachar', 'quadril', 'puxar', 'core'] }],
  4: [{ nome: 'Dia 1 · parte de cima', padroes: ['empurrar', 'puxar', 'core'] }, { nome: 'Dia 2 · pernas', padroes: ['agachar', 'quadril', 'cardio'] }, { nome: 'Dia 3 · parte de cima', padroes: ['puxar', 'empurrar', 'core'] }, { nome: 'Dia 4 · pernas', padroes: ['quadril', 'agachar', 'cardio'] }],
  5: [{ nome: 'Dia 1 · parte de cima', padroes: ['empurrar', 'puxar', 'core'] }, { nome: 'Dia 2 · pernas', padroes: ['agachar', 'quadril'] }, { nome: 'Dia 3 · cardio', padroes: ['cardio', 'core'] }, { nome: 'Dia 4 · parte de cima', padroes: ['puxar', 'empurrar', 'core'] }, { nome: 'Dia 5 · pernas', padroes: ['quadril', 'agachar', 'cardio'] }],
};
export const DIAS_OK = [2, 3, 4, 5];

/** Esqueleto da semana: reparte os movimentos pelos dias e alterna os exercícios possíveis, para não repetir sempre o mesmo. */
export function semana(eq: Set<EquipId>, dias: number): Dia[] {
  const modelo = MODELOS[DIAS_OK.includes(dias) ? dias : 3];
  const vez: Partial<Record<PadraoId, number>> = {};
  return modelo.map((d) => ({ nome: d.nome, itens: d.padroes.map((p) => {
    const xs = possiveis(p, eq), melhores = xs.filter((x) => x.q === (xs[0]?.q ?? 2));
    const i = vez[p] ?? 0; vez[p] = i + 1;
    return { padrao: p, exercicio: melhores.length ? melhores[i % melhores.length].nome : null };
  }) }));
}

const lista = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

export function avaliar(equip: EquipId[], dias: number, experiencia: 'comecando' | 'treina'): Resultado {
  const eq = new Set(equip), c = cobertura(eq);
  const faltam = c.filter((x) => x.nivel === 'falta').map((x) => x.padrao), adaptados = c.filter((x) => x.nivel === 'adaptado').map((x) => x.padrao);
  const bons = c.filter((x) => x.nivel === 'bom').length;
  const forca = c.filter((x) => x.padrao !== 'cardio' && x.padrao !== 'core');
  const veredito: Veredito = faltam.length ? 'incompleto' : forca.every((x) => x.nivel === 'bom') ? 'completo' : 'adaptado';
  const nomes = (ps: PadraoId[]) => lista(ps.map((p) => NOME_PADRAO[p].toLowerCase()));
  const titulo = veredito === 'completo' ? 'Dá para fazer um treino completo aí' : veredito === 'adaptado' ? 'Dá para treinar bem, com adaptações' : `Falta equipamento para ${nomes(faltam)}`;
  const resumo = veredito === 'completo'
    ? `O que você marcou cobre ${bons} dos 6 grupos de movimento com exercícios em que dá para aumentar a carga com o tempo.`
    : veredito === 'adaptado'
      ? (() => {
          // O cardio adaptado não tem "teto de carga": a saída é caminhar ou correr na rua.
          const forcaAd = adaptados.filter((p) => p !== 'cardio');
          const cardio = adaptados.includes('cardio') ? ' No cardio, a saída é caminhar ou correr nas ruas do condomínio.' : '';
          return `Todos os grupos de movimento têm exercício possível.${forcaAd.length ? ` Em ${nomes(forcaAd)}, a saída é o peso do corpo ou o elástico, que funcionam mas têm um teto de carga.` : ''}${cardio}`;
        })()
      : `Com o que você marcou, não há exercício para ${nomes(faltam)}. O resto dá para treinar; veja abaixo o que resolveria a falta.`;
  const avisos: string[] = [];
  const pernaComCarga = eq.has('maquinas-perna') || (eq.has('barra') && eq.has('rack'));
  if (!pernaComCarga && (eq.has('halteres') || eq.has('kettlebell'))) avisos.push(experiencia === 'treina'
    ? 'Pernas costumam ser o primeiro limite: o halter fica leve antes para o agachamento do que para os braços. Exercícios com uma perna de cada vez ajudam a esticar esse prazo.'
    : 'Para as pernas, os halteres dão conta no começo. Com o tempo eles ficam leves, e exercícios com uma perna de cada vez ajudam a continuar progredindo.');
  if (!eq.size) avisos.push('Sem equipamento, o treino fica no peso do corpo. Dá para começar, mas não há como treinar o movimento de puxar.');
  if (experiencia === 'comecando') avisos.push('Se você está começando, peça a alguém habilitado para conferir a execução nas primeiras semanas. Com dor, lesão ou problema de saúde, fale com o médico antes.');
  return { veredito, titulo, resumo, cobertura: c, bons, faltam, adaptados, avisos, ajuda: oQueMaisAjuda(eq), semana: semana(eq, dias) };
}

/** Mensagem do WhatsApp para o Montinho: equipamentos, dias e lugar. Nenhum dado de saúde. */
export function mensagemCondominio(equip: EquipId[], dias: number, local: 'condominio' | 'casa', regiao: string): string {
  const onde = local === 'casa' ? 'em casa' : 'na academia do meu condomínio';
  const eq = equip.length ? `Tenho: ${lista(equip.map((e) => NOME_EQUIP[e].toLowerCase()))}.` : 'Não tenho equipamento.';
  return `Olá, Montinho! Usei o simulador de treino em condomínio do Guia Fitness Alphaville. Quero treinar ${onde}${regiao ? `, ${regiao === 'Tamboré' ? 'no' : regiao === 'Aldeia da Serra' ? 'na' : 'em'} ${regiao}` : ''}, ${dias} vezes por semana. ${eq} Você atende aqui?`;
}
