/**
 * Único bundle de runtime do site (REQ-N06): tema, reveal, mailto ofuscado,
 * filtro/lightbox da galeria — e a camada de experiência v3: terminal completo
 * (autocomplete, histórico, conquistas), rastro do cursor, glow nos cards,
 * mascote (script próprio no componente) e widgets. Sem dependências.
 * O motor do terminal vive em ./terminal.ts (grande) e é carregado por
 * import() dinâmico só na 1ª interação — fora do caminho crítico (TBT baixo).
 */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = matchMedia('(pointer: coarse)').matches;

/* ---------- tema (REQ-F10/F11) ---------- */
function setTheme(next: string): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage indisponível: tema vale só para a sessão */
  }
  document.getElementById('theme-toggle')?.setAttribute('aria-pressed', String(next === 'light'));
}
function initTheme(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'light'));
  btn.addEventListener('click', () => {
    // marca que o usuário se importa com o tema → o b1t não apronta com o toggle
    document.documentElement.dataset.userTheme = '1';
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  });
  // o mascote pode "apertar" o toggle (raro); reusa o mesmo caminho de tema
  addEventListener('pablodlz:mascot-theme', () =>
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'),
  );
}

/* ---------- reveal on scroll ---------- */
function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (els.length === 0) return;
  if (REDUCED || !('IntersectionObserver' in window)) {
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

/* ---------- filtro da galeria (REQ-F06) ---------- */
function initCertFilter(): void {
  const bar = document.getElementById('cert-filters');
  const grid = document.getElementById('cert-grid');
  if (!bar || !grid) return;
  bar.hidden = false;
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

/* ---------- lightbox (REQ-F05) ---------- */
function initLightbox(): void {
  const dialogEl = document.getElementById('cert-lightbox') as HTMLDialogElement | null;
  const grid = document.getElementById('certificacoes');
  if (!dialogEl || !grid || typeof dialogEl.showModal !== 'function') return;
  const dialog = dialogEl;

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
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) dialog.close();
  });
  dialog.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.style.removeProperty('overflow'));
}

/* ---------- barra de progresso ---------- */
function initScrollProgress(): void {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--scroll-p', String(max > 0 ? Math.min(scrollY / max, 1) : 0));
    ticking = false;
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* ---------- scrollspy ---------- */
function initScrollspy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]')];
  if (links.length === 0 || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map((l) => [l.hash.slice(1), l]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter((s): s is HTMLElement => s !== null);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const link = byId.get((e.target as HTMLElement).id);
        if (!link) continue;
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle('is-active', l === link));
          link.setAttribute('aria-current', 'true');
        } else if (link.classList.contains('is-active')) {
          link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- contadores ---------- */
function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (els.length === 0) return;
  const animate = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || REDUCED) {
      el.textContent = String(target);
      return;
    }
    const dur = 900;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => (el.textContent = el.dataset.count ?? ''));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- partículas do hero ---------- */
function initParticles(): void {
  const canvasEl = document.querySelector<HTMLCanvasElement>('canvas.particles');
  if (!canvasEl || REDUCED) return;
  const context = canvasEl.getContext('2d');
  if (!context) return;
  const canvas = canvasEl;
  const ctx = context;

  interface P { x: number; y: number; r: number; vy: number; vx: number; a: number; accent: boolean }
  let parts: P[] = [];
  let w = 0;
  let h = 0;
  let raf = 0;

  const accentColor = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  function resize(): void {
    const rect = canvas.parentElement!.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(60, Math.round((w * h) / 26000));
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.4,
      vy: -(0.03 + Math.random() * 0.12),
      vx: (Math.random() - 0.5) * 0.05,
      a: 0.08 + Math.random() * 0.35,
      accent: Math.random() < 0.18,
    }));
  }

  function frame(): void {
    ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.dataset.theme === 'light';
    const dot = isLight ? '29, 27, 24' : '242, 240, 237';
    const acc = accentColor();
    for (const p of parts) {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -4) {
        p.y = h + 4;
        p.x = Math.random() * w;
      }
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.accent ? acc : `rgba(${dot}, ${p.a})`;
      ctx.globalAlpha = p.accent ? p.a + 0.15 : 1;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(frame);
  }

  const start = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  addEventListener('resize', resize);
  resize();
  start();
}

/* ---------- rastro do cursor (v3) ---------- */
function initTrail(): void {
  if (REDUCED || COARSE) return;
  const c = document.createElement('canvas');
  c.className = 'cursor-trail';
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  const context = c.getContext('2d');
  if (!context) return;
  const ctx = context;

  let pts: { x: number; y: number; t: number }[] = [];
  let raf = 0;
  const LIFE = 350;

  const resize = (): void => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const accent = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  function draw(): void {
    const now = performance.now();
    pts = pts.filter((p) => now - p.t < LIFE);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const col = accent();
    ctx.lineCap = 'round';
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1]!;
      const p1 = pts[i]!;
      const age = 1 - (now - p1.t) / LIFE;
      ctx.strokeStyle = col;
      ctx.globalAlpha = age * 0.3;
      ctx.lineWidth = 1.5 * age + 0.4;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    raf = pts.length > 1 ? requestAnimationFrame(draw) : 0;
  }

  addEventListener(
    'pointermove',
    (e) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 40) pts.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    },
    { passive: true },
  );
}

/* ---------- glow que segue o mouse nos cards (v3) ---------- */
function initGlowCards(): void {
  if (REDUCED || COARSE) return;
  const els = document.querySelectorAll<HTMLElement>(
    '.card, .job, .pub-card, .cert-verify-card, .pub-cta, .rec-cta, .cert-cta a',
  );
  els.forEach((el) => {
    el.classList.add('glow-target');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    el.addEventListener('pointerenter', () => el.style.setProperty('--glow-o', '1'));
    el.addEventListener('pointerleave', () => el.style.setProperty('--glow-o', '0'));
  });
}

/* ---------- expandir recomendações (v3) ---------- */
function initRecToggle(): void {
  document.querySelectorAll<HTMLButtonElement>('.rec-more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.rec-card');
      if (!card) return;
      const open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Recolher' : 'Ver recomendação';
    });
  });
}

/* ---------- conquistas ---------- */
let achievementEl: HTMLDivElement | null = null;
let achievementTimer: ReturnType<typeof setTimeout> | undefined;
const unlocked = new Set<string>();
function unlockAchievement(name: string, text: string): void {
  if (unlocked.has(name)) return;
  unlocked.add(name);
  if (!achievementEl) {
    achievementEl = document.createElement('div');
    achievementEl.className = 'achievement';
    achievementEl.setAttribute('role', 'status');
    achievementEl.innerHTML =
      '<span class="achievement-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 4H4a1 1 0 0 0-1 1c0 2 1.3 3.4 3.5 4M17 4h3a1 1 0 0 1 1 1c0 2-1.3 3.4-3.5 4"/></svg></span>' +
      '<span><span class="achievement-title"></span><br><span class="achievement-text"></span></span>';
    document.body.appendChild(achievementEl);
  }
  achievementEl.querySelector('.achievement-title')!.textContent = `Conquista — ${name}`;
  achievementEl.querySelector('.achievement-text')!.textContent = text;
  requestAnimationFrame(() => achievementEl!.classList.add('is-in'));
  // conquistas em sequência renovam o prazo — sem corrida entre timers
  clearTimeout(achievementTimer);
  achievementTimer = setTimeout(() => achievementEl?.classList.remove('is-in'), 5200);
  dispatchEvent(new CustomEvent('pablodlz:achievement', { detail: name }));
}


/* ---------- terminal: convite/modo-ativo (load) + engine lazy (1ª interação) ----------
 * Fonte única de verdade: [data-active] no .terminal-wrap. Qualquer interação
 * (foco, tecla, clique, colar) entra em "modo ativo" → o convite (typewriter +
 * cursor) some e o scanner recua, para NUNCA sobrepor o texto do usuário. Volta
 * ao convite só quando o campo fica vazio, sem foco e ocioso por alguns segundos.
 */
function initTerminalInvite(input: HTMLInputElement): void {
  const wrap = document.querySelector<HTMLElement>('.terminal-wrap');
  const ghost = document.querySelector<HTMLElement>('.t-ghost');
  const ghostText = document.querySelector<HTMLElement>('.t-ghost-text');
  if (!wrap || !ghost || !ghostText) return;
  input.placeholder = '';
  ghost.hidden = false;

  const PHRASES = [
    'digite help e pressione Enter',
    'tente ./pablodlz.sh',
    'explore: matrix · coffee · secret',
    'tente nmap · sqlmap · matrix',
    'explore: about · skills · resume',
  ];

  let active = false;
  let twTimer: ReturnType<typeof setTimeout> | undefined;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let phrase = 0;
  let pos = 0;
  let deleting = false;

  const tick = (): void => {
    if (active || REDUCED) return;
    const text = PHRASES[phrase % PHRASES.length]!;
    let delay: number;
    if (!deleting) {
      pos++;
      ghostText.textContent = text.slice(0, pos);
      delay = pos >= text.length ? ((deleting = true), 2400) : 55 + Math.random() * 65;
    } else {
      pos--;
      ghostText.textContent = text.slice(0, pos);
      delay = pos <= 0 ? ((deleting = false), phrase++, 900) : 28;
    }
    twTimer = setTimeout(tick, delay);
  };

  const setActive = (on: boolean): void => {
    if (on === active) return;
    active = on;
    wrap.dataset.active = String(on);
    // o mascote pausa suas dicas enquanto o terminal está em uso
    document.dispatchEvent(new CustomEvent('pablodlz:term-active', { detail: on }));
    if (on) {
      clearTimeout(twTimer);
    } else {
      pos = 0;
      deleting = false;
      if (!REDUCED) twTimer = setTimeout(tick, 700);
    }
  };

  // qualquer sinal de uso → ativo
  const engage = (): void => {
    clearTimeout(idleTimer);
    setActive(true);
  };
  (['focus', 'keydown', 'input', 'paste', 'pointerdown'] as const).forEach((ev) =>
    input.addEventListener(ev, engage),
  );
  // ao sair do campo: se vazio, agenda voltar ao convite; com texto, segue ativo
  input.addEventListener('blur', () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (input.value.length === 0 && document.activeElement !== input) setActive(false);
    }, 3500);
  });

  if (REDUCED) {
    ghostText.textContent = PHRASES[0]!;
    return;
  }
  twTimer = setTimeout(tick, 1600);
}

function armTerminal(): void {
  const input = document.querySelector<HTMLInputElement>('.t-input');
  const body = document.querySelector<HTMLElement>('.terminal-body');
  if (!input || !body) return;
  initTerminalInvite(input); // convite (leve) roda já

  let loading = false;
  const load = async (): Promise<void> => {
    if (loading) return;
    loading = true;
    // chunk separado (script-src 'self' — CSP intacta); só agora é baixado/parseado
    const mod = await import('./terminal');
    mod.initTerminal({ unlock: unlockAchievement });
  };
  input.addEventListener('focus', load, { once: true });
  body.addEventListener('pointerdown', load, { once: true });
}

/* ---------- egg do console (v3) ---------- */
function consoleEgg(): void {
  /* eslint-disable no-console */
  console.log(
    '%c@pablodlz %c— SOC Analyst · Offensive Security · AppSec',
    'font:700 18px "JetBrains Mono",monospace;color:#ff5024',
    'font:12px monospace;color:#8a8378',
  );
  console.log(
    '%cVasculhando o console? Respeito. 🕵️\nNão há segredos aqui — site estático, CSP estrita, zero trackers.\nMas o terminal do hero aceita `secret`… e o código-fonte tem um INCIDENT-0000.',
    'font:12px monospace;color:#8a8378',
  );
}

// crítico p/ conteúdo e interação — roda já
initTheme();
initReveal();
initMail();
initCertFilter();
initLightbox();
initScrollProgress();
initScrollspy();
initCounters();
initRecToggle();
armTerminal();
consoleEgg();

// enfeites puros (partículas, rastro, glow dos cards): fora do caminho
// crítico — reduz o TBT no load sem mudar a experiência.
const whenIdle = (fn: () => void): void => {
  if ('requestIdleCallback' in window)
    (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 1);
};
whenIdle(() => {
  initParticles();
  initTrail();
  initGlowCards();
});
