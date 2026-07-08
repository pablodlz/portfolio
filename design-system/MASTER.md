# Design System — Pablo Galerani Portfolio (fonte conciliada)

> **Este é o arquivo canônico.** Ele concilia três insumos, nesta ordem de prioridade:
> 1. **Brief do Pablo** (`data/design-references.json > designBrief`) — vence sempre.
> 2. **Referências coletadas** (`data/design-references.json > sites/synthesis`).
> 3. **Saída da skill `ui-ux-pro-max`** (`design-system/pablo-galerani-portfolio/MASTER.md`).
>
> Onde a skill conflita com o brief, o brief vence. Os tokens finais em código vivem em
> `src/styles/tokens.css` e DEVEM espelhar este documento (ver `specs/design-system.md`).

## Decisões de conciliação (registro)

| Tema | Skill sugeriu | Brief/refs dizem | Decisão final |
|---|---|---|---|
| Estilo | "Cyberpunk UI" (neon, glitch, scanlines) | Minimalista, técnico, confiável, sóbrio | **Minimal-terminal**: estética de terminal SÓ em elementos pontuais (hero, eyebrows mono, status cards). Zero glitch, zero scanline, zero neon text-shadow. |
| Light mode | "❌ Light mode" (dark only) | Dark padrão **+ toggle Light persistente** | **Dark padrão + Light completo** (tokens para os dois temas, contraste AA nos dois). |
| Acento | `#22C55E` | Candidatos: verde-terminal `#30d158` (Portline, rank 1) ou ciano | **`#30d158` (dark)** / **`#15803d` (light, p/ contraste AA em texto)**. UMA cor. |
| Fontes | Archivo + Space Grotesk via **Google Fonts CDN** | Inter/Manrope (refs); **CDN proibido** (segurança/CSP) | **Space Grotesk** (títulos) + **Inter** (corpo) + **JetBrains Mono** (terminal/labels), todas **auto-hospedadas** via `@fontsource-variable`. |
| Cores secundárias | paleta slate completa | Secundárias só discretas, para status | Verde/âmbar/vermelho/azul **apenas em badges de severidade/status** (linguagem SOC). |
| Layout | "Portfolio Grid (masonry)" | Zento (bento), Mohit (timeline editorial), Crontap (status cards) | **Bento-grid** p/ skills/stats; **timeline** p/ experiência; **cards de status SOC** como tempero; hero com **bloco terminal** (Portline/Daytona). |

## 1. Cor

### Tema dark (padrão — `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0e0d0c` | Fundo base (preto quente, Portline) |
| `--bg-raised` | `#151413` | Cards/superfícies |
| `--bg-raised-2` | `#1b1a18` | Superfície sobre card (código, tags) |
| `--border` | `#282521` | Bordas sutis |
| `--border-strong` | `#3a3631` | Bordas em hover/foco de card |
| `--text` | `#f2f0ed` | Texto principal (branco quente, nunca #fff puro) |
| `--text-2` | `#aaa49c` | Texto secundário |
| `--text-3` | `#736d64` | Texto mudo (metadados, datas) |
| `--accent` | `#30d158` | Acento único (links, CTAs, foco, dots) |
| `--accent-hover` | `#4ade70` | Hover de elementos de acento |
| `--accent-soft` | `rgba(48,209,88,.10)` | Fundo de badge/glow suave |
| `--accent-border` | `rgba(48,209,88,.28)` | Borda de badge de acento |
| `--on-accent` | `#08210f` | Texto sobre botão de acento |

### Tema light (`[data-theme="light"]`)

| Token | Valor |
|---|---|
| `--bg` | `#faf9f7` |
| `--bg-raised` | `#ffffff` |
| `--bg-raised-2` | `#f1efeb` |
| `--border` | `#e5e1da` |
| `--border-strong` | `#d0cbc2` |
| `--text` | `#1d1b18` |
| `--text-2` | `#5b564e` |
| `--text-3` | `#8b857b` |
| `--accent` | `#15803d` |
| `--accent-hover` | `#166f37` |
| `--accent-soft` | `rgba(21,128,61,.10)` |
| `--accent-border` | `rgba(21,128,61,.30)` |
| `--on-accent` | `#ffffff` |

### Status (APENAS badges de severidade/estado — linguagem SOC)

| Token | Dark | Light | Semântica |
|---|---|---|---|
| `--ok` | `#30d158` | `#15803d` | ativo/atual/ok |
| `--warn` | `#ffd60a` | `#a16207` | em andamento/atenção |
| `--crit` | `#ff453a` | `#b91c1c` | crítico (uso raríssimo) |
| `--info` | `#64d2ff` | `#0369a1` | informativo/categoria |

Regra: status nunca vira cor decorativa de seção, ícone grande ou fundo de bloco de texto.

## 2. Tipografia (auto-hospedada, `@fontsource-variable`)

| Papel | Fonte | Uso |
|---|---|---|
| Display/títulos | **Space Grotesk** (variable) | h1–h3, números de stats |
| Corpo/UI | **Inter** (variable) | parágrafos, nav, botões, cards |
| Mono | **JetBrains Mono** (variable) | terminal do hero, eyebrows, datas, badges, código |

Escala (fluida):
- `--fs-display`: `clamp(2.6rem, 1.2rem + 6vw, 4.5rem)` / 600 / tracking `-0.035em` / lh 1.05
- `--fs-h2`: `clamp(1.9rem, 1.3rem + 2.2vw, 2.6rem)` / 600 / `-0.02em` / lh 1.15
- `--fs-h3`: `1.25rem` / 600 / `-0.01em`
- `--fs-body`: `1rem` / 400 / lh 1.7 ; `--fs-body-lg`: `1.125rem`
- `--fs-small`: `0.875rem` ; `--fs-xs`: `0.8125rem`
- Eyebrow (mono): `0.8125rem` / 500 / uppercase / tracking `0.1em` / com barra de acento à esquerda (Crontap)

## 3. Espaço, raio, sombra, container

- Escala de espaço (base 4): `4, 8, 12, 16, 24, 32, 48, 64, 96` px (`--space-1..--space-9`).
- Padding vertical de seção: `clamp(4rem, 9vw, 7rem)`.
- Container: `max-width: 72rem` (1152px); gutter `clamp(1.25rem, 4vw, 2.5rem)`.
- Raios (tom técnico, pequenos — Daytona/Portline): `--radius-sm: 6px` (badges/inputs), `--radius-md: 10px` (botões), `--radius-lg: 14px` (cards), `--radius-pill: 999px` (pills/dots). Nada de 24px+.
- Sombras: quase nenhuma (flat, bordas fazem o trabalho). Só o lightbox usa `0 24px 64px rgba(0,0,0,.5)`.

## 4. Superfícies e atmosfera

- Fundo base com **grid fino** (linhas 1px `--border` a 6% de opacidade, célula ~64px) + **um glow radial** do acento no topo do hero (Cobalt/Reflect) — `radial-gradient` com `--accent` a ~7% de opacidade. Nos dois temas.
- Cards: `--bg-raised` + borda `--border`; hover: borda `--border-strong` + translateY(-2px). Sem sombra, sem scale.
- H1 do hero em **gradiente branco→cinza** (`background-clip: text`, Cobalt); a linha de destaque pode usar o acento (Supabase).
- Terminal block (hero): fundo `--bg-raised-2`, título de janela com 3 dots, texto JetBrains Mono, cursor `_` piscando (Portline), prompt `┌─(root㉿kali)` do easter egg.

## 5. Componentes (contratos)

- **Button** — primário: `--accent` bg + `--on-accent`; secundário: transparente + borda `--border-strong`; ghost: só texto + hover `--bg-raised-2`. Radius `--radius-md`, padding `12px 20px`, peso 500. Foco: `outline: 2px solid var(--accent); outline-offset: 2px`.
- **Badge/Pill** — mono `--fs-xs`, radius pill, `--accent-soft`/`--accent-border` (ou tokens de status). Variante com dot (● 6px).
- **Tag (tech pill)** — Inter `--fs-xs`, `--bg-raised-2` + borda `--border`, radius `--radius-sm`, inline no texto (Mohit).
- **Card** — ver §4. Variante "status card SOC" (Crontap): header com badge de severidade + label mono + timestamp mono.
- **SectionHeading** — eyebrow mono com barra de acento + h2 + descrição `--text-2`.
- **ThemeToggle** — botão ícone sol/lua na nav (Spellar/Crontap); persiste em `localStorage("theme")`; default dark; respeita escolha, não o SO (dark é o padrão do site).

## 6. Motion

- Durações: `150ms` (micro), `250ms` (hover/estado), `500ms` (entrada de seção). Easing: `cubic-bezier(.22,1,.36,1)`.
- Entrada de seção: fade + translateY(14px), stagger de ~60ms entre filhos, disparada por IntersectionObserver (uma vez).
- Cursor `_` do terminal: `steps(2)` 1.1s infinito.
- **`prefers-reduced-motion: reduce` desliga tudo** (entradas viram opacity instantânea; cursor para).
- Proibido: parallax, glitch, marquee infinito, animação em scroll contínuo.

## 7. Anti-padrões (herdados da skill + brief)

- ❌ Emojis como ícones (usar SVG inline — set próprio, sem CDN)
- ❌ `cursor: pointer` ausente em clicáveis
- ❌ Hover que desloca layout (scale que empurra vizinhos)
- ❌ Contraste < 4.5:1 (texto) / 3:1 (UI) — validar acento nos DOIS temas
- ❌ Transições instantâneas (usar 150–300ms) ou > 600ms
- ❌ Foco invisível; conteúdo escondido atrás de nav fixa; scroll horizontal em mobile
- ❌ Glitch/neon/scanlines; mais de UMA cor de acento; Google Fonts CDN
