/**
 * Único bundle de runtime do site (REQ-N06): tema, reveal, mailto ofuscado,
 * filtro/lightbox da galeria — e a camada de experiência v3: terminal completo
 * (autocomplete, histórico, conquistas), rastro do cursor, glow nos cards,
 * mascote (script próprio no componente) e widgets. Sem dependências.
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
  btn.addEventListener('click', () =>
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

/* ================================================================
   TERMINAL v3 — o brinquedo principal
   ================================================================ */
interface TermData {
  role: string;
  company: string;
  github: string;
  linkedin: string;
  socials: { name: string; url: string }[];
  topSkills: string[];
  resume: string;
  certs: string;
  pubs: number;
  location: string;
}

function initTerminal(): void {
  const form = document.querySelector<HTMLFormElement>('.t-form');
  const input = document.querySelector<HTMLInputElement>('.t-input');
  const out = document.querySelector<HTMLElement>('.t-out');
  const body = document.querySelector<HTMLElement>('.terminal-body');
  if (!form || !input || !out || !body) return;

  let td: TermData | null = null;
  try {
    td = JSON.parse(form.dataset.term ?? 'null') as TermData;
  } catch {
    td = null;
  }

  body.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('a, button')) input.focus();
  });

  const scroll = () => (body.scrollTop = body.scrollHeight);
  const print = (text: string, cls = ''): HTMLElement => {
    const line = document.createElement('span');
    line.className = `t-line is-live${cls ? ` ${cls}` : ''}`;
    line.textContent = text;
    out.appendChild(line);
    scroll();
    return line;
  };
  const printLink = (label: string, href: string, download = false): void => {
    const line = document.createElement('span');
    line.className = 't-line is-live';
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (download) a.setAttribute('download', '');
    else if (href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    line.append('→ ', a);
    out.appendChild(line);
    scroll();
  };
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

  const FLAG_B64 = 'RkxBR3twYWJsby5nYWxlcmFuaUBnbWFpbC5jb219';
  let scriptRan = false;
  const history: string[] = [];
  let histIdx = -1;
  const usedCommands = new Set<string>();

  const JOKES = [
    'por que o pentester atravessou a rua? p/ testar o outro lado da DMZ.',
    'meu firewall e eu temos algo em comum: negamos tudo por padrão.',
    'phishing? aqui só se for pesca esportiva.',
    'existem 10 tipos de pessoas: as que entendem binário e as que clicam no link.',
    'senha forte é tipo escova de dentes: não se empresta e troca de vez em quando.',
    'CTF é o único lugar onde procurar bandeira dá pontos.',
  ];
  const QUOTES = [
    '"Amateurs hack systems, professionals hack people." — Bruce Schneier',
    '"Security is a process, not a product." — Bruce Schneier',
    '"The quieter you become, the more you are able to hear." — Kali Linux',
    '"Trust, but verify." — e depois verifique de novo.',
    '"There is no patch for human stupidity." — Kevin Mitnick',
  ];
  const FORTUNES = [
    'hoje é um ótimo dia para rodar `npm audit`.',
    'um alerta silencioso não é um alerta resolvido.',
    'você encontrará uma flag onde menos espera. (dica: já encontrou o comentário no código?)',
    'seu próximo scan trará novidades. patch antes que explorem.',
    'backup feito é futuro garantido. teste o restore.',
  ];

  const FILES: Record<string, string[]> = {
    'sobre.txt': [
      'Pablo de Souza Galerani — SOC Analyst @ Clavis.',
      'Blue team de dia, labs ofensivos à noite.',
      'Pós em Cibersegurança Ofensiva · Tecnólogo em SI.',
    ],
    'skills.txt': td ? td.topSkills.map((s) => `• ${s}`) : ['(dados indisponíveis)'],
    'contato.txt': [
      'e-mail: use o botão laranja no fim da página (anti-bot, sabe como é)',
      'linkedin/github: /pablodlz',
    ],
    '.flag': ['permission denied — execute ./pablodlz.sh primeiro'],
  };

  const NEOFETCH = [
    '        ▄▄▄▄▄▄▄        pablodlz@portfolio',
    '      ▄█▀▀▀▀▀▀▀█▄      ─────────────────────────',
    '     ██  ▄▄▄▄▄  ██     OS......: PabloOS 3.0 (hardened)',
    '     ██  █▄▄▄█  ██     Host....: GitHub Pages (static)',
    '      ██▄     ▄██      Shell...: fake-bash 5.2-secure',
    '        ▀█▄▄▄█▀        Uptime..: desde 2020',
    '          ▀▀▀          CSP.....: strict, sem unsafe-*',
    '                       Trackers: 0 · Deps: mínimas',
  ];

  const BANNER = [
    '█▀█ ▄▀█ █▄▄ █░░ █▀█ █▀▄ █░░ ▀█',
    '█▀▀ █▀█ █▄█ █▄▄ █▄█ █▄▀ █▄▄ █▄ ── SOC · AppSec · OffSec',
  ];

  const COFFEE = [
    '      ( (',
    '       ) )',
    '    ........',
    '    |      |]',
    '    \\      /',
    '     `----´   café servido. turno garantido.',
  ];

  const trackUse = (cmd: string): void => {
    usedCommands.add(cmd);
    if (usedCommands.size === 8) {
      unlockAchievement('Explorador', 'Você testou 8 comandos diferentes no terminal.');
    }
  };

  const runScript = (): void => {
    print('[+] executando pablodlz.sh …');
    const load = print('[▏         ] carregando payload de simpatia');
    const frames = ['[▎▎▎       ]', '[▍▍▍▍▍     ]', '[▊▊▊▊▊▊▊   ]', '[██████████]'];
    let i = 0;
    const iv = setInterval(() => {
      if (i < frames.length) {
        load.textContent = `${frames[i]} carregando payload de simpatia`;
        i++;
        scroll();
      } else {
        clearInterval(iv);
        print(`[+] echo "${FLAG_B64}" | base64 -d`);
        let decoded = '';
        try {
          decoded = atob(FLAG_B64);
        } catch {
          decoded = '(base64 indisponível)';
        }
        print(`[✓] ${decoded}`, 't-accent');
        print('[✓] shell access concedido. bem-vindo(a) ao time. 🏴');
        scriptRan = true;
        FILES['.flag'] = [decoded];
        unlockAchievement('Shell Access', 'Você executou o script secreto do terminal.');
      }
    }, REDUCED ? 0 : 260);
  };

  const runMatrix = (): void => {
    if (REDUCED) {
      print('01001101 01000001 01010100 01010010 01001001 01011000', 't-accent');
      print('wake up, neo. (versão acessível: sem chuva de caracteres)');
      unlockAchievement('Neo', 'Você entrou na Matrix.');
      return;
    }
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷ0123456789';
    let n = 0;
    const iv = setInterval(() => {
      let line = '';
      for (let j = 0; j < 42; j++) {
        line += Math.random() < 0.12 ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
      print(line, 't-accent');
      if (out.children.length > 60) out.removeChild(out.firstChild!);
      n++;
      if (n >= 18) {
        clearInterval(iv);
        print('wake up, neo…', 't-cmd');
        unlockAchievement('Neo', 'Você entrou na Matrix.');
      }
    }, 90);
  };

  const runHack = (target: string): void => {
    const t = target || 'mainframe';
    print(`[+] iniciando "invasão" de ${t} …`);
    const load = print('[          ] bypassando firewall imaginário');
    const steps = [
      '[███       ] bypassando firewall imaginário',
      '[██████    ] quebrando criptografia de mentirinha',
      '[██████████] coletando 0 dados (não há o que coletar)',
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        load.textContent = steps[i]!;
        i++;
        scroll();
      } else {
        clearInterval(iv);
        print(`[✓] acesso concedido a: NADA. isto é um portfólio, não a NASA 😄`, 't-warn');
        print('    (hacking de verdade só com autorização — ética em primeiro lugar)');
      }
    }, REDUCED ? 0 : 420);
  };

  const commands: Record<string, (arg: string) => void> = {
    help: () => {
      print('comandos: whoami · id · pwd · ls · cat <arquivo> · tree · neofetch');
      print('          skills · certs · experience · projects · contact · socials');
      print('          resume · banner · matrix · hack · coffee · joke · quote');
      print('          fortune · uname · date · history · theme · clear · secret');
      print('dica: TAB completa, ↑↓ navegam o histórico', 't-accent');
    },
    whoami: () => {
      print(`pablodlz — ${td?.role ?? 'SOC Analyst'} @ ${td?.company ?? 'Clavis'}`);
    },
    id: () => {
      print('uid=1337(pablodlz) gid=1337(blueteam) groups=soc,appsec,offsec,ctf');
    },
    pwd: () => print('/home/pablodlz/portfolio'),
    ls: () => {
      print('pablodlz.sh*  sobre.txt  skills.txt  contato.txt  certificados/  publicacoes/');
    },
    'ls -la': () => {
      print('drwxr-x--- pablodlz blueteam  .');
      print('-rwx------ pablodlz blueteam  pablodlz.sh*');
      print('-rw-r----- pablodlz blueteam  sobre.txt  skills.txt  contato.txt');
      print('-r-------- root     root      .flag        ← hmm…', 't-accent');
    },
    tree: () => {
      print('.');
      print('├── pablodlz.sh*');
      print('├── sobre.txt · skills.txt · contato.txt');
      print('├── certificados/ (50+)');
      print('├── publicacoes/ (11)');
      print('└── .flag 🔒');
    },
    cat: (arg) => {
      if (!arg) {
        print('uso: cat <arquivo> — tente `ls`', 't-warn');
        return;
      }
      const f = FILES[arg];
      if (f) f.forEach((l) => print(l));
      else print(`cat: ${arg}: arquivo não encontrado`, 't-warn');
    },
    neofetch: () => NEOFETCH.forEach((l) => print(l, 't-accent')),
    banner: () => BANNER.forEach((l) => print(l, 't-accent')),
    skills: () => {
      (td?.topSkills ?? []).forEach((s) => print(`▸ ${s}`));
      print('detalhes na seção Capacidades ↓');
    },
    certs: () => {
      print(`${td?.certs ?? '50+'} certificações e treinamentos — galeria na seção Certificações.`);
    },
    experience: () => {
      print(`atual: ${td?.role ?? 'SOC Analyst'} @ ${td?.company ?? 'Clavis'} (2025—)`);
      print('antes: 5 anos de Enifler — de estagiário a analista sênior.');
    },
    projects: () => {
      print('▸ pesquisa: undersampling p/ detecção de ransomware (ML) — −41,96% tempo');
      print('▸ palestras: SSDLC do zero (IFPR · Fatec) com Demetry Kotrozinis');
    },
    contact: () => {
      print('e-mail: botão laranja no fim da página (mailto protegido)');
      if (td) printLink('LinkedIn', td.linkedin);
    },
    socials: () => {
      (td?.socials ?? []).forEach((s) => printLink(s.name, s.url));
    },
    resume: () => {
      if (td) {
        print('[✓] currículo pronto:');
        printLink('curriculo-pablo-galerani.pdf', td.resume, true);
      }
    },
    history: () => {
      history.forEach((h, i) => print(`${String(i + 1).padStart(3)}  ${h}`));
    },
    date: () => print(new Date().toLocaleString('pt-BR')),
    uname: () => print('PabloOS 3.0-hardened x86_64 — uptime desde 2020'),
    theme: () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      setTheme(next);
      print(`tema alterado para ${next}.`);
    },
    clear: () => {
      out.textContent = '';
    },
    coffee: () => {
      COFFEE.forEach((l) => print(l));
      unlockAchievement('Barista', 'Café servido. O SOC agradece.');
    },
    joke: () => print(pick(JOKES)),
    quote: () => print(pick(QUOTES), 't-accent'),
    fortune: () => print(`🥠 ${pick(FORTUNES)}`),
    matrix: () => runMatrix(),
    hack: (arg) => runHack(arg),
    ping: () => print('PING pablodlz.github.io: 64 bytes, ttl=64, tempo=0.42ms — sempre no ar.'),
    exit: () => print('não há escapatória. (mas a aba fecha com Ctrl+W 😉)'),
    vim: () => print('vim aberto. para sair: … boa sorte. (`:q!` não funciona aqui)'),
    secret: () => {
      print('você viu o INCIDENT-0000 no código-fonte? 😏', 't-accent');
      print('aquela "chave AWS" é base64 de uma piada — aqui não há segredos:');
      print('site estático, sem backend, sem .env. mas a curiosidade rende:');
      unlockAchievement('Caçador de Segredos', 'Curiosidade é a primeira skill de segurança.');
    },
    easteregg: () => {
      print('eggs conhecidos: ./pablodlz.sh · matrix · coffee · secret · comentário no código-fonte');
      print('há mais um… quem procura, acha. 🥚');
    },
    './pablodlz.sh': () => runScript(),
    'cat .flag': () => {
      if (scriptRan) FILES['.flag']!.forEach((l) => print(l, 't-accent'));
      else print('permission denied — execute ./pablodlz.sh primeiro', 't-warn');
    },
  };

  const ALIASES: Record<string, string> = {
    ll: 'ls -la',
    dir: 'ls',
    cls: 'clear',
    certifications: 'certs',
    'sh pablodlz.sh': './pablodlz.sh',
    'bash pablodlz.sh': './pablodlz.sh',
    'pablodlz.sh': './pablodlz.sh',
    quit: 'exit',
    ':q': 'exit',
    ':q!': 'exit',
    nano: 'vim',
    emacs: 'vim',
    q: 'exit',
  };

  const ALL_COMPLETIONS = [...Object.keys(commands), './pablodlz.sh', 'cat sobre.txt', 'cat skills.txt', 'cat .flag'];

  function exec(raw: string): void {
    print(`❯ ${raw}`, 't-cmd');
    const lower = raw.toLowerCase().trim();
    const resolved = ALIASES[lower] ?? lower;

    if (resolved.startsWith('sudo')) {
      if (resolved.includes('sandwich')) print('okay. 🥪 (xkcd/149 — respeito às tradições)');
      else print('sudo: permissão negada — boa tentativa 😏', 't-warn');
      trackUse('sudo');
      return;
    }
    if (resolved === 'rm -rf /' || resolved.startsWith('rm ')) {
      print('rm: sistema protegido. imutável. zen. 🧘', 't-warn');
      trackUse('rm');
      return;
    }

    // comando exato (inclui compostos tipo "ls -la" e "cat .flag")
    const direct = commands[resolved];
    if (direct) {
      direct('');
      trackUse(resolved);
      return;
    }
    // comando + argumento
    const spaceIdx = resolved.indexOf(' ');
    if (spaceIdx > 0) {
      const head = resolved.slice(0, spaceIdx);
      const arg = raw.slice(spaceIdx + 1).trim();
      const fn = commands[head];
      if (fn) {
        fn(arg);
        trackUse(head);
        return;
      }
    }
    const sugg = ALL_COMPLETIONS.find((c) => c.startsWith(resolved.slice(0, 3)));
    print(
      `bash: ${raw}: command not found${sugg ? ` — você quis dizer "${sugg}"?` : ' — tente "help"'}`,
      't-warn',
    );
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    history.push(raw);
    histIdx = history.length;
    exec(raw);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx] ?? '';
      }
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx] ?? '';
      } else {
        histIdx = history.length;
        input.value = '';
      }
    } else if (ev.key === 'Tab') {
      ev.preventDefault();
      const cur = input.value.toLowerCase();
      if (!cur) return;
      const matches = ALL_COMPLETIONS.filter((c) => c.startsWith(cur));
      if (matches.length === 1) input.value = matches[0]!;
      else if (matches.length > 1) print(matches.join('   '), 't-accent');
    }
  });
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

initTheme();
initReveal();
initMail();
initCertFilter();
initLightbox();
initScrollProgress();
initScrollspy();
initCounters();
initParticles();
initTrail();
initGlowCards();
initRecToggle();
initTerminal();
consoleEgg();
