# Rotina de QA das ferramentas (pedido do Renato, 26/11/2026)

Duas ferramentas por dia, na ordem da fila abaixo. Quando a fila acaba, recomeça do topo
(a mais antiga testada primeiro). Cada rodada segue o roteiro de `AGENTS.md`, seção
"Rotina diária de QA das ferramentas", e registra aqui a data, o que foi testado, os erros
achados e o que foi corrigido.

## Fila

| # | Ferramenta | URL | Lógica e testes | Última rodada |
|---|---|---|---|---|
| 1 | Calculadora de custo para treinar | `/ferramentas/custo-para-treinar-em-alphaville/` | `tests/custo.test.ts`, `tests/qa-ferramentas.test.ts` | 26/11/2026 |
| 2 | Calculadora de preço de personal | `/ferramentas/calculadora-preco-personal-alphaville/` | `src/lib/precoPersonal.ts`, `tests/preco-personal.test.ts`, `tests/qa-ferramentas.test.ts` | 26/11/2026 |
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

### Rodada 1 — 26/11/2026: custo para treinar e preço de personal

Especialistas: QA funcional (Playwright, desktop), mobile e acessibilidade (Pixel 7 e iPhone 13, WCAG 2.2 AA) e auditor de cálculos (referência independente, 11 casos de custo e 10 de preço).

**Erros achados e corrigidos (custo para treinar):**
- Arredondamento duplo: com idas fracionárias o ano e o custo por treino perdiam centavos (1×/semana + R$ 10 por ida: ano R$ 2.319,96 em vez de R$ 2.320,00; por treino R$ 44,61 em vez de R$ 44,62). Agora o ano e o custo por treino usam o valor sem arredondar.
- Aulas com personal guardadas travavam o resultado quando o personal passava a ser cobrado por mês (erro "não podem passar do total de idas" com o campo escondido). Agora as aulas só contam quando algo é cobrado por aula.
- Planos com "primeiro mês gratuito" (Smart Fit Black e Fit) somavam a mensalidade no 1º mês. Agora entram R$ 0 no 1º mês e 11 mensalidades no ano.
- Link `?personal=1` sem academia (botão da calculadora de preço de personal) abria sem personal; trocar o tipo de lugar apagava o personal.
- A URL perdia `personal`, `beneficio` e `exemplo` ao carregar; recarregar mudava o resultado.
- "Trocar" deixava o nome da academia antiga no título; + e − trocavam a vírgula por ponto.
- Valor sem teto (aceitava R$ 10^17) e plano à vista com 0,5 mês: agora teto de R$ 100.000 e meses inteiros de 1 a 36.
- Textos: a pergunta sobre taxa de personal externo dizia que as fichas não confirmam a regra (várias confirmam); "Como a conta é feita" dizia que o plano à vista entra uma vez no ano (entra quantas vezes fechar o ano).
- Acessibilidade: o rótulo "Treinos" controlava o botão "−" (tocar no texto diminuía o valor e o campo ficava sem nome); resultado redesenhado sem anúncio para leitor de tela (agora há um anúncio único); foco caía no topo ao remover um custo; grupos de rádio sem setas e com uma parada de Tab por opção; "pendente" com contraste 1,51:1; número da opção com 2,87:1; dica lida duas vezes.

**Erros achados e corrigidos (preço de personal):**
- "Referência de Barueri" aparecia com dois valores diferentes (Tamboré e Aldeia usam outra base): a base virou "Barueri, no entorno de Alphaville".
- No online, os botões de frequência pareciam desativados mas seguiam ativos: agora ficam desativados de fato.
- Anel de foco com contraste 2,87:1: trocado por cor mais escura.

**No site todo:** a barra fixa do WhatsApp escondia o campo focado ao navegar com Tab (`scroll-padding-bottom` no `html`); botão do Instagram com contraste 3,44:1 (cor mais escura); links do Montinho com âncora punham o UTM depois do `#` (rodapé "Personal presencial").

**Testes novos:** `tests/qa-ferramentas.test.ts` (5 testes; os de arredondamento e de aulas guardadas falhavam antes da correção). Reteste no navegador nos dois aparelhos: tudo passou, sem erro de JavaScript.

**Pendente (não corrigido nesta rodada):** os valores digitados (mensalidade, frequência, extras) ainda não vão para a URL, então um link compartilhado só leva as academias escolhidas e os parâmetros de entrada; a matrícula aparece como "R$ 120,00 → R$ 0,00/mês" no detalhe, o que pode confundir; as duas calculadoras contam 1×/semana de jeitos diferentes (4,33 idas no custo, 4 sessões no preço de personal, que arredonda as sessões). Fica para a próxima rodada de cada uma.
