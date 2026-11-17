# Política de personal externo por academia

Página: `/ferramentas/academias-que-aceitam-personal-externo/`. Criada em 17/11/2026.

## Onde a informação mora

Um único lugar: o campo `personal_externo` da ficha, em `src/data/academias/<id>.yaml`. A mesma informação aparece em três lugares, sem cópia:

- no guia de personal externo (cartão da unidade);
- na ficha da academia (quadro "Personal externo");
- na calculadora de custo (preenchimento da taxa quando o visitante inclui personal).

A leitura e as regras de preenchimento estão em `src/lib/personal.ts`. Ficha sem o campo aparece como "a confirmar".

## Formato

```yaml
personal_externo:
  status: aceita | aceita-com-condicoes | nao-aceita | a-confirmar
  condicoes:            # o que fazer antes da primeira sessão, como a fonte diz
  - Cadastro do profissional na unidade.
  taxa:
    situacao: confirmada | sem-taxa | pendente
    valor: R$ 50        # só se a fonte publica
    centavos: 5000      # idem; usado pela calculadora
    quem_paga: aluno | profissional
    periodicidade: mes | aula | ida
    condicoes: texto curto (ex.: varia por plano)
  abrangencia: unidade | rede   # rede só quando a fonte diz que vale para a unidade
  fonte: Nome da página oficial
  url: https://...
  conferido_em: 2026-11-17
  canal: (11) 0000-0000  # canal oficial da unidade, se houver; senão usa o telefone da ficha
  nota: observação curta, opcional
```

Regras:
- Regra da rede só vale para a unidade quando a fonte indica que ela está coberta.
- Fontes em conflito, ou resposta que depende de perguntar na unidade: `a-confirmar`.
- Aceita, mas sem valor de taxa publicado: status de aceitação e `taxa.situacao: pendente`.
- Sem valor publicado, nunca `centavos: 0`. Taxa zero só com fonte dizendo que não há taxa (`sem-taxa`).
- A calculadora só preenche a taxa quando `situacao: confirmada`, `quem_paga: aluno`, `centavos` e `periodicidade` estão preenchidos. Taxa paga pelo profissional fica fora do custo do aluno.
- Confirmação feita por telefone ou na recepção: registre em `fonte` quem confirmou e como (ex.: "Recepção da unidade, por telefone"), sem `url`, e mude a proveniência para `confirmado-com-a-academia` na ficha.
- Não citar conselho profissional (regra do site): escreva "documentos do profissional".

## Roteiro para o Montinho confirmar na unidade

Perguntas, nesta ordem:
1. A unidade aceita personal trainer que não é funcionário da academia?
2. O profissional precisa de cadastro? Quais documentos? Quanto tempo leva para liberar?
3. Há taxa? De quanto? Por mês, por aula ou por ida? Quem paga: o aluno ou o profissional?
4. Há horários, áreas ou planos em que o atendimento com personal não é permitido?
5. A regra vale só para esta unidade ou para toda a rede? Existe documento ou página com ela?

Depois, atualizar o YAML e publicar (`npm run verificar`).
