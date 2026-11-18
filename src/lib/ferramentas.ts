// Ferramentas do guia encaixadas por contexto: cada página recebe as 2 ou 3 ferramentas que resolvem
// o próximo passo de quem está lendo, já abertas com o que a página sabe (academia, região, modalidade).
// Lógica pura, sem Astro, para servir a GuiaPagina e às páginas .astro.

export type FerramentaId = 'custo' | 'personal' | 'beneficio' | 'teste' | 'comparador' | 'checklist' | 'mapa' | 'abertas' | 'diaria';
export type RegiaoId = 'alphaville' | 'barueri' | 'santana-de-parnaiba';

export interface Ferramenta { id: FerramentaId; titulo: string; texto: string; href: string; rotulo: string; }

const BASE: Record<FerramentaId, { path: string; rotulo: string }> = {
  custo: { path: '/ferramentas/custo-para-treinar-em-alphaville/', rotulo: 'Calculadora de custo' },
  personal: { path: '/ferramentas/academias-que-aceitam-personal-externo/', rotulo: 'Personal externo' },
  beneficio: { path: '/academias/wellhub-totalpass/', rotulo: 'Wellhub e TotalPass' },
  teste: { path: '/ferramentas/qual-academia/', rotulo: 'Teste' },
  comparador: { path: '/ferramentas/comparador/', rotulo: 'Comparador' },
  checklist: { path: '/ferramentas/checklist/', rotulo: 'Checklist' },
  mapa: { path: '/mapa/', rotulo: 'Mapa' },
  abertas: { path: '/ferramentas/academias-abertas-alphaville/', rotulo: 'Academias abertas' },
  diaria: { path: '/ferramentas/academias-diaria-aula-experimental-alphaville/', rotulo: 'Diária e aula experimental' },
};

/** Modalidades que o buscador de Wellhub e TotalPass filtra (mesmas chaves de MODS_BEN). */
const MODS_BUSCADOR = new Set(['musculacao', 'funcional', 'lutas', 'pilates', 'yoga', 'crossfit', 'danca', 'bike', 'esportes-de-areia']);
/** Modalidades que o teste aceita no campo "o que você quer treinar". */
const MODS_TESTE = new Set(['musculacao', 'crossfit', 'cross-training', 'funcional', 'lutas', 'danca', 'bike', 'pilates', 'hiit', 'hyrox', 'eletroestimulacao', 'yoga', 'corrida', 'natacao', 'esportes-de-areia']);

export function link(id: FerramentaId, params: Record<string, string | undefined> = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return BASE[id].path + (s ? `?${s}` : '');
}

const f = (id: FerramentaId, titulo: string, texto: string, params: Record<string, string | undefined> = {}): Ferramenta =>
  ({ id, titulo, texto, href: link(id, params), rotulo: BASE[id].rotulo });

export interface Contexto {
  tipo: 'personal-academia' | 'personal-cidade' | 'personal-publico' | 'domicilio' | 'condominio' | 'modalidade' | 'hyrox'
    | 'como-escolher' | 'academia-ou-personal' | 'premium' | 'regiao' | 'precos' | '24h' | 'domingo' | 'perto-de' | 'comparativo' | 'rede';
  /** Nome legível do lugar (cidade, bairro) para os textos. */
  lugar?: string;
  regiao?: RegiaoId;
  /** Academia da página (personal na academia X, rede X). */
  academia?: { id: string; nome: string; temBeneficio?: boolean };
  /** Academias comparadas (comparativos). */
  academias?: { id: string; nome: string }[];
  modalidade?: string;
  modalidadeNome?: string;
  /** Público das páginas de personal (iniciantes, idosos...). */
  publico?: string;
}

/** Até 3 ferramentas, a primeira é a principal (vai também no atalho do topo). */
export function ferramentasPara(c: Contexto): Ferramenta[] {
  const em = c.lugar ? ` ${['Tamboré'].includes(c.lugar) ? 'no' : c.lugar === 'Aldeia da Serra' ? 'na' : 'em'} ${c.lugar}` : '';
  const mod = c.modalidade, modN = (c.modalidadeNome ?? '').toLowerCase();
  const pub = c.publico;
  switch (c.tipo) {
    case 'personal-academia': {
      const a = c.academia!;
      const r = [
        f('personal', `${a.nome} aceita personal de fora?`, 'Veja a regra conferida, o cadastro e quem paga a taxa, com a fonte de cada informação.', { q: a.nome }),
        f('custo', `Custo mensal com personal: ${a.nome}`, 'Some mensalidade, taxas, deslocamento e as aulas com personal, por mês e por treino.', { a: a.id, personal: '1', de: 'artigo' }),
        f('comparador', `Compare ${a.nome} com outras academias`, 'Horário, modalidades, estrutura e planos de Wellhub e TotalPass lado a lado.', { a: a.id }),
      ];
      return r;
    }
    case 'personal-cidade':
      return [
        f('personal', `Academias${em} que aceitam personal externo`, 'Unidade por unidade: quem aceita, o que pede de cadastro e quem paga a taxa.', { reg: c.regiao }),
        f('custo', 'Quanto custa treinar com personal por mês', 'Junte a mensalidade da academia e as aulas para ver o total real, sem surpresa.', { personal: '1', de: 'artigo' }),
        f('teste', `Qual academia${em} combina com a sua rotina`, 'Cinco perguntas sobre horário, modalidade e estrutura, com o porquê de cada resultado.', { regiao: c.regiao }),
      ];
    case 'personal-publico': {
      const extra: Record<string, Ferramenta> = {
        iniciantes: f('diaria', 'Teste a academia antes de assinar', 'Diária e aula experimental na região, com preço, regras e o canal de cada academia.', { modo: 'teste', regiao: c.regiao }),
        idosos: f('teste', `Academias${em} com acessibilidade e estacionamento`, 'O teste filtra as academias que informam itens de acessibilidade e onde parar o carro.', { regiao: c.regiao, precisa: 'acessivel,estacionamento' }),
        gestantes: f('checklist', 'O que conferir na academia antes de começar', 'Vestiário, ventilação, lotação e o que perguntar sobre a orientação na sala.'),
        executivos: f('abertas', `Academias${em} abertas antes ou depois do expediente`, 'Diga a hora em que você chega e quanto tempo treina: só aparece quem fica aberta até o fim.', { regiao: c.regiao, atalho: 'cedo' }),
        emagrecer: f('teste', `Qual academia${em} você vai conseguir frequentar`, 'Constância depende de horário e caminho: o teste cruza isso com as fichas.', { regiao: c.regiao }),
        feminino: f('checklist', 'O que observar na visita à academia', 'Movimento no seu horário, vestiário, professores na sala e o contrato.'),
      };
      return [
        f('personal', `Onde o personal pode dar aula${em}`, 'As academias da região que aceitam profissional de fora, com cadastro e taxa conferidos.', { reg: c.regiao }),
        f('custo', 'Simule o custo mensal: academia + personal', 'Mensalidade, taxas e aulas no mesmo cálculo, para comparar propostas.', { personal: '1', de: 'artigo' }),
        extra[pub ?? ''] ?? f('teste', `Qual academia${em} combina com você`, 'Cinco perguntas e uma lista curta para visitar.', { regiao: c.regiao }),
      ];
    }
    case 'domicilio':
      return [
        f('custo', 'Aula em casa ou academia: compare o custo', 'Ponha lado a lado o personal em casa e a academia com personal, com deslocamento e taxas.', { personal: '1', de: 'artigo' }),
        f('personal', `Prefere uma academia${em}? Veja quais aceitam personal`, 'Se faltar espaço ou aparelho em casa, estas academias deixam o seu profissional atender.', { reg: c.regiao }),
        f('mapa', `Academias perto de você${em}`, 'O mapa e a lista de endereços por região, para achar a mais próxima.'),
      ];
    case 'condominio':
      return [
        f('custo', 'Condomínio ou academia: quanto custa cada um', 'A calculadora tem a opção de treinar no condomínio e compara com academias da região.', { personal: '1', de: 'artigo' }),
        f('personal', `Academias${em} que aceitam o seu personal`, 'Para os dias em que o espaço do prédio não basta: quem aceita, cadastro e taxa.', { reg: c.regiao }),
        f('teste', `Qual academia${em} complementa o treino do prédio`, 'Escolha por horário, modalidade e estacionamento.', { regiao: c.regiao }),
      ];
    case 'modalidade': {
      const r: Ferramenta[] = [];
      if (mod && MODS_BUSCADOR.has(mod)) r.push(f('beneficio', `${c.modalidadeNome} pelo Wellhub ou TotalPass`, `Veja quais lugares liberam ${modN} no seu plano e o plano mínimo de cada um.`, { mod, reg: c.regiao }));
      if (mod && MODS_TESTE.has(mod)) r.push(f('teste', `Onde fazer ${modN} no seu horário`, `O teste já abre com ${modN} marcado: responda o resto e veja a lista.`, { modalidade: mod, regiao: c.regiao }));
      r.push(f('custo', `Quanto custa fazer ${modN} por mês`, 'Compare mensalidade, matrícula, deslocamento e benefício entre dois ou três lugares.', { de: 'artigo' }));
      if (r.length < 3) r.push(f('comparador', 'Compare os lugares lado a lado', 'Horário, estrutura e planos de benefício, com a data de cada dado.'));
      return r.slice(0, 3);
    }
    case 'hyrox':
      return [
        f('teste', `Onde treinar para o Hyrox${em}`, 'O teste abre com Hyrox marcado e cruza com horário e região.', { modalidade: 'hyrox', regiao: c.regiao }),
        f('comparador', 'Compare boxes e academias para a preparação', 'Horário, modalidades e estrutura de cada lugar, lado a lado.'),
        f('custo', 'Quanto custa a preparação por mês', 'Box, academia, personal e deslocamento no mesmo cálculo.', { de: 'artigo' }),
      ];
    case 'como-escolher':
      return [
        f('teste', 'Faça o teste: qual academia combina com você', 'Os critérios desta página viram cinco perguntas, com o resultado explicado.'),
        f('checklist', 'Leve o checklist na visita', '27 pontos para marcar no celular, da recepção ao vestiário.'),
        f('diaria', 'Teste antes de assinar', 'Onde dá para pagar uma diária ou fazer aula experimental na região.', { modo: 'teste' }),
      ];
    case 'academia-ou-personal':
      return [
        f('custo', 'Academia sozinho ou com personal: quanto muda', 'Simule as duas situações e veja a diferença por mês e por treino.', { personal: '1', de: 'artigo' }),
        f('personal', 'Quais academias aceitam personal de fora', 'Antes de contratar, confira se a sua academia deixa o profissional atender.'),
        f('teste', 'Qual academia combina com a sua rotina', 'Se a decisão for treinar sozinho, comece por uma academia no seu caminho.'),
      ];
    case 'premium':
      return [
        f('comparador', 'Compare as academias premium lado a lado', 'Ironberg, NitroGym e Bodytech com horário, estrutura e planos.', { a: 'ironberg-alphaville', b: 'nitrogym-tambore', c: 'bodytech-iguatemi-alphaville' }),
        f('custo', 'Quanto custa o primeiro ano em cada uma', 'Mensalidade, matrícula e personal somados, com os preços publicados.', { a: 'ironberg-alphaville', b: 'nitrogym-tambore', de: 'artigo' }),
        f('beneficio', 'Quais premium entram no seu Wellhub ou TotalPass', 'O plano mínimo de cada unidade, conferido no catálogo do benefício.', { reg: 'alphaville' }),
      ];
    case 'regiao':
      return [
        f('teste', `Qual academia${em} combina com você`, 'O teste já abre com a região marcada.', { regiao: c.regiao }),
        f('mapa', `Mapa das academias${em}`, 'Todas as fichas no mapa, com a lista de endereços por região.'),
        f('beneficio', `Wellhub e TotalPass${em}: quem aceita`, 'Plano mínimo e modalidades de cada unidade da região.', { reg: c.regiao }),
      ];
    case 'precos':
      return [
        f('custo', 'Calcule o custo real, não só a mensalidade', 'Matrícula, anuidade, estacionamento e personal, por mês e por treino.', { exemplo: '1', de: 'artigo' }),
        f('beneficio', 'Sai mais barato pelo Wellhub ou TotalPass?', 'Veja o plano mínimo que libera cada academia.'),
        f('comparador', 'Compare até três academias', 'Preço publicado, horário e estrutura lado a lado.'),
      ];
    case '24h':
      return [
        f('teste', 'Academias que abrem de madrugada perto de você', 'O teste já abre com "de madrugada" marcado.', { quando: 'h24' }),
        f('mapa', 'Onde ficam as academias 24 horas', 'Veja no mapa qual fica no seu caminho.'),
        f('comparador', 'Compare as academias 24 horas', 'Gaviões 24h e Ironberg lado a lado.', { a: 'gavioes-24h-alphaville', b: 'ironberg-alphaville' }),
      ];
    case 'domingo':
      return [
        f('teste', 'Academias abertas no domingo para você', 'O teste já abre com "aos domingos" marcado.', { quando: 'domingo' }),
        f('mapa', 'Onde ficam as academias da região', 'O mapa ajuda a achar a que abre no domingo mais perto.'),
        f('beneficio', 'Domingo pelo Wellhub ou TotalPass', 'Confira se o seu plano libera a academia que abre no fim de semana.'),
      ];
    case 'perto-de':
      return [
        f('mapa', 'Veja todas as academias no mapa', 'Para pontos que não estão nesta lista, o mapa mostra a mais próxima.'),
        f('teste', 'Filtre por horário e modalidade', 'Perto não basta: o teste confere se abre no seu horário.'),
        f('comparador', 'Compare as que ficam no seu caminho', 'Até três academias lado a lado.'),
      ];
    case 'comparativo': {
      const [x, y] = c.academias ?? [];
      return [
        f('beneficio', `${x.nome} e ${y.nome} no mesmo plano?`, 'Veja se um plano de Wellhub ou TotalPass cobre as duas e qual é o menor.', { modo: 'par', a: x.id, b: y.id }),
        f('personal', 'Treina com personal? Veja a regra de cada uma', 'Cadastro, taxa e quem paga, unidade por unidade.'),
        f('checklist', 'Visite as duas com o checklist', 'O que observar no seu horário, da recepção ao vestiário.'),
      ];
    }
    case 'rede': {
      const a = c.academia!;
      return [
        f('custo', `Quanto custa treinar na ${a.nome}${em}`, 'Plano, matrícula e deslocamento por mês e por treino.', { a: a.id, de: 'artigo' }),
        f('personal', `${a.nome} aceita personal de fora?`, 'Regra da rede, cadastro e taxa.', { q: a.nome }),
        f('beneficio', 'Unidades da região no Wellhub e no TotalPass', 'Plano mínimo de cada unidade.', { reg: c.regiao }),
      ];
    }
  }
  return [];
}
