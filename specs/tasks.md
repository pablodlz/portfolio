# tasks.md — plano de implementação faseado

Cada task rastreia um requisito (REQ-*) do PRD ou um spec. Marcar `[x]` só com o
critério verificado. Ordem: foundation → tokens → shell → primitivos → seções →
segurança → QA → CI/CD.

> Status: **concluído em 07/jul/2026** (sessão autônoma). Pendências de conteúdo
> permanecem como TODO-C1/C2 no content-model (dependem do Pablo).

## Fase 2 — Fundação

- [x] T2.1 Scaffold Astro + TS strict; `astro.config.mjs` com `site`/`base '/portfolio'` (REQ-N02, ADR-0001/0005) — *Astro 7.0.6 (upgrade de 5.x por advisories de XSS)*
- [x] T2.2 `.gitignore` (node_modules, dist, .astro, .env*, `Nova pasta/` c/ PII bruta)
- [x] T2.3 `src/lib/schema.ts` + `src/lib/data.ts` com Zod parse + validações cruzadas (REQ-F02, ADR-0004)
- [x] T2.4 `src/styles/tokens.css` + `global.css` (@layer, reset, grid/glow, reveal)
- [x] T2.5 Fontes self-hosted @fontsource-variable + preload de Inter/Space Grotesk
- [x] T2.6 `BaseLayout.astro`: head SEO completo, CSP via `security.csp` (hashes), theme-init inline hasheado (REQ-F10/F11, REQ-N05/N07)
- [x] T2.7 Primitivos ui/: Icon, Button, Badge, Tag, Card, SectionHeading, Terminal, ThemeToggle
- [x] T2.8 Shell: Nav (sticky, dropdown `<details>` mobile, skip-link) + Footer
- [x] T2.9 `src/scripts/app.ts`: reveal IO + tema + mailto + filtro + lightbox — bundle único, sem libs (REQ-N06)
- [x] T2.10 Preview local sem erros/violações de console (verificado: 0 logs)

## Fase 3 — Seções

- [x] T3.1 Hero + easter egg terminal — *h1/subtítulo sem reveal (são o LCP)*
- [x] T3.2 Sobre + card de perfil + 2 recomendações
- [x] T3.3 Skills bento (4 domínios + status card ilustrativo aria-hidden)
- [x] T3.4 Experiência timeline + `<details>` expand (REQ-F08/F09)
- [x] T3.5 Formação (2 destaques + 4 compactos) + radar de certificações
- [x] T3.6 Projetos & Pesquisa (stat −41,96% extraída do texto do JSON)
- [x] T3.7 Certificações: 3 stats, filtro por emissor (13 grupos), grid 44, lightbox `<dialog>` c/ lowRes, 8 verificáveis (REQ-F05/F06)
- [x] T3.8 Publicações: 4 featured + 7 grid, capas locais, permalink noopener (REQ-F04)
- [x] T3.9 Contato com mailto ofuscado + noscript (REQ-F07)
- [x] T3.10 404.astro (terminal curl 404)

## Fase 4 — Segurança (security.md §2)

- [x] T4.1 CSP meta sem unsafe-*; hashes de script E style validados no dist; **zero atributos `style=""`** (stagger via `[data-ri]`); `frame-ancestors` removida da meta (browsers ignoram — documentado)
- [x] T4.2 Greps: 0 hex fora de tokens; `set:html` só no theme-init estático (não é dado); 0 URL externa como recurso
- [x] T4.3 `security.txt` nas duas rotas (RFC 9116, Expires 2027-07-07)
- [x] T4.4 `SECURITY.md` (política de disclosure)
- [x] T4.5 `.github/dependabot.yml` (npm + actions, weekly)
- [x] T4.6 `npm audit`: **0 vulnerabilidades** (após upgrade Astro 7)
- [x] T4.7 PII revisada: diploma Acadi-TI com CPF/CNH tarjados; licert-36 ilegível em 160px (lowRes trava o zoom); demais ok

## Fase 5 — QA

- [x] T5.1 `astro check` 0 erros; build limpo; validação Zod ativa (literais e regex nos schemas)
- [x] T5.2 Dark/light AA: `--text-3` recalibrado (dark #8a8378, light #6d675e — ≥4.5:1 na pior superfície); toggle persiste; zero flash (script no head)
- [x] T5.3 Responsivo 375/1280 verificados no preview; container 72rem p/ ultrawide; overflow-x: 0 (glow clipado)
- [x] T5.4 prefers-reduced-motion: media query global + guard no JS (IO revela tudo imediatamente)
- [x] T5.5 Teclado: foco visível global, lightbox `<dialog>` nativo (foco preso, Esc), `<details>` nativos
- [x] T5.6 Zero request externo (verificado no dist e no console); imagens com width/height; CLS = 0
- [x] T5.7 31 links externos, todos `noopener noreferrer`; âncoras ok com base path
- [x] T5.8 Lighthouse **desktop 100/100/100/100**; mobile **99/100/100/100** — delta de 1
      ponto: LCP (hero-sub) é re-registrado no repaint do font-swap do Inter sob slow-4G
      simulado; fontes já são self-hosted + preloaded. Alternativa (`font-display:
      optional`) renderizaria a 1ª visita em fonte de sistema — identidade > 1 ponto
      sintético. CLS 0, TBT 0 nos dois.

## Fase 6 — CI/CD e docs

- [x] T6.1 `.github/workflows/deploy.yml`: ci → audit(high) → check → build → Pages
- [x] T6.2 robots.txt, sitemap.xml estático, OG image própria (gerada por scripts/generate-assets.mjs), favicon SVG+PNGs, manifest
- [x] T6.3 `README.md` completo (arquitetura, execução, deploy, segurança + limitações Pages)
- [x] T6.4 Commits por fase; **push aguardando o Pablo**
