// Casos do buscador de academias abertas (dados fictícios). Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avaliar, situacaoNoDia, diaDaSemana, e24hTodos, dias24h, hora, min, type UnidadeHorario, type Feriado } from '../src/lib/horarios.ts';

const vazio = { seg: [], ter: [], qua: [], qui: [], sex: [], sab: [], dom: [] };
const u = (h: Partial<UnidadeHorario['horario']>, extra: Partial<UnidadeHorario> = {}): UnidadeHorario => ({ horario: { ...vazio, ...h }, municipio: 'Barueri', ...extra });
const DOM = '2026-11-22', SEG = '2026-11-23', SAB = '2026-11-21', SEX = '2026-11-20';
const FER: Feriado[] = [
  { data: '2026-11-20', nome: 'Dia da Consciência Negra', abrangencia: 'nacional' },
  { data: '2026-11-14', nome: 'Aniversário fictício', abrangencia: 'municipal', municipio: 'Santana de Parnaíba' },
];

test('datas: dia da semana sem depender do fuso de quem roda', () => {
  assert.equal(diaDaSemana(DOM), 'dom');
  assert.equal(diaDaSemana(SEG), 'seg');
  assert.equal(diaDaSemana('2026-11-18'), 'qua');
});

test('exemplo do pedido: domingo 8h–14h; 13h30 + 45 min fica fora, 13h + 45 min entra', () => {
  const x = u({ dom: ['08:00-14:00'] });
  const r1 = avaliar(x, DOM, min('13:30'), 45, []);
  assert.equal(r1.tipo, 'incompativel'); assert.equal(r1.tipo === 'incompativel' && r1.motivo, 'fecha-antes');
  const r2 = avaliar(x, DOM, min('13:00'), 45, []);
  assert.equal(r2.tipo, 'compativel'); assert.equal(r2.tipo === 'compativel' && hora(r2.termina), '13h45');
});

test('treino que cabe exatamente na janela', () => {
  const r = avaliar(u({ dom: ['08:00-14:00'] }), DOM, min('13:00'), 60, []);
  assert.equal(r.tipo, 'compativel'); assert.equal(r.tipo === 'compativel' && hora(r.fecha), '14h');
});

test('intervalo no meio do dia: treino que atravessa o intervalo é incompatível', () => {
  const x = u({ seg: ['06:00-12:00', '14:00-22:00'] });
  assert.equal(avaliar(x, SEG, min('11:30'), 60, []).tipo, 'incompativel');
  const r = avaliar(x, SEG, min('12:30'), 30, []);
  assert.equal(r.tipo === 'incompativel' && r.motivo, 'intervalo');
  assert.equal(avaliar(x, SEG, min('14:00'), 60, []).tipo, 'compativel');
});

test('última entrada anterior ao fechamento', () => {
  const x = u({ seg: ['06:00-23:00'] }, { ultima_entrada: { seg: '22:00' } });
  assert.equal(avaliar(x, SEG, min('21:30'), 60, []).tipo, 'compativel');
  const r = avaliar(x, SEG, min('22:15'), 30, []);
  assert.equal(r.tipo === 'incompativel' && r.motivo, 'entrada');
});

test('sessão que cruza a meia-noite: 24h contínuo entra; fecha à meia-noite e reabre às 5h não entra', () => {
  const h24 = u({ sab: ['00:00-23:59'], dom: ['00:00-23:59'] });
  assert.equal(avaliar(h24, SAB, min('23:30'), 60, []).tipo, 'compativel');
  const meiaNoite = u({ sab: ['05:00-23:59'], dom: ['05:00-23:59'] });
  const r = avaliar(meiaNoite, SAB, min('23:30'), 60, []);
  assert.equal(r.tipo === 'incompativel' && r.motivo, 'fecha-antes');
  // Faixa que atravessa a meia-noite na própria grade (22h às 2h)
  const madrugada = u({ sab: ['22:00-02:00'] }, { horario_status: { dom: 'fechado' } });
  assert.equal(avaliar(madrugada, SAB, min('23:30'), 90, []).tipo, 'compativel');
  assert.equal(avaliar(madrugada, DOM, min('01:00'), 45, []).tipo, 'compativel');
  assert.equal(avaliar(madrugada, DOM, min('01:30'), 45, []).tipo, 'incompativel');
});

test('cruza a meia-noite com dia seguinte sem horário: a confirmar', () => {
  const x = u({ sab: ['00:00-23:59'] });
  assert.equal(avaliar(x, SAB, min('23:30'), 60, []).tipo, 'a-confirmar');
});

test('24h em dias úteis com domingo reduzido: selo só nos dias certos', () => {
  const x = u({ seg: ['00:00-23:59'], ter: ['00:00-23:59'], qua: ['00:00-23:59'], qui: ['00:00-23:59'], sex: ['00:00-23:59'], sab: ['08:00-20:00'], dom: ['08:00-14:00'] });
  assert.equal(e24hTodos(x), false);
  assert.deepEqual(dias24h(x), ['seg', 'ter', 'qua', 'qui', 'sex']);
  assert.equal(avaliar(x, SEG, min('03:00'), 60, []).tipo, 'compativel');
  assert.equal(avaliar(x, DOM, min('03:00'), 60, []).tipo, 'incompativel');
  // Sexta 23h30 + 1h: sábado só abre às 8h
  assert.equal(avaliar(x, '2026-11-27', min('23:30'), 60, []).tipo, 'incompativel');
  const todos = u({ seg: ['00:00-23:59'], ter: ['00:00-23:59'], qua: ['00:00-23:59'], qui: ['00:00-23:59'], sex: ['00:00-23:59'], sab: ['00:00-23:59'], dom: ['00:00-23:59'] });
  assert.equal(e24hTodos(todos), true);
});

test('feriado com horário específico confirmado prevalece sobre a grade', () => {
  const x = u({ sex: ['06:00-23:00'] }, { horario_excecoes: [{ data: SEX, faixas: ['09:00-13:00'], situacao: 'confirmada', motivo: 'Consciência Negra' }] });
  assert.equal(avaliar(x, SEX, min('12:00'), 60, FER).tipo, 'compativel');
  assert.equal(avaliar(x, SEX, min('12:30'), 60, FER).tipo, 'incompativel');
  const fechada = u({ sex: ['06:00-23:00'] }, { horario_excecoes: [{ data: SEX, faixas: [], situacao: 'confirmada', motivo: 'Fechada no feriado' }] });
  assert.equal(situacaoNoDia(fechada, SEX, FER).tipo, 'fechada');
});

test('feriado só com grade genérica: horário padrão de feriados, a confirmar', () => {
  const x = u({ sex: ['06:00-23:00'] }, { horario_feriados: { faixas: ['08:00-17:00'] } });
  const r = avaliar(x, SEX, min('10:00'), 60, FER);
  assert.equal(r.tipo, 'a-confirmar'); assert.equal(r.tipo === 'a-confirmar' && r.motivo, 'feriado-padrao');
  const s = avaliar(u({ sex: ['06:00-23:00'] }), SEX, min('10:00'), 60, FER);
  assert.equal(s.tipo === 'a-confirmar' && s.motivo, 'feriado-sem-horario');
});

test('feriado municipal vale só para a unidade daquele município', () => {
  const sab = '2026-11-14';
  const barueri = u({ sab: ['08:00-17:00'] });
  const santana = u({ sab: ['08:00-17:00'] }, { municipio: 'Santana de Parnaíba' });
  assert.equal(avaliar(barueri, sab, min('10:00'), 60, FER).tipo, 'compativel');
  assert.equal(avaliar(santana, sab, min('10:00'), 60, FER).tipo, 'a-confirmar');
});

test('fechada é diferente de horário a confirmar', () => {
  const fech = u({}, { horario_status: { dom: 'fechado' } });
  const desc = u({});
  assert.equal(avaliar(fech, DOM, min('10:00'), 60, []).tipo, 'incompativel');
  assert.equal(avaliar(desc, DOM, min('10:00'), 60, []).tipo, 'a-confirmar');
  assert.equal(situacaoNoDia(u({ dom: ['08:00-14:00'] }, { horario_status: { dom: 'a-confirmar' } }), DOM, []).tipo, 'a-confirmar');
});

test('antes de abrir: motivo ainda-fechada com hora de abertura', () => {
  const r = avaliar(u({ seg: ['06:00-22:00'] }), SEG, min('05:00'), 60, []);
  assert.equal(r.tipo === 'incompativel' && r.motivo, 'ainda-fechada');
  assert.equal(r.tipo === 'incompativel' && hora(r.abre!), '6h');
});
