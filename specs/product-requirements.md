# PRD — Portfólio de Pablo Galerani

## 1. Objetivo

Vitrine profissional de um analista de segurança (SOC) que transmita, em uma única página:
**competência técnica em segurança**, **rigor/cuidado** (o próprio site como caso-modelo de
engenharia segura) e **modernidade minimalista**. O site substitui o site legado
(`legacy/`) e será publicado em `https://pablodlz.github.io/portfolio/`.

## 2. Público-alvo

1. **Recrutadores/RH de segurança** — escaneiam em <60s: cargo atual, certificações, experiência. Precisam de CTAs claros (LinkedIn, e-mail, currículo).
2. **Gestores de SOC / líderes técnicos** — avaliam profundidade: ferramentas (SIEM), playbooks, pesquisa, palestras. Olham o código-fonte do site.
3. **Peers da comunidade de segurança** — chegam por posts do LinkedIn/palestras; procuram publicações e projetos.

## 3. Escopo

- One-page (index) em PT-BR com 10 seções (ver `sections/`), responsiva de 320px a ultrawide.
- Dark por padrão + toggle light persistente.
- Conteúdo 100% derivado de `data/linkedin.json`, validado em build.
- Postura de segurança verificável (`security.md`), incluindo `security.txt` e `SECURITY.md`.
- CI/CD com GitHub Actions → GitHub Pages.

### Não-escopo (agora)

- Versão EN (arquitetura fica pronta p/ i18n; strings de UI centralizadas — mas só PT-BR é construída).
- Formulário de contato com backend/terceiros (usa `mailto:`).
- Analytics de qualquer tipo.
- Blog/CMS; páginas além da one-page (exceto 404).
- Download de "Currículo/Résumé" em PDF — **TODO**: não há PDF de currículo curado no repo (`Nova pasta/Profile.pdf` é export bruto do LinkedIn, não curado). O CTA "Currículo" fica fora até o Pablo fornecer/aprovar um PDF. Perguntar ao Pablo.

## 4. Requisitos (formato EARS)

### Funcionais — conteúdo e navegação

- **REQ-F01** — Quando a página carrega, o sistema deve renderizar todas as seções na ordem: Hero, Sobre, Skills, Experiência, Formação, Projetos & Pesquisa, Certificações, Publicações, Contato, Footer.
- **REQ-F02** — Quando o build executa, o sistema deve validar `data/linkedin.json` contra os schemas Zod e **falhar o build** se houver divergência.
- **REQ-F03** — Quando o usuário clica em um item da navegação, o sistema deve rolar suavemente até a seção correspondente (âncora), exceto se `prefers-reduced-motion`.
- **REQ-F04** — Quando o usuário clica em um card de publicação, o sistema deve abrir o `permalink` do LinkedIn em nova aba com `rel="noopener noreferrer"`.
- **REQ-F05** — Quando o usuário clica em uma miniatura de certificado, o sistema deve abrir um lightbox acessível (foco preso, `Esc` fecha) com a imagem ampliada; certificados `lowRes: true` não devem ser ampliados além do tamanho nativo aproximado.
- **REQ-F06** — Quando o usuário seleciona um filtro de emissor na galeria de certificações, o sistema deve exibir apenas os certificados daquele emissor, sem recarregar a página.
- **REQ-F07** — Quando o usuário aciona o CTA de e-mail, o sistema deve montar o `mailto:` via script acessível (endereço não presente como texto puro contíguo no HTML).
- **REQ-F08** — Quando um item de experiência tem `current: true`, o sistema deve exibir badge de status "atual" (token `--ok`).
- **REQ-F09** — Quando um item de experiência tem mais de 4 bullets, o sistema deve colapsá-los com controle expand/collapse acessível (`<details>` ou botão com `aria-expanded`).

### Funcionais — tema e preferências

- **REQ-F10** — Quando o usuário visita pela primeira vez, o sistema deve aplicar o tema **dark**.
- **REQ-F11** — Quando o usuário alterna o tema, o sistema deve persistir a escolha em `localStorage` e aplicá-la antes do primeiro paint nas visitas seguintes (zero flash).
- **REQ-F12** — Quando `prefers-reduced-motion: reduce` está ativo, o sistema deve desativar todas as animações não essenciais (entradas, cursor piscante, hovers com movimento).

### Não-funcionais

- **REQ-N01** — O site deve ser 100% estático: nenhum fetch em runtime, nenhum recurso de origem externa (fontes, scripts, imagens, ícones).
- **REQ-N02** — O build deve sair com `base: '/portfolio'` e `site: 'https://pablodlz.github.io'`, com todos os assets respeitando o base path.
- **REQ-N03** — Lighthouse ≥ 100/100/100/100 (Performance, A11y, Best Practices, SEO) em mobile e desktop; CLS = 0.
- **REQ-N04** — Conformidade WCAG 2.2 AA (contraste, foco visível, teclado, landmarks, alt).
- **REQ-N05** — CSP via `<meta>` sem `unsafe-inline`/`unsafe-eval`, conforme `security.md`.
- **REQ-N06** — Peso: JS enviado ao cliente ≤ 15KB gzip (tema + lightbox + filtro + reveal); sem framework JS de runtime.
- **REQ-N07** — `sitemap.xml`, `robots.txt`, OG image própria, favicon multi-tamanho, web manifest, canonical, `lang="pt-BR"`.
- **REQ-N08** — `security.txt` (RFC 9116) em `/.well-known/` e `/`, e `SECURITY.md` no repo.

## 5. User stories (critérios de aceite)

- **US-01 (Recrutadora)** — "Como recrutadora, quero ver em 10 segundos quem é, cargo atual e como contatar." ✔ Hero mostra nome, headline, empresa, CTAs Contato/LinkedIn/GitHub acima da dobra em mobile 375px.
- **US-02 (Gestor de SOC)** — "Como gestor, quero validar experiência real de SOC." ✔ Card Clavis marcado 'atual', com bullets de SIEM/triagem/playbooks expandíveis; skills agrupadas por domínio (SOC, AppSec, Ofensiva, Frameworks).
- **US-03 (Peer)** — "Como peer, quero achar a pesquisa de ML/ransomware e as palestras de SSDLC." ✔ Seção Projetos & Pesquisa com 2 cards, contribuidores e links para as publicações relacionadas.
- **US-04 (Recrutadora)** — "Como recrutadora, quero evidência das 24+ certificações." ✔ Galeria com contadores ("44 documentos · 30+ certificações"), filtro por emissor, lightbox, badges de verificação (`verifyUrl`) nos 8 antigos.
- **US-05 (Qualquer)** — "Como visitante com fotofobia, quero tema claro." ✔ Toggle na nav, persistente, AA nos dois temas.
- **US-06 (Auditor curioso)** — "Como profissional de segurança, quero inspecionar a postura do site." ✔ CSP restritiva visível no fonte, security.txt acessível, footer linka o repositório e o SECURITY.md.

## 6. Metas de sucesso

- Lighthouse 4×100 (mobile e desktop) — verificado em CI (meta) e manualmente no QA.
- 0 recursos externos no painel Network do DevTools.
- `npm audit` sem high/critical no CI.
- Todas as checkboxes de `security.md` e `tasks.md` marcadas antes do deploy.
