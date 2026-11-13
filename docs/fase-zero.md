# Onde Treinar Alphaville — Fase Zero

Diagnóstico, estratégia e proposta visual para aprovação. Nada do portal foi implementado ainda.

Data da pesquisa: 13 de novembro de 2026.

> **Sobre a autoria deste documento.** As seções abaixo simulam a revisão crítica de várias disciplinas (SEO, conteúdo, design, engenharia, dados, compliance). Nenhum especialista humano participou ou aprovou este material.

---

## Resumo executivo

1. **O mercado é real, mas pequeno.** No Search Console do montinhopersonal.com.br, as cerca de 110 páginas sobre academias da região somaram **27.639 impressões e 244 cliques em 90 dias** — menos de 3 cliques por dia. O portal deve ser dimensionado para isso: poucas páginas excelentes, não centenas.
2. **O maior concorrente do novo portal é o próprio ecossistema Montinho.** O montinhopersonal.com.br já publica um guia de academias, um quiz de escolha, cerca de 40 perfis de academias, páginas de preço, de 24 horas e de "perto de". O personalporperto.com.br também cobre Six Alphaville, Hyrox local e personal em condomínio. Lançar o portal sem decidir o destino dessas páginas cria três domínios do mesmo dono disputando as mesmas buscas.
3. **A canibalização já acontece hoje.** Para "Six Alphaville", o Personal por Perto (1.092 impressões, 35 cliques, posição 6,5) e o Montinho (1.412 impressões, 18 cliques, posição 7,0) dividem a mesma SERP.
4. **A recomendação é consolidar, não somar.** O portal vira a casa única do conteúdo de descoberta de academias; o Montinho fica com serviço, método e contratação. As páginas equivalentes do Montinho são migradas uma a uma, com diagnóstico, depois que a versão do portal estiver publicada e for melhor.
5. **O diferencial possível é dado local verificado.** Ninguém na SERP publica, por academia, o dado com fonte e data de verificação. Os agregadores (Wellhub, TotalPass) dominam as buscas, mas mostram o preço do plano deles, não o da academia.

Há **seis decisões** que dependem de você, listadas na [seção final](#decisões-que-preciso-de-você).

---

## Como a pesquisa foi feita, e seus limites

| Fonte | O que foi usado | Limite |
|---|---|---|
| Repositório `guia-fitness-alphaville` | Leitura completa | Contém só um README; não há código a preservar |
| montinhopersonal.com.br | HTML bruto, sitemap (1.180 URLs), robots, llms.txt, 8 páginas | Não li as 1.180 páginas; amostra |
| personalporperto.com.br | HTML bruto, sitemap (1.402 URLs), robots, llms.txt, 5 páginas | Amostra |
| alphadl.com.br, direitodeverdade.com.br | Home, sitemap, robots, 2 páginas internas cada | Amostra pequena |
| Google Search Console | Propriedades do Montinho e do Personal por Perto, últimos 90 dias, via Supermetrics | Ver nota abaixo |
| SERP | 7 buscas via ferramenta de pesquisa web | A ferramenta é baseada nos EUA: os resultados não são a SERP que um morador de Alphaville vê, nem mostram o pacote local do Google Maps |
| Concorrentes | HTML de 4 páginas concorrentes | grupoguiaslocais.com.br não respondeu (erro 502) |
| Domínio | Consulta de disponibilidade no registro, via Vercel | Só consulta; nada foi registrado |

**Sem acesso nesta fase:** Google Keyword Planner, Google Trends, ferramentas pagas de SEO (Semrush, Ahrefs), GA4 e Bing Webmaster Tools. Por isso **não há volume de busca mensal nem dificuldade numérica** neste documento.

**Como ler os números do Search Console.** Impressão não é volume de busca: conta só as vezes em que uma página do Montinho apareceu. Para termos em que o site está na segunda página, a demanda real é maior do que a impressão sugere. A consulta de termos foi filtrada por expressão regular e limitada a 400 linhas. Os números servem para comparar termos entre si e como piso de demanda.

---

## A. Diagnóstico da oportunidade de mercado

### O que a demanda observada mostra

Agrupei as variações de cada busca (singular, plural, com e sem acento). Impressões e posição são do montinhopersonal.com.br, 90 dias.

| Grupo de busca | Impressões | Cliques | Posição típica | Leitura |
|---|---:|---:|---|---|
| Academia Gaviões Alphaville (8 variações) | 587 | 0 | 10–14 | Busca pela marca da academia. Quem busca quer o site ou o Maps da Gaviões |
| Six Alphaville (5 variações) | 333 | 2 | 6–11 | Idem, mas com dúvida de preço ("mensalidade") |
| Personal trainer Alphaville (4 variações) | 286 | 2 | 9–27 | Comercial. Pertence ao Montinho, não ao portal |
| Hyrox Alphaville (2 variações) | 276 | 21 | 3–4 | Melhor taxa de clique de todo o conjunto local |
| Academia(s) em Alphaville (6 variações) | 238 | 5 | 10–26 | O termo-pilar do portal. Montinho está entre a 1ª e a 3ª página |
| Hyrox Barueri (2 variações) | 193 | 21 | 3–4 | Idem Hyrox |
| Personal trainer Barueri (2 variações) | 189 | 1 | 10–14 | Comercial. Montinho |
| CrossFit Barueri / Alphaville (3 variações) | 187 | 2 | 8–11 | Modalidade com demanda local observável |
| Academia Santana de Parnaíba (4 variações) | 106 | 0 | 7–11 | Regional |
| Academia 24 horas Alphaville / Barueri (3 variações) | 106 | 1 | 7–11 | Recorte por atributo |
| Academia Iguatemi Alphaville (2 variações) | 45 | 0 | 10 | Recorte por ponto de referência |
| Musculação em Alphaville | 42 | 0 | 14 | Modalidade |
| Academia Aldeia da Serra | 41 | 0 | 8 | Regional, pequeno |
| Arena 18 / academia 18 do Forte (2 variações) | 39 | 0 | 7–8 | Pequeno demais para página própria |
| Academia perto de mim | 37 | 0 | 16 | Dominada pelo Maps; não é alvo realista |

Termos da sua lista de hipóteses **sem nenhuma evidência** nos dados: "academia com Wellhub Alphaville", "academia para iniciantes Alphaville" (8 impressões, sem o bairro) e "onde treinar em Alphaville". Isso não prova ausência de demanda — o Montinho pode simplesmente não aparecer para eles —, mas não há base para priorizá-los.

### Três conclusões do diagnóstico

**As buscas por nome de academia quase não geram clique.** A página do Montinho sobre a Gaviões teve 1.852 impressões e zero cliques; a da Smart Fit, 1.766 impressões e 3 cliques. Uma ficha de academia só ganha o clique se responder o que o site oficial não responde: preço real, lotação por horário, se aceita personal de fora, estacionamento.

**As buscas genéricas por academia são o alvo certo, e o Montinho ainda não as venceu.** Para "academia alphaville" a posição média é 26. Há espaço, mas é um espaço de dezenas de cliques por mês, não de milhares.

**Mecanismos de IA já consultam esse conteúdo.** Aparecem no Search Console consultas com formato de assistente, como "eu moro no brasil. encontre para mim opções de academias de musculação com horário de funcionamento bem amplo" e "quais são as principais diferenças entre essas duas redes de academia no dia a dia de treino (lotação, variedade de aparelhos e manutenção)?". São poucas, mas mostram quais atributos esses sistemas procuram: horário, preço, lotação, variedade de aparelhos.

### Expectativa realista

Todo o conjunto de academias no Montinho rende hoje cerca de 80 cliques por mês. Um portal novo, em domínio sem histórico, começa abaixo disso. O retorno precisa ser medido em **contatos qualificados**, e o volume será baixo: alguns por mês se tudo correr bem. Não há base para prometer mais.

---

## B. Concorrentes orgânicos

| Quem | O que é | Pontos fortes observados | Pontos fracos observados |
|---|---|---|---|
| Wellhub (páginas de parceiros) | Agregador | Domina as buscas por academia na região; endereço, modalidades e horários por unidade | Preço exibido é do plano Wellhub, não da academia; sem comparação; sem critério editorial |
| TotalPass | Agregador | Idem, menor presença | Idem |
| **rafaelpersonaltrainer.com.br** | Blog de outro personal da região | Guia de academias com 3.693 palavras, atualizado em 31/10/2026, com seção de fontes, Wellhub/TotalPass por academia, crossfit, FAQ. Site em Astro, com `BlogPosting` e autor | É uma página só; sem ferramentas; sem dados estruturados por academia |
| **montinhopersonal.com.br** | Site do Montinho | ~110 páginas no tema; posição 9–14 em vários termos | Ver seção de riscos |
| portalalphaville.com.br | Portal de bairro | Nome de domínio forte para o bairro | Página com 631 palavras, sem canonical, title e description idênticos, anúncios, lista antiga |
| baruerifacil.com.br | Diretório | 27 listagens | Diretório cru, sem dados estruturados, sem curadoria |
| br.fitfit.fitness | Diretório internacional | Avaliações de usuários com `AggregateRating` | Texto em português europeu ("ginásios"), genérico |
| solutudo, planetabrasileiro | Diretórios | — | Não analisados |

**Leitura.** O concorrente editorial mais sério é o guia do Rafael Personal Trainer, que tem a mesma estrutura de negócio que você pretende: conteúdo local que leva a um personal. Os diretórios são fracos. Os agregadores são fortes em autoridade, mas não comparam nem explicam. **Não existe hoje uma marca editorial local com dados por academia, datados e com fonte, mais ferramentas de comparação.** É esse o espaço.

Não medi o pacote local do Google Maps, que provavelmente absorve boa parte dos cliques dessas buscas.

---

## C. Posicionamento da marca

**Onde Treinar Alphaville é o guia local para decidir onde e como treinar na região. Cada informação tem fonte e data.**

Linha de assinatura proposta: **"Onde treinar, com fonte e data."**

| O portal é | O portal não é |
|---|---|
| Um guia de decisão: comparar, filtrar, entender | Um ranking de "melhores" sem critério |
| Uma base de dados local verificada | Um diretório raspado de agregadores |
| Transparente sobre quem o mantém | "Independente" no rótulo e funil no conteúdo |
| Útil para quem nunca vai contratar personal | Uma página de vendas disfarçada |

**Cinco compromissos editoriais**, publicados em `/metodologia`:

1. Todo dado local (preço, horário, endereço, estrutura) mostra a fonte e a data da última verificação. Dado não verificado aparece como "não confirmado" ou não aparece.
2. Nenhuma academia paga para aparecer ou para subir de posição. Se um dia houver patrocínio, ele é rotulado.
3. Não usamos "melhor" sem dizer para quem e por qual critério.
4. Só descrevemos visita presencial quando ela aconteceu, com a data.
5. O portal é mantido pelo Montinho Personal Trainer, que atende presencialmente na região. Isso está no rodapé de todas as páginas e em `/sobre`.

O compromisso 5 corrige um problema observado no Personal por Perto, que se apresenta como "portal editorial independente" e promove o Montinho em todas as páginas lidas sem declarar a propriedade.

**Tom de voz.** Direto, local, específico. Frases curtas. Fala de alamedas, acessos e horários reais. Sem promessa de resultado físico.

---

## D. Arquitetura editorial e mapa de clusters

### Estrutura de URLs

```
/                                   Home
/academias/                         Pilar A: guia com filtros e tabela
/academias/[academia]/              Ficha de cada academia (dados + análise)
/academias/24-horas/                Recorte por atributo
/academias/precos/                  Recorte por atributo
/academias/wellhub-totalpass/       Recorte por atributo
/regioes/                           Índice de regiões
/regioes/[regiao]/                  Pilar B por região
/modalidades/[modalidade]/          Pilar C por modalidade
/guias/[guia]/                      Clusters D e E: decisão e perfis
/ferramentas/                       Índice de ferramentas
/ferramentas/comparador/            Comparador de academias
/ferramentas/qual-academia/         Quiz
/ferramentas/checklist/             Checklist de visita
/mapa/                              Mapa de academias
/sobre/  /metodologia/  /politica-editorial/  /correcoes/  /privacidade/  /contato/
```

Regras:

- Uma URL por intenção. Variações de palavra ("academia em", "academias de", "melhores academias") vão para a mesma página.
- Barra final em todas as URLs, com redirecionamento 308 da versão sem barra.
- Filtros do guia e do comparador funcionam por parâmetro na URL, com canonical para a página sem parâmetro. Não geram páginas indexáveis.
- Sem páginas por residencial ou por condomínio. O Montinho tem cerca de 30; a maioria teve menos de 15 impressões em 90 dias.

### Mapa de clusters

| Cluster | Página-pilar | Páginas de apoio no lançamento | Evidência de demanda |
|---|---|---|---|
| A — Academias | `/academias/` | 12 fichas; 24 horas; preços; Wellhub/TotalPass | Forte (relativamente) |
| B — Regiões | `/regioes/` | Alphaville; Tamboré; Barueri; Santana de Parnaíba | Média |
| C — Modalidades | — | Musculação; CrossFit | Média para CrossFit; fraca para musculação |
| D — Decisão | — | Academia ou personal; como escolher | Fraca; valor comercial alto |
| E — Perfis | — | Começar a treinar; treinar perto do trabalho | Sem evidência; hipótese |
| F — Ferramentas | `/ferramentas/` | Comparador; quiz; checklist; mapa | Sem busca direta; valor de uso e de link |

**Regiões que não ganham página própria no lançamento:** 18 do Forte (39 impressões; vira seção de Alphaville) e Aldeia da Serra (41 impressões; entra quando houver pelo menos três academias verificadas).

**Hyrox fica fora do portal.** É o tema local com melhor desempenho, mas o Montinho já está na posição 3–4 e o Personal por Perto já tem cinco guias de Hyrox para localidades da região. Uma terceira página só dividiria o que já funciona. O portal cita Hyrox na página de CrossFit e aponta para o Montinho.

### Linkagem interna

- Cada ficha de academia liga para a sua região, suas modalidades e o comparador já preenchido com ela.
- Cada região liga para as fichas das academias de lá e para os recortes relevantes.
- Cada recorte liga de volta ao pilar e às fichas citadas.
- Guias de decisão ligam para ferramentas; ferramentas ligam para o guia que as explica.
- Os links saem do modelo de dados: se a academia X tem `regiao: tambore` e `modalidades: [musculacao, natacao]`, os links existem sem intervenção manual. Âncoras contextuais dentro do texto são escritas à mão.

---

## E. Os 20 primeiros conteúdos

**Dependência de pesquisa:** 🟢 pode ser escrito com fontes públicas · 🟡 precisa de verificação direta com as academias · 🔴 depende de levantamento novo, que pode não ser viável

"Sobreposição" indica a página equivalente que já existe no ecossistema e que entra na decisão 1.

| # | Conteúdo | URL | Cluster | Evidência | Sobreposição | Pesquisa |
|---:|---|---|---|---|---|---|
| 1 | Guia de academias de Alphaville e região | `/academias/` | A | 238 impr. | Montinho: `/academias-alphaville`, `/blog/10-melhores-academias-de-alphaville`, `/blog/academias-em-alphaville` | 🟡 |
| 2 | Ficha: Academia Gaviões 24h Alphaville | `/academias/gavioes-24h-alphaville/` | A | 587 impr. | Montinho | 🟡 |
| 3 | Ficha: Six Alphaville | `/academias/six-alphaville/` | A | 333 impr. | Montinho e Personal por Perto | 🟡 |
| 4 | Ficha: Smart Fit (unidades da região) | `/academias/smart-fit-alphaville/` | A | Página com 1.766 impr. | Montinho | 🟡 |
| 5 | Ficha: Bluefit (Alphaville, Tamboré, Barueri) | `/academias/bluefit-alphaville/` | A | Páginas com 1.568 + 512 + 136 impr. | Montinho (3 páginas) | 🟡 |
| 6 | Fichas: Bodytech, Ironberg, Fábrica Premium, SkyFit | `/academias/[…]/` | A | 410 a 956 impr. cada | Montinho | 🟡 |
| 7 | Fichas: 24 Wellness, VoiFit, Arena 18, NitroGym | `/academias/[…]/` | A | 103 a 312 impr. cada | Montinho | 🟡 |
| 8 | Academias 24 horas na região | `/academias/24-horas/` | A | 106 impr. | Montinho (3 páginas, uma por cidade) | 🟡 |
| 9 | Quanto custa academia em Alphaville | `/academias/precos/` | A | Página com 116 impr. | Montinho (3 páginas) | 🔴 |
| 10 | Academias que aceitam Wellhub e TotalPass | `/academias/wellhub-totalpass/` | A | Nenhuma | — | 🟢 |
| 11 | Onde treinar em Alphaville (inclui 18 do Forte) | `/regioes/alphaville/` | B | 238 impr. (compartilhada com o nº 1) | Montinho: `/blog/academias-perto-de-alphaville` | 🟡 |
| 12 | Onde treinar no Tamboré | `/regioes/tambore/` | B | Página com 46 impr. | Montinho | 🟡 |
| 13 | Onde treinar em Barueri | `/regioes/barueri/` | B | Páginas com 364 + 143 impr. | Montinho (4 páginas) | 🟡 |
| 14 | Onde treinar em Santana de Parnaíba | `/regioes/santana-de-parnaiba/` | B | 106 impr. | Montinho (4 páginas) | 🟡 |
| 15 | CrossFit e cross training na região | `/modalidades/crossfit/` | C | 187 impr. | Montinho: `/blog/crossfit-barueri` | 🟡 |
| 16 | Musculação: onde treinar e o que observar | `/modalidades/musculacao/` | C | 42 impr. | — | 🟢 |
| 17 | Academia, personal ou os dois: a conta em Alphaville | `/guias/academia-ou-personal/` | D | Fraca | Montinho: `/blog/academia-ou-personal-trainer` | 🟡 |
| 18 | Treinar na academia do condomínio: regras e quando faz sentido | `/guias/academia-do-condominio/` | D/E | Fraca | Montinho (2 páginas), Personal por Perto (1) | 🔴 |
| 19 | Comparador de academias | `/ferramentas/comparador/` | F | — | — | 🟡 |
| 20 | Quiz "qual academia combina com você" + checklist de visita | `/ferramentas/qual-academia/` | F | — | Montinho: `/academia-ideal-alphaville` | 🟡 |

São 20 linhas e cerca de 28 URLs, porque as linhas 6 e 7 agrupam oito fichas. O número final de fichas depende de quantas academias for possível verificar.

**Sobre os itens 🔴.** O item 9 só tem valor com preços confirmados por academia, com data. Isso exige ligar ou visitar; preços mudam e muitas academias não os publicam. Se não der para confirmar ao menos 8 academias, a página sai do lançamento. O item 18 só é diferente do que já existe se trouxer as regras reais de alguns residenciais para entrada de personal de fora. Sem esse levantamento, cancelar.

**Fila de expansão**, só com base em dados do portal depois de 60 dias: treinar perto do trabalho; começar a treinar; Aldeia da Serra; natação e piscina; mais fichas.

### Matriz de palavras-chave

A matriz completa, com as dez colunas pedidas, fica em planilha na Fase 1, quando houver Keyword Planner. O que dá para afirmar hoje:

| Palavra-chave | Intenção | Volume (fonte) | Dificuldade (método) | Potencial comercial | Página | Prioridade |
|---|---|---|---|---|---|---|
| academias em alphaville | Comercial-investigativa | 238 impr./90 d (GSC Montinho, piso) | Média: agregadores + 2 blogs de personal na 1ª página | Alto | nº 1 | 1 |
| [nome da academia] alphaville | Navegacional | 103–587 impr./90 d por marca | Alta para clique: site oficial e Maps | Baixo–médio | Fichas | 2 |
| academia 24 horas alphaville/barueri | Comercial | 106 impr./90 d | Baixa–média | Médio | nº 8 | 2 |
| crossfit barueri/alphaville | Comercial | 187 impr./90 d | Baixa–média | Médio | nº 15 | 3 |
| academia santana de parnaíba | Comercial | 106 impr./90 d | Baixa | Médio | nº 14 | 3 |
| quanto custa academia alphaville | Informacional-comercial | n/d; página com 116 impr. | Baixa | Alto | nº 9 | 2, se viável |
| academia tamboré | Comercial | n/d; página com 46 impr. | Baixa | Médio | nº 12 | 3 |
| academia com wellhub alphaville | Comercial | Sem evidência | Alta: Wellhub é a própria fonte | Baixo | nº 10 | 4 |
| personal trainer alphaville | Transacional | 286 impr./90 d | — | Alto | **Montinho, não o portal** | — |
| hyrox alphaville/barueri | Comercial | 469 impr./90 d | — | Alto | **Montinho, não o portal** | — |

"Dificuldade" aqui é julgamento qualitativo sobre quem ocupa a primeira página nas buscas que fiz. Não é métrica de ferramenta.

---

## F. Identidade visual e homepage

O protótipo está em [`docs/prototipo/homepage.html`](prototipo/homepage.html), com capturas em [desktop](prototipo/homepage-desktop.png) e [celular](prototipo/homepage-celular.png). Foi conferido por captura de tela em 390 px e 1280 px, sem rolagem horizontal; os links e o formulário são estáticos. Os dados de academias nele são ilustrativos, marcados como tal.

### Conceito

**Sinalização urbana.** Alphaville é um bairro de alamedas, portarias e placas. A identidade toma emprestada a linguagem de sinalização: blocos de cor chapada, tipografia grande, rótulos pequenos em caixa alta, linhas finas como as de um mapa. O efeito pretendido é de guia de cidade bem editado, não de blog de fitness.

### Logotipo

Um alfinete de mapa cujo miolo é uma anilha vista de frente (círculos concêntricos). Lê-se como "lugar" e como "treino" ao mesmo tempo, funciona em 16 px como favicon e em uma cor só. Ao lado, "onde treinar" em caixa baixa e peso forte, com "ALPHAVILLE" abaixo em caixa alta espaçada, como rótulo de placa.

### Paleta

| Nome | Hex | Uso |
|---|---|---|
| Tinta | `#12211B` | Texto, cabeçalho, rodapé |
| Papel | `#F5F1E8` | Fundo |
| Cartão | `#FFFDF8` | Superfícies |
| Alameda | `#1F6B4A` | Cor da marca: links, selos de verificação |
| Sinal | `#E2502A` | Ação e destaque; usado com parcimônia |
| Linha | `#D9D2C2` | Divisórias, bordas |
| Musgo claro | `#DCE8DF` | Fundos de apoio |

Contraste calculado: Tinta sobre Papel 14,8:1; Alameda sobre Papel 5,7:1; branco sobre Alameda 6,4:1; branco sobre Sinal 3,9:1. O último só passa na WCAG para texto grande, então **Sinal nunca recebe texto pequeno branco**: os botões usam Tinta como fundo e Sinal como detalhe. Os valores foram calculados pela fórmula da WCAG; o protótipo não passou por ferramenta de auditoria de acessibilidade nem por teste com leitor de tela.

### Tipografia

- **Bricolage Grotesque** (títulos, interface): grotesca com personalidade, larga, lembra letreiro. Fonte variável, 41 KB no subconjunto latino.
- **Newsreader** (texto corrido): serifada de leitura, feita para texto longo em tela. 58 KB.

Ambas têm licença aberta (OFL) e serão hospedadas no próprio domínio, com `font-display: swap` e pré-carregamento só da usada acima da dobra. O par é deliberadamente diferente do Montinho (DM Sans + Source Serif 4), para que os dois sites não pareçam o mesmo modelo com outra cor.

### Componentes do design system

Cabeçalho com busca · selo de verificação ("verificado em 12 nov 2026 · fonte") · cartão de academia · etiquetas de atributo · tabela comparativa com cabeçalho fixo · bloco de resposta direta · bloco de fontes · caixa de transparência comercial · chamada contextual para o Montinho · seletor de região · rodapé com metodologia.

### Estrutura da homepage

1. **Cabeçalho:** logotipo, Academias, Regiões, Modalidades, Guias, Ferramentas.
2. **Abertura:** título, uma frase de proposta e um localizador de três campos (região, o que você procura, faixa de preço) que leva ao guia filtrado. Sem carrossel, sem pop-up.
3. **Faixa de confiança:** três compromissos em uma linha e quem mantém o portal.
4. **Por região:** quatro cartões com contagem de academias verificadas.
5. **Academias:** seis cartões com dados e selo de verificação; link para o guia completo.
6. **Ferramentas:** comparador, quiz, checklist, mapa.
7. **Guias de decisão:** lista editorial numerada.
8. **Bloco Montinho:** "Já escolheu onde treinar? Falta decidir como." Rotulado como "Quem mantém este guia".
9. **Rodapé:** metodologia, política editorial, correções, privacidade, relação com o Montinho.

O bloco do Montinho aparece uma vez, depois do conteúdo útil. Não há botão flutuante de WhatsApp.

---

## G. Stack tecnológica

### Recomendação: Astro, saída estática, na Vercel

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Astro 5, geração estática | HTML completo sem JavaScript por padrão; você já mantém um site em Astro (Personal por Perto, v5.18) |
| Conteúdo | Coleções de conteúdo com esquema Zod; artigos em MDX | Os campos de governança (autor, revisor, fontes, status) viram obrigatórios: sem eles o build falha |
| Dados locais | Um arquivo YAML por academia no repositório | Cada campo guarda valor, fonte e data de verificação. Histórico auditável pelo Git |
| Interatividade | Ilhas com Preact, só no comparador, quiz e mapa | O resto do site vai sem JavaScript |
| Mapa | MapLibre ou Leaflet com OpenStreetMap, carregado ao clicar | Sem custo de API; a lista de academias fica no HTML como alternativa acessível |
| Estilo | CSS com variáveis; sem framework de componentes | Menos peso, identidade própria |
| Imagens | `astro:assets` (AVIF/WebP, dimensões fixas) | Evita deslocamento de layout |
| Leads | Link de WhatsApp com código de origem; formulário opcional em função serverless | Ver seção H |
| Medição | GTM + GA4 com Consent Mode v2, carregados após consentimento | LGPD |
| Qualidade | Scripts no build + GitHub Actions | Ver "Critérios de qualidade" |
| Deploy | Vercel, time "Montinho Personal Trainer" | Onde estão os outros projetos |

### Alternativa: Next.js

É o que Montinho, Alpha DL e Direito de Verdade usam. Vantagem: mesma base de três dos quatro sites, e mais fácil se o portal ganhar área logada ou painel. Desvantagem: envia mais JavaScript por padrão (a home do Montinho tem 57 tags `<script>`, a do Personal por Perto, 10), e exige disciplina para manter as páginas estáticas.

Para um portal de conteúdo com três ilhas interativas, Astro é a escolha mais leve e mais fácil de manter rápida. Se você prefere padronizar tudo em Next.js, é viável; o custo é atenção contínua a desempenho.

### O painel editorial

O prompt pede painéis de links, similaridade e pendências. Proponho que na primeira versão eles sejam **relatórios gerados no build** (um arquivo HTML e um JSON em `/relatorios`, fora do site público), não uma aplicação com login. Custa uma fração e entrega a mesma informação. Um painel de verdade entra no roteiro se o volume editorial justificar.

### Padrões dos sites auditados

**Reaproveitar:**

- Direito de Verdade: artigo com "Publicado em" e "Atualizado em", seção "Fontes" com a legislação citada, FAQ, "Leia também"; página `/sobre` com "Como produzimos o conteúdo" e "O que não somos"; `lastmod` do sitemap com datas distintas e plausíveis (18 datas em 111 URLs).
- Alpha DL: páginas de região com dado próprio ("o que a nossa carteira mostra", medianas de preço), schema `Place` em páginas de condomínio, áreas privadas bloqueadas no robots.
- Personal por Perto: parâmetros UTM por posição da chamada (`utm_content`), mensagem de WhatsApp pré-preenchida com a origem, banner de consentimento.
- Montinho: URLs com erro de digitação redirecionam com 308; URL inexistente devolve 404 real.

**Não repetir:**

- Montinho: 152 URLs do sitemap com o mesmo `lastmod`, que é o horário do build; `changefreq` e `priority` em todas as entradas (o Google ignora); schema `LocalBusiness` em todos os artigos; séries de páginas por residencial com a mesma estrutura.
- Personal por Perto: páginas de cidade com o mesmo esqueleto e parágrafos em que só muda o nome do lugar; faixas de preço sem fonte e diferentes entre páginas (R$ 60–200, R$ 80–200, R$ 100–250); "992 cidades" na home e "mais de 210" no llms.txt; rótulo de independência sem declarar o dono.
- Ambos: `llms.txt` desatualizado em relação ao site. Se o portal tiver um, ele é gerado no build a partir do conteúdo real. Não há evidência de que o arquivo influencie mecanismos de IA; o custo é baixo, a expectativa deve ser nenhuma.

---

## H. Integração comercial com o Montinho

### Princípio

O portal recomenda o Montinho onde a recomendação ajuda o leitor, sempre rotulada. Um visitante que nunca clicar no Montinho precisa sair com o que veio buscar.

### Onde a chamada aparece

| Contexto | Chamada | Formato |
|---|---|---|
| Home, depois do conteúdo | "Já escolheu onde treinar? Falta decidir como." | Bloco único |
| Guia "academia ou personal" | "Como funciona o acompanhamento presencial do Montinho" | Dentro do texto, no ponto em que a dúvida aparece |
| Ficha de academia que aceita personal de fora | "O Montinho atende nesta academia" | Uma linha, só quando for verdade e confirmado |
| Resultado do quiz, perfil "preciso de orientação" | "Precisa de ajuda para começar?" | Abaixo do resultado, separado dele |
| Rodapé | "Mantido por Montinho Personal Trainer" | Texto |

**Onde não aparece:** dentro dos resultados do quiz ou do comparador como se fosse uma academia; em botão flutuante; em pop-up; repetida várias vezes na mesma página.

### Regras para os links

- As chamadas em módulos repetidos usam `rel="nofollow"`. São publicidade da casa; marcá-las evita que um padrão de links entre domínios do mesmo dono seja lido como esquema.
- Links editoriais dentro do texto, quando o Montinho for de fato a melhor referência, são links normais. Poucos, com âncoras variadas.
- Nenhum canonical apontando para o Montinho.
- O Montinho não precisa linkar de volta em massa. Um link na página "Onde atendo" basta.

### Rastreamento de origem

- Links para o site: `utm_source=ondetreinaralphaville&utm_medium=referral&utm_campaign=portal&utm_content=[posição]-[página]`.
- WhatsApp: mensagem pré-preenchida "Olá, Montinho! Vim pelo Onde Treinar Alphaville (ref: [página])". O código no texto permite atribuir o contato mesmo sem cookie.
- Eventos no GA4: `clique_whatsapp`, `clique_montinho`, `uso_comparador`, `quiz_concluido`, `clique_academia`, `envio_formulario`. Os dois primeiros são conversões.
- "Contato qualificado" e "contratação" são registrados no CRM do Montinho (existe um caminho `/crm` no site), nunca inferidos pelo portal. O dashboard separa **observado** (cliques, eventos) de **confirmado** (CRM) de **estimado**.

### O quiz não favorece o Montinho

A pontuação é uma função aberta dos critérios que o usuário marcou e dos dados das fichas. O resultado mostra por que cada academia apareceu, critério a critério. O Montinho não é uma opção de resultado. A página de metodologia explica o cálculo.

---

## I. Riscos de SEO

### 1. Canibalização entre três domínios — risco alto, já em curso

| Tema | Montinho | Personal por Perto | Portal planejado |
|---|---|---|---|
| Guia de academias de Alphaville | 3 páginas | — | `/academias/` |
| Six Alphaville | 1.412 impr., 18 cliques | 1.092 impr., 35 cliques | Ficha |
| Hyrox Alphaville | 1.006 impr., 35 cliques | 681 impr., 10 cliques | Não criar |
| Personal em condomínio | 2 páginas | 1 página | Só com dado novo |
| Quiz de escolha de academia | `/academia-ideal-alphaville` | "Encontre seu Personal Ideal" | `/ferramentas/qual-academia/` |
| Perfis de academias | ~40 páginas | — | 12 fichas |

Sem um plano de consolidação, o portal divide com o Montinho um mercado de 244 cliques por trimestre. Ver decisão 1.

### 2. Páginas de entrada (doorway) — risco médio a alto

As políticas de spam do Google descrevem como doorway o uso de vários domínios ou páginas com variações de localidade que afunilam o usuário para um mesmo destino. Três sites do mesmo dono, com conteúdo local parecido, todos levando ao WhatsApp do Montinho, se encaixam nessa descrição se o conteúdo não tiver valor próprio.

Mitigação: valor independente real; propriedade declarada; chamada comercial rara e rotulada; nenhuma página por residencial; nenhuma página gerada por troca de nome de bairro; consolidação em vez de duplicação.

Um ponto fora do escopo deste projeto, mas relevante: o Montinho tem cerca de 30 páginas por residencial ou condomínio ("Personal Trainer Alphaville Residencial 1" a 12, "Tamboré 1" a 11 e outras), além de páginas para cidades fora da área de atendimento. A maioria teve menos de 15 impressões em 90 dias. Como o portal declarará vínculo com o Montinho, a qualidade percebida de um afeta o outro. Recomendo um diagnóstico separado dessas páginas. Não vou tocar nelas sem pedido seu.

### 3. Conteúdo duplicado ou reaproveitado — risco médio

O caminho fácil seria reescrever os perfis do Montinho. Isso é proibido pelo seu próprio briefing e seria detectável. As fichas do portal nascem do **modelo de dados** (campos verificados) mais uma análise curta escrita do zero. O controle de similaridade compara cada texto novo com o corpus do Montinho e do Personal por Perto antes de publicar.

### 4. Dados locais desatualizados — risco alto

Preço e horário errados destroem a única vantagem do portal. Cada campo tem data de verificação; passados 90 dias, o campo aparece como "verificado há mais de 3 meses" e entra no relatório de pendências. Nenhum preço ou horário é alterado por automação.

### 5. Uso de marcas e reputação de terceiros — risco médio

Citar o nome de uma academia para descrevê-la é uso legítimo. Não usar logotipos sem autorização, não usar fotos de terceiros, separar fato de opinião, e manter `/correcoes` com um canal para a academia contestar um dado. Sem `AggregateRating` nem `Review`: o portal não coleta avaliações autênticas de usuários. Sem `LocalBusiness` para as academias no lançamento; avaliar depois, com dados completos e visíveis na página.

### 6. Domínio novo — risco inerente

Um domínio sem histórico leva meses para ganhar confiança. As primeiras 8 a 12 semanas provavelmente terão poucas impressões. Isso é esperado e não justifica publicar mais páginas para compensar.

### 7. Pacote local do Google — limite estrutural

Para "academia perto de mim" e buscas por nome, o mapa do Google ocupa o topo. O portal não é elegível a Perfil da Empresa e não deve criar um.

### 8. Privacidade — risco baixo, obrigatório

Política de privacidade, consentimento antes de carregar GA4, formulário com o mínimo de campos, base legal declarada, sem dados sensíveis de saúde no quiz.

---

## J. Plano de desenvolvimento

| Etapa | Entrega | Critério para avançar |
|---|---|---|
| **0. Estratégia** (este documento) | Diagnóstico, arquitetura, proposta visual | Suas decisões |
| **1. Fundação de dados** | Esquema da ficha; planilha de verificação; 12 academias levantadas com fonte e data; matriz de palavras-chave com Keyword Planner | Pelo menos 10 academias com endereço, horário e modalidades confirmados |
| **2. Base técnica** | Projeto Astro; design system; modelos de página; SEO técnico; scripts de qualidade; deploy de pré-visualização | Build limpo; relatórios de qualidade funcionando |
| **3. Conteúdo do lançamento** | Pilar, fichas, regiões, recortes, guias, pelo pipeline editorial | Cada página aprovada nos 12 passos |
| **4. Ferramentas** | Comparador primeiro; depois quiz, checklist, mapa | Funcionam sem cadastro e sem JavaScript para o conteúdo básico |
| **5. Medição e privacidade** | GTM, GA4, consentimento, eventos, Search Console, Bing | Eventos conferidos em modo de depuração |
| **6. Auditoria e lançamento** | Relatório com aprovados, problemas, correções e pendências; domínio; sitemap enviado | Só o que foi realmente testado consta como aprovado |
| **7. Consolidação** | Migração página a página das equivalentes do Montinho, conforme a decisão 1 | Página do portal indexada e melhor que a original |

### Roteiro de 90 dias após o lançamento

- **Dias 1–30:** acompanhar indexação; corrigir o que o Search Console apontar; não publicar em volume. Primeira rodada de reverificação de preços.
- **Dias 31–60:** primeiras migrações do Montinho, começando pelas páginas com pior desempenho lá; contato com as academias para confirmar dados e avisar que foram citadas, o que também é a fonte legítima de links locais.
- **Dias 61–90:** revisar a matriz com dados do próprio portal; decidir a fila de expansão; avaliar se a presença de dois domínios aumentou ou só redistribuiu os cliques.

---

## Critérios de qualidade

### Pipeline editorial

`rascunho → em pesquisa → em revisão → aguardando verificação → aprovado → publicado → atualização necessária`

O status é um campo do arquivo. O build só publica o que está `aprovado` ou `publicado`. Cada artigo carrega os campos do item 19 do seu briefing; faltando qualquer um, o build falha.

### Verificações automáticas no build

| Verificação | Bloqueia? |
|---|---|
| Campos obrigatórios e status | Sim |
| Title, description e H1 únicos em todo o site | Sim |
| Links internos quebrados | Sim |
| Página órfã (sem link de entrada) | Sim |
| Sitemap só com URLs canônicas indexáveis | Sim |
| JSON-LD válido e coerente com a página | Sim |
| Dado local sem fonte ou sem data | Sim |
| Similaridade alta com outra página do portal | Sim, até revisão |
| Similaridade alta com Montinho ou Personal por Perto | Sim, até revisão |
| Links externos quebrados | Avisa |
| Dado local verificado há mais de 90 dias | Avisa |
| Página com poucos links internos | Avisa |

### Controle de originalidade

Dois sinais, nenhum tratado como prova:

1. **Similaridade textual:** sequências de palavras compartilhadas entre o texto novo e (a) o resto do portal, (b) o corpus do Montinho e do Personal por Perto, baixado dos sitemaps públicos.
2. **Similaridade semântica:** proximidade de significado entre páginas, para apanhar duas URLs com a mesma intenção escritas com palavras diferentes.

Acima do limite, a página vai para revisão humana. Os limites são calibrados com exemplos reais na Etapa 2, não chutados agora. Verificação de plágio contra a web aberta exige ferramenta externa (Copyscape ou similar), que não está disponível neste ambiente; fica registrada como pendência.

### O que só uma pessoa pode fazer

Confirmar preço e horário com a academia. Visitar. Aprovar o texto final. Nenhuma dessas etapas é simulada.

---

## Decisões que preciso de você

1. **O que fazer com as ~110 páginas de academias do Montinho.**
   - **(a) Consolidar no portal — recomendado.** Cada página do Montinho é redirecionada (301) para a equivalente do portal depois que esta estiver publicada, indexada e for melhor. Páginas sem equivalente ficam onde estão. Custo: o Montinho abre mão de cerca de 80 cliques por mês nesse tema, que passam ao portal ao longo do tempo, com alguma perda na transição.
   - **(b) Coexistir.** Os dois sites mantêm suas páginas. Mais simples agora; divide um mercado pequeno e aumenta o risco de doorway.
   - **(c) Não criar o domínio.** Reorganizar o guia dentro do Montinho, que já tem autoridade e posição. É a opção de menor risco e maior retorno no curto prazo. Perde-se a marca editorial separada.

   Se o objetivo principal é gerar contatos nos próximos seis meses, (c) é a escolha mais segura. Se é construir um ativo editorial local de longo prazo, (a).

2. **Quiz de academia:** mover o do Montinho para o portal (recomendado) ou criar outro?
3. **Stack:** Astro (recomendado) ou Next.js?
4. **Identidade visual:** aprovar, ajustar ou refazer a proposta do protótipo.
5. **Domínio:** `ondetreinaralphaville.com.br` constava como disponível na consulta de 13/11/2026. Registrar no Registro.br exige CPF ou CNPJ do titular; sugiro o mesmo titular dos outros domínios. Confirme a titularidade antes de configurarmos.
6. **Verificação de campo:** quem confirma preços e horários com as academias? Sem isso, as fichas saem só com o que é público e a página de preços não existe.

---

## Fontes

**Dados próprios**

- Google Search Console, propriedades `https://www.montinhopersonal.com.br/` e `https://www.personalporperto.com.br/`, últimos 90 dias até 13/11/2026, via Supermetrics.
- Sitemaps, robots.txt, llms.txt e HTML de montinhopersonal.com.br, personalporperto.com.br, alphadl.com.br e direitodeverdade.com.br, lidos em 13/11/2026.

**Concorrentes e SERP**

- [Academias em Alphaville: preços, horários e qual escolher — Rafael Personal Trainer](https://rafaelpersonaltrainer.com.br/blog/melhores-academias-em-alphaville/)
- [Academias em Alphaville — Portal Alphaville](https://portalalphaville.com.br/index.php/academias-em-alphaville)
- [Academias em Barueri — Barueri Fácil](https://www.baruerifacil.com.br/guia/esporte/academias.asp?c=39)
- [Scelta Alphaville — FitFit](https://br.fitfit.fitness/pt/i/2839-scelta-alphaville/)
- [VoiFit Academia Alphaville — Wellhub](https://wellhub.com/pt-br/search/partners/voifit-academia-alphaville-empresarial-18-do-forte-barueri)
- [SkyFit Academia Alphaville — Wellhub](https://wellhub.com/pt-br/search/partners/skyfit-academia-alphaville-alphaville-industrial/)
- [Templo SA Alphaville — Wellhub](https://wellhub.com/pt-br/search/partners/templo-sa-alphaville-alphaville-industrial-barueri)
- [Academia Gaviões 24h Alphaville — Wellhub](https://wellhub.com/pt-br/search/partners/academia-gavioes-24h-alphaville-alphaville-industrial/)
- [Smart Fit Alphaville II — TotalPass](https://totalpass.com/br/academias/smart-fit-alphaville-ii/)
- [NitroGym inaugura academia no Shopping Tamboré — Mercado & Consumo](https://mercadoeconsumo.com.br/23/07/2026/servicos/nitrogym-inaugura-academia-de-3-mil-m%c2%b2-no-shopping-tambore-em-barueri/)
- [Personal trainers em Alphaville — Superprof](https://www.superprof.com.br/personal-trainer-eefe-usp-alphaville-aldeia-serra-cond-fisico-musculacao-movement-culture.html)
