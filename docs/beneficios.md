# Wellhub e TotalPass por unidade

Página: `/academias/wellhub-totalpass/` (buscador). Revisada em 17/11/2026: a página que já existia virou o buscador, para não criar uma segunda página para a mesma busca.

## Onde os dados moram

No campo `agregadores` de cada ficha (`src/data/academias/<id>.yaml`). A mesma entrada alimenta a ficha (quadro "Agregadores"), o buscador e a calculadora. A ordem oficial dos planos e os preços de referência estão em `src/data/planos-agregadores.json`. A lógica está em `src/lib/beneficios.ts` e é testada em `tests/beneficios.test.ts`.

```yaml
agregadores:
- nome: TotalPass            # ou Wellhub
  situacao: confirmada       # nao-aceita só com confirmação explícita
  planos: ["TP 2", "TP 2+", ...]   # TotalPass: "Planos que dão acesso" da página da unidade
  atividades: [...]          # como a página do benefício lista
  musculacao: true           # se "Musculação" está entre as atividades
  condicoes: ["Reserva ou agendamento necessário, segundo o Wellhub."]
  conferido_em: '2026-11-17'
  plano_minimo: TP 2
  preco_plano: R$ 119,90     # referência da tabela do benefício
  url: https://totalpass.com/br/academias/...
  nota: texto opcional (ex.: restrição de horário)
```

## Regras

- Correspondência pela página oficial da unidade no benefício (nome e endereço). Cobertura de uma unidade nunca vale para outra da mesma rede.
- Unidade sem entrada: "a confirmar", nunca "não aceita".
- Plano que dá acesso: TotalPass pela lista da página da unidade; Wellhub pelo "a partir do plano" da página da unidade, na ordem oficial. Abaixo do mínimo, sem acesso.
- Plano comum de duas unidades: interseção dos planos que dão acesso às duas, e o menor pela ordem oficial. Se uma unidade não tem o benefício, a comparação fica pendente; se não lista a modalidade, é incompatível com motivo.
- Personal externo para quem entra pelo benefício: campo `personal_externo.beneficio`, que fica `a-confirmar` até haver confirmação explícita.

## Para atualizar

Baixar a página da unidade no benefício, conferir plano mínimo, planos (TotalPass), atividades e avisos de reserva/horário, atualizar a entrada e rodar `npm run verificar`.
