# Onde Treinar Alphaville

Portal local de academias, boxes e estúdios em Alphaville, Tamboré, Barueri e Santana de Parnaíba. Mantido por Montinho Personal Trainer.

**Estado:** construído e em pré-lançamento. Todas as páginas saem com `noindex` e o `robots.txt` bloqueia o rastreamento até a aprovação editorial. Ver [`docs/estado-atual.md`](docs/estado-atual.md).

## Rodar

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Antes de publicar qualquer mudança:

```bash
npm run verificar
```

`verificar` faz o build e roda a auditoria. Se houver erro bloqueante, sai com código 1.

## Como o projeto se organiza

| Caminho | O que é |
|---|---|
| `src/data/academias/*.yaml` | Uma ficha por academia. É a fonte dos dados locais: cada campo tem origem e data em `proveniencia` |
| `src/content/guias/*.md` | Guias e páginas de modalidade, com os campos de governança no cabeçalho |
| `src/content.config.ts` | Esquema dos dados. Campo obrigatório faltando faz o build falhar |
| `src/lib/dados.ts` | Regras derivadas dos dados (24 horas, horas por semana, links com origem) |
| `src/pages/` | Rotas |
| `scripts/auditoria.mjs` | Auditoria do build: metadados, links, órfãs, sitemap, schema, proveniência, similaridade |
| `scripts/corpus.mjs` | Baixa as páginas do Montinho e do Personal por Perto para a verificação de similaridade |
| `docs/` | Estratégia (Fase Zero), estado atual e relatório da auditoria |

## Publicar um conteúdo

1. Crie ou edite o arquivo da ficha ou do guia.
2. Preencha `proveniencia` (fonte, URL, data e nível) para todo dado local.
3. Avance o `status` conforme as etapas: `rascunho`, `em-pesquisa`, `em-revisao`, `aguardando-verificacao`, `aprovado`, `publicado`.
4. Preencha `revisor` com o nome de quem revisou.
5. Rode `npm run verificar`.

Só entra no build de produção o que está `aprovado` ou `publicado`.

## Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `PUBLIC_INDEXAVEL` | `true` libera a indexação. Só depois da aprovação editorial |
| `MOSTRAR_EM_REVISAO` | `true` inclui conteúdo ainda não aprovado (pré-visualização). Não pode ser `true` junto com `PUBLIC_INDEXAVEL=true` |
| `PUBLIC_GTM_ID` | Contêiner do Google Tag Manager. Vazio = sem medição e sem aviso de cookies |
| `PUBLIC_WHATSAPP` | Número do WhatsApp do Montinho, só dígitos |
| `PUBLIC_EMAIL_CONTATO` | E-mail público de contato e de privacidade |

## Regras que o código impõe

- Dado local sem fonte ou sem data: erro na auditoria.
- Título, descrição ou H1 repetido: erro.
- Link interno quebrado ou página órfã: erro.
- `Review`, `AggregateRating` ou `LocalBusiness` no JSON-LD: erro.
- Texto muito parecido com outra página do portal ou do ecossistema Montinho: erro acima do limite, aviso abaixo.
- Página de região só existe com três ou mais fichas.
