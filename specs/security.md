# Security Spec — threat model e controles

O site é o cartão de visitas de um profissional de segurança: a postura precisa ser
**real, verificável e honestamente documentada** (inclusive limitações do GitHub Pages).

## 1. Threat model (STRIDE aplicado a um site estático)

| Ameaça | Vetor concreto aqui | Mitigação |
|---|---|---|
| **S**poofing | Página clonada/iframada para phishing usando a marca do Pablo | `frame-ancestors 'none'` na CSP (limitado via meta — documentado), links canônicos, security.txt com contato oficial |
| **T**ampering | Comprometimento da cadeia de build (dep maliciosa, action comprometida) | lockfile commitado + versões pinadas, `npm audit` falhando CI em high/critical, Dependabot, actions pinadas por major oficial, superfície mínima de deps (ADR-0001/0006) |
| **R**epudiation | (baixa relevância) alterações sem rastro | histórico git + deploy só via Actions a partir de `main` |
| **I**nfo disclosure | PII em certificados (CPF/CNH), e-mail coletável por bots, vazamento de segredos | revisão visual das 52 imagens antes do deploy (checklist), e-mail montado via JS acessível (nunca texto contíguo), `.gitignore` para `.env`/segredos, zero analytics |
| **D**oS | (fora de controle — GitHub Pages) | n/a; documentado |
| **E**levation of privilege | XSS via conteúdo do JSON interpolado | **todo** dado renderizado como texto (templates Astro escapam por padrão); `set:html` proibido com dado; CSP sem `unsafe-inline` como segunda camada |

Supply chain é o risco nº 1 real deste projeto — por isso o orçamento de dependências
do ADR e o gate de audit no CI.

## 2. Controles obrigatórios

### CSP (via `<meta http-equiv="Content-Security-Policy">`)

Política alvo:

```
default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'sha256-…';
script-src 'self' 'sha256-…'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';
object-src 'none'; upgrade-insecure-requests
```

- Sem `unsafe-inline`/`unsafe-eval`. Estilos/scripts inline que o Astro emitir são
  **hasheados** via suporte de CSP do Astro (`experimental.csp` ou hashes manuais
  gerados no build — o que se provar estável); o script de tema no `<head>` entra por hash.
- **Limitações documentadas (não fingir):** em `<meta>` CSP, `frame-ancestors` e
  `report-uri` **são ignorados pelos browsers**, e não há como enviar `X-Frame-Options`,
  `HSTS`, `X-Content-Type-Options` ou `Referrer-Policy` de servidor no GitHub Pages.
  Proteção real de clickjacking/HSTS exigiria um CDN na frente (ex.: Cloudflare).
  O README e este spec declaram isso explicitamente; a diretiva fica na política como
  declaração de intenção + defesa onde meta for respeitada.

### Rede e recursos

- [ ] Zero recursos de terceiros: fontes/ícones/scripts/imagens 100% self-hosted (`default-src 'self'` funcional de fato).
- [ ] Nenhum fetch em runtime; nenhuma imagem hotlinkada do LinkedIn (URLs assinadas expiram).
- [ ] Links externos: `rel="noopener noreferrer"` (+ `target="_blank"` onde abre fora).

### Conteúdo e dados

- [ ] Nenhum uso de `set:html`/`innerHTML` com dado do JSON (grep no CI manual de QA).
- [ ] E-mail ofuscado: montado por script a partir de `data-user`/`data-domain` invertidos; fallback `<noscript>` com e-mail com imagem/entidades — nunca `mailto:` estático no HTML.
- [ ] Revisão de PII: inspecionar as 44 + 8 imagens de certificado publicadas (LinkedIn já borra CPF/CNH — confirmar uma a uma no QA).
- [ ] Sem segredos no repo; `.gitignore` cobre `.env*`, `node_modules`, `dist`.

### Metadados de privacidade

- [ ] `<meta name="referrer" content="strict-origin-when-cross-origin">`.
- [ ] `Permissions-Policy` não é suportado via meta — **não incluir** tag inócua; documentar no README (honestidade > teatro). Nenhuma API sensível é usada de qualquer forma.

### Divulgação e política

- [ ] `/.well-known/security.txt` **e** `/security.txt` (RFC 9116): `Contact: mailto:pablogalerani@gmail.com`, `Expires:` +1 ano, `Preferred-Languages: pt, en`, `Canonical:` URL do arquivo no site.
- [ ] `SECURITY.md` no repo: escopo, como reportar, prazo de resposta, agradecimento.

### Cadeia de build

- [ ] `package-lock.json` commitado; deps com versão exata ou range patch (`~`)/minor controlado.
- [ ] CI: `npm ci` (nunca `install`), `npm audit --audit-level=high` como gate.
- [ ] `.github/dependabot.yml`: npm semanal + github-actions semanal.
- [ ] Actions oficiais pinadas por versão major (`actions/checkout@v4` etc.).

## 3. Checklist de verificação pré-deploy (QA da Fase 4/5)

- [ ] DevTools Network: 0 requests fora de `pablodlz.github.io` (após load completo e interações).
- [ ] Console: 0 violações de CSP navegando e usando lightbox/filtros/tema.
- [ ] `curl` do HTML publicado: CSP presente, sem `unsafe-*`; scripts todos `self`/hash.
- [ ] Página iframada num sandbox de teste → documentar comportamento real (meta não bloqueia; anotado como limitação).
- [ ] `npm audit` limpo (≥ high) na data do deploy.
- [ ] security.txt acessível nas duas rotas com `Expires` futuro.
- [ ] Grep de segredos (`gitleaks`-style manual): tokens/keys/emails inesperados.
- [ ] Todas as imagens de certificado revisadas para PII legível.
