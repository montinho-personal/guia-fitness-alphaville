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
test('total do mês = aula no pacote × sessões; resultado é sempre faixa', () => {
  const r = calcular(D, 'alphaville', 'condominio', 3);
  assert.deepEqual(r.aulaPacote, [50, 300]); assert.deepEqual(r.mes, [650, 3900]); assert.ok(r.mes[0] < r.mes[1]);
  assert.deepEqual(calcular(D, 'alphaville', 'academia', 2).mes, [450, 2700]);
  assert.deepEqual(calcular(D, 'alphaville', 'domicilio', 1).mes, [200, 1200]);
  assert.deepEqual(calcular(D, 'alphaville', 'domicilio', 5).mes, [1100, 6600]);
  assert.deepEqual(calcular(D, 'alphaville', 'academia', 3).avulsa, [100, 300]);
});
test('Barueri e Santana de Parnaíba: aula no pacote de 40 a 250', () => {
  for (const l of ['barueri-centro', 'santana-de-parnaiba']) { const r = calcular(D, l, 'academia', 3); assert.deepEqual(r.aulaPacote, [40, 250]); assert.deepEqual(r.mes, [520, 3250]); }
  assert.deepEqual(calcular(D, 'barueri-centro', 'academia', 2).avulsa, [90, 220]);
});
test('online é mensal e não muda com a frequência', () => {
  const a = calcular(D, 'alphaville', 'online', 1), b = calcular(D, 'alphaville', 'online', 5);
  assert.deepEqual(a.mes, [110, 550]); assert.deepEqual(b.mes, a.mes); assert.equal(a.avulsa, null);
  assert.deepEqual(calcular(D, 'barueri-centro', 'online', 3).mes, [200, 500]);
});
test('fallback nunca é silencioso: Tamboré e Aldeia dizem de onde vem a faixa', () => {
  for (const l of ['tambore', 'aldeia-da-serra']) { const r = calcular(D, l, 'condominio', 3); assert.equal(r.fallback, true); assert.deepEqual(r.aulaPacote, [50, 300]); assert.match(r.memoria[0], /referência de Barueri/); assert.match(r.memoria[0], /informados pelo Montinho/); }
  assert.equal(calcular(D, 'alphaville', 'academia', 2).fallback, false);
});
test('memória de cálculo sai linha a linha', () => {
  assert.ok(calcular(D, 'alphaville', 'academia', 4).memoria.length >= 6);
});
