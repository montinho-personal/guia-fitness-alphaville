import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EQUIPAMENTOS, EXERCICIOS, PADROES, cobertura, avaliar, semana, oQueMaisAjuda, mensagemCondominio, possiveis, type EquipId } from '../src/lib/treinoCondominio.ts';

const S = (...x: EquipId[]) => new Set<EquipId>(x);
const niv = (eq: Set<EquipId>) => Object.fromEntries(cobertura(eq).map((c) => [c.padrao, c.nivel]));

test('todo exercício usa equipamento e padrão que existem', () => {
  const eqs = new Set(EQUIPAMENTOS.map((e) => e.id)), ps = new Set(PADROES.map((p) => p.id));
  for (const e of EXERCICIOS) { assert.ok(ps.has(e.padrao), e.nome); for (const r of e.requer) assert.ok(eqs.has(r), `${e.nome}: ${r}`); }
  for (const e of EQUIPAMENTOS) assert.ok(EXERCICIOS.some((x) => x.requer.includes(e.id)), `equipamento sem exercício: ${e.id}`);
});
test('sem equipamento: não dá para puxar; o resto é adaptação, e o abdômen fica coberto', () => {
  assert.deepEqual(niv(S()), { empurrar: 'adaptado', puxar: 'falta', agachar: 'adaptado', quadril: 'adaptado', core: 'bom', cardio: 'adaptado' });
  const r = avaliar([], 3, 'comecando');
  assert.equal(r.veredito, 'incompleto'); assert.match(r.titulo, /Falta equipamento para puxar/); assert.deepEqual(r.faltam, ['puxar']);
});
test('só halteres já cobre a força toda', () => {
  const n = niv(S('halteres'));
  for (const p of ['empurrar', 'puxar', 'agachar', 'quadril', 'core']) assert.equal(n[p], 'bom');
  assert.equal(n.cardio, 'adaptado');
  assert.equal(avaliar(['halteres'], 3, 'treina').veredito, 'completo');
});
test('só cardio e elásticos: treina tudo, com adaptações', () => {
  const r = avaliar(['esteira', 'elasticos'], 3, 'treina');
  assert.equal(r.veredito, 'adaptado'); assert.deepEqual(r.adaptados, ['empurrar', 'puxar', 'agachar', 'quadril']); assert.match(r.resumo, /teto de carga/);
});
test('supino com barra exige barra, banco e suporte', () => {
  assert.ok(!possiveis('empurrar', S('barra', 'banco')).some((e) => e.nome === 'Supino com barra'));
  assert.ok(possiveis('empurrar', S('barra', 'banco', 'rack')).some((e) => e.nome === 'Supino com barra'));
});
test('aviso de pernas aparece com halteres e some com aparelho de perna', () => {
  assert.ok(avaliar(['halteres', 'banco'], 3, 'treina').avisos.some((a) => /Pernas costumam/.test(a)));
  assert.ok(!avaliar(['halteres', 'maquinas-perna'], 3, 'treina').avisos.some((a) => /[Pp]ernas/.test(a)));
  assert.ok(avaliar(['halteres'], 3, 'comecando').avisos.some((a) => /fale com o médico/.test(a)));
});
test('o que mais ajuda: sem nada, halteres vêm primeiro; nunca sugere o que a pessoa já tem', () => {
  const a = oQueMaisAjuda(S());
  assert.equal(a[0].id, 'halteres'); assert.ok(a[0].melhora.includes('puxar'));
  assert.ok(!oQueMaisAjuda(S('halteres')).some((x) => x.id === 'halteres'));
  assert.deepEqual(oQueMaisAjuda(S(...EQUIPAMENTOS.map((e) => e.id))), []);
});
test('semana: número de dias, movimentos da força presentes e exercícios alternados', () => {
  for (const d of [2, 3, 4, 5]) {
    const s = semana(S('halteres', 'banco', 'esteira'), d);
    assert.equal(s.length, d);
    const ps = new Set(s.flatMap((x) => x.itens.map((i) => i.padrao)));
    for (const p of ['empurrar', 'puxar', 'agachar', 'quadril']) assert.ok(ps.has(p as never), `${d} dias sem ${p}`);
  }
  const s4 = semana(S('halteres', 'banco'), 4);
  assert.notEqual(s4[0].itens[0].exercicio, s4[2].itens[1].exercicio);
  assert.equal(semana(S('halteres'), 9).length, 3);
});
test('semana: movimento sem equipamento fica sem exercício, não inventa', () => {
  const s = semana(S(), 2);
  assert.equal(s[0].itens.find((i) => i.padrao === 'puxar')!.exercicio, null);
});
test('mensagem do WhatsApp', () => {
  const m = mensagemCondominio(['halteres', 'banco', 'esteira'], 3, 'condominio', 'Tamboré');
  assert.match(m, /na academia do meu condomínio, no Tamboré, 3 vezes por semana/); assert.match(m, /Tenho: halteres, banco e esteira\./);
  assert.match(mensagemCondominio([], 2, 'casa', ''), /Quero treinar em casa, 2 vezes por semana\. Não tenho equipamento\./);
});
