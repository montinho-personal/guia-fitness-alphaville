// Teste "presencial ou online": regras determinísticas. Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avaliar, mensagemResultado, PERGUNTAS, type Respostas } from '../src/lib/formatoPersonal.ts';

const iniciante: Respostas = { experiencia: 'nunca', execucao: 'insegura', dor: 'nao', presenca: 'preciso', video: 'nao', agenda: 'facil', local: 'condominio', precisa: 'correcao', orcamento: 'pouco' };
const autonomo: Respostas = { experiencia: 'regular', execucao: 'segura', dor: 'nao', presenca: 'sozinho', video: 'sim', agenda: 'dificil', local: 'academia', precisa: 'plano', orcamento: 'pesa' };

test('iniciante inseguro com horário fixo: presencial', () => {
  const r = avaliar(iniciante); assert.equal(r.tipo, 'presencial'); assert.ok(r.proPresencial.length >= 4); assert.equal(r.completo, true);
});
test('quem treina há anos, com autonomia e agenda difícil: online', () => {
  const r = avaliar(autonomo); assert.equal(r.tipo, 'online'); assert.ok(r.proOnline.length >= 4);
});
test('precisa de presença, mas a rotina não deixa: híbrido, com o conflito à mostra', () => {
  const r = avaliar({ ...iniciante, agenda: 'impossivel' }); assert.equal(r.tipo, 'hibrido'); assert.match(r.conflitos[0], /necessidade aponta para o presencial/);
  assert.equal(avaliar({ ...iniciante, local: 'fora' }).tipo, 'hibrido');
});
test('perfil equilibrado: os dois podem funcionar, sem forçar um vencedor', () => {
  const r = avaliar({ experiencia: 'voltando', execucao: 'alguns', dor: 'nao', presenca: 'ajuda', video: 'talvez', agenda: 'as-vezes', local: 'academia', precisa: 'cobranca', orcamento: 'pesa' });
  assert.equal(r.tipo, 'ambos');
});
test('orçamento decisivo não decide quando falta autonomia', () => {
  const r = avaliar({ ...iniciante, orcamento: 'decisivo' }); assert.equal(r.tipo, 'presencial'); assert.equal(r.orcamentoIgnorado, true);
  assert.ok(r.conflitos.some((c) => /não entrou na conta/.test(c)));
  assert.equal(avaliar({ ...autonomo, orcamento: 'decisivo' }).orcamentoIgnorado, false);
});
test('dor ou restrição: pesa para o presencial e traz o aviso do médico', () => {
  const r = avaliar({ ...autonomo, dor: 'sim', agenda: 'facil' }); assert.ok(r.avisos.some((a) => /médico/.test(a))); assert.ok(r.proPresencial.some((m) => /dor/.test(m)));
});
test('mesmas respostas, mesmo resultado; respostas incompletas são sinalizadas', () => {
  assert.deepEqual(avaliar(autonomo), avaliar({ ...autonomo }));
  assert.equal(avaliar({ experiencia: 'nunca' }).completo, false);
});
test('mensagem do WhatsApp muda com o resultado e não promete nada', () => {
  assert.match(mensagemResultado('online'), /Deu online/); assert.match(mensagemResultado('hibrido'), /Dá para combinar/);
  for (const t of ['presencial', 'online', 'hibrido', 'ambos'] as const) assert.ok(mensagemResultado(t).startsWith('Oi, Montinho! Vim pelo Guia Fitness Alphaville'));
  assert.equal(PERGUNTAS.length, 9);
});
