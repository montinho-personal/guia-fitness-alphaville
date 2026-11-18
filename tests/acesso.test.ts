// Diária, aula experimental, CTA do Montinho e comparação diária x mensalidade. Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eGratis, precoTexto, rotuloBotao, disponibilidade, mensagemWhatsapp, linkWhatsappMontinho, compararDiaria, MENSAGEM_BASE, type Oferta } from '../src/lib/acesso.ts';
import { min, type UnidadeHorario } from '../src/lib/horarios.ts';

const base: Oferta = { tipo: 'diaria', nome: 'Diária', modalidades: ['musculacao'], musculacao: true, preco: { situacao: 'valor', valor: 'R$ 90', centavos: 9000 }, regras: [], horario_acesso_confirmado: false, destino: { tipo: 'compra', url: 'https://exemplo.com/comprar' }, situacao: 'confirmada', pendencias: [] };
const vazio = { seg: [], ter: [], qua: [], qui: [], sex: [], sab: [], dom: [] };
const un: UnidadeHorario = { horario: { ...vazio, dom: ['08:00-14:00'], seg: ['06:00-22:00'] }, municipio: 'Barueri' };
const DOM = '2026-11-22';

test('diária com preço confirmado e compra oficial: "Comprar diária"', () => {
  assert.equal(precoTexto(base), 'R$ 90');
  assert.equal(rotuloBotao(base), 'Comprar diária');
  assert.equal(rotuloBotao({ ...base, destino: { tipo: 'contato', url: 'https://wa.me/1' } }), 'Consultar diária');
});

test('diária na unidade aberta, sem horário de entrada confirmado: confirme o acesso', () => {
  assert.equal(disponibilidade(un, base, DOM, min('10:00'), 60, []).tipo, 'confirme-acesso');
  assert.equal(disponibilidade(un, { ...base, horario_acesso_confirmado: true }, DOM, min('10:00'), 60, []).tipo, 'ok');
  assert.equal(disponibilidade(un, base, DOM, min('13:30'), 60, []).tipo, 'fechada');
  assert.equal(disponibilidade({ ...un, horario: { ...un.horario, sab: [] } }, base, '2026-11-21', min('10:00'), 60, []).tipo, 'a-confirmar');
});

test('aula experimental grátis confirmada x preço a consultar', () => {
  const gratis: Oferta = { ...base, tipo: 'aula-experimental', musculacao: false, modalidades: ['crossfit'], preco: { situacao: 'gratis' }, destino: { tipo: 'reserva', url: 'https://x' } };
  assert.equal(eGratis(gratis), true);
  assert.equal(precoTexto(gratis), 'Grátis');
  assert.equal(rotuloBotao(gratis), 'Agendar com a academia');
  const pendente = { ...gratis, situacao: 'a-confirmar' as const };
  assert.equal(eGratis(pendente), false);
  const consultar: Oferta = { ...gratis, preco: { situacao: 'a-consultar' }, destino: { tipo: 'pagina', url: 'https://x' } };
  assert.equal(precoTexto(consultar), 'Valor a consultar');
  assert.equal(rotuloBotao(consultar), 'Consultar aula experimental');
});

test('preço da rede aparece como referência, com o da unidade a consultar', () => {
  assert.match(precoTexto({ ...base, preco: { situacao: 'referencia-rede', valor: 'R$ 75' } }), /tabela da rede.*a consultar/);
});

test('WhatsApp do Montinho: sem unidade, unidade que aceita, pendente e com restrição', () => {
  assert.equal(mensagemWhatsapp(), `${MENSAGEM_BASE} Quero treinar em [academia, condomínio ou bairro]. Quais horários você tem?`);
  assert.match(mensagemWhatsapp({ nome: 'Arena 18', personal: 'aceita-com-condicoes' }), /Quero treinar na Arena 18\. Quais horários/);
  assert.match(mensagemWhatsapp({ nome: 'Gaviões 24h', personal: 'a-confirmar' }), /Tenho interesse em treinar na Gaviões 24h\. Você consegue me atender lá\?/);
  assert.match(mensagemWhatsapp({ nome: 'X', personal: undefined }), /Você consegue me atender lá\?/);
  assert.match(mensagemWhatsapp({ nome: 'Fechada', personal: 'nao-aceita' }), /\[academia, condomínio ou bairro\]/);
  const u = linkWhatsappMontinho('5511981063409', mensagemWhatsapp());
  assert.ok(u.startsWith('https://wa.me/5511981063409?text=Oi%2C%20Montinho!'));
  assert.equal(decodeURIComponent(u.split('text=')[1]), mensagemWhatsapp());
});

test('diárias x mensalidade no mesmo mês, matrícula separada', () => {
  const r = compararDiaria(9000, 4, 58900, 12000);
  assert.equal(r.diarias, 36000); assert.equal(r.compensaDiaria, true); assert.equal(r.primeiroMes, 70900);
  assert.equal(compararDiaria(9000, 8, 58900).compensaDiaria, false);
  assert.equal(compararDiaria(9000, 1, 58900).idasParaEmpatar, 7);
});
