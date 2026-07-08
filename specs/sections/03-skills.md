# Seção 3 — Capacidades (Skills)

**Propósito.** Mostrar os domínios de competência com hierarquia clara — o gestor de SOC
valida profundidade aqui (US-02).

**Dados.** Agrupamento determinístico definido em `content-model.md` §Agrupamento:
4 domínios (SOC & Defesa, AppSec & DevSecOps, Segurança Ofensiva, Frameworks & Base) a
partir de `about.conhecimento[]` + `about.experiencia[]` + `skills[]`.

**Layout.** **Bento-grid** (Zento): 4 cards em grid 2×2 (≥900px; 1 coluna mobile), o
card SOC & Defesa maior (col-span 2 em ≥1200px — é o cargo atual).
Cada card: ícone (`Icon`: shield/code/target/layers), título h3, texto do domínio,
rodapé com `Tag`s das ferramentas citadas no texto (extraídas literalmente do JSON:
Wazuh, Rapid7, Octopus, Jira, Snyk, OWASP ZAP, Horusec, GitHub Actions, Jenkins, Python…
— derivadas por parse simples das strings, sem inventar).
Um **status card SOC** (Crontap) decorativo no canto do bento: `SEV-INFO · monitoring ·
uptime 24/7` — rotulado como ilustrativo via `aria-hidden` (não é dado real).

**A11y.** Cards não-clicáveis (sem cursor pointer); h3 por card; lista de tags como `<ul>`.

**Animação.** Reveal com stagger por card.
