// Seletor do guia: troca a lista nativa do navegador (a do Android e do iPhone não segue o visual do site)
// por um botão e uma folha com as opções. O <select> original continua na página, escondido, e segue sendo
// a fonte do valor: formulários e scripts das ferramentas não mudam. Sem JavaScript, fica o <select> nativo.
// Doc: docs/seletor.md.

const DESC = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!;
const IDX = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex')!;
const BUSCA_A_PARTIR = 12;
let n = 0;
let folha: HTMLDialogElement | null = null;
let aberto: { sel: HTMLSelectElement; btn: HTMLButtonElement } | null = null;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const visivel = (o: HTMLOptionElement) => !o.hidden && !o.disabled && !(o.parentElement instanceof HTMLOptGroupElement && o.parentElement.disabled);

function rotuloDe(sel: HTMLSelectElement): string {
  const l = sel.closest('label') ?? sel.labels?.[0]; // dentro de <label>, o rótulo passa a apontar para o botão
  if (l) { const r = l.querySelector('.rotulo') ?? [...l.children].find((c) => c.tagName === 'SPAN' && !c.classList.contains('sel-valor')); const t = (r ?? l).textContent ?? ''; if (r || l.htmlFor) return t.trim(); }
  const irmao = sel.closest('.campo')?.querySelector('.rotulo');
  return (irmao?.textContent ?? sel.getAttribute('aria-label') ?? 'Escolha uma opção').trim();
}

function criaFolha(): HTMLDialogElement {
  const d = document.createElement('dialog');
  d.className = 'sel-folha';
  d.innerHTML = '<div class="sel-caixa"><div class="sel-topo"><h2 class="sel-titulo" id="sel-titulo"></h2><button type="button" class="sel-fechar" aria-label="Fechar">×</button></div>'
    + '<div class="sel-busca" hidden><input type="search" placeholder="Buscar na lista" aria-label="Buscar na lista" autocomplete="off"></div>'
    + '<div class="sel-lista" role="listbox" aria-labelledby="sel-titulo" tabindex="-1"></div><p class="sel-vazio" hidden>Nada encontrado.</p></div>';
  document.body.appendChild(d);
  const lista = d.querySelector<HTMLElement>('.sel-lista')!, busca = d.querySelector<HTMLInputElement>('.sel-busca input')!;
  const ops = () => [...lista.querySelectorAll<HTMLButtonElement>('.sel-op:not([hidden])')];
  d.querySelector('.sel-fechar')!.addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // toque fora da caixa
  d.addEventListener('close', () => { const a = aberto; aberto = null; if (a) { a.btn.setAttribute('aria-expanded', 'false'); a.btn.focus(); } });
  lista.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.sel-op'); if (!b || !aberto) return;
    const { sel } = aberto, antes = DESC.get!.call(sel);
    DESC.set!.call(sel, b.dataset.v!);
    d.close(); atualiza(sel);
    if (antes !== b.dataset.v) { sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  d.addEventListener('keydown', (e) => {
    const xs = ops(), i = xs.indexOf(document.activeElement as HTMLButtonElement);
    const vai = (k: number) => { e.preventDefault(); xs[Math.max(0, Math.min(xs.length - 1, k))]?.focus(); };
    if (e.key === 'ArrowDown') vai(i + 1);
    else if (e.key === 'ArrowUp') { if (i <= 0 && !busca.parentElement!.hidden) { e.preventDefault(); busca.focus(); } else vai(i - 1); }
    else if (e.key === 'Home' && document.activeElement !== busca) vai(0);
    else if (e.key === 'End' && document.activeElement !== busca) vai(xs.length - 1);
    else if (e.key === 'Enter' && document.activeElement === busca) { e.preventDefault(); xs[0]?.click(); }
  });
  busca.addEventListener('input', () => {
    const q = semAcento(busca.value.trim());
    lista.querySelectorAll<HTMLButtonElement>('.sel-op').forEach((b) => { b.hidden = !!q && !semAcento(b.textContent ?? '').includes(q); });
    lista.querySelectorAll<HTMLElement>('.sel-grupo').forEach((g) => { g.hidden = !g.querySelector('.sel-op:not([hidden])'); });
    d.querySelector<HTMLElement>('.sel-vazio')!.hidden = ops().length > 0;
  });
  return d;
}

function abre(sel: HTMLSelectElement, btn: HTMLButtonElement) {
  folha ??= criaFolha();
  const d = folha, lista = d.querySelector<HTMLElement>('.sel-lista')!, busca = d.querySelector<HTMLInputElement>('.sel-busca input')!;
  const atual = DESC.get!.call(sel) as string;
  const item = (o: HTMLOptionElement) => `<button type="button" class="sel-op" role="option" data-v="${esc(o.value)}" aria-selected="${o.value === atual && o.selected}"><span>${esc(o.label || o.text)}</span><i aria-hidden="true"></i></button>`;
  let html = '', total = 0;
  for (const filho of [...sel.children]) {
    if (filho instanceof HTMLOptGroupElement) {
      const xs = [...filho.querySelectorAll('option')].filter(visivel); if (!xs.length) continue;
      total += xs.length;
      html += `<div class="sel-grupo" role="group" aria-label="${esc(filho.label)}"><p class="sel-grupo-t">${esc(filho.label)}</p>${xs.map(item).join('')}</div>`;
    } else if (filho instanceof HTMLOptionElement && visivel(filho)) { total++; html += item(filho); }
  }
  lista.innerHTML = html;
  d.querySelector('.sel-titulo')!.textContent = rotuloDe(sel);
  busca.value = ''; busca.parentElement!.hidden = total < BUSCA_A_PARTIR; d.querySelector<HTMLElement>('.sel-vazio')!.hidden = true;
  aberto = { sel, btn }; btn.setAttribute('aria-expanded', 'true');
  d.showModal();
  const marcado = lista.querySelector<HTMLButtonElement>('.sel-op[aria-selected="true"]') ?? lista.querySelector<HTMLButtonElement>('.sel-op');
  marcado?.focus({ preventScroll: true }); marcado?.scrollIntoView({ block: 'center' });
}

/** Põe no botão o texto da opção escolhida e copia o estado desligado. */
function atualiza(sel: HTMLSelectElement) {
  const btn = (sel as any)._selBtn as HTMLButtonElement | undefined; if (!btn) return;
  const o = sel.selectedOptions[0];
  const valor = o ? o.label || o.text : '';
  btn.querySelector('.sel-valor')!.textContent = valor;
  // Nome acessível com o rótulo e o valor escolhido, como o <select> nativo anunciava.
  btn.setAttribute('aria-label', valor ? `${btn.dataset.rot}: ${valor}` : btn.dataset.rot ?? '');
  btn.classList.toggle('sel-vago', !o || o.value === '');
  btn.disabled = sel.disabled;
}

function melhora(sel: HTMLSelectElement) {
  if ((sel as any)._selBtn || sel.multiple || sel.size > 1 || sel.closest('[data-seletor-nativo]')) return;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'sel-btn'; btn.id = `sel-btn-${++n}`;
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span class="sel-valor"></span>';
  const rot = rotuloDe(sel);
  // Dentro de <label>, o botão vira o controle do rótulo (vem antes do select). Com <label for>, damos o nome à mão.
  btn.dataset.rot = rot; btn.setAttribute('aria-label', rot);
  (sel as any)._selBtn = btn;
  sel.before(btn); sel.classList.add('sel-nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
  btn.addEventListener('click', () => abre(sel, btn));
  btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abre(sel, btn); } });
  sel.labels?.forEach((l) => { if (l.htmlFor) l.addEventListener('click', (e) => { e.preventDefault(); btn.focus(); }); });
  // Os scripts das ferramentas trocam o valor por código (sel.value = ...), o que não dispara evento: o botão acompanha.
  Object.defineProperty(sel, 'value', { configurable: true, get() { return DESC.get!.call(sel); }, set(v) { DESC.set!.call(sel, v); atualiza(sel); } });
  Object.defineProperty(sel, 'selectedIndex', { configurable: true, get() { return IDX.get!.call(sel); }, set(v) { IDX.set!.call(sel, v); atualiza(sel); } });
  sel.addEventListener('change', () => atualiza(sel));
  sel.form?.addEventListener('reset', () => setTimeout(() => atualiza(sel)));
  new MutationObserver(() => atualiza(sel)).observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'selected', 'label'] });
  atualiza(sel);
}

function tudo(raiz: ParentNode = document) { raiz.querySelectorAll<HTMLSelectElement>('select').forEach(melhora); }

if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function') {
  tudo();
  // Listas criadas depois, pelos scripts das ferramentas.
  new MutationObserver((ms) => { for (const m of ms) m.addedNodes.forEach((x) => { if (x instanceof HTMLSelectElement) melhora(x); else if (x instanceof HTMLElement && x.querySelector('select')) tudo(x); }); }).observe(document.body, { childList: true, subtree: true });
  document.documentElement.classList.add('sel-pronto');
}
