# Diária, aula experimental e visita guiada

Ferramenta: `/ferramentas/academias-diaria-aula-experimental-alphaville/` (criada em 18/11/2026). Não havia rota com a mesma intenção.

## Onde atualizar

- **Ofertas de cada unidade:** campo `acesso_avulso` da ficha, em `src/data/academias/<id>.yaml`. A ficha, o buscador e as perguntas da página leem o mesmo campo.
- **Mensagem do WhatsApp do Montinho:** `MENSAGEM_BASE` e `mensagemWhatsapp()` em `src/lib/acesso.ts`. O número vem de `PUBLIC_WHATSAPP` (`.env` e variável da Vercel), o mesmo do resto do site.
- **Regras de exibição** (selo Grátis, texto do botão, "Confirme o acesso com a unidade", comparação com a mensalidade): `src/lib/acesso.ts`, com testes em `tests/acesso.test.ts`.

## Formato

```yaml
acesso_avulso:
- tipo: diaria                 # diaria | aula-experimental | treino-experimental | visita-guiada
  nome: Day use (diária)
  modalidades: [musculacao]    # ids de MODALIDADES
  musculacao: true             # só true quando a fonte confirma acesso à musculação
  preco: { situacao: valor, valor: R$ 90, centavos: 9000 }   # gratis | valor | a-partir-de | referencia-rede | a-consultar
  regras: ['Pagamento direto no local.']
  horario_acesso: '6h às 20h'  # opcional: janela própria da diária
  horario_acesso_confirmado: false   # true só com a janela de entrada publicada
  destino: { tipo: contato, url: 'https://wa.me/55...', canal: 'WhatsApp da unidade' }   # compra | reserva | contato | pagina
  situacao: confirmada         # a-confirmar quando a fonte não pôde ser lida ou diverge
  fonte: Site oficial da ...
  url: https://...
  conferido_em: '2026-11-18'
  pendencias: ['O que ficou a confirmar.']
```

Regras:
- **Atendimento do Montinho no local:** `responsavel: montinho`. O selo diz "Atendimento do Montinho", e o botão abre o WhatsApp dele com o nome da unidade (`destinoOferta()` em `src/lib/acesso.ts`).
- **Selo "Grátis":** só aparece com `preco.situacao: gratis` e `situacao: confirmada`.
- **Preço da rede:** vai como `referencia-rede`, e a página diz que o valor da unidade é a consultar.
- **Visita guiada e aula de outra modalidade:** aparecem identificadas, mas ficam fora do filtro de musculação.
- **Botões:** "Comprar diária" com `destino.tipo: compra`; "Consultar diária" nos demais casos. "Agendar com a academia" com `reserva`; "Consultar aula experimental" nos demais.
- **Diária sem janela de entrada confirmada:** quando a academia está aberta no horário escolhido, a página mostra "Confirme o acesso com a unidade". O funcionamento e os feriados vêm do buscador de academias abertas (`src/lib/horarios.ts`).

## WhatsApp do Montinho

- **Sem unidade escolhida:** vai a mensagem padrão, com "[academia, condomínio ou bairro]" para o visitante completar.
- **Unidade que aceita personal externo, confirmado** (`personal_externo.status` aceita ou aceita-com-condicoes): "Quero treinar na <unidade>."
- **Autorização pendente ou sem informação:** "Tenho interesse em treinar na <unidade>. Você consegue me atender lá?"
- **Restrição confirmada** (`nao-aceita`): volta para a mensagem geral.
- **Analytics:** o texto não vai para o analytics. Só sai `clique_whatsapp` com `ref` = `acesso-experimental` ou `acesso-experimental-unidade`.

## Conferência de 18/11/2026

| Unidade | Oferta | Situação |
|---|---|---|
| Arena 18 | Aula experimental de musculação grátis com o Montinho, sem diária (`responsavel: montinho`; botão abre o WhatsApp dele) | Confirmada pelo Montinho em 18/11 (relação comercial declarada) |
| NitroGym Tamboré | Day use R$ 90, musculação, pago no local | Confirmada (site oficial); janela de entrada a confirmar |
| Ironberg Alphaville | Aula avulsa, musculação, valor na recepção, sem agendamento | Confirmada (site oficial); valor a consultar |
| Smart Fit (Sodimac, Carrefour Tamboré, Av. Zélia, Centro, Parque Shopping) | Passe diário | A confirmar: a central de ajuda da rede não abriu aqui |
| CrossFit Barueri | Aula experimental de CrossFit, grátis, separada da turma | Confirmada (site oficial) |
| G13 Alphaville | Aula experimental de lutas, grátis | Confirmada (site oficial, 17/11) |
| BlackSheep Alphaville | Aula experimental de Hybrid; drop in R$ 75 e mês teste R$ 400 na tabela da rede | Confirmada (site oficial, 13/11; site fora do ar em 18/11) |
| Tecfit Alphaville | Experiência de eletroestimulação, agendada | Confirmada (site oficial); preço a consultar |
| SIX e Fábrica Premium | Visita agendada (não é treino) | Confirmada (site oficial) |
| Scelta | Aula experimental pelo link do Instagram | A confirmar: modalidade e preço; o site não abriu |

Pendentes de fonte:
- **On Force Barueri:** sem ficha no guia, e o site não abriu.
- **Scelta:** `academiascelta.com.br` não abriu.
- **Smart Fit:** `ajuda.smartfit.com.br` não abriu.
- **Bluefit, Bodytech, SkyFit, Gaviões e VoiFit:** não publicam diária nem aula experimental nas páginas que abrem aqui.
