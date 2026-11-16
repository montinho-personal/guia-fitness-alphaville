// Índice de busca do site, gerado no build. Cada item: t (título), u (url), c (categoria), d (descrição), k (palavras extras).
import { academias, guias, REGIOES, MODALIDADES, TIPOS, faixasDia, e24h, abreDomingo } from '../lib/dados';
import { ARTIGOS } from '../lib/artigos';

export async function GET() {
  const itens: { t: string; u: string; c: string; d: string; k: string }[] = [];
  const vistos = new Set<string>();
  // Palavras que as pessoas digitam e que não estão no título.
  const EXTRA: Record<string, string> = {
    '/academias/precos/': 'preço preços mensalidade valor quanto custa barata barato mais barata',
    '/academias/24-horas/': '24h madrugada noite aberta 24 horas',
    '/academias/domingo/': 'domingo fim de semana feriado aberta hoje',
    '/academias/wellhub-totalpass/': 'gympass wellhub totalpass agregador plano empresa',
    '/academias/perto-de/': 'perto de mim próximo próxima perto iguatemi shopping tamboré estação trem cptm 18 do forte',
    '/academias/smart-fit-barueri/': 'smartfit smart fit barueri centro zelia zélia parque shopping sodimac alphaville horário endereço telefone preço diária totalpass',
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
  const extras = [
    { t: 'Todas as academias', u: '/academias/', c: 'Página', d: 'Lista com filtros por região, horário, modalidade e agregador.', k: 'filtro lista academias' },
    { t: 'Mapa das academias', u: '/mapa/', c: 'Página', d: 'Todas as academias do guia no mapa.', k: 'mapa localização perto' },
    { t: 'Comparador de academias', u: '/ferramentas/comparador/', c: 'Ferramenta', d: 'Compare até três academias lado a lado.', k: 'comparar versus x' },
    { t: 'Qual academia combina com você', u: '/ferramentas/qual-academia/', c: 'Ferramenta', d: 'Teste de cinco perguntas.', k: 'teste quiz escolher' },
    { t: 'Checklist de visita à academia', u: '/ferramentas/checklist/', c: 'Ferramenta', d: '22 pontos para conferir na visita.', k: 'checklist visita' },
    { t: 'Modalidades', u: '/modalidades/', c: 'Página', d: 'Musculação, CrossFit, Hyrox, lutas, dança e outras.', k: 'modalidade aula' },
    { t: 'Todos os guias', u: '/guias/', c: 'Página', d: 'Guias de decisão, personal trainer por região, tema e academia.', k: 'artigos blog' },
    { t: 'Sobre o guia e quem o mantém', u: '/sobre/', c: 'Institucional', d: 'Quem faz o guia e como ele se sustenta.', k: 'montinho contato quem somos' },
    { t: 'Metodologia', u: '/metodologia/', c: 'Institucional', d: 'Como os dados são coletados e conferidos.', k: 'fontes dados' },
    { t: 'Correções', u: '/correcoes/', c: 'Institucional', d: 'Encontrou um dado errado? Peça a correção.', k: 'erro corrigir' },
  ];
  extras.forEach(add);
  return new Response(JSON.stringify(itens), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
