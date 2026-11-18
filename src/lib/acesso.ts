// Diária, aula ou treino experimental e visita guiada: regras de exibição, CTA do WhatsApp do Montinho
// e comparação diária x mensalidade. Lógica pura, usada pela página, pelas fichas e pelos testes.
// Dados: campo acesso_avulso das fichas (src/data/academias/<id>.yaml). Ver docs/acesso-avulso.md.
import { avaliar, type UnidadeHorario, type Feriado } from './horarios.ts';

export type TipoAcesso = 'diaria' | 'aula-experimental' | 'treino-experimental' | 'visita-guiada';
export interface Oferta {
  tipo: TipoAcesso; nome: string; modalidades: string[]; musculacao: boolean;
  preco: { situacao: 'gratis' | 'valor' | 'a-partir-de' | 'referencia-rede' | 'a-consultar'; valor?: string; centavos?: number };
  regras: string[]; horario_acesso?: string; horario_acesso_confirmado: boolean;
  destino: { tipo: 'compra' | 'reserva' | 'contato' | 'pagina'; url: string; canal?: string };
  situacao: 'confirmada' | 'a-confirmar'; pendencias: string[];
  /** 'montinho': atendimento do Montinho no local; o botão leva ao WhatsApp dele, não ao canal da academia. */
  responsavel?: 'academia' | 'montinho';
}

export const TIPO_NOME: Record<TipoAcesso, string> = {
  diaria: 'Diária', 'aula-experimental': 'Aula experimental', 'treino-experimental': 'Treino experimental', 'visita-guiada': 'Visita guiada',
};

/** Selo "Grátis" só com gratuidade confirmada pela fonte. */
export const eGratis = (o: Oferta) => o.preco.situacao === 'gratis' && o.situacao === 'confirmada';

export function precoTexto(o: Oferta): string {
  switch (o.preco.situacao) {
    case 'gratis': return o.situacao === 'confirmada' ? 'Grátis' : 'Gratuidade a confirmar';
    case 'valor': return o.preco.valor ?? 'Valor a consultar';
    case 'a-partir-de': return `A partir de ${o.preco.valor}`;
    case 'referencia-rede': return `${o.preco.valor} na tabela da rede (valor da unidade a consultar)`;
    default: return 'Valor a consultar';
  }
}

/** Texto do botão que leva ao canal oficial da unidade. */
export function rotuloBotao(o: Oferta): string {
  if (o.responsavel === 'montinho') return 'Agendar com o Montinho no WhatsApp';
  if (o.tipo === 'diaria') return o.destino.tipo === 'compra' ? 'Comprar diária' : 'Consultar diária';
  if (o.tipo === 'visita-guiada') return o.destino.tipo === 'reserva' ? 'Agendar visita com a academia' : 'Consultar visita';
  return o.destino.tipo === 'reserva' ? 'Agendar com a academia' : 'Consultar aula experimental';
}

export type Disponibilidade =
  | { tipo: 'ok'; fecha: number; termina: number }
  | { tipo: 'confirme-acesso'; fecha: number; termina: number }
  | { tipo: 'fechada'; motivo: string }
  | { tipo: 'a-confirmar'; motivo: string };

/**
 * A diária serve para treinar nessa data e hora? Usa o motor do buscador de horários (funcionamento e feriados).
 * Unidade aberta, mas sem horário de entrada da diária confirmado: "Confirme o acesso com a unidade".
 */
export function disponibilidade(u: UnidadeHorario, o: Oferta, data: string, inicio: number, duracao: number, feriados: Feriado[]): Disponibilidade {
  const r = avaliar(u, data, inicio, duracao, feriados);
  if (r.tipo === 'a-confirmar') return { tipo: 'a-confirmar', motivo: r.motivo };
  if (r.tipo === 'incompativel') return { tipo: 'fechada', motivo: r.motivo };
  return o.horario_acesso_confirmado && o.situacao === 'confirmada' ? { tipo: 'ok', fecha: r.fecha, termina: r.termina } : { tipo: 'confirme-acesso', fecha: r.fecha, termina: r.termina };
}

export type StatusPersonal = 'aceita' | 'aceita-com-condicoes' | 'nao-aceita' | 'a-confirmar' | undefined;

export const MENSAGEM_BASE = 'Oi, Montinho! Vim pelo Guia Fitness Alphaville e queria saber como funciona a aula experimental com você.';
/**
 * Mensagem do WhatsApp do Montinho. Sem unidade: o visitante completa o lugar.
 * Unidade que aceita personal externo (confirmado): cita a unidade. Pendente: pergunta se ele atende lá.
 * Restrição confirmada (não aceita): volta para a mensagem geral.
 */
export function mensagemWhatsapp(unidade?: { nome: string; personal: StatusPersonal }, lugarLivre?: string): string {
  if (unidade && (unidade.personal === 'aceita' || unidade.personal === 'aceita-com-condicoes')) return `${MENSAGEM_BASE} Quero treinar na ${unidade.nome}. Quais horários você tem?`;
  if (unidade && unidade.personal !== 'nao-aceita') return `${MENSAGEM_BASE} Tenho interesse em treinar na ${unidade.nome}. Você consegue me atender lá? Quais horários você tem?`;
  return `${MENSAGEM_BASE} Quero treinar em ${lugarLivre || '[academia, condomínio ou bairro]'}. Quais horários você tem?`;
}
export const linkWhatsappMontinho = (numero: string, mensagem: string) => `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

/**
 * Diárias x mensalidade para o mesmo mês e a mesma quantidade de idas.
 * A taxa inicial (matrícula) fica separada: pesa só no primeiro mês.
 */
export function compararDiaria(diariaCentavos: number, idasNoMes: number, mensalCentavos: number, taxaInicialCentavos = 0) {
  const diarias = diariaCentavos * idasNoMes;
  const primeiroMes = mensalCentavos + taxaInicialCentavos;
  const empate = Math.ceil(mensalCentavos / diariaCentavos);
  return { diarias, mensal: mensalCentavos, primeiroMes, diferenca: diarias - mensalCentavos, compensaDiaria: diarias < mensalCentavos, idasParaEmpatar: empate };
}

/** Destino do botão: canal oficial da academia ou, no atendimento do Montinho, o WhatsApp dele com a unidade na mensagem. */
export function destinoOferta(o: Oferta, unidade: string, numeroMontinho: string): { href: string; evento: string } {
  if (o.responsavel === 'montinho') return { href: linkWhatsappMontinho(numeroMontinho, mensagemWhatsapp({ nome: unidade, personal: 'aceita' })), evento: 'clique_whatsapp' };
  return { href: o.destino.url, evento: 'clique_acesso_academia' };
}
