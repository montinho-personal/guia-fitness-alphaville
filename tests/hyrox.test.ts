import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { carga, paraSegundos, relogio, porExtenso, plano, textoPlano, mensagemHyrox, type DadosHyrox } from '../src/lib/hyrox.ts';

const D = JSON.parse(readFileSync(new URL('../src/data/hyrox.json', import.meta.url), 'utf8')) as DadosHyrox;
const E = D.estacoes;
const div = (id: string) => D.divisoes.find((d) => d.id === id)!;

test('dados: 8 estações e 10 divisões, com fonte e data', () => {
  assert.equal(E.length, 8); assert.equal(D.divisoes.length, 10);
  assert.match(D.url, /^https:\/\/hyrox\.com\//); assert.match(D.conferido_em, /^\d{4}-\d\d-\d\d$/);
});
test('cargas oficiais do individual', () => {
  assert.deepEqual(['push', 'pull', 'farmers', 'lunges', 'wall'].map((k) => carga(div('open-f'), k)), ['102 kg', '78 kg', '2 × 16 kg', '10 kg', '4 kg']);
  assert.deepEqual(['push', 'pull', 'farmers', 'lunges', 'wall'].map((k) => carga(div('open-m'), k)), ['152 kg', '103 kg', '2 × 24 kg', '20 kg', '6 kg']);
  assert.deepEqual(['push', 'pull', 'farmers', 'lunges', 'wall'].map((k) => carga(div('pro-m'), k)), ['202 kg', '153 kg', '2 × 32 kg', '30 kg', '9 kg']);
});
test('Pro feminino e dupla mista usam as cargas do Open masculino', () => {
  for (const k of ['push', 'pull', 'farmers', 'lunges', 'wall']) { assert.equal(carga(div('pro-f'), k), carga(div('open-m'), k)); assert.equal(carga(div('dupla-mista'), k), carga(div('open-m'), k)); }
});
test('SkiErg, burpee e remo não têm carga', () => { for (const k of ['ski', 'burpee', 'remo']) assert.equal(carga(div('open-m'), k), null); });
test('revezamento misto separa mulheres e homens', () => { assert.match(carga(div('rev-misto'), 'wall')!, /4 kg \(mulheres\) ou 6 kg \(homens\)/); });

test('paraSegundos: meta de prova', () => {
  assert.equal(paraSegundos('1:30', 'prova'), 5400); assert.equal(paraSegundos('1:30:00', 'prova'), 5400);
  assert.equal(paraSegundos('90', 'prova'), 5400); assert.equal(paraSegundos('1h30', 'prova'), 5400); assert.equal(paraSegundos('2h', 'prova'), 7200);
  assert.equal(paraSegundos('1:15:30', 'prova'), 4530);
});
test('paraSegundos: ritmo', () => { assert.equal(paraSegundos('6:15', 'ritmo'), 375); assert.equal(paraSegundos("5'30", 'ritmo'), 330); assert.equal(paraSegundos('6', 'ritmo'), 360); });
test('paraSegundos: entradas inválidas', () => { for (const t of ['', 'abc', '6:75', '1::3', '-5']) assert.equal(paraSegundos(t, 'ritmo'), null); });
test('relogio e porExtenso', () => {
  assert.equal(relogio(375), '6:15'); assert.equal(relogio(5400), '1:30:00'); assert.equal(porExtenso(5400), '1h30min'); assert.equal(porExtenso(4530), '1h15min30s'); assert.equal(porExtenso(330), '5min30s');
});

test('plano padrão: sobra da meta dividida por igual e total igual à meta', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360 }, E);
  assert.equal(p.ok, true); assert.equal(p.corridaTotal, 2880); assert.equal(p.estacoesTotal, 2520); assert.equal(p.mediaEstacao, 315);
  assert.equal(p.total, 5400); assert.equal(p.diferenca, 0); assert.equal(p.segmentos.length, 16);
  assert.equal(p.segmentos[0].acum, 360); assert.equal(p.segmentos[1].acum, 675); assert.equal(p.segmentos[15].acum, 5400);
});
test('plano com transições: o tempo sai das estações e entra no relógio', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360, transSeg: 480 }, E);
  assert.equal(p.estacoesTotal, 2040); assert.equal(p.mediaEstacao, 255); assert.equal(p.total, 5400);
  assert.equal(p.segmentos[1].acum, 360 + 60 + 255);
});
test('plano com tempos próprios em todas as estações recalcula o total', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360, estacoesSeg: Array(8).fill(300) }, E);
  assert.equal(p.personalizado, true); assert.equal(p.total, 2880 + 2400); assert.equal(p.diferenca, -120);
});
test('plano com parte das estações preenchida: as outras dividem o resto', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360, estacoesSeg: [240, null, null, null, 240, null, null, 480] }, E);
  assert.equal(p.total, 5400); assert.equal(p.segmentos[1].dur, 240); assert.equal(p.segmentos[3].dur, Math.round((2520 - 960) / 5));
});
test('ritmo lento demais para a meta devolve erro com o ritmo-limite', () => {
  const p = plano({ metaSeg: 3600, ritmoSeg: 450 }, E);
  assert.equal(p.ok, false); assert.equal(p.ritmoMaximo, 450); assert.match(p.erro!, /corrida sozinha leva 1h/);
});
test('limites de entrada', () => {
  assert.equal(plano({ metaSeg: 600, ritmoSeg: 360 }, E).ok, false); assert.equal(plano({ metaSeg: 5400, ritmoSeg: 60 }, E).ok, false); assert.equal(plano({ metaSeg: NaN, ritmoSeg: 360 }, E).ok, false);
});
test('texto do plano e mensagem do WhatsApp', () => {
  const p = plano({ metaSeg: 5400, ritmoSeg: 360 }, E);
  const t = textoPlano(p, div('open-m'), 360);
  assert.match(t, /Hyrox · Individual, Open masculino/); assert.match(t, /1:30:00 {2}Wall Balls/); assert.equal(t.split('\n').length, 18);
  const m = mensagemHyrox(div('dupla-mista'), 5400, 360);
  assert.match(m, /Categoria: Dupla mista\./); assert.match(m, /1h30min, correndo a 6:00 por km/);
  assert.doesNotMatch(mensagemHyrox(null), /Categoria/);
});
