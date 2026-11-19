# Academia perto de casa ou do trabalho ("academia no caminho")

Página: `/ferramentas/academia-perto-de-casa-ou-do-trabalho/` (criada em 19/11/2026, pedido do Renato).

## O que faz

1. A pessoa escolhe de onde sai e, se quiser, para onde vai: 41 pontos (residenciais de Alphaville e do Tamboré, bairros de Barueri e de Santana de Parnaíba, shoppings, estações e centros comerciais) ou a própria localização.
2. Escolhe a distância ou o desvio máximo (400 m, 800 m, 1,6 km, 3 km, 5 km: os mesmos cortes que o Google sugere no autocompletar) e, se quiser, quando treina.
3. O resultado separa três grupos, sem repetir academia: **perto de onde você sai**, **perto de onde você vai** e **no caminho**. Cada cartão mostra as distâncias, o desvio, se está aberta no horário escolhido e os benefícios aceitos.
4. Filtros: só academias com musculação (ligado por padrão; desligar inclui boxes e estúdios) e só as que informam Wellhub ou TotalPass.
5. Lead: cartão do Montinho depois do resultado, com a distância da Arena 18 aos dois pontos e WhatsApp com mensagem pronta (só os nomes dos pontos, nunca coordenadas), rotulado como publicidade da casa.

A tabela "a academia mais próxima de cada ponto" fica no HTML, para o Google e para quem não usa JavaScript.

## Limites, de propósito

- **Distância em linha reta**, não rota. O "desvio" é quanto a linha reta casa → academia → trabalho passa da linha reta casa → trabalho. A página diz isso no resultado e manda conferir o trajeto no aplicativo de mapas.
- **Coordenadas dos pontos:** OpenStreetMap (Nominatim), conferidas em 19/11/2026, em `src/data/pontos-caminho.json` (com o nome que o OpenStreetMap devolveu, no campo `osm`). Num residencial grande, o ponto central pode ficar longe da portaria. Ficaram de fora os nomes que o Nominatim resolveu para o lugar errado (Alphaville Industrial, Alphaville Conde, Melville, Parque Santana) e os que ele não achou (Residencial Zero, Centro Empresarial Tamboré, trevo da Castelo Branco).
- **Localização do aparelho:** usada só no navegador; não é enviada, não entra no endereço da página nem no analytics.
- **Horário:** mesmo motor do buscador de abertas (`avaliar`, 1 hora de treino). Fechadas no horário saem da lista, com a contagem no resumo; horário não confirmado aparece com aviso.
- **Destaque da casa:** a Arena 18 sobe para o topo só do grupo em que ela entra pelos dados.

## Onde atualizar

- **Ponto novo:** `src/data/pontos-caminho.json` (id, nome, grupo, lat, lng e `osm`), sempre com a coordenada do OpenStreetMap.
- **Regras de grupo e distância:** `src/lib/caminho.ts`, com testes em `tests/caminho.test.ts`.
- **Link com estado:** `?a=alphaville-10&b=iguatemi-alphaville&r=1.6&q=util-19&ben=1&tudo=1`.

## Pesquisa no Google (SerpApi, 19/11/2026, celular, Barueri)

Evidência: `docs/pesquisa/serp/academia-no-caminho-2026-11-19.json`. Buscas: "academia perto de casa ou do trabalho", "academia perto de mim aberta agora", "academia no caminho do trabalho alphaville". 6 créditos; a visão de IA existia só na primeira e pedia um crédito extra, não aberta. "academia perto do iguatemi alphaville" não foi repetida (18/11).

**Formato:** as três são buscas locais, com mapa no topo. Abaixo do mapa, os resultados comuns são fracos e quase todos de outras cidades. Decisão: ferramenta, mirando os resultados abaixo do mapa (o site é portal, sem perfil no mapa).

**Mapa:** SkyFit Estrada dos Romeiros, Bluefit Barueri e Texfit nas duas primeiras; On Force Barueri em "aberta agora"; Scelta, SkyFit Alphaville e Fast Treino na busca com "alphaville". Todas com ficha no guia, menos Texfit e On Force (On Force já anotada em `docs/acesso-avulso.md`).

**Concorrentes:** muito fracos. Instagram e sites de academia de outras cidades, diretórios genéricos (guiafacil, fitfit, cotanet), links de WhatsApp e páginas do Facebook. Nenhuma ferramenta. Prioridade alta.

| Dado do Google | O que mudou na página |
|---|---|
| AC "academia perto de casa ou do trabalho", "academia perto do meu trabalho", "academia perto de casa" | Título, H1, os dois campos e a pergunta "É melhor perto de casa ou do trabalho?" |
| AC "academia perto ou longe de casa" | Seção "Perto de casa, perto do trabalho ou no caminho: como escolher" |
| AC "academia perto de mim dentro de 400 m", "800 m", "1 6 km" | Opções de distância com esses mesmos cortes |
| AC "academia perto de mim abertos agora", "aberta", "agora"; REL "Academia aberta agora Barueri - SP" | Opção "Agora" e horários prontos; link para o buscador de abertas |
| AC "academia perto de mim 24 horas" | Etiqueta "24 horas" nos cartões e pergunta própria |
| AC "que aceita wellhub", "que aceita gympass"; PAA "Quem tem Gympass pode malhar em qualquer lugar?" | Filtro "Aceita Wellhub ou TotalPass", etiquetas nos cartões e pergunta própria |
| AC "academia perto de mim smart fit" | As unidades da rede aparecem pelo nome nos resultados e na tabela por ponto |
| Mapa: quem aparece primeiro | Conferido que as academias do mapa com ficha entram nos resultados |

Ficou de fora: "academia perto de mim valores" e "barata", "Quanto custa 1 mês na Smart Fit?", "Como pagar academia mais barata?", "Quanto custa uma diária na Ironberg SP?", "Qual a academia mais chique do Brasil?", buscas de outras cidades (Pelotas, São Luís) e perguntas fora do tema. Destino de cada uma em `docs/seo/pauta.md`.
