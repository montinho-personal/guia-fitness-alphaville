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
    // Detalhes do horário para o buscador de academias abertas (docs/horarios.md e src/lib/horarios.ts).
    // Dia com lista vazia em "horario" é "sem horário listado"; vira fechado só com horario_status.<dia> = 'fechado'.
    horario_status: z.object(Object.fromEntries(DIAS.map((d) => [d, z.enum(['fechado', 'a-confirmar']).optional()]))).partial().optional(),
    ultima_entrada: z.object(Object.fromEntries(DIAS.map((d) => [d, z.string().regex(/^\d\d:\d\d$/).optional()]))).partial().optional(),
    horario_fonte: z.object({ fonte: z.string(), url: z.string().url().optional(), conferido_em: data }).optional(),
    // Grade oficial genérica de feriados: aparece como "horário padrão de feriados" e nunca como resultado confirmado.
    horario_feriados: z.object({ faixas: z.array(faixa), fonte: z.string(), url: z.string().url().optional(), conferido_em: data }).optional(),
    // Horário oficial de uma data específica (feriado, fechamento temporário). Prevalece sobre a grade e os feriados.
    horario_excecoes: z.array(z.object({ data: z.string().regex(/^\d{4}-\d\d-\d\d$/), faixas: z.array(faixa), situacao: z.enum(['confirmada', 'a-confirmar']), motivo: z.string(), fonte: z.string(), url: z.string().url().optional(), conferido_em: data })).default([]),
    // Diária, aula ou treino experimental e visita guiada (docs/acesso-avulso.md e src/lib/acesso.ts).
    acesso_avulso: z.array(z.object({
      tipo: z.enum(['diaria', 'aula-experimental', 'treino-experimental', 'visita-guiada']),
      nome: z.string(),
      modalidades: z.array(z.string()).default([]),
      musculacao: z.boolean(),
      preco: z.object({ situacao: z.enum(['gratis', 'valor', 'a-partir-de', 'referencia-rede', 'a-consultar']), valor: z.string().optional(), centavos: z.number().int().optional() }),
      regras: z.array(z.string()).default([]),
      horario_acesso: z.string().optional(),
      horario_acesso_confirmado: z.boolean().default(false),
      destino: z.object({ tipo: z.enum(['compra', 'reserva', 'contato', 'pagina']), url: z.string().url(), canal: z.string().optional() }),
      situacao: z.enum(['confirmada', 'a-confirmar']),
      fonte: z.string(), url: z.string().url().optional(), conferido_em: data,
      pendencias: z.array(z.string()).default([]),
    })).default([]),
    modalidades: z.array(z.enum(MODALIDADES)).min(1),
    atividades_listadas: z.array(z.string()).default([]),
    comodidades: z.array(z.string()).default([]),
    // Wellhub e TotalPass por unidade. Ver docs/beneficios.md e src/lib/beneficios.ts.
    // planos: os planos que a página do TotalPass lista como "planos que dão acesso" (o Wellhub só publica o mínimo, "a partir do plano").
    // atividades: como a página do benefício lista; musculacao: se a musculação aparece entre elas.
    agregadores: z.array(z.object({
      nome: z.enum(['Wellhub', 'TotalPass']),
      situacao: z.enum(['confirmada', 'nao-aceita']).default('confirmada'),
      plano_minimo: z.string(),
      preco_plano: z.string(),
      url: z.string().url(),
      nota: z.string().optional(),
      planos: z.array(z.string()).optional(),
      atividades: z.array(z.string()).optional(),
      musculacao: z.boolean().optional(),
      condicoes: z.array(z.string()).default([]),
      conferido_em: data.optional(),
    })).default([]),
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
    // Política de personal externo (profissional de fora que atende um aluno na unidade). Ver docs/personal-externo.md.
    // Ausente = "a confirmar". Taxa só com valor quando a fonte publica; ausência de valor nunca vira R$ 0.
    personal_externo: z.object({
      status: z.enum(['aceita', 'aceita-com-condicoes', 'nao-aceita', 'a-confirmar']),
      condicoes: z.array(z.string()).default([]),
      taxa: z.object({
        situacao: z.enum(['confirmada', 'sem-taxa', 'pendente']),
        valor: z.string().optional(),
        centavos: z.number().int().nonnegative().optional(),
        quem_paga: z.enum(['aluno', 'profissional']).optional(),
        periodicidade: z.enum(['mes', 'aula', 'ida']).optional(),
        condicoes: z.string().optional(),
      }),
      abrangencia: z.enum(['unidade', 'rede']),
      fonte: z.string(),
      url: z.string().url().optional(),
      conferido_em: data,
      canal: z.string().optional(),
      nota: z.string().optional(),
      // A regra vale também para quem entra pelo Wellhub ou TotalPass? Sem confirmação explícita, fica a confirmar.
      beneficio: z.enum(['confirmada', 'a-confirmar']).default('a-confirmar'),
    }).optional(),
    // true quando o Montinho Personal Trainer, que mantém o guia, atende alunos no local. Exibido como aviso na ficha.
    montinho_atende: z.boolean().default(false),
    titulo_seo: z.string().max(65).optional(),
    perguntas: z.array(z.object({ p: z.string(), r: z.string() })).default([]),
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
    academia: z.string().optional(),
    perguntas: z.array(z.object({ p: z.string(), r: z.string() })).default([]),
    vitrine: z.object({ intro: z.string().min(40), destaque: z.string().optional() }).optional(),
    video: z.object({ id: z.string().regex(/^[\w-]{11}$/), titulo: z.string(), publicado_em: data.optional() }).optional(),
    lista_titulo: z.string().optional(),
    lista_modalidades: z.array(z.enum(MODALIDADES)).default([]),
    lista_tipos: z.array(z.enum(['academia', 'box', 'estudio'])).default([]),
    ...governanca,
  }),
});

export const collections = { academias, guias };
