# Seção 5 — Formação

**Propósito.** Formação acadêmica com destaque para o que importa ao público-alvo:
pós em Cibersegurança Ofensiva (Acadi-TI) e tecnólogo em SI (Fatec).

**Dados.** `education[]`; destaque = os 2 primeiros (Acadi-TI, Fatec). Complemento:
`about.certificacoesEmAndamento[]` e `about.metasFuturas[]` como card lateral "Radar de
certificações".

**Layout.**
- 2 cards grandes (destaque): instituição, grau + área (h3), anos em mono, descrição
  **resumida por truncamento com `<details>`** ("Ver ementa completa") — as descrições são longas.
  Badge `accent` "Pós-graduação" / "Tecnólogo".
- Demais 4 itens: lista compacta (grid 2 col): instituição, grau/área, anos. Sem descrição
  (disponível no LinkedIn; manter a página enxuta — decisão de escopo, não de dado).
- **Card "Radar de certificações"** (linguagem SOC): lista mono com badge de status por
  item — `concluída` ⇒ `Badge ok`, `em andamento` ⇒ `Badge warn`; abaixo, `metasFuturas`
  como tags neutras com prefixo "alvo:". Fonte: `about.certificacoesEmAndamento`/`metasFuturas`.

**A11y.** `<time>` nos anos; details acessível.

**Animação.** Reveal padrão.
