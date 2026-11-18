# Horários, feriados e o buscador de academias abertas

Ferramenta: `/ferramentas/academias-abertas-alphaville/` (criada em 18/11/2026). Substitui `/academias/domingo/` e `/academias/24-horas/`, que redirecionam para ela (301, em `vercel.json`).

## Onde cada dado mora

Tudo sai da ficha (`src/data/academias/<id>.yaml`), a mesma fonte da ficha, do comparador, do mapa e do buscador.

| Campo | Para que serve |
|---|---|
| `horario.<dia>` | Faixas `HH:MM-HH:MM`. `23:59` no fim = fecha à meia-noite. Fim menor que o início = atravessa a meia-noite (`22:00-02:00`). Duas faixas = intervalo no meio do dia. |
| `horario_status.<dia>` | `fechado` (a fonte diz que não abre) ou `a-confirmar` (fontes divergem ou não informam). Lista vazia sem status = "sem horário listado", tratada como a confirmar. |
| `ultima_entrada.<dia>` | Limite de entrada publicado, separado do fechamento. |
| `horario_fonte` | Fonte, endereço e data da conferência do horário. Sem ele, vale a proveniência do campo `horario`. |
| `horario_feriados` | Grade oficial genérica de feriados. Aparece como "horário padrão de feriados" e nunca como resultado confirmado. |
| `horario_excecoes` | Horário oficial de uma data (feriado, reforma, fechamento). Prevalece sobre tudo. |

Calendário de feriados: `src/data/feriados.json` (nacionais e estadual de SP; municipais só com o calendário oficial da prefeitura).

## Como atualizar uma exceção de feriado

Quando a academia publicar o horário de uma data, acrescente na ficha:

```yaml
horario_excecoes:
- data: '2026-12-25'
  faixas: ['08:00-12:00']     # [] = fechada nessa data
  situacao: confirmada         # a-confirmar se a fonte for ambígua
  motivo: Natal
  fonte: Instagram oficial da unidade (post de 20/12)
  url: https://...
  conferido_em: '2026-12-20'
```

Feriado municipal: acrescente em `src/data/feriados.json` com `"abrangencia": "municipal"` e `"municipio": "Barueri"` (ou `"Santana de Parnaíba"`), e retire o município de `municipais_pendentes`. O município da unidade sai do endereço da ficha.

Depois: `npm run verificar` e publicar.

## Regras do cálculo (src/lib/horarios.ts, testes em tests/horarios.test.ts)

- Fuso America/Sao_Paulo para "hoje" e "agora".
- Compatível só se a janela inteira do treino couber num período contínuo de funcionamento confirmado; fechar e reabrir no meio = incompatível.
- Sessão que cruza a meia-noite: confere a véspera, o dia e o dia seguinte, com as exceções de cada um.
- Selo "24h todos os dias" só com `00:00-23:59` nos sete dias e nenhum dia a confirmar; senão mostra os dias com 24h.
- Ordem em uma data: exceção da data > feriado (padrão de feriados ou "Horário do feriado a confirmar") > grade semanal.

## Conferência de 18/11/2026

Horário oficial conferido (site da academia ou da rede): Smart Fit Sodimac, Carrefour Hiper Tamboré, Av. Zélia, Barueri Centro e Parque Shopping; NitroGym Tamboré; SIX Alphaville; Fábrica Premium Alphaville; Tecfit Alphaville; Ironberg (rede: "24 horas por dia, inclusive nos feriados"). Arena 18: site oficial conferido em 14/11.

Grade de feriados publicada: Smart Fit (Sodimac, Tamboré e Av. Zélia 8h–17h; Centro e Parque Shopping 8h–14h), NitroGym 6h–22h, Fábrica Premium 8h–14h, Ironberg 24h.

Ainda com horário só do Wellhub ou do TotalPass (o site oficial não mostra o horário sem JavaScript ou não abriu): Gaviões 24h (domingo a confirmar: Wellhub e TotalPass divergem), Bluefit Alphaville, Bluefit Tamboré, Bluefit Barueri, Bodytech Iguatemi, Scelta, SkyFit Alphaville e Estrada dos Romeiros, VoiFit, Academia 24h Premium, Fast Treino, Panobianco (2), Boa Forma, Impacto, Xandu e as 10 de Santana de Parnaíba.

Feriados municipais (conferência de 18/11/2026, depois da liberação da rede): Barueri 2026 conferido no Decreto nº 10.264/2025 (portal da prefeitura); nenhum feriado municipal restante no ano. Barueri 2027: decreto ainda não publicado (pelos de 2016 e 2026, Paixão e 24/6 costumam entrar). Santana de Parnaíba: site da prefeitura com proteção anti-robô, não abre por aqui; conferir manualmente ou por outra fonte oficial (Diário Oficial do município). Planalto: fecha a conexão sem resposta; as leis federais citadas em `feriados.json` já estavam conferidas.
