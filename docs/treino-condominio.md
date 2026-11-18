# Simulador de treino na academia do condomínio

Página: `/ferramentas/treino-academia-do-condominio/` (criada em 18/11/2026, pedido do Renato).

## O que faz

1. A pessoa marca os equipamentos do espaço (16 opções, em quatro grupos), os dias por semana (2 a 5), a experiência e, se quiser, o lugar e a região.
2. O simulador mostra seis grupos de movimento (empurrar, puxar, agachar, levantar do chão, abdômen e cardio), cada um como **bem coberto**, **dá para adaptar** ou **falta equipamento**, com até três exercícios possíveis.
3. Mostra os dois equipamentos que mais melhorariam a cobertura (para pedir ao condomínio ou ter em casa).
4. Monta um esqueleto da semana: corpo inteiro com 2 ou 3 dias; parte de cima e pernas com 4 ou 5 (no de 5, um dia de cardio). Os exercícios se alternam entre os dias.
5. Lead: cartão do Montinho com WhatsApp e mensagem pronta (lugar, região, dias e a lista de equipamentos; nenhum dado de saúde), rotulado como publicidade da casa. Há um segundo cartão fixo abaixo do formulário.

## Limites, de propósito

- **Não prescreve:** não define carga, séries nem repetições. O resultado diz isso e aponta para o profissional.
- **Critérios editoriais do guia**, iguais para todos, não fonte externa: a lista de exercícios e o que cada um pede estão em `EXERCICIOS` (`src/lib/treinoCondominio.ts`). A recomendação semanal da OMS não é citada: o site da OMS não abre na rede do ambiente e não foi conferido.
- Quem está começando recebe o aviso de conferir a execução com alguém habilitado e de falar com o médico em caso de dor, lesão ou problema de saúde.
- A pergunta "academia de condomínio precisa de professor?" (autocompletar) **não entra**: depende de lei e de conselho profissional, e o guia não cita o conselho.

## Onde atualizar

- **Equipamentos, exercícios e regras:** `src/lib/treinoCondominio.ts`, com testes em `tests/treino-condominio.test.ts`. A tabela "o que dá para fazer com cada equipamento" e parte das perguntas frequentes são geradas dessa lista.
- **Link com estado:** `?eq=halteres,banco&dias=3&local=casa` abre com o resultado. As páginas de personal a domicílio já mandam `?local=casa`.

## Pesquisa no Google (SerpApi, 18/11/2026, celular, Barueri)

Evidência: `docs/pesquisa/serp/treino-condominio-2026-11-18.json`. Buscas: "treino na academia do condomínio", "montar treino com halteres em casa", "equipamentos academia de condomínio". 6 créditos; a visão de IA das duas últimas existia, mas pedia um crédito extra cada e não foi aberta.

**Formato:** nas três buscas há vídeos (longos e curtos) no topo, e os resultados comuns são artigos, fóruns e redes sociais. Nenhuma ferramenta. Decisão: ferramenta com texto forte embaixo; vale gravar um short do Montinho para a página, porque o texto sozinho disputa com vídeo.

**Concorrentes:** fracos na busca principal (blog de garantidora de aluguel, portal de condomínios, Reddit, Instagram). Em "treino com halteres em casa": Pinterest, fórum, PDF. Em "equipamentos": lojas e fabricantes (intenção de compra do síndico).

**Visão de IA (busca principal):** abre dizendo que treinar no condomínio economiza tempo e ajuda na constância; lista a "estrutura básica" (halteres, banco, colchonete, barra fixa, cardio) e a alternativa compacta (multiestação, elásticos); dá uma divisão A-B-C de exemplo com exercícios. Cita blogs de academia e de treino. A resposta direta da página segue o mesmo molde: o que basta ter, os grupos de movimento e o limite mais comum.

| Dado do Google | O que mudou na página |
|---|---|
| AC "treino na academia do condomínio", "treino para fazer na academia do condominio", "treino academia condomínio" | Título, H1 e pergunta "Que treino fazer na academia do condomínio?" |
| AC "treino na academia do prédio" | "Prédio" no título, na linha fina e nos textos |
| AC "treino com halteres em casa", "completo", "completo em casa", "para iniciantes" | Opção "em casa", seção "Treino só com halteres" e pergunta "Dá para treinar o corpo todo só com halteres?" |
| AC "treino com halteres no banco", "e barra em casa" | Banco e barra entre os equipamentos; a tabela mostra o que cada combinação libera |
| PAA "Tem como ter resultado de academia em casa?" | Pergunta "Dá para ter resultado treinando na academia do condomínio?" |
| PAA "O que usar para substituir halteres em casa?", "Quais exercícios de musculação posso fazer em casa?" | Elásticos, fita e peso do corpo no simulador; pergunta "Treino em casa sem equipamento funciona?" |
| PAA "O que é necessário para montar uma academia em casa?"; REL "Kit academia para condominio", "Montar academia em condominio" | Bloco "O que mais ajudaria" e pergunta "O que não pode faltar numa academia de condomínio?" |
| Visão de IA: lista de equipamentos comuns e divisão por dias | Lista de equipamentos do formulário e "Como dividir a semana" |
| Orgânico 6: regras de uso e personal na academia do condomínio | Seção e pergunta sobre personal no condomínio, com as páginas por região |

Ficou de fora: ver `docs/seo/pauta.md` (regras e lei de academia de condomínio, custo de montar, treino por grupo muscular com halteres, PDF de treino, franquia e contêiner, nomes de condomínios e de empresas).
