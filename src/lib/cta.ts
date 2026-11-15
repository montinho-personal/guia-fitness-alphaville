// CTA contextual: a chamada da barra de WhatsApp e a mensagem pré-preenchida
// mudam conforme o assunto da página (tema, cidade ou academia).
import { CIDADES_PT, TEMAS_PT } from './artigos';
import { WHATSAPP } from './dados';

export interface Cta { titulo: string; sub: string; botao: string; assunto: string }

const PADRAO: Cta = { titulo: 'Quer conversar com o Montinho?', sub: 'Personal que mantém este guia · resposta pelo WhatsApp', botao: 'Falar no WhatsApp', assunto: 'o atendimento presencial' };

const TEMA: Record<string, (em: string) => Omit<Cta, 'botao'>> = {
  feminino: (em) => ({ titulo: `Quer um treino pensado para você ${em}?`, sub: 'Converse com o Montinho sobre objetivo, rotina e onde treinar', assunto: `treino para mulheres ${em}` }),
  'em-condominio': (em) => ({ titulo: `Quer treinar com personal no seu condomínio ${em}?`, sub: 'O Montinho adapta o treino ao espaço fitness do prédio', assunto: `personal no condomínio ${em}` }),
  'a-domicilio': (em) => ({ titulo: `Quer treinar em casa com acompanhamento ${em}?`, sub: 'O Montinho vai até você e adapta o treino ao espaço', assunto: `personal a domicílio ${em}` }),
  'para-idosos': (em) => ({ titulo: `Quer voltar a treinar com segurança ${em}?`, sub: 'Com liberação médica, o Montinho acompanha de perto', assunto: `treino para pessoa idosa ${em}` }),
  'para-iniciantes': (em) => ({ titulo: `Vai começar a treinar ${em}?`, sub: 'Os primeiros meses com acompanhamento fazem diferença', assunto: `começar a treinar ${em}` }),
  'para-emagrecer': (em) => ({ titulo: `Quer emagrecer com acompanhamento ${em}?`, sub: 'Converse com o Montinho sobre plano, rotina e constância', assunto: `emagrecer com acompanhamento ${em}` }),
  'para-gestantes': (em) => ({ titulo: `Grávida e querendo treinar ${em}?`, sub: 'Sempre com a liberação do seu obstetra. Converse com o Montinho', assunto: `treino na gestação ${em}` }),
  'para-executivos': (em) => ({ titulo: `Pouco tempo para treinar ${em}?`, sub: 'Sessões em horário fixo, perto de casa ou do trabalho', assunto: `treino com agenda corrida ${em}` }),
};

/** Monta o CTA a partir do caminho da página. `academias` mapeia id → nome. */
export function ctaDaPagina(caminho: string, academias: Record<string, string>): Cta {
  const p = caminho.replace(/^\/|\/$/g, '');
  const botao = 'Falar com o Montinho no WhatsApp';
  // /guias/personal-trainer-<tema>-<cidade>/
  for (const t of Object.keys(TEMAS_PT)) for (const c of Object.keys(CIDADES_PT)) {
    if (p === `guias/personal-trainer-${t}-${c}`) return { ...TEMA[t](CIDADES_PT[c].em), botao };
  }
  // /guias/personal-trainer-<cidade>/
  for (const [c, v] of Object.entries(CIDADES_PT)) {
    if (p === `guias/personal-trainer-${c}`) return { titulo: `Procurando personal trainer ${v.em}?`, sub: 'Em casa, no condomínio ou na academia: converse com o Montinho', botao, assunto: `personal trainer ${v.em}` };
  }
  // /guias/personal-trainer-<academia>/ e /academias/<academia>/
  const mAcad = p.match(/^(?:guias\/personal-trainer-|academias\/)([a-z0-9-]+)$/);
  if (mAcad && academias[mAcad[1]]) {
    const id = mAcad[1], nome = academias[id];
    if (id === 'arena-18-alphaville') return { titulo: 'Quer treinar com o Montinho na Arena 18?', sub: 'Ele atende alunos presencialmente lá', botao, assunto: 'treinar na Arena 18' };
    return { titulo: `Vai treinar na ${nome}?`, sub: 'Pergunte ao Montinho se dá para te acompanhar lá ou em outro lugar', botao, assunto: `treinar com acompanhamento na ${nome}` };
  }
  const fixos: Record<string, Cta> = {
    'guias/academia-ou-personal': { titulo: 'Ainda em dúvida se vale contratar personal?', sub: 'Uma conversa rápida com o Montinho ajuda a decidir', botao, assunto: 'se vale contratar personal' },
    'guias/como-escolher-academia': { titulo: 'Escolheu a academia? Falta o plano de treino.', sub: 'Converse com o Montinho sobre como começar', botao, assunto: 'montar um plano de treino' },
    'academias/precos': { titulo: 'Já viu quanto custa a academia?', sub: 'Pergunte ao Montinho como fica a conta com acompanhamento', botao, assunto: 'o custo de treinar com acompanhamento' },
    'academias/24-horas': { titulo: 'Treina fora do horário comercial?', sub: 'O Montinho combina sessões no horário que cabe na sua rotina', botao, assunto: 'treinar em horários alternativos' },
    'academias/domingo': { titulo: 'Só sobra o fim de semana para treinar?', sub: 'Converse com o Montinho sobre horários', botao, assunto: 'treinar no fim de semana' },
    'academias/wellhub-totalpass': { titulo: 'Usa Wellhub ou TotalPass?', sub: 'Pergunte ao Montinho como encaixar o acompanhamento', botao, assunto: 'treinar com acompanhamento usando agregador' },
    'modalidades/musculacao': { titulo: 'Quer evoluir na musculação?', sub: 'Técnica, carga e progressão com acompanhamento', botao, assunto: 'treino de musculação' },
    'modalidades/crossfit': { titulo: 'Quer força para render mais no box?', sub: 'Converse com o Montinho sobre treino complementar', botao, assunto: 'treino complementar ao CrossFit' },
  };
  if (fixos[p]) return fixos[p];
  if (p === 'modalidades/hyrox' || /^guias\/(estacoes-do-hyrox|hyrox-ou-crossfit|categorias-do-hyrox|como-treinar-para-o-primeiro-hyrox)$/.test(p)) return { titulo: 'Vai encarar o Hyrox?', sub: 'O Montinho prepara você para a prova: corrida, força e estações', botao, assunto: 'preparação para o Hyrox' };
  const mHy = p.match(/^guias\/hyrox-([a-z-]+)$/);
  if (mHy && CIDADES_PT[mHy[1]]) return { titulo: `Treinando para o Hyrox ${CIDADES_PT[mHy[1]].em}?`, sub: 'Converse com o Montinho sobre preparação para a prova', botao, assunto: `preparação para o Hyrox ${CIDADES_PT[mHy[1]].em}` };
  const mReg = p.match(/^regioes\/([a-z-]+)$/);
  if (mReg) { const em = { alphaville: 'em Alphaville', barueri: 'em Barueri', 'santana-de-parnaiba': 'em Santana de Parnaíba' }[mReg[1]]; if (em) return { titulo: `Procurando onde treinar ${em}?`, sub: 'E quem te acompanhe: converse com o Montinho', botao, assunto: `treinar ${em}` }; }
  return { ...PADRAO, botao };
}

export function linkWhatsappCta(cta: Cta, ref: string): string {
  const texto = `Olá, Montinho! Vim pelo Onde Treinar Alphaville e quero conversar sobre ${cta.assunto}. (ref: ${ref})`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}
