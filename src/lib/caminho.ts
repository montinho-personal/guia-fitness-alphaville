// "Academia perto de casa ou do trabalho": distâncias em linha reta entre dois pontos e as fichas.
// Não é rota: não conhece ruas, trânsito nem portarias. O "desvio" é quanto a linha reta casa → academia → trabalho
// passa da linha reta casa → trabalho. Doc: docs/academia-no-caminho.md.

export interface Ponto { lat: number; lng: number }
export interface Lugar extends Ponto { id: string; nome: string; destaque?: boolean }

/** Distância em km, em linha reta (haversine). */
export function distKm(a: Ponto, b: Ponto): number {
  const R = 6371, r = (x: number) => (x * Math.PI) / 180, dLa = r(b.lat - a.lat), dLo = r(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** 0,35 → "350 m"; 1,64 → "1,6 km". Abaixo de 50 m, "ao lado". */
export function distTexto(km: number): string {
  if (km < 0.05) return 'ao lado';
  if (km < 0.975) return `${Math.round((km * 1000) / 50) * 50} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

export const RAIOS = [0.4, 0.8, 1.6, 3, 5] as const;
export const RAIO_PADRAO = 1.6;

export interface Item<T extends Lugar> { lugar: T; dCasa: number; dTrabalho: number | null; desvio: number | null }
export interface Analise<T extends Lugar> {
  trajeto: number | null;
  casa: Item<T>[]; trabalho: Item<T>[]; caminho: Item<T>[];
  /** A mais próxima de cada ponto, mesmo fora do raio: para a mensagem de "nada dentro do raio". */
  maisPertoCasa: Item<T> | null; maisPertoTrabalho: Item<T> | null;
}

const destaquePrimeiro = <T extends Lugar>(xs: Item<T>[]) => xs.slice().sort((a, b) => Number(!!b.lugar.destaque) - Number(!!a.lugar.destaque));

/**
 * Separa as academias em três grupos, sem repetir: perto de casa (até `raio` km), perto do trabalho (idem)
 * e no caminho (desvio de até `raio` km, fora dos dois primeiros grupos). Sem destino, só o primeiro grupo.
 * Ordem: a menor distância primeiro; a academia em destaque sobe para o topo do grupo em que ela entra.
 */
export function analisar<T extends Lugar>(casa: Ponto, trabalho: Ponto | null, lugares: T[], raio: number): Analise<T> {
  const itens: Item<T>[] = lugares.map((l) => {
    const dCasa = distKm(casa, l), dTrabalho = trabalho ? distKm(trabalho, l) : null;
    return { lugar: l, dCasa, dTrabalho, desvio: trabalho ? Math.max(0, dCasa + dTrabalho! - distKm(casa, trabalho)) : null };
  });
  const porCasa = itens.slice().sort((a, b) => a.dCasa - b.dCasa);
  const gCasa = porCasa.filter((x) => x.dCasa <= raio && (x.dTrabalho === null || x.dCasa <= x.dTrabalho));
  const porTrab = trabalho ? itens.slice().sort((a, b) => a.dTrabalho! - b.dTrabalho!) : [];
  const gTrab = porTrab.filter((x) => x.dTrabalho! <= raio && x.dTrabalho! < x.dCasa);
  const usados = new Set([...gCasa, ...gTrab].map((x) => x.lugar.id));
  const gCam = trabalho ? itens.filter((x) => !usados.has(x.lugar.id) && x.desvio! <= raio).sort((a, b) => a.desvio! - b.desvio!) : [];
  return {
    trajeto: trabalho ? distKm(casa, trabalho) : null,
    casa: destaquePrimeiro(gCasa), trabalho: destaquePrimeiro(gTrab), caminho: destaquePrimeiro(gCam),
    maisPertoCasa: porCasa[0] ?? null, maisPertoTrabalho: porTrab[0] ?? null,
  };
}

/** Mensagem do WhatsApp para o Montinho: só os nomes dos pontos escolhidos, nunca coordenadas. */
export function mensagemCaminho(casa: string, trabalho: string): string {
  const onde = casa && trabalho ? `Moro perto de ${casa} e trabalho perto de ${trabalho}.` : casa ? `Fico perto de ${casa}.` : '';
  return `Olá, Montinho! Usei a busca de academia perto de casa ou do trabalho no Guia Fitness Alphaville. ${onde} Quero treinar com personal: como funciona o seu atendimento?`.replace(/\s+/g, ' ');
}
