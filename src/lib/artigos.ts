// Catálogo dos artigos editoriais e dos "leia também" de cada um.
// Mantido à mão para que a ligação entre artigos seja temática, e não aleatória.
export const ARTIGOS: Record<string, { titulo: string; resumo: string }> = {
  '/guias/como-escolher-academia/': { titulo: 'Como escolher uma academia', resumo: 'Os critérios que mais pesam na hora de assinar.' },
  '/guias/academia-ou-personal/': { titulo: 'Academia ou personal trainer', resumo: 'Quando a academia basta e quando o acompanhamento faz diferença.' },
  '/guias/personal-trainer-alphaville/': { titulo: 'Personal trainer em Alphaville', resumo: 'Academia, condomínio ou casa: onde o treino pode acontecer.' },
  '/guias/personal-trainer-tambore/': { titulo: 'Personal trainer no Tamboré', resumo: 'Academia do residencial, treino em casa e as academias do bairro.' },
  '/guias/personal-trainer-barueri/': { titulo: 'Personal trainer em Barueri', resumo: 'Academia barata somada ao personal: como fazer a conta.' },
  '/guias/personal-trainer-santana-de-parnaiba/': { titulo: 'Personal trainer em Santana de Parnaíba', resumo: 'O lado de Alphaville, os bairros e o peso do deslocamento.' },
  '/guias/personal-trainer-aldeia-da-serra/': { titulo: 'Personal trainer na Aldeia da Serra', resumo: 'Sem academia no bairro: treino em casa e no condomínio.' },
  '/guias/smart-fit-ou-gavioes/': { titulo: 'Smart Fit ou Gaviões', resumo: 'Preço conhecido contra horário de 24 horas.' },
  '/guias/ironberg-ou-nitrogym/': { titulo: 'Ironberg ou NitroGym', resumo: 'Quanto custa o primeiro ano nas duas academias premium.' },
  '/academias/precos/': { titulo: 'Quanto custa academia na região', resumo: 'Mensalidades publicadas, com fonte e data.' },
  '/academias/24-horas/': { titulo: 'Academias 24 horas', resumo: 'Quem abre de madrugada e quem só tem 24h no nome.' },
  '/academias/domingo/': { titulo: 'Academias abertas no domingo', resumo: 'Quem abre, até que horas, e onde treinar à tarde.' },
  '/academias/wellhub-totalpass/': { titulo: 'Wellhub e TotalPass', resumo: 'O plano mínimo que cada academia exige.' },
  '/modalidades/musculacao/': { titulo: 'Musculação na região', resumo: 'Onde treinar musculação e o que observar no salão.' },
  '/modalidades/crossfit/': { titulo: 'CrossFit e cross training', resumo: 'Boxes da região e como funciona a aula.' },
  '/guias/gavioes-ou-ironberg/': { titulo: 'Gaviões 24h ou Ironberg', resumo: 'As duas academias 24 horas do guia, lado a lado.' },
  '/guias/academias-premium-alphaville/': { titulo: 'Academias premium em Alphaville', resumo: 'O que o preço maior compra em cada uma.' },
  '/guias/beach-tennis-futevolei-alphaville/': { titulo: 'Beach tennis e futevôlei em Alphaville', resumo: 'Onde jogar na areia e treinar no mesmo lugar.' },
  '/academias/perto-de/': { titulo: 'Academia perto de você', resumo: 'Iguatemi, Shopping Tamboré, 18 do Forte e estações.' },
};

const A = '/guias/como-escolher-academia/', B = '/guias/academia-ou-personal/';
const PA = '/guias/personal-trainer-alphaville/', PT = '/guias/personal-trainer-tambore/', PB = '/guias/personal-trainer-barueri/';
const PS = '/guias/personal-trainer-santana-de-parnaiba/', PD = '/guias/personal-trainer-aldeia-da-serra/';
const SG = '/guias/smart-fit-ou-gavioes/', IN = '/guias/ironberg-ou-nitrogym/';
const PR = '/academias/precos/', H24 = '/academias/24-horas/', DOM = '/academias/domingo/', WT = '/academias/wellhub-totalpass/';
const MU = '/modalidades/musculacao/', CF = '/modalidades/crossfit/';

export const RELACIONADOS: Record<string, string[]> = {
  [A]: [B, SG, PR, DOM],
  [B]: [PA, PB, IN, A],
  [PA]: [PT, B, IN, H24],
  [PT]: [PA, IN, DOM, PB],
  [PB]: [PS, PR, SG, B],
  [PS]: [PD, PT, DOM, PB],
  [PD]: [PS, PA, B, DOM],
  [SG]: [IN, PR, H24, WT],
  [IN]: [SG, PT, PR, H24],
  [PR]: [IN, SG, WT, PB],
  [H24]: [DOM, '/guias/gavioes-ou-ironberg/', IN, SG],
  [DOM]: [H24, PS, PT, SG],
  [WT]: [PR, SG, CF, A],
  [MU]: [IN, PA, H24, B],
  '/guias/gavioes-ou-ironberg/': [H24, IN, SG, '/guias/academias-premium-alphaville/'],
  '/guias/academias-premium-alphaville/': [IN, '/guias/gavioes-ou-ironberg/', '/guias/beach-tennis-futevolei-alphaville/', PR],
  '/guias/beach-tennis-futevolei-alphaville/': ['/guias/academias-premium-alphaville/', PA, DOM, WT],
  '/academias/perto-de/': [PR, DOM, H24, A],
  [CF]: [WT, MU, DOM, A],
};

/** Guia de personal da região de uma academia. */
export const personalDaRegiao = (regiao: string, bairro: string) =>
  /tambor/i.test(bairro) ? PT : regiao === 'barueri' ? PB : regiao === 'santana-de-parnaiba' ? PS : PA;

export const COMPARATIVOS: Record<string, string> = {
  'smart-fit-sodimac-alphaville': SG, 'gavioes-24h-alphaville': SG,
  'ironberg-alphaville': IN, 'nitrogym-tambore': IN,
};

// Artigos de personal por tema e cidade (personal-trainer-<tema>-<cidade>).
export const CIDADES_PT: Record<string, { nome: string; em: string }> = {
  alphaville: { nome: 'Alphaville', em: 'em Alphaville' },
  tambore: { nome: 'Tamboré', em: 'no Tamboré' },
  barueri: { nome: 'Barueri', em: 'em Barueri' },
  'santana-de-parnaiba': { nome: 'Santana de Parnaíba', em: 'em Santana de Parnaíba' },
  'aldeia-da-serra': { nome: 'Aldeia da Serra', em: 'na Aldeia da Serra' },
};
export const TEMAS_PT: Record<string, { nome: string; resumo: string }> = {
  feminino: { nome: 'Personal trainer feminino', resumo: 'Treino pensado para mulheres e como achar uma profissional.' },
  'em-condominio': { nome: 'Personal no condomínio', resumo: 'Treino no espaço fitness do residencial: regras e limites.' },
  'a-domicilio': { nome: 'Personal a domicílio', resumo: 'Treino em casa: espaço, material e combinados.' },
  'para-idosos': { nome: 'Personal para idosos', resumo: 'Segurança, liberação médica e lugares acessíveis.' },
  'para-iniciantes': { nome: 'Personal para iniciantes', resumo: 'Os primeiros meses de treino com acompanhamento.' },
  'para-emagrecer': { nome: 'Personal para emagrecer', resumo: 'O que o acompanhamento ajuda e o que depende de você.' },
  'para-gestantes': { nome: 'Personal para gestantes', resumo: 'Treino na gravidez sempre com orientação do obstetra.' },
  'para-executivos': { nome: 'Personal para executivos', resumo: 'Horários fixos, treino curto e perto do trabalho.' },
};
export const urlTema = (tema: string, cidade: string) => `/guias/personal-trainer-${tema}-${cidade}/`;
export const urlCidade = (cidade: string) => `/guias/personal-trainer-${cidade}/`;
/** Decompõe o id de um guia de personal por tema; null se não for um. */
export function temaCidade(id: string): { tema: string; cidade: string } | null {
  for (const t of Object.keys(TEMAS_PT)) for (const c of Object.keys(CIDADES_PT)) if (id === `personal-trainer-${t}-${c}`) return { tema: t, cidade: c };
  return null;
}
for (const [t, tt] of Object.entries(TEMAS_PT)) for (const [c, cc] of Object.entries(CIDADES_PT)) {
  ARTIGOS[urlTema(t, c)] = { titulo: `${tt.nome} ${cc.em}`, resumo: tt.resumo };
  const outras = Object.keys(CIDADES_PT).filter((x) => x !== c);
  const i = outras.length ? Object.keys(CIDADES_PT).indexOf(c) % outras.length : 0;
  const temas = Object.keys(TEMAS_PT), j = temas.indexOf(t);
  RELACIONADOS[urlTema(t, c)] = [urlCidade(c), urlTema(temas[(j + 1) % temas.length], c), urlTema(t, outras[i]), urlTema(t, outras[(i + 1) % outras.length])];
}
