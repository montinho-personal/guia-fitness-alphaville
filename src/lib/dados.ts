import { getCollection, type CollectionEntry } from 'astro:content';

export type Academia = CollectionEntry<'academias'>;
export type Guia = CollectionEntry<'guias'>;

export const INDEXAVEL = import.meta.env.PUBLIC_INDEXAVEL === 'true';
export const MOSTRAR_EM_REVISAO = import.meta.env.MOSTRAR_EM_REVISAO === 'true';
export const WHATSAPP = import.meta.env.PUBLIC_WHATSAPP || '';
export const GTM_ID = import.meta.env.PUBLIC_GTM_ID || '';

if (INDEXAVEL && MOSTRAR_EM_REVISAO) {
  throw new Error('PUBLIC_INDEXAVEL=true não pode ser combinado com MOSTRAR_EM_REVISAO=true: conteúdo não aprovado ficaria indexável.');
}

const APROVADOS = ['aprovado', 'publicado'];
const visivel = (status: string) => MOSTRAR_EM_REVISAO || APROVADOS.includes(status);

export async function academias(): Promise<Academia[]> {
  const todas = await getCollection('academias', ({ data }) => visivel(data.status));
  return todas.sort((a, b) => a.data.nome.localeCompare(b.data.nome, 'pt-BR'));
}
export async function guias(): Promise<Guia[]> {
  return getCollection('guias', ({ data }) => visivel(data.status));
}

export const REGIOES = {
  alphaville: {
    nome: 'Alphaville',
    titulo: 'Alphaville e Tamboré',
    descricao: 'Alphaville Industrial, Centro Comercial, Empresarial 18 do Forte e Tamboré, em Barueri.',
  },
  barueri: {
    nome: 'Barueri',
    titulo: 'Barueri',
    descricao: 'Centro de Barueri e Bethaville, fora dos bairros de Alphaville.',
  },
  'santana-de-parnaiba': {
    nome: 'Santana de Parnaíba',
    titulo: 'Santana de Parnaíba',
    descricao: 'Fazendinha, Polvilho e Jardim São Luís.',
  },
} as const;
export type RegiaoId = keyof typeof REGIOES;

export const MODALIDADES: Record<string, string> = {
  musculacao: 'Musculação',
  crossfit: 'CrossFit',
  'cross-training': 'Cross training',
  funcional: 'Funcional',
  lutas: 'Lutas',
  danca: 'Dança e ritmos',
  bike: 'Bike indoor',
  pilates: 'Pilates',
  hiit: 'HIIT',
  hyrox: 'Hyrox',
  eletroestimulacao: 'Eletroestimulação',
  yoga: 'Yoga',
  corrida: 'Corrida',
};
export const TIPOS: Record<string, string> = { academia: 'Academia', box: 'Box', estudio: 'Estúdio' };

export const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const;
export const DIAS_NOME: Record<string, string> = { seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };
type Horario = Academia['data']['horario'];

const min = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
/** "06:00" -> "6h", "17:15" -> "17h15", "23:59" -> "meia-noite" */
export function hora(hhmm: string): string {
  if (hhmm === '23:59') return 'meia-noite';
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}
export const faixa = (f: string) => { const [a, b] = f.split('-'); return a === '00:00' && b === '23:59' ? '24 horas' : `${hora(a)} às ${hora(b)}`; };
export const faixasDia = (fs: string[]) => (fs.length ? fs.map(faixa).join(' e ') : 'sem horário listado');

/** Aberta 24 horas nos sete dias, segundo o horário publicado. */
export const e24h = (h: Horario) => DIAS.every((d) => h[d].length === 1 && h[d][0] === '00:00-23:59');
export const abreDomingo = (h: Horario) => h.dom.length > 0;
export const abertura = (h: Horario) => (h.seg.length ? min(h.seg[0].split('-')[0]) : null);
export const fechamento = (h: Horario) => (h.seg.length ? min(h.seg[h.seg.length - 1].split('-')[1]) : null);
export const abreAntesDas6 = (h: Horario) => { const a = abertura(h); return a !== null && a < 360; };
export const fechaApos22 = (h: Horario) => { const f = fechamento(h); return f !== null && f > 22 * 60; };
/** Horas abertas por semana, somando todas as faixas. */
export const horasSemana = (h: Horario) => Math.round(DIAS.reduce((t, d) => t + h[d].reduce((s, f) => { const [a, b] = f.split('-'); return s + (min(b) + (b === '23:59' ? 1 : 0) - min(a)); }, 0), 0) / 60);

/** Resumo em uma linha: "Seg a sex, 6h às 23h · sáb, 9h às 17h · dom, 10h às 14h" */
export function horarioResumo(h: Horario): string {
  if (e24h(h)) return '24 horas, todos os dias';
  const grupos: { dias: string[]; texto: string }[] = [];
  for (const d of DIAS) {
    const texto = faixasDia(h[d]);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.texto === texto) ultimo.dias.push(d);
    else grupos.push({ dias: [d], texto });
  }
  const rot = (ds: string[]) => (ds.length === 1 ? cap(ds[0]) : ds.length === 2 ? `${cap(ds[0])} e ${ds[1]}` : `${cap(ds[0])} a ${ds[ds.length - 1]}`);
  return grupos.map((g) => `${rot(g.dias)}, ${g.texto}`).join(' · ');
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const dataCurta = (d: Date) => `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
export const dataLonga = (d: Date) => `${d.getUTCDate()} de ${MESES_LONGOS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
export const dataIso = (d: Date) => d.toISOString().slice(0, 10);

/** Data mais antiga entre as conferências: é ela que limita a confiança na ficha. */
export const conferidoEm = (a: Academia) => new Date(Math.min(...a.data.proveniencia.map((p) => p.conferido_em.getTime())));
export const nivelVerificacao = (a: Academia) => (a.data.proveniencia.some((p) => p.nivel === 'visita') ? 'visita' : a.data.proveniencia.some((p) => p.nivel === 'confirmado-com-a-academia') ? 'confirmado-com-a-academia' : 'fonte-publica');
export const fontesNomes = (a: Academia) => [...new Set(a.data.proveniencia.map((p) => p.fonte.replace('Página da unidade no ', '')))];
export const temComodidade = (a: Academia, termo: string) => a.data.comodidades.some((c) => c.toLowerCase().includes(termo));

/** Ordem dos planos, do mais barato ao mais caro, para comparar exigências. */
export const ORDEM_WELLHUB = ['Starter', 'Basic', 'Basic+', 'Silver', 'Silver+', 'Gold', 'Gold+', 'Platinum', 'Diamond'];
export const agregador = (a: Academia, nome: 'Wellhub' | 'TotalPass') => a.data.agregadores.find((g) => g.nome === nome);

export const urlAcademia = (a: Academia) => `/academias/${a.id}/`;
export const urlRegiao = (r: string) => `/regioes/${r}/`;

/** Link de WhatsApp com a origem no texto, para atribuir o contato sem depender de cookie. */
export function linkWhatsapp(ref: string): string {
  const texto = `Olá, Montinho! Vim pelo Onde Treinar Alphaville e quero saber como funciona o atendimento presencial. (ref: ${ref})`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}
export function linkMontinho(caminho: string, posicao: string, pagina: string): string {
  const p = new URLSearchParams({ utm_source: 'ondetreinaralphaville', utm_medium: 'referral', utm_campaign: 'portal', utm_content: `${posicao}-${pagina}` });
  return `https://www.montinhopersonal.com.br${caminho}?${p}`;
}

/** Dados enxutos para as ferramentas no navegador. */
export function paraFerramentas(lista: Academia[]) {
  return lista.map((a) => ({
    id: a.id,
    nome: a.data.nome,
    url: urlAcademia(a),
    regiao: a.data.regiao,
    regiaoNome: REGIOES[a.data.regiao].nome,
    bairro: a.data.bairro,
    tipo: a.data.tipo,
    endereco: a.data.endereco,
    geo: a.data.geo,
    modalidades: a.data.modalidades,
    horario: horarioResumo(a.data.horario),
    h24: e24h(a.data.horario),
    domingo: abreDomingo(a.data.horario),
    cedo: abreAntesDas6(a.data.horario),
    tarde: fechaApos22(a.data.horario),
    horasSemana: horasSemana(a.data.horario),
    estacionamento: temComodidade(a, 'estacionamento'),
    acessivel: a.data.comodidades.some((c) => /acess|cadeira de rodas/i.test(c)),
    comodidades: a.data.comodidades,
    wellhub: agregador(a, 'Wellhub')?.plano_minimo ?? null,
    wellhubNivel: agregador(a, 'Wellhub') ? ORDEM_WELLHUB.indexOf(agregador(a, 'Wellhub')!.plano_minimo) : null,
    totalpass: agregador(a, 'TotalPass')?.plano_minimo ?? null,
    mensalidade: a.data.mensalidade?.valor ?? null,
    conferido: dataCurta(conferidoEm(a)),
  }));
}
