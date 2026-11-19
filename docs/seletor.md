# Seletor do guia (listas de escolha)

Pedido do Renato em 19/11/2026: a lista nativa do Android e do iPhone não combina com o site. Desde então, toda lista de escolha (`<select>`) do site abre numa folha com o visual do guia.

## Como funciona

- `src/scripts/seletor.ts`, carregado em todas as páginas por `src/layouts/Base.astro`. Estilos no fim de `src/styles/global.css` (classes `sel-*`).
- Para cada `<select>`, o script cria um botão com o valor escolhido e esconde o `<select>`, que **continua na página** e segue sendo a fonte do valor. Formulários e scripts das ferramentas não mudam.
- O botão abre uma folha (`<dialog>`): sobe de baixo no celular e fica centralizada no computador. Tem o rótulo do campo como título, os grupos (`<optgroup>`) como subtítulos e busca quando há 12 opções ou mais.
- Ao escolher, o script grava o valor no `<select>` e dispara `input` e `change`, como a lista nativa faria.
- Quando um script troca o valor por código (`sel.value = ...`), esconde ou cria opções, o botão acompanha.
- Teclado: setas abrem e percorrem, Enter escolhe, Esc fecha e o foco volta ao botão.
- Sem JavaScript, ou em navegador sem `<dialog>`, fica a lista nativa.

## Página nova com lista

Basta usar `<select>` com rótulo (`<label class="campo"><span class="rotulo">…</span><select>…`, ou `<label for>`). Não precisa de nada a mais.

Para manter a lista nativa em algum lugar, ponha `data-seletor-nativo` no elemento em volta. Listas com `multiple` ou `size` ficam nativas.

## Ao testar com Playwright

O `<select>` fica escondido, então `page.selectOption` não serve. Abra pelo botão (`select._selBtn.click()`) e clique na opção (`.sel-op`), ou troque o valor por código e dispare `change`.
