# Calculadora Hyrox

Página: `/ferramentas/calculadora-hyrox/` (criada em 18/11/2026, pedido do Renato: "a melhor ferramenta, para gerar lead").

## O que faz

1. **Pesos por categoria.** Escolha de formato (individual, dupla, revezamento) e divisão; mostra a carga oficial das 8 estações. As três tabelas completas ficam no HTML, para o Google e para quem não usa JavaScript.
2. **Plano de prova.** Meta de tempo final + ritmo de corrida por km. A conta: corrida = 8 × ritmo; o que sobra da meta (menos as transições, se a pessoa reservar) é dividido por igual entre as 8 estações. Tempos próprios por estação são opcionais: as estações em branco dividem o resto e o total é refeito. Saída: três números (corrida, estações, média por estação) e a tabela trecho a trecho com a carga e a hora do relógio.
3. **Lead.** Depois do plano, cartão do Montinho com WhatsApp e mensagem pronta (categoria, meta e ritmo; nenhum dado de saúde). Há um segundo cartão fixo abaixo do formulário, para quem só veio ver os pesos. Os dois são rotulados como publicidade da casa.

O plano é **conta, não previsão**: a ferramenta não estima o tempo de ninguém nem publica tempo médio de prova (não há fonte oficial conferida). O aviso aparece no resultado.

## Fonte e limites

- Cargas e distâncias: `src/data/hyrox.json`, de https://hyrox.com/the-fitness-race/ (conferido em 18/11/2026). Pesos dos trenós incluem o trenó.
- **Não entram** por falta de fonte conferida: altura do alvo do Wall Balls, faixas etárias, divisões Pro de duplas, limite de tempo e a regra das transições (Roxzone). Os regulamentos em PDF ficam em `hyroxbrazil.com` e `maintain.hyrox.com`, que não abrem na rede do ambiente. Quando abrirem, conferir e completar.
- A página oficial tem um erro de digitação na dupla mista ("2×2 m Sled Push"); usamos 2 × 25 m, como nas outras divisões da mesma página.

## Onde atualizar

- **Cargas ou divisão nova:** `src/data/hyrox.json` (e a data `conferido_em`). Os textos e as perguntas frequentes leem daí.
- **Conta e mensagens:** `src/lib/hyrox.ts`, com testes em `tests/hyrox.test.ts`.
- **Link com estado:** `?cat=open-f&meta=1:30:00&ritmo=6:00` abre com o plano montado.

## Pesquisa no Google (SerpApi, 18/11/2026, celular, Barueri)

Evidência: `docs/pesquisa/serp/calculadora-hyrox-2026-11-18.json`. Buscas: "calculadora hyrox", "pesos hyrox categorias", "tempo médio hyrox".

**Formato:** em "calculadora hyrox" os primeiros lugares são ferramentas (decisão: a peça é ferramenta). Todas em inglês ou espanhol; nenhuma calculadora em português na primeira página. Em "pesos hyrox categorias" lidera o regulamento oficial em PDF, seguido de blogs de loja e box. Em "tempo médio hyrox" há vídeos curtos e três respostas do Facebook em inglês no topo.

**Concorrentes:** fracos em "calculadora hyrox" (app em subdomínio lovable.app, sites em inglês) e em "tempo médio hyrox" (páginas de respostas do Facebook). Médios em "pesos": PDF oficial, hugocross.com.br, ropestore.com.br.

**Visão de IA:** só apareceu em "tempo médio hyrox": parágrafo curto com o número em destaque, lista por categoria e um exemplo de ritmo ("Sub 90" a cerca de 6:45 por km), citando o site da HYROX Brasil e blogs. Termina oferecendo calcular com categoria e ritmo, que é o que a ferramenta faz. Não usamos os tempos médios (sem fonte oficial conferida); a resposta direta da página segue o mesmo molde com as cargas oficiais e um exemplo de conta.

| Dado do Google | O que mudou na página |
|---|---|
| AC "calculadora tempo hyrox" | Plano de prova por meta e ritmo; "tempo de prova" no título |
| AC "pesos hyrox open", "open masculino", "open feminino", "pro", "pro masculino", "masculino", "feminino", "oficial" | Seletor de divisão, tabela do individual e três perguntas frequentes (Open masculino, Open feminino, Pro) |
| AC "pesos hyrox dupla mista", "misto", "open misto"; REL "Pesos hyrox dupla mista" | Tabela de duplas e pergunta própria da dupla mista |
| PAA "Quais os pesos no HYROX?", "Qual é a carga oficial?", "Quais são os pesos para o HYROX Open masculino?" | Resposta direta com as cargas e a fonte oficial com data |
| PAA "Quais são as categorias do HYROX?" | Seção "Open ou Pro, sozinho ou em dupla?" com link para o guia de categorias |
| PAA "Quantos metros lunge HYROX?", "O que tem na prova de HYROX?" | Distância de cada estação na lista e pergunta "Quantos quilômetros se corre" |
| AC "tempo hyrox dupla", "pro", "misto", "hyrox open tempo" | O plano funciona para qualquer divisão; sem tempo médio por categoria (sem fonte) |
| Visão de IA: exemplo de ritmo para "Sub 90" | Pergunta "Que ritmo preciso para 1h30?", respondida com a conta da própria ferramenta |

Ficou de fora: "calculadora rox index" (sem fonte), "tempo hyrox sao paulo/sp" (resultado de evento), tempos médios (sem fonte oficial), "Como evoluir no HYROX?", "O que é o PFT da HYROX?", "tempo hyrox gym/training club", sugestões em espanhol e italiano. Destino de cada uma em `docs/seo/pauta.md`.
