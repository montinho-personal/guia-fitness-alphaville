# Calculadora de preço de personal trainer

Página: `/ferramentas/calculadora-preco-personal-alphaville/` (criada em 18/11/2026, pedido do Renato).
No mesmo espírito da calculadora do Personal por Perto, escrita para Alphaville. Para outras cidades, a página linka a de lá.

## De onde vem cada número

| Número | Origem | Como aparece |
|---|---|---|
| Faixas de Alphaville, Barueri e Santana de Parnaíba (avulsa, pacote mensal, online) | Estimativas editoriais por perfil de cidade do Personal por Perto, informadas pelo Renato em 18/11/2026. **Não há amostra.** | "Referência editorial"; nunca "preço médio", nunca valor exato |
| Tamboré e Aldeia da Serra | Sem faixa própria: usam a referência de Barueri | Aviso na tela ("Referência de Barueri: …") |
| Taxa de personal externo (Ironberg R$ 1.000/mês, Arena 18 R$ 400/mês, pagas pelo profissional) | Campo `personal_externo` das fichas, com a fonte de cada uma | Texto e pergunta frequente; não entra na faixa |
| Preços reais de personais da região | O guia não tem nenhum coletado | A seção "De onde vêm as faixas" diz isso |

Ficou de fora por falta de fonte: taxa de condomínio para personal, preço de personal em rede de academia, preço de estúdio. A visão de IA do Google cita "R$ 70 a R$ 160 por sessão": não é fonte de fato e não foi usada.

## Onde atualizar

- **Faixas e locais:** `src/data/preco-personal.json`. Para dar faixa própria ao Tamboré ou à Aldeia, crie a base e aponte o local para ela, tirando o `motivo`.
- **Conta e arredondamento:** `src/lib/precoPersonal.ts`, com testes em `tests/preco-personal.test.ts`.
- **Quando houver preços reais:** troque a base, diga na página quantos são, de quando e a fonte, e passe a usar "mediana" no lugar de "faixa de referência".

## Regras da conta

- Sessões por mês = vezes por semana × 52 ÷ 12, arredondado (1× ≈ 4, 2× ≈ 9, 3× ≈ 13, 4× ≈ 17, 5× ≈ 22).
- 2 e 3 vezes por semana: vale a faixa do pacote. 1, 4 e 5 vezes: aula no pacote (mensal ÷ 11) × sessões, marcada como extrapolação.
- Arredondamento único: dezena até R$ 1.000; cinquentena acima.
- Online é mensal e não muda com a frequência.
- A referência não distingue condomínio, academia e domicílio. O formato muda os avisos sobre custos em volta, não a faixa.
- Cálculo no navegador, sem servidor e sem IA. Memória de cálculo linha a linha na tela.

## O que cada intenção de busca mudou (SerpApi, 18/11/2026)

Evidência: `docs/pesquisa/serp/calculadora-preco-personal-2026-11-18.json` (8 créditos) e a busca de 17/11 em `calculadora-custo-2026-11-17.json`.

| Dado do Google | O que mudou |
|---|---|
| "personal trainer alphaville preço": orgânicos fracos (páginas fora do ar, site genérico de orçamento com "calcule o preço") e páginas do Montinho; mapa com personais | A página compete como ferramenta local; título com "calculadora" e "preço" |
| "quanto custa personal trainer alphaville" (17/11): site do Montinho em 7 de 9 | Título e H1 em "calculadora de preço", não em "quanto custa"; chamada do Montinho logo abaixo do resultado |
| Visão de IA de preço: pede local, frequência e objetivo para refinar | Os três seletores da ferramenta (local, formato, frequência) |
| Visão de IA de condomínio: "verifique as regras do condomínio" (cadastro, limite na sala) | Seção "Personal no condomínio" e pergunta frequente, sem valor de taxa |
| PAA "Quanto custa treinar com personal?", "Quanto custa um personal trainer 3 vezes por semana?", "Vale a pena pagar um personal trainer?" | Perguntas frequentes |
| AC (17/11) "por mês", "online", "na smart fit" | Cartão "por mês", formato online, pergunta sobre a Smart Fit (sem preço) |
| PAA "Quanto custa uma academia de condomínio?" | Fora: custo de montar academia, outro assunto |
| PAA "tributação para personal", "quanto ganha", "melhor personal online" | Fora: intenção de profissional ou sem fonte |
| "calculadora preço personal trainer": resultados para o profissional (apps, tabela de preços) | Fora: a ferramenta é para quem contrata |
| Nomes de personais e faixa "R$ 70 a R$ 160" na visão de IA | Fora: o guia não lista profissionais nem usa a IA como fonte |
