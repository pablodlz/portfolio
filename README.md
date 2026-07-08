# pablodlz.github.io/portfolio

Portfólio profissional de **Pablo de Souza Galerani** — SOC Analyst @ Clavis Segurança
da Informação. Site 100% estático, **security-first**, construído com metodologia
**spec-driven**: o código deriva dos documentos em [`specs/`](specs/README.md).

**Ao vivo:** https://pablodlz.github.io/portfolio/

## Stack

- [Astro 7](https://astro.build) + TypeScript `strict` — zero JS de framework em runtime
- CSS puro com design tokens ([`src/styles/tokens.css`](src/styles/tokens.css)) e `@layer`
- Conteúdo 100% derivado de [`data/linkedin.json`](data/linkedin.json), validado com
  **Zod em build** (dado inválido = build quebra)
- Fontes auto-hospedadas (`@fontsource-variable`: Inter, Space Grotesk, JetBrains Mono)
- Imagens otimizadas por `astro:assets`/sharp a partir dos originais em `img/`

## Como rodar

```bash
npm ci          # instala com lockfile estrito
npm run dev     # dev server em http://localhost:4321/portfolio/
npm run build   # gera dist/ (valida schema + CSP)
npm run preview # serve o dist/ localmente
npm run check   # typecheck (astro check)
```

Requer Node 20+. Os assets estáticos de identidade (OG image, favicons PNG) são gerados
por `node scripts/generate-assets.mjs` e commitados em `public/`.

## Deploy

GitHub Actions ([`deploy.yml`](.github/workflows/deploy.yml)):
`npm ci` → `npm audit --audit-level=high` (**gate**: falha em high/critical) →
`astro check` → `astro build` → GitHub Pages (configure Pages como *Source: GitHub Actions*).

O site é uma *project page*, então o build usa `site: 'https://pablodlz.github.io'` e
`base: '/portfolio'` — as duas constantes no topo de
[`astro.config.mjs`](astro.config.mjs). Para migrar para domínio próprio: troque-as
(`base: '/'`) e adicione o CNAME.

## Postura de segurança

Detalhes completos e threat model (STRIDE) em [`specs/security.md`](specs/security.md);
política de disclosure em [`SECURITY.md`](SECURITY.md).

- **CSP restrita via `<meta>`**, gerada pelo Astro com hash SHA-256 de cada script/estilo
  inline — sem `unsafe-inline`/`unsafe-eval`. `default-src 'self'`.
- **Zero recursos de terceiros**: sem CDN, sem Google Fonts, sem analytics, sem trackers,
  sem fetch em runtime. As capas de posts do LinkedIn são cópias locais (não hotlink).
- **Dados nunca viram HTML**: todo conteúdo do JSON é renderizado como texto escapado.
- **E-mail ofuscado** (montado por JS acessível; fallback `<noscript>`).
- **Cadeia de suprimentos**: lockfile commitado, `npm audit` como gate de CI,
  Dependabot semanal (npm + actions), superfície mínima de dependências (ADRs).
- **`security.txt`** (RFC 9116) em [`/.well-known/security.txt`](public/.well-known/security.txt) e `/security.txt`.

### Limitações honestas do GitHub Pages

O Pages **não permite headers HTTP customizados**. Consequências reais:

- `frame-ancestors` em `<meta>` **é ignorado** pelos browsers → proteção efetiva contra
  clickjacking exigiria header (`X-Frame-Options`/CSP de servidor).
- Sem `Strict-Transport-Security`, `X-Content-Type-Options` ou `Referrer-Policy` de
  servidor (usamos `<meta name="referrer">`, que os browsers respeitam).
- Mitigação possível no futuro: um CDN na frente (ex.: Cloudflare) para headers reais.

## Estrutura

```
specs/           ← fonte da verdade (PRD, ADRs, content model, security, seções)
design-system/   ← tokens conciliados (brief > referências > skill ui-ux-pro-max)
data/            ← linkedin.json (conteúdo) + design-references (direção visual)
img/             ← originais: foto, 44+8 certificados, 11 capas de posts
src/             ← código Astro (lib tipada, ui primitives, seções, estilos, scripts)
legacy/          ← site antigo (histórico; não é insumo)
```

## Licença / conteúdo

Código aberto para auditoria. Textos, imagens e certificados são pessoais — não
reutilizar sem autorização.
