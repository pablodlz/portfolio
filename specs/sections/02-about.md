# Seção 2 — Sobre

**Propósito.** Aprofundar quem é o Pablo: resumo, o que faz no dia a dia, stack como
pills inline (Mohit Singh), idiomas e prova social (recomendações).

**Dados.** `about.summary`, `about.experiencia[]`, `about.habilidades[]`, `topSkills[]`,
`profile.languages[]`, `profile.profileImageLocal` (foto), `profile.location`,
`recommendationsReceived.highlighted[]` (2 depoimentos) e `.total`.

**Layout.** Grid 2 colunas ≥900px:
- Coluna A (maior): summary em `--fs-body-lg`; parágrafo "No dia a dia" com os itens de
  `experiencia` como lista; linha de **tech pills inline** com `topSkills` (componente `Tag`).
- Coluna B (card de perfil, estilo Zento): foto (`<Image>`, 1:1, radius `--radius-lg`),
  nome curto, `role`, badge dot `--ok` "Na ativa @ Clavis", tags: localização, idiomas
  (`Português — nativo`, `English — básico/intermediário`), soft skills (`habilidades`)
  como tags neutras.
- Abaixo, 2 cards de recomendação (blockquote + autor + cargo) + nota mono `+5 outras no LinkedIn`
  (derivada: `total - highlighted.length`) linkando o perfil.

**A11y.** `<blockquote>`/`<cite>` semânticos; foto com alt "Foto de Pablo Galerani".

**Animação.** Reveal padrão da seção; pills sem animação individual.
