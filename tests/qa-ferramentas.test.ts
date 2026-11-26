// Testes da rotina de QA das ferramentas (26/11/2026): casos achados pelo auditor de cálculos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calcular, cenarioVazio, planosMensais, type Cenario } from '../src/lib/custo.ts';
import { calcular as calcPP, arredonda, type Dados } from '../src/lib/precoPersonal.ts';
const cen = (x: Partial<Cenario>): Cenario => ({ ...cenarioVazio('teste'), ...x });
const D = JSON.parse(readFileSync(new URL('../src/data/preco-personal.json', import.meta.url), 'utf8')) as Dados;

test('custo: frequência fracionária não arredonda duas vezes (ano e custo por treino)', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '1', freqPeriodo: 'semana', transporte: 'valor', transporteModo: 'ida', transporteValor: '10' }));
  assert.equal(r.mensal, 19333);
  assert.equal(r.ano, 150 * 12 * 100 + 52 * 1000);
  assert.equal(r.porIda, Math.round(15000 * 12 / 52 + 1000));
  const p = calcular(cen({ acessoModo: 'incluido', freqValor: '7', personal: 'valor', personalModo: 'aula', personalValor: '100', personalAulas: '2', personalAulasPeriodo: 'semana' }));
  assert.equal(p.ano, 104 * 10000);
});

test('custo: aulas guardadas não valem quando o personal é cobrado por mês', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '4', freqPeriodo: 'mes', personal: 'valor', personalModo: 'mes', personalValor: '800', personalAulas: '8', personalAulasPeriodo: 'mes' }));
  assert.equal(r.erros.length, 0);
  assert.equal(r.mensal, 95000);
});

test('custo: plano com primeiro mês grátis', () => {
  const [p] = planosMensais([{ nome: 'Black', preco: 'R$ 159,90/mês', condicoes: 'Primeiro mês gratuito, segundo o site. Adesão de R$ 9,90.' }]);
  assert.equal(p.mesGratis, true);
  const r = calcular(cen({ acessoValor: '159,90', mesGratis: true, inicial: 'valor', inicialValor: '9,90', freqValor: '3' }));
  assert.equal(r.primeiroMes, 990);
  assert.equal(r.ano, 15990 * 11 + 990);
  assert.equal(r.mensal, 15990);
});

test('custo: meses do plano à vista precisam ser inteiros e o valor tem teto', () => {
  assert.ok(calcular(cen({ acessoModo: 'avista', acessoValor: '1200', avistaMeses: '0,5', freqValor: '3' })).erros.some((e) => e.campo === 'avistaMeses'));
  assert.ok(calcular(cen({ acessoValor: '99999999999', freqValor: '3' })).erros.some((e) => e.campo === 'acessoValor'));
});

test('preço de personal: limites de frequência e invariantes em todos os locais', () => {
  assert.equal(calcPP(D, 'alphaville', 'academia', 7).freq, 5);
  assert.equal(calcPP(D, 'alphaville', 'academia', 0).freq, 1);
  for (const l of D.locais) {
    const b = D.bases[l.base];
    for (const k of ['avulsa', 'aula_pacote', 'online'] as const) assert.ok(b[k][0] <= b[k][1], `${l.id} ${k}`);
    for (const f of [1, 2, 3, 4, 5]) {
      const r = calcPP(D, l.id, 'domicilio', f);
      assert.equal(r.sessoes, Math.round(f * 52 / 12));
      assert.deepEqual(r.mes, [arredonda(b.aula_pacote[0] * r.sessoes), arredonda(b.aula_pacote[1] * r.sessoes)]);
      assert.deepEqual(calcPP(D, l.id, 'online', f).mes, b.online);
    }
  }
  assert.equal(calcPP(D, 'nao-existe', 'academia', 3).local.id, 'alphaville');
});

// Rodada 2 (26/11/2026): calculadora Hyrox e treino no condomínio.
import { plano, paraSegundos, type DadosHyrox } from '../src/lib/hyrox.ts';
import { EQUIPAMENTOS, EXERCICIOS, avaliar, type EquipId } from '../src/lib/treinoCondominio.ts';
const EH = (JSON.parse(readFileSync(new URL('../src/data/hyrox.json', import.meta.url), 'utf8')) as DadosHyrox).estacoes;

test('hyrox: a tabela fecha com o total quando a média por estação é fracionada', () => {
  for (const [metaSeg, transSeg] of [[5460, 0], [5400, 5], [5461, 7]] as const) {
    const p = plano({ metaSeg, ritmoSeg: 360, transSeg }, EH);
    assert.ok(p.ok);
    const est = p.segmentos.filter((s) => s.tipo === 'estacao');
    assert.equal(est.reduce((a, s) => a + s.dur, 0), p.estacoesTotal);
    assert.equal(p.segmentos.at(-1)!.acum, metaSeg);
    if (!transSeg) { let ant = 0; for (const s of p.segmentos) { assert.equal(s.acum - ant, s.dur, s.nome); ant = s.acum; } }
  }
});

test('hyrox: o ritmo-limite da mensagem de erro fica abaixo do ritmo digitado', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 660 }, EH);
  assert.equal(p.ok, false);
  assert.ok(p.ritmoMaximo < 660, `sugere ${p.ritmoMaximo}`);
  assert.ok(plano({ metaSeg: 5400, ritmoSeg: p.ritmoMaximo }, EH).ok);
});

test('hyrox: transição grande culpa a transição, não a corrida', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360, transSeg: 3600 }, EH);
  assert.equal(p.ok, false);
  assert.match(p.erro!, /transições/);
});

test('hyrox: entradas com espaço e aspas', () => {
  assert.equal(paraSegundos('1 30', 'prova'), 5400);
  assert.equal(paraSegundos('5\'30"', 'ritmo'), 330);
  assert.equal(paraSegundos('6\'15', 'ritmo'), 375);
});

test('condomínio: nunca mostra exercício sem o equipamento marcado; resumo não fala de carga no cardio', () => {
  const ids = EQUIPAMENTOS.map((e) => e.id), req = new Map(EXERCICIOS.map((e) => [e.nome, e.requer]));
  for (let m = 0; m < 1 << ids.length; m++) {
    const eq = ids.filter((_, i) => m & (1 << i)) as EquipId[], S = new Set(eq), r = avaliar(eq, 2 + (m % 4), 'treina');
    for (const n of [...r.cobertura.flatMap((c) => c.exercicios), ...r.semana.flatMap((d) => d.itens.map((i) => i.exercicio)).filter((x): x is string => !!x)])
      assert.ok(req.get(n)!.every((q) => S.has(q)), `${n} com ${eq.join(',')}`);
    assert.equal(r.semana.length, 2 + (m % 4));
    if (r.veredito === 'adaptado') assert.doesNotMatch(r.resumo, /cardio, a saída é o peso do corpo/, eq.join(','));
  }
});
