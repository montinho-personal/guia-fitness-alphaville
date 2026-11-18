# Medição do Guia Fitness Alphaville

Atualizado em 17/11/2026.

## Como funciona

- **GA4 do guia:** `G-521B1BZGTR`, na variável `PUBLIC_GTM_ID` da Vercel (produção e preview). O código está em `src/layouts/Base.astro`.
- **Consentimento:** nada do Google carrega antes de o visitante clicar em "Aceitar" no aviso de cookies (Consent Mode v2, tudo negado por padrão). Quem recusa não é medido.
- **Todo link é medido** por um único ouvinte de clique (inclusive clique com o botão do meio). O nome do evento vem de `data-evento`, quando o link tem; se não tiver, sai do destino (tabela abaixo).
- **Agrupamento de conteúdo:** cada página vista leva `content_group` = primeira parte do endereço (`academias`, `guias`, `modalidades`, `regioes`, `ferramentas`, `montinho`, `inicio`...).

## Eventos

| Evento | Quando | Parâmetros principais |
|---|---|---|
| `clique_montinho` | Qualquer link para montinhopersonal.com.br | `ref`, `link_url`, `link_text`, `pagina` |
| `clique_whatsapp` | Links do WhatsApp (barra, blocos, páginas) | `ref` (página de origem), `pagina` |
| `clique_instagram` | Links do Instagram | `ref`, `pagina` |
| `clique_agregador` | Links para Wellhub/Gympass e TotalPass | `link_domain`, `link_url`, `pagina` |
| `clique_mapa_externo` | Rotas e mapas do Google | `ref`, `pagina` |
| `clique_youtube` / `video_montinho` | Links para o YouTube | `ref`, `pagina` |
| `clique_site_academia`, `clique_academia` | Site oficial e cartões de academia (onde marcados) | `ref`, `pagina` |
| `clique_saida` | Qualquer outro link externo (sites de academias, fontes) | `link_domain`, `link_url`, `link_text` |
| `clique_telefone`, `clique_email` | Links `tel:` e `mailto:` | `link_url` |
| `busca`, `busca_aberta`, `busca_clique` | Busca do site | `termo` e `search_term`, `resultados`, `destino` |
| `pergunta_aberta` | Pergunta frequente aberta (só nas listas de perguntas) | `pergunta`, `pagina` |
| `menu_aberto` | Menu do celular aberto | `pagina` |
| `vitrine_view`, `vitrine_cta_click`, `vitrine_resultados_click` | Vitrine de resultados do Montinho | `ref` |
| `calculadora_aberta` | Calculadora de custo aberta | `origem`: `direta`, `comparador`, `ficha` ou `exemplo` |
| `calculadora_simulacao` | Primeira simulação válida (custo mensal completo e frequência informada) | `cenarios` (quantidade) |
| `calculadora_comparacao` | Dois ou mais cenários completos | `cenarios` (quantidade) |
| `clique_montinho` com `ref=calculadora-cta` | CTA "Consultar atendimento presencial na minha região" | `ref` |
| `barra_whatsapp_fechada` | Barra do WhatsApp fechada | `pagina` |
| Ferramentas (comparador, teste, checklist, mapa, filtros) | Uso das ferramentas | ver cada página |

O GA4 ainda mede sozinho (medição otimizada): páginas vistas, rolagem até 90%, visualização de vídeo do YouTube incorporado (os players têm `enablejsapi=1`) e downloads.

## Links para o site do Montinho (atribuição no GA4 de lá)

Todos os links levam UTM no mesmo padrão dos links curtos do site do Montinho (`/l/guia-vitrine`, `/l/guia-resultados`):

| Parâmetro | Valor |
|---|---|
| `utm_source` | `guiafitnessalphaville` |
| `utm_medium` | `referral` |
| `utm_campaign` | posição do link: `bloco`, `rodape`, `servicos`, `video`, `vitrine`, `texto`, ou `link` (UTM posta na hora do clique em link sem UTM) |
| `utm_content` | página de origem (ex.: `academias-gavioes-24h-alphaville`, `montinho`, `site` no rodapé) |

O código monta os links com `linkMontinho()` (`src/lib/dados.ts`). Se algum link para o Montinho escapar sem UTM, o script da página põe a UTM no clique. A política de referência do site (`strict-origin-when-cross-origin`) também manda a origem `guiafitnessalphaville.com.br`.

## Para configurar no painel (Renato)

**GA4 do guia (`G-521B1BZGTR`):**
1. Administrador > Fluxos de dados > Guia Fitness Alphaville > Medição otimizada: deixar ligadas todas as opções (rolagens, cliques de saída, pesquisa no site, engajamento com vídeo, downloads, interações com formulários). Em "Pesquisa no site", o parâmetro é `q`.
2. Administrador > Definições personalizadas > Criar dimensões personalizadas (escopo Evento): `ref`, `pagina`, `link_domain`, `link_text`, `pergunta`, `termo`.
3. Administrador > Eventos: depois que aparecerem (até 24 h), marcar como **evento principal** `clique_whatsapp` e `clique_montinho`.
4. Administrador > Vincular ao Search Console (propriedade `https://guiafitnessalphaville.com.br/`).

**GA4 do site do Montinho (`G-J1ZSPMDJZE`):**
1. Relatórios > Aquisição > Aquisição de tráfego: filtrar "Origem da sessão" = `guiafitnessalphaville`. A "Campanha da sessão" mostra a posição do link e o "Conteúdo do anúncio manual" mostra a página do guia de onde a pessoa veio.
2. Para ver contatos vindos do guia: Explorar > nova exploração com "Origem da sessão" e os eventos principais do site do Montinho.
3. Em Administrador > Fluxos de dados > Configurar tag > Listar referências indesejadas: **não** incluir `guiafitnessalphaville.com.br`.

A calculadora não envia valores digitados nem dados de contato: só a origem da visita e a quantidade de cenários.

## clique_ferramenta (18/11/2026)

Clique nos atalhos e cartões de ferramenta dos artigos. `ref` = `<ferramenta>:atalho` ou `<ferramenta>:bloco` (ferramentas: custo, personal, beneficio, teste, comparador, checklist, mapa); `pagina` = caminho do artigo. Para ver no GA4 qual artigo mais leva às ferramentas, registre `ref` como dimensão personalizada.

## Academias abertas (18/11/2026)

| Evento | Quando | Parâmetros |
|---|---|---|
| `abertas_atalho` | Clique num atalho (Domingo, Antes das 6h, Depois das 22h, 24 horas, Feriados) | `atalho` |
| `abertas_busca` | Busca concluída (atalho, formulário, ajuste ou link) | `origem`, `dia`, `com_hora`, `regiao`, `resultados`, `a_confirmar`, `feriado` |
| `abertas_ajuste` | Clique num ajuste sugerido quando não há resultado | `ajuste` |
| `clique_academia` | Abertura da ficha a partir do resultado | `ref` = `abertas:<id>` |
| `clique_ferramenta` | Links para Wellhub e TotalPass, personal externo e calculadora; link da ficha e do comparador para o buscador | `ref` = `beneficio:abertas`, `personal:abertas`, `custo:abertas`, `abertas:ficha`, `abertas:comparador` |

## Diária e aula experimental (18/11/2026)

| Evento | Quando | Parâmetros |
|---|---|---|
| `acesso_modo` | Troca entre "Quero treinar hoje" e "Quero testar antes de contratar" | `modo` (`diaria` ou `teste`) |
| `acesso_diaria_busca` | Filtro de diária aplicado | `regiao`, `com_hora`, `so_preco`, `idas`, `resultados` |
| `acesso_teste_filtro` | Filtro de modalidade no caminho de teste | `modalidade` |
| `clique_acesso_academia` | Botão para o canal oficial da academia (comprar, consultar, agendar) | `ref` = `<tipo>:<id>` (com `:ficha` quando vem da ficha) |
| `clique_ferramenta` | Calculadora, horários e checklist a partir da ferramenta; link da ficha para a ferramenta | `ref` = `custo:diaria`, `abertas:diaria`, `checklist:experimental`, `diaria:ficha` |
| `clique_whatsapp` | WhatsApp do Montinho no card de aula experimental (intenção de contato) | `ref` = `acesso-experimental` ou `acesso-experimental-unidade`; o texto da mensagem não é enviado |

## Calculadora de preço de personal (18/11/2026)

| Evento | Quando | Parâmetros |
|---|---|---|
| `preco_personal_calculo` | Troca de local, formato ou frequência | `local`, `formato`, `freq`, `fallback` |
| `preco_personal_memoria` | Abertura de "Ver a conta, linha a linha" | — |
| `clique_ferramenta` | Links para a calculadora de custo e para personal externo | `ref` = `custo:preco-personal`, `personal:preco-personal` |
| `clique_whatsapp` / `clique_montinho` | Chamada do Montinho abaixo do resultado | `ref` = `preco-personal` |

## Teste presencial ou online (18/11/2026)

| Evento | Quando | Parâmetros |
|---|---|---|
| `formato_personal_inicio` | Primeira resposta marcada | — |
| `formato_personal_resultado` | Resultado exibido | `resultado` (`presencial`, `online`, `hibrido`, `ambos`), `conflitos` |
| `formato_personal_refazer` | Clique em "Refazer o teste" | — |
| `clique_whatsapp` | WhatsApp do Montinho no resultado (intenção de contato) | `ref` = `presencial-ou-online:<resultado>`; as respostas não são enviadas |
| `clique_ferramenta` | Próximos passos (preço, personal externo, aula experimental) | `ref` = `preco:presencial-ou-online` etc. |
