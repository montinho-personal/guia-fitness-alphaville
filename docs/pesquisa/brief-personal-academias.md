# Brief: "Personal trainer na <academia>" (15/11/2026)

Um artigo por academia com ficha no guia, para buscas como "personal trainer Ironberg Alphaville". Leia antes também `docs/pesquisa/brief-personal-temas.md`: TODAS as regras de lá valem aqui (originalidade, sem página porta, não inventar, nunca citar CREF/CONFEF/conselho, linha de transparência, sem promessa, pt-BR simples).

## Arquivo

`src/content/guias/personal-trainer-<id-da-academia>.md` (o id é o nome do arquivo YAML em `src/data/academias/`, sem `.yaml`). URL final: `/guias/personal-trainer-<id>/`.

## Fonte de verdade

O YAML da academia em `src/data/academias/<id>.yaml`: endereco, bairro, horario, modalidades, atividades_listadas, comodidades, agregadores, mensalidade (planos), divergencias, pendencias, analise, montinho_atende, proveniencia. Leia o arquivo inteiro. Para academias vizinhas, use os YAMLs das academias do mesmo bairro/região.

## O que o artigo precisa responder (com os dados da ficha)

1. **Dá para treinar com personal de fora nesta academia?** Só a Ironberg publica regra (personal externo paga valor fixo à academia; valor só na unidade). A Arena 18 é a única onde o Montinho atende (`montinho_atende: true`): diga isso como relação comercial. Para todas as outras: o guia não encontrou regra publicada; liste o que perguntar na recepção (se aceita, quanto custa, quem paga, horários, cadastro). Se `comodidades` lista "Personal trainer", explique que há profissionais da casa, o que não esclarece a regra para quem vem de fora. Nunca afirme regra que não está na ficha.
2. **A estrutura ajuda o treino acompanhado?** Use modalidades, atividades e comodidades reais (pesos livres, área funcional, cardio, piscina, quadras etc.). Box/estúdio: explique a diferença entre aula com coach e acompanhamento individual, sem inventar regras.
3. **Em que horários dá para marcar as sessões?** Horário da ficha (semana, sábado, domingo, 24h). Não invente horário de pico nem lotação.
4. **Quanto custa a conta toda?** Mensalidade publicada (com plano e condições) ou "não publicada"; plano mínimo de Wellhub/TotalPass se houver; lembrar da possível taxa do personal externo e do valor do profissional (sem citar preço de personal).
5. **Estacionamento e acesso**, se a ficha disser algo.
6. **Alternativas perto**: 1 a 3 academias do mesmo bairro ou região, com link para a ficha e para o artigo de personal delas (`/guias/personal-trainer-<id>/`).

Use a estrutura que fizer sentido para cada academia; não repita os mesmos títulos de seção entre os seus artigos. 400 a 600 palavras de corpo, 4 a 6 seções `##`.

## Frontmatter

```yaml
---
titulo: "Personal trainer na <Nome>: ..."   # até 65 caracteres; use "na"/"no" conforme o nome; inclua a cidade/bairro se couber
descricao: "..."                             # 70 a 165 caracteres
h1: "Personal trainer na <Nome>"
resposta: "..."                              # 2 a 3 frases, mínimo 80 caracteres, específicas desta academia
cluster: D
secao: guias
palavra_chave: personal trainer <nome em minúsculas> <cidade>
intencao: "..."
academia: <id>
cta: montinho-contextual
cta_titulo: "..."
cta_texto: "..."   # honesto: o Montinho atende em casa, no condomínio, na Arena 18 e, quando a regra do local permite, em outras academias. NUNCA diga que ele atende nesta academia, exceto na Arena 18.
cta_destino: /...  # página da cidade do Montinho: Alphaville/Tamboré lado Barueri -> /personal-trainer-alphaville (Tamboré -> /personal-trainer-tambore); Barueri -> /personal-trainer-barueri; Santana de Parnaíba -> /personal-trainer-santana-de-parnaiba
lista_titulo: "A ficha da <Nome> no guia"
lista_ids: [<id>]
fontes:            # as URLs de proveniencia do YAML desta academia (titulo = fonte)
  - titulo: "..."
    url: "..."
status: publicado
status_fatos: fonte-publica-conferida
status_originalidade: original-sem-verificacao-externa
autor: Redação do Onde Treinar Alphaville
revisor: null
publicado_em: 2026-11-15
atualizado_em: 2026-11-15
---
```

Corpo: começa com a linha de transparência em blockquote (redação própria em cada artigo) e links internos para a ficha (`/academias/<id>/`), para a página de personal da cidade (`/guias/personal-trainer-alphaville/`, `-tambore/`, `-barueri/` ou `-santana-de-parnaiba/`) e, quando fizer sentido, para `/academias/precos/`, `/academias/24-horas/`, `/academias/domingo/`, `/academias/wellhub-totalpass/`, `/guias/ironberg-ou-nitrogym/`, `/guias/smart-fit-ou-gavioes/`.

## Ao terminar

Confira cada afirmação contra o YAML, confirme que nenhuma frase se repete entre os seus artigos nem copia os demais arquivos de `src/content/guias/`, e que não há CREF/CONFEF. Não rode build e não mexa em outros arquivos.
