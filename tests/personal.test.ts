// Testes da política de personal externo e do preenchimento da calculadora. Os casos usam dados fictícios.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { politicaPE, prefillTaxa, respostasPE } from '../src/lib/personal.ts';
import { calcular, cenarioVazio, type Cenario } from '../src/lib/custo.ts';

const base = { abrangencia: 'unidade', fonte: 'Fonte fictícia', conferido_em: new Date('2026-11-17'), condicoes: ['Cadastro do profissional.'] };
const cen = (x: Partial<Cenario>): Cenario => ({ ...cenarioVazio('t'), acessoValor: '150', freqValor: '8', freqPeriodo: 'mes', personal: 'valor', personalModo: 'aula', personalValor: '100', personalAulas: '8', personalAulasPeriodo: 'mes', ...x });

test('aceita e cobra do aluno por aula: preenche e usa as aulas', () => {
  const p = politicaPE({ ...base, status: 'aceita-com-condicoes', taxa: { situacao: 'confirmada', valor: 'R$ 15', centavos: 1500, quem_paga: 'aluno', periodicidade: 'aula' } });
  const f = prefillTaxa(p);
  assert.equal(f.taxaExterno, 'valor'); assert.equal(f.taxaExternoModo, 'aula'); assert.equal(f.taxaExternoValor, '15');
  const r = calcular(cen({ taxaExterno: f.taxaExterno, taxaExternoModo: f.taxaExternoModo!, taxaExternoValor: f.taxaExternoValor! }));
  assert.equal(r.mensal, 15000 + 80000 + 12000);
  assert.match(respostasPE(p).taxa, /Paga o aluno/);
});

test('aceita e cobra do aluno por ida: usa as idas', () => {
  const p = politicaPE({ ...base, status: 'aceita', taxa: { situacao: 'confirmada', valor: 'R$ 10', centavos: 1000, quem_paga: 'aluno', periodicidade: 'ida' } });
  const f = prefillTaxa(p);
  const r = calcular(cen({ freqValor: '12', taxaExterno: f.taxaExterno, taxaExternoModo: f.taxaExternoModo!, taxaExternoValor: f.taxaExternoValor! }));
  assert.equal(r.mensal, 15000 + 80000 + 12000);
});

test('cobra do profissional: fica fora do custo do aluno', () => {
  const p = politicaPE({ ...base, status: 'aceita-com-condicoes', taxa: { situacao: 'confirmada', quem_paga: 'profissional' } });
  const f = prefillTaxa(p);
  assert.equal(f.taxaExterno, 'nao');
  assert.match(f.nota, /profissional/);
  const r = calcular(cen({ taxaExterno: f.taxaExterno }));
  assert.equal(r.mensal, 95000);
});

test('aceita com taxa desconhecida: taxa pendente, nunca zero', () => {
  const p = politicaPE({ ...base, status: 'aceita', taxa: { situacao: 'pendente' } });
  const f = prefillTaxa(p);
  assert.equal(f.taxaExterno, 'pendente');
  const r = calcular(cen({ taxaExterno: f.taxaExterno }));
  assert.equal(r.mensal, null);
  assert.equal(respostasPE(p).posso, 'Sim.');
});

test('a confirmar: sem campo na ficha', () => {
  const p = politicaPE(undefined);
  assert.equal(p.status, 'a-confirmar');
  assert.equal(prefillTaxa(p).taxaExterno, 'pendente');
  assert.match(respostasPE(p).posso, /Ainda não confirmado/);
});

test('não aceita: resposta clara e taxa não se aplica', () => {
  const p = politicaPE({ ...base, status: 'nao-aceita', condicoes: [], taxa: { situacao: 'pendente' } });
  const r = respostasPE(p);
  assert.match(r.posso, /^Não/);
  assert.equal(r.taxa, 'Não se aplica.');
});

test('taxa já incluída no valor do personal não é cobrada duas vezes', () => {
  const r = calcular(cen({ personalModo: 'mes', personalValor: '800', taxaExterno: 'incluido' }));
  assert.equal(r.mensal, 95000);
});

test('sem taxa confirmada pela fonte', () => {
  const p = politicaPE({ ...base, status: 'aceita', taxa: { situacao: 'sem-taxa' } });
  assert.equal(prefillTaxa(p).taxaExterno, 'nao');
  assert.match(respostasPE(p).taxa, /Sem taxa/);
});
