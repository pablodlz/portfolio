# Seção 10 — Footer (+ Nav)

## Footer

**Propósito.** Encerramento com transparência de engenharia — reforça a persona.

**Dados/conteúdo.**
- Coluna 1: shortName + role; © ano automático (build-time `new Date()`).
- Coluna 2 (nav secundária): âncoras das seções.
- Coluna 3 (meta): links GitHub/LinkedIn/E-mail (mesmo mecanismo ofuscado);
  `security.txt` (link real p/ `/.well-known/security.txt` respeitando base);
  "Política de segurança" → SECURITY.md no GitHub; "Código-fonte deste site ↗" →
  `https://github.com/pablodlz/portfolio` (repo público — auditável).
- Linha final mono: `built with Astro · 0 trackers · CSP strict · feito em Jacarezinho-PR`
  (as três afirmações têm de ser verdadeiras no deploy — checklist security.md).

**A11y.** `<footer role="contentinfo">`; nav secundária com `aria-label="Rodapé"`.

## Nav (topo — especificada aqui por ser shell, não seção)

- Fixa (sticky) com fundo `--bg` translúcido + `backdrop-filter: blur(8px)` e borda
  inferior `--border` ao rolar (sem blur se reduced-transparency? — manter simples: blur ok).
- Esquerda: monograma "pg_" em mono (link p/ topo). Direita: âncoras (Sobre, Skills,
  Experiência, Certificações, Publicações, Contato) + ThemeToggle.
- Mobile (<760px): âncoras colapsam em `<details>` dropdown nativo estilizado (sem JS de menu);
  ThemeToggle permanece visível.
- Skip-link antes de tudo. Âncoras com `scroll-margin-top` compensando a nav.
- Scroll suave global via CSS `scroll-behavior: smooth` (desligado em reduced-motion) — REQ-F03.
