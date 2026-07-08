# Seção 4 — Experiência

**Propósito.** Trajetória profissional como timeline vertical (Mohit Singh), atual no topo.

**Dados.** `experience[]` na ordem do JSON (já decrescente). Por item: `title`, `company`,
`employmentType`, `workplace`, `location`, `startDate`/`endDate` (formatadas
"out 2025 — atual" via `src/lib/dates.ts`, pt-BR), `current`, `bullets[]`, `skills[]`.

**Layout.** Timeline vertical: linha 2px `--border` à esquerda com dot por item (dot do
atual em `--ok` com halo `--accent-soft`); "logo" = avatar circular com inicial da
empresa (mono, `--bg-raised-2`) — não temos logos licenciados, não inventar.
Card por item: header (cargo em h3, empresa + tipo + workplace em `--text-2`, período em
mono `--text-3` à direita), badge `Badge tone=ok dot` "Atual" quando `current`.

**Expand/collapse (REQ-F09).** Itens com >4 bullets: renderizar 3 + `<details>` nativo
com `<summary>` "Ver todas as N atividades" (estilizado como botão ghost; funciona sem JS).
Duração da transição via `interpolate-size`/grid-rows com fallback instantâneo.

`skills[]` do item como `Tag`s no rodapé do card.

**A11y.** `<ol>` semântico para a timeline; datas com `<time datetime>`; `<details>` é
nativamente acessível.

**Animação.** Reveal por item (stagger); dot atual pulsa sutil (reduced-motion: não).
