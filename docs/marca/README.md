# Identidade visual: Guia Fitness Alphaville

Reconstruída em 17/11/2026 a partir da prancha enviada pelo Renato (`Identidade_Visual_Guia_Fitness_Alphaville.png`). A prancha não é usada como arquivo: cada peça foi refeita em vetor.

| Arquivo (`public/`) | Uso |
|---|---|
| `logo.svg` | Logo horizontal, fundo claro (cabeçalho) |
| `logo-dark.svg` | Logo horizontal, fundo escuro |
| `logo-footer.svg` | Logo empilhado, fundo claro (rodapé) |
| `logo-footer-dark.svg` | Logo empilhado, fundo escuro |
| `favicon.svg` / `favicon.ico` (16, 32, 48) | Símbolo: pino de localização com halter |
| `icon.png` (512) | Ícone de app (quadro escuro, cantos transparentes); logo do schema Organization |
| `apple-touch-icon.png` (180) | Ícone do iPhone (quadro escuro, sem transparência) |
| `og-image.png` (1200×630) | Compartilhamento; `og.png` é a mesma imagem, mantida para links antigos |
| `site.webmanifest` | Manifest com os ícones |

**Cores:** laranja `#FF6A00` e `#FF9F00` (degradê), azul-noite `#111827`, cinza-claro `#E5E7EB`.
**Letras:** Inter Display Black Italic ("Guia Fitness") e ExtraBold Italic ("ALPHAVILLE"), convertidas em contorno (o SVG não depende de fonte instalada).
**Gerar de novo:** `python3 scripts/marca-gera.py <pasta>` (precisa de fonttools e das fontes Inter); os PNG e o ICO saem dos SVG renderizados no navegador.
