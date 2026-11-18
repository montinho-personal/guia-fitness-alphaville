# Ferramentas nos artigos

Criado em 18/11/2026, a pedido do Renato: cada artigo leva às ferramentas que resolvem o próximo passo de quem está lendo.

## Como funciona

- `src/lib/ferramentas.ts` escolhe 2 ou 3 ferramentas pelo tipo da página (`ferramentasPara(contexto)`) e monta o link já preenchido: academia (`a=`), região (`reg=` / `regiao=`), modalidade (`mod=` / `modalidade=`), horário (`quando=`), personal (`personal=1`).
- `src/components/FerramentasContexto.astro` mostra:
  - **atalho**: uma linha com a ferramenta principal logo abaixo da resposta direta;
  - **bloco** "Ferramentas para o seu caso": os cartões depois do texto, antes da lista de academias e das perguntas.
- Os guias em Markdown recebem o contexto sozinhos em `GuiaPagina.astro` (slug + frontmatter). As páginas `.astro` (comparativos, regiões, preços, 24 horas, domingo, perto de, Smart Fit Barueri) passam o contexto no próprio arquivo.
- Medição: cada clique gera `clique_ferramenta` no GA4, com `ref` = `ferramenta:atalho` ou `ferramenta:bloco`.
- A auditoria desconta o bloco e o atalho da similaridade de texto, como já fazia com cartões e o quadro do Montinho.

## Qual ferramenta em cada tipo de página

| Página | 1ª (atalho) | 2ª | 3ª |
|---|---|---|---|
| Personal na academia X | Personal externo (busca pela X) | Calculadora com a X e personal | Comparador com a X |
| Personal na cidade | Personal externo (região) | Calculadora com personal | Teste (região) |
| Personal por público | Personal externo (região) | Calculadora com personal | Iniciantes, gestantes e feminino: checklist; idosos: teste com acessibilidade e estacionamento; executivos: teste com horário cedo e tarde; emagrecer: teste |
| Personal a domicílio | Calculadora (casa x academia) | Personal externo (região) | Mapa |
| Personal em condomínio | Calculadora (condomínio x academia) | Personal externo (região) | Teste (região) |
| Modalidade | Wellhub e TotalPass (modalidade) | Teste (modalidade) | Calculadora |
| Hyrox | Teste (Hyrox) | Comparador | Calculadora |
| Como escolher academia | Teste | Checklist | Calculadora |
| Academia ou personal | Calculadora com personal | Personal externo | Teste |
| Academias premium | Comparador (Ironberg, NitroGym, Bodytech) | Calculadora | Wellhub e TotalPass |
| Comparativo X ou Y | Wellhub e TotalPass (plano comum) | Personal externo | Checklist |
| Região | Teste (região) | Mapa | Wellhub e TotalPass (região) |
| Preços | Calculadora (exemplo) | Wellhub e TotalPass | Comparador |
| 24 horas / domingo | Teste (horário marcado) | Mapa | Comparador / Wellhub e TotalPass |
| Perto de | Mapa | Teste | Comparador |

## Página nova

Ao criar um tipo de página novo, inclua o caso em `ferramentasPara` e confira o bloco no celular (360 px). Ferramenta nova: inclua em `BASE` e nos casos em que ela resolve o próximo passo do leitor.

Atualização de 18/11/2026: as páginas de personal (cidade, público, domicílio, condomínio) e "academia ou personal" passaram a levar à calculadora de preço de personal, já com o local e o formato da página.
