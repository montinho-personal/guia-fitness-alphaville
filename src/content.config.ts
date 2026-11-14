import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const STATUS = ['rascunho', 'em-pesquisa', 'em-revisao', 'aguardando-verificacao', 'aprovado', 'publicado', 'atualizacao-necessaria'] as const;
export const REGIOES = ['alphaville', 'barueri', 'santana-de-parnaiba'] as const;
export const MODALIDADES = ['musculacao', 'crossfit', 'cross-training', 'funcional', 'lutas', 'danca', 'bike', 'pilates', 'hiit', 'hyrox', 'eletroestimulacao', 'yoga', 'corrida', 'natacao', 'esportes-de-areia'] as const;
const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const;
const data = z.coerce.date();
const faixa = z.string().regex(/^\d\d:\d\d-\d\d:\d\d$/);

// Campos de governança exigidos em todo conteúdo. Faltando um, o build falha.
const governanca = {
  status: z.enum(STATUS),
  status_fatos: z.enum(['pendente', 'fonte-publica-conferida', 'confirmado-com-a-fonte', 'verificado-no-local']),
  status_originalidade: z.enum(['pendente', 'original-sem-verificacao-externa', 'verificado']),
  autor: z.string().min(3),
  revisor: z.string().nullable(),
  publicado_em: data,
  atualizado_em: data,
};

const academias = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/academias' }),
  schema: z.object({
    nome: z.string(),
    regiao: z.enum(REGIOES),
    bairro: z.string(),
    tipo: z.enum(['academia', 'box', 'estudio']),
    rede: z.string().optional(),
    resumo: z.string().min(40).max(200),
    endereco: z.string(),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    horario: z.object(Object.fromEntries(DIAS.map((d) => [d, z.array(faixa)])) as Record<(typeof DIAS)[number], z.ZodArray<z.ZodString>>),
    modalidades: z.array(z.enum(MODALIDADES)).min(1),
    atividades_listadas: z.array(z.string()).default([]),
    comodidades: z.array(z.string()).default([]),
    agregadores: z.array(z.object({ nome: z.enum(['Wellhub', 'TotalPass']), plano_minimo: z.string(), preco_plano: z.string(), url: z.string().url(), nota: z.string().optional() })).default([]),
    // Só preencher com valor confirmado. null = não confirmada.
    // valor: o menor preço mensal publicado para um plano regular da unidade.
    mensalidade: z.object({
      valor: z.string(),
      resumo: z.string(),
      planos: z.array(z.object({ nome: z.string(), preco: z.string(), condicoes: z.string() })).min(1),
      abrangencia: z.enum(['unidade', 'rede']),
      fonte: z.string(),
      url: z.string().url(),
      conferido_em: data,
      aviso: z.string().optional(),
    }).nullable(),
    site: z.string().url().optional(),
    telefone: z.string().optional(),
    // Todo dado local precisa de origem e data. Ver scripts/auditoria.mjs.
    proveniencia: z.array(z.object({
      campos: z.array(z.string()).min(1),
      fonte: z.string(),
      url: z.string().url().optional(),
      conferido_em: data,
      nivel: z.enum(['fonte-publica', 'confirmado-com-a-academia', 'visita']),
    })).min(1),
    // true quando o Montinho Personal Trainer, que mantém o guia, atende alunos no local. Exibido como aviso na ficha.
    montinho_atende: z.boolean().default(false),
    divergencias: z.array(z.string()).default([]),
    pendencias: z.array(z.string()).default([]),
    analise: z.array(z.string()).min(1),
    ...governanca,
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string().max(70),
    descricao: z.string().min(70).max(165),
    h1: z.string(),
    resposta: z.string().min(80),
    cluster: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
    secao: z.enum(['academias', 'modalidades', 'guias']),
    palavra_chave: z.string(),
    intencao: z.string(),
    fontes: z.array(z.object({ titulo: z.string(), url: z.string().url() })).default([]),
    cta: z.enum(['nenhum', 'montinho-contextual']).default('nenhum'),
    cta_titulo: z.string().optional(),
    cta_texto: z.string().optional(),
    cta_destino: z.string().startsWith('/').optional(),
    lista_ids: z.array(z.string()).default([]),
    video: z.object({ id: z.string().regex(/^[\w-]{11}$/), titulo: z.string(), publicado_em: data.optional() }).optional(),
    lista_titulo: z.string().optional(),
    lista_modalidades: z.array(z.enum(MODALIDADES)).default([]),
    lista_tipos: z.array(z.enum(['academia', 'box', 'estudio'])).default([]),
    ...governanca,
  }),
});

export const collections = { academias, guias };
