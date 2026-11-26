# Rotina de QA das ferramentas (pedido do Renato, 26/11/2026)

Duas ferramentas por dia, na ordem da fila abaixo. Quando a fila acaba, recomeça do topo
(a mais antiga testada primeiro). Cada rodada segue o roteiro de `AGENTS.md`, seção
"Rotina diária de QA das ferramentas", e registra aqui a data, o que foi testado, os erros
achados e o que foi corrigido.

## Fila

| # | Ferramenta | URL | Lógica e testes | Última rodada |
|---|---|---|---|---|
| 1 | Calculadora de custo para treinar | `/ferramentas/custo-para-treinar-em-alphaville/` | `tests/custo.test.ts` | — |
| 2 | Calculadora de preço de personal | `/ferramentas/calculadora-preco-personal-alphaville/` | `src/lib/precoPersonal.ts`, `tests/preco-personal.test.ts` | — |
| 3 | Calculadora Hyrox | `/ferramentas/calculadora-hyrox/` | `src/lib/hyrox.ts`, `src/data/hyrox.json`, `tests/hyrox.test.ts` | — |
| 4 | Treino na academia do condomínio | `/ferramentas/treino-academia-do-condominio/` | `src/lib/treinoCondominio.ts`, `tests/treino-condominio.test.ts` | — |
| 5 | Academia perto de casa ou do trabalho | `/ferramentas/academia-perto-de-casa-ou-do-trabalho/` | `src/lib/caminho.ts`, `tests/caminho.test.ts` | — |
| 6 | Buscador Wellhub e TotalPass | `/academias/wellhub-totalpass/` | `tests/beneficios.test.ts` | — |
| 7 | Academias abertas (domingo e 24h) | `/ferramentas/academias-abertas-alphaville/` | `tests/horarios.test.ts` | — |
| 8 | Diária e aula experimental | `/ferramentas/academias-diaria-aula-experimental-alphaville/` | `tests/acesso.test.ts` | — |
| 9 | Academias que aceitam personal externo | `/ferramentas/academias-que-aceitam-personal-externo/` | `tests/personal.test.ts` | — |
| 10 | Personal presencial ou online | `/ferramentas/personal-presencial-ou-online/` | `tests/formato-personal.test.ts` | — |
| 11 | Qual academia combina com você | `/ferramentas/qual-academia/` | sem teste próprio | — |
| 12 | Comparador de academias | `/ferramentas/comparador/` | sem teste próprio | — |
| 13 | Checklist de visita | `/ferramentas/checklist/` | sem teste próprio | — |
| 14 | Academia perto de... (shoppings e estações) | `/academias/perto-de/` | sem teste próprio | — |
| 15 | Preços das academias | `/academias/precos/` | sem teste próprio | — |

## Registro das rodadas

(cada rodada acrescenta um bloco: data, ferramentas, especialistas acionados, erros achados com a prova, correções, testes novos, resultado do reteste)
