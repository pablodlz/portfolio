/**
 * Único bundle de runtime do site (REQ-N06): tema, reveal, mailto ofuscado,
 * filtro da galeria, lightbox — e a camada de gamificação do redesign v2:
 * terminal interativo, conquistas, scrollspy, contadores e partículas.
 * Sem dependências. Tudo progressivo — a página funciona sem JS.
 */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- tema (REQ-F10/F11) ---------- */
function initTheme(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
  sync();
  btn.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    sync();
  });
}
function setTheme(next: string): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage indisponível: tema vale só para a sessão */
  }
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

/* ---------- filtro da galeria de certificações (REQ-F06) ---------- */
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

/* ---------- lightbox de certificados (REQ-F05) ---------- */
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

/* ---------- barra de progresso de leitura ---------- */
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

/* ---------- scrollspy: seção ativa na nav ---------- */
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

/* ---------- contadores animados ---------- */
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
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
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

/* ---------- partículas do hero (Cobalt) ---------- */
function initParticles(): void {
  const canvasEl = document.querySelector<HTMLCanvasElement>('canvas.particles');
  if (!canvasEl || REDUCED) return;
  const context = canvasEl.getContext('2d');
  if (!context) return;
  const canvas = canvasEl; // não-nulos daqui em diante (closures abaixo)
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
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    ctx!.clearRect(0, 0, w, h);
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
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx!.fillStyle = p.accent ? acc : `rgba(${dot}, ${p.a})`;
      ctx!.globalAlpha = p.accent ? p.a + 0.15 : 1;
      ctx!.fill();
      ctx!.globalAlpha = 1;
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
  addEventListener('resize', () => {
    resize();
  });
  resize();
  start();
}

/* ---------- conquistas (gamificação) ---------- */
let achievementEl: HTMLDivElement | null = null;
function unlockAchievement(name: string, text: string): void {
  if (!achievementEl) {
    achievementEl = document.createElement('div');
    achievementEl.className = 'achievement';
    achievementEl.setAttribute('role', 'status');
    achievementEl.innerHTML =
      '<span class="achievement-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 4H4a1 1 0 0 0-1 1c0 2 1.3 3.4 3.5 4M17 4h3a1 1 0 0 1 1 1c0 2-1.3 3.4-3.5 4"/></svg></span>' +
      '<span><span class="achievement-title"></span><br><span class="achievement-text"></span></span>';
    document.body.appendChild(achievementEl);
  }
  achievementEl.querySelector('.achievement-title')!.textContent = `Conquista desbloqueada — ${name}`;
  achievementEl.querySelector('.achievement-text')!.textContent = text;
  requestAnimationFrame(() => achievementEl!.classList.add('is-in'));
  setTimeout(() => achievementEl?.classList.remove('is-in'), 5200);
}

/* ---------- terminal interativo do hero ---------- */
function initTerminal(): void {
  const form = document.querySelector<HTMLFormElement>('.t-form');
  const input = document.querySelector<HTMLInputElement>('.t-input');
  const out = document.querySelector<HTMLElement>('.t-out');
  const body = document.querySelector<HTMLElement>('.terminal-body');
  if (!form || !input || !out || !body) return;

  // clicar em qualquer área do terminal foca o input (como um terminal real)
  body.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('a, button')) input.focus();
  });

  const print = (text: string, cls = ''): void => {
    const line = document.createElement('span');
    line.className = `t-line is-live${cls ? ` ${cls}` : ''}`;
    line.textContent = text;
    out.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  const FLAG_B64 = 'RkxBR3twYWJsby5nYWxlcmFuaUBnbWFpbC5jb219';
  let shellUnlocked = false;

  const commands: Record<string, () => void> = {
    help: () => {
      print('comandos disponíveis:');
      print('  whoami          quem é o dono desta máquina');
      print('  ls              lista o diretório');
      print('  ./pablodlz.sh   executa o script (você sabe que quer)', 't-accent');
      print('  theme           alterna dark/light');
      print('  clear           limpa a tela');
    },
    whoami: () => {
      print('pablodlz — SOC Analyst @ Clavis · Offensive Security · AppSec');
    },
    ls: () => {
      print('pablodlz.sh*  certificados/  publicacoes/  playbooks/  .flag');
    },
    'cat .flag': () => {
      print('permission denied: execute ./pablodlz.sh primeiro', 't-warn');
    },
    theme: () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      setTheme(next);
      document.getElementById('theme-toggle')?.setAttribute('aria-pressed', String(next === 'light'));
      print(`tema alterado para ${next}.`);
    },
    clear: () => {
      out.textContent = '';
    },
    './pablodlz.sh': () => {
      print('[+] executando pablodlz.sh …');
      print(`[+] echo "${FLAG_B64}" | base64 -d`);
      let decoded = '';
      try {
        decoded = atob(FLAG_B64);
      } catch {
        decoded = '(base64 indisponível neste browser)';
      }
      print(`[✓] ${decoded}`, 't-accent');
      print('[✓] shell access concedido. bem-vindo(a) ao time. 🏴');
      if (!shellUnlocked) {
        shellUnlocked = true;
        unlockAchievement('Shell Access', 'Você executou o script secreto do terminal.');
      }
    },
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    print(`❯ ${raw}`, 't-cmd');
    const cmd = raw.toLowerCase();
    if (commands[cmd]) {
      commands[cmd]();
    } else if (cmd.startsWith('sudo')) {
      print('sudo: permissão negada — boa tentativa 😏', 't-warn');
    } else if (cmd === 'pablodlz.sh' || cmd === 'sh pablodlz.sh' || cmd === 'bash pablodlz.sh') {
      commands['./pablodlz.sh']!();
    } else {
      print(`bash: ${raw}: command not found — tente "help"`, 't-warn');
    }
  });
}

initTheme();
initReveal();
initMail();
initCertFilter();
initLightbox();
initScrollProgress();
initScrollspy();
initCounters();
initParticles();
initTerminal();
