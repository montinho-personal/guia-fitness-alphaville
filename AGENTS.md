# Regras para agentes (Guia Fitness Alphaville)

Leia também o `CLAUDE.md` (pesquisa no SerpApi: aparelho, região, cota, evidência) e o `README.md` (como publicar). Tudo o que está lá continua valendo; este arquivo junta as regras da rotina de revisão.

## Regras editoriais que valem em toda peça

- **Fato só com fonte:** site oficial ou dois veículos independentes. Wellhub e TotalPass valem para endereço, horário, comodidades e plano mínimo. Print e visão de IA do Google **não são fonte**: dizem o que as pessoas perguntam.
- **Nunca citar CREF, CONFEF nem "conselho regional/federal de Educação Física".**
- **Nada sobre Alpha DL nem sobre o site "Viver em Alphaville".**
- **Sem preço de personal** que não possa ser conferido (exceção, pedido do Renato em 18/11/2026: a calculadora de preço de personal usa faixas de **referência editorial**, sempre rotuladas assim, nunca "preço médio" nem valor exato; ver `docs/calculadora-preco-personal.md`); sem promessa de resultado; saúde de idoso e gestante sempre com liberação médica.
- **Transparência:** o guia é mantido pelo Montinho Personal Trainer; o bloco dele é publicidade e isso aparece no texto. Ele só atende na Arena 18 entre as academias; nunca dizer que atende em outra.
- **Tom:** português do Brasil, frases curtas, sem jargão, sem emojis.
- **Canibalização:** antes de escrever, conferir no acervo (slug, título e páginas, com hífen e acento normalizados) se já existe página para a busca. Se existir, o tema vira seção ou FAQ dela.
- **H2 e FAQ** saem do que as pessoas buscam (autocompletar, "As pessoas também perguntam", "Outras pessoas pesquisaram"), respondidos só com fato que tem fonte.
- **Data de atualização** (`atualizado_em`) só muda com mudança real de conteúdo.
- **Evidência:** JSON enxuto de cada busca em `docs/pesquisa/serp/<pagina>-<data>.json` (sem `page_token` nem links do serpapi.com) e uma tabela no log do dia dizendo o que cada dado mudou no texto.

## Regra do que fica de fora (regra do Renato, 16/11/2026)

Toda revisão ou artigo novo com pesquisa termina separando as buscas que ficaram de fora em três grupos, com o motivo de cada uma:

1. **Vale um artigo:** o site não cobre e cabe no tema do site. Entra na parte 1 de `docs/seo/pauta.md`.
2. **Vira seção de um artigo existente:** dizer qual página. Entra na parte 2 da pauta.
3. **Não cabe:** pessoa, marca sem fonte, promessa, outro serviço, outra cidade, fora do tema.

Ao publicar ou revisar algo da pauta, riscar a linha (`~~assim~~`) e anotar o slug. **Pauta é sugestão: nada é escrito sem o Renato escolher**, exceto as revisões da rotina diária abaixo, que ele já autorizou.

## Rotina diária de revisão

Roda uma vez por dia (tarefa agendada às 10h23 de Brasília; o montinhopersonal.com.br roda às 15h41). **N = 2 artigos por dia** (pedido do Renato, 17/11/2026), um depois do outro.

1. **Escolher a peça.** Primeiro a próxima linha não riscada da parte 4 de `docs/seo/pauta.md` (revisões pendentes, em ordem de publicação). Quando acabar: páginas com impressões no Search Console e CTR baixo ou posição entre 5 e 20 nos últimos 28 dias. O Search Console ainda não está ligado a este site; enquanto não estiver, seguir só a pauta.
2. **Pesquisar no SerpApi** como o `CLAUDE.md` descreve: `"device":"mobile"`, região Barueri; a cidade da página quando for página de cidade ou bairro (Santana de Parnaíba, Tamboré); São Paulo quando o assunto for geral, sem recorte local (ex.: estações do Hyrox). Orçamento por peça: a busca principal (página + autocompletar = 2 créditos), mais 1 se a visão de IA vier em duas etapas. Busca secundária só se a principal vier fraca (sem perguntas nem outras pesquisas). Não repetir busca já feita (ver `docs/pesquisa/serp/`).
3. **Reescrever** seguindo as regras editoriais acima. Guardar a evidência e registrar o que mudou.
4. **Título e descrição: só proposta**, no formato ATUAL / PROPOSTA / MOTIVO. Nunca trocar sem o Renato aprovar.
5. **Publicar:** `npx astro check`, `npx astro build` e `node scripts/auditoria.mjs`, comparando com as falhas e avisos que já existiam (não criar erro novo). Depois PR, merge, deploy de produção na Vercel e conferir a página no ar.
6. **Responder em português, curto:** os links; as intenções separadas por tipo (autocompletar, "As pessoas também perguntam", "Outras pessoas pesquisaram", visão de IA com o que diz e quem cita, quem ranqueia), com ✅ no que entrou e ❌ no que ficou de fora; a separação do que ficou de fora nos três grupos; e as propostas de título e descrição que esperam aprovação.
7. **Se o SerpApi responder sem cota, com erro de chave ou fora do ar: parar e avisar o Renato.** Não revisar às cegas e não pedir print sem ele concordar.

## Ferramentas, calculadoras e simuladores (regra do Renato, 17/11/2026)

Toda ferramenta (calculadora, comparador, teste, checklist, mapa, simulador) é tratada como página de busca: o objetivo é posicionar bem e trazer acesso.

1. **Antes de criar ou reformular uma ferramenta, pesquisar no SerpApi** como manda o `CLAUDE.md` (celular; Barueri ou a cidade da página; São Paulo para assunto geral): a busca principal e até duas secundárias com as formas como as pessoas pedem aquela conta ou comparação.
2. **Usar as intenções no texto em volta da ferramenta:** título, H1, resposta direta, "como usar", perguntas frequentes e links. O conteúdo fica no HTML inicial; a ferramenta em JavaScript não substitui o texto.
3. **Ver o formato que ranqueia:** se os primeiros resultados são calculadoras, a página compete como ferramenta; se são tabelas ou listas, a página precisa também de tabela ou lista com dados das fichas.
4. **Não disputar busca com o site do Montinho:** onde o montinhopersonal.com.br já ocupa os primeiros lugares (ex.: preço de personal em Alphaville), a ferramenta do guia linka para ele e não tenta ranquear no mesmo termo.
5. **Guardar a evidência** em `docs/pesquisa/serp/` e responder ao Renato com as intenções por tipo (✅/❌) e a separação do que ficou de fora, como nos artigos. Título e descrição de ferramenta já publicada: só proposta.
6. As ferramentas já publicadas sem pesquisa entram na parte 4 da pauta e são revisadas pela rotina diária.


**Ferramentas nos artigos (18/11/2026):** todo artigo leva às ferramentas do próximo passo, já preenchidas com o contexto da página. Regras e tabela em `docs/ferramentas-nos-artigos.md`; a lógica fica em `src/lib/ferramentas.ts`.

## Rotina diária de QA das ferramentas (pedido do Renato, 26/11/2026)

Duas ferramentas por dia, na ordem da fila de `docs/qa/ferramentas.md`. Cada ferramenta passa por três especialistas, que trabalham em paralelo (subagentes, cada um com só o seu papel e os arquivos da ferramenta):

1. **Engenheiro de QA (funcional):** abre a ferramenta no navegador (Playwright, Chromium já instalado) contra o build local (`npx astro build` e `npx astro preview`). Clica em todo botão, preenche todo campo e seletor (o seletor do site abre por `select._selBtn.click()` e depois `.sel-op`), testa valores limite (zero, vazio, negativo, máximo, texto onde vai número), links e o estado da URL. Anota erro de console e de rede.
2. **Especialista em mobile e acessibilidade:** a mesma ferramenta em celular (Pixel 7 e iPhone 13 do Playwright): nada estoura a largura, botão com área de toque suficiente, teclado numérico em campo de número, contraste, foco visível, rótulos lidos por leitor de tela. Captura de tela só para conferência dele (deviceScaleFactor 1).
3. **Auditor de cálculos:** refaz as contas à mão, de forma independente, com pelo menos 5 casos (comuns e limites), e confere cada dado usado contra a fonte que a ficha ou o JSON cita (preço, horário, carga oficial, plano). Conta que não bate, arredondamento errado ou dado desatualizado é erro.

Depois:

4. **Executar os testes automatizados** (`npm run verificar`) e comparar com a base (0 erros; avisos conhecidos).
5. **Corrigir** cada erro achado, com teste novo em `tests/` que falharia antes da correção sempre que o erro for de lógica.
6. **Repetir** os três testes depois das correções, até tudo passar. Erro que depende de fonte bloqueada ou de decisão do Renato não é "corrigido" no chute: vai para o registro e para a resposta.
7. **Registrar** a rodada em `docs/qa/ferramentas.md` (data na fila e bloco no registro) e **publicar** como as outras rotinas (PR, merge, deploy de produção, conferir no ar). Rodada sem erro também é registrada.
8. **Responder em português, curto:** as 2 ferramentas com link, o que cada especialista testou, erros achados e corrigidos (com a prova), o que ficou pendente e por quê.

Sem busca no SerpApi nesta rotina (não é revisão de SEO). Título e descrição: só proposta, como sempre.

## Cota do SerpApi

Uma conta para todos os sites do Renato, em plano pago (1.000 buscas por mês). A conta do mês está no `CLAUDE.md`: a soma das rotinas passa da cota por decisão do Renato (17/11/2026, "segue tudo para todos"). Esta rotina gasta 2 a 3 créditos por revisão (busca secundária só se a principal vier fraca), cerca de 120 a 180 por mês com 2 revisões por dia. **Quando o SerpApi disser que a cota acabou, parar na hora e avisar o Renato**; ele decide se aumenta o plano ou espera a renovação.

## Rotinas agendadas deste site

- **Revisão diária**, 10h23 de Brasília (`trig_01Se8d5oL529gaMjSDVo3GPJ`): a rotina descrita acima, 2 artigos por dia.
- **Monitor mensal de visão de IA e ideias**, dia 16 às 14h42 (`trig_015zdMwMGvRiyPXbkRXT6CGD`): mantém `docs/seo/visao-de-ia.md` e manda as ideias para `docs/seo/pauta.md`.
- **QA diário das ferramentas**, 15h17 de Brasília (`trig_018xYQi93XqyLtQjSxAMTikA`): a rotina acima, 2 ferramentas por dia (fila em `docs/qa/ferramentas.md`).
- Uma segunda revisão diária (11h23, `trig_01Vmz6ruQGhFSYELRqq8Jrv4`), criada em 17/11 pela conversa do Direito de Verdade, foi desligada para não duplicar a de 10h23.

## Capas

O site não tem capa por artigo: todas as páginas usam `public/og.png`. Não criar capa improvisada. Se um dia houver padrão de capa e faltar crédito para fazer no padrão, publicar sem capa e anotar em "Capas pendentes" na pauta.

## Destaque da casa (regra do Renato, 18/11/2026)

A academia com `montinho_atende: true` na ficha (hoje a Arena 18) vem sempre em primeiro nas listas de academias e nos resultados das ferramentas, sempre com o selo "Destaque · publicidade da casa".
- **Ordem:** a ordem padrão sai de `academias()` (`ordemComDestaque` em `src/lib/dados.ts`).
- **Listas de cartões:** usam `comDestaque()`.
- **Ferramentas:** cada uma põe o destaque na frente da sua própria ordenação.
- **Dados:** as ferramentas só mostram a academia como aberta, compatível ou dentro do plano quando os dados confirmam; o destaque muda a ordem, não os dados.
- **Transparência:** a exceção está declarada em `/sobre/`, `/metodologia/`, `/politica-editorial/` e no teste.
