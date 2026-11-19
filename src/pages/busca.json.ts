// Índice de busca do site, gerado no build. Cada item: t (título), u (url), c (categoria), d (descrição), k (palavras extras).
import { academias, guias, REGIOES, MODALIDADES, TIPOS, faixasDia, e24h, abreDomingo } from '../lib/dados';
import { ARTIGOS } from '../lib/artigos';

export async function GET() {
  const itens: { t: string; u: string; c: string; d: string; k: string }[] = [];
  const vistos = new Set<string>();
  // Palavras que as pessoas digitam e que não estão no título.
  const EXTRA: Record<string, string> = {
    '/academias/precos/': 'preço preços mensalidade valor quanto custa barata barato mais barata',
    '/ferramentas/academias-abertas-alphaville/': '24h madrugada noite aberta 24 horas domingo fim de semana feriado aberta hoje agora horario',
    '/academias/wellhub-totalpass/': 'gympass wellhub totalpass agregador plano empresa buscador plano comum tp silver',
    '/academias/perto-de/': 'perto de mim próximo próxima perto iguatemi shopping tamboré estação trem cptm 18 do forte',
    '/academias/smart-fit-barueri/': 'smartfit smart fit barueri centro zelia zélia parque shopping sodimac carrefour hiper tamboré alphaville horário endereço telefone preço diária totalpass',
    '/modalidades/natacao/': 'natação natacao piscina hidroginástica hidroginastica nadar escola de natação infantil bebê',
    '/modalidades/pilates/': 'pilates reformer estudio estúdio studio vitalle physio inspire health body centro comercial',
    '/modalidades/lutas/': 'luta lutas artes marciais muay thai boxe judo judô krav maga magá hapkido mma capoeira kickboxing defesa pessoal',
    '/guias/jiu-jitsu-alphaville/': 'jiu jitsu jiujitsu bjj tatame gracie barra alliance g13 templo tamboré',
    '/guias/jiu-jitsu-barueri/': 'jiu jitsu jiujitsu bjj tatame team cruz guerreiros fuinha catheo',
    '/guias/lutas-santana-de-parnaiba/': 'jiu jitsu jiujitsu boxe muay thai fazendinha g13 parnaiba',
    '/guias/academia-ou-personal/': 'quanto custa personal valor contratar vale a pena',
    '/guias/como-escolher-academia/': 'como escolher melhor academia dicas',
    '/ferramentas/comparador/': 'comparar comparação lado a lado',
  };
  const add = (i: (typeof itens)[number]) => { if (!vistos.has(i.u)) { vistos.add(i.u); itens.push({ ...i, k: `${i.k} ${EXTRA[i.u] ?? ''}`.trim() }); } };

  for (const a of await academias()) {
    const d = a.data;
    add({
      t: d.nome, u: `/academias/${a.id}/`, c: TIPOS[d.tipo] ?? 'Academia',
      d: `${d.bairro} · ${REGIOES[d.regiao].nome} · ${e24h(d.horario) ? '24 horas' : `seg ${faixasDia(d.horario.seg)}`}${d.mensalidade ? ` · ${d.mensalidade.valor}` : ''}`,
      k: [d.rede, d.bairro, REGIOES[d.regiao].titulo, d.endereco, ...d.modalidades.map((m) => MODALIDADES[m]), ...(d.atividades_listadas ?? []), ...d.agregadores.map((x) => x.nome), e24h(d.horario) ? '24h 24 horas madrugada' : '', abreDomingo(d.horario) ? 'domingo' : '', 'academia'].filter(Boolean).join(' '),
    });
  }
  for (const g of await guias()) {
    const d = g.data;
    const u = `/${d.secao}/${g.id}/`;
    const c = g.id.startsWith('personal-trainer-') ? 'Personal trainer' : /hyrox/.test(g.id) ? 'Hyrox' : d.secao === 'modalidades' ? 'Modalidade' : 'Guia';
    add({ t: d.h1, u, c, d: d.descricao, k: [d.palavra_chave, d.titulo].join(' ') });
  }
  for (const [u, a] of Object.entries(ARTIGOS)) add({ t: a.titulo, u, c: 'Guia', d: a.resumo, k: u.replace(/[/-]/g, ' ') });
  for (const [id, r] of Object.entries(REGIOES)) add({ t: `Academias em ${r.titulo}`, u: `/regioes/${id}/`, c: 'Região', d: r.descricao, k: `onde treinar ${r.nome}` });
  add({ t: 'Academias no Tamboré', u: '/regioes/tambore/', c: 'Região', d: 'NitroGym no Shopping Tamboré, Bluefit e lutas na Av. Tucunaré, G13 no Tamboré III e Smart Fit do Carrefour.', k: 'academia tambore shopping tambore tucunare tambore 1 2 3 10 11' });
  const extras = [
    { t: 'Todas as academias', u: '/academias/', c: 'Página', d: 'Lista com filtros por região, horário, modalidade e agregador.', k: 'filtro lista academias' },
    { t: 'Mapa das academias', u: '/mapa/', c: 'Página', d: 'Todas as academias do guia no mapa.', k: 'mapa localização perto' },
    { t: 'Comparador de academias', u: '/ferramentas/comparador/', c: 'Ferramenta', d: 'Compare até três academias lado a lado.', k: 'comparar versus x' },
    { t: 'Qual academia combina com você', u: '/ferramentas/qual-academia/', c: 'Ferramenta', d: 'Teste de cinco perguntas.', k: 'teste quiz escolher' },
    { t: 'Academias que aceitam personal externo', u: '/ferramentas/academias-que-aceitam-personal-externo/', c: 'Ferramenta', d: 'Quem aceita, cadastro e quem paga a taxa, por academia.', k: 'personal externo levar meu personal taxa cadastro aceita' },
    { t: 'Calculadora de custo para treinar', u: '/ferramentas/custo-para-treinar-em-alphaville/', c: 'Ferramenta', d: 'Mensalidade, estacionamento e personal por mês e por ida.', k: 'quanto custa preço gasto calculadora simulador personal condomínio' },
    { t: 'Academias com diária e aula experimental', u: '/ferramentas/academias-diaria-aula-experimental-alphaville/', c: 'Ferramenta', d: 'Onde fazer musculação pagando só uma diária e onde testar antes de contratar.', k: 'diaria diária day use avulsa aula experimental teste gratis grátis sem matricula visita' },
    { t: 'Calculadora de preço de personal trainer', u: '/ferramentas/calculadora-preco-personal-alphaville/', c: 'Ferramenta', d: 'Faixa de referência por aula e por mês em Alphaville e região.', k: 'personal trainer preço quanto custa valor mensal aula avulsa condominio domicilio online 3 vezes por semana' },
    { t: 'Treino na academia do condomínio', u: '/ferramentas/treino-academia-do-condominio/', c: 'Ferramenta', d: 'Marque os equipamentos do prédio ou de casa e veja o que dá para treinar e o que falta.', k: 'treino academia condominio predio em casa halteres banco equipamentos simulador montar treino sem equipamento personal no condominio' },
    { t: 'Academia perto de casa ou do trabalho', u: '/ferramentas/academia-perto-de-casa-ou-do-trabalho/', c: 'Ferramenta', d: 'Escolha de onde você sai e para onde vai: academias perto de cada ponto e no caminho, com horário.', k: 'academia perto de mim perto de casa perto do trabalho no caminho distancia residencial alphaville tambore proxima aberta agora 24 horas wellhub totalpass gympass' },
    { t: 'Calculadora Hyrox', u: '/ferramentas/calculadora-hyrox/', c: 'Ferramenta', d: 'Pesos oficiais por categoria e plano de prova com ritmo e tempo por estação.', k: 'hyrox calculadora pesos cargas open pro dupla mista revezamento masculino feminino tempo ritmo pace sled wall ball categorias' },
    { t: 'Personal presencial ou online?', u: '/ferramentas/personal-presencial-ou-online/', c: 'Ferramenta', d: 'Teste de 9 perguntas: qual formato combina com você.', k: 'personal trainer online presencial consultoria online hibrido vale a pena como funciona qual escolher' },
    { t: 'Academias abertas aos domingos e 24h', u: '/ferramentas/academias-abertas-alphaville/', c: 'Ferramenta', d: 'Quem abre domingo, 24 horas, cedo, tarde e em feriados, com a duração do treino.', k: 'domingo 24h 24 horas madrugada feriado aberta hoje agora horário fim de semana' },
    { t: 'Checklist de visita à academia', u: '/ferramentas/checklist/', c: 'Ferramenta', d: '27 pontos para conferir na visita.', k: 'checklist visita' },
    { t: 'Modalidades', u: '/modalidades/', c: 'Página', d: 'Musculação, CrossFit, Hyrox, lutas, dança e outras.', k: 'modalidade aula' },
    { t: 'Todos os guias', u: '/guias/', c: 'Página', d: 'Guias de decisão, personal trainer por região, tema e academia.', k: 'artigos blog' },
    { t: 'Sobre o guia e quem o mantém', u: '/sobre/', c: 'Institucional', d: 'Quem faz o guia e como ele se sustenta.', k: 'montinho contato quem somos' },
    { t: 'Metodologia', u: '/metodologia/', c: 'Institucional', d: 'Como os dados são coletados e conferidos.', k: 'fontes dados' },
    { t: 'Correções', u: '/correcoes/', c: 'Institucional', d: 'Encontrou um dado errado? Peça a correção.', k: 'erro corrigir' },
  ];
  extras.forEach(add);
  return new Response(JSON.stringify(itens), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
