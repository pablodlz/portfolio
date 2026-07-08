# Design System — tokens finais

Derivado de [`../design-system/MASTER.md`](../design-system/MASTER.md) (conciliação:
brief > refs > skill). Este spec é o contrato de implementação; **`src/styles/tokens.css`
é o único lugar onde estes valores existem em código.** Componentes consomem só
`var(--*)` — nenhum hex literal fora de tokens.css.

## Temas

- Dark é o default (`:root`). Light via `html[data-theme="light"]`.
- O toggle grava `localStorage.theme ∈ {dark, light}`; script inline no `<head>`
  (hasheado na CSP) aplica antes do primeiro paint (REQ-F11). Sem `prefers-color-scheme`
  como fonte primária: o site é dark por identidade; o SO não sobrescreve.
- `<meta name="color-scheme" content="dark light">` e `theme-color` por tema.

## Tokens (autoritativos)

### Cor — ver tabelas em `design-system/MASTER.md` §1 (valores idênticos)

Dark: `--bg #0e0d0c · --bg-raised #151413 · --bg-raised-2 #1b1a18 · --border #282521 ·
--border-strong #3a3631 · --text #f2f0ed · --text-2 #aaa49c · --text-3 #736d64 ·
--accent #30d158 · --accent-hover #4ade70 · --accent-soft rgba(48,209,88,.10) ·
--accent-border rgba(48,209,88,.28) · --on-accent #08210f`

Light: `--bg #faf9f7 · --bg-raised #ffffff · --bg-raised-2 #f1efeb · --border #e5e1da ·
--border-strong #d0cbc2 · --text #1d1b18 · --text-2 #5b564e · --text-3 #8b857b ·
--accent #15803d · --accent-hover #166f37 · --accent-soft rgba(21,128,61,.10) ·
--accent-border rgba(21,128,61,.30) · --on-accent #ffffff`

Status (só badges): dark `--ok #30d158 · --warn #ffd60a · --crit #ff453a · --info #64d2ff`;
light `#15803d · #a16207 · #b91c1c · #0369a1`. Cada um com par `--*-soft` (10–12% alpha)
para fundo do badge.

Contraste verificado (WCAG AA): texto normal ≥ 4.5:1, texto grande/UI ≥ 3:1.
`#30d158` sobre `#0e0d0c` ≈ 9.9:1 ✔; `#15803d` sobre `#faf9f7` ≈ 4.9:1 ✔;
`--text-3` é o mínimo aceitável para metadados (dark `#736d64` ≈ 4.6:1 ✔).
Badges `--warn`/`--info` em dark usam o hex como **texto** sobre `--*-soft`, nunca como fundo com texto escuro pequeno.

### Tipografia

Famílias (self-hosted, `@fontsource-variable`, `font-display: swap`, preload dos 3 woff2):
`--font-display: 'Space Grotesk Variable'` · `--font-body: 'Inter Variable'` ·
`--font-mono: 'JetBrains Mono Variable'` (+ fallbacks de sistema).

Escala: `--fs-display clamp(2.6rem,1.2rem+6vw,4.5rem)/600/-0.035em/1.05` ·
`--fs-h2 clamp(1.9rem,1.3rem+2.2vw,2.6rem)/600/-0.02em/1.15` · `--fs-h3 1.25rem/600` ·
`--fs-body-lg 1.125rem` · `--fs-body 1rem/1.7` · `--fs-small .875rem` · `--fs-xs .8125rem`.
Eyebrow: mono, `--fs-xs`, uppercase, `letter-spacing .1em`, barra 2×14px de `--accent` à esquerda.

### Espaço/raio/sombra/container

`--space-1..9: 4 8 12 16 24 32 48 64 96px` · seção: `padding-block clamp(4rem,9vw,7rem)` ·
`--container 72rem` + gutter `clamp(1.25rem,4vw,2.5rem)` ·
`--radius-sm 6px · --radius-md 10px · --radius-lg 14px · --radius-pill 999px` ·
sombra só no lightbox (`0 24px 64px rgba(0,0,0,.5)`).

### Atmosfera

- Grid de fundo: `background-image` com 2 `linear-gradient` 1px, célula 64px, cor
  `--border` com opacidade ~40%, aplicado ao hero e (mais fraco) a seções alternadas via `--grid-alpha`.
- Glow: 1 `radial-gradient` de `--accent` (7% alpha dark / 5% light) no topo do hero.
- H1: gradiente de texto `--text → --text-2` (`background-clip: text`); destaque de
  linha/palavra pode usar `--accent` sólido.

### Motion

`--ease: cubic-bezier(.22,1,.36,1)` · `--dur-1 150ms · --dur-2 250ms · --dur-3 500ms`.
Reveal: `opacity 0→1` + `translateY(14px)→0`, stagger 60ms via `--reveal-index`.
Cursor terminal: `steps(2)` 1.1s. `@media (prefers-reduced-motion: reduce)`: todas as
transições/animações → `none`, reveals já visíveis.

## Componentes primitivos (contratos de API)

| Componente | Props essenciais | Notas |
|---|---|---|
| `Button` | `href, variant: primary/secondary/ghost, icon?` | sempre `<a>` (site estático); foco `outline 2px --accent offset 2px` |
| `Badge` | `tone: accent/ok/warn/crit/info/neutral, dot?` | mono, pill, `--*-soft` bg |
| `Tag` | `label` | tech pill inline (Mohit) |
| `Card` | `as?, href?, interactive?` | borda `--border`; hover: `--border-strong` + translateY(-2px), sem sombra |
| `SectionHeading` | `eyebrow, title, description?, id` | `<h2>` com âncora; eyebrow mono com barra |
| `Icon` | `name, size=20` | SVG inline, `stroke: currentColor`, `aria-hidden` |
| `Terminal` | `title?, lines (slot)` | janela com 3 dots, mono, cursor piscante opcional |
| `ThemeToggle` | — | `<button aria-pressed>` sol/lua; script global |

## Regras duras (validáveis em review)

1. Nenhum hex fora de `tokens.css` (grep `#[0-9a-f]{3,8}` em `src/components` deve retornar 0).
2. UMA cor de acento; `--ok/--warn/--crit/--info` só em `Badge`.
3. Nenhum `@import url(http…)`/CDN; fontes só de `node_modules/@fontsource-variable` copiadas pelo bundler.
4. Todo clicável: `cursor: pointer` + estado de foco visível.
5. Imagens sempre com `width`/`height` (CLS 0).
6. Raio máximo 14px (exceto pill); sem glassmorphism, sem neon, sem glitch.
