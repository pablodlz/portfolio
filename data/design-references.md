# Referências de Design — Portfólio Pablo Galerani

> Coletado em 2026-07-07 pela análise ao vivo dos sites (valores de cor/fonte extraídos via `getComputedStyle`, reais). Fonte estruturada: [`design-references.json`](design-references.json).

## 🎯 Brief (preferências do Pablo)

- **Dark por padrão**, com **toggle Light** opcional.
- **UMA cor principal.** Secundárias só **discretas**, para diferenciar seções/estados — nada colorido.
- Vibe **cibersegurança / SOC**: minimalista, técnico, confiável.
- **Candidatos a acento:** verde-terminal (`#30d158`), ciano/azul (`#0080ff`) ou âmbar sóbrio.
- **Ideia:** base preto/quase-preto + 1 acento + cinzas neutros. Secundárias só em **badges de status** (verde=ok, âmbar=alerta, vermelho=crítico) — que é a própria linguagem de um SOC.

---

## Sites (na ordem de preferência)

### 1. Portline · [portline.dev](https://portline.dev) — *dev tool / terminal* — 🟢 relevância alta
- **Fundo** `#0e0d0c` (preto quente) · **texto** branco · **Inter**
- **H1** 68px/700, tracking −1.7px · **acento** 🟢 `#30d158` (status "live")
- **Botão primário branco** invertido (radius 12px, sem sombra)
- **Roubar:** acento verde só p/ status; botão branco sobre escuro; bloco de comando copiável (curl).
- Print: `shots/01-portline-source.jpeg`

### 2. Daytona · [daytona.io](https://www.daytona.io) — *infra p/ IA* — 🟢 alta
- **Fundo** `#0a0a0a` · **Inter** · **H1** 48px peso **400** (leve)
- **Acento** 🔵 `#0080ff` · **radius 4px** (sério/técnico) · hero com **bloco de código + abas de linguagem**
- **Roubar:** bloco de código no hero; H1 leve; radius pequeno.
- Print: `shots/02-daytona-source.jpeg`

### 3. Supabase · [supabase.com](https://supabase.com) — *backend* — 🟢 alta
- **Fundo** ~`#121212` · **Manrope** (títulos) + **Inter** (corpo) · **acento** 🟢 `#3ecf8e`
- Headline em **2 cores** (branco + verde) · **grid de cards de feature** (ícone+título+bullets+mockup)
- **Roubar:** grid de cards de feature (→ skills/serviços); 2ª linha do título em acento.
- Print: `shots/03-supabase-source.jpeg`

### 4. Cobalt · [joincobalt.com](https://joincobalt.com) — *fintech* — 🟢 alta
- **Fundo** `#09090b` (zinc) + **grid + glow azul-cobalto sutil** · **Inter**
- **H1** 72px/700 em **TEXTO GRADIENTE** (branco→cinza) · paleta **ultra-dessaturada**
- **Roubar:** texto em gradiente nos títulos; fundo grade + glow radial de 1 cor; restrição extrema = premium.

### 5. Zento · [zento.framer.website](https://zento.framer.website) — *TEMPLATE DE PORTFÓLIO* — ⭐ relevância máxima
- **Fundo** `#050505` · cards ~`#161616` · **Manrope** · **acento** 🟣 `#a290fc` + 🟢 dot "Available to work"
- **LAYOUT BENTO-GRID** — mosaico de cards: perfil (avatar+nome+badge disponível+tags), **estatísticas** (56+ Projects…), **Tech Arsenal** (stack em grid 2×2), Works Gallery, Testimonials, Workflow, Services, clientes, CTA.
- **Roubar:** a estrutura bento inteira; card de perfil com tags; cards de estatística; card de stack.

### 6. Spellar · [spellar.ai](https://www.spellar.ai) — *app IA macOS* — 🟡 média-alta
- **Fundo** `#000` · **Geologica** (display) · **H1** 76px/700, tracking **−3px** (enorme)
- **Acento** 🟣 `#a78bfa` + **CTA pill em gradiente roxo→rosa** · **toggle light/dark** na navbar
- **Roubar:** toggle light/dark; fonte display forte; pill de anúncio no topo do hero.

### 7. Mohit Singh · [mohitsingh.cloud](https://www.mohitsingh.cloud) — *portfólio dev editorial* — 🟢 alta
- **Fundo** `#111010` (quente) · **Reckless** (serif, títulos) + **Figtree** (corpo) + **mono**
- **Stack como PILLS INLINE** dentro da frase (logo+nome) · **timeline "Story So Far"** (logo empresa+cargo+datas+expandir) · **cards de projeto** (thumb+badge "Building/Live"+ícones de stack)
- **Roubar:** tech pills inline; timeline com logos; cards de projeto com status; serif p/ títulos.

### 8. x.ai · [x.ai](https://x.ai) — *empresa IA* — 🟡 média
- **Fundo** `#0a0a0a` · grotesca custom · **monocromático** (sem acento) · **botões pill brancos**
- **Roubar:** prova de que dá p/ ser forte SEM acento (opção mais radical do seu brief).

### 9. SaaS Pro · [saaspro.framer.ai](https://saaspro.framer.ai) — *template SaaS* — 🟡 média
- **Fundo** `#101010` · **Inter 500** em toda hierarquia · **acento** 🟠 `#ff5024` · botões com **sombra sutil**
- **Roubar:** 1 cor quente com disciplina; hierarquia por tamanho (mesmo peso).

### 10. Reflect · [reflect.app](https://reflect.app) — *app notas IA* — 🟢 alta
- **Fundo** `#030014` (tint índigo) · **Aeonik Pro** + Inter · **acento** 🟣 `#6d48ff`
- **Hero centralizado** + **pill de anúncio** ("✦ New…") + **glow radial + órbitas** atrás do título
- **Roubar:** pill de anúncio; glow+órbitas da cor de acento; tingir o preto com traço da cor principal.

### 11. Crontap · [crontap.com](https://crontap.com) — *cron / monitoramento* — 🟢 alta (cara de SOC!)
- **Fundo** `#0a0a0a` + glow verde · **Manrope**+**Inter** · **acento** 🟡 `#faff00`
- **CARDS DE MONITORAMENTO:** badge de método (POST/GET) + endpoint mono + status (RUNNING/HEALTHY) + timer amarelo mono · **toggle light/dark**
- **Roubar:** cards de status → **cards de incidente/alerta de SOC** (severidade+status+timestamp mono); eyebrow mono com barra de acento; avatar stack de prova social.

---

## 🔎 Padrões que se repetem

- **Fundo:** sempre dark; de preto puro a quase-preto quente ou com tint da cor de acento. **Nunca preto chapado** — quase todos têm **grid sutil e/ou glow radial**.
- **Tipografia:** **Inter** domina o corpo. Títulos: Inter (tracking −1.5 a −3px), **Manrope**, ou display custom (Geologica, AeonikPro). Serif (Reckless) = ar editorial.
- **Acento:** quase todos usam **UMA cor só**. Secundárias aparecem **apenas como badges de status** — exatamente o seu brief.
- **Botões:** pill total (999px) **ou** radius 4–12px; sólido no acento ou branco invertido. Sombra é rara.

## ✅ Recomendação para o seu portfólio

| Fonte | O que trazer |
|---|---|
| **Zento** | Estrutura **bento-grid**; card de perfil + stats + tech-arsenal |
| **Mohit Singh** | **Tech pills inline**; **timeline** de experiência com logos; cards de projeto |
| **Crontap** | **Cards de status estilo SOC** (incidente/alerta com severidade + mono) |
| **Daytona / Portline** | **Bloco de código/terminal** no hero; acento verde de status |
| **Reflect / Cobalt** | Pill de anúncio; **glow radial** + fundo com tint; **texto em gradiente** nos títulos |
| **Spellar / Crontap** | **Toggle light/dark** |

**Direção sugerida:** dark quase-preto quente + **1 acento (verde-terminal `#30d158` ou ciano)** + Inter/Manrope + fundo com grid/glow sutil. Cores secundárias só em badges de severidade (verde/âmbar/vermelho), reforçando a linguagem de SOC.

---

## 📎 Anexo — prompts de recriação (enriquecimento)

Pablo forneceu prompts de recriação **pixel-perfect** para os 3 primeiros (Portline, Daytona, Supabase). O texto é **idêntico** nos três — muda só o screenshot de origem. Guardados em [`design-references.json`](design-references.json) → `recreationPrompts` (resumo + texto completo + as 3 URLs de origem). Método: orquestrador Next.js+Bun com **sub-agentes paralelos** (1 seção = 1 arquivo), tokens extraídos com `sharp`, verificação por Playwright + eyeball-diff.
