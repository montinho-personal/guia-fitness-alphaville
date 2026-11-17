// Testes da calculadora de custo. Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcular, cenarioVazio, maisBarato, paraCentavos, planosMensais, reais, type Cenario } from '../src/lib/custo.ts';

const cen = (x: Partial<Cenario>): Cenario => ({ ...cenarioVazio('teste'), ...x });

test('exemplo 1: perto do trabalho, estacionamento por ida', () => {
  const r = calcular(cen({ acessoValor: '160', freqValor: '8', freqPeriodo: 'mes', transporte: 'valor', transporteModo: 'ida', transporteValor: '10' }));
  assert.equal(r.mensal, 24000);
  assert.equal(r.porIda, 3000);
  assert.equal(r.primeiroMes, 24000);
  assert.equal(r.ano, 288000);
});

test('exemplo 2: perto de casa, estacionamento gratuito declarado', () => {
  const r = calcular(cen({ acessoValor: '210', freqValor: '12', freqPeriodo: 'mes', transporte: 'valor', transporteValor: '0' }));
  assert.equal(r.mensal, 21000);
  assert.equal(r.porIda, 1750);
  assert.equal(r.componentes.find((c) => c.chave === 'transporte')!.estado, 'zero');
});

test('exemplo 3: condomínio com acesso incluído e personal mensal', () => {
  const r = calcular(cen({ acessoModo: 'incluido', freqValor: '8', freqPeriodo: 'mes', personal: 'valor', personalModo: 'mes', personalValor: '960' }));
  assert.equal(r.mensal, 96000);
  assert.equal(r.porIda, 12000);
  assert.equal(r.componentes.find((c) => c.chave === 'acesso')!.estado, 'incluido');
  assert.ok(r.temPersonal);
});

test('plano anual à vista: sai inteiro no primeiro mês, equivale a 1/12 e conta uma vez no ano', () => {
  const r = calcular(cen({ acessoModo: 'avista', acessoValor: '1.200,00', avistaMeses: '12', freqValor: '10', freqPeriodo: 'mes' }));
  assert.equal(r.primeiroMes, 120000);
  assert.equal(r.mensal, 10000);
  assert.equal(r.ano, 120000);
  assert.equal(r.porIda, 1000);
});

test('plano semestral à vista entra duas vezes no ano', () => {
  const r = calcular(cen({ acessoModo: 'avista', acessoValor: '600', avistaMeses: '6', freqValor: '10', freqPeriodo: 'mes' }));
  assert.equal(r.mensal, 10000);
  assert.equal(r.ano, 120000);
});

test('matrícula entra no primeiro mês e no ano, não no mês típico', () => {
  const r = calcular(cen({ acessoValor: '399', inicial: 'valor', inicialValor: '120', freqValor: '3', freqPeriodo: 'semana' }));
  assert.equal(r.primeiroMes, 51900);
  assert.equal(r.mensal, 39900);
  assert.equal(r.ano, 399 * 12 * 100 + 12000);
});

test('taxa anual: primeiro mês cheia, mês típico 1/12, ano uma vez', () => {
  const r = calcular(cen({ acessoValor: '100', anual: 'valor', anualValor: '120', freqValor: '8', freqPeriodo: 'mes' }));
  assert.equal(r.primeiroMes, 22000);
  assert.equal(r.mensal, 11000);
  assert.equal(r.ano, 132000);
});

test('frequência semanal usa 52 semanas ÷ 12 meses', () => {
  const r = calcular(cen({ acessoValor: '130', freqValor: '3', freqPeriodo: 'semana' }));
  assert.equal(r.idasMes, 13);
  assert.equal(r.porIda, 1000);
  assert.match(r.premissaIdas, /52 semanas/);
});

test('mensalidade vazia fica pendente, não vira zero', () => {
  const r = calcular(cen({ freqValor: '8', freqPeriodo: 'mes' }));
  assert.equal(r.mensal, null);
  assert.equal(r.primeiroMes, null);
  assert.equal(r.porIda, null);
  assert.ok(r.pendencias.includes('Mensalidade'));
  assert.equal(r.componentes[0].estado, 'pendente');
});

test('custo extra selecionado e vazio gera subtotal e pendência', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '8', freqPeriodo: 'mes', transporte: 'valor', transporteValor: '' }));
  assert.equal(r.mensal, null);
  assert.equal(r.parcial.mensal, 15000);
  assert.ok(r.pendencias.includes('Estacionamento e deslocamento'));
});

test('frequência zero: custo por ida indisponível com motivo', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '0', freqPeriodo: 'semana' }));
  assert.equal(r.mensal, 15000);
  assert.equal(r.porIda, null);
  assert.match(r.motivoPorIda!, /zero/);
});

test('frequência vazia: custo por ida indisponível', () => {
  const r = calcular(cen({ acessoValor: '150' }));
  assert.equal(r.porIda, null);
  assert.match(r.motivoPorIda!, /frequência/);
});

test('personal por aula com menos aulas que idas', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '12', freqPeriodo: 'mes', personal: 'valor', personalModo: 'aula', personalValor: '100', personalAulas: '8', personalAulasPeriodo: 'mes' }));
  assert.equal(r.mensal, 15000 + 80000);
  assert.equal(r.erros.length, 0);
});

test('personal por aula sem quantidade fica pendente', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '12', freqPeriodo: 'mes', personal: 'valor', personalModo: 'aula', personalValor: '100' }));
  assert.equal(r.mensal, null);
  assert.ok(r.pendencias.some((p) => /aulas/i.test(p)));
});

test('mais aulas com personal do que idas é erro', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '2', freqPeriodo: 'semana', personal: 'valor', personalModo: 'aula', personalValor: '100', personalAulas: '12', personalAulasPeriodo: 'mes' }));
  assert.ok(r.erros.some((e) => e.campo === 'personalAulas'));
  assert.equal(r.mensal, null);
});

test('taxa de personal externo já incluída não é cobrada de novo', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '8', freqPeriodo: 'mes', personal: 'valor', personalModo: 'mes', personalValor: '800', taxaExterno: 'incluido' }));
  assert.equal(r.mensal, 95000);
  assert.equal(r.componentes.find((c) => c.chave === 'taxaExterno')!.estado, 'incluido');
});

test('taxa de personal externo por aula usa a quantidade de aulas', () => {
  const r = calcular(cen({ acessoValor: '150', freqValor: '12', freqPeriodo: 'mes', personal: 'valor', personalModo: 'aula', personalValor: '100', personalAulas: '8', personalAulasPeriodo: 'mes', taxaExterno: 'valor', taxaExternoModo: 'aula', taxaExternoValor: '15' }));
  assert.equal(r.mensal, 15000 + 80000 + 12000);
});

test('valor negativo é erro', () => {
  const r = calcular(cen({ acessoValor: '-10', freqValor: '8', freqPeriodo: 'mes' }));
  assert.ok(r.erros.some((e) => e.campo === 'acessoValor'));
  assert.equal(r.mensal, null);
});

test('conversão de reais', () => {
  assert.equal(paraCentavos('149,90'), 14990);
  assert.equal(paraCentavos('R$ 1.200,50'), 120050);
  assert.equal(paraCentavos('1.200'), 120000);
  assert.equal(paraCentavos('99.9'), 9990);
  assert.equal(paraCentavos(''), null);
  assert.equal(paraCentavos('abc'), 'invalido');
  assert.equal(reais(123456), 'R$\u00a01.234,56');
});

test('mais barato compara só cenários completos no critério', () => {
  const a = calcular(cen({ acessoValor: '160', freqValor: '8', freqPeriodo: 'mes', transporte: 'valor', transporteValor: '10' }));
  const b = calcular(cen({ acessoValor: '210', freqValor: '12', freqPeriodo: 'mes' }));
  const c = calcular(cen({ freqValor: '8', freqPeriodo: 'mes' }));
  assert.deepEqual(maisBarato([a, b, c], 'mensal').indices, [1]);
  assert.deepEqual(maisBarato([a, b, c], 'porIda').indices, [1]);
  assert.equal(maisBarato([a, b, c], 'mensal').comparados, 2);
  assert.deepEqual(maisBarato([a, c], 'mensal').indices, []);
});

test('planos das fichas: só mensais, com adesão quando publicada', () => {
  const ps = planosMensais([
    { nome: 'Fidelidade 12 meses', preco: 'R$ 399,00/mês', condicoes: 'Matrícula única de R$ 120.' },
    { nome: 'Plano Smart', preco: 'R$ 149,90/mês', condicoes: 'Com fidelidade; sem fidelidade, mais R$ 20 por mês. Adesão grátis.' },
    { nome: 'Plano Black', preco: 'R$ 159,90/mês', condicoes: 'Com fidelidade. Adesão de R$ 9,90. Primeiro mês gratuito.' },
    { nome: 'Day use', preco: 'R$ 90,00', condicoes: 'Pagamento no local.' },
    { nome: 'Ilimitado', preco: 'R$ 480/mês', condicoes: 'Contrato trimestral.' },
  ]);
  assert.equal(ps.length, 4);
  assert.deepEqual(ps.map((p) => p.inicial), [12000, 0, 990, null]);
  assert.equal(ps[0].centavos, 39900);
});
