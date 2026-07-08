# Seção 6 — Projetos & Pesquisa

**Propósito.** As duas frentes de maior autoridade: artigo científico (ML × ransomware)
e o minicurso/palestra de AppSec (SSDLC) — com trilha para as publicações (US-03).

**Dados.** `projects[]` (2 itens), `speaking[]` (2 itens), resolução
`relatedPublications[]` → `publications[]` (title/permalink/date).

**Layout.** 2 cards grandes lado a lado (≥900px):
- Badge `info` com `category` ("Artigo Científico" / "Palestras e Minicursos").
- Nome (h3), descrição completa (texto do JSON), contribuidores como linha mono
  ("com Rafael Alves Vanzella · orient. Thiago José Lucas, Ph.D."), `skills[]` como Tags.
- Card do artigo destaca a métrica presente no texto (−41,96% tempo de processamento)
  como stat grande (número Space Grotesk + legenda) — o número vem do texto do JSON.
- Rodapé: links "Ver publicação no LinkedIn ↗" para cada publicação relacionada
  (resolvida por URN; noopener). Para o projeto de palestras, sublista dos 2 eventos de
  `speaking[]` (evento, host, data formatada).

**A11y.** Links externos anunciam destino ("no LinkedIn"); h3 por card.

**Animação.** Reveal padrão; stat sem count-up (dado textual, não numérico confiável para animar).
