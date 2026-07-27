# Seção 6 — Projetos & Pesquisa

**Propósito.** As duas frentes de maior autoridade: artigo científico (ML × ransomware)
e o minicurso/palestra de AppSec (SSDLC) — com trilha para as publicações (US-03).

**Dados.** `projects[]` (2 itens), `speaking[]` (2 itens), resolução
`relatedPublications[]` → `publications[]` (title/permalink/date).

**Layout.** Três blocos, nesta ordem — destaque, grade, saída.

**1 · Destaque (fora do `linkedin.json`).** O projeto autoral **Omni Pentest**, que tem página
própria em `/omni-pentest`. Card-link de largura inteira, borda e fundo de acento, com o brasão
(`img/omni-pentest/logo.png`) no lugar do ícone genérico, badge "Projeto autoral", a versão
retratada (`OMNI_VERSION`) e CTA "Conhecer o projeto ↗". Não vem do LinkedIn e por isso não entra
no JSON curado (ADR-0004). ✍️ No texto o produto chama-se **Omni Pentest**, sem hífen — o hífen é
só do repositório e da rota.

**2 · Grade.** 2 cards grandes lado a lado (≥900px):
- Badge `info` com `category` ("Artigo Científico" / "Palestras e Minicursos").
- Nome (h3), descrição completa (texto do JSON), contribuidores como linha mono
  ("com Rafael Alves Vanzella · orient. Thiago José Lucas, Ph.D."), `skills[]` como Tags.
- Card do artigo destaca a métrica presente no texto (−41,96% tempo de processamento)
  como stat grande (número Space Grotesk + legenda) — o número vem do texto do JSON.
- Rodapé: links "Ver publicação no LinkedIn ↗" para cada publicação relacionada
  (resolvida por URN; noopener). Para o projeto de palestras, sublista dos 2 eventos de
  `speaking[]` (evento, host, data formatada).

**3 · Saída.** Último bloco da seção: faixa-link "Ver todos os projetos no GitHub", apontando para
`profile.contact.github`. Ícone do GitHub + título + uma linha de contexto citando
`@{githubUser}`, seta à direita. Fica **fora** da `.proj-grid` de propósito — como terceiro item de
uma grade de duas colunas ele sentaria sozinho numa linha e leria como "um projeto que sobrou".
Borda neutra, sem o realce de acento do destaque: é um caminho, não um trabalho.

**A11y.** Links externos anunciam destino ("no LinkedIn"); h3 por card. Os dois cards-link inteiros
(destaque e saída) desligam o `text-decoration: underline` global do `a:hover` — a afordância deles
é a borda que acende e a seta que anda, e um sublinhado riscaria o cartão inteiro.

**Animação.** Reveal padrão; stat sem count-up (dado textual, não numérico confiável para animar).
