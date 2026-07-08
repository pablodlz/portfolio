/**
 * Único bundle de runtime do site (REQ-N06): tema, reveal, mailto ofuscado,
 * filtro da galeria e lightbox. Sem dependências. Tudo progressivo — a página
 * funciona sem JS (specs/sections/07).
 */

/* ---------- tema (REQ-F10/F11) ---------- */
function initTheme(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
  sync();
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage indisponível: tema vale só para a sessão */
    }
    sync();
  });
}

/* ---------- reveal on scroll (design-system §motion) ---------- */
function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (els.length === 0) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- e-mail ofuscado (REQ-F07 / security.md) ---------- */
function initMail(): void {
  const rev = (s: string) => [...s].reverse().join('');
  document.querySelectorAll<HTMLAnchorElement>('a.js-mail').forEach((a) => {
    const u = a.dataset.u;
    const d = a.dataset.d;
    if (!u || !d) return;
    const addr = `${rev(u)}@${rev(d)}`;
    a.href = `mailto:${addr}`;
    const label = a.querySelector('.js-mail-addr');
    if (label) label.textContent = addr;
  });
}

/* ---------- filtro da galeria de certificações (REQ-F06) ---------- */
function initCertFilter(): void {
  const bar = document.getElementById('cert-filters');
  const grid = document.getElementById('cert-grid');
  if (!bar || !grid) return;
  bar.hidden = false; // sem JS a barra nem aparece (grid inteiro visível)
  const buttons = bar.querySelectorAll<HTMLButtonElement>('button[data-filter]');
  const items = grid.querySelectorAll<HTMLElement>('[data-issuer]');
  bar.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
    if (!btn) return;
    const filter = btn.dataset.filter!;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    items.forEach((it) => {
      it.hidden = filter !== 'all' && it.dataset.issuer !== filter;
    });
  });
}

/* ---------- lightbox de certificados (REQ-F05) ---------- */
function initLightbox(): void {
  const dialogEl = document.getElementById('cert-lightbox') as HTMLDialogElement | null;
  // escopo: a seção inteira (galeria principal + certificados verificáveis)
  const grid = document.getElementById('certificacoes');
  if (!dialogEl || !grid || typeof dialogEl.showModal !== 'function') return;
  const dialog = dialogEl; // não-nulo daqui em diante (closures abaixo)

  const img = dialog.querySelector<HTMLImageElement>('.lightbox-img')!;
  const title = dialog.querySelector<HTMLElement>('.lightbox-title')!;
  const meta = dialog.querySelector<HTMLElement>('.lightbox-meta')!;
  const prevBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-prev')!;
  const nextBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-next')!;

  let current = -1;
  const triggers = (): HTMLButtonElement[] =>
    [...grid.querySelectorAll<HTMLButtonElement>('button.cert-trigger')].filter(
      (b) => !(b.closest('[data-issuer]') as HTMLElement | null)?.hidden,
    );

  function show(index: number): void {
    const list = triggers();
    if (list.length === 0) return;
    current = (index + list.length) % list.length;
    const t = list[current]!;
    img.src = t.dataset.full!;
    img.alt = t.dataset.title!;
    dialog.classList.toggle('is-lowres', t.dataset.lowres === 'true');
    title.textContent = t.dataset.title!;
    meta.textContent = t.dataset.meta ?? '';
    const many = list.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
    if (!dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
  }

  grid.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button.cert-trigger');
    if (!btn) return;
    show(triggers().indexOf(btn));
  });

  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') show(current - 1);
    if (ev.key === 'ArrowRight') show(current + 1);
  });
  // clique no backdrop fecha
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) dialog.close();
  });
  dialog.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  // libera o scroll da página ao fechar (Esc, botão ou backdrop)
  dialog.addEventListener('close', () => document.body.style.removeProperty('overflow'));
}

initTheme();
initReveal();
initMail();
initCertFilter();
initLightbox();
