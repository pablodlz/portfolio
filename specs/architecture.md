# Arquitetura — ADRs e estrutura

## ADR-0001 — Stack: Astro 5 + TypeScript strict

**Status:** aceito · **Data:** 2026-07-07

**Contexto.** Site 100% estático para GitHub Pages; persona de segurança exige superfície
mínima de ataque e de dependências; brief pede minimalismo + animações pontuais.

**Decisão.** **Astro (5.x, última estável) + TypeScript `strict`**. Zero JS por padrão
(HTML puro no output), tipagem de dados via Zod embutido (`astro/zod`), otimização de
imagens nativa (`astro:assets` + sharp), suporte nativo a CSP experimental com hashes,
build estático trivial para Pages.

**Alternativas.** Eleventy (ótimo estático, mas sem tipagem de dados integrada nem
pipeline de imagem/CSP nativos); Next.js export (superfície e JS de runtime muito
maiores); HTML artesanal (sem validação de schema nem otimização de imagem).

**Consequências.** Dependências: `astro`, `sharp`, `@fontsource-variable/*`,
`@astrojs/check` + `typescript` (dev). Nenhum framework de UI (React/Vue/etc.).

## ADR-0002 — Estilos: CSS puro com custom properties + @layer (sem Tailwind)

**Status:** aceito

**Decisão.** CSS moderno vanilla: um arquivo de tokens (`src/styles/tokens.css`) com
custom properties (temas dark/light via `[data-theme]`), `@layer reset, tokens, base,
components, utilities`, estilos de componente **scoped** nos `.astro`. **Sem Tailwind**:
para uma one-page com design system próprio, tokens + scoped CSS ficam menores e com
zero dependência extra (argumento de segurança do brief).

**Consequências.** Nomes de classe semânticos; utilitários mínimos criados à mão
(`.container`, `.eyebrow`, `.visually-hidden`).

## ADR-0003 — Animações: CSS + IntersectionObserver próprio (sem lib)

**Status:** aceito

**Decisão.** Animações de entrada com classes CSS + um script vanilla de ~30 linhas
(IntersectionObserver, `once: true`, stagger via `--reveal-index`). Micro-interações em
CSS puro (hover, cursor piscante). **Sem Motion One/GSAP/Framer** — o design pede
entradas sutis, não timeline complexa; cada dep a menos é superfície a menos.
View Transitions da navegação não se aplicam (one-page única); `@view-transition` fica
documentado como caminho futuro para i18n/páginas extras.
`prefers-reduced-motion` desliga tudo (media query no CSS + guarda no script).

## ADR-0004 — Dados: `data/linkedin.json` como fonte única, validado por Zod em build

**Status:** aceito

**Decisão.** `data/linkedin.json` **permanece na raiz** (fonte curada, preservada). O
código importa via módulo tipado `src/lib/data.ts`, que:
1. importa o JSON (resolvido em build; zero fetch em runtime);
2. faz `parse` com os schemas Zod de `src/lib/schema.ts` (espelho de `content-model.md`);
3. exporta objetos tipados congelados para as seções.

`parse` (não `safeParse`): dado inválido **quebra o build** (REQ-F02). Imagens de
`img/` são importadas via `import.meta.glob` — os originais são a única cópia; o build
gera as versões otimizadas. Content collections formais não são necessárias (um único
documento JSON, não uma coleção de entradas homogêneas).

## ADR-0005 — Deploy: GitHub Actions → GitHub Pages (project page)

**Status:** aceito

**Decisão.** Workflow `deploy.yml`: `npm ci` → `npm audit --audit-level=high` →
`astro check` (typecheck) → `astro build` (valida schema + CSP) → artifact →
`actions/deploy-pages`. Pages configurado para "GitHub Actions" (não branch).
`astro.config.mjs` centraliza `site`/`base` em constantes comentadas no topo para troca
fácil (domínio próprio futuro ⇒ `base: '/'` + CNAME).

## ADR-0006 — Ícones: SVG inline próprio (sem pacote de ícones)

**Status:** aceito

**Decisão.** Componente `Icon.astro` com paths SVG embutidos (subset desenhado à mão a
partir de referências open-source estilo Lucide, traço 2px, 24×24). ~15 ícones usados.
Sem `astro-icon`/`@iconify` (evita dep + JSON gigante de glifos). Novos ícones = editar
um único arquivo, rastreável em code review.

## Árvore de pastas (alvo)

```
portfolio/
├─ specs/                      # esta pasta — fonte da verdade
├─ design-system/              # MASTER.md conciliado + saída bruta da skill
├─ data/                       # linkedin.json + design-references (PRESERVADO, raiz)
├─ img/                        # originais de imagem (PRESERVADO, raiz)
├─ legacy/                     # site antigo (histórico)
├─ src/
│  ├─ lib/                     # schema.ts (Zod), data.ts, dates.ts, certs.ts
│  ├─ styles/                  # tokens.css, global.css
│  ├─ components/
│  │  ├─ ui/                   # Icon, Button, Badge, Tag, Card, SectionHeading, ThemeToggle, Terminal
│  │  └─ sections/             # Hero, About, Skills, Experience, Education, Projects,
│  │                           #   Certifications, Publications, Contact, Footer + Nav
│  ├─ layouts/BaseLayout.astro # head, CSP meta, SEO, fontes, scripts globais
│  ├─ scripts/                 # theme-init (inline hasheado), app.ts (reveal/lightbox/filtro/mailto)
│  └─ pages/
│     ├─ index.astro
│     └─ 404.astro
├─ public/
│  ├─ .well-known/security.txt
│  ├─ security.txt
│  ├─ robots.txt               # sitemap apontando p/ base
│  ├─ og.png · favicon.svg · favicon-96.png · apple-touch-icon.png · icon-192/512.png
│  └─ site.webmanifest
├─ .github/workflows/deploy.yml · .github/dependabot.yml
├─ astro.config.mjs · tsconfig.json · package.json · package-lock.json
├─ SECURITY.md · README.md · PORTFOLIO_BUILD_PROMPT.md
```

## Fluxo de build

```
data/linkedin.json ──▶ src/lib/data.ts (Zod parse: falha = build quebra)
img/** ──▶ import.meta.glob ──▶ astro:assets (sharp) ──▶ /portfolio/_astro/*.webp
src/styles/tokens.css ──▶ global.css ──▶ inline crítico hasheado (CSP)
src/scripts/app.ts ──▶ bundle único ~apenas: tema já aplicado + reveal + lightbox + filtro + mailto
astro build ──▶ dist/ (HTML + assets com base /portfolio) ──▶ GitHub Pages
```

## Orçamento de dependências (runtime + build)

| Pacote | Papel | Justificativa |
|---|---|---|
| `astro` | framework de build | ADR-0001 |
| `sharp` | otimização de imagem | requerido por astro:assets |
| `@fontsource-variable/inter`, `.../space-grotesk`, `.../jetbrains-mono` | fontes self-hosted | ADR de fontes no design system |
| `@astrojs/check` + `typescript` (dev) | typecheck no CI | qualidade |

Qualquer dependência nova exige novo ADR aqui.
