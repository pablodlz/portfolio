# tasks.md — plano de implementação faseado

Cada task rastreia um requisito (REQ-*) do PRD ou um spec. Marcar `[x]` só com o
critério verificado. Ordem: foundation → tokens → shell → primitivos → seções →
segurança → QA → CI/CD.

## Fase 2 — Fundação

- [ ] T2.1 Scaffold Astro 5 + TS strict; `astro.config.mjs` com `site`/`base '/portfolio'` (REQ-N02, ADR-0001/0005)
- [ ] T2.2 `.gitignore` (node_modules, dist, .astro, .env*) (security.md)
- [ ] T2.3 `src/lib/schema.ts` + `src/lib/data.ts` com Zod parse + validações cruzadas (REQ-F02, ADR-0004)
- [ ] T2.4 `src/styles/tokens.css` + `global.css` (@layer, reset, grid/glow, reveal) (design-system.md)
- [ ] T2.5 Fontes self-hosted @fontsource-variable (Inter, Space Grotesk, JetBrains Mono) + preload (REQ-N01)
- [ ] T2.6 `BaseLayout.astro`: head SEO completo, meta CSP, theme-init inline hasheado, color-scheme (REQ-F10/F11, REQ-N05/N07)
- [ ] T2.7 Primitivos ui/: Icon, Button, Badge, Tag, Card, SectionHeading, Terminal, ThemeToggle
- [ ] T2.8 Shell: Nav (sticky, dropdown mobile nativo, skip-link) + Footer (sections/10)
- [ ] T2.9 `src/scripts/app.ts`: reveal IO + tema + mailto + (stubs lightbox/filtro) ≤ orçamento REQ-N06
- [ ] T2.10 Preview local rodando sem erros/violações de console

## Fase 3 — Seções (cada uma: responsiva + acessível antes da próxima)

- [ ] T3.1 Hero + easter egg terminal (sections/01, REQ-F01)
- [ ] T3.2 Sobre + card de perfil + recomendações (sections/02)
- [ ] T3.3 Skills bento (sections/03)
- [ ] T3.4 Experiência timeline + details expand (sections/04, REQ-F08/F09)
- [ ] T3.5 Formação + radar de certificações (sections/05)
- [ ] T3.6 Projetos & Pesquisa (sections/06)
- [ ] T3.7 Certificações: stats, filtro, grid, lightbox, verificáveis (sections/07, REQ-F05/F06)
- [ ] T3.8 Publicações (sections/08, REQ-F04)
- [ ] T3.9 Contato com mailto ofuscado (sections/09, REQ-F07)
- [ ] T3.10 404.astro mínima no mesmo layout

## Fase 4 — Segurança (security.md §2)

- [ ] T4.1 CSP meta sem unsafe-*, hashes de inline validados no dist
- [ ] T4.2 Grep: zero hex fora de tokens, zero set:html com dado, zero URL externa em src/
- [ ] T4.3 `public/.well-known/security.txt` + `/security.txt` (RFC 9116)
- [ ] T4.4 `SECURITY.md` (política de disclosure)
- [ ] T4.5 `.github/dependabot.yml` (npm + actions, weekly)
- [ ] T4.6 `npm audit --audit-level=high` limpo
- [ ] T4.7 Revisão de PII nas 52 imagens de certificado

## Fase 5 — QA (REQ-N03/N04)

- [ ] T5.1 `astro check` + build limpos; validação Zod exercitada (teste com dado quebrado)
- [ ] T5.2 Dark/light: contraste AA nos dois; toggle persiste; zero flash
- [ ] T5.3 Responsivo 320/375/768/1024/1440/ultrawide; sem scroll horizontal
- [ ] T5.4 prefers-reduced-motion: animações desligadas
- [ ] T5.5 Teclado: tab por toda a página, foco visível, lightbox prende foco, Esc fecha
- [ ] T5.6 Network: zero request externo; imagens otimizadas com width/height (CLS 0)
- [ ] T5.7 Links externos todos noopener noreferrer; âncoras funcionam com base path
- [ ] T5.8 Lighthouse mobile+desktop ≥ 100×4 (ou justificar delta em spec)

## Fase 6 — CI/CD e docs

- [ ] T6.1 `.github/workflows/deploy.yml`: ci → audit → check → build → Pages (ADR-0005)
- [ ] T6.2 `robots.txt`, `sitemap` (@astrojs/sitemap ou estático), OG image própria, favicons, manifest (REQ-N07)
- [ ] T6.3 `README.md`: arquitetura, como rodar, deploy, postura de segurança + limitações Pages
- [ ] T6.4 Commits organizados por fase; push só quando o Pablo mandar
