# Teste "Personal presencial ou online?"

Página: `/ferramentas/personal-presencial-ou-online/` (criada em 18/11/2026, pedido do Renato).
No mesmo espírito da ferramenta do Personal por Perto, com perguntas, regras e textos próprios e o recorte de Alphaville. Não havia página com a mesma intenção (o guia "academia ou personal" trata de outra decisão).

## Como funciona

- 9 perguntas: experiência, execução, dor ou restrição, presença, correção por vídeo, agenda, local de treino, o que mais precisa e peso do valor.
- Cada resposta soma pontos para o presencial, para o online ou para os dois (`PERGUNTAS` em `src/lib/formatoPersonal.ts`).
- Quatro resultados: presencial, online, híbrido e "os dois podem funcionar". Só aponta um formato com diferença de pelo menos 3 pontos (`MARGEM`).
- Híbrido: quando a necessidade pede presença (iniciante, insegurança, dor, quer correção na hora ou não aceita vídeo) e a rotina não deixa (agenda difícil ou fora da região).
- O valor mensal tem peso baixo e não entra na conta de quem não tem autonomia para treinar sozinho; o resultado avisa.
- Conflitos entre as respostas aparecem na tela. Não há porcentagem.
- Dor, lesão ou restrição: aviso para falar com o médico antes, em qualquer formato.
- Cálculo no navegador; as respostas não são enviadas nem guardadas.

## Onde atualizar

- **Perguntas, pesos e textos dos motivos:** `src/lib/formatoPersonal.ts`, com testes em `tests/formato-personal.test.ts`.
- **Mensagem do WhatsApp do Montinho por resultado:** `mensagemResultado()` no mesmo arquivo.
- **Faixas de preço da tabela e das perguntas:** vêm de `src/data/preco-personal.json` (referência editorial da calculadora de preço).

## O que cada intenção de busca mudou (SerpApi, 18/11/2026)

Evidência: `docs/pesquisa/serp/presencial-ou-online-2026-11-18.json` (7 créditos).

| Dado do Google | O que mudou |
|---|---|
| "personal trainer online ou presencial" (São Paulo): orgânicos fracos (blogs de academias de BH e Juiz de Fora, uma página em espanhol, páginas com erro) | Prioridade alta; título com "presencial ou online" |
| Visão de IA: decide por experiência, dor ou lesão, rotina e autonomia; vantagens e desvantagens em lista; cita o trânsito no deslocamento | Perguntas do teste (incluída a de dor), tabela lado a lado e resposta direta no mesmo formato |
| Visão de IA: registro profissional | Fora: regra do site |
| "personal trainer online alphaville" (Barueri): site do Montinho em 8 de 10, mapa com personais | Título em "presencial ou online", não em "personal online alphaville", para não disputar com o site do Montinho; CTA dele no resultado |
| PAA "Quanto é um personal trainer online?" | Pergunta frequente com a faixa de referência da calculadora |
| PAA "É vantajoso pagar um personal trainer?"; AC "vale a pena", "como funciona" | Perguntas frequentes |
| AC "ao vivo" | Coberto na pergunta "como funciona" (correção por vídeo); sem seção própria |
| AC "grátis", "barato", "mulher", cursos e certificação; PAA de tributação, plural e faculdade | Fora: sem fonte ou intenção de profissional |
