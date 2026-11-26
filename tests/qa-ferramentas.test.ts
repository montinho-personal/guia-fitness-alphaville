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
