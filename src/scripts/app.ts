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
  // sem partículas no mobile (coarse): animação canvas contínua não vale a
  // bateria/CPU numa tela pequena — mais leve e responsivo
  if (!canvasEl || REDUCED || COARSE) return;
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
  playSfx('achievement'); // stinger nostálgico "missão cumprida"
}

/* ---------- fogos de artifício (conquista MESTRE: 100 cliques no b1t) ----------
   Camada canvas em tela cheia, sem capturar ponteiro (não atrapalha o uso),
   one-shot com auto-limpeza. Composição aditiva ('lighter') p/ brilho, sem
   escurecer a página (fundo transparente). Respeita reduced-motion. */
let fireworksBusy = false;
function launchFireworks(duration = 6000): void {
  if (REDUCED || fireworksBusy) return; // sem animação sob reduced-motion
  fireworksBusy = true;
  const c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  Object.assign(c.style, {
    position: 'fixed', inset: '0', width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '9998',
  });
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  if (!ctx) { c.remove(); fireworksBusy = false; return; }

  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  const resize = (): void => {
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  // paleta quente ancorada no laranja da marca + dourado/branco (festivo, on-brand)
  const PALETTE = ['#ff5024', '#ff7a3d', '#ffab38', '#ffd88a', '#ffffff'];
  interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; r: number }
  let sparks: Spark[] = [];
  const small = COARSE; // telas pequenas: menos partículas p/ manter fluido

  const burst = (bx: number, by: number): void => {
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
    const n = (small ? 26 : 42) + Math.floor(Math.random() * (small ? 14 : 26));
    const speed = 2.2 + Math.random() * 2.2;
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.16;
      const sp = speed * (0.5 + Math.random() * 0.7);
      sparks.push({ x: bx, y: by, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 58 + Math.random() * 42, color, r: 1.3 + Math.random() * 1.7 });
    }
    dispatchEvent(new CustomEvent('pablodlz:sfx', { detail: 'firework' }));
  };

  const t0 = performance.now();
  let last = t0;
  const frame = (now: number): void => {
    const dt = Math.min(2.2, (now - last) / 16.67); last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    sparks = sparks.filter((s) => s.life < s.max);
    for (const s of sparks) {
      s.life += dt;
      s.vy += 0.035 * dt; // gravidade
      s.vx *= 0.985; s.vy *= 0.985;
      s.x += s.vx * dt; s.y += s.vy * dt;
      ctx.globalAlpha = Math.max(0, 1 - s.life / s.max);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const elapsed = now - t0;
    if (elapsed < duration && Math.random() < 0.09) {
      burst(w * (0.12 + Math.random() * 0.76), h * (0.12 + Math.random() * 0.42));
    }
    if (elapsed < duration || sparks.length) {
      requestAnimationFrame(frame);
    } else {
      removeEventListener('resize', resize);
      c.remove();
      fireworksBusy = false;
    }
  };
  burst(w * 0.3, h * 0.3);
  burst(w * 0.7, h * 0.28);
  requestAnimationFrame(frame);
}

/* ============================================================================
   ÁUDIO — motor de SFX 100% sintetizado (Web Audio; sem arquivos → CSP intacta).
   Identidade: cyber/sci-fi discreto, com stingers inspirados na sensação de
   "missão cumprida" de GTA:SA (originais, não samples). Toggle persistente.
   ============================================================================ */
let audioCtx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxOn = (() => {
  try {
    return localStorage.getItem('sfx') !== 'off';
  } catch {
    return true;
  }
})();
const sfxLast: Record<string, number> = {};

function ensureCtx(): AudioContext | null {
  if (!sfxOn) return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
      master = audioCtx.createGain();
      master.gain.value = 0.5; // volume global baixo
      master.connect(audioCtx.destination);
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume().catch(() => {});
  void loadSamples(audioCtx); // carrega arquivos licenciados (se houver), uma vez
  return audioCtx;
}

/* ---------- camada de SAMPLES (opcional) ----------------------------------
   Se o DONO do site colocar arquivos de áudio que ELE POSSUI/LICENCIA em
   public/audio/ + um manifest.json { cue: arquivo }, o motor toca esses
   arquivos no lugar da síntese. Same-origin → CSP 'self' intacta, zero
   terceiros. Sem manifest/arquivos, cai no fallback sintetizado (nada muda). */
const sampleBuffers = new Map<string, AudioBuffer>();
const sampleOffsets = new Map<string, number>(); // ponto de início (s) = ataque
let samplesTried = false;
// o som só "estoura" no PICO do arquivo (antes disso há silêncio + subida
// gradual do MP3) → começamos a tocar logo antes do pico p/ o impacto sair NO
// clique, sem atraso. Um fade-in de 3ms no playSample evita o estalo.
function attackOffset(buf: AudioBuffer): number {
  const chans: Float32Array[] = [];
  for (let ch = 0; ch < buf.numberOfChannels; ch++) chans.push(buf.getChannelData(ch));
  const n = buf.length;
  let peak = 0;
  for (const data of chans) for (let i = 0; i < n; i++) { const a = Math.abs(data[i]!); if (a > peak) peak = a; }
  if (peak <= 0) return 0;
  // primeiro ponto que já está "alto" (70% do pico) = borda do ataque
  const target = peak * 0.7;
  for (let i = 0; i < n; i++) {
    for (const data of chans) {
      if (Math.abs(data[i]!) >= target) return Math.max(0, i / buf.sampleRate - 0.006); // 6ms de pré-ataque
    }
  }
  return 0;
}
async function loadSamples(ctx: AudioContext): Promise<void> {
  if (samplesTried) return;
  samplesTried = true;
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // garante 1 barra final
  try {
    const res = await fetch(`${base}audio/manifest.json`);
    if (!res.ok) return; // sem manifest → só síntese
    const map = (await res.json()) as Record<string, string>;
    await Promise.all(
      Object.entries(map)
        .filter(([cue, file]) => !cue.startsWith('_') && typeof file === 'string' && file)
        .map(async ([cue, file]) => {
          try {
            const r = await fetch(`${base}audio/${file}`);
            if (!r.ok) return;
            const buf = await ctx.decodeAudioData(await r.arrayBuffer());
            sampleBuffers.set(cue, buf);
            sampleOffsets.set(cue, attackOffset(buf));
          } catch {
            /* arquivo ausente/inválido: mantém a síntese p/ esse cue */
          }
        }),
    );
  } catch {
    /* sem rede/manifest: segue 100% na síntese */
  }
}
function playSample(name: string): boolean {
  const buf = sampleBuffers.get(name);
  if (!buf || !audioCtx || !master) return false;
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  const offset = sampleOffsets.get(name) ?? 0;
  if (offset > 0) {
    // começamos no meio da onda (no ataque) → fade-in de 3ms evita "clique"
    const g = audioCtx.createGain();
    const t = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(1, t + 0.003);
    src.connect(g);
    g.connect(master);
  } else {
    src.connect(master);
  }
  src.start(0, offset); // começa no ataque → impacto sai no clique, sem atraso
  return true;
}

interface ToneOpts {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  gain?: number;
  at?: number;
  slideTo?: number;
  detune?: number; // >0 empilha uma 2ª voz desafinada → timbre "synth-brass" rico
  attack?: number;
}
function tone(ctx: AudioContext, o: ToneOpts): void {
  const t0 = ctx.currentTime + (o.at ?? 0);
  const dur = o.dur ?? 0.12;
  const atk = o.attack ?? 0.008;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.08, t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  g.connect(master!);
  const detunes = o.detune ? [-o.detune, o.detune] : [0];
  for (const d of detunes) {
    const osc = ctx.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);
    if (d) osc.detune.setValueAtTime(d, t0);
    osc.connect(g);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }
}
// acorde: várias notas simultâneas (para o "toque triunfal")
function chord(ctx: AudioContext, freqs: number[], o: Omit<ToneOpts, 'freq'>): void {
  for (const f of freqs) tone(ctx, { ...o, freq: f });
}
const jitter = (n: number, amt = 30) => n + (Math.random() * 2 - 1) * amt;
// notas (Hz) — reaproveitadas nos jingles
const N = { C4: 261.63, E4: 329.63, G4: 392.0, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77, C6: 1046.5, E6: 1318.5, G6: 1568.0 };

/* Identidade sonora inspirada em GTA: San Andreas — recriada 100% via síntese
   (Web Audio), sem samples do jogo: mantém a CSP 'self' intacta e sem risco de
   direitos autorais, evocando a nostalgia pela ESTRUTURA melódica dos jingles. */
const SFX: Record<string, (c: AudioContext) => void> = {
  // --- vozinha do b1t ---
  boop: (c) => tone(c, { freq: jitter(680), type: 'triangle', dur: 0.09, gain: 0.06 }),
  boop2: (c) => {
    tone(c, { freq: 520, type: 'square', dur: 0.05, gain: 0.045 });
    tone(c, { freq: jitter(820), type: 'square', dur: 0.06, gain: 0.045, at: 0.05 });
  },
  hop: (c) => tone(c, { freq: 400, type: 'sine', dur: 0.13, gain: 0.06, slideTo: jitter(760, 60) }),
  scan: (c) => tone(c, { freq: 280, type: 'sawtooth', dur: 0.4, gain: 0.03, slideTo: 1300 }),
  worried: (c) => tone(c, { freq: 520, type: 'sine', dur: 0.22, gain: 0.05, slideTo: 230 }),
  happy: (c) => [N.C5, N.E5, N.G5].forEach((f, i) => tone(c, { freq: f, type: 'triangle', dur: 0.1, gain: 0.05, at: i * 0.06 })),
  wave: (c) => tone(c, { freq: jitter(900), type: 'sine', dur: 0.08, gain: 0.04 }),

  // --- gamificação estilo GTA:SA (originais) ---
  // "MISSION PASSED": fanfarra synth-brass ascendente que resolve num acorde
  achievement: (c) => {
    const t: OscillatorType = 'sawtooth';
    tone(c, { freq: N.G4, type: t, dur: 0.12, gain: 0.045, detune: 8 });
    tone(c, { freq: N.C5, type: t, dur: 0.12, gain: 0.045, detune: 8, at: 0.11 });
    tone(c, { freq: N.E5, type: t, dur: 0.14, gain: 0.05, detune: 8, at: 0.22 });
    chord(c, [N.C5, N.E5, N.G5], { type: t, dur: 0.55, gain: 0.04, detune: 10, at: 0.37, attack: 0.02 });
    tone(c, { freq: N.C6, type: 'triangle', dur: 0.6, gain: 0.035, at: 0.4 });
    tone(c, { freq: N.C4 / 2, type: 'sine', dur: 0.7, gain: 0.05, at: 0.37 }); // baixo quente
  },
  // "NEW MISSION": motivo curto de expectativa (ascendente)
  mission: (c) => {
    const t: OscillatorType = 'square';
    tone(c, { freq: N.E4, type: t, dur: 0.1, gain: 0.04, detune: 6 });
    tone(c, { freq: N.A4, type: t, dur: 0.1, gain: 0.04, detune: 6, at: 0.1 });
    tone(c, { freq: N.C5, type: t, dur: 0.18, gain: 0.045, detune: 6, at: 0.2 });
  },
  // "CHEAT ACTIVATED": power-up rápido subindo + brilho
  cheat: (c) => {
    tone(c, { freq: 300, type: 'square', dur: 0.2, gain: 0.045, slideTo: 1500 });
    tone(c, { freq: N.C6, type: 'triangle', dur: 0.14, gain: 0.03, at: 0.16 });
  },
  theme: (c) => SFX.cheat!(c), // a brincadeira do tema é uma "manha"
  // "SAVE GAME": confirmação suave em duas notas
  save: (c) => {
    tone(c, { freq: N.G5, type: 'sine', dur: 0.14, gain: 0.04 });
    tone(c, { freq: N.C6, type: 'sine', dur: 0.24, gain: 0.038, at: 0.12 });
  },
  // "PICKUP / COLLECTIBLE": moedinha brilhante
  pickup: (c) => {
    tone(c, { freq: N.B5, type: 'square', dur: 0.08, gain: 0.04 });
    tone(c, { freq: N.E6, type: 'square', dur: 0.16, gain: 0.04, at: 0.07 });
  },
  // "SECRET FOUND": brilho misterioso ascendente (sininhos)
  secret: (c) => [N.A5, N.C6, N.E6, N.A5 * 2].forEach((f, i) => tone(c, { freq: f, type: 'sine', dur: 0.2, gain: 0.036, at: i * 0.08 })),
  // "DENIED / WRONG": buzz curto e grave descendente (comando inexistente)
  error: (c) => {
    tone(c, { freq: 200, type: 'square', dur: 0.12, gain: 0.045, slideTo: 130 });
    tone(c, { freq: 150, type: 'square', dur: 0.18, gain: 0.04, slideTo: 88, at: 0.11 });
  },
  // "FIREWORK": assobio subindo + estouro grave (conquista mestre)
  firework: (c) => {
    tone(c, { freq: 520, type: 'sine', dur: 0.16, gain: 0.02, slideTo: 1200 });
    tone(c, { freq: 220, type: 'sawtooth', dur: 0.16, gain: 0.03, slideTo: 60, at: 0.15 });
  },
  click: (c) => tone(c, { freq: 1300, type: 'square', dur: 0.03, gain: 0.03 }),
  // cues do b1t que preferem samples (tap.mp3/tap2.mp3); fallback sintetizado
  // caso os arquivos não existam — bitmsg = balão/mensagem, bitclick = clique
  bitmsg: (c) => tone(c, { freq: 900, type: 'sine', dur: 0.07, gain: 0.03 }),
  bitclick: (c) => tone(c, { freq: jitter(680), type: 'triangle', dur: 0.09, gain: 0.06 }),
};

function playSfx(name: string): void {
  const c = ensureCtx();
  if (!c) return;
  const now = performance.now();
  if (now - (sfxLast[name] ?? 0) < 80) return; // anti-spam
  sfxLast[name] = now;
  try {
    if (playSample(name)) return; // arquivo licenciado tem prioridade sobre a síntese
    SFX[name]?.(c);
  } catch {
    /* áudio indisponível: silêncio */
  }
}

function initSound(): void {
  const btn = document.getElementById('sfx-toggle');
  addEventListener('pablodlz:sfx', ((e: CustomEvent<string>) => playSfx(e.detail)) as EventListener);
  addEventListener('pablodlz:unlock', ((e: CustomEvent<{ name: string; text: string }>) =>
    unlockAchievement(e.detail.name, e.detail.text)) as EventListener);
  // conquista mestre (100 cliques no b1t) → fogos no site inteiro
  addEventListener('pablodlz:fireworks', () => launchFireworks());
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(sfxOn));
  btn.addEventListener('click', () => {
    sfxOn = !sfxOn;
    btn.setAttribute('aria-pressed', String(sfxOn));
    try {
      localStorage.setItem('sfx', sfxOn ? 'on' : 'off');
    } catch {
      /* sem storage: vale para a sessão */
    }
    if (sfxOn) playSfx('save'); // confirma ligando (o clique é o gesto do usuário)
  });
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
  // 'click' (não 'pointerdown'): no celular, deslizar o dedo p/ rolar NÃO deve
  // ativar o terminal — só um toque deliberado (tap) ou focar o campo
  input.addEventListener('focus', load, { once: true });
  body.addEventListener('click', load, { once: true });
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
initSound();
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
