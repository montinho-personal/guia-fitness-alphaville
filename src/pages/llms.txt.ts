import type { APIRoute } from 'astro';
import { academias, guias, REGIOES } from '../lib/dados';
// Gerado no build a partir do conteúdo real, para nunca divergir do site.
// Não há evidência de que mecanismos de IA usem este arquivo; o custo de mantê-lo é zero.
export const GET: APIRoute = async ({ site }) => {
  const as = await academias(); const gs = await guias(); const u = (p: string) => new URL(p, site).href;
  const txt = `# Guia Fitness Alphaville

> Guia local de academias, boxes e estúdios em Alphaville, Tamboré, Barueri e Santana de Parnaíba (SP). Cada dado local traz a fonte e a data de conferência. Mantido por Montinho Personal Trainer.

## Guia
- [Academias, com filtros](${u('/academias/')}): ${as.length} fichas
- [Quanto custa academia em Alphaville e Barueri](${u('/academias/precos/')})
- [Smart Fit ou Gaviões em Alphaville](${u('/guias/smart-fit-ou-gavioes/')})
- [Ironberg ou NitroGym em Alphaville](${u('/guias/ironberg-ou-nitrogym/')})
- [Smart Fit ou SkyFit em Alphaville](${u('/guias/smart-fit-ou-skyfit/')})
- [Gaviões 24h ou Ironberg](${u('/guias/gavioes-ou-ironberg/')})
- [Academia perto de você](${u('/academias/perto-de/')})
- [Smart Fit em Barueri](${u('/academias/smart-fit-barueri/')})
- [Pilates em Alphaville](${u('/modalidades/pilates/')})
- [Natação em Alphaville e Barueri](${u('/modalidades/natacao/')})
- [Lutas em Alphaville e região](${u('/modalidades/lutas/')})
- [Academias premium em Alphaville](${u('/guias/academias-premium-alphaville/')})
- [Beach tennis e futevôlei em Alphaville](${u('/guias/beach-tennis-futevolei-alphaville/')})
- [Academias 24 horas e de horário estendido](${u('/academias/24-horas/')})
- [Academias abertas no domingo](${u('/academias/domingo/')})
- [Academias com Wellhub e TotalPass](${u('/academias/wellhub-totalpass/')})
${Object.entries(REGIOES).map(([id, r]) => `- [Onde treinar em ${r.titulo}](${u(`/regioes/${id}/`)})`).join('\n')}
- [Academias no Tamboré](${u('/regioes/tambore/')})

## Guias de decisão
${gs.map((g) => `- [${g.data.h1}](${u(`/${g.data.secao}/${g.id}/`)}): ${g.data.descricao}`).join('\n')}

## Fichas
${as.map((a) => `- [${a.data.nome}](${u(`/academias/${a.id}/`)}): ${a.data.resumo}`).join('\n')}

## Transparência
- [Sobre e quem mantém](${u('/sobre/')})
- [Serviços do Montinho, que mantém o guia](${u('/montinho/')})
- [Metodologia](${u('/metodologia/')})
- [Política editorial](${u('/politica-editorial/')})
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
