# Brief: artigos de personal trainer por tema e cidade (15/11/2026)

Projeto: guia "Onde Treinar Alphaville" (guiafitnessalphaville.com.br), Astro. Os artigos são arquivos Markdown em `src/content/guias/`. O guia é mantido pelo Montinho Personal Trainer, um personal (homem) que atende em Alphaville, Tamboré, Barueri, Santana de Parnaíba e Aldeia da Serra: em casa, no espaço fitness do condomínio, na Arena 18 e, quando a regra do local permite, em outras academias.

## Matriz

8 temas × 5 cidades = 40 arquivos. Nome do arquivo: `personal-trainer-<tema>-<cidade>.md`.

- Temas (slug): `feminino`, `em-condominio`, `a-domicilio`, `para-idosos`, `para-iniciantes`, `para-emagrecer`, `para-gestantes`, `para-executivos`.
- Cidades (slug → nome): `alphaville` → Alphaville; `tambore` → Tamboré; `barueri` → Barueri; `santana-de-parnaiba` → Santana de Parnaíba; `aldeia-da-serra` → Aldeia da Serra.

## Regras não negociáveis

1. **Texto 100% original**, escrito do zero. Não copiar nem parafrasear de perto o site montinhopersonal.com.br nem outros sites. A auditoria compara sequências de 5 palavras com o site do Montinho e entre as páginas do guia.
2. **Nada de página porta.** As 5 cidades de um mesmo tema NÃO podem ser o mesmo texto com o nome da cidade trocado. Cada página precisa de estrutura, exemplos e dados próprios da cidade (academias, horários, tipo de moradia, deslocamento). Nenhuma frase pode se repetir entre as páginas, nem entre as 5 do mesmo tema. Varie também os títulos das seções.
3. **Não inventar.** Use só os fatos de `docs/pesquisa/dados-por-cidade.md` e do bloco "Fatos regionais" abaixo. Proibido inventar: preço de personal, número de condomínios, nomes de condomínios, ruas, parques, trilhas, distâncias, tempos de deslocamento, estatísticas, estudos, depoimentos, regras específicas de um condomínio ou academia que não estejam nos dados. Para regra de personal externo, só a Ironberg publica a dela (valor fixo pago à academia, valor só na unidade). Nas outras, diga para perguntar.
4. **Nunca citar CREF, CONFEF ou "conselho regional/federal de Educação Física"**, nem por extenso. A auditoria barra.
5. **Transparência:** cada página começa com uma linha de transparência em blockquote (`> **Transparência.** ...`) dizendo que o guia é mantido pelo Montinho, personal que atende na cidade, e que o bloco dele no fim é publicidade. Escreva essa linha com palavras diferentes em cada página.
6. **Sem promessa** de resultado ("você vai perder X kg"). Saúde: em idosos e gestantes, diga sempre que a liberação e as orientações vêm do médico (para gestantes, do obstetra), e não prescreva exercícios, cargas ou frequências específicas.
7. **Feminino:** "personal feminino" é buscado tanto por quem quer uma personal mulher quanto por quem quer treino pensado para mulheres. Trate os dois. Seja honesto: o Montinho é homem. Quem prefere uma profissional mulher deve procurar uma, e a página não pode fingir o contrário.
8. Português do Brasil, frases curtas, sem jargão, sem emojis, sem travessões em excesso. Nada de "neste artigo vamos ver".
9. Não dizer que alunos moram em determinado lugar; não citar alunos.

## Formato do arquivo (frontmatter obrigatório)

```yaml
---
titulo: "..."            # até 70 caracteres, com o tema e a cidade
descricao: "..."         # entre 70 e 165 caracteres
h1: "..."                # pode ser igual ou parecido com o título
resposta: "..."          # resposta direta de 2 a 3 frases, mínimo 80 caracteres, específica da cidade
cluster: D
secao: guias
palavra_chave: personal trainer <tema em palavras> <cidade minúscula>
intencao: "..."          # uma frase
cta: montinho-contextual
cta_titulo: "..."        # ex.: "Treinar com o Montinho em Barueri"
cta_texto: "..."         # 1 a 2 frases honestas sobre o atendimento do Montinho naquela cidade e tema
cta_destino: /...        # use a tabela de destinos abaixo
lista_titulo: "..."      # só se usar lista_ids
lista_ids: [ ... ]       # opcional: ids de academias da cidade relevantes ao tema (só ids que existem em dados-por-cidade.md)
fontes:                  # opcional; só URLs reais. Pode citar fichas do guia (https://guiafitnessalphaville.com.br/academias/<id>/) e, em idosos/gestantes, a OMS:
  - titulo: "Organização Mundial da Saúde — Diretrizes sobre atividade física e comportamento sedentário (2020)"
    url: "https://www.who.int/publications/i/item/9789240015128"
status: publicado
status_fatos: fonte-publica-conferida
status_originalidade: original-sem-verificacao-externa
autor: Redação do Onde Treinar Alphaville
revisor: null
publicado_em: 2026-11-15
atualizado_em: 2026-11-15
---
```

Strings com dois-pontos ou aspas devem ficar entre aspas duplas. Não use aspas duplas dentro delas (use aspas simples ou reescreva).

Corpo: a linha de transparência e depois 4 a 6 seções `##`, com 450 a 700 palavras no total. Use links internos em Markdown para:
- a página-mãe da cidade: `/guias/personal-trainer-<cidade>/`
- `/guias/academia-ou-personal/`
- fichas de academias citadas: `/academias/<id>/`
- quando fizer sentido: `/academias/domingo/`, `/academias/24-horas/`, `/academias/precos/`, `/academias/wellhub-totalpass/`, `/mapa/`

## Destinos do Montinho (cta_destino)

Use o específico quando existir; senão, o da cidade.
- Página da cidade: alphaville `/personal-trainer-alphaville`; tambore `/personal-trainer-tambore`; barueri `/personal-trainer-barueri`; santana-de-parnaiba `/personal-trainer-santana-de-parnaiba`; aldeia-da-serra `/blog/personal-trainer-aldeia-da-serra`
- feminino: tambore `/personal-trainer-feminino-tambore`; alphaville `/blog/personal-trainer-feminino-alphaville`; santana-de-parnaiba `/blog/personal-trainer-feminino-santana-de-parnaiba`
- em-condominio: tambore `/personal-trainer-condominio-tambore`; alphaville `/blog/personal-trainer-em-condominio-alphaville`
- a-domicilio: tambore `/personal-trainer-a-domicilio-tambore`; alphaville `/blog/personal-trainer-a-domicilio-alphaville`; barueri `/blog/personal-trainer-a-domicilio-barueri`; santana-de-parnaiba `/blog/personal-trainer-a-domicilio-santana-de-parnaiba`; aldeia-da-serra `/blog/personal-trainer-a-domicilio-aldeia-da-serra`
- para-idosos: tambore `/personal-trainer-para-idosos-tambore`
- para-iniciantes: tambore `/personal-trainer-para-iniciantes-tambore`
- para-emagrecer: tambore `/personal-trainer-para-emagrecer-tambore`; alphaville `/blog/personal-trainer-para-emagrecer-alphaville`
- para-gestantes: alphaville e tambore `/blog/personal-trainer-para-gestantes-alphaville-tambore`
- para-executivos: alphaville `/blog/personal-trainer-para-executivos-alphaville`

## Tema para-emagrecer: vitrine

Nas 5 páginas para-emagrecer, adicione ao frontmatter (antes de `status:`):

```yaml
vitrine:
  destaque: <um de: adriana-nascimento, natalia-nascimento, elisa-cruz, bruna-rodrigues; varie entre as cidades>
  intro: "1 a 2 frases próprias da página: dizer que são alunos do Montinho, resultados individuais de emagrecimento, sem indicar onde moram, sem promessa."
```

A vitrine mostra antes e depois reais de alunos do Montinho, lidos do site dele. Não cite nomes nem números de alunos no texto.

## Fatos regionais que podem ser usados

- **Alphaville** (lado de Barueri): oferta concentrada no Alphaville Industrial (Av. Juruá, Alameda Araguaia, Alameda Amazonas), no Alphaville Empresarial, no 18 do Forte (SIX no 23º andar de prédio na Av. Copacabana; VoiFit na Av. Alphaville), no Centro Comercial/Iguatemi (Bodytech Iguatemi) e no Melville Empresarial (Arena 18). Ironberg fica na Estrada da Aldeinha. Muitos residenciais têm academia própria. Muita gente trabalha nos polos empresariais.
- **Tamboré**: formado sobretudo por condomínios residenciais, divididos entre Barueri e Santana de Parnaíba. Duas academias com ficha: NitroGym (Av. Piracema, dentro do Shopping Tamboré, estacionamento do shopping incluso por até 3 horas) e Bluefit Tamboré (Av. Tucunaré).
- **Barueri** (cidade): muitos condomínios verticais com espaço fitness; Centro com Smart Fit e Panobianco de preço publicado baixo; Bethaville (Bluefit Barueri); a Linha 8-Diamante da CPTM passa pela cidade (estações Barueri, Antônio João, Jardim Belval, Jardim Silveira). Mensalidades publicadas no centro entre R$ 119,90 e R$ 139,90 com fidelidade.
- **Santana de Parnaíba**: parte de Alphaville e do Tamboré fica no município. Do lado de Alphaville, a Fábrica Premium (Estrada da Bela Vista, quase em frente ao Condomínio Burle Marx). Nos bairros: Forth (Jardim São Luís, com estrutura de acessibilidade), Mattos Fitness (Fazendinha, abre às 4h), Olympia (Polvilho, fecha das 12h às 14h, tem adaptações para pessoas autistas e acessibilidade). As academias de bairro não abrem no domingo. Distâncias grandes dentro do município.
- **Aldeia da Serra**: conjunto de residenciais cercados de mata, dividido entre Barueri e Santana de Parnaíba. Nenhuma academia com ficha no guia; o treino acompanhado acontece em casa, no espaço fitness do condomínio ou ao ar livre nas ruas internas. A Ironberg (Estrada da Aldeinha) não fica na Aldeia da Serra.

## Ao terminar

Releia os seus 5 arquivos e confirme: frontmatter válido, nenhuma frase repetida entre eles, nenhum CREF/CONFEF, nenhum fato fora dos dados. Não rode build e não mexa em outros arquivos.
