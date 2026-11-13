# Estado atual e relatório de qualidade

Data: 13 de novembro de 2026. Etapas 1 a 5 do plano da [Fase Zero](fase-zero.md), executadas com as opções recomendadas: consolidar no portal, Astro, identidade do protótipo.

O portal está construído e funciona, mas **não está pronto para indexação**. O que falta depende de pessoas, não de código.

## O que existe

45 páginas geradas, 44 no sitemap.

| Tipo | Quantidade | Exemplos |
|---|---:|---|
| Fichas de academias | 20 | `/academias/gavioes-24h-alphaville/` |
| Guia com filtros | 1 | `/academias/` |
| Recortes | 2 | `/academias/24-horas/`, `/academias/wellhub-totalpass/` |
| Regiões | 4 | `/regioes/`, `/regioes/alphaville/`, `/regioes/barueri/`, `/regioes/santana-de-parnaiba/` |
| Modalidades | 3 | `/modalidades/`, `/modalidades/crossfit/`, `/modalidades/musculacao/` |
| Guias de decisão | 3 | `/guias/`, `/guias/como-escolher-academia/`, `/guias/academia-ou-personal/` |
| Ferramentas | 5 | comparador, teste, checklist, mapa, índice |
| Institucionais | 5 | sobre, metodologia, política editorial, correções, privacidade |
| Outras | 2 | home, 404 |

Também são gerados `sitemap.xml`, `robots.txt` e `llms.txt`.

### De onde vêm os dados das fichas

Das páginas públicas de cada unidade no Wellhub (18 academias) e no TotalPass (3), lidas em 13/11/2026: endereço, coordenadas, horário por dia, atividades, estrutura informada e plano mínimo. Cada ficha registra a fonte, a URL e a data.

Onde as fontes divergem, a ficha mostra as duas versões. Exemplos: o Templo SA aparece como "Hybrid Fitness" no Wellhub e com horário diferente no TotalPass; a Academia 24h Premium tem horário publicado das 5h às 23h.

## Mudanças em relação ao plano da Fase Zero

| Planejado | Feito | Motivo |
|---|---|---|
| Fichas de Six, Ironberg, Fábrica Premium, 24 Wellness, Arena 18, NitroGym | Não criadas | Não encontrei página pública conferível com endereço e horário. Estão listadas no guia como "ainda sem ficha" |
| Página do Tamboré | Dentro da página de Alphaville | Só uma academia do Tamboré tem ficha; a regra é três por região |
| Quanto custa academia em Alphaville | Não criada | Nenhuma mensalidade foi confirmada. Era dependência 🔴 |
| Treinar na academia do condomínio | Não criada | Depende de levantar as regras de cada residencial. Era dependência 🔴 |
| Painel editorial | Relatório gerado pela auditoria | Como previsto na Fase Zero |
| Formulário de contato | Links de WhatsApp com a origem no texto | Evita coletar dados pessoais e manter um backend. O e-mail aparece se `PUBLIC_EMAIL_CONTATO` for preenchido |
| Matriz de palavras-chave com Keyword Planner | Não feita | Sem acesso à ferramenta |

## Testes executados

Só consta aqui o que foi realmente rodado.

### Aprovados

| Teste | Como | Resultado |
|---|---|---|
| Build | `astro build` | 45 páginas, sem erros |
| Auditoria do build | `scripts/auditoria.mjs` | 0 erros bloqueantes. Relatório em [`auditoria-build.md`](auditoria-build.md) |
| Metadados | Auditoria | Título, descrição e H1 únicos em todas as páginas; um H1 por página; canonical igual à URL |
| Links internos | Auditoria | 1.694 links verificados, nenhum quebrado, nenhuma página órfã |
| Sitemap | Auditoria | 44 URLs, todas existentes; toda página indexável está no sitemap; `lastmod` vem da data do conteúdo |
| Dados estruturados | Auditoria | JSON-LD válido em todas as páginas; `Article`, `BreadcrumbList` e `ItemList` apontam para URLs existentes; sem `Review`, `AggregateRating` ou `LocalBusiness` |
| Proveniência | Auditoria | As 20 fichas têm fonte e data para endereço, horário, modalidades e agregadores |
| Similaridade interna | Auditoria, sequências de 5 palavras | Maior valor entre textos editoriais: 23% (duas unidades da Smart Fit). Limite de bloqueio: 30% |
| Similaridade com o ecossistema | Auditoria, contra 116 páginas do Montinho e do Personal por Perto | Maior valor: 11%. As sequências coincidentes são endereço e horários da Smart Fit Barueri |
| Rotas | Navegador automatizado | 44 URLs com HTTP 200 |
| Responsividade | Navegador automatizado, 390 px e 1280 px | Nenhuma página com rolagem horizontal |
| Filtros do guia | Navegador automatizado | Região, modalidade, 24 horas, combinação sem resultado e filtros via URL funcionam |
| Comparador | Navegador automatizado | Monta a tabela com 13 linhas e atualiza a URL |
| Teste de afinidade | Navegador automatizado | Cinco critérios retornaram as duas academias corretas, conferidas à mão contra os dados |
| Checklist | Navegador automatizado | Marcações persistem após recarregar |
| Navegação por teclado | Navegador automatizado | O primeiro foco é "Pular para o conteúdo"; o menu do celular abre |
| Privacidade | Navegador automatizado | Sem `PUBLIC_GTM_ID`, nenhuma requisição externa e nenhum aviso de cookies; os eventos ficam só na `dataLayer` |
| Erros de JavaScript | Navegador automatizado | Nenhum |
| Lighthouse (servidor local, emulação de celular) | Lighthouse 12, três páginas | Desempenho 99–100, acessibilidade 100, boas práticas 100. LCP 1,5–1,6 s, CLS 0–0,015, TBT 0 ms. Peso total por página: cerca de 110 KB |

A nota de SEO do Lighthouse ficou em 66 porque as páginas estão com `noindex`, de propósito. O único item de acessibilidade apontado (rótulo do logotipo) foi corrigido depois da medição e não foi medido de novo.

### Não testados

- **Core Web Vitals reais.** O Lighthouse mede em laboratório, contra um servidor local. Os números de campo (percentil 75) só existem com o site no ar e com tráfego.
- **Mapa.** O código carrega o Leaflet e os marcadores, mas os servidores de imagem do OpenStreetMap não são acessíveis deste ambiente. Precisa ser conferido em um navegador comum.
- **Carregamento do GTM e do GA4.** Sem ID configurado, só o caminho "sem medição" foi testado.
- **Cabeçalhos de segurança.** Estão em `vercel.json`, mas só valem na Vercel. A política de conteúdo (CSP) precisa ser conferida no primeiro deploy, principalmente com o GTM ligado.
- **Leitor de tela.** Não houve teste com NVDA ou VoiceOver.
- **Links externos.** A auditoria lista os 50 destinos, mas não verifica se respondem.
- **Validador de dados estruturados do Google.** O JSON-LD foi validado por estrutura, não pela ferramenta do Google.
- **Plágio contra a web aberta.** Exige ferramenta externa.
- **Compartilhamento e impressão do checklist.** Dependem do sistema do usuário.

## Problemas encontrados e corrigidos durante a construção

1. **Fichas parecidas demais entre si.** A primeira auditoria mediu até 44% de sequências em comum entre fichas, por causa de frases de modelo repetidas. Removi as frases repetidas, e a auditoria passou a medir o texto editorial separado dos blocos de dados. O maior valor caiu para 23%.
2. **Títulos longos.** 37 páginas passavam de 65 caracteres por causa do sufixo da marca. O sufixo agora só entra quando cabe.
3. **Afirmações que os dados não sustentavam.** Conferi os textos contra os dados e corrigi dez frases, entre elas "a entrada mais barata do guia" (havia empate) e "abre uma hora antes da maioria" (não era a maioria).
4. **Página com poucos links.** A de musculação recebia um link só; agora recebe de cinco páginas.
5. **Hierarquia de títulos** em `/ferramentas/`.
6. **Migalhas coladas na borda** no celular.

## Pendências para o lançamento

Em ordem de dependência.

1. **Revisão humana de todo o conteúdo.** As 20 fichas e os 4 guias estão em `aguardando-verificacao`, sem revisor. A linha de assinatura de cada página mostra "Revisão humana: pendente". Nada deve ser indexado antes disso.
2. **Confirmar dados com as academias.** Mensalidade, regras para personal de fora e os itens de "O que ainda não confirmamos" de cada ficha. É o que transforma o guia em algo que os agregadores não têm.
3. **Levantar as academias sem ficha**, começando pelas de maior procura observada: Six, Ironberg, Fábrica Premium.
4. **Privacidade.** Incluir identificação do controlador (nome ou razão social, CPF ou CNPJ) e e-mail do encarregado, e submeter a revisão jurídica. A página mostra esse aviso na pré-visualização.
5. **Domínio.** Registrar `ondetreinaralphaville.com.br` e apontar para a Vercel. Não foi registrado.
6. **Medição.** Criar a propriedade GA4 e o contêiner GTM, preencher `PUBLIC_GTM_ID`, marcar `clique_whatsapp` e `clique_montinho` como conversões, e verificar o domínio no Search Console e no Bing Webmaster Tools.
7. **E-mail de contato** em `PUBLIC_EMAIL_CONTATO`.
8. **Ligar a indexação:** `PUBLIC_INDEXAVEL=true` e `MOSTRAR_EM_REVISAO=false`, depois dos itens 1 e 4.
9. **Consolidação com o Montinho** (Etapa 7 da Fase Zero), página a página, só depois de as equivalentes do portal estarem indexadas. Nada foi alterado no montinhopersonal.com.br.

## Riscos em aberto

- **Fonte única.** Todas as fichas dependem de agregadores. Se o dado deles estiver errado, o do guia também está. O selo diz "conferido em fonte pública", não "confirmado".
- **Fichas sem a informação que gera clique.** A Fase Zero mostrou que buscas por nome de academia quase não geram clique sem dado exclusivo. Enquanto não houver mensalidade e lotação, as fichas repetem o que o agregador já mostra, organizado de outro jeito.
- **Cobertura parcial.** Faltam academias conhecidas. Um morador pode achar o guia incompleto.
- **Canibalização.** Enquanto a consolidação não acontecer, portal e Montinho têm páginas sobre os mesmos temas. Com o portal em `noindex`, o risco hoje é nulo; passa a existir no lançamento.
- **Uso de marcas.** As fichas citam nomes de academias para identificá-las, sem logotipos nem fotos. Uma academia pode pedir alteração; o canal é `/correcoes/`.

## Eventos de medição implementados

Ficam na `dataLayer` e só saem do navegador com consentimento e com o GTM configurado.

| Evento | Quando |
|---|---|
| `clique_whatsapp` | Clique em link de WhatsApp |
| `clique_montinho` | Clique para o site do Montinho |
| `clique_academia` | Clique em um cartão de academia |
| `clique_site_academia`, `clique_mapa_externo` | Saída para o site da academia ou para o Google Maps |
| `uso_filtro_guia` | Uso dos filtros do guia |
| `uso_comparador` | Comparação montada |
| `quiz_concluido` | Teste concluído |
| `checklist_compartilhado`, `mapa_carregado` | Uso das outras ferramentas |

Cada evento leva `ref` (posição ou ficha) e `pagina`. Os links para o Montinho levam UTM, e a mensagem do WhatsApp leva a página de origem no texto.
