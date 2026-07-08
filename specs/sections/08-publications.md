# Seção 8 — Publicações (LinkedIn)

**Propósito.** Presença e engajamento na comunidade: 11 posts como cards estilo feed,
linkando para o LinkedIn (REQ-F04).

**Dados.** `publications[]`: title, description (resumida ~180 chars com corte em
palavra + "…"), `date` formatada pt-BR ("6 de jul de 2026"), `category` → Badge
(mapa fixo: certification=accent, achievement=ok, career=neutral, speaking=info,
research=info, lab=warn — únicos usos de cor de status fora de status real; manter
discreto), `engagement` (reactions/comments quando não-null, ícones + mono),
`featured`, capa local `img/linkedin/<id>.jpg` via `<Image>` (nunca hotlink — garantido
pelo schema `imageStatus: 'downloaded'`).

**Layout.** Grid 3 col ≥1100px / 2 col ≥700px / 1 col mobile.
- Os 4 `featured: true` primeiro, com card maior (capa 16:9); demais com capa menor.
  Ordem interna: data desc (já é a ordem do JSON — manter ordem do array).
- Card: capa, badge de categoria, título (h3, 2 linhas max), descrição truncada, rodapé
  com data (`<time>`) + engajamento (♥ N · 💬 N como ícones SVG + número mono).
- Card inteiro é `<a>` para `permalink` (`target="_blank" rel="noopener noreferrer"`),
  com `aria-label` "Abrir publicação no LinkedIn: {title}".
- CTA final ghost: "Ver todas no LinkedIn ↗" → `profile.profileUrl` + `/recent-activity/`? **Não** — usar `profileUrl` puro (não inventar rota).

**A11y.** Um link por card (sem links aninhados); engajamento com `aria-label`
("13 reações, 1 comentário").

**Animação.** Reveal com stagger; hover: borda forte + translateY(-2px).
