// Ferramentas do guia encaixadas por contexto: cada página recebe as 2 ou 3 ferramentas que resolvem
// o próximo passo de quem está lendo, já abertas com o que a página sabe (academia, região, modalidade).
// Lógica pura, sem Astro, para servir a GuiaPagina e às páginas .astro.

export type FerramentaId = 'custo' | 'personal' | 'beneficio' | 'teste' | 'comparador' | 'checklist' | 'mapa' | 'abertas' | 'diaria' | 'preco' | 'formato';
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
  preco: { path: '/ferramentas/calculadora-preco-personal-alphaville/', rotulo: 'Preço de personal' },
  formato: { path: '/ferramentas/personal-presencial-ou-online/', rotulo: 'Presencial ou online' },
  diaria: { path: '/ferramentas/academias-diaria-aula-experimental-alphaville/', rotulo: 'Diária e aula experimental' },
};

/** Modalidades que o buscador de Wellhub e TotalPass filtra (mesmas chaves de MODS_BEN). */
const MODS_BUSCADOR = new Set(['musculacao', 'funcional', 'lutas', 'pilates', 'yoga', 'crossfit', 'danca', 'bike', 'esportes-de-areia']);
/** Modalidades que o teste aceita no campo "o que você quer treinar". */
const MODS_TESTE = new Set(['musculacao', 'crossfit', 'cross-training', 'funcional', 'lutas', 'danca', 'bike', 'pilates', 'hiit', 'hyrox', 'eletroestimulacao', 'yoga', 'corrida', 'natacao', 'esportes-de-areia']);
// Modalidades com ao menos uma oferta de diária ou aula experimental nas fichas (acesso_avulso).
const MODS_DIARIA = new Set(['musculacao', 'crossfit', 'cross-training', 'hyrox', 'lutas', 'eletroestimulacao']);

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
  const LOCAL_PRECO: Record<string, string> = { Alphaville: 'alphaville', 'Tamboré': 'tambore', Barueri: 'barueri-centro', 'Santana de Parnaíba': 'santana-de-parnaiba', 'Aldeia da Serra': 'aldeia-da-serra' };
  const localPreco = c.lugar ? LOCAL_PRECO[c.lugar] : undefined;
  const preco = (formato?: string) => f('preco', `Quanto custa personal trainer${em}: calcule a faixa`, 'Faixa de referência por aula e por mês, com a conta aberta linha a linha.', { local: localPreco, formato });
  const diaria = (t: string, d: string, p: Record<string, string | undefined> = {}) => f('diaria', t, d, { regiao: c.regiao, ...p });
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
        preco(),
        f('formato', 'Presencial ou online: qual combina com você', 'Nove perguntas sobre experiência, rotina e local de treino, com o resultado explicado.'),
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
        preco(),
        extra[pub ?? ''] ?? f('formato', 'Presencial ou online: qual combina com você', 'Nove perguntas sobre experiência, rotina e local de treino, com o resultado explicado.'),
      ];
    }
    case 'domicilio':
      return [
        preco('domicilio'),
        f('custo', 'Aula em casa ou academia: compare o custo', 'Ponha lado a lado o personal em casa e a academia com personal, com deslocamento e taxas.', { personal: '1', de: 'artigo' }),
        f('formato', 'Em casa ou online: faça o teste', 'Nove perguntas sobre rotina, espaço e experiência para saber se o presencial em casa vale a pena para você.'),
      ];
    case 'condominio':
      return [
        preco('condominio'),
        f('custo', 'Condomínio ou academia: quanto custa cada um', 'A calculadora tem a opção de treinar no condomínio e compara com academias da região.', { personal: '1', de: 'artigo' }),
        f('personal', `Academias${em} que aceitam o seu personal`, 'Para os dias em que o espaço do prédio não basta: quem aceita, cadastro e taxa.', { reg: c.regiao }),
      ];
    case 'modalidade': {
      const r: Ferramenta[] = [];
      if (mod && MODS_BUSCADOR.has(mod)) r.push(f('beneficio', `${c.modalidadeNome} pelo Wellhub ou TotalPass`, `Veja quais lugares liberam ${modN} no seu plano e o plano mínimo de cada um.`, { mod, reg: c.regiao }));
      if (mod && MODS_TESTE.has(mod)) r.push(f('teste', `Onde fazer ${modN} no seu horário`, `O teste já abre com ${modN} marcado: responda o resto e veja a lista.`, { modalidade: mod, regiao: c.regiao }));
      if (mod && MODS_DIARIA.has(mod)) r.push(diaria(`${c.modalidadeNome} sem matrícula: diária e aula experimental`, `Onde dá para fazer ${modN} pagando só o dia ou numa aula de teste, com o canal de cada lugar.`, { modo: 'teste' }));
      r.push(f('custo', `Quanto custa fazer ${modN} por mês`, 'Compare mensalidade, matrícula, deslocamento e benefício entre dois ou três lugares.', { de: 'artigo' }));
      if (r.length < 3) r.push(f('comparador', 'Compare os lugares lado a lado', 'Horário, estrutura e planos de benefício, com a data de cada dado.'));
      return r.slice(0, 3);
    }
    case 'hyrox':
      return [
        f('teste', `Onde treinar para o Hyrox${em}`, 'O teste abre com Hyrox marcado e cruza com horário e região.', { modalidade: 'hyrox', regiao: c.regiao }),
        diaria('Teste um box antes de fechar a preparação', 'Aula experimental, drop-in e diária nos boxes e academias da região, com preço e regras.', { modo: 'teste' }),
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
        preco(),
        f('custo', 'Academia sozinho ou com personal: quanto muda', 'Simule as duas situações e veja a diferença por mês e por treino.', { personal: '1', de: 'artigo' }),
        f('formato', 'Personal presencial ou online: faça o teste', 'Nove perguntas sobre experiência, rotina e local de treino, com o resultado explicado.'),
      ];
    case 'premium':
      return [
        f('comparador', 'Compare as academias premium lado a lado', 'Ironberg, NitroGym e Bodytech com horário, estrutura e planos.', { a: 'ironberg-alphaville', b: 'nitrogym-tambore', c: 'bodytech-iguatemi-alphaville' }),
        f('custo', 'Quanto custa o primeiro ano em cada uma', 'Mensalidade, matrícula e personal somados, com os preços publicados.', { a: 'ironberg-alphaville', b: 'nitrogym-tambore', de: 'artigo' }),
        diaria('Treine um dia numa premium antes de assinar', 'Day use, aula avulsa e visita guiada nas premium da região, com preço publicado e regras.', { regiao: 'alphaville' }),
      ];
    case 'regiao':
      return [
        f('teste', `Qual academia${em} combina com você`, 'O teste já abre com a região marcada.', { regiao: c.regiao }),
        diaria(`Diária e aula experimental${em}`, 'Treine hoje sem matrícula ou teste antes de assinar: preço, regras e o canal de cada academia.'),
        f('beneficio', `Wellhub e TotalPass${em}: quem aceita`, 'Plano mínimo e modalidades de cada unidade da região.', { reg: c.regiao }),
      ];
    case 'precos':
      return [
        f('custo', 'Calcule o custo real, não só a mensalidade', 'Matrícula, anuidade, estacionamento e personal, por mês e por treino.', { exemplo: '1', de: 'artigo' }),
        f('beneficio', 'Sai mais barato pelo Wellhub ou TotalPass?', 'Veja o plano mínimo que libera cada academia.'),
        diaria('Antes da matrícula, pague só um dia', 'Diária, day use e aula experimental: quanto custa testar cada academia antes de assinar.'),
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
        diaria('De passagem? Treine com diária', 'Onde dá para pagar só o dia ou fazer aula experimental perto de onde você está.'),
      ];
    case 'comparativo': {
      const [x, y] = c.academias ?? [];
      return [
        f('beneficio', `${x.nome} e ${y.nome} no mesmo plano?`, 'Veja se um plano de Wellhub ou TotalPass cobre as duas e qual é o menor.', { modo: 'par', a: x.id, b: y.id }),
        f('personal', 'Treina com personal? Veja a regra de cada uma', 'Cadastro, taxa e quem paga, unidade por unidade.'),
        diaria('Teste as duas antes de escolher', 'Quem tem diária, aula experimental ou visita guiada, com preço, regras e o canal de cada uma.', { modo: 'teste' }),
      ];
    }
    case 'rede': {
      const a = c.academia!;
      return [
        f('custo', `Quanto custa treinar na ${a.nome}${em}`, 'Plano, matrícula e deslocamento por mês e por treino.', { a: a.id, de: 'artigo' }),
        f('personal', `${a.nome} aceita personal de fora?`, 'Regra da rede, cadastro e taxa.', { q: a.nome }),
        diaria(`Dá para testar a ${a.nome} antes?`, 'Diária, passe do dia e aula experimental na região, com o que cada unidade informa.'),
      ];
    }
  }
  return [];
}
