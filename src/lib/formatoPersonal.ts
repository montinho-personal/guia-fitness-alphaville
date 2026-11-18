// Teste "Personal presencial ou online?": regras determinísticas, sem servidor e sem IA.
// As mesmas respostas dão sempre o mesmo resultado. Sem percentuais: um questionário curto não sustenta essa precisão.
// Ver docs/presencial-ou-online.md.

export type Lado = 'presencial' | 'online';
export interface Opcao { id: string; rotulo: string; p: number; o: number; motivo?: string }
export interface Pergunta { id: string; titulo: string; ajuda?: string; opcoes: Opcao[] }

export const PERGUNTAS: Pergunta[] = [
  { id: 'experiencia', titulo: 'Há quanto tempo você treina musculação?', opcoes: [
    { id: 'nunca', rotulo: 'Nunca treinei', p: 3, o: 0, motivo: 'você nunca treinou, e no começo a correção na hora faz diferença' },
    { id: 'comecando', rotulo: 'Estou começando (menos de 6 meses)', p: 2, o: 0, motivo: 'você ainda está começando' },
    { id: 'voltando', rotulo: 'Estou voltando depois de um tempo parado', p: 0.5, o: 1, motivo: 'você já treinou antes e está retomando' },
    { id: 'regular', rotulo: 'Treino com regularidade há mais de um ano', p: 0, o: 2, motivo: 'você treina com regularidade há mais de um ano' },
  ] },
  { id: 'execucao', titulo: 'Como você se sente executando os exercícios?', opcoes: [
    { id: 'insegura', rotulo: 'Tenho muita dúvida se estou fazendo certo', p: 2.5, o: 0, motivo: 'você tem muita dúvida sobre a execução' },
    { id: 'alguns', rotulo: 'Seguro em alguns, com dúvida em outros', p: 1, o: 0.5, motivo: 'você ainda tem dúvida em parte dos exercícios' },
    { id: 'segura', rotulo: 'Seguro na maioria', p: 0, o: 2.5, motivo: 'você executa a maioria dos exercícios com segurança' },
  ] },
  { id: 'dor', titulo: 'Você tem dor, lesão recente ou alguma restrição médica?', ajuda: 'Com dor ou restrição, a liberação do médico vem antes de qualquer formato.', opcoes: [
    { id: 'sim', rotulo: 'Sim', p: 2, o: 0, motivo: 'você tem dor, lesão recente ou restrição, e a adaptação do treino na hora ajuda' },
    { id: 'nao', rotulo: 'Não', p: 0, o: 0 },
  ] },
  { id: 'presenca', titulo: 'Você precisa de alguém ao seu lado para treinar?', opcoes: [
    { id: 'preciso', rotulo: 'Preciso; sozinho eu não vou ou não rendo', p: 3, o: 0, motivo: 'você disse que sozinho não vai ou não rende' },
    { id: 'ajuda', rotulo: 'Ajuda, mas não é indispensável', p: 0.5, o: 0.5 },
    { id: 'sozinho', rotulo: 'Treino bem sozinho', p: 0, o: 2, motivo: 'você treina bem sozinho' },
  ] },
  { id: 'video', titulo: 'Você se gravaria fazendo um exercício para receber a correção depois?', ajuda: 'No online, a correção da execução costuma ser por vídeo.', opcoes: [
    { id: 'nao', rotulo: 'Não me sinto à vontade', p: 2.5, o: 0, motivo: 'você não se sente à vontade gravando o treino, e a correção online depende disso' },
    { id: 'talvez', rotulo: 'Talvez, se for simples', p: 0.5, o: 0.5 },
    { id: 'sim', rotulo: 'Sim, sem problema', p: 0, o: 2, motivo: 'você aceita a correção por vídeo' },
  ] },
  { id: 'agenda', titulo: 'Você consegue manter horário fixo de treino na semana?', opcoes: [
    { id: 'facil', rotulo: 'Sim, com facilidade', p: 1.5, o: 0, motivo: 'você consegue manter horário fixo' },
    { id: 'as-vezes', rotulo: 'Na maioria das semanas', p: 0.5, o: 0.5 },
    { id: 'dificil', rotulo: 'É bem difícil', p: 0, o: 2.5, motivo: 'manter horário fixo é difícil para você' },
    { id: 'impossivel', rotulo: 'Quase impossível; minha agenda muda toda semana', p: 0, o: 3.5, motivo: 'sua agenda muda toda semana' },
  ] },
  { id: 'local', titulo: 'Onde você treina ou pretende treinar?', opcoes: [
    { id: 'condominio', rotulo: 'No meu condomínio', p: 1.5, o: 0, motivo: 'você treina no condomínio, onde o personal vai até você' },
    { id: 'casa', rotulo: 'Em casa', p: 1, o: 0.5, motivo: 'você treina em casa' },
    { id: 'academia', rotulo: 'Em academia da região', p: 0.5, o: 0.5 },
    { id: 'fora', rotulo: 'Viajo muito ou passo parte do mês fora da região', p: 0, o: 3, motivo: 'você passa parte do mês fora da região' },
  ] },
  { id: 'precisa', titulo: 'O que você mais precisa de um profissional agora?', opcoes: [
    { id: 'correcao', rotulo: 'Correção da execução na hora', p: 2.5, o: 0, motivo: 'o que você mais quer é correção na hora' },
    { id: 'motivacao', rotulo: 'Motivação durante o treino', p: 2, o: 0, motivo: 'você quer motivação durante o treino' },
    { id: 'plano', rotulo: 'Um plano e a progressão das cargas', p: 0, o: 2.5, motivo: 'o que você mais quer é plano e progressão, e isso funciona a distância' },
    { id: 'cobranca', rotulo: 'Cobrança para não faltar', p: 1, o: 1, motivo: 'você quer cobrança de constância, que os dois formatos podem dar' },
  ] },
  { id: 'orcamento', titulo: 'Quanto o valor mensal pesa na decisão?', opcoes: [
    { id: 'decisivo', rotulo: 'É decisivo', p: 0, o: 1.5, motivo: 'o valor mensal é decisivo para você, e o online costuma custar menos' },
    { id: 'pesa', rotulo: 'Pesa, mas não decide sozinho', p: 0, o: 0.5 },
    { id: 'pouco', rotulo: 'Pesa pouco', p: 0, o: 0 },
  ] },
];

export type Respostas = Record<string, string>;
export type TipoResultado = 'presencial' | 'online' | 'hibrido' | 'ambos';
export interface Resultado {
  tipo: TipoResultado; titulo: string; resumo: string;
  proPresencial: string[]; proOnline: string[]; conflitos: string[]; avisos: string[];
  completo: boolean; orcamentoIgnorado: boolean;
}

export const TITULOS: Record<TipoResultado, string> = {
  presencial: 'Presencial combina mais com você agora',
  online: 'Online combina mais com você agora',
  hibrido: 'Um modelo híbrido faz sentido para você',
  ambos: 'Os dois formatos podem funcionar para você',
};
/** Diferença mínima de pontos para apontar um formato. Abaixo disso, a resposta honesta é "os dois" ou "híbrido". */
export const MARGEM = 3;

export function avaliar(r: Respostas): Resultado {
  const pro: Record<Lado, string[]> = { presencial: [], online: [] };
  let p = 0, o = 0;
  const completo = PERGUNTAS.every((q) => q.opcoes.some((x) => x.id === r[q.id]));
  // Sem autonomia para treinar sozinho, o preço não pode decidir o formato.
  const semAutonomia = r.experiencia === 'nunca' || r.execucao === 'insegura' || r.presenca === 'preciso';
  let orcamentoIgnorado = false;
  for (const q of PERGUNTAS) {
    const x = q.opcoes.find((y) => y.id === r[q.id]); if (!x) continue;
    if (q.id === 'orcamento' && semAutonomia) { orcamentoIgnorado = x.o > 0; continue; }
    p += x.p; o += x.o;
    if (x.motivo) { if (x.p > x.o) pro.presencial.push(x.motivo); else if (x.o > x.p) pro.online.push(x.motivo); else { pro.presencial.push(x.motivo); } }
  }
  const precisaPresenca = semAutonomia || r.dor === 'sim' || r.precisa === 'correcao' || r.video === 'nao';
  const rotinaContra = r.agenda === 'impossivel' || r.agenda === 'dificil' || r.local === 'fora';
  const conflitos: string[] = [];
  if (precisaPresenca && rotinaContra) conflitos.push('Sua necessidade aponta para o presencial, mas sua rotina aponta para o online.');
  if (r.presenca === 'preciso' && r.execucao === 'segura' && r.experiencia === 'regular') conflitos.push('Você não precisa de presença pela técnica, mas diz que sem alguém ao lado não treina: é constância, não execução.');
  if (orcamentoIgnorado) conflitos.push('O valor pesa para você, mas ele não entrou na conta: sem autonomia para treinar sozinho, o online mais barato tende a não ser usado.');
  const avisos: string[] = [];
  if (r.dor === 'sim') avisos.push('Com dor, lesão ou restrição, converse com o seu médico antes de começar, em qualquer formato.');
  let tipo: TipoResultado;
  if (precisaPresenca && rotinaContra) tipo = 'hibrido';
  else if (p - o >= MARGEM) tipo = 'presencial';
  else if (o - p >= MARGEM) tipo = 'online';
  else tipo = 'ambos';
  const resumo = {
    presencial: 'Pelas suas respostas, ter o profissional ao lado durante o treino resolve mais do que um plano a distância.',
    online: 'Pelas suas respostas, você tem autonomia para treinar e precisa mais de plano, progressão e ajustes do que de alguém ao lado.',
    hibrido: 'Você precisa de presença em parte do treino, mas a sua rotina não sustenta horário fixo toda semana. Combine as duas coisas de forma explícita: quantas aulas presenciais, com que frequência e o que acontece entre elas.',
    ambos: 'Suas respostas não apontam com folga para um lado. Os dois formatos podem funcionar: decida pelo que cabe melhor na sua agenda e no seu bolso.',
  }[tipo];
  return { tipo, titulo: TITULOS[tipo], resumo, proPresencial: pro.presencial, proOnline: pro.online, conflitos, avisos, completo, orcamentoIgnorado };
}

/** Mensagem para o WhatsApp do Montinho, conforme o resultado. O visitante revisa antes de enviar. */
export function mensagemResultado(tipo: TipoResultado): string {
  const base = 'Oi, Montinho! Vim pelo Guia Fitness Alphaville e fiz o teste "presencial ou online".';
  return {
    presencial: `${base} Deu presencial. Como funciona o seu acompanhamento presencial em Alphaville e região? Quais horários você tem?`,
    online: `${base} Deu online. Como funciona o seu acompanhamento online?`,
    hibrido: `${base} Deu modelo híbrido. Dá para combinar aulas presenciais com acompanhamento online?`,
    ambos: `${base} Os dois formatos podem funcionar para mim. Pode me explicar como é cada um com você?`,
  }[tipo];
}
