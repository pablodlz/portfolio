# Build Prompt — Portfólio profissional de Pablo de Souza Galerani (SOC Analyst)

> **Como usar:** cole este documento inteiro como primeira mensagem em uma sessão nova do Claude Code, com o working directory = raiz deste repositório. Ele é a especificação-mãe. Siga o fluxo **spec-driven** descrito na Seção 4: **não escreva código de produção antes de os specs estarem escritos e aprovados.**

---

## 1. Papel e missão

Você é um(a) engenheiro(a) de front-end sênior + designer de produto, construindo do zero o portfólio profissional de **Pablo de Souza Galerani** — **SOC Analyst @ Clavis**, com pós-graduação em Cibersegurança Ofensiva, pesquisa acadêmica publicada, palestrante e 24+ certificações.

O site precisa transmitir três coisas ao mesmo tempo: **competência técnica em segurança**, **cuidado/rigor** (o próprio site deve ser um exemplo de engenharia segura e bem-feita) e **modernidade minimalista**. É a vitrine de um profissional de segurança — então ele será julgado pela qualidade e pela segurança do próprio código.

**Não-negociáveis:**
1. **Spec-driven:** os specs em `specs/` são a fonte da verdade. Código é derivado dos specs, não o contrário.
2. **Security-first:** o site deve ser um caso-modelo de front-end seguro (Seção 7).
3. **Estático e hospedável no GitHub Pages** (sem backend, sem runtime de servidor).
4. **Minimalista + animado + moderno**, guiado pelas referências que já coletamos.
5. **Profissional e organizado:** arquitetura limpa, tipada, testável, documentada.

---

## 2. Insumos já disponíveis no repositório (use-os, não invente conteúdo)

| Arquivo | Conteúdo |
|---|---|
| `data/linkedin.json` | **Fonte de conteúdo.** Perfil completo: `profile`, `about` (com easter egg base64 estilo terminal), `experience` (7), `education` (6), `certifications` (30 itens + `downloadedDocuments` = manifesto dos 44 arquivos), `projects`, `speaking`, `courses`, `recommendationsReceived`, e **`publications`** (11 posts com `permalink`, `date`, `title`, `description`, `category`, `engagement`). |
| `data/design-references.json` | **Direção de design.** 11 sites de referência com cores/fontes/raios reais + "o que roubar" de cada, `designBrief` (preferências) e `synthesis` (recomendação). |
| `data/design-references.md` | Versão legível do acima. |
| `data/design-references/shots/` | Prints oficiais de 3 referências (Portline, Daytona, Supabase). |
| `img/image.jpeg` | Foto de perfil. |
| `img/certificados/linkedin/licert-01..44.*` | 44 imagens de certificado (manifesto + títulos + flag `lowRes` em `linkedin.json > certifications.downloadedDocuments`). |
| `img/certificados/1..8.png` | 8 certificados antigos, com `verifyUrl` em `linkedin.json > certificateImagesInRepo`. |

**Regra de conteúdo:** todo texto vem do `linkedin.json`. Não invente cargos, datas, números ou certificações. Se algo faltar, marque como TODO no spec e pergunte — não preencha com placeholder.

### Brief de design (já definido pelo Pablo)
- **Dark por padrão**, com **toggle Light** funcional e persistente.
- **UMA cor de acento principal.** Secundárias só **discretas**, para status/seções — nada colorido.
- Acento sugerido: **verde-terminal `#30d158`** ou **ciano/azul** (validar na fase de design). Cores de status (verde/âmbar/vermelho) permitidas **apenas** em badges de severidade — reforça a linguagem de SOC.
- Referências estruturais mais fortes: **Zento** (bento-grid de portfólio), **Mohit Singh** (editorial/timeline/tech-pills inline), **Crontap** (cards de status estilo SOC), **Portline/Daytona** (terminal/código no hero), **Reflect/Cobalt** (glow radial + texto em gradiente).

---

## 3. Restrições de plataforma (GitHub Pages)

- **Saída 100% estática.** Sem SSR, sem API routes, sem funções serverless, sem banco.
- **Project page:** o deploy atual é `https://pablodlz.github.io/portfolio/`. Portanto o build precisa de **`base: '/portfolio'`** e `site: 'https://pablodlz.github.io'`. Documente isto e deixe fácil de trocar caso o Pablo migre para domínio próprio ou user page.
- Todos os caminhos de asset devem respeitar o `base` (use os helpers do framework, nunca caminhos absolutos hardcoded).
- GitHub Pages **não permite configurar headers HTTP**. Consequência: parte da postura de segurança tem de vir de `<meta>` + design (Seção 7), e você deve **documentar honestamente** o que só seria possível com um CDN na frente (ex.: Cloudflare para HSTS/X-Frame-Options reais). Não finja que headers de servidor estão ativos.

---

## 4. Metodologia: Spec-Driven Development (SDD)

Trabalhe em fases. **Pare para revisão ao fim da Fase 1** e aguarde "aprovado" antes de escrever código de produção.

### Fase 0 — Descoberta e inteligência de design
1. Leia integralmente `data/linkedin.json`, `data/design-references.json` e `.md`. Faça um inventário de conteúdo e de padrões visuais.
2. **Instale e use a skill `ui-ux-pro-max`:**
   ```bash
   npm install -g ui-ux-pro-max-cli
   uipro init --ai claude
   ```
   (ou via marketplace: `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` → `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`). Requer Python 3.
3. Gere e **persista** um design system usando a skill, com o contexto "developer / cybersecurity portfolio, dark, single accent, minimalist, animated". Ex.:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
     "cybersecurity SOC developer portfolio dark minimalist" \
     --design-system --persist -p "Pablo Galerani Portfolio"
   ```
   Isso cria `design-system/MASTER.md` (+ pages). **Concilie** a saída da skill com nosso `design-references.json` e com o brief do Pablo — o brief e as nossas referências têm prioridade quando houver conflito (ex.: manter UMA cor de acento mesmo que a skill sugira mais).

### Fase 1 — Autoria dos specs (fonte da verdade) — **PARE E PEÇA REVISÃO AO FIM**
Crie a pasta `specs/` com estes documentos (formato claro, versionados, "living docs"):

- `specs/README.md` — índice + explicação da metodologia SDD adotada.
- `specs/product-requirements.md` — PRD: objetivo, público-alvo (recrutadores de segurança, gestores de SOC, peers), escopo, não-escopo, e **requisitos em formato EARS** ("Quando \<gatilho\>, o sistema deve \<resposta\>") + user stories com critérios de aceite. Inclua metas de sucesso (ex.: Lighthouse 100, WCAG 2.2 AA).
- `specs/architecture.md` — decisões de arquitetura como **ADRs numerados** (ADR-0001 stack, ADR-0002 estilos/CSS, ADR-0003 animações, ADR-0004 estratégia de dados, ADR-0005 deploy). Árvore de pastas, fluxo de dados, estratégia de build/deploy. Ver stack mandatória na Seção 5.
- `specs/content-model.md` — schemas TypeScript/Zod para os dados de `linkedin.json`, e o mapeamento seção→dados (Seção 6). Defina validação em build (falha o build se o dado não bate com o schema).
- `specs/design-system.md` — tokens finais (cores light/dark, escala tipográfica, espaçamento, raios, sombras, motion), derivados de `design-system/MASTER.md` + nossas referências + brief. Um único arquivo de tokens será a fonte no código.
- `specs/security.md` — **threat model** curto (STRIDE aplicado a um site estático: XSS via dados, dependências, supply chain, clickjacking, info leak) + a lista de controles da Seção 7 + checklist verificável.
- `specs/sections/*.md` — um spec curto por seção (hero, about, skills, experience, education, projects, certifications, publications, contact, footer): propósito, conteúdo (origem no JSON), layout, estados, animações, acessibilidade.
- `specs/tasks.md` — plano de implementação **faseado, com checkboxes**, rastreando cada task a um requisito/spec. Ordem: foundation → design tokens → layout/shell → componentes base → seções → segurança → QA → CI/CD.

**Ao terminar a Fase 1, apresente um resumo e aguarde aprovação.**

### Fase 2 — Fundação
Scaffold do projeto (Seção 5), tokens de design no código, layout base (shell, nav, footer, theme toggle), componentes primitivos reutilizados 3+ vezes (Card, Button, Badge, Tag, SectionHeading, Pill). Preview local funcionando.

### Fase 3 — Seções
Implemente cada seção conforme `specs/sections/*.md` e `specs/tasks.md`, consumindo `linkedin.json` de forma tipada. Uma seção por vez; cada uma responsiva e acessível antes de seguir.

### Fase 4 — Endurecimento de segurança
Aplique todos os controles do `specs/security.md` (Seção 7). Rode auditoria de dependências e valide a CSP.

### Fase 5 — QA, performance e acessibilidade
Lighthouse (4×100), axe/WCAG 2.2 AA, teste responsivo (mobile→ultrawide), `prefers-reduced-motion`, teste de dark/light, links externos, verificação de que nenhum dado sensível vazou.

### Fase 6 — CI/CD e deploy
GitHub Actions: build + checagens (typecheck, lint, `npm audit`, validação de schema, Lighthouse CI opcional) → deploy no GitHub Pages. Documente no `README.md`.

---

## 5. Stack mandatória (registre como ADR-0001)

**Astro (última versão estável) + TypeScript strict.** Justificativa: static-first (zero JS por padrão → performático e menor superfície de ataque), content collections tipadas (encaixam nos nossos JSON), islands para animações pontuais, deploy trivial no GitHub Pages, e alinhado a "minimalista + profissional".

- **Linguagem:** TypeScript `strict`. Sem `any` implícito.
- **Estilo:** CSS moderno com **custom properties** (design tokens) + `@layer`. Tailwind v4 é **opcional** e só se mantiver o CSS enxuto; prefira minimizar dependências (argumento de segurança). Um único arquivo de tokens (`src/styles/tokens.css`) é a fonte.
- **Dados:** Astro **content collections / loaders** com **validação Zod** de `data/linkedin.json` em build. Zero fetch em runtime.
- **Fontes:** **auto-hospedadas** (via `@fontsource` ou woff2 local). **Proibido** Google Fonts CDN ou qualquer host externo (privacidade + CSP `'self'`). Escolha guiada pela skill/refs (ex.: Inter + Manrope; opção display).
- **Ícones:** set local (ex.: `astro-icon` com pacote instalado localmente) — nada de CDN.
- **Animações:** CSS + **View Transitions** nativas do Astro + uma lib mínima e auto-hospedada só se necessário (ex.: Motion One ~5kb) numa island. **Sempre** respeitar `prefers-reduced-motion`. Sem bibliotecas pesadas (sem GSAP/Framer a menos que justificado em ADR).
- **Imagens:** usar o `<Image>` do Astro (otimização/formatos modernos, dimensões explícitas → zero CLS).
- **Sem** analytics de terceiros por padrão. Se o Pablo quiser métricas, propor solução privacy-first e auto-hospedada, e só com aprovação.
- **Gerência de deps:** lockfile commitado, versões pinadas, `package.json` mínimo, Dependabot ligado.

> Se você tiver forte justificativa para outra stack estática igualmente adequada (ex.: Eleventy), registre a alternativa no ADR e só troque com aprovação. O default é Astro.

---

## 6. Arquitetura de informação (seções → dados)

Ordem e mapeamento (todo conteúdo de `data/linkedin.json`):

1. **Hero** — `profile.fullName`, `profile.headline`, um subtítulo curto derivado de `about.summary`; CTAs: Contato, GitHub (`profile.contact.github`), LinkedIn, e "Currículo/Résumé". Estética terminal/gradiente. Inclua, de forma elegante e opcional, o **easter egg** de `about.easterEgg` (bloco estilo `root@kali`) — combina com a persona.
2. **Sobre** — `about.summary` + `about.experiencia`/`conhecimento`/`habilidades`. Renderize a **stack como pills inline** (estilo Mohit Singh) usando `about.conhecimento`/`topSkills`.
3. **Capacidades/Skills** — agrupe por domínio (SOC, AppSec/DevSecOps, Ofensiva, Frameworks) a partir de `skills`/`about.conhecimento`. Layout bento ou grid de cards com ícone.
4. **Experiência** — `experience[]` como **timeline** (logo/《inicial》da empresa, cargo, período, bullets em expand/collapse). Marque o cargo atual (`current: true`).
5. **Formação** — `education[]` (destacar pós Acadi-TI e Fatec).
6. **Projetos & Pesquisa** — `projects[]` (artigo científico + palestras/minicursos) como cards com contribuidores e links para as `publications` relacionadas.
7. **Certificações** — galeria a partir de `certifications.downloadedDocuments.files[]` (imagens em `img/certificados/linkedin/`). Filtro por emissor (`certifications.items[]`), **lightbox/modal** ao clicar, e tratamento visual para `lowRes: true` (não ampliar demais). Inclua também os 8 de `certificateImagesInRepo` com seus `verifyUrl`. Mostre contadores (ex.: "44 documentos, 30+ certificações").
8. **Publicações (LinkedIn)** — `publications[]` como **cards estilo post** (título, descrição resumida, data formatada de `date`, `category` como badge, `engagement`), cada card **linka para `permalink`** e abre em nova aba com `rel="noopener noreferrer"`. Destaque os `featured: true`. As 11 imagens **já estão baixadas** em `img/linkedin/<id>.jpg` (`imageStatus: "downloaded"`, ~800px) — use-as como capa dos cards. **Não hotlinkar** URLs do LinkedIn (as originais são assinadas e expiram).
9. **Contato** — `profile.contact` (email, GitHub, LinkedIn). Preferir **`mailto:`** (sem terceiros). Se quiser formulário, propor serviço privacy-first e só com aprovação. Nada de expor o email em texto puro de forma trivialmente coletável (ofusque ou monte via JS acessível).
10. **Footer** — links, `security.txt`, "built with", ano automático, e uma nota discreta de que o site é open-source/auditável (link do repo).

Idiomas: **PT-BR** como padrão (público principal). Deixe a arquitetura pronta para i18n EN futuro (o Pablo tem EN básico-intermediário) mas **não** construa a versão EN agora a menos que pedido.

---

## 7. Requisitos de segurança (o site é o cartão de visitas de um profissional de segurança)

Documente tudo em `specs/security.md` com checklist verificável. Controles mínimos:

- **Content Security Policy** o mais restrita possível via `<meta http-equiv="Content-Security-Policy">`: `default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests`. Sem `'unsafe-inline'`/`'unsafe-eval'`. Use o suporte a **CSP do Astro** (gera hashes para estilos/scripts) e evite inline não-hasheado. Documente que `frame-ancestors` via meta é limitado e que clickjacking real exigiria header/CDN.
- **Zero recursos de terceiros:** fontes, ícones, imagens, scripts — tudo auto-hospedado. `default-src 'self'` deve realmente funcionar.
- **Sanitização:** todo conteúdo do JSON é renderizado como **texto** (nunca `set:html`/`innerHTML` com dado). Se precisar de markdown, use um renderer com sanitização e allowlist.
- **Links externos:** sempre `rel="noopener noreferrer"` e `target="_blank"` onde aplicável.
- **`/.well-known/security.txt`** (RFC 9116) com `Contact:` (email do Pablo), `Expires:`, `Preferred-Languages: pt, en`. Sirva também em `/security.txt`.
- **Higiene de dependências:** lockfile commitado, versões pinadas, `npm audit` no CI (falha em `high`/`critical`), **Dependabot** (`.github/dependabot.yml`), superfície mínima de deps. Opcional: gerar SBOM (CycloneDX) no CI.
- **Sem segredos** no repo; `.gitignore` correto; sem tokens, sem `.env` versionado.
- **Metadados de privacidade:** `<meta name="referrer" content="strict-origin-when-cross-origin">`, `Permissions-Policy` via meta onde suportado (desligar geolocation, camera, microphone, etc.).
- **Sem vazar dados sensíveis:** os certificados/diploma já vêm com CPF/CNH borrados pelo LinkedIn — **verifique** que nenhuma imagem exposta contém PII legível antes de publicar.
- **Integridade de build:** CI reproduzível; opcional commitar hashes/artefatos. Documente a limitação de headers do GitHub Pages e a opção de Cloudflare para HSTS/headers reais.
- Adicione um `SECURITY.md` no repo (política de disclosure) — apropriado para o perfil.

---

## 8. Qualidade: performance, acessibilidade, SEO

- **Lighthouse ≥ 100** em Performance, Acessibilidade, Best Practices e SEO (mobile e desktop). Zero CLS.
- **WCAG 2.2 AA:** HTML semântico, landmarks, foco visível, navegação por teclado, contraste (validar acento nos dois temas), `aria` só quando necessário, alt em imagens, `prefers-reduced-motion` desliga animações não essenciais.
- **SEO/social:** `<title>`/meta description por página, Open Graph + Twitter Card (gerar uma **OG image** própria — pode ser um card estático bonito), `lang="pt-BR"`, canonical, `sitemap.xml`, `robots.txt`, favicon (multi-tamanho) e web manifest.
- **Performance:** CSS crítico inline (hasheado p/ CSP), JS mínimo (idealmente só o toggle de tema + island de animação), imagens otimizadas com dimensões, fontes com `font-display: swap` e preload das essenciais.
- **Responsivo:** de ~320px a ultrawide. Mobile-first.

---

## 9. Estrutura de projeto alvo (organize assim)

```
portfolio/
├─ specs/                      # SDD — fonte da verdade
│  ├─ README.md
│  ├─ product-requirements.md
│  ├─ architecture.md          # ADRs
│  ├─ content-model.md
│  ├─ design-system.md
│  ├─ security.md
│  ├─ tasks.md
│  └─ sections/*.md
├─ design-system/              # saída da skill ui-ux-pro-max
│  └─ MASTER.md
├─ src/
│  ├─ data/                    # linkedin.json (movido/importado) + schemas Zod
│  ├─ content/                 # collections (se usadas)
│  ├─ styles/                  # tokens.css + globals
│  ├─ components/              # primitivos + de seção
│  │  ├─ ui/                   # Card, Button, Badge, Tag, Pill, ThemeToggle...
│  │  └─ sections/             # Hero, About, Experience, Certifications...
│  ├─ layouts/
│  ├─ lib/                     # utils (formatar datas, agrupar certs...)
│  └─ pages/                   # index.astro (+ i18n futuro)
├─ public/
│  ├─ img/                     # foto, certificados (movidos p/ cá)
│  ├─ fonts/                   # fontes auto-hospedadas
│  ├─ .well-known/security.txt
│  ├─ robots.txt
│  └─ favicon...
├─ .github/
│  ├─ workflows/deploy.yml     # build + checks + Pages
│  └─ dependabot.yml
├─ astro.config.mjs            # site + base '/portfolio'
├─ tsconfig.json               # strict
├─ SECURITY.md
├─ README.md                   # como rodar, arquitetura, deploy, segurança
└─ PORTFOLIO_BUILD_PROMPT.md   # este arquivo (preserve)
```

**Preserve** `data/`, `img/`, este prompt e os specs ao reorganizar. Mova assets para os locais do Astro sem perder os originais/histórico.

---

## 10. Definition of Done (critérios de aceite)

- [ ] Fase 1 (specs) escrita, coerente e **aprovada** antes do código.
- [ ] `design-system/MASTER.md` gerado pela skill e conciliado com nosso brief.
- [ ] Site estático buildando com `base:'/portfolio'`, deploy no GitHub Pages via Actions.
- [ ] Todo conteúdo vem de `data/linkedin.json` (validado por Zod em build); nada inventado.
- [ ] Dark padrão + toggle Light persistente; UMA cor de acento; secundárias só em status.
- [ ] Todas as seções da Seção 6 implementadas, responsivas e acessíveis.
- [ ] Galeria de certificados com lightbox e tratamento de `lowRes`; cards de publicação linkando ao `permalink`.
- [ ] Todos os controles do `specs/security.md` aplicados; CSP restrita funcionando; `security.txt` + `SECURITY.md` presentes; `npm audit` limpo no CI; zero recursos de terceiros.
- [ ] Lighthouse 4×100; WCAG 2.2 AA; `prefers-reduced-motion` respeitado; zero CLS.
- [ ] OG image, sitemap, robots, favicon, manifest.
- [ ] `README.md` documentando arquitetura, como rodar, deploy e postura de segurança (incluindo as limitações do GitHub Pages).
- [ ] Sem PII legível exposta; sem segredos no repo.

---

## 11. Guardrails (o que NÃO fazer)

- Não usar CDNs de terceiros (fontes/ícones/scripts). Auto-hospede tudo.
- Não hotlinkar imagens do LinkedIn (URLs assinadas que expiram) — use placeholder até baixarmos.
- Não inserir dado do JSON via `innerHTML`/`set:html` sem sanitização.
- Não inventar conteúdo, métricas ou certificações. Faltou? Vira TODO + pergunta.
- Não adicionar analytics/trackers sem aprovação explícita.
- Não pular a fase de specs "pra ganhar tempo". Specs primeiro.
- Não quebrar o `base` path do GitHub Pages com caminhos absolutos.
- Não introduzir dependências pesadas sem ADR justificando.

---

**Comece pela Fase 0** (ler os dados + instalar/rodar a skill `ui-ux-pro-max`), depois escreva os specs da Fase 1 e **pare para revisão**.
