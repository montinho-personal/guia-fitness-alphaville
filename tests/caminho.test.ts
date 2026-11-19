import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { distKm, distTexto, analisar, mensagemCaminho, type Lugar } from '../src/lib/caminho.ts';

const P = JSON.parse(readFileSync(new URL('../src/data/pontos-caminho.json', import.meta.url), 'utf8'));
// Eixo leste-oeste na latitude da região: 0,01 grau de longitude ≈ 1,02 km.
const pt = (lng: number, lat = -23.5) => ({ lat, lng });
const L = (id: string, lng: number, lat = -23.5, destaque = false): Lugar => ({ id, nome: id, ...pt(lng, lat), destaque });

test('dados: pontos com id único, fonte, data e coordenadas dentro da região', () => {
  const ids = P.pontos.map((p: any) => p.id);
  assert.equal(new Set(ids).size, ids.length); assert.ok(P.pontos.length >= 25);
  assert.match(P.fonte, /OpenStreetMap/); assert.match(P.conferido_em, /^\d{4}-\d\d-\d\d$/);
  for (const p of P.pontos) { assert.ok(p.lat < -23.35 && p.lat > -23.6, p.id); assert.ok(p.lng < -46.75 && p.lng > -47.05, p.id); assert.ok(p.osm, p.id); }
});
test('distKm: zero no mesmo ponto, simétrica e na ordem de grandeza certa', () => {
  assert.equal(distKm(pt(-46.85), pt(-46.85)), 0);
  const d = distKm(pt(-46.85), pt(-46.84));
  assert.ok(d > 1.0 && d < 1.04, String(d)); assert.equal(d, distKm(pt(-46.84), pt(-46.85)));
  const n = distKm(pt(-46.85, -23.5), pt(-46.85, -23.49)); assert.ok(n > 1.1 && n < 1.12, String(n));
});
test('distTexto', () => {
  assert.equal(distTexto(0.02), 'ao lado'); assert.equal(distTexto(0.36), '350 m'); assert.equal(distTexto(0.98), '1,0 km'); assert.equal(distTexto(0.96), '950 m');
  assert.equal(distTexto(1.64), '1,6 km'); assert.equal(distTexto(3), '3,0 km');
});
test('só origem: lista por distância dentro do raio, sem grupos de trabalho e caminho', () => {
  const a = analisar(pt(-46.85), null, [L('longe', -46.80), L('perto', -46.851), L('medio', -46.86)], 1.6);
  assert.deepEqual(a.casa.map((x) => x.lugar.id), ['perto', 'medio']); assert.deepEqual(a.trabalho, []); assert.deepEqual(a.caminho, []);
  assert.equal(a.trajeto, null); assert.equal(a.maisPertoCasa!.lugar.id, 'perto'); assert.equal(a.casa[0].desvio, null);
});
test('casa e trabalho: três grupos sem repetição', () => {
  const casa = pt(-46.90), trab = pt(-46.80); // ≈ 10 km
  const xs = [L('junto-casa', -46.895), L('junto-trab', -46.805), L('meio', -46.85), L('fora', -46.85, -23.56), L('alem-trab', -46.79)];
  const a = analisar(casa, trab, xs, 1.6);
  assert.deepEqual(a.casa.map((x) => x.lugar.id), ['junto-casa']);
  assert.deepEqual(a.trabalho.map((x) => x.lugar.id), ['junto-trab', 'alem-trab']);
  assert.deepEqual(a.caminho.map((x) => x.lugar.id), ['meio']);
  assert.ok(a.caminho[0].desvio! < 0.01); assert.ok(a.trajeto! > 10 && a.trajeto! < 10.4);
});
test('academia entre os dois pontos, perto dos dois, entra só no grupo do ponto mais próximo', () => {
  const a = analisar(pt(-46.85), pt(-46.84), [L('x', -46.846)], 1.6);
  assert.deepEqual(a.casa.map((x) => x.lugar.id), ['x']); assert.deepEqual(a.trabalho, []); assert.deepEqual(a.caminho, []);
});
test('raio menor tira do caminho quem exige desvio maior', () => {
  const casa = pt(-46.90), trab = pt(-46.80), fora = L('desvio', -46.85, -23.52); // ≈ 2,2 km ao sul da linha
  assert.equal(analisar(casa, trab, [fora], 0.8).caminho.length, 0);
  assert.equal(analisar(casa, trab, [fora], 1.6).caminho.length, 1);
});
test('destaque sobe para o topo do grupo em que entra, e só nele', () => {
  const a = analisar(pt(-46.85), null, [L('a', -46.851), L('casa-destaque', -46.86, -23.5, true), L('b', -46.855)], 1.6);
  assert.deepEqual(a.casa.map((x) => x.lugar.id), ['casa-destaque', 'a', 'b']);
  const b = analisar(pt(-46.85), null, [L('a', -46.851), L('longe-destaque', -46.70, -23.5, true)], 1.6);
  assert.deepEqual(b.casa.map((x) => x.lugar.id), ['a']);
});
test('nada dentro do raio: grupos vazios e a mais próxima informada', () => {
  const a = analisar(pt(-46.85), pt(-46.84), [L('longe', -46.70)], 0.4);
  assert.equal(a.casa.length + a.trabalho.length + a.caminho.length, 0); assert.equal(a.maisPertoCasa!.lugar.id, 'longe'); assert.equal(a.maisPertoTrabalho!.lugar.id, 'longe');
});
test('mensagem do WhatsApp usa só nomes de lugar', () => {
  assert.match(mensagemCaminho('Alphaville Residencial 4', 'Empresarial 18 do Forte'), /Moro perto de Alphaville Residencial 4 e trabalho perto de Empresarial 18 do Forte\./);
  assert.match(mensagemCaminho('Tamboré 3', ''), /Fico perto de Tamboré 3\./);
  assert.doesNotMatch(mensagemCaminho('', ''), /perto de \./); assert.doesNotMatch(mensagemCaminho('A', 'B'), /-?\d{2}\.\d{3}/);
});
