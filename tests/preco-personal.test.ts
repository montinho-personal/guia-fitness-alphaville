// Calculadora de preço de personal: conta, arredondamento e fallback. Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calcular, sessoesMes, arredonda, type Dados } from '../src/lib/precoPersonal.ts';
const D = JSON.parse(readFileSync(new URL('../src/data/preco-personal.json', import.meta.url), 'utf8')) as Dados;

test('sessões por mês: vezes × 52 ÷ 12, arredondado', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(sessoesMes), [4, 9, 13, 17, 22]);
});
test('arredondamento único: dezena até R$ 1.000, cinquentena acima', () => {
  assert.equal(arredonda(182), 180); assert.equal(arredonda(545), 550); assert.equal(arredonda(1000), 1000);
  assert.equal(arredonda(2318), 2300); assert.equal(arredonda(1024), 1000); assert.equal(arredonda(1026), 1050);
});
test('2 e 3 vezes usam a faixa do pacote direto; resultado é sempre faixa', () => {
  for (const f of [2, 3]) { const r = calcular(D, 'alphaville', 'condominio', f); assert.deepEqual(r.mes, [500, 1500]); assert.equal(r.extrapolado, false); assert.ok(r.mes[0] < r.mes[1]); }
  assert.deepEqual(calcular(D, 'alphaville', 'academia', 3).avulsa, [100, 300]);
  assert.deepEqual(calcular(D, 'alphaville', 'academia', 3).aulaPacote, [50, 140]);
});
test('1, 4 e 5 vezes são extrapolação marcada', () => {
  assert.deepEqual(calcular(D, 'alphaville', 'domicilio', 1).mes, [180, 550]);
  assert.deepEqual(calcular(D, 'alphaville', 'domicilio', 4).mes, [770, 2300]);
  const r = calcular(D, 'alphaville', 'domicilio', 5); assert.deepEqual(r.mes, [1000, 3000]); assert.equal(r.extrapolado, true);
  assert.ok(r.memoria.some((l) => /extrapolação/.test(l)));
});
test('online é mensal e não muda com a frequência', () => {
  const a = calcular(D, 'alphaville', 'online', 1), b = calcular(D, 'alphaville', 'online', 5);
  assert.deepEqual(a.mes, [110, 550]); assert.deepEqual(b.mes, a.mes); assert.equal(a.avulsa, null);
  assert.deepEqual(calcular(D, 'santana-de-parnaiba', 'online', 3).mes, [110, 500]);
});
test('fallback nunca é silencioso: Tamboré e Aldeia usam a referência de Barueri e dizem isso', () => {
  for (const l of ['tambore', 'aldeia-da-serra']) { const r = calcular(D, l, 'condominio', 3); assert.equal(r.fallback, true); assert.deepEqual(r.mes, [450, 1300]); assert.match(r.memoria[0], /referência de Barueri/); }
  const c = calcular(D, 'barueri-centro', 'academia', 2); assert.deepEqual(c.mes, [450, 1300]);
  assert.equal(calcular(D, 'alphaville', 'academia', 2).fallback, false);
});
test('memória de cálculo sai linha a linha', () => {
  assert.ok(calcular(D, 'alphaville', 'academia', 4).memoria.length >= 6);
});
