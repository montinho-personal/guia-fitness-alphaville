// Vitrine de transformações: lê o feed público do site do Montinho no build.
// Regra: nada copiado à mão e nenhum dado de reserva. Se o feed falhar, vier vazio
// ou fora do formato, carregarVitrine() devolve null e a seção não é renderizada.
// A atualização de hora em hora vem do rebuild agendado (ver docs/estado-atual.md).

export const URL_VITRINE = import.meta.env.VITRINE_URL || 'https://www.montinhopersonal.com.br/api/vitrine';

export interface Transformacao {
  slug: string; nome: string; idade: string; acompanhamento: string | null;
  resultado: string; modalidade: string; historia: string; depoimento: string;
  fotos: { antes: string; depois: string; montagem?: string; largura: number; altura: number };
}
export interface Vitrine {
  aviso: string;
  nao_se_compare: { titulo: string; texto: string };
  links: { cta: string; todas: string };
  transformacoes: Transformacao[];
}

const txt = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const url = (v: unknown): v is string => txt(v) && /^https:\/\//.test(v);
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

function valida(t: any): t is Transformacao {
  return t && txt(t.slug) && txt(t.nome) && txt(t.idade) && (t.acompanhamento === null || txt(t.acompanhamento))
    && txt(t.resultado) && txt(t.modalidade) && txt(t.historia) && txt(t.depoimento)
    && t.fotos && url(t.fotos.antes) && url(t.fotos.depois) && num(t.fotos.largura) && num(t.fotos.altura);
}

let cache: Promise<Vitrine | null> | undefined;

/** Uma requisição por build, compartilhada por todas as páginas. */
export function carregarVitrine(): Promise<Vitrine | null> {
  cache ??= (async () => {
    try {
      const r = await fetch(URL_VITRINE, { signal: AbortSignal.timeout(10000), headers: { accept: 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d: any = await r.json();
      const transformacoes = Array.isArray(d?.transformacoes) ? d.transformacoes.filter(valida) : [];
      if (!transformacoes.length || !txt(d?.aviso) || !txt(d?.nao_se_compare?.titulo) || !txt(d?.nao_se_compare?.texto) || !url(d?.links?.cta) || !url(d?.links?.todas)) {
        console.warn(`[vitrine] feed sem dados válidos em ${URL_VITRINE}; a seção não será exibida.`);
        return null;
      }
      return { aviso: d.aviso, nao_se_compare: { titulo: d.nao_se_compare.titulo, texto: d.nao_se_compare.texto }, links: { cta: d.links.cta, todas: d.links.todas }, transformacoes };
    } catch (e) {
      console.warn(`[vitrine] falha ao ler ${URL_VITRINE}: ${(e as Error).message}; a seção não será exibida.`);
      return null;
    }
  })();
  return cache;
}
