// Testes do buscador de Wellhub e TotalPass. Fixtures fictícias, com a ordem oficial dos planos do projeto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { acessa, cobertura, planoComum, type EntradaBen } from '../src/lib/beneficios.ts';

const P = JSON.parse(readFileSync(new URL('../src/data/planos-agregadores.json', import.meta.url), 'utf8'));
const W: string[] = P.wellhub.planos.map((x: string[]) => x[0]);
const T: string[] = P.totalpass.planos.map((x: string[]) => x[0]);

const casa: EntradaBen[] = [
  { nome: 'Wellhub', plano_minimo: 'Silver', musculacao: true, atividades: ['Musculação', 'Yoga'] },
  { nome: 'TotalPass', plano_minimo: 'TP 2', planos: ['TP 2', 'TP 2+', 'TP 3', 'TP 4', 'TP 5', 'TP 5+', 'TP 6', 'TP 7'], musculacao: true, atividades: ['Musculação'] },
];
const trabalho: EntradaBen[] = [
  { nome: 'Wellhub', plano_minimo: 'Gold', musculacao: true, atividades: ['Musculação'] },
  { nome: 'TotalPass', plano_minimo: 'TP 4', planos: ['TP 4', 'TP 5', 'TP 5+', 'TP 6', 'TP 7'], musculacao: true, atividades: ['Musculação'] },
];
const soLuta: EntradaBen[] = [{ nome: 'Wellhub', plano_minimo: 'Starter', musculacao: false, atividades: ['Muay Thai', 'Boxe'] }];

test('plano informado dá acesso à musculação na unidade', () => {
  assert.equal(cobertura(casa, 'Wellhub', 'musculacao').estado, 'confirmada');
  assert.equal(acessa(casa[0], 'Silver', W), true);
  assert.equal(acessa(casa[0], 'Gold', W), true);
  assert.equal(acessa(casa[0], 'Basic+', W), false);
  assert.equal(acessa(casa[1], 'TP 2+', T), true);
  assert.equal(acessa(casa[1], 'TP 1+', T), false);
});

test('unidade aceita o benefício só para outra modalidade', () => {
  assert.equal(cobertura(soLuta, 'Wellhub', 'musculacao').estado, 'outra-modalidade');
  assert.equal(cobertura(soLuta, 'Wellhub', 'lutas').estado, 'confirmada');
  const r = planoComum(casa, soLuta, 'Wellhub', 'musculacao', W);
  assert.equal(r.tipo, 'incompativel');
});

test('duas unidades com plano comum confirmado: o menor da interseção', () => {
  const w = planoComum(casa, trabalho, 'Wellhub', 'musculacao', W);
  assert.deepEqual(w.tipo === 'comum' && w.plano, 'Gold');
  const t = planoComum(casa, trabalho, 'TotalPass', 'musculacao', T);
  assert.deepEqual(t.tipo === 'comum' && t.plano, 'TP 4');
});

test('comparação pendente quando uma unidade não tem o benefício registrado', () => {
  const r = planoComum(casa, soLuta, 'TotalPass', 'musculacao', T);
  assert.equal(r.tipo, 'pendente');
  assert.equal(cobertura(soLuta, 'TotalPass', 'musculacao').estado, 'a-confirmar');
});

test('listas do TotalPass sem plano em comum', () => {
  const a: EntradaBen[] = [{ nome: 'TotalPass', plano_minimo: 'TP 1', planos: ['TP 1', 'TP 1+'], musculacao: true }];
  const b: EntradaBen[] = [{ nome: 'TotalPass', plano_minimo: 'TP 6', planos: ['TP 6', 'TP 7'], musculacao: true }];
  const r = planoComum(a, b, 'TotalPass', 'musculacao', T);
  assert.equal(r.tipo, 'incompativel');
});

test('não aceita confirmado é diferente de a confirmar', () => {
  const x: EntradaBen[] = [{ nome: 'Wellhub', situacao: 'nao-aceita', plano_minimo: '' }];
  assert.equal(cobertura(x, 'Wellhub', 'musculacao').estado, 'nao-aceita');
  assert.equal(cobertura([], 'Wellhub', 'musculacao').estado, 'a-confirmar');
});

test('ficha real: Smart Fit Sodimac no TotalPass a partir do TP 2', async () => {
  const y = readFileSync(new URL('../src/data/academias/smart-fit-sodimac-alphaville.yaml', import.meta.url), 'utf8');
  assert.match(y, /plano_minimo: TP 2\n/);
  assert.match(y, /musculacao: true/);
});
