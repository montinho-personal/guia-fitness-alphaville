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
  [H24]: [DOM, IN, SG, PA],
  [DOM]: [H24, PS, PT, SG],
  [WT]: [PR, SG, CF, A],
  [MU]: [IN, PA, H24, B],
  [CF]: [WT, MU, DOM, A],
};

/** Guia de personal da região de uma academia. */
export const personalDaRegiao = (regiao: string, bairro: string) =>
  /tambor/i.test(bairro) ? PT : regiao === 'barueri' ? PB : regiao === 'santana-de-parnaiba' ? PS : PA;

export const COMPARATIVOS: Record<string, string> = {
  'smart-fit-sodimac-alphaville': SG, 'gavioes-24h-alphaville': SG,
  'ironberg-alphaville': IN, 'nitrogym-tambore': IN,
};
